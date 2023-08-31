const express = require("express");
const connectDatabase = require("./config/db");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/userRoutes");

const dotenv = require("dotenv").config();
app.use(cors());
app.use(express.json());
connectDatabase();

app.get("/", (req, res) => {
  res.json({ message: "server running success" });
});

app.use("/api/users", userRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port: ${port}`));
