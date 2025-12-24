"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Mic, Power, Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Ref to handle speech synthesis cancellation
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize System
  useEffect(() => {
    // 1. WebSocket Setup
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/chat");
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    ws.onmessage = (event) => {
      const response = event.data;
      setMessages((prev) => [...prev, { role: "ai", text: response }]);
      setIsSpeaking(false);
      
      // TRIGGER VOICE OUTPUT
      if (voiceEnabled) speakText(response);
    };

    setSocket(ws);
    synthesisRef.current = window.speechSynthesis;

    return () => {
      ws.close();
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, [voiceEnabled]);

  // --- VOICE OUTPUT (TTS) ---
  const speakText = (text: string) => {
    if (!synthesisRef.current) return;
    
    // Stop any current speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.9; // Slightly lower for a cooler tone
    utterance.rate = 1.0;  // Normal speed
    
    // Try to find a good voice
    const voices = synthesisRef.current.getVoices();
    // Prefer a "Google US English" or similar if available
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Male"));
    if (preferredVoice) utterance.voice = preferredVoice;

    // Visual sync
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  // --- VOICE INPUT (STT) ---
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser does not support speech recognition. Try Chrome.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto-send after listening
      setTimeout(() => sendMessage(transcript), 500);
    };

    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const sendMessage = (textToSend = input) => {
    if (!textToSend.trim() || !socket) return;

    setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
    socket.send(textToSend);
    setInput("");
    setIsSpeaking(true); // Fake "thinking" state until reply
  };

  return (
    <div className="flex flex-col h-screen bg-black text-cyan-400 p-6 relative overflow-hidden font-mono">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center border-b border-cyan-900 pb-4 z-10">
        <h1 className="text-2xl font-bold tracking-[0.2em] drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
          AETHER // SYSTEM
        </h1>
        <div className="flex gap-4">
            <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="hover:text-cyan-200">
                {voiceEnabled ? <Volume2 /> : <VolumeX className="text-red-500"/>}
            </button>
            <div className={`flex items-center gap-2 ${isConnected ? "text-green-500" : "text-red-500"}`}>
            <Power size={20} />
            <span className="text-xs">{isConnected ? "ONLINE" : "OFFLINE"}</span>
            </div>
        </div>
      </div>

      {/* Main Orb Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className={`orb mb-12 transition-all duration-300 
            ${isSpeaking ? "speaking scale-110 shadow-[0_0_80px_#bc13fe]" : ""}
            ${isListening ? "border-green-400 shadow-[0_0_50px_#00ff00]" : ""}
        `}></div>

        {/* Chat Log */}
        <div className="w-full max-w-2xl h-80 overflow-y-auto bg-black/40 border border-cyan-900/50 rounded-lg p-4 backdrop-blur-md">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"} message-enter`}>
              <div className={`max-w-[80%] p-3 rounded text-sm ${
                  msg.role === "user" 
                  ? "bg-cyan-900/30 text-cyan-100 border border-cyan-800" 
                  : "bg-purple-900/20 text-gray-300 border-l-2 border-purple-500"
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Zone */}
      <div className="w-full max-w-2xl mx-auto flex gap-4 z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type or Speak..."
          className="flex-1 bg-gray-900/60 border border-cyan-900 rounded p-4 text-cyan-300 focus:outline-none focus:border-cyan-500 transition-all"
        />
        
        {/* THE MICROPHONE BUTTON */}
        <button 
          onClick={startListening}
          className={`p-4 rounded border transition-all ${
              isListening 
              ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" 
              : "bg-cyan-900/20 border-cyan-700 text-cyan-400 hover:bg-cyan-800/40"
          }`}
        >
          <Mic size={24} />
        </button>

        <button onClick={() => sendMessage()} className="bg-cyan-900/20 border border-cyan-600 p-4 rounded hover:bg-cyan-800/40 text-cyan-400">
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}