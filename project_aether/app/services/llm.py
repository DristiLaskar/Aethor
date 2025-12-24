import os
from groq import Groq
from dotenv import load_dotenv
from app.services.memory import add_memory, get_relevant_context

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Base System Prompt
SYSTEM_PROMPT = """
You are AETHER, an advanced AI companion. 
Your tone is helpful, witty, and concise. 
You have access to past memories. Use them to personalize your responses.
Keep responses short (under 2 sentences) unless asked for more.
"""

# Short-term buffer (just for the current active chat session)
session_history = [
    {"role": "system", "content": SYSTEM_PROMPT}
]

async def process_text(user_input: str):
    # 1. RETRIEVE: Search long-term memory for relevant info
    past_memories = get_relevant_context(user_input)
    
    # Format memories into a string context
    memory_context = "\n".join([f"- {m}" for m in past_memories])
    
    # 2. AUGMENT: Create a hidden prompt with context
    # We tell the AI: "Here is what you know about this topic from the past."
    augmented_input = f"""
    Context from past conversations:
    {memory_context}
    
    User Input: {user_input}
    """
    
    # Add to session history (standard chat flow)
    session_history.append({"role": "user", "content": user_input})

    # 3. GENERATE: Call the LLM
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                # We inject the retrieved memory as a 'system' hint effectively
                {"role": "system", "content": f"Relevant Memories:\n{memory_context}"},
                # Then we add the recent conversation history
                *session_history[-5:] 
            ],
            temperature=0.7,
            max_tokens=150,
            stream=False,
        )
        
        ai_response = completion.choices[0].message.content
        
        # 4. STORE: Save this new interaction to Long-Term Memory
        add_memory(user_input, "user")
        add_memory(ai_response, "ai")
        
        # Add to short-term session
        session_history.append({"role": "assistant", "content": ai_response})
        
        return ai_response

    except Exception as e:
        print(f"Error: {e}")
        return "My neural pathways are congested. Please try again."