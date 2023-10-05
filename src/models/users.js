const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  loginAttempts: { type: Number, default: 0 }, // Tracks the number of failed login attempts
  lockUntil: { type: Date, default: null }, // Timestamp indicating when the account will be unlocked
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
