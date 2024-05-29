
  var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

  if (typeof(isGallery) != 'undefined' && isGallery != null){

    document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
      var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
      var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

      if(thisHeadText == 'naton'){
        thisSummary.classList.add('naton-plugin');
        thisSummary.closest('section').classList.add('section-with-full-width-slider');
        var thisSummaryParent = thisSummary.closest('.sqs-block');
        var thisSummaryId = thisSummaryParent.getAttribute('id');
        thisSummary.insertAdjacentHTML('beforeend', '<div class="naton-wrapper swiper-container"><div class="naton-inner-wrapper swiper-wrapper"></div></div>');
        var sliderPlace = thisSummary.querySelector('.naton-inner-wrapper');

        //
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
          //unique ID
          var newId = thisSummaryId+'-slide-'+i;
          thisSlide.setAttribute('data-slide-id', newId);

          //content vars
          let summaryTitle = thisSlide.querySelector('.summary-title-link');

          let summaryTitleText =  summaryTitle.innerText || summaryTitle.textContent
        

          let summaryDescription = thisSlide.querySelector('.summary-excerpt p').outerHTML || thisSlide.querySelector('.summary-excerpt p').textContent;


          //markup

          let slideImage = '<div class="image-slide-inner"><img src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'?format=2500'+'"></div>';
          let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';

          let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';
          


          let mainMarkup = '<div class="naton-slide image-slide swiper-slide" data-slide-img-id="'+newId+'">' + slideImage + '<div class="info-slide">'+ slideTitle + description + '</div></div>';

          sliderPlace.insertAdjacentHTML('beforeend', mainMarkup);
          if(globalGhostNatonParams.transparentHeaderAboveSlider){
            thisSummary.closest('section').classList.add('transparent-header-above-slider');
          }

        });

        thisSummary.insertAdjacentHTML('afterend', '<div class="naton-control-wrapper"><div class="nums-slider"><span class="active-slide animation"></span><span class="separator"> / </span><span class="count-slides"></span></div><div class="slider-control naton-control"><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div></div>');
        //

        
        var autoplayObject = false;

        if(globalGhostNatonParams.autoplay){
          autoplayObject = {
            delay: globalGhostNatonParams.autoplayDelay
          }
        }
        
        //initialize swiper when document ready
        var mySwiper = new Swiper ('.naton-plugin .swiper-container',{
          loop: true,
          autoplay: autoplayObject,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            preloadImages: false,
            updateOnImagesReady: false
          },
          slidesPerView: 1,
          speed: 600,
          effect: 'fade',
          initialSlide: 0,
          
        });



        mySwiper.on('transitionStart', function () {
          document.querySelector('.naton-slide .info-slide.animation').classList.remove('animation');
        });

        mySwiper.on('transitionEnd', function () {
          let activeSlide = document.querySelector('.naton-plugin .swiper-slide-active');
          activeSlide.querySelector('.naton-slide .info-slide').classList.add('animation');
        });

        mySwiper.on('slideChangeTransitionEnd', function () {
          let activeSlide = document.querySelector('.naton-plugin .swiper-slide-active');
          let activeIndex = +activeSlide.getAttribute('data-swiper-slide-index')+1;
          console.log(activeIndex);
          document.querySelector('.naton-control-wrapper .nums-slider .active-slide').innerHTML = activeIndex;
        });


        document.querySelector('.naton-control-wrapper .nums-slider .count-slides').innerHTML = mySwiper.slides.length - 2;
        document.querySelector('.naton-control-wrapper .nums-slider .active-slide').innerHTML = +document.querySelector('.naton-plugin .swiper-slide-active').getAttribute('data-swiper-slide-index')+1;

        //document.querySelector('.nums-slider .active-slide').style.opacity = 1;
        document.querySelector('.naton-plugin .swiper-slide-active .info-slide').classList.add('animation')

      }
    })

  }