const axios = require("axios");
const mongoose = require("mongoose");
const SeriesModel = require("./models/series");
const { getYoutubeVideoUrls } = require("./utils/utils.js");
const moment = require("moment");

const apiKey = "92dcc9c5fe90c540e1edd57de433116f";
const baseImageUrl = "https://image.tmdb.org/t/p/w500";
const totalNumPages = 25; // Set the total number of pages you want to fetch (adjust as needed)

async function fetchAndSaveSeries() {
  try {
    for (let page = 1; page <= totalNumPages; page++) {
      const url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&language=en-US&page=${page}&sort_by=popularity.desc&api_key=${apiKey}`;
      const response = await axios.get(url);

      const transformedSeries = await Promise.all(
        response.data.results.map(async (series) => {
          const detailsUrl = `https://api.themoviedb.org/3/tv/${series.id}?api_key=${apiKey}`;
          const detailsResponse = await axios.get(detailsUrl);
          const seriesDetails = detailsResponse.data;

          const videosUrl = `https://api.themoviedb.org/3/tv/${series.id}/videos?api_key=${apiKey}`;
          const videosResponse = await axios.get(videosUrl);
          const trailers = getYoutubeVideoUrls(videosResponse.data.results);

          // Validate and parse the date string before assigning it to releaseDate
          const releaseDate =
            seriesDetails.first_air_date &&
            moment(seriesDetails.first_air_date).isValid()
              ? new Date(seriesDetails.first_air_date)
              : null;

          return {
            title: seriesDetails.name,
            description: seriesDetails.overview,
            imagePath: seriesDetails.poster_path
              ? `${baseImageUrl}${seriesDetails.poster_path}`
              : null,
            backdropUrl: seriesDetails.backdrop_path // Add the backdrop image URL
              ? `${baseImageUrl}${seriesDetails.backdrop_path}`
              : null,
            trailer: trailers,
            seasons: seriesDetails.numberOfSeasons,
            score: seriesDetails.vote_average,
            genre: seriesDetails.genres.map((genre) => genre.name).join(", "),
            releaseDate,
            fetchedAt: new Date(), // Add the fetchedAt field with the current timestamp
          };
        })
      );

      //   Check if each series already exists in the database by its release date and title
      //   If it exists, update the existing document; otherwise, create a new one
      for (const series of transformedSeries) {
        const existingSeries = await SeriesModel.findOneAndUpdate(
          { title: series.title },
          series,
          { upsert: true }
        );
        console.log(
          existingSeries
            ? "Series updated in the database"
            : "New series added to the database"
        );
      }
    }
    console.log("Series data saved to the database successfully!");
  } catch (error) {
    console.error("Error saving series data to the database:", error);
  }
}

module.exports = {
  fetchAndSaveSeries,
};
