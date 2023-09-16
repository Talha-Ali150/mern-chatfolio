const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  createRetainChat,
  getAllChats,
  createGroupChat,
  getAllUsers,
} = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(protect, createRetainChat).get(protect, getAllChats);
router.route("/groupChat").post(protect, createGroupChat);
router.route("/getUsers").get(protect, getAllUsers);
module.exports = router;
