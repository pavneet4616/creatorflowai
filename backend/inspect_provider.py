import inspect
from genblaze_core.providers import BaseProvider

print("=== BaseProvider ===")
for name, val in inspect.getmembers(BaseProvider):
    if hasattr(val, "__isabstractmethod__") and val.__isabstractmethod__:
        print(f"Abstract: {name}{inspect.signature(val)}")

try:
    from genblaze_core.providers import SyncProvider
    print("\n=== SyncProvider ===")
    for name, val in inspect.getmembers(SyncProvider):
        if hasattr(val, "__isabstractmethod__") and val.__isabstractmethod__:
            print(f"Abstract: {name}{inspect.signature(val)}")
except ImportError:
    pass

try:
    from genblaze_core.providers import AsyncProvider
    print("\n=== AsyncProvider ===")
    for name, val in inspect.getmembers(AsyncProvider):
        if hasattr(val, "__isabstractmethod__") and val.__isabstractmethod__:
            print(f"Abstract: {name}{inspect.signature(val)}")
except ImportError:
    pass
