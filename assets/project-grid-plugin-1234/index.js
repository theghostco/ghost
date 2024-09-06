const checkPlugin=document.querySelectorAll("[data-ghost-blur]");void 0!==checkPlugin&&null!=checkPlugin&&checkPlugin.forEach(function(e){let t=e.getAttribute("data-blog-href"),r=e.getAttribute("data-ghost-plugin-name");if("blur-summary"==r){let l=document.createElement("div");l.className="blur-summary-wrapper",e.append(l),fetch(`${document.location.origin}${t}?format=json-pretty`).then(e=>{if(e.ok)return e.json();throw Error("Network response was not ok.")}).then(e=>{e.items.forEach(e=>{let t=e.title;e.excerpt;let r=e.assetUrl,a=e.fullUrl,s=document.createElement("div");s.className="blur-summary-item",s.innerHTML=`
				<a class='blur-item-link' href='${a}'>
					<div class='blur-item-img'>
  						<img src='${r}'>
  					</div>
					<h3 class='blur-item-title'>${t}</h3>
  				</a>`,l.append(s)});let t=l.querySelectorAll(".blur-summary-item");t.forEach(e=>{e.addEventListener("mouseover",()=>{t.forEach(t=>{t!==e&&t.classList.add("blur")})}),e.addEventListener("mouseout",()=>{t.forEach(e=>{e.classList.remove("blur")})})})}).catch(e=>{console.error("There has been a problem with your fetch operation:",e)})}});
