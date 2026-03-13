const multer = require("multer")
const path = require("path")
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"*"
  }
});

/* ==============================
   Chat Events
============================== */

io.on("connection",(socket)=>{

  console.log("User connected:", socket.id);

  // Join private room
  socket.on("join-room",(room)=>{
    socket.join(room);
    console.log("User joined room:",room);
  });

  // Send message
  socket.on("send-message",(data)=>{
    io.to(data.room).emit("receive-message",data);
  });

  // Typing indicator
  socket.on("typing",(room)=>{
    socket.to(room).emit("typing");
  });

  // Read receipt
  socket.on("read",(room)=>{
    socket.to(room).emit("read");
  });

  // Disconnect
  socket.on("disconnect",()=>{
    console.log("User disconnected:",socket.id);
  });

});
const storage = multer.diskStorage({
destination:"uploads/",
filename:(req,file,cb)=>{
cb(null,Date.now()+path.extname(file.originalname))
}
})

const upload = multer({storage:storage})
app.use("/uploads",express.static("uploads"))
app.post("/upload",upload.single("image"),(req,res)=>{

const imageUrl = "http://localhost:3000/uploads/"+req.file.filename

res.json({url:imageUrl})

})

/* ==============================
   Start Server
============================== */

const PORT = 3000;

server.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});