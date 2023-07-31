const express = require("express");
const router = express.Router();
const {
  getAllSeries,
  getSeriesById,
  getSeriesByName,
  getSeriesByGenre,
} = require("../controllers/getSeries.js");

router.get("/series", getAllSeries);
router.get("/series/:id", getSeriesById);
router.get("/series/title/:title", getSeriesByName);
router.get("/series/genre/:genre", getSeriesByGenre);

module.exports = router;
