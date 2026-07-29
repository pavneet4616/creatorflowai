from core.config import settings
from genblaze_s3 import S3StorageBackend

print("Settings B2_BUCKET:", repr(settings.B2_BUCKET))

try:
    backend = S3StorageBackend.for_backblaze(
        bucket=settings.B2_BUCKET,
        region=settings.B2_REGION,
        key_id=settings.B2_KEY_ID,
        app_key=settings.B2_APP_KEY,
        preflight=False
    )
    print("Success!")
except Exception as e:
    print("Error:", e)
