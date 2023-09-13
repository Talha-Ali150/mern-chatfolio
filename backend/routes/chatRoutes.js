const express = require("express");
const accessChat = require("../controllers/chatControllers");
const { protect } = require("../middlewares/auth");
const router = express.Router();

router.route("/").post(protect, accessChat);
module.exports = router;
