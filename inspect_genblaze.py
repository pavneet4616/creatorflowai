import sys
try:
    import genblaze
    from genblaze import Pipeline
    from genblaze.storage import S3StorageBackend, ObjectStorageSink
    from genblaze.providers import google
    
    print("--- Genblaze Exports ---")
    print(dir(genblaze))
    
    print("\n--- Pipeline Help ---")
    help(Pipeline)
    
    print("\n--- S3StorageBackend Help ---")
    help(S3StorageBackend)
    
    print("\n--- ObjectStorageSink Help ---")
    help(ObjectStorageSink)
    
except ImportError as e:
    print(f"Error importing genblaze: {e}")
