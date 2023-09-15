const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  createRetainChat,
  getAllChats,
} = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(protect, createRetainChat).get(protect, getAllChats);
module.exports = router;
