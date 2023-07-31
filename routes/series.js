const express = require("express");
const router = express.Router();
const seriesController = require("../controllers/series"); // Import the series logic from the controllers

router.get("/", async (req, res) => {
  try {
    const seriesWithDetails = await seriesController.getSeries();
    res.json(seriesWithDetails);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
