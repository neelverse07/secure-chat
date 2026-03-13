const socket = io("https://secure-chat-es7i.onrender.com/")

let room = ""
let username = ""

function joinRoom(){

username = document.getElementById("username").value
room = document.getElementById("room").value

if(username === "" || room === ""){
alert("Enter name and room")
return
}

socket.emit("join-room",room)

}

function sendMessage(){

let msg = document.getElementById("message").value

if(msg === "") return

socket.emit("send-message",{
room:room,
message:msg,
sender:username
})

document.getElementById("message").value=""

}

socket.on("receive-message",(data)=>{

let div = document.createElement("div")

let currentUser = username === data.sender

div.className = currentUser ? "message myMessage" : "message otherMessage"

let time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})

div.innerHTML = `

<div class="msgHeader">
<img src="https://api.dicebear.com/7.x/initials/svg?seed=${data.sender}" class="avatar">
${data.sender}
</div>

<div class="msgText">${data.message}</div>

<div class="msgFooter">
<span class="msgTime">${time}</span>
<span class="ticks">✔✔</span>
</div>
`

document.getElementById("chat").appendChild(div)

document.getElementById("chat").scrollTop =
document.getElementById("chat").scrollHeight

})

document.getElementById("message").addEventListener("input",()=>{

socket.emit("typing",room)

})

socket.on("typing",()=>{

document.getElementById("typing").innerText="Partner typing..."

setTimeout(()=>{
document.getElementById("typing").innerText=""
},2000)

})
