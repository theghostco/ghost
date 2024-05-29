
var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

if (typeof(isGallery) != 'undefined' && isGallery != null){

  document.querySelectorAll('.summary-block-wrapper.sqs-gallery-design-carousel').forEach(function(thisSummary){
    var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
    var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;
    console.log('gallery exist');
    if(thisHeadText == 'price'){
      console.log('price gallery exist');
      thisSummary.classList.add('price-plugin');
      thisSummary.closest('section').classList.add('section-with-price-slider');
      var thisSummaryParent = thisSummary.closest('.sqs-block');
      var thisSummaryId = thisSummaryParent.getAttribute('id');
      thisSummary.insertAdjacentHTML('beforeend', '<div class="price-plugin-wrapper"><div class="price-inner-wrapper"></div></div>');
      var sliderPlace = thisSummary.querySelector('.price-inner-wrapper');

        //
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
          //unique ID
          var newId = thisSummaryId+'-slide-'+i;
          thisSlide.setAttribute('data-slide-id', newId);

          //content vars
          let summaryTitle = thisSlide.querySelector('.summary-title-link');

          let summaryTitleText = summaryTitle.innerText || summaryTitle.textContent;
          console.log(summaryTitleText);

          let summaryDescription = thisSlide.querySelector('.summary-excerpt').outerHTML || thisSlide.querySelector('.summary-excerpt').textContent;

          //markup
          let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';

          let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';

          let mainMarkup = '<div class="price-slide image-slide" data-slide-img-id="'+newId+'"><div class="price-wrapper"><h3>'+slideTitle+'</h3><div class="desc-slide">'+ description + '</div></div></div>';
          sliderPlace.insertAdjacentHTML('beforeend', mainMarkup);
        });

      }
      thisSummary.classList.add('loaded-carousel');
    })
}