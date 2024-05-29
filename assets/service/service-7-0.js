window.Squarespace.onInitialize(Y, function() {
    let isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];
    let pluginName = 'service';
    if (typeof(isGallery) != 'undefined' && isGallery != null){
      document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
        var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
        var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;

        if(thisHeadText == pluginName){
          thisSummary.classList.add(pluginName+'-plugin');


          var thisSummaryParent = thisSummary.closest('.sqs-block');
          var thisSummaryId = thisSummaryParent.getAttribute('id');


          var countItems = 0;
          thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
            countItems++;
            //summary-thumbnail-outer-container
            countItems = (countItems < 10) ? '0'+countItems : countItems;
            console.log(countItems);
            thisSlide.insertAdjacentHTML('afterbegin', '<p class="count">'+countItems+'</p>');
            thisSlide.querySelector('.summary-title').prepend(thisSlide.querySelector('.summary-thumbnail-outer-container'))
            

            thisSlide.addEventListener("click", function (e) {

          //    event.preventDefault();
              
              let container = thisSlide.querySelector('.summary-excerpt');


              if (!container.classList.contains('active')) {
                container.classList.add('active');
                container.style.height = 'auto';

                let height = container.clientHeight + "px";

                container.style.height = '0px';

                setTimeout(function () {
                  container.style.height = height;
                }, 0);
              } else {
                container.style.height = '0px';

                container.addEventListener('transitionend', function () {
                  container.classList.remove('active');
                }, {
                  once: true
                });
              }


              let classListThis = thisSlide.classList;
              if(classListThis.contains('open')){
                classListThis.remove('open');
              }else{
                classListThis.add('open');
              }
            });

          });

          thisSummary.closest('section').classList.add('section-with-'+pluginName+'-slider');
          thisSummary.closest('body').classList.add('page-with-'+pluginName+'-plugin');


        }


      });
    }
});