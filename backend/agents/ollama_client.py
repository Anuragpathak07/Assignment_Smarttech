
import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3"

def query_ollama(prompt, system_prompt=None):
    """
    Sends a prompt to the local Ollama instance running Llama 3.
    """
    full_prompt = prompt
    if system_prompt:
        full_prompt = f"System: {system_prompt}\n\nUser: {prompt}"

    payload = {
        "model": MODEL_NAME,
        "prompt": full_prompt,
        "stream": False,
        "options": {
            "temperature": 0.3, # Keep it factual
            "num_predict": 500  # concise summaries
        }
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        if response.status_code != 200:
            return f"Error: Ollama API returned {response.status_code}. Details: {response.text}"
        
        data = response.json()
        return data.get("response", "").strip()
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to Ollama. Is 'ollama serve' running?"
    except Exception as e:
        return f"Error querying AI: {str(e)}"
