    //section names
    let isSection = document.querySelectorAll('.section-name');
    if (typeof(isSection) != 'undefined' && isSection != null){
      isSection.forEach(function(thisBlock){
        let sectionName = thisBlock.getAttribute('data-name');
        thisBlock.closest('section').classList.add(sectionName+'-section');
        //thisBlock.closest('.sqs-block-code').style.display = 'none';
      });
    }


      setTimeout(function() {
    if (!$('body').hasClass('sqs-edit-mode')) {
      $('.scale-plugin-section').wrapAll('<div class="scale-plugin-body"></div>');

      function wrapElements() {
        $(".scale-plugin-header-section, .scale-plugin-body").wrapAll("<div class='scale-plugin-wrapper'></div>");
      }

      wrapElements();
    }
  }, 50);



        $(document).ready(function() {
    $(window).scroll(function() {
      var bottom_of_window = $(window).scrollTop() + $(window).height();
      $('.scale-plugin-section').each(function(index) {
        var top_of_object = $(this).offset().top;
        var bottom_of_object = $(this).offset().top + $(this).outerHeight();


        if (bottom_of_window > top_of_object && $(window).scrollTop() < bottom_of_object) {
          if (index > 0 && index < $('.scale-plugin-section').length) {
            var scaleValue = 1 - ((bottom_of_window - top_of_object) / $(window).height()) * 0.3;
            $('.scale-plugin-section').eq(index - 1).css('transform', 'perspective(1200px) translateX(0px) translateY(0px) scale(' + scaleValue + ') rotate(0deg) rotateX(0deg) rotateY(0deg) translateZ(0px)');
          }
        } else if (index === $('.scale-plugin-section').length - 1 && $(window).scrollTop() >= bottom_of_object) {

          var scaleValue = 0.7;
          $('.scale-plugin-section').eq(index - 1).css('transform', 'perspective(1200px) translateX(0px) translateY(0px) scale(' + scaleValue + ') rotate(0deg) rotateX(0deg) rotateY(0deg) translateZ(0px)');
        }
      });
    });
  });