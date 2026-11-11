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
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Message = require("./models/messageModel");
const mongoose = require("mongoose");
const onlineUsers = new Map();
const { userRoom } = require("./utils/realtime");

//importing and using dotenv package for securing environment variables
const dotenv = require("dotenv").config();

//using CORS
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({ origin: frontendOrigin }));

//using middleware for parsing json requests
app.use(express.json());

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

const startServer = async () => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be configured");
  await connectDatabase();
  const server = app.listen(port, () => console.log(`server running on port: ${port}`));
  const io = socketIO(server, {
  pingInterval: 10000,
  pingTimeout: 15000,
  cors: {
    origin: frontendOrigin,
  },
  });

  app.set("io", io);

  io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication required"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id");
    if (!user) return next(new Error("User not found"));
    socket.userId = String(user._id);
    return next();
  } catch (error) {
    return next(new Error("Invalid authentication token"));
  }
  });

  io.on("connection", (socket) => {
  console.log(`${socket.id} connected to socket.io`);
  const userSockets = onlineUsers.get(socket.userId) || new Set();
  userSockets.add(socket.id);
  onlineUsers.set(socket.userId, userSockets);
  socket.join(userRoom(socket.userId));
  socket.broadcast.emit("presence:update", { userId: socket.userId, online: true });
  socket.on("presence:sync", () => {
    socket.emit("presence:snapshot", Array.from(onlineUsers.keys()));
  });
  socket.on("join chat", async (room) => {
    try {
      if (!mongoose.isValidObjectId(room)) return;
      socket.data.activeChat = String(room);
      const authorized = await Chat.exists({ _id: room, members: socket.userId });
      if (authorized && socket.data.activeChat === String(room)) socket.join(String(room));
    } catch (error) {
      socket.emit("socket error", "Unable to join chat");
    }
  });
  socket.on("leave chat", (room) => {
    if (socket.data.activeChat === String(room)) socket.data.activeChat = null;
    socket.leave(String(room));
  });
  socket.on("message:delivered", async ({ messageId } = {}) => {
    try {
      if (!mongoose.isValidObjectId(messageId)) return;
      const message = await Message.findById(messageId).select("sender chat");
      if (!message || String(message.sender) === socket.userId) return;
      const isMember = await Chat.exists({ _id: message.chat, members: socket.userId });
      if (!isMember) return;
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { deliveredTo: socket.userId } },
        { new: true }
      ).select("deliveredTo readBy");
      if (!updated) return;
      io.to(userRoom(message.sender)).emit("message:receipt", {
        messageId: String(messageId),
        chatId: String(message.chat),
        deliveredTo: (updated.deliveredTo || []).map(String),
        readBy: (updated.readBy || []).map(String),
      });
    } catch (error) {
      socket.emit("socket error", "Unable to update delivery status");
    }
  });
  socket.on("chat:read", async ({ chatId } = {}) => {
    try {
      if (!mongoose.isValidObjectId(chatId)) return;
      const isMember = await Chat.exists({ _id: chatId, members: socket.userId });
      if (!isMember) return;
      const unread = await Message.find({
        chat: chatId,
        sender: { $ne: socket.userId },
        readBy: { $ne: socket.userId },
      }).select("_id sender chat");
      if (!unread.length) return;
      const messageIds = unread.map((item) => item._id);
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $addToSet: { deliveredTo: socket.userId, readBy: socket.userId } }
      );
      const receipts = await Message.find({ _id: { $in: messageIds } }).select("_id chat sender deliveredTo readBy");
      for (const item of receipts) {
        io.to(userRoom(item.sender)).emit("message:receipt", {
          messageId: String(item._id),
          chatId: String(item.chat),
          deliveredTo: item.deliveredTo.map(String),
          readBy: item.readBy.map(String),
        });
      }
    } catch (error) {
      socket.emit("socket error", "Unable to update read status");
    }
  });
  socket.on("typing", (room) => {
    if (socket.rooms.has(String(room))) socket.to(String(room)).emit("user typing", { room: String(room), userId: socket.userId });
  });
  socket.on("stopped typing", (room) => {
    if (socket.rooms.has(String(room))) socket.to(String(room)).emit("user stopped typing", { room: String(room), userId: socket.userId });
  });
  socket.on("disconnect", () => {
    const sockets = onlineUsers.get(socket.userId);
    sockets?.delete(socket.id);
    if (sockets?.size === 0) {
      onlineUsers.delete(socket.userId);
      socket.broadcast.emit("presence:update", { userId: socket.userId, online: false });
    }
  });
  });
};

startServer().catch((error) => {
  console.error("server startup failed", error.message);
  process.exitCode = 1;
});
