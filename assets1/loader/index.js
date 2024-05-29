 if(ghostLoaderOptions.showLoaderOnlyOnce && localStorage.getItem('loaderLoaded') == 'yes'){
  document.querySelector('.preloaded').style.display = 'none';
}
localStorage.setItem('loaderLoaded', 'yes');

let preloaderElem = document.querySelector('.preloaded'),
preloadBranding = preloaderElem.querySelector('.header-title-text');

 //title or image
 if(ghostLoaderOptions.loaderType == 'image'){
  preloadBranding.innerHTML = '<img src="'+ghostLoaderOptions.loaderImage+'">';
}else{
 preloadBranding.textContent = ghostLoaderOptions.loaderTitle;
}

if(ghostLoaderOptions.removeLoadingCircle){
  preloaderElem.querySelector('svg').style.display = 'none';
}


preloaderElem.style.transition = 'all '+ghostLoaderOptions.loaderFadeTime+'ms ease'; 
window.addEventListener('load',function(){
  setTimeout(function(){
   preloaderElem.classList.add('hide-animation');
   setTimeout(function(){
     document.querySelector('body').classList.add("loaded");  
   }, ghostLoaderOptions.loaderFadeTime);
 }, ghostLoaderOptions.loaderAdditionalDelay);
});