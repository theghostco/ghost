!function e(){var i=document.location.origin+ghostGlobalImageListView.url+"?format=json-pretty";let t=document.querySelector(".switcher-gallery-wrapper");if(t){let s=document.createElement("div");s.className="switcher-outer-container",s.innerHTML=`
<div class="switcher-container">
<p class="image-view">Image View</p>
<div class="switcher-block">
	<div class="switcher"></div>
</div>
<p class="list-view">List View</p>
</div>`,t.append(s);let a=document.createElement("div");a.className="gallery-container";let l=document.createElement("div");l.className="gallery-items",a.append(l),t.append(a);let r=document.createElement("div");r.className="list-container",r.classList.add("hidden-block"),t.append(r);let c=document.createElement("div");c.className="list-items",c.innerHTML=`
<div class = "list-item first-row">
  <a class="list-link">
    <p>Project №</p>
    <p>Name</p>
    <p>Location</p>
  </a>
</div>`,r.append(c),fetch(i).then(e=>e.json()).then(e=>{for(let i=0;i<e.items.length;i++){let t=e.items[i].assetUrl,s=e.items[i].title,a=e.items[i].excerpt,r=e.items[i].passthrough,d=e.items[i].fullUrl,n=e.items[i].sourceUrl,o=(i+1).toString().padStart(3,"0"),v=document.createElement("div");v.className="gallery-item";let p=document.createElement("div");p.className="list-item",r?(v.innerHTML=`
<a class="item-link" href="${n}" target="_blank">
  <div class="item-image">
      <img src = ${t}>
  </div>
<div class="item-decription">
<div class="item-description-text">
  <div class="item-header_title">
      <p>${s}</p>
  </div>
  <div class="item-header_title-exerpt">
      <div><p>${s}</p></div>
      <div>${a}</div>
  </div>
</div>
<div class="icon-wrapper"><div class="arrow-icon"></div></div>
</div>
</a>`,p.innerHTML=`
<a class="list-link" href="${n}" target="_blank">
	<p class="list-item_counter">${o}</p>
	<p>${s}</p>
    <div>${a}</div>
</a>`):(v.innerHTML=`
<a class="item-link" href = "${document.location.origin}${d}">
  <div class="item-image">
      <img src = ${t}>
  </div>
<div class="item-decription">
<div class="item-description-text">
  <div class="item-header_title">
      <p>${s}</p>
  </div>
  <div class="item-header_title-exerpt">
      <div><p>${s}</p></div>
      <div>${a}</div>
  </div>
</div>
<div class="icon-wrapper"><div class="arrow-icon"></div></div>
</div>
</a>`,p.innerHTML=`
<a class="list-link" href = "${document.location.origin}${d}">
	<p class="list-item_counter">00${i+1}</p>
	<p>${s}</p>
    <div>${a}</div>
</a>`),l.append(v),c.append(p)}}).catch(e=>{console.error("Error:",e)})}}(),document.addEventListener("DOMContentLoaded",function(){let e=document.querySelector(".switcher-gallery-wrapper");if(e){let i=e.querySelector(".switcher"),t=e.querySelector(".switcher-container"),s=e.querySelector(".gallery-container"),a=e.querySelector(".list-container");t.addEventListener("click",function(){s.classList.contains("hidden-block")?(s.classList.remove("hidden-block"),a.classList.add("hidden-block"),i.style.left="3px"):(s.classList.add("hidden-block"),a.classList.remove("hidden-block"),i.style.left="calc(100% - 19px)")})}});
