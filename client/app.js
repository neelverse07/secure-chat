// ✅ SAFE START
window.addEventListener("load", () => {

  let socket;

  try {
    socket = io("https://secure-chat-es7i.onrender.com");
    console.log("Socket connected");
  } catch (e) {
    console.log("Socket failed:", e);
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

  // ENTER ROOM
  enterBtn.onclick = () => {
    const name = usernameInput.value.trim();
    const room = roomInput.value.trim();

    console.log("Clicked");

    if (!name || !room) {
      alert("Enter details");
      return;
    }

    myName = name;

    if (socket) {
      socket.emit("joinRoom", { username: name, room: room });
    }

    roomName.textContent = room;

    loginScreen.style.display = "none";
    chatScreen.style.display = "block";
  };

  // SEND MESSAGE
  sendBtn.onclick = sendMessage;

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    if (socket) {
      socket.emit("sendMessage", text);
    }

    addMessage(text, myName);

    messageInput.value = "";
  }

  // RECEIVE MESSAGE
  if (socket) {
    socket.on("receiveMessage", (data) => {
      addMessage(data.text, data.username);
    });
  }

  function addMessage(text, user) {
    const div = document.createElement("div");
    div.textContent = user + ": " + text;
    chatBox.appendChild(div);
  }

});