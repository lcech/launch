/*
 * Init Youtube Iframe API
 */
(function() {
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();


/*
 * Global Variable for available Youtube players
 */
var youtubePlayers = [],
  youtubePlayerIframes = [];

/*
 * Refresh iframes without enabled API
 */
function refreshIframeAPI() {
  for (var iframes = document.getElementsByTagName("iframe"), i = iframes.length; i--;) {
    if (/youtube.com\/embed/.test(iframes[i].src)) {
      youtubePlayerIframes.push(iframes[i]);
      if (iframes[i].src.indexOf('enablejsapi=') === -1) {
        iframes[i].src += (iframes[i].src.indexOf('?') === -1 ? '?' : '&') + 'enablejsapi=1';
      }
    }
  }
}

function onYouTubeIframeAPIReady() {
  refreshIframeAPI();
  for (var i = 0; i < youtubePlayerIframes.length; i++) {
    youtubePlayers.push(new YT.Player(youtubePlayerIframes[i], {
      events: {
        "onStateChange": onPlayerStateChange
      }
    }));
  }
}

function onPlayerStateChange(event) {
  var videoData;
  videoData = event.target.getVideoData();
  switch (event.data) {
  case YT.PlayerState.PLAYING:
    measure({event: "videoPlay", video: {id: videoData.video_id, title: videoData.title}});
    break;
  case YT.PlayerState.PAUSED:
    measure({event: "videoPause", video: {id: videoData.video_id, title: videoData.title, timePlayed: event.target.getCurrentTime()}});
    break;
  case YT.PlayerState.ENDED:
    measure({event: "videoEnd", video: {id: videoData.video_id, title: videoData.title, timePlayed: event.target.getCurrentTime()}});
    break;
  }
}
