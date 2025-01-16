const express=require('express')
const {notFound,errorHandler}=require('./middleware/errorMiddleware')
const app=express()
const path=require('path')

const dotenv=require('dotenv');
const connectDB = require('./config/db');
const userRoutes=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoute')
const messageRoutes=require('./routes/messageRoute')
dotenv.config();
connectDB()
app.use(express.json());
app.get("/api/chats",(req,res)=>{
  res.send('runing')
})
app.use('/api/user/',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes);


//deployment
const __dirname1=path.resolve();
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname1,"/frontend/dist")))

  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"frontend","dist","index.html"));
  })
}
else{
  app.get("/",(req,res)=>{
    res.send("api is runnig succesfully");
  })
}
//deployment

app.use(notFound)
app.use(errorHandler)

const PORT=5000||process.env.PORT;
const server=app.listen(PORT,console.log('server started'));

const io=require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:5173",
  }
})

io.on("connection",(socket)=>{
  console.log("connected to socket.io")
  socket.on("setup",(userData)=>{
    socket.join(userData._id);
    
    socket.emit("connected");
  })
  socket.on("join chat",(room)=>{
    socket.join(room);
    console.log("user joined room "+ room)
  });
  socket.on("typing",(room)=> socket.in(room).emit("typing"));
  socket.on("stop typing",(room)=> socket.in(room).emit("stop typing"));
  
  socket.on("new message",(newMessage)=>{
    var chat=newMessage.chat;
    if(!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user)=>{
      if(user._id===newMessage.sender._id) return;
      socket.in(user._id).emit("message recieved",newMessage);
    })
  })
  socket.off("setup",()=>{
    console.log('user disconnected');
    socket.leave(userData._id);
    
  })
})