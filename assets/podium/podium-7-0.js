window.Squarespace.onInitialize(Y, function() { var isGallery=document.querySelectorAll(".sqs-gallery-design-carousel")[0],pluginName="podium",thisSliderObject=globalGhostpodiumParams;void 0!==isGallery&&null!=isGallery&&document.querySelectorAll(".sqs-gallery-design-carousel").forEach(function(e){var t=e.querySelector(".summary-header-text");if((t.innerText||t.textContent)==pluginName){e.classList.add(pluginName+"-plugin");var i=e.closest(".sqs-block").getAttribute("id");e.closest("section").classList.add("section-with-"+pluginName+"-slider");let t='<button class="swiper-button-next"><svg viewBox="0 0 128 16" class="personastyles__ArrowIcon-sc-1ce6ucj-14 dvxess"><line stroke="currentColor" stroke-width="2" x1="0" x2="127" y1="8" y2="8"></line><polyline fill="none" points="120,1 127,8 120,15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg></button>',n='<button class="slider-button">'+thisSliderObject.slideButton+"</button>",c='<h3 class="'+pluginName+'-counter-wrapper"><span class="current-counter"></span><span class="separator">&thinsp;/&thinsp;</span><span class="totall-count"></span></h3>';e.insertAdjacentHTML("afterbegin",t+c+'<div class="'+pluginName+'-images-wrapper swiper-container"><div class="'+pluginName+'-inner-wrapper swiper-wrapper"></div></div><div class="slider-background"></div>');var r=e.querySelector("."+pluginName+"-inner-wrapper");e.querySelector(".summary-item").classList.add("current-active");e.querySelectorAll(".summary-item").forEach(function(t,s){0;var a=i+"-slide-"+s;t.setAttribute("data-slide-id",a);let l=t.querySelector(".summary-title-link"),c=l.innerText||l.textContent,o=t.querySelector(".summary-excerpt p").outerHTML||t.querySelector(".summary-excerpt p").textContent,d=t.querySelector(".summary-thumbnail-outer-container > a").getAttribute("href"),u=t.querySelector(".summary-metadata-item--tags a"),p="transparent";void 0!==u&&null!=u&&(p=t.querySelector(".summary-metadata-item--tags a").textContent);let m='<div class="image-slide-inner"><img src="'+t.querySelector(".summary-thumbnail img").getAttribute("data-src")+'?format=2500"></div>',g='<div class="'+pluginName+'-slide image-slide swiper-slide swiper-slide" data-slide-img-id="'+a+'" data-bg="'+p+'"><a href="'+d+'"><div class="info-slide">'+('<div class="title-wrapper"><h3>'+c+"</h3></div>")+('<div class="desc-wrapper"><p>'+o+"</p></div>")+n+"</div>"+m+"</a></div>";r.insertAdjacentHTML("beforeend",g),t.addEventListener("click",function(i){console.log(t.getAttribute("data-slide-id")),t.classList.contains("current-active")||(e.querySelector(".current-active").classList.remove("current-active"),e.querySelector(".active-slide").classList.remove("active-slide"),t.classList.add("current-active"),e.querySelector('.image-slide[data-slide-img-id="'+t.getAttribute("data-slide-id")+'"]').classList.add("active-slide"))})});var s=!1;thisSliderObject.autoplay&&(s={delay:thisSliderObject.autoplayDelay}),console.log("."+pluginName+"-plugin .swiper-container");var a=new Swiper("."+pluginName+"-plugin .swiper-container",{loop:!0,autoplay:s,slidesPerView:1,effect:"fade",fadeEffect:{crossFade:!0},spaceBetween:0,speed:600,navigation:{nextEl:".swiper-button-next",preloadImages:!0,updateOnImagesReady:!1},initialSlide:0,on:{init:function(){l()}}});function l(){let t=e.querySelector("."+pluginName+"-plugin .swiper-slide-active"),i=+t.getAttribute("data-swiper-slide-index")+1;console.log(i),console.log(t.getAttribute("data-bg")),setTimeout(function(){e.querySelector(".current-counter").innerHTML=i},300),e.querySelector(".slider-background").style.background=t.getAttribute("data-bg")}a.on("slideChangeTransitionStart",function(){l()}),e.querySelector(".totall-count").innerHTML=a.slides.length-2,e.querySelector(".summary-item").classList.add("current-active"),e.querySelector(".image-slide").classList.add("active-slide")}});});