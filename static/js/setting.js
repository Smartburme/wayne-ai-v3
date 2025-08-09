document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settingsForm");
  const usernameInput = document.getElementById("usernameInput");
  const themeSelect = document.getElementById("themeSelect");
  const statusMsg = document.getElementById("statusMsg");

  // Load settings from localStorage
  const savedTheme = localStorage.getItem("theme") || "dark";
  const savedUsername = localStorage.getItem("username") || "";
  themeSelect.value = savedTheme;
  usernameInput.value = savedUsername;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const theme = themeSelect.value;
    const username = usernameInput.value.trim();

    localStorage.setItem("theme", theme);
    localStorage.setItem("username", username);

    statusMsg.textContent = "Settings saved successfully!";

    // Optionally: apply theme immediately
    applyTheme(theme);
  });

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.style.background = "linear-gradient(135deg, #ffffff, #dddddd)";
      document.body.style.color = "#222";
    } else {
      document.body.style.background = "linear-gradient(135deg, #141E30, #243B55)";
      document.body.style.color = "#fff";
    }
  }

  // Apply theme on load
  applyTheme(savedTheme);
});
