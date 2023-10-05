const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  getMovieByTitle,
  getMoviesByGenre,
  getMovieBySlug,
  deleteMovie,
  updateMovie,
} = require("../controllers/getMovies.js");

router.get("/movies", getAllMovies);
router.get("/movies/:id", getMovieById);
router.get("/movies/title/:title", getMovieByTitle);
router.get("/movies/slug/:slug", getMovieBySlug);
router.get("/movies/genre/:genre", getMoviesByGenre);
router.delete("/movies/:id", deleteMovie);
router.put("/movies/:id", updateMovie);

module.exports = router;
