document.addEventListener('DOMContentLoaded', customJsCount);
window.addEventListener('mercury:load', customJsCount);

function customJsCount(){

  var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

  if (typeof(isGallery) != 'undefined' && isGallery != null){

    document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary, i){
      var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
      var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

      if(thisHeadText == 'number-counter'){
        thisSummary.classList.add('number-counter-plugin');
        thisSummary.setAttribute('id','number-counter-plugin'+i);

        thisSummary.closest('section').classList.add('section-with-number-counter-slider');
        var thisSummaryParent = thisSummary.closest('.sqs-block');
        var thisSummaryId = thisSummaryParent.getAttribute('id');
        thisSummary.insertAdjacentHTML('beforeend', '<div class="number-counter-wrapper"><div class="number-counter-inner-wrapper "></div></div>');

        var counterPlace = thisSummary.querySelector('.number-counter-inner-wrapper');

        //
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
          //unique ID
          var newId = thisSummaryId+'-slide-'+i;
          thisSlide.setAttribute('data-slide-id', newId);

          //content vars
          let summaryTitle = thisSlide.querySelector('.summary-title-link');

          let summaryTitleText = summaryTitle.innerText || summaryTitle.textContent;

          let summaryDescription = thisSlide.querySelector('.summary-excerpt').outerHTML || thisSlide.querySelector('.summary-excerpt p').textContent;

          let isNumberEx = thisSlide.querySelector('.summary-excerpt a[href*="#number"]');
          let conterNumber = (typeof(isNumberEx) != 'undefined' && isNumberEx != null) ? isNumberEx.textContent || isNumberEx.innerText  : '';


          //markup
          let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';

          let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';

          let mainMarkup = '<div class="number-counter-slide image-slide" data-slide-img-id="'+newId+'">'+'<div class="author-info">'+ '<div class="info">'+slideTitle+'</div></div>'+'<div class="conter-number" data-num="'+conterNumber+'" id="'+newId+'"> - </div>'+'<div class="desc-slide">'+ description + '</div></div>';

          counterPlace.insertAdjacentHTML('beforeend', mainMarkup);

        });
      }
      thisSummary.classList.add('loaded');
    });

  }
  
}