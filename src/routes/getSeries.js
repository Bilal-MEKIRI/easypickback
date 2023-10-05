const express = require("express");
const router = express.Router();
const {
  getAllSeries,
  getSeriesById,
  getSeriesByName,
  getSeriesByGenre,
  getSeriesBySlug,
  updateSeries,
  deleteSeries,
} = require("../controllers/getSeries.js");

router.get("/series", getAllSeries);
router.get("/series/:id", getSeriesById);
router.get("/series/title/:title", getSeriesByName);
router.get("/series/slug/:slug", getSeriesBySlug);
router.get("/series/genre/:genre", getSeriesByGenre);
router.put("/series/:id", updateSeries);
router.delete("/series/:id", deleteSeries);

module.exports = router;
