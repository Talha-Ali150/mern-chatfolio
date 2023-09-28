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

const socketIO = require("socket.io");
const io = socketIO(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("a user connected");
});
