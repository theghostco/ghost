!function(){let e=document.querySelectorAll(".sqs-gallery-design-carousel")[0];if(void 0!==e&&null!=e){function t(e,t){t.querySelector(".aira-images-wrapper").classList.add("show-gallery"),e.classList.contains("current-active")||(t.querySelector(".current-active").classList.remove("current-active"),t.querySelector(".active-slide").classList.remove("active-slide"),e.classList.add("current-active"),t.querySelector('.image-slide[data-slide-img-id="'+e.getAttribute("data-slide-id")+'"]').classList.add("active-slide"))}document.querySelectorAll(".sqs-gallery-design-carousel").forEach(function(e){var r=e.querySelector(".summary-header-text");if("aira"==(r.innerText||r.textContent)){e.classList.add("aira-plugin");var a=e.closest(".sqs-block").getAttribute("id");e.closest("section").classList.add("section-with-aira-slider"),e.closest("body").classList.add("page-with-aira-plugin"),e.insertAdjacentHTML("afterbegin",'<div class="aira-images-wrapper"><div class="aira-inner-wrapper"></div></div>');var i=e.querySelector(".aira-inner-wrapper");e.querySelector(".summary-item").classList.add("current-active");e.querySelectorAll(".summary-item").forEach(function(r,s){0;var l=a+"-slide-"+s;r.setAttribute("data-slide-id",l);let c=r.querySelector(".summary-title-link"),d=(c.innerText||c.textContent,r.querySelector(".summary-excerpt p").outerHTML||r.querySelector(".summary-excerpt p").textContent,r.querySelector(".summary-thumbnail-outer-container > a").getAttribute("href"),r.querySelector(".summary-metadata-item--tags a")),n="transparent";void 0!==d&&null!=d&&(n=r.querySelector(".summary-metadata-item--tags a").textContent);let u='<div class="aira-slide image-slide" data-slide-img-id="'+l+'">'+('<div class="image-slide-inner"><img src="'+r.querySelector(".summary-thumbnail img").getAttribute("data-src")+'?format=2500"></div>')+"</div>";i.insertAdjacentHTML("beforeend",u),r.querySelector(".summary-title").addEventListener("click",function(a){t(r,e)}),r.querySelector(".summary-title").addEventListener("mouseenter",function(a){t(r,e)}),r.querySelector(".summary-title").addEventListener("mouseout",function(t){e.querySelector(".aira-images-wrapper").classList.remove("show-gallery")})}),e.querySelector(".summary-item").classList.add("current-active"),e.querySelector(".image-slide").classList.add("active-slide")}})}}();