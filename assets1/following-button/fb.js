  ;(function(){
    let delay = 0.3;
    $('.sqs-video-icon').css('transition', 'all .3s linear');

    $('.sqs-block-video').each(function(){
      let $circle = $(this).find('.sqs-video-icon, #circle-for-plugin');

      $(this).on('mousemove', function(e){
        TweenLite.to($circle, 0.3, {
          css: {
            left: e.pageX - $(this).offset().left,
            top: e.pageY - $(this).offset().top,
          }
        });

        $(this).on('mouseleave', function(e){
          TweenLite.to($circle, 0.3,{
            css: {
              left: '50%',
              top: '50%',
            }
          });
        });
      });
    });
  }());