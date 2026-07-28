import asyncio
import json
from typing import AsyncGenerator
from core.config import settings

from genblaze_core import Pipeline, Modality, ObjectStorageSink, KeyStrategy
from genblaze_s3 import S3StorageBackend
from backend.providers.google_genai_provider import GoogleProvider

class GenblazeService:
    def _build_sink(self) -> ObjectStorageSink:
        # The S3StorageBackend for Backblaze B2 automatically picks up region from bucket auto-detect
        # It natively reads B2_BUCKET, B2_REGION, B2_KEY_ID, B2_APP_KEY
        backend = S3StorageBackend.for_backblaze(preflight=False)
        return ObjectStorageSink(backend, key_strategy=KeyStrategy.HIERARCHICAL)

    async def execute_pipeline(self, run_id: str, prompt: str, config: list) -> AsyncGenerator:
        pipeline = Pipeline(run_id)

        for step_cfg in config:
            if not step_cfg.get("enabled"):
                continue

            step_type = step_cfg.get("type")
            if step_type == "image":
                pipeline = pipeline.step(
                    provider=GoogleProvider(api_key=settings.GOOGLE_API_KEY),
                    model=step_cfg.get("model", "nano-banana-pro-preview"),
                    prompt=prompt,
                    modality=Modality.IMAGE
                )
            elif step_type == "video":
                pipeline = pipeline.step(
                    provider=GoogleProvider(api_key=settings.GOOGLE_API_KEY),
                    model=step_cfg.get("model", "veo-3.1-generate-preview"),
                    prompt=prompt,
                    modality=Modality.VIDEO
                )

        sink = self._build_sink()

        async for event in pipeline.astream(sink=sink):
            yield event

genblaze_service = GenblazeService()
