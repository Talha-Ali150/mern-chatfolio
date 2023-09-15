const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  createRetainChat,
  getAllChats,
  createGroupChat,
} = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(protect, createRetainChat).get(protect, getAllChats);
router.route("/groupChat").post(protect, createGroupChat);
module.exports = router;
