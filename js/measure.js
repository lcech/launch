/*global measure*/
(function(window, document, measureFunctionName) {
  /**
   * Init Event Queue
   */
  window[measureFunctionName] = function() {
    (window[measureFunctionName].q = window[measureFunctionName].q || []).push(arguments)
  };
   
})(window, document, 'measure');

/**
 * Request External Javascript Asynchronously
 * @param url {string}
 */
measure._requestAsyncScript = function (url) {
  var s = document.createElement('script'),
    x = document.getElementsByTagName('script')[0];
  s.type = 'text/javascript';
  s.async = true;
  s.src = url;
  x.parentNode.insertBefore(s, x);
};


/*
 * Adobe Launch / DEV
 */
measure._requestAsyncScript('https://assets.adobedtm.com/launch-EN739cecd6429046369516eef56eea02b2-development.js');

/*
 * Init Youtube Iframe API
 */
measure._requestAsyncScript('https://www.youtube.com/iframe_api');

/*
 * Global Variable for available Youtube players
 */
var youtubePlayers = [],
  youtubePlayerIframes = [];

/*
 * Refresh iframes without enabled API
 */
function refreshIframeAPI() {
  for (var iframes = document.getElementsByTagName('iframe'), i = iframes.length; i--;) {
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
        'onStateChange': onPlayerStateChange
      }
    }));
  }
}

function onPlayerStateChange(event) {
  var videoData;
  videoData = event.target.getVideoData();
  switch (event.data) {
  case YT.PlayerState.PLAYING:
    measure({event: 'videoPlay', video: {id: videoData.video_id, title: videoData.title}});
    break;
  case YT.PlayerState.PAUSED:
    measure({event: 'videoPause', video: {id: videoData.video_id, title: videoData.title, timePlayed: event.target.getCurrentTime()}});
    break;
  case YT.PlayerState.ENDED:
    measure({event: 'videoEnd', video: {id: videoData.video_id, title: videoData.title, timePlayed: event.target.getCurrentTime()}});
    break;
  }
}
