

;(function(){


  let isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];
  let pluginName = 'taydio';

  if (typeof(isGallery) != 'undefined' && isGallery != null){


    document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
      console.log(thisSummary);
      let thisHeadingElement = thisSummary.querySelector('.summary-header-text');
      console.log(thisHeadingElement);
      let thisHeadText = '';

      if(thisHeadingElement){
        thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;
      }



      if(thisHeadText == pluginName){
        thisSummary.classList.add(pluginName+'-plugin');
        var thisSummaryParent = thisSummary.closest('.sqs-block'),
        thisSummaryId = thisSummaryParent.getAttribute('id'),
        summarySection = thisSummary.closest('section');

        summarySection.classList.add('section-with-'+pluginName+'-slider');

        var isFluid = false,
        fluidEl = summarySection.querySelectorAll('.fluid-engine')[0];

        if (typeof(fluidEl) != 'undefined' && fluidEl != null){
          isFluid = true;
          summarySection.querySelectorAll('.sqs-block').forEach(function(sqsBlock, i){  
            sqsBlock.closest('.fe-block').classList.add(sqsBlock.classList[1]);
          })
        }

        thisSummary.insertAdjacentHTML('beforeend', '<div class="'+pluginName+'-images-wrapper "><div class="'+pluginName+'-inner-wrapper"></div></div>');
        let imagesPlace = thisSummary.querySelector('.'+pluginName+'-inner-wrapper');

          //tabs
          let tabsList = '<div class="tabs-list"></div>';
          thisSummary.querySelector('.summary-block-header').insertAdjacentHTML('afterend', tabsList);
          let tabsPlace = thisSummary.querySelector('.tabs-list');



          thisSummary.querySelector('.summary-item').classList.add('current-active'); //set default
          thisSummary.querySelector('.summary-item .summary-excerpt').style.display = 'block';

          //
          let countItems = 0;
          thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
            countItems++;
            let newId = thisSummaryId+'-slide-'+i;

            thisSlide.setAttribute('data-slide-id', newId);


            //content lets
            let summaryTitle = thisSlide.querySelector('.summary-title-link');
            let summaryTitleText =  summaryTitle.innerText || summaryTitle.textContent
            let summaryDescription = thisSlide.querySelector('.summary-excerpt p').outerHTML || thisSlide.querySelector('.summary-excerpt p').textContent;
            let summaryLink = thisSlide.querySelector('.summary-thumbnail-outer-container > a').getAttribute('href');

            let tagElement = thisSlide.querySelector('.summary-metadata-item--tags a');
            let summaryTag = 'transparent';
            if (typeof(tagElement) != 'undefined' && tagElement != null){
              summaryTag = thisSlide.querySelector('.summary-metadata-item--tags a').textContent;
            }
            console.log(summaryTag);


            //markup
            let slideImage = '<div class="image-slide-inner"><img src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'?format=2500'+'"></div>';
            let slideTitle = '<div class="title-wrapper" data-id="'+newId+'"><h4>'+summaryTitleText+'</h4></div>';
            let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';

            let mainMarkup = '<div class="'+pluginName+'-slide image-slide" data-slide-img-id="'+newId+'">' + slideImage + '</div>';


            tabsPlace.insertAdjacentHTML('beforeend', slideTitle);          
            imagesPlace.insertAdjacentHTML('beforeend', mainMarkup);


          });

          thisSummary.querySelectorAll('.tabs-list .title-wrapper').forEach(function(thisTab){ 
            thisTab.addEventListener("click", function (e) {
              if(thisTab.classList.contains('active-title')){
                return;
              }else{
                let thisID = thisTab.getAttribute('data-id');

                thisSummary.querySelector('.current-active').classList.remove('current-active-animation');
                thisSummary.querySelector('.current-active').classList.remove('current-active');


                thisSummary.querySelector('.active-slide').classList.remove('active-slide-animation');
                thisSummary.querySelector('.active-slide').classList.remove('active-slide');



                thisSummary.querySelector('.active-title').classList.remove('active-title');




                console.log('.summary-item[data-slide-id="'+thisID+'"]');

                thisSummary.querySelector('.summary-item[data-slide-id="'+thisID+'"]').classList.add('current-active');
                setTimeout(function(){
                  thisSummary.querySelector('.summary-item[data-slide-id="'+thisID+'"]').classList.add('current-active-animation');
                },100);

                thisTab.classList.add('active-title');

                thisSummary.querySelector('.image-slide[data-slide-img-id="'+thisID+'"]').classList.add('active-slide');
                setTimeout(function(){
                  thisSummary.querySelector('.image-slide[data-slide-img-id="'+thisID+'"]').classList.add('active-slide-animation');
                },100);


              }
            });
          });


          let nextEl = thisSummaryParent.nextElementSibling || false;


          //fluid code
          if(isFluid){
            nextEl = thisSummaryParent.closest('.fe-block').nextElementSibling || false;
          }
          
          
          if(nextEl){
            if(nextEl.classList.contains("html-block")){
              if(nextEl.querySelectorAll('h4 em')[0]){
                nextEl.classList.add('ghost-summary-heading-container');
                console.log(nextEl.querySelectorAll('h4 em')[0].innerText);
                thisSummary.querySelector('.summary-block-header').insertAdjacentHTML('afterend', '<h4 class="ghost-summary-headinng">'+nextEl.querySelectorAll('h4 em')[0].innerText+'</h4>');

              }
              if(nextEl.querySelectorAll('h3 em')[0]){
                nextEl.classList.add('ghost-summary-heading-container');
                console.log(nextEl.querySelectorAll('h3 em')[0].innerText);
                thisSummary.querySelector('.summary-block-header').insertAdjacentHTML('afterend', '<h3 class="ghost-summary-headinng">'+nextEl.querySelectorAll('h3 em')[0].innerText+'</h3>');

              } 

            }
          }
          thisSummary.querySelector('.summary-item').classList.add('current-active');
          thisSummary.querySelector('.summary-item').classList.add('current-active-animation');


          thisSummary.querySelector('.image-slide').classList.add('active-slide');
          thisSummary.querySelector('.image-slide').classList.add('active-slide-animation');


          thisSummary.querySelector('.title-wrapper').classList.add('active-title');

        }

      });
}

}());
