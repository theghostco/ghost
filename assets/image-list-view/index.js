function switcherGallery(){var e=document.location.origin+ghostGlobalImageListView.url+"?format=json-pretty";let i=document.querySelector(".switcher-gallery-wrapper");if(i){let t=document.createElement("div");t.className="switcher-outer-container",t.innerHTML=`
<div class="switcher-container">
<p class="image-view">Image View</p>
<div class="switcher-block">
	<div class="switcher"></div>
</div>
<p class="list-view">List View</p>
</div>`,i.append(t);let s=document.createElement("div");s.className="gallery-container";let l=document.createElement("div");l.className="gallery-items",s.append(l),i.append(s);let a=document.createElement("div");a.className="list-container",a.classList.add("hidden-block"),i.append(a);let r=document.createElement("div");r.className="list-items",r.innerHTML=`
<div class = "list-item first-row">
  <a class="list-link">
    <p>${ghostGlobalImageListView.listViewOptions.counterTitle}</p>
    <p>${ghostGlobalImageListView.listViewOptions.projectNameTitle}</p>
    <p>${ghostGlobalImageListView.listViewOptions.projectLocationTitle}</p>
  </a>
</div>`,a.append(r),fetch(e).then(e=>e.json()).then(e=>{for(let i=0;i<e.items.length;i++){let t=e.items[i].assetUrl,s=e.items[i].title,a=e.items[i].excerpt,c=e.items[i].passthrough,d=e.items[i].fullUrl,n=e.items[i].sourceUrl,o=(i+1).toString().padStart(3,"0"),p=document.createElement("div");p.className="gallery-item";let v=document.createElement("div");v.className="list-item",c?(p.innerHTML=`
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
</a>`,v.innerHTML=`
<a class="list-link" href="${n}" target="_blank">
	<p class="list-item_counter">${o}</p>
	<p>${s}</p>
    <div>${a}</div>
</a>`):(p.innerHTML=`
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
</a>`,v.innerHTML=`
<a class="list-link" href = "${document.location.origin}${d}">
	<p class="list-item_counter">00${i+1}</p>
	<p>${s}</p>
    <div>${a}</div>
</a>`),l.append(p),r.append(v)}}).catch(e=>{console.error("Error:",e)})}}switcherGallery(),document.addEventListener("DOMContentLoaded",function(){let e=document.querySelector(".switcher-gallery-wrapper");if(e){let i=e.querySelector(".switcher"),t=e.querySelector(".switcher-container"),s=e.querySelector(".gallery-container"),l=e.querySelector(".list-container");t.addEventListener("click",function(){s.classList.contains("hidden-block")?(s.classList.remove("hidden-block"),l.classList.add("hidden-block"),i.style.left="3px"):(s.classList.add("hidden-block"),l.classList.remove("hidden-block"),i.style.left="calc(100% - 19px)")})}});
