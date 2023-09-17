const mongoose = require("mongoose");
const dotenv = require("dotenv").config(); // this line is necessary to use the env if ommited the code wouldn't be able to access the .env file

const ENV = {
  //Definition of the PORT we'll be using for our app
  PORT: process.env.PORT,
};

const connectionToDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to database");
  } catch (error) {
    console.error(error);
    process.exit();
  }
};

module.exports = {
  ENV,
  connectionToDataBase,
};
