




  /* 

⚠️ Ghost Plugin Code Start ⚠️ 
Copyright 2020.

CAN BE ONLY ONE SLIDE PER PAGE

*/




document.querySelectorAll('.sqs-gallery-design-list .summary-item-list').forEach(function(thisListGallery){

    var slider = tns({
      container: thisListGallery,
      items: 1,
      gutter: 0,
      edgePadding: 0,
      nav: true,
      navPosition: 'bottom',
      loop: true,
      edgePadding: 0,
      mouseDrag: true,
      controlsPosition: 'bottom',
      prevButton: false,
      controlsText: ['', '']
    });
  
  


  var theSlideshow = thisListGallery;
  theSlideshow.closest('section').classList.add('section-with-full-width-slider');

  if(globalGhostSliderParams.transparentHeaderAboveSlider){
    theSlideshow.closest('section').classList.add('transparent-header-above-slider');
  }

  theSlideshow.querySelectorAll('.summary-excerpt a').forEach(function(buttonEl){
    buttonEl.classList.add('sqs-block-button-element--medium');
    buttonEl.classList.add('sqs-block-button-element');
  });

  theSlideshow.classList.add(globalGhostSliderParams.textAlignment+'-alignment');
  theSlideshow.classList.add('ghost-slideshow-7-1');
})



  /* 

⚠️ Ghost Plugin Code END ⚠️ 

*/