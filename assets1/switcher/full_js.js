<script>
  ;(function(){

    let isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];
    let pluginName = 'switcher-images';

    if (typeof(isGallery) != 'undefined' && isGallery != null){

      document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
        var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
        var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

        if(thisHeadText == pluginName){
          thisSummary.classList.add(pluginName+'-plugin');
          var thisSummaryParent = thisSummary.closest('.sqs-block');
          var thisSummaryId = thisSummaryParent.getAttribute('id');
          thisSummary.closest('section').classList.add('section-with-'+pluginName+'-slider');
          var createDiv = document.createElement('div');
          createDiv.classList.add('bg-images')
          thisSummary.closest('section').prepend(createDiv)
          var countItems = 0;
          thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
            countItems++;
            var newId = thisSummaryId+'-slide-'+i;
            var getImg = thisSlide.querySelector('.summary-thumbnail.img-wrapper')
            var getImgSrc = thisSlide.querySelector('.summary-thumbnail.img-wrapper img').getAttribute('data-src');
            var getLeftSide = thisSlide.querySelector('.summary-excerpt p.sqsrte-small');
            var geetLeftSidev2 = thisSlide.querySelector('.summary-metadata-container.summary-metadata-container--below-content .summary-metadata-item.summary-metadata-item--tags')
            thisSlide.prepend(geetLeftSidev2);
            getImg.querySelector('img').setAttribute('src', getImgSrc)
            getImg.setAttribute('data-slide-num', i)
            thisSlide.setAttribute('data-slide-id', newId);
            thisSlide.setAttribute('data-slide-num', i)
            thisSlide.closest('section').querySelector('.bg-images').append(getImg);
            //hover
            thisSlide.addEventListener("mouseover", function(){
              //set height to 0 when hover on other item
              var slides = document.querySelectorAll('.section-with-'+pluginName+'-slider .summary-item .summary-excerpt');    
              slides.forEach(function(slides){
                slides.style.height = '0px';
              })
              //remove active when hover on other item
              var getNum = thisSlide.getAttribute('data-slide-num');
              document.querySelectorAll('.section-with-'+pluginName+'-slider .bg-images .img-wrapper, .section-with-'+pluginName+'-slider .summary-item').forEach(function(allSlides){
                allSlides.classList.remove('active');
              })
              //make item active and change background image
              document.querySelector('.section-with-'+pluginName+'-slider .bg-images .img-wrapper[data-slide-num="'+getNum+'"]').classList.add('active')
              thisSlide.classList.add('active');
              var getExcerptHeight = thisSlide.querySelector('.summary-excerpt');  
              var elHFinal1 = getExcerptHeight.getAttribute('data-height');
              getExcerptHeight.style.height = elHFinal1;
            }, false);

            thisSlide.addEventListener("mouseout", function(){
            }, false);

            // count height
            setTimeout(function(){
              var getExcerptHeight = thisSlide.querySelector('.summary-excerpt');
              var elH = getExcerptHeight.offsetHeight;
              getExcerptHeight.setAttribute('data-height', elH + 'px');
              var elHFinal = getExcerptHeight.getAttribute('data-height');
              console.log(elHFinal);
              // set height 0px
              getExcerptHeight.style.height = '0px';
              //make first slide active
              var summaryItem = document.querySelector('.section-with-'+pluginName+'-slider .summary-item:nth-child(1)')
              var summaryItemBg = document.querySelector('.section-with-'+pluginName+'-slider .bg-images .img-wrapper:nth-child(1)')
              summaryItem.classList.add('active')
              summaryItemBg.classList.add('active')
              //set height to first el
              var getExcerptHeightFirst = document.querySelector('.section-with-'+pluginName+'-slider .summary-item:nth-child(1)')
              var elHFinalFirst = getExcerptHeight.getAttribute('data-height');
              document.querySelector('.section-with-'+pluginName+'-slider .summary-item:nth-child(1) .summary-excerpt').style.height = elHFinalFirst;
            },700)
          });
        }

      });
    }
  }());
</script>