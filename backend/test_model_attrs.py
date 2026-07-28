import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def test_attrs():
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    models = client.models.list()
    
    for m in models:
        if "banana" in m.name.lower() or "veo" in m.name.lower():
            print(f"Model: {m.name}")
            print(f"Attributes: {dir(m)}")
            # Try to print all fields if it's a pydantic model or similar
            if hasattr(m, 'model_dump'):
                print(m.model_dump())
            elif hasattr(m, '__dict__'):
                print(m.__dict__)
            print("---")
            break

if __name__ == "__main__":
    test_attrs()
