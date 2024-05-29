
/* default settings for user */

/* end of def settings */

window.Squarespace.onInitialize(Y, function() {
  var globalGhostSliderV2DoTsParams = {
    transparentHeaderAboveSlider: globalGhostChapterParams.transparentHeaderAboveSlider, // available options: true and false
    textAlignment: globalGhostChapterParams.textAlignment, // available options: 'center', 'left',
    autoplay: false, // available options: true and false
    autoplayDelay: 5000, // set in milliseconds
    navigationArrows: true, // available options: true and false
    showBullets: globalGhostChapterParams.showBullets
  }
  /* Ghost Plugin Code Start Copyright 2020. */
  var isGallery = document.querySelectorAll('.summary-item-list-container.sqs-gallery-container')[0];


  if (typeof(isGallery) != 'undefined' && isGallery != null){
    var navVal = false;
    if(globalGhostSliderV2DoTsParams.navigationArrows){
      navVal = true;
    }

    var bulletVal = false;
    if(globalGhostSliderV2DoTsParams.showBullets){
      bulletVal = true;
    }

    document.querySelectorAll('.summary-item-list-container.sqs-gallery-container').forEach(function(thisListGalleryContainer){
      thisListGalleryContainer.classList.add('swiper-container');
      thisListGalleryContainer.classList.add('is-nav-navVal-'+navVal);
      thisListGalleryContainer.classList.add('is-bullet-bulletVal-'+bulletVal);
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
    console.log('opt= '+ globalGhostSliderV2DoTsParams.navigationArrows);

    /*initialize swiper when document ready*/
    var interleaveOffset = 0.5;
    var mySwiper = new Swiper ('.swiper-container',{
      loop: true,
      autoplay: false,
      loop: false,
      speed: 1000,
      grabCursor: true,
      watchSlidesProgress: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        preloadImages: false,
        updateOnImagesReady: false
      },
      on: {
        progress: function() {
          var swiper = this;
          for (var i = 0; i < swiper.slides.length; i++) {
            var slideProgress = swiper.slides[i].progress;
            var innerOffset = swiper.width * interleaveOffset;
            var innerTranslate = slideProgress * innerOffset;
            swiper.slides[i].querySelector(".summary-thumbnail-outer-container").style.transform =
            "translate3d(" + innerTranslate + "px, 0, 0)";
          }      
        },
        touchStart: function() {
          var swiper = this;
          for (var i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = "";
          }
        },
        setTransition: function(speed) {
          var swiper = this;
          for (var i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = speed + "ms";
            swiper.slides[i].querySelector(".summary-thumbnail-outer-container").style.transition =
            speed + "ms";
          }
        }
      }

    });     
  }
});


//2
document.addEventListener('DOMContentLoaded', function() {

  var allowScroll = true;

  /* add cursor */
  var createCursor = document.createElement('div')
  createCursor.classList.add('cursor-wraopper')
  createCursor.innerHTML = '<div class="cursor"> <div class="cursor__circle"> <svg height="64" width="64"><circle cx="32" cy="32" r="16"></circle> </svg> </div> </div>'
  var getAll = document.querySelectorAll('.slider-control')
  getAll.forEach(function(thisEl){
    thisEl.appendChild(createCursor)
  })

  
  if(allowScroll === true) {

    var excerptBody = document.querySelectorAll('.ghost-slideshow-7-1 .summary-content');

    excerptBody.forEach(function(thisEl){

      thisEl.insertAdjacentHTML('beforeend', '<div class="arrow-down"><a href="#scroll-here"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" viewBox="0 0 378 378"> <path d="M189 23.1c44.3 0 86 17.3 117.3 48.6 31.3 31.3 48.6 73 48.6 117.3 0 44.3-17.3 86-48.6 117.3 -31.3 31.3-73 48.6-117.3 48.6s-86-17.3-117.3-48.6C40.4 275 23.1 233.3 23.1 189c0-44.3 17.3-86 48.6-117.3C103 40.4 144.7 23.1 189 23.1M189 0C84.6 0 0 84.6 0 189c0 104.4 84.6 189 189 189s189-84.6 189-189C378 84.6 293.4 0 189 0L189 0z"></path> <polygon points="192.2 256.6 95.3 159.7 111.6 143.4 192.2 223.9 272.7 143.4 289 159.7 "></polygon></svg></a></div>');
        //thisEl.setAttribute('href', '#scroll-here');

        //}
      });
  } else if (allowScroll === false) {
    getScroll.forEach(function(thisEl){
      thisEl.classList.add('hidden-scroll');
      thisEl.style.display = 'none';
    });
  }

  const $cursor = document.querySelector('.cursor__circle');
  const $hover = document.querySelectorAll('.swiper-button-next, .swiper-button-prev');
  document.querySelector(".swiper-button-next").addEventListener('mousemove', onMouseMove);
  document.querySelector(".swiper-button-prev").addEventListener('mousemove', onMouseMove);
  document.querySelector(".arrow-down").addEventListener('mousemove', onMouseMove);
  for (let i = 0; i < $hover.length; i++) { $hover[i].addEventListener('mouseenter', onMouseHover); $hover[i].addEventListener('mouseleave', onMouseHoverOut);
}
function onMouseMove(e) {
  TweenMax.to($cursor, .4, {
    x: e.clientX,
    y: e.clientY
  })
}
function onMouseHover() {
  TweenMax.to($cursor, .4, {
    opacity: 1,
    scale: 1.2
  })
}
function onMouseHoverOut() {
  TweenMax.to($cursor, .4, {
    scale: 1,
    opacity: 0
  })
}

/*split title*/
var getBtn = document.querySelectorAll('.ghost-slideshow-7-1 .summary-title');
getBtn.forEach(function(thisEl){
  var theText = thisEl.querySelector('a').textContent
  console.log(theText)
  theText = theText.split('|');
  thisEl.textContent = '';
  if(theText[0] != ''){
    var subheading = document.createElement('div');
    subheading.classList.add('subheading');
    subheading.textContent = theText[0];
    thisEl.appendChild(subheading);
  };

  var item = document.createElement('span');
  item.classList.add('heading');
  item.textContent = theText[1];
  thisEl.appendChild(item);
});

/* add class to body if slider exist */
if(!document.getElementsByClassName('.ghost-slideshow-7-1').length){
  document.body.classList.add('custom-slider');
  var sectionCreateId = document.querySelector('section:nth-child(2)');
  if (typeof(sectionCreateId) != 'undefined' && sectionCreateId != null)
  {
    sectionCreateId.id = "scroll-here";
  }
}

})


