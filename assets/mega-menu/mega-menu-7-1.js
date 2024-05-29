if(window.location.href.indexOf('mega-menu') !== -1){
  //window.location.href = "/";
}

function mobileMenuAdditionalHelper(thisElemMobItem){
  console.log(thisElemMobItem+ ' with func');
  thisElemMobItem.querySelectorAll('.sqs-layout > .sqs-row')[0].insertAdjacentHTML('afterbegin', '<a class="header-menu-controls-control header-menu-controls-control--active mega-menu-mob-close" data-action="back" href="/" tabindex="0"><span class="chevron chevron--left"></span><span>Back</span></a>')
  thisElemMobItem.style.paddingTop = headerHeightMegaMenu+'px';
  thisElemMobItem.querySelector('.sections').style.paddingBottom = headerHeightMegaMenu+'px';
  thisElemMobItem.querySelectorAll('.mega-menu-mob-close')[0].addEventListener("click", function( event ) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelectorAll('.active-mm-mobile')[0].classList.remove('active-mm-mobile');
  });
}
function transferComplete(elemType) {
  //console.log(elemType.querySelectorAll('.sqs-layout > .sqs-row')[0]);
  document.querySelectorAll('.mm-item-mobile').forEach(function(elemElem){
   elemElem.querySelectorAll('.sqs-layout > .sqs-row')[0].insertAdjacentHTML('afterbegin', '<a class="header-menu-controls-control header-menu-controls-control--active mega-menu-mob-close" data-action="back" href="/" tabindex="0"><span class="chevron chevron--left"></span><span>Back</span></a>')
   elemElem.style.paddingTop = headerHeightMegaMenu+'px';
   elemElem.querySelector('.sections').style.paddingBottom = headerHeightMegaMenu+'px';
 });

}
function getPage(url, from, to) {
  var cached=sessionStorage[url];
  if(!from){from="body";}
  if(to && to.split){to=document.querySelector(to);} 
  if(!to){to=document.querySelector(from);} 
  if(cached){return to.innerHTML=cached;} 

  var XHRt = new XMLHttpRequest; 
  XHRt.responseType='document';  
  
  XHRt.onload= function() { 
    sessionStorage[url]=to.innerHTML = XHRt.response.querySelector(from).innerHTML;
  };
  XHRt.open("GET", url, true);
  console.log('this el is ='+to);
  XHRt.send();
  XHRt.upload.addEventListener("load", transferComplete(sessionStorage[url]=to.innerHTML));


  //for place

  return XHRt;
 // mobileMenuAdditionalHelper(to);
}



document.querySelectorAll('#header')[0].insertAdjacentHTML('afterend', '<div id="mega-menu-item-host-element"></div>');

var mainHeader = document.querySelectorAll('#header')[0];
var headerHeightMegaMenu = mainHeader.offsetHeight;

function removeActiveMegaMenu(){
  if(document.querySelectorAll('.active-menu')[0]){
    document.querySelectorAll('.active-menu')[0].classList.remove('active-menu');
    document.querySelectorAll('.active-header-item')[0].classList.remove('active-header-item');
  }
}


document.querySelectorAll('.header-nav-item--external a[href*="mega-menu"]').forEach(function(megaMenuItem){
  var thisHref = megaMenuItem.getAttribute('href').replace("/", "");
  megaMenuItem.classList.add('header-menu-mega-menu-parent');
  megaMenuItem.setAttribute('data-mm', thisHref);
  document.querySelectorAll('#mega-menu-item-host-element')[0].insertAdjacentHTML('beforeend', '<div class="mm-item" data-menu="'+thisHref+'" id="mega-menu-item-desc-'+thisHref+'"></div>');
  getPage("/"+thisHref, "#page", "#mega-menu-item-desc-"+thisHref);

  megaMenuItem.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
  })
});



document.querySelectorAll('.header-menu-mega-menu-parent').forEach(function(aElem){
  aElem.addEventListener("mouseenter", function( event ) {   
    console.log( document.getElementById('mega-menu-item-desc-'+aElem.getAttribute('data-mm')))
    document.getElementById('mega-menu-item-desc-'+aElem.getAttribute('data-mm')).classList.add('active-menu');

    aElem.classList.add('active-header-item');
  }, false);

});



document.querySelectorAll('.header-nav-item').forEach(function(headerElem){
  headerElem.addEventListener("mouseenter", function( event ) {   
    // if(document.querySelectorAll('.active-menu')[0]){
    //   if(!headerElem.classList.contains('active-menu')){
    //     document.querySelectorAll('.active-menu')[0].classList.remove('active-menu');
    //     document.querySelectorAll('.active-header-item')[0].classList.remove('active-header-item');
    //   }
    // }
    removeActiveMegaMenu();
  }, false);
})



document.querySelectorAll('.mm-item').forEach(function(menuElem){
  menuElem.style.top = headerHeightMegaMenu+'px';



  menuElem.addEventListener("mouseenter", function( event ) {
    mainHeader.querySelectorAll('a[href="/'+menuElem.getAttribute('data-menu')+'"]')[0].classList.add('active-header-item');
    menuElem.classList.add('active-menu');
  }, false);


  menuElem.addEventListener("mouseleave", function( event ) {
   removeActiveMegaMenu();
 }, false);

});




mainHeader.addEventListener("mouseleave", function( event ) {  
 removeActiveMegaMenu();
}, false);



window.addEventListener('scroll', function(e) {
  removeActiveMegaMenu();
});



/*

MOBILE

*/
document.querySelectorAll('.header-menu--folder-list')[0].insertAdjacentHTML('beforeend', '<div id="mega-menu-item-mobile-host-element"></div>');
document.querySelectorAll('.header-menu-nav-item--external a[href*="mega-menu"]').forEach(function(megaMenuItem){
  var thisHref = megaMenuItem.getAttribute('href').replace("/", "");
  var thisItemId = 'mega-menu-mobile-item-'+thisHref;
  megaMenuItem.classList.add('header-mobile-mega-menu-parent-mobile');
  megaMenuItem.setAttribute('data-mm', thisHref);
  document.querySelectorAll('#mega-menu-item-mobile-host-element')[0].insertAdjacentHTML('beforeend', '<div class="mm-item-mobile" data-menu="'+thisHref+'" id="'+thisItemId+'"></div>');
  
  getPage("/"+thisHref, "#page", "#"+thisItemId);
  
  var $thisItemElem = document.getElementById(thisItemId);
  if($thisItemElem.querySelectorAll('.sqs-layout > .sqs-row')[0]){
    mobileMenuAdditionalHelper($thisItemElem);
  }
  
});






document.querySelectorAll('.header-mobile-mega-menu-parent-mobile').forEach(function(aElem){
  aElem.addEventListener("click", function( event ) {   
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('mega-menu-mobile-item-'+aElem.getAttribute('data-mm')).classList.add('active-mm-mobile');
  });
});


// var timerId2 = setInterval(function() {
//     if(elemElem.querySelectorAll('.sqs-layout > .sqs-row')[0]){
//    clearInterval(timerId2);
//     }else{
//       console.log('?');
//     }
//   }, 1000);


// document.querySelectorAll('.mm-item-mobile').forEach(function(elemElem){
//   elemElem.querySelectorAll('.sqs-layout > .sqs-row')[0].insertAdjacentHTML('afterbegin', '<a class="header-menu-controls-control header-menu-controls-control--active mega-menu-mob-close" data-action="back" href="/" tabindex="0"><span class="chevron chevron--left"></span><span>Back</span></a>')
//   elemElem.style.paddingTop = headerHeightMegaMenu+'px';
//   elemElem.querySelector('.sections').style.paddingBottom = headerHeightMegaMenu+'px';
// });



// document.querySelectorAll('.mega-menu-mob-close').forEach(function(aElem){
//   aElem.addEventListener("click", function( event ) {
//     event.preventDefault();
//     event.stopPropagation();
//     document.querySelectorAll('.active-mm-mobile')[0].classList.remove('active-mm-mobile');
//   });
// });

// setTimeout(function(){
//   document.querySelectorAll('#mega-menu-item-host-element img').forEach(function(menuImgs){
//     console.log(menuImgs.getAttribute('data-src'));
//     menuImgs.setAttribute('src', menuImgs.getAttribute('data-src'));
//   });

// },4000)






