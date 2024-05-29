//var isGallery=document.querySelectorAll(".sqs-gallery-design-carousel")[0],pluginName="shape";void 0!==isGallery&&null!=isGallery&&document.querySelectorAll(".sqs-gallery-design-carousel").forEach(function(a){var b=a.querySelector(".summary-header-text"),c=b.innerText||b.textContent,d=0;if(c==pluginName){a.classList.add(pluginName+"-plugin");var e=a.closest(".sqs-block").getAttribute("id");a.closest("section").classList.add("section-with-"+pluginName+"-slider"),a.insertAdjacentHTML("afterbegin",'<div class="'+pluginName+"-images-wrapper swiper-container-"+d+'"><div class="'+pluginName+'-inner-wrapper swiper-wrapper"></div><div class="swiper__button"> <div class="index__wrap"> <div class="index__current"> <span class="index-vissible"> </span> <span class="index-next"> </span> <span> / </span> </div> <div class="index__total"> <span class="index-total"> </span> </span> </div> </div> <div class="button__wrap"> <div class="prev btn"> <img src="https://hulo-features.squarespace.com/s/arrow-left_icon-iconscom_72376.svg" alt=""> </div> <div class="next btn"> <img src="https://hulo-features.squarespace.com/s/arrow-right_icon-iconscom_72375.svg" alt=""> </div> </div> </div></div>');var f=a.querySelector("."+pluginName+"-inner-wrapper");a.querySelector(".summary-item").classList.add("current-active");var g=0;a.querySelectorAll(".summary-item").forEach(function(b,l){g++;var h=e+"-slide-"+l;b.setAttribute("data-slide-id",h);let c=b.querySelector(".summary-title-link"),i="";void 0!==c&&null!=c&&(i=c.innerText||c.textContent);let m=b.querySelector(".summary-excerpt p").outerHTML||b.querySelector(".summary-excerpt p").textContent,n=b.querySelector(".summary-thumbnail-outer-container > a").getAttribute("href"),j=b.querySelector(".summary-metadata-item--tags a"),k="transparent";void 0!==j&&null!=j&&(k=b.querySelector(".summary-metadata-item--tags a").textContent),console.log(k);let o='<div class="image-slide-inner"><img src="'+b.querySelector(".summary-thumbnail img").getAttribute("data-src")+'?format=2500"></div>',p='<div class="desc-wrapper">'+m+"</div>",q='<div class="'+pluginName+'-slide image-slide swiper-slide swiper-slide" data-slide-img-id="'+h+'"><a href="'+n+'">'+o+'<h3 class="slide-title">'+i+'</h3><div class="info-slide">'+p+"</div></a></div>";f.insertAdjacentHTML("beforeend",q),setTimeout(function(){new Swiper(".shape-plugin .swiper-container-"+d,{autoplay:!1,slidesPerView:1,centeredSlides:!0,loop:!0,navigation:{nextEl:".next",prevEl:".prev"},breakpoints:{800:{slidesPerView:3,spaceBetween:30}},on:{slideChange:function(){setTimeout(function(){console.log("lorem"),f()},300)}},spaceBetween:40,speed:600}),a.style.opacity=1,d++;let c=document.querySelectorAll(".shape-plugin .swiper-slide"),e=document.querySelectorAll(".shape-plugin .swiper-slide-duplicate"),b=c.length-e.length;function f(){var a=document.querySelector(".shape-plugin .swiper-slide-active").getAttribute("aria-label");(a=a.split("/")[0])<10?document.querySelector(".index-vissible").innerHTML="0"+a:document.querySelector(".index-vissible").innerHTML=a}(console.log(b),b<10)?document.querySelector(".shape-plugin .index-total").innerHTML="0"+b:document.querySelector(".shape-plugin .index-total").innerHTML=b,f(),document.querySelectorAll(".btn").forEach(function(a){a.addEventListener("click",f)})},100)})}})
;(function(){



  var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];
  var pluginName = 'shape';
  var svgArrow = '<svg height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M322.7,128.4L423,233.4c6,5.8,9,13.7,9,22.4c0,8.7-3,16.5-9,22.4L322.7,383.6c-11.9,12.5-31.3,12.5-43.2,0  c-11.9-12.5-11.9-32.7,0-45.2l48.2-50.4h-217C93.7,288,80,273.7,80,256c0-17.7,13.7-32,30.6-32h217l-48.2-50.4  c-11.9-12.5-11.9-32.7,0-45.2C291.4,115.9,310.7,115.9,322.7,128.4z"/></svg>';

  if (typeof(isGallery) != 'undefined' && isGallery != null){


   document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
    var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
    var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;
    var countSection = 0;
    if(thisHeadText == pluginName){
     thisSummary.classList.add(pluginName+'-plugin');
     var thisSummaryParent = thisSummary.closest('.sqs-block');
     var thisSummaryId = thisSummaryParent.getAttribute('id');
     thisSummary.closest('section').classList.add('section-with-'+pluginName+'-slider');


     thisSummary.insertAdjacentHTML('afterbegin', '<div class="'+pluginName+'-images-wrapper swiper-container-'+countSection+'"><div class="'+pluginName+'-inner-wrapper swiper-wrapper"></div><div class="swiper__button"> <div class="index__wrap"> <div class="index__current"> <span class="index-vissible"> </span> <span class="index-next"> </span> <span> / </span> </div> <div class="index__total"> <span class="index-total"> </span> </span> </div> </div> <div class="button__wrap"> <div class="prev btn"> '+svgArrow+' </div> <div class="next btn"> '+svgArrow+' </div> </div> </div></div>');
     var imagesPlace = thisSummary.querySelector('.'+pluginName+'-inner-wrapper');

        thisSummary.querySelector('.summary-item').classList.add('current-active'); //set default
        //
        var countItems = 0;
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
        	countItems++;
        	var newId = thisSummaryId+'-slide-'+i;

        	thisSlide.setAttribute('data-slide-id', newId);


          //content vars
          let summaryTitle = thisSlide.querySelector('.summary-title-link');
          let summaryTitleText =  '';
          if (typeof(summaryTitle) != 'undefined' && summaryTitle != null){
          	summaryTitleText = summaryTitle.innerText || summaryTitle.textContent;
          }

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
          // let slideTitle = '<div class="title-wrapper"><h3>''</h3></div>';
          let description = '<div class="desc-wrapper">'+summaryDescription+'</div>';

          let mainMarkup = '<div class="'+pluginName+'-slide image-slide swiper-slide swiper-slide" data-slide-img-id="'+newId+'"><a href="'+summaryLink+'">' + slideImage + '<h3 class="slide-title">'+summaryTitleText+'</h3><div class="info-slide">'+ description + '</div></a></div>';

          imagesPlace.insertAdjacentHTML('beforeend', mainMarkup);

          setTimeout(function(){
            //initialize swiper when document ready
            var mySwiper = new Swiper ('.shape-plugin .swiper-container-'+countSection+'',{

            	autoplay: false,
            	slidesPerView: 1,
            	centeredSlides: true,
            	loop: true,
            	navigation: {
            		nextEl: '.next',
            		prevEl: '.prev',
            	},
            	breakpoints: {
            		800: {
            			slidesPerView: 3,
            			spaceBetween: 30
            		}
            	},
            	on: {
            		slideChange: function() {
            			setTimeout(function(){
            				console.log('lorem')
            				checkIndex();
            			},300)

            		}
            	},
            	spaceBetween: 40,
            	speed: 600
            });
            thisSummary.style.opacity = 1;
            countSection++;
            //pagination function
            let slideItem = document.querySelectorAll('.shape-plugin .swiper-slide');
            let slideItemDublicate = document.querySelectorAll('.shape-plugin .swiper-slide-duplicate');
            let countItem = slideItem.length - slideItemDublicate.length;
            console.log(countItem);
            if(countItem < 10){
            	var getNum = document.querySelector('.shape-plugin .index-total')
            	getNum.innerHTML = '0' + countItem
            }else{
            	var getNumAll = document.querySelector('.shape-plugin .index-total')
            	getNumAll.innerHTML = countItem
            }

            checkIndex();

            function checkIndex(){

            	let index = document.querySelector('.shape-plugin .swiper-slide-active');
            	var getAttrIndex = +index.getAttribute('data-swiper-slide-index')+1;
          	//getAttrIndex = getAttrIndex.split('/')[0];
          	if(getAttrIndex < 10){
                //  $('.index-vissible').text('0' + index );
                var getVisible = document.querySelector('.index-vissible')
                getVisible.innerHTML = '0' + getAttrIndex
              }else{
               var getVisible2 = document.querySelector('.index-vissible')
               getVisible2.innerHTML = getAttrIndex
             }
           }
           var div = document.querySelectorAll('.btn');
           div.forEach(function(slide){
             slide.addEventListener('click',checkIndex );
           })
         },100);
        });
}

});
}
}());