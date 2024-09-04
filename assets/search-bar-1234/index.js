!function(e){let t={fadeIn:function e(t,r=400){t.style.display="block",t.style.opacity=0;let l=+new Date,a=function(){t.style.opacity=+t.style.opacity+(new Date-l)/r,l=+new Date,1>+t.style.opacity&&(window.requestAnimationFrame&&requestAnimationFrame(a)||setTimeout(a,16))};a()},fadeOut:function e(t,r=400,l=null){t.style.opacity=1;let a=+new Date,c=function(){t.style.opacity=+t.style.opacity-(new Date-a)/r,a=+new Date,+t.style.opacity>0?window.requestAnimationFrame&&requestAnimationFrame(c)||setTimeout(c,16):(t.style.display="none",l&&l())};c()}},r=[],l=document.createElement("div");l.setAttribute("class","search-list");let a=document.querySelector(".search-results"),c;if(e.searchInHeader){let n=document.querySelector(".header-inner");(c=document.createElement("div")).innerHTML='<button type="button" class="btn-search">Search</button>',n.appendChild(c)}else c=document.querySelector(".btn-search");e.iconSearch&&document.querySelector(".btn-search").classList.add("search-icon-visible");let s=e.paths.map(e=>fetch(document.location.origin+e+"?format=json-pretty").then(e=>e.json()).then(e=>e));Promise.all(s).then(e=>{e.forEach((e,t)=>{r.push(e)}),l.innerHTML=function e(t){console.log("data",t);let r=t.reduce((e,t)=>e.concat(t.items||t.upcoming),[]),l=[];for(let a=0;a<r.length;a++){let c=r[a].assetUrl,n=r[a].fullUrl,s=r[a].title,i=r[a].excerpt,o,u;o=r[a].variants?r[a].variants[0].priceMoney.value:"",u=r[a].categories?r[a].categories.join(", "):"";let y=`
                    <div class="search-item">
					<a href=${n} class="item-link">
						<figure class="image">
							<img src=${c} alt="">
  						</figure>
						 <div class="description">
							<p class="categories">${u}</p>
  							<h4 class="title">${s}</h4>
						
							<div>${o}
								<span class="currency"></span>
  								<span class="price-value">${o}</span>
  							</div>
							<div class="excerpt">
								${i}
								
  							</div>
  						</div>	
					</a>
                </div>
`;l.push(y)}return l.join("")}(r),a.appendChild(l),function e(){let t=document.querySelector("#search"),r=document.querySelectorAll(".search-item"),l=document.querySelector(".search-message");t.addEventListener("input",e=>{let t=e.target.value.toLowerCase(),a=0;r.forEach(e=>{let r="",c=e.querySelectorAll("span, p, a, div");c.forEach(e=>r+=e.innerHTML.toLowerCase()),e.querySelector(".title"),e.querySelector(".excerpt p"),r.includes(t)?(e.style.display="block",a++):e.style.display="none",0===a?l.innerHTML="<p>Sorry, we couldn't find any matches...</p>":l.innerHTML=""})})}(),function e(){let r=document.querySelector(".modal-search");c.addEventListener("click",e=>{e.preventDefault(),t.fadeIn(r,400)})}(),function e(){let r=document.querySelector(".close-search"),l=document.querySelector(".modal-search");r.addEventListener("click",e=>{document.querySelectorAll(".search-item"),t.fadeOut(l,400,function(){(function e(){let t=document.querySelector("#search");document.querySelector(".modal-search");let r=document.querySelector(".search-message");t.value="";let l=document.querySelectorAll(".search-item");r.innerHTML="",l.forEach(e=>e.style.display="block")})()})})}()}).catch(e=>{console.error("Error fetching data:",e)})}(values);
