
/* 👻 Ghost Plugin Code Start ⚠️ Copyright 2020 */


      document.querySelectorAll('.sqs-block-summary-v2 .sqs-gallery-design-autogrid .summary-item-list .summary-item .summary-title-link').forEach(function(thisNode){
        
        var slideParent = thisNode.closest('.summary-item');
        slideParent.insertAdjacentHTML('afterbegin', '<a class="slide-custom-link" href="'+thisNode.getAttribute('href')+'"></a>');
        

        if(slideParent.querySelectorAll('a[href="#read-duration"]')[0]){
          slideParent.querySelectorAll('.summary-metadata-container--below-content')[0].insertAdjacentHTML('beforeend', '<div class="read-duration">'+slideParent.querySelectorAll('a[href="#read-duration"]')[0].textContent+'</div>');
        }
       
        
      });
   

/* 👻 Ghost Plugin Code End ⚠️ Copyright 2020 */
