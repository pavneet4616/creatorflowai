import os
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()

def main():
    api_key = os.getenv("GOOGLE_API_KEY")
    client = genai.Client(api_key=api_key)
    
    print("Testing generate_videos...")
    try:
        operation = client.models.generate_videos(
            model="veo-3.1-generate-preview",
            prompt="A test video of a futuristic city"
        )
        print("Success! Operation:", operation.name)
        
        while not operation.done:
            print("Waiting for operation...")
            time.sleep(5)
            # Not sure if client.operations or client.models.get_operation ?
            # Let's check dir(client) or assume client.operations.get(operation.name)
            # wait, the sdk might have client.operations or client.models.get
            # Let's print dir(client) to be sure
            pass
            
    except Exception as e:
        print("Error with video model:", repr(e))

if __name__ == "__main__":
    main()
