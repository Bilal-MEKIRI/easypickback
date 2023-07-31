const express = require("express");
const cors = require("cors");
const { ENV, connectionToDataBase } = require("./config/env.js");
const { fetchAndSaveMovies } = require("./tmdbMoviesToMongoDB.js");
const { fetchAndSaveSeries } = require("./tmdbSeriesToMongoDB.js");

const PORT = ENV.PORT || 3000;

//Connection to the database
connectionToDataBase();

//Creating instance of express application
const app = express();

app.use(express.json());
app.use(cors());

// Route for movies
app.use("/movies", require("./routes/movies.js"));

// Route for series
app.use("/series", require("./routes/series.js"));

// Configuration for initial data population
const populateData = true; // Set to true when you want to populate data; set to false after the initial population

// Function to fetch and save data
async function fetchAndSaveData() {
  try {
    await fetchAndSaveSeries();
    await fetchAndSaveMovies();
    console.log("Data fetched and saved successfully!");
  } catch (error) {
    console.error("Error fetching and saving data:", error);
    process.exit(1); // Exit the process with an error code to indicate failure
  }
}

// Run the initial data population only when needed
if (populateData) {
  fetchAndSaveData()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on: http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Error starting the server:", error);
      process.exit(1); // Exit the process with an error code to indicate failure
    });
} else {
  // Start the server directly without updating the data
  app.listen(PORT, () => {
    console.log(`Server listening on: http://localhost:${PORT}`);
  });
}
