document.addEventListener("DOMContentLoaded",function(){let t=document.body;if(t.classList.contains("view-item")){let e=Array.from(t.classList).find(t=>t.startsWith("collection-type-blog"));if(e){t.classList.add("marca-blog");let i=document.createElement("style");i.textContent=".marca-blog #itemPagination {display: none;}",document.head.appendChild(i),new class t{isLoading=!1;constructor(){this.prevUrl=document.querySelector(".item-pagination-link--prev")?.href,this.nextUrl=document.querySelector(".item-pagination-link--next")?.href,this.currentArticle=document.querySelector("article"),window.addEventListener("scroll",this.onScrollHandle.bind(this))}onScrollHandle(){let t=this.currentArticle.getBoundingClientRect().bottom-window.innerHeight;if(this.currentArticle.getBoundingClientRect().top<100&&window.history.replaceState({},"",this.nextUrl),t<10&&!this.isLoading){if(this.nextUrl)this.isLoading=!0,this.loadNextArticle();else{this.isLoading=!0;let e=window.location.pathname.split("/")[1];fetch(window.location.origin+"/"+e+"?format=json-pretty").then(t=>t.json()).then(t=>{this.nextUrl=t.items[0].fullUrl,this.loadNextArticle()})}}}loadNextArticle(){fetch(this.nextUrl).then(t=>t.text()).then(t=>{let e=new DOMParser().parseFromString(t,"text/html");this.nextUrl=e.querySelector(".item-pagination-link--next")?.href,this.prevUrl=e.querySelector(".item-pagination-link--prev")?.href;let i=e.querySelector("article");document.querySelector("main").appendChild(i),this.currentArticle=i}).finally(()=>this.isLoading=!1)}}}}});
