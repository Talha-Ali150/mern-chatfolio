// user model is imported
const User = require("../models/userModel");

// function to generate token is imported
const generateToken = require("../utils/generateToken");

// an asynchronous function is made to register user
const registerUser = async (req, res) => {
  try {
    //name,email,password and pic are extracted from the request body using destructuring
    const { name, email, password, pic } = req.body;

    //findOne is mongoose method to find a document in the database
    //here finOne takes the email to find if that email exists or not
    const userExists = await User.findOne({ email });

    // if email exists
    if (userExists) {
      //it immediately alerts the user to choose another email as this email is already taken
      //here early return approach is used
      return res.status(409).json({ message: "email already exists" });
    }

    //if the email is not already in use
    //crete method of model is shortcut for saving one or more documents to the database
    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    //if user is created successfully
    if (user) {
      //send the response with the details of the user
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
      //if failed to create user
      // response is sent highlighting failed to create user
    } else {
      res.status(400).json({ message: "failed to create user" });
    }

    //if there was a problem during the registration process that the server couldn't handle properly
  } catch (e) {
    res.status(500).json({ message: "an error occured while registration" });
  }
};

//an asynchronous function is made for logging in already registered users
const loginUser = async (req, res) => {
  //it extracts email and password from request body
  const { email, password } = req.body;

  try {
    // it checks if there is a user with the email provided
    const user = await User.findOne({ email });

    //if there is a user with the email provided and the users password in the database matches with the password we provided
    //we have made an asynchronous function in models
    //this function compares password
    //if user is found and password matches send reponse with details of the user
    if (user && (await user.matchPassword(password))) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });

      // if user or password not matches send this response
    } else {
      res.status(403).json("invalid username or password");
    }
    //if there was a problem during the log in process that the server couldn't handle properly
  } catch (e) {
    res.status(500).json({ message: "an error occured while logging in" });
  }
};

const users = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  try {
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    res.json(users);
  } catch (e) {
    res.status(401).json({ error: e });
  }
};

//both  the register and login functions are exported to be used by the routes
module.exports = { registerUser, loginUser, users };
