 var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

  if (typeof(isGallery) != 'undefined' && isGallery != null){

    document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
      var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
      var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

      if(thisHeadText == 'kayto'){
        thisSummary.classList.add('kayto-plugin');
        thisSummary.setAttribute('data-per-row', globalGhostkaytoParams.itemsPerRow);
        thisSummary.closest('section').classList.add('section-with-kayto-slider');
        var thisSummaryParent = thisSummary.closest('.sqs-block');
        var thisSummaryId = thisSummaryParent.getAttribute('id');
        thisSummary.insertAdjacentHTML('beforeend', '<div class="kayto-wrapper"><div class="kayto-inner-wrapper "></div></div>');
        var sliderPlace = thisSummary.querySelector('.kayto-inner-wrapper');

        //
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
          //unique ID
          var newId = thisSummaryId+'-slide-'+i;
          thisSlide.setAttribute('data-slide-id', newId);

          //content vars
          let summaryTitle = thisSlide.querySelector('.summary-title-link');
          let summaryTitleText = summaryTitle.innerText || summaryTitle.textContent;
          let summaryDescription = thisSlide.querySelector('.summary-excerpt p').outerHTML || thisSlide.querySelector('.summary-excerpt p').textContent;
          let summeryLink = thisSlide.querySelector('.summary-thumbnail-outer-container a').getAttribute('href');
          console.log(summeryLink);


          //markup
          let slideImage = '<div class="image-slide-wrapper"><div class="image-slide-inner"><img data-src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'" src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'"></div></div>';
          let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';
          let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';
          let autorInfo = '<div class="author-info"><div class="info">'+slideTitle+'</div></div>';
          let mainMarkup = '<div class="kayto-slide image-slide" data-slide-img-id="'+newId+'"><a <a href="'+summeryLink+'" class="kayto-wrapper">'+'<div class="left-part">' + slideImage + '</div><div class="right-part">' + autorInfo + '<div class="desc-slide">'+'<div class="wrap-content">'+ description +'</div></div></div></a></div>';
          sliderPlace.insertAdjacentHTML('beforeend', mainMarkup);
        });
      }
      thisSummary.classList.add('loaded-carousel');
    })
  }
