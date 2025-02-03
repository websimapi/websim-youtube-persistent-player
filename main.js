// Global variable to hold the YouTube player instance
let player;

// This function is called by the YouTube API once it's ready.
window.onYouTubeIframeAPIReady = function () {
  // Initially create an empty player with a blank video,
  // so that when a video is loaded later it persists.
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: "", // no video loaded initially
    playerVars: {
      autoplay: 0,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
    },
    events: {
      onReady: onPlayerReady,
      onError: onPlayerError,
    },
  });
};

function onPlayerReady(event) {
  // Player is ready; no specific action needed at load.
}

function onPlayerError(event) {
  console.error("YouTube Player Error:", event.data);
}

// Helper function to extract the YouTube video ID from a URL.
function extractVideoID(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

// Handle form submission to load a new video.
document.getElementById("videoForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const urlInput = document.getElementById("videoUrl").value.trim();
  const videoID = extractVideoID(urlInput);
  if (!videoID) {
    alert("Please enter a valid YouTube URL.");
    return;
  }

  // If the player is already loaded, cue the new video.
  if (player && typeof player.loadVideoById === "function") {
    player.loadVideoById({
      videoId: videoID,
      // Start from 0 seconds
      startSeconds: 0,
    });
  } else {
    // If for some reason player isn't ready, create a new one.
    player = new YT.Player("player", {
      height: "360",
      width: "640",
      videoId: videoID,
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event) => event.target.playVideo(),
        onError: onPlayerError,
      },
    });
  }
});