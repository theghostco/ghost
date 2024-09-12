const images=[],blockWithCursorImages=document.querySelector("[data-ghost-plugin-name='image-cursor']");blockWithCursorImages&&(blockWithCursorImages.getAttribute("data-page-href"),document.addEventListener("DOMContentLoaded",function(){fetch(document.location.origin+"/page-with-images").then(t=>{if(!t.ok)throw Error("Network response was not ok "+t.statusText);return t.text()}).then(t=>{let e=new DOMParser,i=e.parseFromString(t,"text/html"),a=i.querySelectorAll(".page-section .image-block-wrapper img");a.forEach(t=>{let e=t.src;images.push(e)})}).then(()=>{let t=document.createElement("div");t.className="cursor-images-container";let e=blockWithCursorImages.closest(".page-section");e.classList.add("section-images-cursor"),e.append(t);let i=[],a=0,s=0,r=0;window.addEventListener("mousemove",function e(o){var n,l,m,g;let c=o.clientX,h=o.clientY;if(n=c,l=h,m=s,Math.sqrt((m-n)**2+((g=r)-l)**2)>=configs.minDistance){let d=images[a],p=document.createElement("img");p.src=d,p.style.position="absolute",p.style.width=`${configs.maxWidth}px`,p.style.height=`${configs.maxHeight}px`,p.style.opacity="1",p.style.transition="opacity 0.3s ease-out ";let u=.5>Math.random()?-configs.maxTilt:configs.maxTilt;p.style.transform=`rotate(${u}deg)`,t.appendChild(p),i.push({imgElement:p,x:c,y:h,startY:h+configs.maxHeight,width:configs.maxWidth,height:configs.maxHeight,tilt:u,startTime:Date.now()}),a=(a+1)%images.length,s=c,r=h}}),function t(){let e=Date.now();i=i.filter(t=>{let i=e-t.startTime,a=i/configs.delay;if(a>=1)return t.imgElement.remove(),!1;let s=t.startY,r=configs.overshootFactor,o=s-(s-t.y)*Math.sin(Math.PI*a)*r,n=t.tilt+Math.sign(t.tilt)*(configs.maxFinalTilt-Math.abs(t.tilt))*a;t.imgElement.style.transform=`translate(${t.x-t.width/2}px, ${o-t.height/2}px) rotate(${n}deg)`;let l=configs.fadeStart;return a>=l&&(t.imgElement.style.opacity=1-(a-l)/(1-l)),!0}),requestAnimationFrame(t)}()}).catch(t=>{console.error("Error fetching the images page:",t)})}));