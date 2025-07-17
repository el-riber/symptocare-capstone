export async function fetchChatResponse(message: string) {
  const res = await fetch("http://localhost:8080/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: message }),
  });

  if (!res.ok) throw new Error("Failed to fetch chat response");
  const data = await res.json();
  return data.reply;
}
