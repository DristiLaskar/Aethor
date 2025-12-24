# main.py

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from app.utils.connection_manager import manager
from app.services.llm import process_text  # <-- IMPORT THE BRAIN
import asyncio

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Project AETHER Systems Online"}

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # 1. RECEIVE
            data = await websocket.receive_text()
            print(f"User said: {data}")
            
            # 2. PROCESS (Now using the Real Brain)
            # We use 'await' because network calls take time
            response = await process_text(data) 
            
            # 3. RESPOND
            await manager.send_message(response, websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)