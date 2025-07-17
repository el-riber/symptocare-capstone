"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";

const supabase = createClientComponentClient();

export default function ChatPage() {
  const user = useUser();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: string; content: string; created_at?: string }[]
  >([{ role: "assistant", content: "Hi! How can I help you reflect today?" }]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = {
      role: "user",
      content: input,
      user_id: user?.id,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await supabase.from("chat_messages").insert(userMessage);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ question: input }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    const assistantMessage = {
      role: "assistant",
      content: data.reply,
      user_id: user?.id,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    await supabase.from("chat_messages").insert(assistantMessage);
  };

  return (
    <div className="flex flex-col h-screen bg-sky-200">
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <button onClick={() => router.back()} className="text-sky-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-sky-700">AI Assistant</h1>
        <div style={{ width: 20 }} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[75%] bg-white text-black p-3 rounded-2xl shadow">
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.created_at && (
                <p className="text-xs text-gray-500 text-right mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 bg-white flex items-center gap-2">
        <input
          className="flex-1 p-2 rounded-lg border text-black"
          placeholder="Type your reflection..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-lg"
          onClick={sendMessage}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
