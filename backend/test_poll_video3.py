import os
import time
from dotenv import load_dotenv
from google import genai
import traceback

load_dotenv()

def main():
    api_key = os.getenv("GOOGLE_API_KEY")
    client = genai.Client(api_key=api_key)
    
    print("Testing generate_videos...")
    try:
        operation = client.models.generate_videos(
            model="veo-3.1-generate-preview",
            prompt="A neon hologram of a cat driving at top speed"
        )
        print("Success! Operation:", operation.name)
        
        start_time = time.time()
        while not operation.done:
            elapsed = int(time.time() - start_time)
            print(f"Waiting for operation... ({elapsed}s)")
            time.sleep(10)
            operation = client.operations.get(operation=operation)
            
        print("Operation Done!")
        print("Error:", getattr(operation, 'error', None))
        
        response = getattr(operation, 'response', None)
        print("Response:", type(response))
        if response:
            print("Response dir:", dir(response))
            if hasattr(response, 'generated_videos'):
                print("generated_videos:", len(response.generated_videos))
                for vid in response.generated_videos:
                    print("Vid keys/attrs:", dir(vid))
                    if hasattr(vid, 'video'):
                        print("Vid.video attrs:", dir(vid.video))
                        if hasattr(vid.video, 'uri'):
                            print("URI:", vid.video.uri)
                        if hasattr(vid.video, 'video_bytes'):
                            print("Has bytes:", len(vid.video.video_bytes))
            
    except Exception as e:
        print("Error with video model:", repr(e))
        traceback.print_exc()

if __name__ == "__main__":
    main()
