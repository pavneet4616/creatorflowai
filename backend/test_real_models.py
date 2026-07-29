import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def main():
    api_key = os.getenv("GOOGLE_API_KEY")
    client = genai.Client(api_key=api_key)
    
    print("Testing nano-banana-pro-preview...")
    try:
        res = client.models.generate_content(
            model="nano-banana-pro-preview",
            contents="A test image"
        )
        print("Success!")
        print("Response:", res)
    except Exception as e:
        print("Error with image model:", repr(e))

    print("\nTesting veo-3.1-generate-preview...")
    try:
        res = client.models.generate_content(
            model="veo-3.1-generate-preview",
            contents="A test video"
        )
        print("Success!")
        print("Response:", res)
    except Exception as e:
        print("Error with video model:", repr(e))

if __name__ == "__main__":
    main()
