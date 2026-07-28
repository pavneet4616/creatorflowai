import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

from genblaze_core import Pipeline, Modality
from genblaze_google import ImagenProvider

async def test_google():
    try:
        print("Testing Google AI generation...")
        
        pipe = Pipeline("test-google").step(
            ImagenProvider(api_key=os.getenv("GOOGLE_API_KEY")),
            model="imagen-3.0-generate-002",
            prompt="A sleek modern cybernetic fox",
            modality=Modality.IMAGE
        )
        
        async for event in pipe.astream():
            ev_type = getattr(event, "type", getattr(event, "__class__", type(event)).__name__)
            print(f"[{ev_type}]")
            
        print("[PASS] Google API generation succeeded!")
    except Exception as e:
        print(f"[FAIL] Google API test: {e}")

if __name__ == "__main__":
    asyncio.run(test_google())
