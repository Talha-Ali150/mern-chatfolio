//importing json web token library
const jwt = require("jsonwebtoken");

//making function to generate token using ID
//ID is passed as parameter
const generateToken = (id) => {
  //a method of jwt "sign" is passed the id, jwtSecret and other options such as expiry of token
  // and is retured to be used for authentication purpose
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//finally it's exported
module.exports = generateToken;
