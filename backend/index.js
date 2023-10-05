//importing express framework to create server
const express = require("express");

//importing create database function from config folder
const connectDatabase = require("./config/db");

//importing cors (cross origin resource sharing) to accept requests from made from one port to another
const cors = require("cors");

//initializing express app
const app = express();

//importing routes related to user
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");

//importing socket.io for realtime applications
const socketIO = require("socket.io");

//importing and using dotenv package for securing environment variables
const dotenv = require("dotenv").config();

//using CORS
app.use(cors());

//using middleware for parsing json requests
app.use(express.json());

//executing the connect to database function
connectDatabase();

//made a simple route at root '/' to check if server is working properly
//req and res parameters passed for request and response
app.get("/", (req, res) => {
  //using res parameter to send response of req
  res.json({ message: "server running success" });
});

//using the routes made for users
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

//specifying the port in case there is no port number specified in .env file
const port = process.env.PORT || 5000;

//starting up the server on given port
const server = app.listen(port, () =>
  console.log(`server running on port: ${port}`)
);

const io = socketIO(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

//sending message  to client
// io.on("connection", (socket) => {
//   socket.emit("first", "second message");
// });

// io.on("connection", (socket) => {
//   console.log("connected to socket.io");
//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log(`user joined room: ${room}`);
//   });
//   socket.on("new message", (msg) => {
//     console.log("this si message", msg);
//     let chat = msg.chat;
//     if (!chat.members) {
//       return console.log("chat members not defined");
//     }
//     chat.members.forEach((member) => {
//       if (member._id === msg.sender._id) {
//         return;
//       }
//       socket.in(member._id).emit("message received", msg);
//     });
//   });
// });

//receiving message from client
// io.on("connection", (socket) => {
//   socket.on("first", (name) => {
//     console.log(name);
//   });
// });

// io.on("connection", (socket) => {
//   console.log("connected to socket.io ...");
//   socket.on("join room", (room) => {
//     socket.join(room);
//     console.log(`user joined room: ${room}`);
//   });
//   socket.on("send message", (msg) => {
//     console.log(`this is message: ${msg}`);
//   });
// });

io.on("connection", (socket) => {
  console.log(`${socket.id} connected to socket.io`);
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`user joined room: ${room}`);
  });
  socket.on("new message", (msgDet) => {
    socket.to(msgDet.room).emit("my message", msgDet.msg);
  });

  // socket.on("typing", (room) => {
  //   socket.to(room).emit("user typing", room);
  // });
  // socket.on("stopped typing", (room) => {
  //   socket.to(room).emit("user stopped typing", room);
  // });

  // socket.on("typing", (room) => {
  //   socket.to(room.id).emit("user typing", `${room.user} is typing`);
  // });

  // socket.on("stopped typing", (room) => {
  //   socket
  //     .to(room.id)
  //     .emit("user stopped typing", `${room.user} has stopped typing`);
  // });

  socket.on("typing", (room) => {
    socket.to(room).emit("user typing");
  });
  socket.on("stopped typing", (room) => {
    socket.to(room).emit("user stopped typing");
  });
});
