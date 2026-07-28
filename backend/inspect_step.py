from genblaze_core.pipeline import Step
from genblaze_core.assets import Asset
import inspect

print("=== Step ===")
print(dir(Step))

print("\n=== Asset ===")
print(inspect.signature(Asset.__init__))
