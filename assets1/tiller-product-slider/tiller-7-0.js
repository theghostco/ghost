window.Squarespace.onInitialize(Y, function() {var isGallery=document.querySelectorAll(".sqs-gallery-design-carousel")[0];void 0!==isGallery&&null!=isGallery&&document.querySelectorAll(".sqs-gallery-design-carousel").forEach(function(e){var i=e.querySelector(".summary-header-text");if("tiller-product-slider"==(i.innerText||i.textContent)){e.classList.add("tiller-product-slider-plugin"),e.closest("section").classList.add("section-with-full-width-slider");var t=e.closest(".sqs-block").getAttribute("id");e.insertAdjacentHTML("beforeend",'<div class="tiller-product-slider-wrapper swiper-container"><div class="tiller-product-slider-inner-wrapper swiper-wrapper"></div></div>');var r=e.querySelector(".tiller-product-slider-inner-wrapper");e.querySelectorAll(".summary-item").forEach(function(i,s){var l=t+"-slide-"+s;i.setAttribute("data-slide-id",l);let n=i.querySelector(".summary-title-link"),a=n.innerText||n.textContent,d=n.getAttribute("href"),o=i.querySelector(".sqs-money-native").innerText||i.querySelector(".sqs-money-native").textContent,c=i.querySelector(".summary-excerpt p"),u=void 0!==c&&null!=c?c.innerText||c.textContent:"",p='<div class="tiller-slide image-slide swiper-slide" data-slide-img-id="'+l+'">'+('<a href="'+d+'" class="image-slide-inner"><img src="'+i.querySelector(".summary-thumbnail img").getAttribute("data-src")+'"></a>')+'<div class="info-slide">'+('<div class="title-wrapper"><h3><a href="'+d+'">'+a+"</a></h3></div>")+('<span class="sqs-money-native">'+o+"</span>")+('<div class="desc-wrapper"><p>'+u+"</p></div>")+('<a href="'+d+'" class="buy-button sqs-block-button-element--medium sqs-block-button-element">'+globalGhostTillerParams.buttonText+"</a>")+"</div></div>";r.insertAdjacentHTML("beforeend",p),globalGhostTillerParams.transparentHeaderAboveSlider&&e.closest("section").classList.add("transparent-header-above-slider")}),e.insertAdjacentHTML("afterend",'<div class="tiller-product-slider-control-wrapper"><div class="nums-slider"><span class="active-slide animation"></span><span class="separator"> / </span><span class="count-slides"></span></div><div class="slider-control tiller-product-slider-control"><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div></div>');var s=new Swiper(".tiller-product-slider-plugin .swiper-container",{loop:!0,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev",preloadImages:!1,updateOnImagesReady:!1},slidesPerView:1,speed:600,effect:"fade",initialSlide:0});s.on("transitionStart",function(){document.querySelector(".tiller-slide .info-slide.animation").classList.remove("animation")}),s.on("transitionEnd",function(){document.querySelector(".tiller-product-slider-plugin .swiper-slide-active").querySelector(".tiller-slide .info-slide").classList.add("animation")}),s.on("slideChangeTransitionEnd",function(){let e=+document.querySelector(".tiller-product-slider-plugin .swiper-slide-active").getAttribute("data-swiper-slide-index")+1;console.log(e),document.querySelector(".nums-slider .active-slide").innerHTML=e}),document.querySelector(".nums-slider .count-slides").innerHTML=s.slides.length-2,document.querySelector(".nums-slider .active-slide").innerHTML=+document.querySelector(".tiller-product-slider-plugin .swiper-slide-active").getAttribute("data-swiper-slide-index")+1,document.querySelector(".tiller-product-slider-plugin .swiper-slide-active .info-slide").classList.add("animation")}});});