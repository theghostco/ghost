

var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

if (typeof(isGallery) != 'undefined' && isGallery != null){

  document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
    var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
    var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

    if(thisHeadText == 'tiller-product-slider'){
      thisSummary.classList.add('tiller-product-slider-plugin');
      thisSummary.closest('section').classList.add('section-with-full-width-slider');
      var thisSummaryParent = thisSummary.closest('.sqs-block');
      var thisSummaryId = thisSummaryParent.getAttribute('id');
      thisSummary.insertAdjacentHTML('beforeend', '<div class="tiller-product-slider-wrapper swiper-container"><div class="tiller-product-slider-inner-wrapper swiper-wrapper"></div></div>');
      var sliderPlace = thisSummary.querySelector('.tiller-product-slider-inner-wrapper');

        //
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
          //unique ID
          var newId = thisSummaryId+'-slide-'+i;
          thisSlide.setAttribute('data-slide-id', newId);

          //content vars
          let summaryTitle = thisSlide.querySelector('.summary-title-link');

          let summaryTitleText =  summaryTitle.innerText || summaryTitle.textContent
          let summaryTitleLink = summaryTitle.getAttribute('href');
          let summaryPrice = thisSlide.querySelector('.sqs-money-native').innerText || thisSlide.querySelector('.sqs-money-native').textContent;

          let isExcerpt = thisSlide.querySelector('.summary-excerpt p');

          let summaryDescription = (typeof(isExcerpt) != 'undefined' && isExcerpt != null) ? isExcerpt.innerText || isExcerpt.textContent : '';

          //markup

          let slideImage = '<a href="'+summaryTitleLink+'" class="image-slide-inner"><img src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'"></a>';
          let slideTitle = '<div class="title-wrapper"><h3><a href="'+summaryTitleLink+'">'+summaryTitleText+'</a></h3></div>';
          let price = '<span class="sqs-money-native">'+summaryPrice+'</span>';
          let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';
          let buyButton = '<a href="'+summaryTitleLink+'" class="buy-button sqs-block-button-element--medium sqs-block-button-element">'+globalGhostTillerParams.buttonText+'</a>';


          let mainMarkup = '<div class="tiller-slide image-slide swiper-slide" data-slide-img-id="'+newId+'">' + slideImage + '<div class="info-slide">'+ slideTitle + price + description + buyButton + '</div></div>';

          sliderPlace.insertAdjacentHTML('beforeend', mainMarkup);
          if(globalGhostTillerParams.transparentHeaderAboveSlider){
            thisSummary.closest('section').classList.add('transparent-header-above-slider');
          }
          
        });

        thisSummary.insertAdjacentHTML('afterend', '<div class="tiller-product-slider-control-wrapper"><div class="nums-slider"><span class="active-slide animation"></span><span class="separator"> / </span><span class="count-slides"></span></div><div class="slider-control tiller-product-slider-control"><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div></div>');
        //

        //initialize swiper when document ready
        var mySwiper = new Swiper ('.tiller-product-slider-plugin .swiper-container',{
          loop: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            preloadImages: false,
            updateOnImagesReady: false
          },
          slidesPerView: 1,
          speed: 600,
          effect: 'fade',
          initialSlide: 0
        });






        mySwiper.on('transitionStart', function () {
          document.querySelector('.tiller-slide .info-slide.animation').classList.remove('animation');
          //document.querySelector('.nums-slider .active-slide').classList.remove('animation');

        });

        mySwiper.on('transitionEnd', function () {
          let activeSlide = document.querySelector('.tiller-product-slider-plugin .swiper-slide-active');
          activeSlide.querySelector('.tiller-slide .info-slide').classList.add('animation');
         

          
        });

        mySwiper.on('slideChangeTransitionEnd', function () {
          let activeSlide = document.querySelector('.tiller-product-slider-plugin .swiper-slide-active');
          let activeIndex = +activeSlide.getAttribute('data-swiper-slide-index')+1;
          console.log(activeIndex);
          document.querySelector('.nums-slider .active-slide').innerHTML = activeIndex;

          // setTimeout(function(){
          //   document.querySelector('.nums-slider .active-slide').classList.add('animation');
          // },50);


          //document.querySelector('.nums-slider .active-slide').classList.add('animation');

        });


        // mySwiper.on('slideChangeTransition', function () {
        //   let activeSlide = document.querySelector('.tiller-product-slider-plugin .swiper-slide-active');
        //   let activeIndex = +activeSlide.getAttribute('data-swiper-slide-index')+1;
        //   console.log(activeIndex);

        //   document.querySelector('.nums-slider .active-slide').innerHTML = activeIndex;
        // });

        

        document.querySelector('.nums-slider .count-slides').innerHTML = mySwiper.slides.length - 2;
        document.querySelector('.nums-slider .active-slide').innerHTML = +document.querySelector('.tiller-product-slider-plugin .swiper-slide-active').getAttribute('data-swiper-slide-index')+1;

        //document.querySelector('.nums-slider .active-slide').style.opacity = 1;
        document.querySelector('.tiller-product-slider-plugin .swiper-slide-active .info-slide').classList.add('animation')

      }
    })

}
