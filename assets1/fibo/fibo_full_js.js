

var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

if (typeof(isGallery) != 'undefined' && isGallery != null){

  document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
    var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
    var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

    if(thisHeadText == 'fibo'){
      thisSummary.classList.add('fibo-plugin');
      thisSummary.closest('section').classList.add('section-with-fibo-slider');
      var thisSummaryParent = thisSummary.closest('.sqs-block');
      var thisSummaryId = thisSummaryParent.getAttribute('id');
      thisSummary.insertAdjacentHTML('beforeend', '<div class="fibo-wrapper swiper-container"><div class="fibo-inner-wrapper swiper-wrapper"></div></div>');
      var sliderPlace = thisSummary.querySelector('.fibo-inner-wrapper');

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

          let slideImage = '<div class="image-slide-inner"><img src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'"></div>';
          let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';

          let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';
          
          let position = '<div class="author-position"><p>'+tagContent+'</p></div>';



          let mainMarkup = '<div class="fibo-slide image-slide swiper-slide" data-slide-img-id="'+newId+'">'+'<div class="desc-slide">'+ description + '</div><div class="author-info">' + slideImage + '<div class="info">'+slideTitle+position+'</div></div></div>';


          sliderPlace.insertAdjacentHTML('beforeend', mainMarkup);


        });

        thisSummary.insertAdjacentHTML('afterend', '<div class="fibo-control-wrapper"><div class="slider-control fibo-control"><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div></div>');
        //


        var autoplayObject = false;

        if(globalGhostfiboParams.autoplay){
          autoplayObject = {
            delay: globalGhostfiboParams.autoplayDelay
          }
        }

        //initialize swiper when document ready
        var mySwiper = new Swiper ('.fibo-plugin .swiper-container',{
          loop: true,
          autoplay: autoplayObject,
          slidesPerView: 1,
          breakpoints: {
            800: {
              slidesPerView: globalGhostfiboParams.slidesPerView,
              spaceBetween: 30
            }
          },
          spaceBetween: 40,
          speed: 600,
          navigation: {
            nextEl: '.fibo-control-wrapper .swiper-button-next',
            prevEl: '.fibo-control-wrapper .swiper-button-prev',
            preloadImages: false,
            updateOnImagesReady: false
          }
        });
      }
    })
}


