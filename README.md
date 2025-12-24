# Project AETHER: Bi-Directional Voice AI with Semantic Memory

Aether is a real-time, voice-activated AI companion engineered with a microservices architecture. It features full-duplex voice communication, emotional prosody awareness, and long-term memory persistence using vector embeddings.

## 🧠 Core Features (ML Engineering)
* **Generative Intelligence:** Powered by Llama-3-70B (via Groq) for sub-300ms inference latency.
* **RAG (Retrieval-Augmented Generation):** Implements a local Vector Database (ChromaDB) to provide infinite long-term memory and context-aware responses.
* **Semantic Search:** Uses `all-MiniLM-L6-v2` transformer model to embed user conversations into high-dimensional vector space for accurate retrieval.
* **Voice Pipeline:** Integrated browser-native Speech-to-Text (STT) and Neural Text-to-Speech (TTS) for natural, hands-free interaction.

## 🏗️ System Architecture
* **Backend:** Python (FastAPI) handling asynchronous WebSocket streams.
* **Frontend:** React (Next.js) with a custom Glassmorphism UI and real-time state management.
* **Communication:** WebSockets for low-latency, bi-directional data flow.

## 🚀 How to Run
1.  **Backend:**
    ```bash
    cd project_aether
    uvicorn main:app --reload
    ```
2.  **Frontend:**
    ```bash
    cd aether-frontend
    npm run dev
    ```

## 🛠️ Tech Stack
* **AI/ML:** Llama 3, ChromaDB, Sentence-Transformers, Groq API
* **Backend:** Python, FastAPI, WebSockets
* **Frontend:** TypeScript, React, TailwindCSS
