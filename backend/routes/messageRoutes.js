const express = require("express");
const {
  sendMessage,
  fetchChatMessages,
} = require("../controllers/messageControllers");
const { protect } = require("../middlewares/auth");
const router = express.Router();
router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, fetchChatMessages);
module.exports = router;
