// Get elements
const loginScreen = document.getElementById("loginScreen");
const chatScreen = document.getElementById("chatScreen");

const enterBtn = document.getElementById("enterBtn");
const sendBtn = document.getElementById("sendBtn");

const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");
const messageInput = document.getElementById("messageInput");

const chatBox = document.getElementById("chat");
const roomName = document.getElementById("roomName");

// Enter Room
enterBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  const room = roomInput.value.trim();

  if (!name || !room) {
    alert("Enter name and room!");
    return;
  }

  roomName.textContent = room;

  loginScreen.style.display = "none";
  chatScreen.classList.add("active");
});

// Send Message
sendBtn.addEventListener("click", sendMessage);

// Enter key support
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = messageInput.value.trim();

  if (!message) return;

  const msg = document.createElement("div");
  msg.className = "message";

  // IMPORTANT FIX (no "M" bug)
  msg.textContent = message;

  chatBox.appendChild(msg);

  messageInput.value = "";

  chatBox.scrollTop = chatBox.scrollHeight;
}