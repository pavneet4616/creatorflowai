import asyncio
from dotenv import load_dotenv
import os
from genblaze_s3 import S3StorageBackend

load_dotenv()

async def find_region():
    regions = ["us-east-005", "us-west-000", "us-west-001", "us-west-002", "us-west-004", "eu-central-003"]
    bucket = os.getenv("B2_BUCKET_NAME")
    key_id = os.getenv("B2_APPLICATION_KEY_ID")
    app_key = os.getenv("B2_APPLICATION_KEY")
    
    print(f"Testing B2 credentials for bucket '{bucket}' across regions...")
    
    for r in regions:
        try:
            print(f"Trying {r}...")
            backend = S3StorageBackend.for_backblaze(
                bucket=bucket,
                key_id=key_id,
                app_key=app_key,
                region=r,
                preflight=True
            )
            print(f"[SUCCESS] Region found: {r}")
            
            # Let's write the region to .env automatically
            with open("E:/createrflow/backend/.env", "a") as f:
                f.write(f"\nB2_REGION={r}\n")
            
            return r
        except Exception as e:
            if "403" in str(e) or "Forbidden" in str(e) or "401" in str(e):
                print(f"  Failed (Auth/Region): {e}")
            else:
                print(f"  Failed: {e}")
                
    print("[FAIL] Could not authenticate to any region with these keys.")

if __name__ == "__main__":
    asyncio.run(find_region())
