import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def main():
    api_key = os.getenv("GOOGLE_API_KEY")
    client = genai.Client(api_key=api_key)
    
    print(dir(client.models))
    print("Testing generate_videos...")
    try:
        operation = client.models.generate_videos(
            model="veo-3.1-generate-preview",
            prompt="A test video of a futuristic city"
        )
        print("Success! Operation:", operation)
        print(dir(operation))
    except Exception as e:
        print("Error with video model:", repr(e))

if __name__ == "__main__":
    main()
