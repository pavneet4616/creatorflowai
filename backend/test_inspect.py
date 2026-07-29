import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def main():
    api_key = os.getenv("GOOGLE_API_KEY")
    client = genai.Client(api_key=api_key)
    
    print("=== dir(client.files) ===")
    print(dir(client.files))
    
    try:
        # Check if client.files has a download method
        if hasattr(client.files, 'download'):
            print("\n=== help(client.files.download) ===")
            help(client.files.download)
        
        # Check what client.files.get returns
        print("\n=== help(client.files.get) ===")
        help(client.files.get)
        
    except Exception as e:
        print(e)

if __name__ == "__main__":
    main()
