!function(e){let t={setAttrParents:function e(t,r){document.querySelectorAll(`[${t}]`).forEach(e=>{let l=function e(t,r){let l=t;for(;l.parentElement;){if(l.parentElement.tagName.toLowerCase()===r.toLowerCase())return l.parentElement;l=l.parentElement}return null}(e,r);l&&l.setAttribute(t,"")})},fetchData:function e(t){let r=document.location.origin+t+"?format=json-pretty";return fetch(r).then(e=>e.json())}};t.setAttrParents(e,"section");let r=document.querySelector(`div[${e}]`),l=e=>{r.innerHTML=e,function e(){let t=document.querySelectorAll(".bg-trigger-item");t.forEach(e=>{e.addEventListener("mouseenter",()=>{let t=e.getAttribute("data-color");document.documentElement.style.setProperty("--hover-color",t),document.body.classList.add("hover-active")}),e.addEventListener("mouseleave",()=>{document.documentElement.style.setProperty("--hover-color",""),document.body.classList.remove("hover-active")})})}()},o=e=>{let t=[];for(let r=0;r<e.length;r++){console.log("items[i]",e[r]);let o=e[r].title,n=e[r].fullUrl,i=e[r].assetUrl,a=e[r].body,s=document.createElement("div");s.innerHTML=a;let c=s.querySelector("img"),g=c?c.getAttribute("data-src"):"",u=`<a href=${n} data-color=${e[r].tags} class="bg-trigger-item">
                 <h1>${o}</h1>
				
				<div class="bg-trigger-img-box">
                <figure class="bg-trigger-img">
                 	<img src=${i}>
                </figure>
				<div class="bg-trigger-media">
                  <img src=${g}>
                </div>
				</div>
			 </a>`;t.push(u)}l(t.join(""))},n=()=>{let e=r.getAttribute("data-blog-href");t.fetchData(e).then(e=>{o(e.items)})};document.addEventListener("DOMContentLoaded",()=>{let e=document.querySelector(values.page);e&&n()})}(values.attribute);
