import inspect
from genblaze_core.providers import AsyncProvider

print("=== AsyncProvider ===")
for name, val in inspect.getmembers(AsyncProvider):
    if hasattr(val, "__isabstractmethod__") and val.__isabstractmethod__:
        print(f"Abstract: {name}{inspect.signature(val)}")
