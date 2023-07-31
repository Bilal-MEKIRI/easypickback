const axios = require("axios");
const mongoose = require("mongoose");
const MovieModel = require("./models/movies");
const { getYoutubeVideoUrls } = require("./utils/utils.js");

const apiKey = "92dcc9c5fe90c540e1edd57de433116f";
const baseImageUrl = "https://image.tmdb.org/t/p/w500";
const totalNumPages = 25; // Set the total number of pages you want to fetch (adjust as needed)

async function fetchAndSaveMovies() {
  try {
    for (let page = 1; page <= totalNumPages; page++) {
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=${page}&sort_by=popularity.desc&api_key=${apiKey}`;
      const response = await axios.get(url);

      const transformedMovies = await Promise.all(
        response.data.results.map(async (movie) => {
          const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
          const detailsResponse = await axios.get(detailsUrl);
          const movieDetails = detailsResponse.data;

          const videosUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`;
          const videosResponse = await axios.get(videosUrl);
          const trailers = getYoutubeVideoUrls(videosResponse.data.results);

          return {
            title: movieDetails.title,
            description: movieDetails.overview,
            imagePath: movieDetails.poster_path
              ? `${baseImageUrl}${movieDetails.poster_path}`
              : null,
            backdropUrl: movieDetails.backdrop_path // Add the backdrop image URL
              ? `${baseImageUrl}${movieDetails.backdrop_path}`
              : null,
            trailer: trailers,
            duration: parseInt(movieDetails.runtime, 10),
            score: movieDetails.vote_average,
            genre: movieDetails.genres.map((genre) => genre.name).join(", "),
            releaseDate: new Date(movieDetails.release_date),
            fetchedAt: new Date(), // Add the fetchedAt field with the current timestamp
          };
        })
      );

      // Check if each movie already exists in the database by its ID
      // If it exists, update the existing document; otherwise, create a new one
      for (const movie of transformedMovies) {
        const existingMovie = await MovieModel.findOneAndUpdate(
          { releaseDate: movie.releaseDate, title: movie.title },
          movie,
          { upsert: true }
        );
        console.log(
          existingMovie
            ? "Movie updated in the database"
            : "New movie added to the database"
        );
      }
    }
    console.log("Movies data saved to the database successfully!");
  } catch (error) {
    console.error("Error saving movies data to the database:", error);
  }
}

module.exports = {
  fetchAndSaveMovies,
};
