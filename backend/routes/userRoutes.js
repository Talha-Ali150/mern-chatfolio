//importing express library
const express = require("express");

// exporting register and login function from controllers
const {
  registerUser,
  loginUser,
  users,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/auth");

//initializing express router
const router = express.Router();

//root route will be used to register user
router.route("/").post(registerUser).get(protect, users);

// /login will be used to login user
router.route("/login").post(loginUser);

//router is exported to be used by the server
module.exports = router;
