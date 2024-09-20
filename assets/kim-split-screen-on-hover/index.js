!function(e,t){let n={setAttrParents:function e(t,n){document.querySelectorAll(`[${t}]`).forEach(e=>{let r=function e(t,n){let r=t;for(;r.parentElement;){if(r.parentElement.tagName.toLowerCase()===n.toLowerCase())return r.parentElement;r=r.parentElement}return null}(e,n);r&&r.setAttribute(t,"")})},fetchData:function e(t){let n=document.location.origin+"/"+t+"?format=json-pretty";return fetch(n).then(e=>e.json())}};n.setAttrParents(`${e}`,"section"),document.documentElement.style.setProperty("--split-section-bg",t);let r=document.querySelector(`section[${e}]`),o=r.querySelector(".content-wrapper"),l=r.querySelector(`div[${e}]`),i=document.createElement("div");i.classList.add("custom-section");let s=e=>{i.innerHTML=e,r.insertBefore(i,o),function e(t){let n=t.querySelector(".top-image"),r=t.querySelector(".bottom-image"),o=t.querySelector(".custom-section");window.addEventListener("scroll",()=>{let e=t.getBoundingClientRect(),l=e.top,i=e.bottom,s=o.clientHeight,a;if(l<=0&&i>=0){let c=2*(a=Math.abs(l/s*100));c>100&&(c=100),n.style.transform=`translateY(-${c}%)`,r.style.transform=`translateY(${c}%)`,document.documentElement.style.setProperty("--scale-bg",`${1+a/3/300}`)}})}(r)},a=e=>{let t=[];for(let n=0;n<e.length;n++){let r=e[n].assetUrl,o=e[n].body,l=document.createElement("div");l.innerHTML=o;let i=l.querySelector("svg"),a=`
						 
      <figure class="section-main-pic"><img src=${r} alt=""></figure>
       <div class="top-image">
			<div class=svg-container>
            	${i.parentNode.innerHTML}
              </div>
      </div>
 <div class="bottom-image">
			<div class=svg-container>
            	${i.parentNode.innerHTML}
              </div>
      </div>
    
    				`;t.push(a)}s(t.join(""))},c=l.getAttribute("data-blog-href");n.fetchData(c).then(e=>{a(e.items)})}(pluginValues.attr,pluginValues.background);
