<div align="center">

  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png" alt="Aether Bot" width="120" />

  <h1 style="font-size: 3rem; margin-top: 10px; margin-bottom: -10px;">PROJECT AETHER</h1>
  
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=24&pause=1000&color=A5B4FC&center=true&vCenter=true&width=500&lines=Bi-Directional+Voice+Stream;Semantic+Memory+Persistence;Llama-3+70B+%28Groq%29;Real-time+RAG+Pipeline" alt="Typing SVG" />
  </a>

  <br/>

  <a href="#">
    <img src="https://img.shields.io/badge/Status-Active_Development-success?style=for-the-badge&logo=github" alt="Status" />
  </a>
  <a href="https://fastapi.tiangolo.com/">
    <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  </a>
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="NextJS" />
  </a>
  <a href="https://groq.com/">
    <img src="https://img.shields.io/badge/AI-Llama_3-blue?style=for-the-badge&logo=meta&logoColor=white" alt="Llama 3" />
  </a>

  <p align="center">
    A real-time, voice-activated AI companion engineered with a microservices architecture.<br/>
    <b>Listening. Thinking. Remembering.</b>
  </p>
</div>

---

## 🔮 See Aether in Action
> *[Optional: Record a screen capture of the voice interaction and replace the link below]*
>
> `![Aether Demo](assets/demo.gif)`

---

## 🧠 Core Intelligence
Aether acts as a sentient companion with long-term memory recall.

| Feature | Tech Stack | Description |
| :--- | :--- | :--- |
| **Generative Intelligence** | <img src="https://img.shields.io/badge/Groq-Llama_3_70B-orange?style=flat-square" /> | Ultra-low latency inference (<300ms) utilizing Groq's LPU. |
| **Infinite Memory (RAG)** | <img src="https://img.shields.io/badge/ChromaDB-Vector_Store-red?style=flat-square" /> | Local vector database stores conversation history for long-term recall. |
| **Semantic Search** | <img src="https://img.shields.io/badge/HuggingFace-MiniLM-yellow?style=flat-square" /> | Uses `all-MiniLM-L6-v2` to embed conversations into high-dimensional vector space. |
| **Voice Pipeline** | <img src="https://img.shields.io/badge/Web_API-STT_%2F_TTS-blue?style=flat-square" /> | Browser-native Speech-to-Text and Neural Text-to-Speech for hands-free usage. |

---

## ⚡ Installation & Setup
Get Aether running locally in under **5 minutes**.

### **Prerequisites**
- Python **3.10+**
- Node.js **18+**
- **Groq API Key** (Required for LLM inference)

---

### **1️⃣ Clone the Repository**

git clone https://github.com/yourusername/project-aether.git
cd project-aether

---

### **2️⃣ Backend Setup**

Navigate to backend directory:
cd project_aether

---

### **3️⃣ Create Virtual Environment**

# Windows:
python -m venv venv
venv\Scripts\activate

# Mac/Linux:
python3 -m venv venv
source venv/bin/activate

---

### **4️⃣ Install Backend Dependencies**

pip install -r requirements.txt

---

### **5️⃣ Add Environment Variables**

Create a .env file inside project_aether:
GROQ_API_KEY=gsk_your_key_here
CHROMA_DB_PATH=./chroma_db
HOST=0.0.0.0
PORT=8000

---

### **6️⃣ Start Backend Server**

uvicorn main:app --reload
🟢 Backend live at: http://localhost:8000

---

### **7️⃣ Frontend Setup**

Open a new terminal and navigate to the frontend directory:
cd aether-frontend

---

### **8️⃣ Install Frontend Dependencies**

npm install

---

### **9️⃣ Start Frontend**

npm run dev
🔵 Frontend live at: http://localhost:3000

---

---

## 🏗️ System Architecture

Aether operates on a high-concurrency asynchronous pipeline using WebSockets for full-duplex communication.

```mermaid
graph TD
    User((User))
    UI[🖥️ Next.js Frontend]
    WS{⚡ WebSockets}
    API[⚙️ FastAPI Backend]
    LLM[🤖 Groq Llama-3]
    VDB[(🗄️ ChromaDB)]
    Embed[🧩 MiniLM Embeddings]

    User -- "Voice/Text" --> UI
    UI -- "Real-time Stream" --> WS
    WS <--> API
    API -- "Context Retrieval" --> VDB
    API -- "Generate Response" --> LLM
    VDB -- "Semantic Search" --> Embed
    LLM -- "Token Stream" --> API
    API -- "Audio Response" --> UI
