"use client";

import { useState } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [{ role: "assistant", content: "Hi! How can I help you reflect today?" }]
  );

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ question: input }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    const assistantMessage = { role: "assistant", content: data.reply };
    setMessages((prev) => [...prev, assistantMessage]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">AI Assistant</h1>
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className="block rounded px-3 py-2 bg-gray-100 dark:bg-gray-800">{msg.content}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
