import inspect

try:
    from genblaze import Pipeline, Modality, ObjectStorageSink
    print("=== Pipeline ===")
    print(dir(Pipeline))

    print("\n=== ObjectStorageSink ===")
    print(inspect.signature(ObjectStorageSink.__init__))
    print(inspect.getdoc(ObjectStorageSink))
except Exception as e:
    print("Core Error:", e)

try:
    from genblaze_s3 import S3StorageBackend
    print("\n=== S3StorageBackend ===")
    print(dir(S3StorageBackend))
    print("for_backblaze:", inspect.signature(S3StorageBackend.for_backblaze))
    print(inspect.getdoc(S3StorageBackend.for_backblaze))
except Exception as e:
    print("S3 Error:", e)

try:
    from genblaze_google import VeoProvider, ImagenProvider
    print("\n=== VeoProvider ===")
    print(inspect.signature(VeoProvider.__init__))
    print("\n=== ImagenProvider ===")
    print(inspect.signature(ImagenProvider.__init__))
except Exception as e:
    print("Google Error:", e)
