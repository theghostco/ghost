
// export function sayHi(user) {
//   return `Hello, ${user}!`;
// }


export function createSummary(plugin_Name){



  let isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];
  let pluginName = plugin_Name;

  function returnText(){

    let wow = '';
    
    if (typeof(isGallery) != 'undefined' && isGallery != null){


      document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
        let thisHeadingElement = thisSummary.querySelector('.summary-header-text');
        let thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;
        wow = thisHeadText;

        if(thisHeadText == pluginName){
          thisSummary.classList.add(pluginName+'-plugin');
          let thisSummaryParent = thisSummary.closest('.sqs-block');
          let thisSummaryId = thisSummaryParent.getAttribute('id');
          thisSummary.closest('section').classList.add('section-with-'+pluginName+'-slider');


          thisSummary.insertAdjacentHTML('afterbegin', '<div class="'+pluginName+'-images-wrapper swiper-container"><div class="'+pluginName+'-inner-wrapper swiper-wrapper"></div></div>');
          let imagesPlace = thisSummary.querySelector('.'+pluginName+'-inner-wrapper');

          thisSummary.querySelector('.summary-item').classList.add('current-active'); 

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
            //console.log(summaryTag);
            //titleName = summaryTitle
            //return summaryTitle;


            // //markup
            let slideImage = '<div class="image-slide-inner"><img src="'+thisSlide.querySelector('.summary-thumbnail img').getAttribute('data-src')+'?format=2500'+'"></div>';
            let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';
            let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';

            let mainMarkup = '<div class="'+pluginName+'-slide image-slide swiper-slide swiper-slide" data-slide-img-id="'+newId+'"><a href="'+summaryLink+'">' + slideImage + '<div class="info-slide">'+ slideTitle + description + '</div></a></div>';
            


            //imagesPlace.insertAdjacentHTML('beforeend', mainMarkup);



            // thisSlide.addEventListener("click", function (e) {
            //   console.log(thisSlide.getAttribute('data-slide-id'));
            //   if(thisSlide.classList.contains('current-active')){
            //     return;
            //   }else{
            //     thisSummary.querySelector('.current-active').classList.remove('current-active');
            //     thisSummary.querySelector('.active-slide').classList.remove('active-slide');

            //     thisSlide.classList.add('current-active');
            //     thisSummary.querySelector('.image-slide[data-slide-img-id="'+thisSlide.getAttribute('data-slide-id')+'"]').classList.add('active-slide');
            //   }
            // });


          });
       // thisSummary.querySelector('.summary-item').classList.add('current-active');
       // thisSummary.querySelector('.image-slide').classList.add('active-slide');
     }
   });
    }
    return wow;
  }
  function getVal(){
    console.log(returnText());
  }
  getVal();

}





