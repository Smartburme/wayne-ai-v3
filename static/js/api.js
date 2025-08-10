const API_BASE = "https://wayne-ai-v1.mysvm.workers.dev";

async function sendToBackend(message, mode = "text") {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, mode })
    });

    if (!res.ok) throw new Error(`Network response not ok: ${res.status}`);

    const data = await res.json();

    // API မှာ { reply: "..." } return ပြန်တယ်ဆို assumption
    return data.reply ?? JSON.stringify(data);
  } catch (e) {
    console.error("API error", e);
    return `Server error: ${e.message}`;
  }
}
