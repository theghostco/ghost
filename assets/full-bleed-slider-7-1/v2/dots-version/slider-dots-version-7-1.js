
/* ��鏝� Ghost Plugin Code Start ��鏝� Copyright 2020. */
var isGallery = document.querySelectorAll('.summary-item-list-container.sqs-gallery-container')[0];

if (typeof(isGallery) != 'undefined' && isGallery != null){
  var navVal = false;
  if(globalGhostSliderV2DoTsParams.navigationArrows){
    navVal = true;
  }
  document.querySelectorAll('.summary-item-list-container.sqs-gallery-container').forEach(function(thisListGalleryContainer){
    thisListGalleryContainer.classList.add('swiper-container');
    thisListGalleryContainer.classList.add('is-nav-navVal-'+navVal);


  });

  document.querySelectorAll('.sqs-gallery-design-list .summary-item-list').forEach(function(thisListGallery){
    thisListGallery.closest('section').classList.add('section-with-full-width-slider');

    thisListGallery.classList.add('ghost-slideshow-7-1');

    thisListGallery.classList.add('swiper-wrapper');
    thisListGallery.querySelectorAll('.summary-item').forEach(function(nodeSlide){
      nodeSlide.classList.add('swiper-slide');
    });

    if(globalGhostSliderV2DoTsParams.transparentHeaderAboveSlider){
      thisListGallery.closest('section').classList.add('transparent-header-above-slider');
    }

    thisListGallery.querySelectorAll('.summary-excerpt a').forEach(function(buttonEl){
      buttonEl.classList.add('sqs-block-button-element--medium');
      buttonEl.classList.add('sqs-block-button-element');
    });
    thisListGallery.closest('.summary-item-list-container').classList.add(globalGhostSliderV2DoTsParams.textAlignment+'-alignment-parent');
    thisListGallery.classList.add(globalGhostSliderV2DoTsParams.textAlignment+'-alignment');

    thisListGallery.insertAdjacentHTML('afterend', '<div class="slider-control"><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div>');
  thisListGallery.insertAdjacentHTML('afterend', '<div class="swiper-pagination"></div>'); // Step One (pagination adding)

});

  var autoplayObject = false;

  if(globalGhostSliderV2DoTsParams.autoplay){
    autoplayObject = {
      delay: globalGhostSliderV2DoTsParams.autoplayDelay
    }
  }
  

  console.log(navVal);
  console.log('opt= '+ globalGhostSliderV2DoTsParams.navigationArrows)

  //initialize swiper when document ready
  var mySwiper = new Swiper ('.swiper-container',{
    loop: true,
    autoplay: autoplayObject,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      preloadImages: false,
      updateOnImagesReady: false
    }
  });



}
/* ��鏝� Ghost Plugin Code END ��鏝� */
