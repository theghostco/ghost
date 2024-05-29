

  /* 

⚠️ Ghost Plugin Code Start ⚠️ 
Copyright 2020.

*/
var isGallery = document.querySelectorAll('.summary-item-list-container.sqs-gallery-container')[0];


if (typeof(isGallery) != 'undefined' && isGallery != null){



  document.querySelectorAll('.summary-item-list-container.sqs-gallery-container').forEach(function(thisListGalleryContainer){
    thisListGalleryContainer.classList.add('swiper-container');
  });

  document.querySelectorAll('.sqs-gallery-design-list .summary-item-list').forEach(function(thisListGallery){
    thisListGallery.closest('section').classList.add('section-with-full-width-slider');
    thisListGallery.classList.add('ghost-slideshow-7-1');

    thisListGallery.classList.add('swiper-wrapper');
    thisListGallery.querySelectorAll('.summary-item').forEach(function(nodeSlide){
      nodeSlide.classList.add('swiper-slide');
    });




    if(globalGhostSliderV2Params.transparentHeaderAboveSlider){
      thisListGallery.closest('section').classList.add('transparent-header-above-slider');
    }

    thisListGallery.querySelectorAll('.summary-excerpt a').forEach(function(buttonEl){
      buttonEl.classList.add('sqs-block-button-element--medium');
      buttonEl.classList.add('sqs-button-element--primary');
      buttonEl.classList.add('sqs-block-button-element');
    });

    thisListGallery.closest('.summary-item-list-container').classList.add(globalGhostSliderV2Params.textAlignment+'-alignment-parent');
    thisListGallery.classList.add(globalGhostSliderV2Params.textAlignment+'-alignment');

    thisListGallery.insertAdjacentHTML('afterend', '<div class="slider-control"><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div>');

  });

  var autoplayObject = false;

  if(globalGhostSliderV2Params.autoplay){
    autoplayObject = {
      delay: globalGhostSliderV2Params.autoplayDelay
    }
  }


  //initialize swiper when document ready
  var mySwiper = new Swiper ('.swiper-container',{
    loop: true,
    navigation: true,
    autoplay: autoplayObject,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      preloadImages: false,
      updateOnImagesReady: false
    }

  });

}


  /* 

⚠️ Ghost Plugin Code END ⚠️ 

*/


