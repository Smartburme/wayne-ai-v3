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

    // Menu open/close
    menuBtn.addEventListener("click", () => toggleMenu(true));
    closeMenuBtn.addEventListener("click", () => toggleMenu(false));
    overlay.addEventListener("click", () => toggleMenu(false));
    function toggleMenu(show) {
        sideMenu.classList.toggle("active", show);
        overlay.classList.toggle("active", show);
    }

    // Send message
    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        appendMessage(text, "user");
        chatHistory.push({ role: "user", content: text });
        updateHistory();

        input.value = "";
        simulateBotReply(text);
    }

    function appendMessage(text, sender) {
        const msg = document.createElement("div");
        msg.className = `message ${sender}`;
        msg.textContent = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function updateHistory() {
        historyList.innerHTML = "";
        if (chatHistory.length === 0) {
            historyList.innerHTML = `<p>No history yet.</p>`;
            return;
        }
        chatHistory.forEach(item => {
            const p = document.createElement("p");
            p.textContent = `${item.role.toUpperCase()}: ${item.content}`;
            historyList.appendChild(p);
        });
    }

    function simulateBotReply(userText) {
        // Bot typing effect
        const botTyping = document.createElement("div");
        botTyping.className = "message bot";
        botTyping.textContent = "WAYNE AI is typing...";
        messages.appendChild(botTyping);
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
            botTyping.remove();
            const reply = "🤖 " + userText.split("").reverse().join("");
            appendMessage(reply, "bot");
            chatHistory.push({ role: "bot", content: reply });
            updateHistory();
        }, 800);
    }

    // Clear history
    clearHistoryBtn.addEventListener("click", () => {
        chatHistory = [];
        messages.innerHTML = "";
        updateHistory();
    });
}); 
