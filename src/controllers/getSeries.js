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

const deleteSeries = async (req, res) => {
  try {
    const _id = req.params.id;
    await Series.findByIdAndDelete(_id);
    res.status(200).json({ message: "Series deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Couldn't delete series: " + error.message });
  }
};

const updateSeries = async (req, res) => {
  try {
    const _id = req.params.id;
    const { title, description } = req.body;

    // Check if title and description are provided
    if (!title && !description) {
      return res
        .status(400)
        .json({ message: "Provide title or description to update." });
    }

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;

    await Series.findByIdAndUpdate(_id, updates);

    res.status(200).json({ message: "Series updated successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Couldn't update series: " + error.message });
  }
};

module.exports = {
  getAllSeries,
  getSeriesById,
  getSeriesByName,
  getSeriesByGenre,
  getSeriesBySlug,
  deleteSeries,
  updateSeries,
};
