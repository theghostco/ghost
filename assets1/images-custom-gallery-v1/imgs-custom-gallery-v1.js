 (function(){
  var isGallery = document.querySelectorAll('.sqs-gallery-container.sqs-gallery-block-grid')[0];


  if (typeof(isGallery) != 'undefined' && isGallery != null){

    document.querySelectorAll(".sqs-gallery-container.sqs-gallery-block-grid").forEach(function(elem) {
      elem.classList.add('custom-gallery-inner-wrapper');
    });

    document.querySelectorAll(".sqs-gallery-container.sqs-gallery-block-grid .slide .margin-wrapper").forEach(function(elem) {
      elem.classList.add('custom-gallery-images-wrapper');
      var elemContentWrapper = elem.querySelectorAll('.image-slide-anchor')[0];

      var elemDesc = elemContentWrapper.getAttribute('data-description');
      var elemTitle = elemContentWrapper.getAttribute('data-title');

      var overlayDescription = '<div class="custom-images-gallery-desc"><div class="inner-cust-wrapper"><h3>'+elemTitle+'</h3>'+elemDesc+'</div></div>';
      elemContentWrapper.insertAdjacentHTML('beforebegin', overlayDescription);
      
      console.log(elem.querySelectorAll('.inner-cust-wrapper a')[0]);
      if(elem.querySelectorAll('.custom-images-gallery-desc a')[0]){
       var overlayLink = '<a href="'+elem.querySelectorAll('.custom-images-gallery-desc p a')[0].getAttribute('href')+'" class="link-overlay"></a>';

       elemContentWrapper.insertAdjacentHTML('beforebegin', overlayLink);
     }


     if(imageGalleryGlobalParam.textAlignment){
      elem.classList.add('gallery-alignment-'+imageGalleryGlobalParam.textAlignment);
    }
  });
  }
}());	