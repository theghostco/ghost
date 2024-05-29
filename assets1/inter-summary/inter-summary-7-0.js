window.Squarespace.onInitialize(Y, function() { 
  var isGallery = document.querySelectorAll('.summary-item-list-container.sqs-gallery-container')[0];

  if (typeof(isGallery) != 'undefined' && isGallery != null){

   window.onload = function() {
          //  alert(navigator.userAgent);
          if (navigator.userAgent.indexOf("Firefox") > 0 || navigator.userAgent.indexOf("MSIE 9.0")) {
            document.querySelectorAll('body')[0].classList.add('firefox-agent');
          }
        }
        var svgButtons = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="position:absolute"><symbol viewBox="0 0 11 17" aria-labelledby="icon--chevron-slider-desc icon--chevron-slider-title" id="icon--chevron-slider" xmlns="http://www.w3.org/2000/svg"><title id="icon--chevron-slider-title">chevron slider</title><desc id="icon--chevron-slider-desc">chevron slider</desc><path d="M8.85 10.607l-5.658 5.656a1 1 0 0 1-1.414 0L.364 14.85a1 1 0 0 1 0-1.414l4.95-4.95-4.95-4.95a1 1 0 0 1 0-1.414L1.778.707a1 1 0 0 1 1.414 0l7.071 7.071a1 1 0 0 1 0 1.414L8.85 10.607z"></path></symbol></svg>';
        document.querySelectorAll('body')[0].insertAdjacentHTML('beforeend', svgButtons);


        document.querySelectorAll('.summary-item-list-container.sqs-gallery-container').forEach(function(thisListGalleryContainer){
          thisListGalleryContainer.closest('section').classList.add('section-with-inter-summary');
          thisListGalleryContainer.classList.add('swiper-container');
        });

        var itemsCount = 0;

        document.querySelectorAll('.sqs-gallery-design-list .summary-item-list').forEach(function(thisListGallery){

          thisListGallery.classList.add('swiper-wrapper');


          thisListGallery.querySelectorAll('.summary-item').forEach(function(nodeSlide){
            nodeSlide.classList.add('swiper-slide');
            nodeSlide.insertAdjacentHTML('beforeend', '<a class="main-link" href="'+        nodeSlide.querySelectorAll(".summary-title-link")[0].getAttribute("href")+'"></a>')

            itemsCount++;
          });


          thisListGallery.insertAdjacentHTML('beforebegin', '<div class="slider-control"><div class="slider-control-inner"><div class="swiper-button-prev-custom"><figure><svg class="icon--chevron-slider"><use xlink:href="#icon--chevron-slider"></use></svg></figure></div><div class="swiper-button-next-custom"><figure><svg class="icon--chevron-slider"><use xlink:href="#icon--chevron-slider"></use></svg></figure></div></div></div>');

        });


        console.log(itemsCount);
        var loopParam = (itemsCount > 1) ? true : false;
        console.log(itemsCount + " = itemsCount")
        console.log(loopParam + " = loopParam");
        var descCounter = (itemsCount > 1) ? 2 : 1;
        console.log(descCounter);
        if(descCounter < 2){
          document.querySelectorAll('.section-with-inter-summary').forEach(function(thisSections){
            thisSections.classList.add('with-one-slide');
          })
        }

    //initialize swiper when document ready
    var mySwiper = new Swiper ('.swiper-container',{
      loop: loopParam,
      navigation: true,
      autoplay: false,
      slidesPerView: 1,
      breakpoints: {
        1050: {
          slidesPerView: descCounter,
          spaceBetween: 30
        }
      },
      spaceBetween: 30,
      navigation: {
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
        preloadImages: false,
        updateOnImagesReady: false
      }
    });

  }
});