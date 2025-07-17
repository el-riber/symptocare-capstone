"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import Link from "next/link";

type Message = {
  role: string;
  content: string;
  timestamp: number;
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! How can I help you reflect today?",
      timestamp: Date.now(),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Save user message to Supabase
    await fetch("/api/saveMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userMessage),
    });

    // Call backend AI assistant
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();

    const assistantMessage: Message = {
      role: "assistant",
      content: data.reply,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Save assistant reply to Supabase
    await fetch("/api/saveMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assistantMessage),
    });
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      {/* Top Nav */}
      <nav className="bg-white shadow p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-900">AI Assistant</h2>
        <Link href="/dashboard">
          <button className="text-blue-600 hover:underline text-sm">← Back</button>
        </Link>
      </nav>

      {/* Chat Body */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="bg-white p-3 px-4 rounded-2xl shadow max-w-xs text-sm text-gray-900">
              <p>{msg.content}</p>
              <span className="text-[10px] text-gray-500 block mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="bg-white p-3 border-t flex gap-2 items-center">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-black"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-full"
          onClick={sendMessage}
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
}
