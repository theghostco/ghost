!function(e,t,n,r){function o(e,t){document.querySelectorAll(`[${e}]`).forEach(n=>{let r=function e(t,n){let r=t;for(;r.parentElement;){if(r.parentElement.tagName.toLowerCase()===n.toLowerCase())return r.parentElement;r=r.parentElement}return null}(n,t);r&&r.setAttribute(e,"")})}o(e,"section"),o(e,"body"),document.documentElement.style.setProperty("--blur-items-gap",`${n}px`),document.documentElement.style.setProperty("--items-count",`${r}`);let i=document.querySelector(`div[${e}]`),l=e=>{var n;let r=[],o;o=t<e.length?t:e.length;for(let l=0;l<o;l++){let a=e[l].title;e[l].excerpt;let s=e[l].assetUrl,u=e[l].body,c=document.createElement("div");c.innerHTML=u;let d=e[l].fullUrl,m=`
<a href=${d} class="blur-item">
    <figure class="blur-item-image">
     <img src=${s}>
    </figure>
    <div class="blur-item-text-container">
		<div class="text-container-top">
			        <h2 class="text-container-title">
        ${a}
</h2>
		 </div>
		<div class="text-container-bottom">
			  <buttont type="button" class="read-more-btn">
</button>
		 </div>
    </div>
</a>`;r.push(m)}n=`<div class="blur-container">
              ${r.join("")}
</div>`,i.innerHTML=n};document.addEventListener("DOMContentLoaded",()=>{let t=document.querySelector(`body[${e}]`);if(t&&i){let n=i.getAttribute("data-blog-href");(function e(t){let n=document.location.origin+"/"+t+"?format=json-pretty";return fetch(n).then(e=>e.json())})(n).then(t=>{l(t.items),function t(){let n=document.querySelector(`section[${e}]`),r=n.querySelectorAll(".blur-item"),o=Array.from(r),i=document.querySelector(".blur-container");function l(e){e.setAttribute("img-on-hover","")}function a(e){e.removeAttribute("img-on-hover")}function s(e){e.forEach(e=>{e.removeAttribute("data-active")})}i.addEventListener("mouseleave",()=>{s(o)}),r.forEach((e,t)=>{e.addEventListener("mouseenter",()=>{s(o),function e(t){t.setAttribute("data-active","");let n=t.querySelector(".text-container-title"),r=t.querySelector(".read-more-btn");n.addEventListener("mouseenter",()=>{l(t)}),n.addEventListener("mouseleave",()=>{a(t)}),r.addEventListener("mouseenter",()=>{l(t)}),r.addEventListener("mouseleave",()=>{a(t)})}(e)})})}()})}})}(values.sectionAttribute,values.limit,values.gap,values.itemsInRow);
