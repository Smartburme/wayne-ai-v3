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
