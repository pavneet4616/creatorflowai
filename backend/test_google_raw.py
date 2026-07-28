import os
from dotenv import load_dotenv

load_dotenv()

def test_google():
    api_key = os.getenv("GOOGLE_API_KEY")
    print(f"Testing raw Google API with key starting with: {api_key[:5] if api_key else 'None'}...")
    
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        print("Authenticating and listing models...")
        models = client.models.list()
        
        found_any = False
        for m in models:
            found_any = True
            if "imagen" in m.name.lower() or "veo" in m.name.lower():
                print(f" - {m.name}")
                
        if found_any:
            print("[PASS] Successfully authenticated with Google API using google-genai!")
        else:
            print("[PASS] Authenticated, but no models found.")
    except ImportError as e:
        print(f"[FAIL] google-genai is not installed: {e}")
    except Exception as e:
        print(f"[FAIL] Raw Google API test failed: {e}")

if __name__ == "__main__":
    test_google()
