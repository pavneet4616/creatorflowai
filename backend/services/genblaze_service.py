import asyncio
import json
from typing import AsyncGenerator
from core.config import settings

from genblaze_core import Pipeline, Modality, ObjectStorageSink, KeyStrategy
from genblaze_s3 import S3StorageBackend
from providers.google_genai_provider import GoogleProvider

class GenblazeService:
    def _build_sink(self) -> ObjectStorageSink:
        # The S3StorageBackend for Backblaze B2 automatically picks up region from bucket auto-detect
        # It natively reads B2_BUCKET, B2_REGION, B2_KEY_ID, B2_APP_KEY
        backend = S3StorageBackend.for_backblaze(
            bucket=settings.B2_BUCKET,
            region=settings.B2_REGION,
            key_id=settings.B2_KEY_ID,
            app_key=settings.B2_APP_KEY,
            preflight=False
        )
        return ObjectStorageSink(backend, key_strategy=KeyStrategy.HIERARCHICAL)

    async def execute_pipeline(self, run_id: str, prompt: str, config: list, event_callback=None) -> AsyncGenerator:
        pipeline = Pipeline(run_id)

        for step_cfg in config:
            if not step_cfg.get("enabled"):
                continue

            step_type = step_cfg.get("type")
            raw_model = str(step_cfg.get("model", "")).lower()

            if step_type == "image":
                model_id = "nano-banana-pro-preview" if ("banana" in raw_model or "nano" in raw_model or not raw_model) else step_cfg.get("model")
                pipeline = pipeline.step(
                    provider=GoogleProvider(api_key=settings.GOOGLE_API_KEY, event_callback=event_callback),
                    model=model_id,
                    prompt=prompt,
                    modality=Modality.IMAGE
                )
            elif step_type == "video":
                model_id = "veo-3.1-generate-preview" if ("veo" in raw_model or not raw_model) else step_cfg.get("model")
                pipeline = pipeline.step(
                    provider=GoogleProvider(api_key=settings.GOOGLE_API_KEY, event_callback=event_callback),
                    model=model_id,
                    prompt=prompt,
                    modality=Modality.VIDEO
                )

        sink = self._build_sink()

        async for event in pipeline.astream(sink=sink):
            yield event

genblaze_service = GenblazeService()
