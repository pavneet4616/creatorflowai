from genblaze_core import Step, Asset
import inspect

print("=== Step ===")
print(dir(Step))

print("\n=== Asset ===")
print(inspect.signature(Asset.__init__))
