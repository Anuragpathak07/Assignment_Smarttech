
import requests
import json

def test_ollama():
    print("Testing Ollama Connection...")
    try:
        # Check Version
        resp = requests.get('http://localhost:11434/api/version', timeout=5)
        print(f"Ollama Version: {resp.text}")
        
        # Check Loaded Models
        resp = requests.get('http://localhost:11434/api/tags', timeout=5)
        print(f"Available Models: {resp.text}")
        
        models = resp.json().get('models', [])
        model_names = [m['name'] for m in models]
        
        if 'llama3:latest' in model_names or 'llama3' in model_names:
            print("Message: 'llama3' found.")
        else:
            print(f"WARNING: 'llama3' not found in models: {model_names}")
            print("Try running: ollama pull llama3")

        # Test Generate
        print("\nTesting Generation with 'llama3'...")
        payload = {
            "model": "llama3",
            "prompt": "Say hello",
            "stream": False
        }
        resp = requests.post('http://localhost:11434/api/generate', json=payload, timeout=10)
        if resp.status_code == 200:
            print("Generation Success:", resp.json().get('response'))
        else:
            print(f"Generation Failed: {resp.status_code}")
            print(f"Error Details: {resp.text}")

    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_ollama()
