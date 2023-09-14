const express = require("express");
const { protect } = require("../middlewares/auth");
const createRetainChat = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(protect, createRetainChat);
module.exports = router;
