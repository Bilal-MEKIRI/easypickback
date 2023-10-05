const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  imagePath: String,
  backdropUrl: String,
  trailer: Array,
  duration: Number,
  score: Number,
  popularity: Number,
  genre: String,
  releaseDate: Date,
  fetchedAt: { type: Date, default: Date.now }, // Add a new field for fetchedAt with the default value as the current timestamp
  slug: String,
});

const Movies = mongoose.model("Movies", movieSchema);

module.exports = Movies;
