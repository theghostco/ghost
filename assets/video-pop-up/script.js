  //videos buttons
  $('a[href^="#"][href*="youtube"], a[href^="#"][href*="youtu.be"], a[href^="#"][href*="vimeo"], a[href^="#"][href*="vimeo"]').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
  });


  //for vimeo
  $('a[href^="#"][href*="vimeo"], a[href^="#"][href*="vimeo"]').magnificPopup({
    type: 'iframe',
    zoom: {
      enabled: false
    },
    iframe: {
      markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +'</div>', 
      patterns: {
        vimeo: {
          index: 'vimeo.com/',
          id: '/',
          src: '//player.vimeo.com/video/%id%?autoplay=1'
        }
      },
      srcAction: 'iframe_src' 
    }
  });
  $('a[href^="#"][href*="youtube"], a[href^="#"][href*="youtu.be"]').magnificPopup({
    type: 'iframe',
    iframe: {
      markup: '<div class="mfp-iframe-scaler">' +
      '<div class="mfp-close"></div>' +
      '<iframe class="mfp-iframe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
      '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button
      patterns: {
        youtube: {
          index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
          //id: 'v=', // String that splits URL in a two parts, second part should be %id%
          //#https://youtube.com/watch?v=uHpE4P1_jxY&t=55
          id: function(url) { 
            var m = url.split('v=')[1];
            if(m.includes('&t=')){
              var videoId = m.split('&t=')[0],
                  timecode = m.split('&t=')[1];
              return videoId+'?start='+timecode+'&autoplay=1';
            }else{
              return m+'?autoplay=1'; 
            }
          },
          src: '//www.youtube.com/embed/%id%' // URL that will be set as a source for iframe.
        }
      },
      srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
    }
  });