document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const elements = {
    menuBtn: document.getElementById("menuBtn"),
    closeMenuBtn: document.getElementById("closeMenuBtn"),
    sideMenu: document.getElementById("sideMenu"),
    overlay: document.getElementById("overlay"),
    sendBtn: document.getElementById("sendBtn"),
    input: document.getElementById("input"),
    messages: document.getElementById("messages"),
    historyList: document.getElementById("historyList"),
    clearHistoryBtn: document.getElementById("clearHistoryBtn")
  };

  // State
  let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

  // ----------- Utility Functions -----------
  const saveToLocalStorage = () => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  };

  const scrollToBottom = () => {
    elements.messages.scrollTop = elements.messages.scrollHeight;
  };

  // ----------- Menu Controls -----------
  const toggleMenu = (show) => {
    elements.sideMenu.classList.toggle("active", show);
    elements.overlay.classList.toggle("active", show);
    document.body.style.overflow = show ? 'hidden' : '';
  };

  const setupMenuListeners = () => {
    elements.menuBtn.addEventListener("click", () => toggleMenu(true));
    elements.closeMenuBtn.addEventListener("click", () => toggleMenu(false));
    elements.overlay.addEventListener("click", () => toggleMenu(false));
  };

  // ----------- Message Handling -----------
  const addMessage = (text, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    
    // Add sender label for better UX
    const senderLabel = document.createElement("span");
    senderLabel.classList.add("sender-label");
    senderLabel.textContent = sender === 'user' ? 'You:' : 'WAYNE AI:';
    
    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = text;
    
    messageElement.appendChild(senderLabel);
    messageElement.appendChild(messageContent);
    elements.messages.appendChild(messageElement);
    scrollToBottom();
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

  // ----------- Chat History Management -----------
  const updateHistory = () => {
    elements.historyList.innerHTML = "";
    
    if (chatHistory.length === 0) {
      elements.historyList.innerHTML = "<p class='empty-history'>No history yet. Start chatting!</p>";
      return;
    }

    // Group messages by conversation (optional enhancement)
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    
    chatHistory.forEach(({ role, content }, index) => {
      const messageElement = document.createElement("p");
      messageElement.className = `history-message ${role}`;
      messageElement.textContent = `${role === 'user' ? 'You:' : 'AI:'} ${content}`;
      
      // Add click to load functionality
      messageElement.addEventListener('click', () => {
        loadHistoryToChat(index);
      });
      
      historyItem.appendChild(messageElement);
    });
    
    elements.historyList.appendChild(historyItem);
  };

  const loadHistoryToChat = (index) => {
    elements.messages.innerHTML = '';
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
      localStorage.removeItem('chatHistory');
    }
  };

  // ----------- Bot Simulation -----------
  const simulateBotReply = (userText) => {
    const botTyping = document.createElement("div");
    botTyping.classList.add("message", "bot", "typing");
    botTyping.innerHTML = `
      <span class="sender-label">WAYNE AI:</span>
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    elements.messages.appendChild(botTyping);
    scrollToBottom();

    setTimeout(() => {
      botTyping.remove();
      // More sophisticated bot response logic can go here
      const reply = generateBotResponse(userText);
      addMessage(reply, "bot");
      chatHistory.push({ role: "bot", content: reply });
      updateHistory();
      saveToLocalStorage();
    }, 1500 + Math.random() * 1000); // Random delay for more natural feel
  };

  const generateBotResponse = (userText) => {
  // အသုံးပြုသူရဲ့စာကြောင်းကို အခြေခံပြီး သင့်တော်တဲ့အဖြေတွေထုတ်ပေးမယ်
  const responses = [
    `ကျေးဇူးပြု၍ "${userText}" အကြောင်း နည်းနည်းထပ်ရှင်းပြပေးပါဦး။`,
    `"${userText}" နဲ့ပတ်သက်ပြီး စိတ်ဝင်စားစရာကောင်းပါတယ်။`,
    `ဒီမေးခွန်းအတွက် အဖြေက - "${userText.split('').reverse().join('')}" (ပြောင်းပြန်လှန်ကြည့်ထားတာပါ)`,
    `"${userText}" ဆိုတာ သိချင်နေတဲ့အကြောင်းအရာလား? ကျွန်တော်ကူညီနိုင်ပါတယ်။`,
    `ကျွန်တော်နားလည်တာက "${userText}" ဆိုတာပါ။ တခြားမေးစရာရှိသေးလား?`
  ];

  // ကျပန်းအဖြေတစ်ခုကိုရွေးချယ်
  return responses[Math.floor(Math.random() * responses.length)];
};

  // ----------- Navigation Handlers -----------
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
          if (chatHistory.length > 0 && !confirm("Start a new chat? Current chat will be saved in history.")) return;
          elements.messages.innerHTML = "";
          toggleMenu(false);
        }
      });
    });
  };

  // ----------- Initialization -----------
  const init = () => {
    setupMenuListeners();
    setupMessageListeners();
    setupNavigationListeners();
    
    elements.clearHistoryBtn.addEventListener("click", clearHistory);
    
    // Load any existing history
    updateHistory();
    
    // Focus input on load
    elements.input.focus();
    
    // Show welcome message if no history
    if (chatHistory.length === 0) {
      setTimeout(() => {
        addMessage("Hello! How can I help you today?", "bot");
      }, 1000);
    }
  };

  init();
});
