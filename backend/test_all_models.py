import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

def test_models():
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    models = client.models.list()
    
    for m in models:
        name = m.name.replace("models/", "")
        if "imagen" in name:
            print(f"Testing {name}...")
            try:
                res = client.models.generate_images(
                    model=name,
                    prompt="A red dot",
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        output_mime_type="image/jpeg",
                        aspect_ratio="1:1"
                    )
                )
                print(f"  [SUCCESS] {name} works!")
                return
            except Exception as e:
                print(f"  [FAIL] {e}")

if __name__ == "__main__":
    test_models()
