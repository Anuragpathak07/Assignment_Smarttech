import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize Groq client
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

client = Groq(api_key=api_key)

MODEL_NAME = "llama-3.3-70b-versatile"

def query_ollama(prompt, system_prompt=None):
    """
    Sends a prompt to Groq API using Llama 3.3
    """
    messages = []
    
    # Add system prompt if provided
    if system_prompt:
        messages.append({
            "role": "system",
            "content": system_prompt
        })
    
    # Add user prompt
    messages.append({
        "role": "user",
        "content": prompt
    })

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=0.3,  # Keep it factual
            max_tokens=500    # Concise summaries
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        return f"Error querying Groq: {str(e)}"


# Test it
if __name__ == "__main__":
    result = query_ollama(
        prompt="What is Python?",
        system_prompt="You are a helpful programming assistant. Answer concisely."
    )
    print(result)