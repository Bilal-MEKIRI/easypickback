const axios = require("axios");
const { getYoutubeVideoUrls } = require("../utils/utils.js");

const apiKey = "92dcc9c5fe90c540e1edd57de433116f"; // Replace this with your actual TMDB API key
const baseImageUrl = "https://image.tmdb.org/t/p/w500"; // Base URL for images with width=500

async function getSeries() {
  try {
    const url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${apiKey}`;
    const response = await axios.get(url);

    const seriesWithDetails = await Promise.all(
      response.data.results.map(async (series) => {
        const detailsUrl = `https://api.themoviedb.org/3/tv/${series.id}?api_key=${apiKey}`;
        const detailsResponse = await axios.get(detailsUrl);
        const seriesDetails = detailsResponse.data;

        const videosUrl = `https://api.themoviedb.org/3/tv/${series.id}/videos?api_key=${apiKey}`;
        const videosResponse = await axios.get(videosUrl);
        const trailers = getYoutubeVideoUrls(videosResponse.data.results);

        return {
          id: seriesDetails.id,
          name: seriesDetails.name,
          overview: seriesDetails.overview,
          posterUrl: seriesDetails.poster_path
            ? `${baseImageUrl}${seriesDetails.poster_path}`
            : null,
          backdropUrl: seriesDetails.backdrop_path
            ? `${baseImageUrl}${seriesDetails.backdrop_path}`
            : null,
          genres: seriesDetails.genres.map((genre) => genre.name),
          firstAirDate: seriesDetails.first_air_date,
          voteAverage: seriesDetails.vote_average,
          voteCount: seriesDetails.vote_count,
          youtubeUrls: trailers, // Get YouTube video URLs for each series
          numberOfSeasons: seriesDetails.number_of_seasons,
          // You can include more properties as needed
        };
      })
    );

    return seriesWithDetails; // Return the result
  } catch (error) {
    throw new Error("Failed to fetch series from TMDB API"); // Throw an error to propagate it to the route handler
  }
}

module.exports = {
  getSeries,
};
