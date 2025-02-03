// Global variable to hold the YouTube player instance
let player;
let popoutWindow = null;

// This function is called by the YouTube API once it's ready.
window.onYouTubeIframeAPIReady = function () {
  // Initially create an empty player so that later videos persist.
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
  // Set additional attributes to allow picture-in-picture and autoplay.
  const iframe = player.getIframe();
  iframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  );
  iframe.setAttribute("allowfullscreen", "");
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
      startSeconds: 0,
    });
  } else {
    // If for some reason the player isn't ready, create a new one.
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

// Handle popout persistent player
document.getElementById("popoutBtn").addEventListener("click", () => {
  if (!player || !player.getVideoData().video_id) {
    alert("No video is currently loaded to pop out.");
    return;
  }
  // Get current video data and time.
  const videoData = player.getVideoData();
  const videoId = videoData.video_id;
  const currentTime = Math.floor(player.getCurrentTime());

  // Construct the URL with query parameters for the popup.
  const url = `popup.html?videoId=${videoId}&time=${currentTime}`;

  // Open the popup window.
  popoutWindow = window.open(url, "popoutPlayer", "width=640,height=360");

  // Optionally, you can pause the main player if you want to avoid duplicate audio.
  // Uncomment the next line to pause in the main window:
  // player.pauseVideo();
});

// Optionally, restore state from a popout if needed.