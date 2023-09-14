const Movies = require("../models/movies.js");

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movies.find().limit();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const id = await req.params.id;
    const movie = await Movies.findById(id);
    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getMovieByTitle = async (req, res) => {
  try {
    const title = await req.params.title;

    // Create a regular expression to match the provided title, ignoring case
    const titleRegex = new RegExp(title, "i");

    const movie = await Movies.find({ title: { $regex: titleRegex } });
    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getMovieBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    const movie = await Movies.findOne({ slug: slug });
    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getMoviesByGenre = async (req, res) => {
  try {
    const genreString = await req.params.genre;
    const genreArray = genreString.split(",");

    // Create a regular expression to match any genre in the genreArray
    const genreRegex = new RegExp(genreArray.join("|"), "i");

    // Use the regular expression to find movies with genres that match any genre in the genreArray
    const movies = await Movies.find({ genre: { $regex: genreRegex } });

    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  getMovieByTitle,
  getMoviesByGenre,
  getMovieBySlug,
};
