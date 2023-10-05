const mongoose = require("mongoose");

const emailsSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

const Emails = new mongoose.model("Emails", emailsSchema);

module.exports = Emails;
