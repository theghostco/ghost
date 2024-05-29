 ;(function(){
  document.querySelectorAll('.gallery-reel-item-wrapper').forEach(function(elemNode){
    var link, linkText;
    if(elemNode.closest('.gallery-reel-image-link')){
      link = elemNode.closest('.gallery-reel-image-link').getAttribute('href');
      var cutLink = link.split('[');
      if(cutLink){
        link = cutLink[0];
        linkText = cutLink[1].replace(']', '');
        elemNode.closest('.gallery-reel-image-link').setAttribute('href', link);
      }
    }
    if(link){
      elemNode.insertAdjacentHTML('beforeend', '<div class="reel-text"><p>'+elemNode.querySelectorAll('img')[0].getAttribute('alt')+'</p><span class="fake-button">'+linkText+'</a></div>');
    }else{
      elemNode.insertAdjacentHTML('beforeend', '<div class="reel-text"><p>'+elemNode.querySelectorAll('img')[0].getAttribute('alt')+'</p></div>');
    }
  });
}());


