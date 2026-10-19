(function () {
 "use strict";
 var DEFAULTS = {
  "clickableTitles": true,
  "openInNewTab": false,
  "hoverStyle": "dim",
  "imagePlacement": "cursor",
  "captionPosition": "top-right",
  "showCaption": true,
  "followSpeed": 160,
  "mobileMode": "tap",
  "activateFirst": false,
  "i1_title": "",
  "i1_image": "",
  "i1_alt": "",
  "i1_caption": "",
  "i1_url": "",
  "i1_url_new_tab": "",
  "i2_title": "",
  "i2_image": "",
  "i2_alt": "",
  "i2_caption": "",
  "i2_url": "",
  "i2_url_new_tab": "",
  "i3_title": "",
  "i3_image": "",
  "i3_alt": "",
  "i3_caption": "",
  "i3_url": "",
  "i3_url_new_tab": "",
  "i4_title": "",
  "i4_image": "",
  "i4_alt": "",
  "i4_caption": "",
  "i4_url": "",
  "i4_url_new_tab": "",
  "i5_title": "",
  "i5_image": "",
  "i5_alt": "",
  "i5_caption": "",
  "i5_url": "",
  "i5_url_new_tab": "",
  "i6_title": "",
  "i6_image": "",
  "i6_alt": "",
  "i6_caption": "",
  "i6_url": "",
  "i6_url_new_tab": "",
  "i7_title": "",
  "i7_image": "",
  "i7_alt": "",
  "i7_caption": "",
  "i7_url": "",
  "i7_url_new_tab": "",
  "i8_title": "",
  "i8_image": "",
  "i8_alt": "",
  "i8_caption": "",
  "i8_url": "",
  "i8_url_new_tab": "",
  "i9_title": "",
  "i9_image": "",
  "i9_alt": "",
  "i9_caption": "",
  "i9_url": "",
  "i9_url_new_tab": "",
  "i10_title": "",
  "i10_image": "",
  "i10_alt": "",
  "i10_caption": "",
  "i10_url": "",
  "i10_url_new_tab": "",
  "i11_title": "",
  "i11_image": "",
  "i11_alt": "",
  "i11_caption": "",
  "i11_url": "",
  "i11_url_new_tab": "",
  "i12_title": "",
  "i12_image": "",
  "i12_alt": "",
  "i12_caption": "",
  "i12_url": "",
  "i12_url_new_tab": ""
};
 if (window.GhostKuroImageHoverList) {window.GhostKuroImageHoverList.initAll(); return;}
 var selector='.gp-kuro-image-hover-list', states=new Map(), sequence=0;
 var bindings={"title-font": ["--kuro-title-font", ""], "title-size": ["--kuro-title-size", "px"], "title-weight": ["--kuro-title-weight", ""], "title-tracking": ["--kuro-title-tracking", "px"], "title-transform": ["--kuro-title-transform", ""], "title-color": ["--kuro-title-color", ""], "caption-font": ["--kuro-caption-font", ""], "caption-size": ["--kuro-caption-size", "px"], "caption-weight": ["--kuro-caption-weight", ""], "caption-tracking": ["--kuro-caption-tracking", "px"], "caption-transform": ["--kuro-caption-transform", ""], "caption-color": ["--kuro-caption-color", ""], "title-style": ["--kuro-title-style", ""], "title-line-height": ["--kuro-title-line-height", ""], "mobile-title-size": ["--kuro-mobile-title-size", "px"], "mobile-caption-size": ["--kuro-mobile-caption-size", "px"], "caption-style": ["--kuro-caption-style", ""], "caption-line-height": ["--kuro-caption-line-height", ""], "title-hover-color": ["--kuro-title-hover-color", ""], "title-idle-opacity": ["--kuro-title-idle-opacity", ""], "title-dim-opacity": ["--kuro-title-dim-opacity", ""], "image-width": ["--kuro-image-width", "px"], "image-ratio": ["--kuro-image-ratio", ""], "image-fit": ["--kuro-image-fit", ""], "image-border-style": ["--kuro-image-border-style", ""], "image-border-width": ["--kuro-image-border-width", "px"], "image-border-color": ["--kuro-image-border-color", ""], "divider-style": ["--kuro-divider-style", ""], "divider-width": ["--kuro-divider-width", "px"], "divider-color": ["--kuro-divider-color", ""], "image-radius": ["--kuro-image-radius", "px"], "image-shadow": ["--kuro-image-shadow", ""], "image-speed": ["--kuro-image-speed", "ms"], "image-ease": ["--kuro-image-ease", ""], "image-scale-from": ["--kuro-image-scale-from", ""], "image-tilt": ["--kuro-image-tilt", "deg"], "bg": ["--kuro-bg", ""], "caption-bg": ["--kuro-caption-bg", ""], "caption-padding": ["--kuro-caption-padding", "px"], "caption-radius": ["--kuro-caption-radius", "px"], "padding": ["--kuro-padding", "px"], "max-width": ["--kuro-max-width", "px"], "list-width": ["--kuro-list-width", "px"], "list-align": ["--kuro-list-align", ""], "text-align": ["--kuro-text-align", ""], "row-gap": ["--kuro-row-gap", "px"], "row-padding": ["--kuro-row-padding", "px"], "image-offset-x": ["--kuro-image-offset-x", "px"], "image-offset-y": ["--kuro-image-offset-y", "px"], "image-z": ["--kuro-image-z", ""], "caption-inset": ["--kuro-caption-inset", "px"], "mobile-image-width": ["--kuro-mobile-image-width", "px"], "mobile-image-display": ["--kuro-mobile-image-display", ""]};
 function truth(v) {return v===true || v==='true' || v===1;}
 function read(root) {
  var live=null;
  try {if(window.GhostPlugins && typeof window.GhostPlugins.configFor==='function') live=window.GhostPlugins.configFor(root,'kuro-image-hover-list');} catch(e) {}
  if(!live || typeof live!=='object') live=window.GhostPluginConfig;
  return live && typeof live==='object' ? live : null;
 }
 function safe(value,image) {
  if(!value) return '';
  try {var u=new URL(String(value),document.baseURI); return (image ? ['http:','https:','blob:'] : ['http:','https:','mailto:','tel:']).indexOf(u.protocol)>=0 ? u.href : '';} catch(e) {return '';}
 }
 function node(tag,cls) {var n=document.createElement(tag);n.className=cls;return n;}
 function setup(root) {
  var old=states.get(root); if(old) old.destroy();
  var config=read(root), timer=0, frame=0, observer, listeners=[], applied=[], active=-1, rows=[], tap=false, last=0, x=0,y=0,tx=0,ty=0;
  var c=Object.assign({},DEFAULTS,config||{}), reduced=window.matchMedia('(prefers-reduced-motion: reduce)'), coarse=window.matchMedia('(hover: none)');
  var content=node('div','kuro-content'), list=node('ul','kuro-rows'), media=node('figure','kuro-media'), inner=node('div','kuro-frame'), image=node('img','kuro-image'), caption=node('figcaption','kuro-caption');
  root.replaceChildren(); root.style.visibility='hidden'; root.dataset.hover=c.hoverStyle;
  Object.keys(bindings).forEach(function(key){if(config && config[key]!==undefined){var b=bindings[key],before=root.style.getPropertyValue(b[0]);applied.push([b[0],before]);root.style.setProperty(b[0],String(config[key])+(typeof config[key]==='number'?b[1]:''));}});
  content.appendChild(list);inner.appendChild(image);inner.appendChild(caption);media.appendChild(inner);root.appendChild(content);root.appendChild(media);
  image.alt='';image.decoding='async';
  function listen(el,type,fn){el.addEventListener(type,fn);listeners.push(function(){el.removeEventListener(type,fn);});}
  function number(name){return parseFloat(getComputedStyle(root).getPropertyValue('--kuro-'+name))||0;}
  function hide(){active=-1;rows.forEach(function(r){r.li.classList.remove('is-active');r.title.setAttribute('aria-expanded','false');});media.classList.remove('is-visible');root.classList.remove('has-active');cancelAnimationFrame(frame);frame=0;}
  function animate(t){var dt=Math.min(64,t-last||16);last=t;var speed=Math.max(0,Number(c.followSpeed)||0),a=reduced.matches||speed===0?1:1-Math.exp(-dt/speed);x+=(tx-x)*a;y+=(ty-y)*a;media.style.transform='translate('+x+'px,'+y+'px)';if(Math.abs(tx-x)+Math.abs(ty-y)>.3)frame=requestAnimationFrame(animate);else frame=0;}
  function position(event){if(tap || active<0)return;var r=root.getBoundingClientRect(),row=rows[active].li.getBoundingClientRect(),w=media.offsetWidth,h=media.offsetHeight;
   var placement=c.imagePlacement;tx=placement==='left'?0:placement==='right'?r.width-w:(r.width-w)/2;ty=(r.height-h)/2;
   if(placement==='overlap')ty=row.top-r.top+(row.height-h)/2;
   if(placement==='cursor' && event){tx=event.clientX-r.left+20;ty=event.clientY-r.top-h/2;}
   tx=Math.max(0,Math.min(Math.max(0,r.width-w),tx+number('image-offset-x')));ty=Math.max(0,Math.min(Math.max(0,r.height-h),ty+number('image-offset-y')));
   if(!frame){last=0;frame=requestAnimationFrame(animate);}
  }
  function show(i,event){var row=rows[i];if(!row)return;if(active===i){position(event);return;}rows.forEach(function(r){r.li.classList.remove('is-active');r.title.setAttribute('aria-expanded','false');});active=i;row.li.classList.add('is-active');root.classList.add('has-active');row.title.setAttribute('aria-expanded','true');
   var src=safe(row.item.image,true);if(!src){media.classList.remove('is-visible');return;}
   if(image.getAttribute('src')!==src)image.src=src;image.alt=row.item.alt;var cap=row.item.caption||row.item.title;caption.textContent=cap;caption.hidden=!truth(c.showCaption)||c.captionPosition==='hidden'||!cap;caption.dataset.position=c.captionPosition;
   if(tap){row.li.appendChild(media);media.style.transform='none';}else root.appendChild(media);
   media.classList.add('is-visible');position(event);
  }
  listen(image,'error',function(){media.classList.remove('is-visible');});listen(image,'load',function(){if(active>=0){media.classList.add('is-visible');position();}});
  for(var i=1;i<=12;i++) {var p='i'+i+'_';if(!String(c[p+'title']||'').trim())continue;
   var item={title:String(c[p+'title']),image:c[p+'image'],alt:String(c[p+'alt']||''),caption:String(c[p+'caption']||''),url:safe(c[p+'url'],false),newTab:c[p+'url_new_tab']};
   var li=node('li','kuro-row'),isLink=truth(c.clickableTitles)&&item.url,title=node(isLink?'a':'button','kuro-title'),index=rows.length;
   title.textContent=item.title;if(isLink){title.href=item.url;if(item.newTab===''?truth(c.openInNewTab):truth(item.newTab)){title.target='_blank';title.rel='noopener noreferrer';}}else title.type='button';
   title.setAttribute('aria-expanded','false');title.setAttribute('aria-controls','kuro-media-'+sequence);li.appendChild(title);list.appendChild(li);rows.push({li:li,title:title,item:item});
   (function(n,t){listen(t,'pointerenter',function(e){if(!tap)show(n,e);});listen(t,'focus',function(){if(!tap)show(n);});listen(t,'click',function(e){if(tap && c.mobileMode!=='hidden'){e.preventDefault();if(active===n)hide();else show(n);} });listen(t,'keydown',function(e){if(e.key==='Escape'){hide();return;}if(e.key===' '){e.preventDefault();t.click();}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();rows[(n+(e.key==='ArrowDown'?1:rows.length-1))%rows.length].title.focus();}});})(index,title);
  }
  media.id='kuro-media-'+sequence++;
  function resize(){var next=root.getBoundingClientRect().width<=700||coarse.matches;if(next!==tap){tap=next;root.dataset.tap=String(tap);hide();root.appendChild(media);}if(!tap)position();}
  listen(root,'pointermove',function(e){if(!tap && c.imagePlacement==='cursor')position(e);});listen(root,'pointerleave',function(){if(!tap && !root.contains(document.activeElement)){if(truth(c.activateFirst))show(0);else hide();}});
  listen(root,'focusout',function(e){if(!tap&&!root.contains(e.relatedTarget))hide();});listen(coarse,'change',resize);listen(reduced,'change',function(){position();});
  observer=new ResizeObserver(resize);observer.observe(root);resize();
  if(truth(c.activateFirst) && !(tap&&c.mobileMode==='hidden'))show(0);
  if(config)root.style.visibility='visible';else timer=setTimeout(function(){root.style.visibility='visible';},2500);
  states.set(root,{destroy:function(){clearTimeout(timer);cancelAnimationFrame(frame);observer.disconnect();listeners.forEach(function(off){off();});applied.forEach(function(b){if(b[1])root.style.setProperty(b[0],b[1]);else root.style.removeProperty(b[0]);});root.replaceChildren();root.classList.remove('has-active');}});
 }
 function initAll(){states.forEach(function(state,root){if(!root.isConnected){state.destroy();states.delete(root);}});document.querySelectorAll(selector).forEach(setup);}
 window.GhostKuroImageHoverList={initAll:initAll};
 document.addEventListener('ghost:config',initAll);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll,{once:true});else initAll();
})();
