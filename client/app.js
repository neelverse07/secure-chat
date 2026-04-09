const loginScreen = document.getElementById("loginScreen");
const chatScreen = document.getElementById("chatScreen");
const enterBtn = document.getElementById("enterBtn");
const sendBtn = document.getElementById("sendBtn");
const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");
const messageInput = document.getElementById("messageInput");
const chatBox = document.getElementById("chat");
const roomName = document.getElementById("roomName");

let myName = "";

// ── Helpers ──

function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function addMessage(text, username, isSelf) {
  const row = document.createElement("div");
  row.className = "msg-row " + (isSelf ? "self" : "other");

  const nameEl = document.createElement("div");
  nameEl.className = "msg-name";
  nameEl.textContent = username;

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;

  const time = document.createElement("div");
  time.className = "msg-time";
  time.textContent = getTime();

  row.appendChild(nameEl);
  row.appendChild(bubble);
  row.appendChild(time);

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addSysMsg(text) {
  const el = document.createElement("div");
  el.className = "sys-msg";
  el.textContent = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ── Enter Room ──

enterBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  const room = roomInput.value.trim();

  if (!name || !room) {
    alert("Enter your name and a room code.");
    return;
  }

  myName = name;
  roomName.textContent = room.toUpperCase();

  loginScreen.style.display = "none";
  chatScreen.classList.add("active");

  addSysMsg("Encrypted channel established · " + room.toUpperCase());
});

// ── Send Message ──

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text, myName, true);
  messageInput.value = "";
}
