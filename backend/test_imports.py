import sys
print("Testing imports...")
try:
    from genblaze import Pipeline
    print("[PASS] from genblaze import Pipeline")
except Exception as e:
    print(f"[FAIL] Pipeline: {e}")

try:
    from genblaze_core import ObjectStorageSink
    print("[PASS] from genblaze_core import ObjectStorageSink")
except Exception as e:
    print(f"[FAIL] ObjectStorageSink from genblaze_core: {e}")

try:
    from genblaze.sinks import ObjectStorageSink
    print("[PASS] from genblaze.sinks import ObjectStorageSink")
except Exception as e:
    print(f"[FAIL] ObjectStorageSink from genblaze.sinks: {e}")

try:
    from genblaze_s3 import S3StorageBackend
    print("[PASS] from genblaze_s3 import S3StorageBackend")
except Exception as e:
    print(f"[FAIL] S3StorageBackend from genblaze_s3: {e}")

try:
    from genblaze.storage import S3StorageBackend
    print("[PASS] from genblaze.storage import S3StorageBackend")
except Exception as e:
    print(f"[FAIL] S3StorageBackend from genblaze.storage: {e}")

try:
    from genblaze_google import ImagenProvider, VeoProvider
    print("[PASS] from genblaze_google import ImagenProvider, VeoProvider")
except Exception as e:
    print(f"[FAIL] Google Providers: {e}")

