//import confetti from 'https://cdn.skypack.dev/canvas-confetti'; 
document.querySelectorAll(".form-wrapper").forEach(function(e){if(document.body.contains(e.querySelector('.form-submission-html[data-submission-html*="wrytePostSubmitGhost"]'))){let o=document.querySelector(".form-inner-wrapper .field-list"),r='<div class="wrap-custom-form"></div>',l="";e.classList.add("wryte-ghost-plugin"),o.insertAdjacentHTML("afterend",r);let c=document.querySelector(".wrap-custom-form");function t(e){document.querySelector("input#"+e.target.getAttribute("data-id")+"-field").value=e.target.value}o.querySelectorAll(".form-item").forEach(function(e){let t=e.getAttribute("id"),o=e.querySelector("input").getAttribute("placeholder")?e.querySelector("input").getAttribute("placeholder"):"",r='<input type="text" placeholder="'+o+'" data-id="'+t+'">',c='<label class="from-label" data-id="'+t+'">'+(e.contains(e.querySelector("label"))?e.querySelector("label").outerHTML:"")+"</label>",i='<label class="from-desc" data-id="'+t+'">'+(e.contains(e.querySelector(".description"))?e.querySelector(".description").innerText:"")+"</label>";console.log(o),l+=c+r+i}),c.insertAdjacentHTML("afterbegin",l),c.querySelectorAll("input").forEach(function(e){e.onchange=t})}else e.classList.add("loaded")}); window.wrytePostSubmitGhost=function(){confetti()};