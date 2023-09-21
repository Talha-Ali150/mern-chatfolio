const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  createRetainChat,
  getAllChats,
  createGroupChat,
  getAllUsers,
  addUserToGroup,
  removeUserFromGroup,
  getLoggedUserId,
} = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(protect, createRetainChat).get(protect, getAllChats);
router
  .route("/groupChat")
  .post(protect, createGroupChat)
  .put(protect, addUserToGroup)
  .delete(protect, removeUserFromGroup);
router.route("/getUsers").get(protect, getAllUsers);
router.route("/getLoggedUserId").get(protect, getLoggedUserId);

module.exports = router;
