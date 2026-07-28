import os
import time
from typing import Any
from google import genai
from google.genai import types

from genblaze_core import Step, Modality, Asset
from genblaze_core.providers import SyncProvider
from genblaze_core._utils import local_file_url
import tempfile
import datetime

class GoogleProvider(SyncProvider):
    """
    Custom Genblaze provider that utilizes the modern `google-genai` SDK.
    Supports Nano Banana (Image) and Veo 3.1 (Video) via `generateContent`.
    """
    
    name = "google-genai-custom"
    
    def __init__(self, api_key: str | None = None):
        super().__init__()
        self._api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self._client = genai.Client(api_key=self._api_key)

    def generate(self, step: Step, config: Any = None) -> Step:
        """Execute the generation synchronously."""
        start_time_ts = time.time()
        start_iso = datetime.datetime.utcnow().isoformat() + "Z"
        
        # 1. Route to the correct request builder
        if step.modality == Modality.IMAGE:
            response = self._build_and_execute_image(step)
        elif step.modality == Modality.VIDEO:
            response = self._build_and_execute_video(step)
        else:
            # Fallback for LLM planning if needed
            response = self._build_and_execute_text(step)
            
        latency_ms = int((time.time() - start_time_ts) * 1000)
        end_iso = datetime.datetime.utcnow().isoformat() + "Z"
        
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
        return self._client.models.generate_content(
            model=step.model,
            contents=step.prompt
        )
        
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
                        
        if not assets:
            raise ValueError(f"No usable output found in Google GenAI response: {response}")
            
        return assets
