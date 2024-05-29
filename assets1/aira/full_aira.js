
<script>
  ;(function(){

    let isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];
    let pluginName = 'aira';

    if (typeof(isGallery) != 'undefined' && isGallery != null){


      function hoverAndClickBeh(slide, summary){
        summary.querySelector('.aira-images-wrapper').classList.add('show-gallery');

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

        if(thisHeadText == pluginName){
          thisSummary.classList.add(pluginName+'-plugin');
          var thisSummaryParent = thisSummary.closest('.sqs-block');
          var thisSummaryId = thisSummaryParent.getAttribute('id');
          thisSummary.closest('section').classList.add('section-with-'+pluginName+'-slider');
		  thisSummary.closest('body').classList.add('page-with-'+pluginName+'-plugin');


          thisSummary.insertAdjacentHTML('afterbegin', '<div class="'+pluginName+'-images-wrapper"><div class="'+pluginName+'-inner-wrapper"></div></div>');
          var imagesPlace = thisSummary.querySelector('.'+pluginName+'-inner-wrapper');

          thisSummary.querySelector('.summary-item').classList.add('current-active'); //set default
          //
          var countItems = 0;
          thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
            countItems++;
            var newId = thisSummaryId+'-slide-'+i;

            thisSlide.setAttribute('data-slide-id', newId);


            //content vars
            let summaryTitle = thisSlide.querySelector('.summary-title-link');
            let summaryTitleText =  summaryTitle.innerText || summaryTitle.textContent
            let summaryDescription = thisSlide.querySelector('.summary-excerpt p').outerHTML || thisSlide.querySelector('.summary-excerpt p').textContent;
            let summaryLink = thisSlide.querySelector('.summary-thumbnail-outer-container > a').getAttribute('href');

            let tagElement = thisSlide.querySelector('.summary-metadata-item--tags a');
            let summaryTag = 'transparent';
            if (typeof(tagElement) != 'undefined' && tagElement != null){
              summaryTag = thisSlide.querySelector('.summary-metadata-item--tags a').textContent;
            }


            //markup
            let slideImage = '<div class="image-slide-inner"><img src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'?format=2500'+'"></div>';
            let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';
            let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';

            let mainMarkup = '<div class="'+pluginName+'-slide image-slide" data-slide-img-id="'+newId+'">'+ slideImage + '</div>';

            imagesPlace.insertAdjacentHTML('beforeend', mainMarkup);



            thisSlide.querySelector('.summary-title').addEventListener("click", function (e) {
              hoverAndClickBeh(thisSlide, thisSummary);
            });

            thisSlide.querySelector('.summary-title').addEventListener("mouseenter", function (e) {
              hoverAndClickBeh(thisSlide, thisSummary);
            });

            thisSlide.querySelector('.summary-title').addEventListener("mouseout", function (e) {
              thisSummary.querySelector('.aira-images-wrapper').classList.remove('show-gallery');
            });

          });

          thisSummary.querySelector('.summary-item').classList.add('current-active');
          thisSummary.querySelector('.image-slide').classList.add('active-slide');

        }

      });
    }
  }());
</script>