const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  getMovieByTitle,
  getMoviesByGenre,
} = require("../controllers/getMovies.js");

router.get("/movies", getAllMovies);
router.get("/movies/:id", getMovieById);
router.get("/movies/title/:title", getMovieByTitle);
router.get("/movies/genre/:genre", getMoviesByGenre);

module.exports = router;
