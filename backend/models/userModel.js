// import mongoose library
const mongoose = require("mongoose");

//import bcryptjs library for encrypting password and making it secure
const bcrypt = require("bcryptjs");

// schema is defined
const userSchema = mongoose.Schema(
  {
    name: {
      // type is defined and passing it's necessary or not depends on required true or false
      type: String,
      required: true,
    },
    email: {
      // type is defined and passing it's necessary or not depends on required true or false
      type: String,
      //unique makes sure that no email should be repeated
      unique: true,
      required: true,
    },
    password: {
      // type is defined and passing it's necessary or not depends on required true or false
      type: String,
      required: true,
    },
    idAdmin: {
      // type is defined and passing it's necessary or not depends on required true or false
      type: Boolean,
      //default value is passed in case user has not selected something himself
      default: false,
      required: true,
    },
    pic: {
      type: String,
      //default value is passed in case user has not selected something himself
      default:
        "https://cdn-icons-png.flaticon.com/512/847/847969.png?w=360&t=st=1691752333~exp=1691752933~hmac=49e517354d0f015b7632af5b95093ff9765104dc66369e4eb6c8b235c911225e",
      required: true,
    },
  },
  //timestamps are also sent to database to keep record
  { timestamps: true }
);

//it's a middleware which is used to hash the password before the user is saved to the database
userSchema.pre("save", async function (next) {
  //if the password is not modified then save it using the next() to skip further process
  if (!this.isModified("password")) {
    return next();
  }
  try {
    //"genSalt" method of bcrypt is used to generate a salt
    const salt = await bcrypt.genSalt(10);

    //"hash" method of bcrypt is used to generate hash this method takes password and salt to generate encrypted password
    const hashedPassword = await bcrypt.hash(this.password, salt);

    //set the current password to hashed password
    this.password = hashedPassword;

    //proceed further
    next();

    //in case of any error
  } catch (e) {
    return next(e);
  }
});

//a custom asynchronous function to match the password in the db and the password provided by user
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    //"compare" method of bcrypt is used for comparing passwords and is returned
    return await bcrypt.compare(enteredPassword, this.password);

    //in case of any error
  } catch (e) {
    throw e;
  }
};

// "model" is method of mongoose to create a collection
const User = mongoose.model("User", userSchema);

//the User collection is exported to be used by controllers
module.exports = User;
