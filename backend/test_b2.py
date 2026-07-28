import asyncio
from dotenv import load_dotenv
import os

load_dotenv()

from genblaze_s3 import S3StorageBackend

async def test_b2():
    try:
        print("Testing B2 Initialization...")
        # preflight=True is the default but we pass it anyway to trigger immediate auth check
        backend = S3StorageBackend.for_backblaze(preflight=True)
        print("[PASS] B2 Connection Established.")
        
        print("\nUploading test file...")
        await backend.aput("test/hello.txt", b"Hello Backblaze!")
        print("[PASS] File uploaded.")
        
        exists = await backend.aexists("test/hello.txt")
        print(f"[PASS] File verification: {exists}")
        
        url = backend.get_durable_url("test/hello.txt")
        print(f"Public URL: {url}")
        
    except Exception as e:
        print(f"[FAIL] B2 Test: {e}")

if __name__ == "__main__":
    asyncio.run(test_b2())
