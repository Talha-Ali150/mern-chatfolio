//importing mongoose library
const mongoose = require("mongoose");

//making an asynchronous function to connect to DataBase
const connectDatabase = async () => {
  //try and catch block is used for error handling and to prevent app from crashing
  try {
    //creating a variable named connection to store response data
    // "connect" method of mongoose is used to connect to database, it uses mongoURI to connect
    const connection = await mongoose.connect(process.env.MONGO_URI);

    //a console is passed to show the successful connection of database and the name of the host
    console.log("database connected", connection.connection.host);
  } catch (e) {
    //the error is logged in order to get knowledge of the error and resolve it
    console.log("error", e);
  }
};

// connect database function is exported to be used by the server
module.exports = connectDatabase;
