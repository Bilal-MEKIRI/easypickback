const Series = require("../models/series.js");

const getAllSeries = async (req, res) => {
  try {
    const series = await Series.find().limit();
    res.status(200).json(series);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getSeriesById = async (req, res) => {
  try {
    const id = await req.params.id;
    const series = await Series.findById(id);
    res.status(200).json(series);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getSeriesByName = async (req, res) => {
  try {
    const title = await req.params.title;
    const titleRegEx = new RegExp(title, "i");
    const series = await Series.find({ title: { $regex: titleRegEx } });
    res.status(200).json(series);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getSeriesBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const series = await Series.findOne({ slug: slug });
    res.status(200).json(series);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getSeriesByGenre = async (req, res) => {
  try {
    const genreString = await req.params.genre;
    const genreArray = genreString.split(",");
    const genreRegEx = new RegExp(genreArray.join("|"), "i");
    const series = await Series.find({ genre: { $regex: genreRegEx } });
    res.status(200).json(series);
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: error.message });
  }
};

module.exports = {
  getAllSeries,
  getSeriesById,
  getSeriesByName,
  getSeriesByGenre,
  getSeriesBySlug,
};
