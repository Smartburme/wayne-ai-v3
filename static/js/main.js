document.addEventListener("DOMContentLoaded", () => {
  const elements = {
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

  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

  const saveToLocalStorage = () => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  };

  const scrollToBottom = () => {
    elements.messages.scrollTop = elements.messages.scrollHeight;
  };

  const toggleMenu = (show) => {
    elements.sideMenu.classList.toggle("active", show);
    elements.overlay.classList.toggle("active", show);
    document.body.style.overflow = show ? "hidden" : "";
  };

  const setupMenuListeners = () => {
    elements.menuBtn.addEventListener("click", () => toggleMenu(true));
    elements.closeMenuBtn.addEventListener("click", () => toggleMenu(false));
    elements.overlay.addEventListener("click", () => toggleMenu(false));
  };

  const addMessage = (text, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);

    const senderLabel = document.createElement("span");
    senderLabel.classList.add("sender-label");
    senderLabel.textContent = sender === "user" ? "You:" : "WAYNE AI:";

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = text;

    messageElement.appendChild(senderLabel);
    messageElement.appendChild(messageContent);
    elements.messages.appendChild(messageElement);
    scrollToBottom();
  };

  // Bot typing indicator ကို return လုပ်တဲ့ function
  const createBotTypingIndicator = () => {
    const botTyping = document.createElement("div");
    botTyping.classList.add("message", "bot", "typing");
    botTyping.innerHTML = `
      <span class="sender-label">WAYNE AI:</span>
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    return botTyping;
  };

  // https://wayne-ai-v1.mysvm.workers.dev ကို POST API call
  const sendToBackend = async (message, mode = "text") => {
    try {
      const res = await fetch("https://wayne-ai-v1.mysvm.workers.dev/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, mode }),
      });

      if (!res.ok) throw new Error(`Network response not ok: ${res.status}`);

      const data = await res.json();
      return data.reply ?? "No reply from server";
    } catch (e) {
      console.error("API error", e);
      return `Server error: ${e.message}`;
    }
  };

  // Bot reply ကို API ကနေ ရယူပြီး UI update
  const simulateBotReply = async (userText) => {
    const botTyping = createBotTypingIndicator();
    elements.messages.appendChild(botTyping);
    scrollToBottom();

    const reply = await sendToBackend(userText);

    botTyping.remove();
    addMessage(reply, "bot");
    chatHistory.push({ role: "bot", content: reply });
    updateHistory();
    saveToLocalStorage();
  };

  const sendMessage = () => {
    const text = elements.input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatHistory.push({ role: "user", content: text });
    updateHistory();
    saveToLocalStorage();

    elements.input.value = "";
    simulateBotReply(text);
  };

  const setupMessageListeners = () => {
    elements.sendBtn.addEventListener("click", sendMessage);
    elements.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  };

  const updateHistory = () => {
    elements.historyList.innerHTML = "";

    if (chatHistory.length === 0) {
      elements.historyList.innerHTML =
        "<p class='empty-history'>No history yet. Start chatting!</p>";
      return;
    }

    const historyItem = document.createElement("div");
    historyItem.className = "history-item";

    chatHistory.forEach(({ role, content }, index) => {
      const messageElement = document.createElement("p");
      messageElement.className = `history-message ${role}`;
      messageElement.textContent = `${role === "user" ? "You:" : "AI:"} ${content}`;

      messageElement.addEventListener("click", () => {
        loadHistoryToChat(index);
      });

      historyItem.appendChild(messageElement);
    });

    elements.historyList.appendChild(historyItem);
  };

  const loadHistoryToChat = (index) => {
    elements.messages.innerHTML = "";
    chatHistory.slice(0, index + 1).forEach(({ role, content }) => {
      addMessage(content, role);
    });
    toggleMenu(false);
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all chat history?")) {
      chatHistory = [];
      elements.messages.innerHTML = "";
      updateHistory();
      localStorage.removeItem("chatHistory");
    }
  };

  const setupNavigationListeners = () => {
    document.querySelectorAll(".menu-action").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const action = btn.dataset.action || btn.textContent.toLowerCase();

        if (action.includes("setting")) {
          window.location.href = "settings.html";
        } else if (action.includes("about")) {
          window.location.href = "about.html";
        } else if (action.includes("new chat")) {
          if (
            chatHistory.length > 0 &&
            !confirm("Start a new chat? Current chat will be saved in history.")
          )
            return;
          elements.messages.innerHTML = "";
          toggleMenu(false);
        }
      });
    });
  };

  const init = () => {
    setupMenuListeners();
    setupMessageListeners();
    setupNavigationListeners();

    elements.clearHistoryBtn.addEventListener("click", clearHistory);

    updateHistory();
    elements.input.focus();

    if (chatHistory.length === 0) {
      setTimeout(() => {
        addMessage("Hello! How can I help you today?", "bot");
      }, 1000);
    }
  };

  init();
});
