import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

def test_generate():
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    
    print("Testing generate_content on models/nano-banana-pro-preview...")
    try:
        res = client.models.generate_content(
            model="nano-banana-pro-preview",
            contents="A futuristic glowing banana",
        )
        print("[SUCCESS] generate_content worked!")
        # Let's inspect the response to see where the image is
        print(dir(res))
        if hasattr(res, 'candidates') and res.candidates:
            for part in res.candidates[0].content.parts:
                print(f"Part type: {type(part)}")
                if getattr(part, 'inline_data', None):
                    print(f"Inline data mime type: {part.inline_data.mime_type}")
                    print(f"Inline data size: {len(part.inline_data.data)} bytes")
                elif getattr(part, 'text', None):
                    print(f"Text: {part.text}")
    except Exception as e:
        print(f"[FAIL] {e}")

if __name__ == "__main__":
    test_generate()
