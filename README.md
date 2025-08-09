# wayne-ai-v3
# Structure 
```
wayne-ai-v3/
│
├── index.html               # Loader
├── pages/
│   └── main.html            # Chat UI
├── static/
│   ├── css/style.css
│   ├── js/main.js           # UI logic
│   └── js/api.js            # Calls Python backend
├── backend/                 # Python backend
│   ├── app.py               # Flask/FastAPI
│   ├── requirements.txt
│   ├── services/
│   │   └── chat_service.py
│   └── config.py
├── .github/workflows/deploy.yml
└── README.md
```
ဖိုင် ၁ — index.html (loader / entry)
```
<!DOCTYPE html>
<html lang="my">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>WAYNE AI • Loading</title>
  <link rel="stylesheet" href="static/css/style.css">
</head>
<body class="bg">
  <div class="loader-wrap">
    <div class="logo-glass">
      <img src="static/images/icon.png" alt="wayne" class="logo">
      <h1>WAYNE AI</h1>
    </div>
    <div class="loader">
      <span></span><span></span><span></span>
    </div>
    <p class="sub">Loading experience… ready in a moment</p>
    <a class="enter-btn" href="pages/main.html">Enter</a>
  </div>
</body>
</html>

```
---

ဖိုင် ၂ — pages/main.html (Main Chat UI)
```
<!DOCTYPE html>
<html lang="my">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>WAYNE AI • Chat</title>
  <link rel="stylesheet" href="../static/css/style.css">
</head>
<body class="bg">
  <header class="titlebar">
    <div class="left">
      <button id="menuBtn" class="icon-btn">ミ</button>
    </div>
    <div class="title">WAYNE AI</div>
    <div class="right">
      <img src="../static/images/icon.png" class="avatar" alt="icon">
    </div>
  </header>

  <main class="chat-area" id="chatArea">
    <div class="messages" id="messages"></div>
    <div class="composer">
      <select id="modeSelect" class="mode">
        <option value="text">Text</option>
        <option value="image">Image</option>
        <option value="code">Code</option>
      </select>
      <textarea id="input" placeholder="Type a message..." rows="1"></textarea>
      <button id="sendBtn" class="send">ᐷ</button>
    </div>
  </main>

  <script src="../static/js/api.js"></script>
  <script src="../static/js/main.js"></script>
</body>
</html>

```
---

ဖိုင် ၃ — static/css/style.css
```
:root{
  --bg1: linear-gradient(135deg,#0f172a 0%, #071129 100%);
  --glass: rgba(255,255,255,0.06);
  --accent: linear-gradient(90deg,#6EE7B7,#3B82F6);
  --glass-border: rgba(255,255,255,0.08);
  --text: #E6EDF3;
  --muted: #94A3B8;
  --radius: 14px;
}

/* base */
*{box-sizing:border-box}
html,body{height:100%;margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial}
.bg{min-height:100vh;background:var(--bg1);color:var(--text);display:flex;align-items:center;justify-content:center;padding:20px}

/* loader */
.loader-wrap{max-width:520px;width:100%;text-align:center;padding:40px;border-radius:20px;background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));box-shadow:0 8px 30px rgba(2,6,23,0.6)}
.logo{width:56px;height:56px;border-radius:12px;object-fit:cover}
.logo-glass{display:inline-flex;align-items:center;gap:12px;padding:10px;border-radius:12px;background:var(--glass);border:1px solid var(--glass-border);backdrop-filter: blur(6px);margin-bottom:18px}
.loader{display:flex;gap:8px;align-items:center;justify-content:center;margin:20px}
.loader span{display:block;width:12px;height:12px;border-radius:50%;background:linear-gradient(180deg,#60a5fa,#a78bfa);animation:dot 1s infinite ease-in-out}
.loader span:nth-child(2){animation-delay:0.15s}
.loader span:nth-child(3){animation-delay:0.3s}
@keyframes dot{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.enter-btn{display:inline-block;margin-top:14px;padding:10px 20px;border-radius:10px;background:var(--accent);color:#022; text-decoration:none;font-weight:600}

/* titlebar */
.titlebar{position:fixed;top:18px;left:50%;transform:translateX(-50%);width:min(980px,calc(100% - 40px));display:flex;align-items:center;justify-content:space-between;padding:8px 14px;border-radius:12px;background:var(--glass);border:1px solid var(--glass-border);backdrop-filter:blur(6px)}
.title{font-weight:700;letter-spacing:1px}
.icon-btn{background:transparent;border:0;color:var(--text);font-size:20px;cursor:pointer}
.avatar{width:40px;height:40px;border-radius:10px}

/* chat area */
.chat-area{width:min(980px,calc(100% - 40px));margin-top:90px;display:flex;flex-direction:column;height:calc(100vh - 150px)}
.messages{flex:1;overflow:auto;padding:20px;display:flex;flex-direction:column;gap:12px}
.msg{max-width:75%;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.02)}
.msg.user{align-self:flex-end;background:linear-gradient(90deg,#1E293B,#0F1724);color:var(--text)}
.msg.bot{align-self:flex-start;background:rgba(255,255,255,0.02);color:var(--muted)}
.composer{display:flex;gap:8px;padding:12px;border-radius:12px;background:var(--glass);border:1px solid var(--glass-border);align-items:center}
.mode{background:transparent;border:1px solid rgba(255,255,255,0.06);padding:8px;border-radius:8px;color:var(--text)}
textarea{flex:1;resize:none;background:transparent;border:0;color:var(--text);outline:none;padding:8px;font-size:14px}
.send{background:linear-gradient(180deg,#60a5fa,#7c3aed);border:0;padding:10px 14px;border-radius:10px;color:#021;font-weight:700;cursor:pointer;box-shadow:0 6px 18px rgba(59,130,246,0.12)}

@media (max-width:640px){
  .titlebar{width:calc(100% - 28px);top:12px}
  .chat-area{margin-top:72px}
  .messages{padding:12px}
}

```
---

ဖိုင် ၄ — static/js/api.js (API hook — change API_BASE to your backend)
```
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
```

---

ဖိုင် ၅ — static/js/main.js (UI logic, localStorage chat history, typing)
```
const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const modeSelect = document.getElementById("modeSelect");

function addMessage(text, who="bot"){
  const el = document.createElement("div");
  el.className = "msg " + (who==="user" ? "user" : "bot");
  el.innerText = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  saveHistory();
}

function saveHistory(){
  const arr = Array.from(messagesEl.querySelectorAll(".msg")).map(n => ({text:n.innerText, cls: n.classList.contains("user") ? "user" : "bot"}));
  localStorage.setItem("wayne_history", JSON.stringify(arr));
}
function loadHistory(){
  const raw = localStorage.getItem("wayne_history");
  if(raw){
    JSON.parse(raw).forEach(m => {
      const el = document.createElement("div");
      el.className = "msg " + (m.cls === "user" ? "user":"bot");
      el.innerText = m.text;
      messagesEl.appendChild(el);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

async function handleSend(){
  const text = inputEl.value.trim();
  if(!text) return;
  addMessage(text, "user");
  inputEl.value = "";
  addMessage("typing...", "bot"); // placeholder
  const mode = modeSelect.value;
  const reply = await sendToBackend(text, mode);
  // replace last bot placeholder
  const botNodes = messagesEl.querySelectorAll(".msg.bot");
  const lastBot = botNodes[botNodes.length-1];
  if(lastBot) lastBot.innerText = reply;
  saveHistory();
}

sendBtn.addEventListener("click", handleSend);
inputEl.addEventListener("keydown", (e)=>{ if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); handleSend(); }});
window.addEventListener("load", loadHistory);

```

