import asyncio
from dotenv import load_dotenv
import os

load_dotenv()

from genblaze_core import Pipeline, KeyStrategy, Modality, ObjectStorageSink
from genblaze_s3 import S3StorageBackend
from backend.providers.google_genai_provider import GoogleProvider

async def test_pipe():
    try:
        print("Testing Pipeline: Imagen -> B2 Sink")
        
        backend = S3StorageBackend.for_backblaze()
        sink = ObjectStorageSink(backend, key_strategy=KeyStrategy.HIERARCHICAL)
        
        pipe = Pipeline("test-run-001").step(
            GoogleProvider(api_key=os.getenv("GOOGLE_API_KEY")),
            model="nano-banana-pro-preview",
            prompt="A sleek modern cybernetic fox, highly detailed 4k",
            modality=Modality.IMAGE
        )
        
        print("Pipeline streaming started...\n")
        async for event in pipe.astream(sink=sink):
            # Try to get the event type, or fallback to the class name
            ev_type = getattr(event, "type", getattr(event, "__class__", type(event)).__name__)
            print(f"[{ev_type}]")
            
        print("\n[PASS] Pipeline completed successfully!")
    except Exception as e:
        print(f"\n[FAIL] Pipeline Execution: {e}")

if __name__ == "__main__":
    asyncio.run(test_pipe())
