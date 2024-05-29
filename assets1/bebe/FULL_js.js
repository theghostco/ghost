

  var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

  if (typeof(isGallery) != 'undefined' && isGallery != null){

    document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
      var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
      var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

      if(thisHeadText == 'bebe'){
        thisSummary.classList.add('bebe-plugin');
        thisSummary.closest('section').classList.add('section-with-bebe-slider');
        var thisSummaryParent = thisSummary.closest('.sqs-block');
        var thisSummaryId = thisSummaryParent.getAttribute('id');
        thisSummary.insertAdjacentHTML('beforeend', '<div class="bebe-wrapper swiper-container"><div class="bebe-inner-wrapper swiper-wrapper"></div></div>');
        var sliderPlace = thisSummary.querySelector('.bebe-inner-wrapper');

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

          let slideImage = '<div class="image-slide-wrapper"><div class="image-slide-inner"><img data-src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'" src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'" class="ali"></div></div>';
          let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';
          let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';
          let position = '<div class="author-position"><p>'+tagContent+'</p></div>';
          let autorInfo = '<div class="author-info"><div class="info">'+slideTitle+position+'</div></div>';


          let mainMarkup = '<div class="bebe-slide image-slide swiper-slide" data-slide-img-id="'+newId+'"><div class="bebe-wrapper">'+'<div class="left-part">' + slideImage + '</div><div class="right-part">' + autorInfo + '<div class="desc-slide">'+'<div class="wrap-content">'+ description +'</div></div></div></div></div>';
          sliderPlace.insertAdjacentHTML('beforeend', mainMarkup);
        });

     
        thisSummary.insertAdjacentHTML('beforeend', '<div class="bebe-pagination swiper-pagination"></div>');
        //

        var autoplayObject = false;

        if(globalGhostbebeParams.autoplay){
          autoplayObject = {
            delay: globalGhostbebeParams.autoplayDelay
          }
        }

        //initialize swiper when document ready
        var mySwiper = new Swiper ('.bebe-plugin .swiper-container',{
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
          }
        });
      }
      thisSummary.classList.add('loaded-carousel');
    })
  }