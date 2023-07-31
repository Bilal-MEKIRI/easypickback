// Function to get YouTube video URLs
function getYoutubeVideoUrls(videos) {
  const youtubeBaseUrl = "https://www.youtube.com/watch?v=";

  return videos
    .filter((video) => video.type === "Trailer")
    .map((video) => ({
      name: video.name,
      url: `${youtubeBaseUrl}${video.key}`,
    }));
}

module.exports = {
  getYoutubeVideoUrls,
};
