
/* 👻 Ghost Plugin Code Start ⚠️ Copyright 2020 */

window.Squarespace.onInitialize(Y, function() { 
	
var iframeContainer = '<div id="iframe-vimeo-place"></div>';
var scrollToIframe = '<div id="scroll-to-iframe-vimeo"></div>';
var closeVideo = '<div id="close-iframe"><svg height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z"/></svg></div>';
var isGallery = document.querySelectorAll('.sqs-gallery-container.sqs-gallery-block-grid')[0];


if (typeof(isGallery) != 'undefined' && isGallery != null){
  isGallery.insertAdjacentHTML('beforebegin', scrollToIframe);
  isGallery.insertAdjacentHTML('beforebegin', closeVideo);
  isGallery.insertAdjacentHTML('beforebegin', iframeContainer);
  
  document.querySelectorAll('body')[0].classList.add('page-with-custom-gallery');

  let elementsArray = document.querySelectorAll(".sqs-gallery-container.sqs-gallery-block-grid .slide .margin-wrapper");

  elementsArray.forEach(function(elem) {
    var elemContentWrapper = elem.querySelectorAll('.content-wrapper')[0];

    var elemDesc = elemContentWrapper.getAttribute('data-description');
    var elemTitle = elemContentWrapper.getAttribute('data-title');

    var overlayDescription = '<div class="custom-gallery-desc"><div class="inner-cust-wrapper"><h3>'+elemTitle+'</h3>'+elemDesc+'</div></div>';

    elemContentWrapper.insertAdjacentHTML('beforebegin', overlayDescription);
     if(videoGalleryGlobalParam.textAlignment){
          elem.classList.add('gallery-alignment-'+videoGalleryGlobalParam.textAlignment);
        }

    
    elem.addEventListener("click", function() {

      if(document.querySelectorAll('.active-gallery-item')[0]){
        document.querySelectorAll('.active-gallery-item')[0].classList.remove('active-gallery-item');
      }
      elem.classList.add('active-gallery-item');
      document.getElementById('iframe-vimeo-place').innerHTML = '';
      document.getElementById('iframe-vimeo-place').classList.add('opened-video');
      document.getElementById('close-iframe').classList.add('opened');
      document.getElementById('iframe-vimeo-place').insertAdjacentHTML('afterbegin', elem.querySelectorAll('.sqs-video-wrapper')[0].getAttribute('data-html'));
      EPPZScrollTo.scrollVerticalToElementById('scroll-to-iframe-vimeo', 80);
    });
  });

  
  document.getElementById('close-iframe').addEventListener("click", function() {
    document.getElementById('iframe-vimeo-place').innerHTML = '';
    document.getElementById('iframe-vimeo-place').classList.remove('opened-video');
    
    document.getElementById('close-iframe').classList.remove('opened');
  })
}
}); 

/* 👻 Ghost Plugin Code End ⚠️ Copyright 2020 */
