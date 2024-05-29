

var isGallery = document.querySelectorAll('.summary-item-list-container.sqs-gallery-container')[0];

if (typeof(isGallery) != 'undefined' && isGallery != null){

  var svgIcon = '<svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" style="display: none;" height="1792" viewBox="0 0 1792 1792" width="1792"><path id="quote-svg" d="M832 960v384q0 80-56 136t-136 56h-384q-80 0-136-56t-56-136v-704q0-104 40.5-198.5t109.5-163.5 163.5-109.5 198.5-40.5h64q26 0 45 19t19 45v128q0 26-19 45t-45 19h-64q-106 0-181 75t-75 181v32q0 40 28 68t68 28h224q80 0 136 56t56 136zm896 0v384q0 80-56 136t-136 56h-384q-80 0-136-56t-56-136v-704q0-104 40.5-198.5t109.5-163.5 163.5-109.5 198.5-40.5h64q26 0 45 19t19 45v128q0 26-19 45t-45 19h-64q-106 0-181 75t-75 181v32q0 40 28 68t68 28h224q80 0 136 56t56 136z"/></svg>';


  document.querySelectorAll('.summary-item-list-container.sqs-gallery-container').forEach(function(thisListGalleryContainer){
    //thisListGalleryContainer.closest('section').classList.add('section-with-testimonials-v1');
    if(thisListGalleryContainer.closest('section')){
      thisListGalleryContainer.closest('section').classList.add('section-with-testimonials-v1');
    }else if(thisListGalleryContainer.closest('.Footer-inner')){
      thisListGalleryContainer.closest('.Footer-inner').classList.add('section-with-testimonials-v1');
    }
    thisListGalleryContainer.classList.add('swiper-container');

  });

  var countItems = 0;

  document.querySelectorAll('.sqs-gallery-design-list .summary-item-list').forEach(function(thisListGallery){

    thisListGallery.classList.add('swiper-wrapper');
    thisListGallery.insertAdjacentHTML('beforebegin', '<div class="swiper-pagination"></div>');
    thisListGallery.querySelectorAll('.summary-item').forEach(function(nodeSlide){


      countItems++;

      nodeSlide.classList.add('swiper-slide');
      nodeSlide.querySelectorAll('.summary-excerpt')[0].insertAdjacentHTML('afterend', '<div class="testimonial-info"><div class="img-testim"></div><div class="info-testim"></div></div>');

      var summaryItemTitle = nodeSlide.querySelectorAll('.summary-title')[0];
      var summaryItemImage = nodeSlide.querySelectorAll('.summary-thumbnail-image')[0];
      var summaryItemTags = nodeSlide.querySelectorAll('.summary-metadata-item--tags')[0];

      nodeSlide.querySelectorAll('.testimonial-info .img-testim')[0].append(summaryItemImage);
      nodeSlide.querySelectorAll('.testimonial-info .info-testim')[0].append(summaryItemTitle,summaryItemTags);

      nodeSlide.insertAdjacentHTML('beforeend', svgIcon);
      nodeSlide.insertAdjacentHTML('afterbegin', svgIcon);

    });
    
  });


  var itemsNums = 2;
  if(countItems > 1){
  }else{
    itemsNums = 1;
  }
  
    //initialize swiper when document ready
    var mySwiper = new Swiper ('.swiper-container',{
      loop: true,
      navigation: true,
      autoplay: false,
      slidesPerView: 1,
      breakpoints: {
        800: {
          slidesPerView: itemsNums,
          spaceBetween: 30
        }
      },
      spaceBetween: 30,
      navigation: {
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
        preloadImages: false,
        updateOnImagesReady: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      }
    });
  }
