import chromadb
from sentence_transformers import SentenceTransformer
import uuid

# 1. Initialize the Embedding Model (Local ML Model)
# We use 'all-MiniLM-L6-v2' - it's fast and effective for semantic search.
print("Loading Embedding Model... (This happens only once)")
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

# 2. Initialize Vector Database (Persistent)
# This creates a folder named 'aether_memory' in your project to save data.
chroma_client = chromadb.PersistentClient(path="./aether_memory")
collection = chroma_client.get_or_create_collection(name="conversation_history")

def add_memory(text: str, role: str):
    """
    Converts text to a vector and stores it in the database.
    """
    # Create a unique ID for this memory
    memory_id = str(uuid.uuid4())
    
    # Store the text along with metadata (who said it?)
    collection.add(
        documents=[text],
        metadatas=[{"role": role}],
        ids=[memory_id]
    )
    # Note: ChromaDB handles the embedding generation automatically if we don't provide it, 
    # but using a local model explicitly gives us more control if we need it later.

def get_relevant_context(query: str, n_results=3):
    """
    Searches the database for the 3 most relevant past memories.
    """
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    
    # Extract the actual text from the results
    memories = results['documents'][0]
    return memories