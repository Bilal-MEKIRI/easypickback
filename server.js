const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { ENV, connectionToDataBase } = require("./config/env.js");
const { fetchAndSaveMovies } = require("./tmdbMoviesToMongoDB.js");
const { fetchAndSaveSeries } = require("./tmdbSeriesToMongoDB.js");

const PORT = ENV.PORT || 3000;

//Connection to the database
connectionToDataBase();

//Creating instance of express application
const app = express();
app.use(
  cors({
    origin: [
      "https://easy-puce-coati-tam.cyclic.cloud",
      "https://easy-puce-coati-tam.cyclic.cloud/series",
      "https://easy-puce-coati-tam.cyclic.cloud/movies",
      "https://easy-puce-coati-tam.cyclic.cloud/emails",
      "https://easypickmovies.fr",
      "http://localhost:3000",
    ], // or wherever your frontend is hosted
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies or authorization headers to be sent in cross-origin requests
  })
);
app.use(helmet());
app.use(express.json());

//Route for the movies
app.use("/", require("./routes/getMovies.js"));

//Route for the series
app.use("/", require("./routes/getSeries.js"));

//Route for users
app.use("/", require("./routes/users.js"));

//Route for emails
app.use("/", require("./routes/emails.js"));

// Configuration for initial data population
const populateData = false; // Set to true when you want to populate data; set to false after the initial population

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
