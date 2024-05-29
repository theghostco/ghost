

var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

if (typeof(isGallery) != 'undefined' && isGallery != null){

  function hoverAndClickBeh(slide, summary){

    console.log(slide.getAttribute('data-slide-id'));
    if(slide.classList.contains('current-active')){
      return;
    }else{
      summary.querySelector('.current-active').classList.remove('current-active');
      summary.querySelector('.active-slide').classList.remove('active-slide');
      slide.classList.add('current-active');
      summary.querySelector('.image-slide[data-slide-img-id="'+slide.getAttribute('data-slide-id')+'"]').classList.add('active-slide');
    }

  }
  document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
    var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
    var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

    if(thisHeadText == 'freya'){
      thisSummary.classList.add('freya-plugin');
      var thisSummaryParent = thisSummary.closest('.sqs-block');
      var thisSummaryId = thisSummaryParent.getAttribute('id');
      thisSummary.insertAdjacentHTML('beforeend', '<div class="freya-images-wrapper"></div>');
      var imagesPlace = thisSummary.querySelector('.freya-images-wrapper');

        thisSummary.querySelector('.summary-item').classList.add('current-active'); //set default
        //
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
          var newId = thisSummaryId+'-slide-'+i;

          thisSlide.setAttribute('data-slide-id', newId);
          imagesPlace.insertAdjacentHTML('beforeend', '<div class="image-slide" data-slide-img-id="'+newId+'"><div class="image-slide-inner"><img src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'"></div></div>');



          thisSlide.addEventListener("click", function (e) {
            hoverAndClickBeh(thisSlide, thisSummary);
          });
          thisSlide.addEventListener("mouseenter", function (e) {
            hoverAndClickBeh(thisSlide, thisSummary);
          });

          thisSlide.addEventListener("click", function (e) {
            hoverAndClickBeh(thisSlide, thisSummary);
          });

        });

        thisSummary.querySelector('.summary-item').classList.add('current-active');
        thisSummary.querySelector('.image-slide').classList.add('active-slide');
        thisSummary.classList.add('loaded-carousel');
      }
    })

}



