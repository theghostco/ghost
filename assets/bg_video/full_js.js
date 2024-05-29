
;(function(){

  let placeToPaste = document.querySelectorAll('[data-current-styles*="video"] .section-background')[0];
  if(document.body.contains(document.querySelectorAll('[data-current-styles*="video"]')[0])){

    function contentVideo(videoId){
      var my_awesome_script = document.createElement('script');
      my_awesome_script.setAttribute('src','https://player.vimeo.com/api/player.js');
      document.head.appendChild(my_awesome_script);
      return '<iframe src="//player.vimeo.com/video/'+videoId+'?&amp;background=1&amp;loop=1&amp;title=0&amp;byline=0&amp;portrait=1&amp;muted=1" frameborder="0" allow="autoplay; fullscreen" allowfullscreen="" class="custom--video"></iframe>'
    }
    
    document.querySelectorAll('[data-current-styles*="video"]')[0].classList.add('video-banner-section');
    placeToPaste.classList.add('video-b');

    let thisVideoId = placeToPaste.querySelector('.sqs-video-background').getAttribute('data-config-url').split('vimeo.com/')[1];

    let newPlace = placeToPaste.querySelectorAll('#player')[0]
    newPlace.insertAdjacentHTML('beforeend', contentVideo(thisVideoId));



    let videoSection = document.querySelectorAll('.page-section.video-banner-section')[0];
    if (typeof(videoSection) != 'undefined' && videoSection != null){   
      document.querySelectorAll('.page-section.video-banner-section').forEach(function(videoWrapper){   
        videoWrapper.closest('body').classList.add('page-with-video-banner');
      });   
    }

    function scaleVideo() {
      var defaultScale = 1.2;
      var scale = defaultScale;

      //if (ghostGlobalMobVideoScale.scaleVal === undefined || ghostGlobalMobVideoScale.scaleVal === null){}else{
        if (typeof ghostGlobalMobVideoScale.scaleVal === 'undefined'){}else{
          if(ghostGlobalMobVideoScale.scaleVal < defaultScale){
            if(ghostGlobalMobVideoScale.scaleVal >= 1){
              scale = defaultScale;
            }else{
              scale = ghostGlobalMobVideoScale.scaleVal;
            }
          }else{
            scale = ghostGlobalMobVideoScale.scaleVal;
          }
        }

        var playerIframe = document.querySelectorAll('.custom--video')[0];
        var videoDimensions = {
          'width': playerIframe.clientWidth,
          'height': playerIframe.clientHeight
        };
        var fallbackImg = null;
        var containerWidth = playerIframe.parentNode.clientWidth;
        var containerHeight = playerIframe.parentNode.clientHeight;

        var containerRatio = containerWidth / containerHeight;
        var videoRatio = videoDimensions.width / videoDimensions.height;
        var pWidth = 0;
        var pHeight = 0;

        if (containerRatio > videoRatio) {
        // at the same width, the video is taller than the window
        pWidth = containerWidth * scale;
        pHeight = containerWidth * scale / videoRatio;
        playerIframe.style.width = pWidth + 'px';
        playerIframe.style.height = pHeight + 'px';
      } else if (videoRatio > containerRatio) {
        // at the same width, the video is shorter than the window
        pWidth = containerHeight * scale * videoRatio;
        pHeight = containerHeight * scale;
        playerIframe.style.width = pWidth + 'px';
        playerIframe.style.height = pHeight + 'px';
      } else {
        // the window and video ratios match
        pWidth = containerWidth * scale;
        pHeight = containerHeight * scale;
        playerIframe.style.width = pWidth + 'px';
        playerIframe.style.height = pHeight + 'px';
      }
      playerIframe.style.left = 0 - (pWidth - containerWidth) / 2 + 'px';
      playerIframe.style.top = 0 - (pHeight - containerHeight) / 2 + 'px';
      playerIframe.style.opacity = 1;
      playerIframe.classList.add('background-video');

      
    }
    scaleVideo();
    window.addEventListener('resize', function(event) {
      setTimeout(function(){
        scaleVideo();
      }, 500)
    }, true);

    
  } else{
    return;
  }
}());
