import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

def test_models():
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    models = client.models.list()
    
    print("=== Available Models ===")
    for m in models:
        name = m.name.lower()
        if "banana" in name or "veo" in name or "omni" in name:
            print(f"- {m.name} (Methods: {getattr(m, 'supported_generation_methods', 'UNKNOWN')})")
            
    print("\n=== Testing Nano Banana Generation ===")
    # Let's try to generate with the first banana model we can find, or just hardcode one if we guess the slug.
    # Usually it's 'models/nano-banana-2' or something. We'll find out from the list above.
    
    test_slugs = ["models/nano-banana-pro-preview", "models/veo-3.1-generate-preview"]
    
    for slug in test_slugs:
        try:
            print(f"Testing {slug}...")
            res = client.models.generate_images(
                model=slug.replace("models/", ""),
                prompt="A red dot",
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    output_mime_type="image/jpeg",
                    aspect_ratio="1:1"
                )
            )
            print(f"  [SUCCESS] {slug} generated an image successfully!")
            break
        except Exception as e:
            print(f"  [FAIL] {e}")

if __name__ == "__main__":
    test_models()
