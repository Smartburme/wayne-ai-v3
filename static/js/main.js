document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");
  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");

  let chatHistory = [];

  // ----------- Menu Controls -----------
  const toggleMenu = (show) => {
    sideMenu.classList.toggle("active", show);
    overlay.classList.toggle("active", show);
  };
  menuBtn.addEventListener("click", () => toggleMenu(true));
  closeMenuBtn.addEventListener("click", () => toggleMenu(false));
  overlay.addEventListener("click", () => toggleMenu(false));

  // ----------- Send Message Handler -----------
  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatHistory.push({ role: "user", content: text });
    updateHistory();

    input.value = "";
    simulateBotReply(text);
  };

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ----------- Message Rendering -----------
  const addMessage = (text, sender) => {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  };

  // ----------- Chat History UI Update -----------
  const updateHistory = () => {
    historyList.innerHTML = "";
    if (chatHistory.length === 0) {
      historyList.innerHTML = "<p>No history yet.</p>";
      return;
    }
    chatHistory.forEach(({ role, content }) => {
      const p = document.createElement("p");
      p.textContent = `${role.toUpperCase()}: ${content}`;
      historyList.appendChild(p);
    });
  };

  // ----------- Simulate Bot Reply -----------
  const simulateBotReply = (userText) => {
    const botTyping = document.createElement("div");
    botTyping.classList.add("message", "bot");
    botTyping.textContent = "WAYNE AI is typing...";
    messages.appendChild(botTyping);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      botTyping.remove();
      const reply = "🤖 " + userText.split("").reverse().join("");
      addMessage(reply, "bot");
      chatHistory.push({ role: "bot", content: reply });
      updateHistory();
    }, 800);
  };

  // ----------- Clear History -----------
  clearHistoryBtn.addEventListener("click", () => {
    chatHistory = [];
    messages.innerHTML = "";
    updateHistory();
  });

  // ----------- Menu Action Links -----------
  document.querySelectorAll(".menu-action").forEach((btn) => {
    const text = btn.textContent.toLowerCase();
    if (text.includes("setting")) {
      btn.addEventListener("click", () => (window.location.href = "setting.html"));
    } else if (text.includes("about")) {
      btn.addEventListener("click", () => (window.location.href = "about.html"));
    }
  });
});
