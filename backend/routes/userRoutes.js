//importing express library
const express = require("express");

// exporting register and login function from controllers
const { registerUser, loginUser } = require("../controllers/userControllers");

//initializing express router
const router = express.Router();

//root route will be used to register user
router.route("/").post(registerUser);

// /login will be used to login user
router.route("/login").post(loginUser);

//router is exported to be used by the server
module.exports = router;
