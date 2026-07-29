import os
import time
import logging
import datetime
from typing import Any
from google import genai
from google.genai import types

from genblaze_core import Step, Modality, Asset
from genblaze_core.providers import SyncProvider
from genblaze_core._utils import local_file_url
import tempfile
import datetime

logger = logging.getLogger(__name__)

class GoogleProvider(SyncProvider):
    """
    Custom Genblaze provider that utilizes the modern `google-genai` SDK.
    Supports Nano Banana (Image) and Veo 3.1 (Video) via `generateContent`.
    """
    
    name = "google-genai-custom"
    
    def __init__(self, api_key: str | None = None, event_callback=None):
        super().__init__()
        self._api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self._client = genai.Client(api_key=self._api_key)
        self.event_callback = event_callback

    def generate(self, step: Step, config: Any = None) -> Step:
        """Execute the generation synchronously."""
        logger.info(f"[{step.modality.name.title()}] Model={step.model} Started")
        start_time_ts = time.time()
        start_iso = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
        
        # 1. Route to the correct request builder
        if step.modality == Modality.IMAGE:
            response = self._build_and_execute_image(step)
        elif step.modality == Modality.VIDEO:
            response = self._build_and_execute_video(step)
        else:
            # Fallback for LLM planning if needed
            response = self._build_and_execute_text(step)
            
        latency_ms = int((time.time() - start_time_ts) * 1000)
        end_iso = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
        
        logger.info(f"[{step.modality.name.title()}] Completed {latency_ms/1000:.1f} sec")

        # 2. Parse the response robustly
        assets = self._parse_response(response, step)
        
        # 3. Add metadata to assets
        for asset in assets:
            if not asset.metadata:
                asset.metadata = {}
            asset.metadata.update({
                "provider": self.name,
                "model": step.model,
                "latency_ms": latency_ms,
                "asset_size_bytes": getattr(asset, "size_bytes", 0) or len(asset.raw_bytes) if hasattr(asset, "raw_bytes") and asset.raw_bytes else 0, # Note: ObjectStorageSink might overwrite this, or we can get it from the parse
                "mime_type": asset.media_type,
                "generation_started_at": start_iso,
                "generation_completed_at": end_iso,
                "storage_backend": "Backblaze B2"
            })
            step.assets.append(asset)
            
        return step

    def _build_and_execute_image(self, step: Step) -> Any:
        # We can extract config like aspect_ratio from step.prompt if needed, 
        # but for this hackathon we keep it simple or default.
        return self._client.models.generate_content(
            model=step.model,
            contents=step.prompt
        )

    def _build_and_execute_video(self, step: Step) -> Any:
        operation = self._client.models.generate_videos(
            model=step.model,
            prompt=step.prompt
        )
        
        op_name = operation.name
        logger.info(f"[Video] Operation={op_name}")
        if self.event_callback:
            self.event_callback("video.started", {"operation": op_name})
            
        start_t = time.time()
        MAX_WAIT = 300
        
        while not operation.done:
            elapsed = int(time.time() - start_t)
            if elapsed > MAX_WAIT:
                logger.error(f"[Video] Operation timeout. Elapsed: {elapsed} sec. Status: FAILED")
                if self.event_callback:
                    self.event_callback("video.failed", {"detail": "Timeout exceeded", "elapsed": elapsed})
                raise TimeoutError(f"Video generation exceeded {MAX_WAIT} seconds")
                
            logger.info(f"[Video] Polling... (elapsed: {elapsed}s)")
            if self.event_callback:
                self.event_callback("video.poll", {"elapsed": elapsed, "operation": op_name})
            
            time.sleep(10)
            
            retries = 3
            for attempt in range(retries):
                try:
                    operation = self._client.operations.get(operation=operation)
                    break
                except Exception as e:
                    if attempt == retries - 1:
                        logger.error(f"[Video] Transient error retry exhausted. Elapsed: {elapsed} sec. Retries: {retries}. Status: FAILED")
                        raise
                    time.sleep(2 ** attempt) # Exponential backoff
            
        if operation.error:
            raise ValueError(f"Video generation failed: {operation.error}")
            
        return operation.response
        
    def _build_and_execute_text(self, step: Step) -> Any:
        return self._client.models.generate_content(
            model=step.model,
            contents=step.prompt
        )

    def _parse_response(self, response: Any, step: Step) -> list[Asset]:
        assets = []
        
        if hasattr(response, 'candidates') and response.candidates:
            candidate = response.candidates[0]
            if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                for part in candidate.content.parts:
                    if getattr(part, 'inline_data', None):
                        mime = part.inline_data.mime_type
                        data = part.inline_data.data
                        suffix = ".jpeg" if "jpeg" in mime else ".png"
                        fd, tmp = tempfile.mkstemp(suffix=suffix)
                        os.write(fd, data)
                        os.close(fd)
                        from pathlib import Path
                        file_url = local_file_url(Path(tmp).resolve())
                        asset = Asset(
                            url=file_url,
                            media_type=mime
                        )
                        asset.size_bytes = len(data)
                        assets.append(asset)
                    # Handle text outputs (LLM steps)
                    elif getattr(part, 'text', None):
                        fd, tmp = tempfile.mkstemp(suffix=".txt")
                        text_bytes = part.text.encode('utf-8')
                        os.write(fd, text_bytes)
                        os.close(fd)
                        from pathlib import Path
                        file_url = local_file_url(Path(tmp).resolve())
                        asset = Asset(
                            url=file_url,
                            media_type="text/plain"
                        )
                        asset.size_bytes = len(text_bytes)
                        assets.append(asset)
                        
        elif hasattr(response, 'generated_videos') and response.generated_videos:
            for video in response.generated_videos:
                if hasattr(video, 'video') and hasattr(video.video, 'uri'):
                    try:
                        # Use the SDK download API which handles auth and sets video_bytes
                        video_bytes = self._client.files.download(file=video.video)
                    except Exception as e:
                        logger.warning(f"Failed to download using client.files.download: {e}")
                        raise ValueError(f"Could not download video asset: {e}")
                        
                    mime = getattr(video.video, 'mime_type', 'video/mp4')
                    fd, tmp = tempfile.mkstemp(suffix=".mp4")
                    os.write(fd, video_bytes)
                    os.close(fd)
                    from pathlib import Path
                    file_url = local_file_url(Path(tmp).resolve())
                    asset = Asset(
                        url=file_url,
                        media_type=mime
                    )
                    asset.size_bytes = len(video_bytes)
                    logger.info(f"[Video] Downloaded {asset.size_bytes / 1024 / 1024:.1f} MB")
                    assets.append(asset)
                        
        if not assets:
            raise ValueError(f"No usable output found in Google GenAI response: {response}")
            
        return assets
