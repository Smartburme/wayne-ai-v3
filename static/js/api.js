const API_BASE = "https://your-backend.example.com"; // <-- ပြောင်းပါ

async function sendToBackend(message, mode="text"){
  try{
    const res = await fetch(`${API_BASE}/api/chat`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ message, mode })
    });
    if(!res.ok) throw new Error("Network response not ok");
    const data = await res.json();
    return data.reply ?? data; // expect {reply: "..."}
  }catch(e){
    console.error("API error", e);
    return "Server error: " + e.message;
  }
}
