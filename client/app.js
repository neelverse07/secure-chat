document.addEventListener("DOMContentLoaded", () => {

  let socket;

  try {
    socket = io("https://secure-chat-es7i.onrender.com");
  } catch (e) {
    console.log("Socket error:", e);
  }

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

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
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
  }

  // ENTER ROOM
  enterBtn.addEventListener("click", () => {
    const name = usernameInput.value.trim();
    const room = roomInput.value.trim();

    if (!name || !room) {
      alert("Enter name and room!");
      return;
    }

    myName = name;

    if (socket) {
      socket.emit("joinRoom", { username: name, room: room });
    }

    roomName.textContent = room.toUpperCase();

    loginScreen.style.display = "none";
    chatScreen.classList.add("active");

    addSysMsg("🔐 Connected to " + room.toUpperCase());
  });

  // SEND MESSAGE
  sendBtn.addEventListener("click", sendMessage);

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    if (socket) {
      socket.emit("sendMessage", text);
    }

    addMessage(text, myName, true);

    messageInput.value = "";
  }

  // RECEIVE
  if (socket) {
    socket.on("receiveMessage", (data) => {
      addMessage(data.text, data.username, data.username === myName);
    });
  }

});