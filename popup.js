// Retrieve query parameters for videoId and start time.
function getQueryParams() {
  const params = {};
  window.location.search
    .substring(1)
    .split("&")
    .forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
    });
  return params;
}

const { videoId, time } = getQueryParams();

// Global variable for the player instance in the popup.
let popupPlayer;

// This function is called by the YouTube API once it's ready.
window.onYouTubeIframeAPIReady = function () {
  // Create a player starting from the specified time.
  popupPlayer = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: videoId || "",
    playerVars: {
      autoplay: 1,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      start: parseInt(time, 10) || 0,
    },
    events: {
      onReady: onPopupPlayerReady,
      onError: onPopupPlayerError,
    },
  });
};

function onPopupPlayerReady(event) {
  const iframe = popupPlayer.getIframe();
  iframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  );
  iframe.setAttribute("allowfullscreen", "");
  // Ensure the video begins playing.
  event.target.playVideo();
  // Force focus to the popup window so that it stays active 
  // (this can help on some browsers when switching tabs).
  window.focus();
}

function onPopupPlayerError(event) {
  console.error("YouTube Popup Player Error:", event.data);
}

// Handle closing the popup.
document.getElementById("closeBtn").addEventListener("click", () => {
  window.close();
});

// In case the DOM is loaded before the YouTube API is ready,
// ensure the window is focused.
document.addEventListener("DOMContentLoaded", () => {
  window.focus();
});