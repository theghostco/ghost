

  var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

  if (typeof(isGallery) != 'undefined' && isGallery != null){

    document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
      var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
      var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

      if(thisHeadText == 'phase-image-changer'){
        thisSummary.classList.add('phase-image-changer-plugin');
        var thisSummaryParent = thisSummary.closest('.sqs-block');
        var thisSummaryId = thisSummaryParent.getAttribute('id');
        thisSummary.insertAdjacentHTML('beforeend', '<div class="phase-image-changer-images-wrapper"></div>');
        var imagesPlace = thisSummary.querySelector('.phase-image-changer-images-wrapper');

        //
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
          var newId = thisSummaryId+'-slide-'+i;

          thisSlide.setAttribute('data-slide-id', newId);
          imagesPlace.insertAdjacentHTML('beforeend', '<div class="image-slide" data-slide-img-id="'+newId+'"><div class="image-slide-inner"><img src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'"></div></div>');

          thisSlide.addEventListener("click", function (e) {
            console.log(thisSlide.getAttribute('data-slide-id'));
            if(thisSlide.classList.contains('current-active')){
              return;
            }else{
              thisSummary.querySelector('.current-active').classList.remove('current-active');
              thisSummary.querySelector('.active-slide').classList.remove('active-slide');

              thisSlide.classList.add('current-active');
              thisSummary.querySelector('.image-slide[data-slide-img-id="'+thisSlide.getAttribute('data-slide-id')+'"]').classList.add('active-slide');

            }
          });

        });

        thisSummary.querySelector('.summary-item').classList.add('current-active');
        thisSummary.querySelector('.image-slide').classList.add('active-slide');

      }
    })

  }

