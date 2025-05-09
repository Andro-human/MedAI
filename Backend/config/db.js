const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)(
      `Connected to MongoDB Database ${mongoose.connection.host}`
    );
  } catch (error) {
    `MongoDB Database Error $error`;
  }
};

module.exports = connectDB;
