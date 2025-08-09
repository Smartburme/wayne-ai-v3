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
    menuBtn.addEventListener("click", () => {
        sideMenu.classList.add("active");
        overlay.classList.add("active");
    });
    closeMenuBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    function closeMenu() {
        sideMenu.classList.remove("active");
        overlay.classList.remove("active");
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
        // Simulate bot reply
        setTimeout(() => {
            const botReply = "WAYNE AI: " + text.split("").reverse().join("");
            appendMessage(botReply, "bot");
            chatHistory.push({ role: "bot", content: botReply });
            updateHistory();
        }, 500);
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
            historyList.innerHTML = `<p class="empty-history">No history yet.</p>`;
            return;
        }
        chatHistory.forEach((item, idx) => {
            const p = document.createElement("p");
            p.textContent = `${item.role.toUpperCase()}: ${item.content}`;
            historyList.appendChild(p);
        });
    }

    // Clear history
    clearHistoryBtn.addEventListener("click", () => {
        chatHistory = [];
        messages.innerHTML = "";
        updateHistory();
    });
});
