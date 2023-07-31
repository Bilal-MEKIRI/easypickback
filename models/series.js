const mongoose = require("mongoose");

const tvSchema = new mongoose.Schema({
  title: String,
  description: String,
  imagePath: String,
  backdropUrl: String,
  trailer: Array,
  seasons: Number,
  score: Number,
  genre: String,
  releaseDate: Date,
  fetchedAt: { type: Date, default: Date.now }, // Add a new field for fetchedAt with the default value as the current timestamp
});

const Series = mongoose.model("Series", tvSchema);

module.exports = Series;
