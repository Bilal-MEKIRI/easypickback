const axios = require("axios");
const { getYoutubeVideoUrls } = require("../utils/utils.js");

const apiKey = "92dcc9c5fe90c540e1edd57de433116f"; // Replace this with your actual TMDB API key
const baseImageUrl = "https://image.tmdb.org/t/p/w500"; // Base URL for images with width=500

async function getMovies() {
  try {
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${apiKey}`;
    const response = await axios.get(url);

    const moviesWithDetails = await Promise.all(
      response.data.results.map(async (movie) => {
        const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
        const detailsResponse = await axios.get(detailsUrl);
        const movieDetails = detailsResponse.data;

        const videosUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`;
        const videosResponse = await axios.get(videosUrl);
        const trailers = getYoutubeVideoUrls(videosResponse.data.results);

        return {
          id: movieDetails.id,
          title: movieDetails.title,
          overview: movieDetails.overview,
          posterUrl: movieDetails.poster_path
            ? `${baseImageUrl}${movieDetails.poster_path}`
            : null,
          backdropUrl: movieDetails.backdrop_path
            ? `${baseImageUrl}${movieDetails.backdrop_path}`
            : null,
          genres: movieDetails.genres.map((genre) => genre.name),
          releaseDate: movieDetails.release_date,
          voteAverage: movieDetails.vote_average,
          voteCount: movieDetails.vote_count,
          youtubeUrls: trailers, // Get YouTube video URLs for each movie
          // You can include more properties as needed
        };
      })
    );

    return moviesWithDetails; // Return the result instead of calling res.json()
  } catch (error) {
    throw new Error("Failed to fetch movies from TMDB API"); // Throw an error to propagate it to the route handler
  }
}

module.exports = {
  getMovies,
};
