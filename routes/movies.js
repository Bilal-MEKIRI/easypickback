const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movies");

router.get("/", async (req, res) => {
  try {
    const moviesWithDetails = await moviesController.getMovies();
    res.json(moviesWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send the error message as the response
  }
});

module.exports = router;
