const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const multer = require("multer")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

/* ---------- IMAGE UPLOAD ---------- */

const storage = multer.diskStorage({
destination:"uploads/",
filename:(req,file,cb)=>{
cb(null,Date.now()+path.extname(file.originalname))
}
})

const upload = multer({storage:storage})

app.use("/uploads",express.static("uploads"))

app.post("/upload",upload.single("image"),(req,res)=>{

const imageUrl = req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename

res.json({url:imageUrl})

})

/* ---------- SOCKET SERVER ---------- */

const server = http.createServer(app)

const io = new Server(server,{
cors:{
origin:"*",
methods:["GET","POST"]
}
})

io.on("connection",(socket)=>{

console.log("User connected:",socket.id)

socket.on("join-room",(room)=>{
socket.join(room)
})

socket.on("send-message",(data)=>{

io.to(data.room).emit("receive-message",{
room: data.room,
message: data.message,
sender: data.sender
})

})


socket.on("typing",(room)=>{
socket.to(room).emit("typing")
})

socket.on("read",(room)=>{
socket.to(room).emit("read")
})

socket.on("disconnect",()=>{
console.log("User disconnected")
})

})

/* ---------- ROOT ROUTE ---------- */

app.get("/",(req,res)=>{
res.send("Secure Couple Chat Server Running")
})

/* ---------- PORT ---------- */

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
console.log("Server running on port " + PORT)
})