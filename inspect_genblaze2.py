import sys
try:
    import genblaze
    print(dir(genblaze))
    help(genblaze)
except Exception as e:
    print("Error:", e)

try:
    from genblaze import Pipeline
    help(Pipeline)
except Exception as e:
    print("Pipeline error:", e)
