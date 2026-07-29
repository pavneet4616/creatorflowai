import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def main():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("GOOGLE_API_KEY is not set.")
        return
        
    client = genai.Client(api_key=api_key)
    print("Listing available models...")
    
    try:
        # Note: the new google-genai SDK uses client.models.list() 
        # or pagination depending on the exact version. We'll try iterating.
        for model in client.models.list():
            print(f"- {model.name}")
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    main()
