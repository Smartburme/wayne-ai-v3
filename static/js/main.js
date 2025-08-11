document.addEventListener("DOMContentLoaded", () => {
  const el = {
    menuBtn: document.getElementById("menuBtn"),
    closeMenuBtn: document.getElementById("closeMenuBtn"),
    sideMenu: document.getElementById("sideMenu"),
    overlay: document.getElementById("overlay"),
    sendBtn: document.getElementById("sendBtn"),
    input: document.getElementById("input"),
    messages: document.getElementById("messages"),
    historyList: document.getElementById("historyList"),
    clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  };

  const API = {
    endpoint: "https://wayne-ai-v1.mysvm.workers.dev/api/chat", // 🔹 change to your worker endpoint if needed
    retries: 3,
    timeout: 10000,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  };

  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

  const saveHistory = () => localStorage.setItem("chatHistory", JSON.stringify(history));
  const scrollBottom = () => el.messages.scrollTop = el.messages.scrollHeight;
  const toggleMenu = (show) => {
    el.sideMenu.classList.toggle("active", show);
    el.overlay.classList.toggle("active", show);
    document.body.style.overflow = show ? "hidden" : "";
  };

  const msgUI = (text, sender) => {
    const wrap = document.createElement("div");
    wrap.className = `message ${sender}`;
    wrap.innerHTML = `<span class="sender-label">${sender === "user" ? "You:" : "WAYNE AI:"}</span>
                      <div class="message-content">${text}</div>`;
    el.messages.appendChild(wrap);
    scrollBottom();
  };

  const botTypingUI = () => {
    const div = document.createElement("div");
    div.className = "message bot typing";
    div.innerHTML = `<span class="sender-label">WAYNE AI:</span>
                     <div class="typing-indicator"><span></span><span></span><span></span></div>`;
    return div;
  };

  const fetchRetry = async (url, opts, retries, timeout) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeout);
        const res = await fetch(url, { ...opts, signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res;
      } catch (err) {
        if (i === retries) throw err;
        await new Promise(r => setTimeout(r, 500));
      }
    }
  };

  const sendBackend = async (message, mode = "text") => {
    try {
      const res = await fetchRetry(
        API.endpoint,
        { method: "POST", headers: API.headers, body: JSON.stringify({ message, mode }) },
        API.retries,
        API.timeout
      );
      const data = await res.json();
      return data.reply || "No reply from server";
    } catch (e) {
      console.error(e);
      return `Server error: ${e.message}`;
    }
  };

  const botReply = async (text) => {
    const typing = botTypingUI();
    el.messages.appendChild(typing);
    scrollBottom();

    const reply = await sendBackend(text);
    typing.remove();
    msgUI(reply, "bot");
    history.push({ role: "bot", content: reply });
    updateHistory();
    saveHistory();
  };

  const sendMsg = () => {
    const text = el.input.value.trim();
    if (!text) return;
    msgUI(text, "user");
    history.push({ role: "user", content: text });
    updateHistory();
    saveHistory();
    el.input.value = "";
    botReply(text);
  };

  const updateHistory = () => {
    el.historyList.innerHTML = history.length
      ? ""
      : "<p class='empty-history'>No history yet. Start chatting!</p>";
    if (!history.length) return;

    const box = document.createElement("div");
    box.className = "history-item";
    history.forEach(({ role, content }, idx) => {
      const p = document.createElement("p");
      p.className = `history-message ${role}`;
      p.textContent = `${role === "user" ? "You:" : "AI:"} ${content}`;
      p.addEventListener("click", () => {
        el.messages.innerHTML = "";
        history.slice(0, idx + 1).forEach(({ role, content }) => msgUI(content, role));
        toggleMenu(false);
      });
      box.appendChild(p);
    });
    el.historyList.appendChild(box);
  };

  const init = () => {
    el.menuBtn.onclick = () => toggleMenu(true);
    el.closeMenuBtn.onclick = () => toggleMenu(false);
    el.overlay.onclick = () => toggleMenu(false);
    el.sendBtn.onclick = sendMsg;
    el.input.onkeydown = e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMsg();
      }
    };
    el.clearHistoryBtn.onclick = () => {
      if (confirm("Clear all chat history?")) {
        history = [];
        el.messages.innerHTML = "";
        localStorage.removeItem("chatHistory");
        updateHistory();
      }
    };
    document.querySelectorAll(".menu-action").forEach(btn =>
      btn.onclick = e => {
        e.preventDefault();
        const act = btn.dataset.action || btn.textContent.toLowerCase();
        if (act.includes("setting")) location.href = "settings.html";
        else if (act.includes("about")) location.href = "about.html";
        else if (act.includes("new chat")) {
          if (history.length && !confirm("Start a new chat?")) return;
          el.messages.innerHTML = "";
          toggleMenu(false);
        }
      }
    );
    updateHistory();
    el.input.focus();
    if (!history.length) setTimeout(() => msgUI("Hello! How can I help you today?", "bot"), 800);
  };

  init();
});
