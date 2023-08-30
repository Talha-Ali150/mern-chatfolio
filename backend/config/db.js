const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected", connection.connection.host);
  } catch (e) {
    console.log("error", e);
  }
};
module.exports = connectDatabase;
