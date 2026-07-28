import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def test_methods():
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    models = client.models.list()
    
    print("=== Model Generation Methods ===")
    for m in models:
        name = m.name.lower()
        if "imagen" in name or "veo" in name:
            print(f"Model: {m.name}")
            print(f"Methods: {getattr(m, 'supported_generation_methods', 'UNKNOWN')}")
            print("---")

if __name__ == "__main__":
    test_methods()
