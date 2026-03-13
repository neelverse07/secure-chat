const socket = io("https://secure-chat-es7i.onrender.com/")

let room = ""

function joinRoom(){

room = document.getElementById("room").value

socket.emit("join-room",room)

}

function sendMessage(){

let msg = document.getElementById("message").value

if(msg === "") return

socket.emit("send-message",{
room:room,
message:msg
})

document.getElementById("message").value=""

}

socket.on("receive-message",(data)=>{

let div = document.createElement("div")

div.className="message"

if(data.message.startsWith("http")){

let img=document.createElement("img")

img.src=data.message

img.style.width="200px"

div.appendChild(img)

}else{

div.innerText=data.message

}

document.getElementById("chat").appendChild(div)

socket.emit("read",room)

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
async function sendImage(){

let file=document.getElementById("imageFile").files[0]

let formData=new FormData()

formData.append("image",file)

let response=await fetch("https://secure-chat-es7i.onrender.com/upload",{
method:"POST",
body:formData
})

let data=await response.json()

socket.emit("send-message",{
room:room,
message:data.url
})

}
