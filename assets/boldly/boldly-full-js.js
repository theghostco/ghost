
var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

if (typeof(isGallery) != 'undefined' && isGallery != null){

  document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
    var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
    var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

    if(thisHeadText == 'boldly'){
      let quoteSvg = '<svg width="76" height="62" viewBox="0 0 76 62" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.68035 62C1.56012 52.8148 0 43.7062 0 34.6741C0 24.2642 2.67449 15.921 8.02346 9.64446C13.3724 3.21482 21.173 0 31.4252 0V14.4667C23.5503 14.4667 19.6129 19.6716 19.6129 30.0815V33.5259H33.8768V62H4.68035ZM46.8035 62C43.8319 52.6617 42.346 43.5531 42.346 34.6741C42.346 24.2642 44.9462 15.921 50.1466 9.64446C55.4956 3.21482 63.2962 0 73.5484 0V14.4667C65.8221 14.4667 61.9589 19.6716 61.9589 30.0815V33.5259H76V62H46.8035Z" fill="white"></path></svg>';


      thisSummary.classList.add('boldly-plugin');
      thisSummary.closest('section').classList.add('section-with-boldly-slider');
      var thisSummaryParent = thisSummary.closest('.sqs-block');
      var thisSummaryId = thisSummaryParent.getAttribute('id');
      thisSummary.insertAdjacentHTML('beforeend', '<div class="boldly-wrapper swiper-container"><div class="boldly-inner-wrapper swiper-wrapper"></div></div>');
      var sliderPlace = thisSummary.querySelector('.boldly-inner-wrapper');

        //
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
          //unique ID
          var newId = thisSummaryId+'-slide-'+i;
          thisSlide.setAttribute('data-slide-id', newId);

          //content vars
          let summaryTitle = thisSlide.querySelector('.summary-title-link');

          let summaryTitleText = summaryTitle.innerText || summaryTitle.textContent;
          console.log(summaryTitleText);

          let tagVar = thisSlide.querySelector('.summary-metadata-item--tags');
          console.log(tagVar);

          let tagContent = tagVar.innerHTML || tagVar.textContent;


          let summaryDescription = thisSlide.querySelector('.summary-excerpt p').outerHTML || thisSlide.querySelector('.summary-excerpt p').textContent;


          //markup

          let slideImage = '<div class="image-slide-inner"><img data-src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'" src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'" class="ali"></div>';
          let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';

          let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';

          let position = '<div class="author-position"><p>'+tagContent+'</p></div>';


          let mainMarkup = '<div class="boldly-slide image-slide swiper-slide" data-slide-img-id="'+newId+'"><div class="boldly-wrapper">'+'<div class="left-part">' + slideImage + '</div><div class="right-part"><div class="desc-slide">'+'<div class="svg-quote">'+quoteSvg+'</div>'+ description + '</div><div class="author-info"><div class="info">'+slideTitle+position+'</div></div></div></div></div>';


          sliderPlace.insertAdjacentHTML('beforeend', mainMarkup);

        });

        thisSummary.insertAdjacentHTML('beforeend', '<div class="boldly-control-wrapper"><div class="slider-control boldly-control"><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div></div>');


        thisSummary.insertAdjacentHTML('afterend', '<div class="boldly-pagination swiper-pagination"></div>');
        //

        var autoplayObject = false;

        if(globalGhostboldlyParams.autoplay){
          autoplayObject = {
            delay: globalGhostboldlyParams.autoplayDelay
          }
        }

        //initialize swiper when document ready
        var mySwiper = new Swiper ('.boldly-plugin .swiper-container',{
          loop: true,
          autoplay: autoplayObject,
          slidesPerView: 1,
          breakpoints: {
            800: {
              slidesPerView: 1,
              spaceBetween: 30
            }
          },
          spaceBetween: 40,
          speed: 600,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.boldly-control-wrapper .swiper-button-next',
            prevEl: '.boldly-control-wrapper .swiper-button-prev',
            preloadImages: false,
            updateOnImagesReady: false
          }
        });
      }
      thisSummary.classList.add('loaded-carousel');
    })
}