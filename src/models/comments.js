const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assuming your User model is named "User"
  userEmail: { type: String, required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true }, //  To add movie/series ID
  createdAt: { type: Date, default: Date.now }, // Added a createdAt field for timestamp
});

const Comments = mongoose.model("Comments", commentsSchema);

module.exports = Comments;
