
(function(){
'use strict';
var DEFAULTS={images:'',cursorLabel:'Click Me',areaLabel:'Click or press Enter or Space to reveal an image. Arrow keys move the reveal point.',placement:'block',stackStyle:'cascade',dropStyle:'random'};
if(window.GhostClickAndStackImages){window.GhostClickAndStackImages.initAll();return}
var selector='.gp-click-stack',states=new Map();
function initAll(){
 states.forEach(function(clean){clean()});states.clear();
 document.querySelectorAll(selector).forEach(init);
}
function init(root){
 var config={},api=window.GhostPlugins;
 if(api&&typeof api.configFor==='function'){try{config=api.configFor(root,'click-and-stack-images')||{}}catch(e){config={}}}
 var c=Object.assign({},DEFAULTS,window.GhostPluginConfig||{},config),dead=false,stack=[],animations=[],timer=0,index=0,anchor=null,point={x:24,y:24};
 var attrs=['tabindex','role','aria-label'],saved=attrs.map(function(k){return root.getAttribute(k)}),placementStyles={};
 var section=root.closest('section'),host=null;
 if(c.placement==='section'&&section){host=document.createElement('div');root.parentNode.insertBefore(host,root);section.appendChild(root);['position','inset','width','height'].forEach(function(k){placementStyles[k]=[root.style.getPropertyValue(k),root.style.getPropertyPriority(k)]});root.style.position='absolute';root.style.inset='0';root.style.width='100%';root.style.height='100%';if(getComputedStyle(section).position==='static'){var oldPosition=section.style.position;section.style.position='relative'}}
 root.tabIndex=0;root.setAttribute('role','button');root.setAttribute('aria-label',String(c.areaLabel));
 var label=document.createElement('span');label.className='gp-label';label.textContent=String(c.cursorLabel);label.hidden=!c.cursorLabel;root.appendChild(label);
 var status=document.createElement('span');status.className='gp-status';status.setAttribute('aria-live','polite');root.appendChild(status);
 var feBlock=c.placement!=='section'?root.closest('.fe-block'):null,oldHeight=[root.style.getPropertyValue('height'),root.style.getPropertyPriority('height')],feRo=null;
 /* Code Block mode: fill only the space left inside the block, so the block never grows to fit the plugin. */var gpFit=function(el,blk){el.style.boxSizing='border-box';var r=el.getBoundingClientRect(),b=blk.getBoundingClientRect(),inset=0,n=el.parentElement,s;while(n&&n!==blk){s=getComputedStyle(n);inset+=(parseFloat(s.paddingBottom)||0)+(parseFloat(s.borderBottomWidth)||0);n=n.parentElement}s=getComputedStyle(blk);inset+=(parseFloat(s.paddingBottom)||0)+(parseFloat(s.borderBottomWidth)||0)+(parseFloat(getComputedStyle(el).marginBottom)||0);return Math.max(0,Math.floor(b.bottom-r.top-inset))};function fitBlock(){if(feBlock&&feBlock.clientHeight)root.style.setProperty('height',gpFit(root,feBlock)+'px','important')}
 if(feBlock){fitBlock();if(typeof ResizeObserver!=='undefined'){feRo=new ResizeObserver(fitBlock);feRo.observe(feBlock)}}
 var mq=matchMedia('(prefers-reduced-motion: reduce)'),box,iw=0,ih=0,stackGap=0,bounds;
 function val(k){return getComputedStyle(root).getPropertyValue(k).trim()}
 function num(k,f){var n=parseFloat(val(k));return Number.isFinite(n)?n:f}
 function ms(k,f){var s=val(k),n=parseFloat(s);return Number.isFinite(n)?Math.max(0,s.endsWith('ms')?n:s.endsWith('s')?n*1000:n):f}
 function gallery(v){
  if(typeof v==='string'){try{v=JSON.parse(v)}catch(e){v=v.split(/[\n,]+/)}}
  if(!Array.isArray(v))v=[];
  var a=v.map(function(x){return typeof x==='string'?{src:x.trim(),alt:''}:x}).filter(function(x){if(!x||!x.src)return false;try{var u=new URL(x.src,document.baseURI);return ['http:','https:','blob:'].indexOf(u.protocol)!==-1}catch(e){return false}}).slice(0,10);
  return a.length?a:[{src:'demo_light_image.webp',alt:''},{src:'demo_dark_image.webp',alt:''}];
 }
 var items=gallery(c.images);
 function measure(){
  box=root.getBoundingClientRect();var ratio=val('--image-aspect-ratio'),parts=ratio.split('/');
  iw=Math.max(1,num('--image-width',150));ih=iw*1.2;
  if(ratio!=='auto'&&parts.length===2&&+parts[0]>0&&+parts[1]>0)ih=iw*(+parts[1])/(+parts[0]);
  var scale=Math.min(1,Math.max(1,box.width-24)/iw,Math.max(1,box.height-24)/ih);iw*=scale;ih*=scale;
  stackGap=Math.max(0,num('--stack-gap',12));bounds=stackBounds();
  var fit=Math.min(1,Math.max(1,box.width-24)/(bounds.maxX-bounds.minX),Math.max(1,box.height-24)/(bounds.maxY-bounds.minY));iw*=fit;ih*=fit;stackGap*=fit;bounds=stackBounds();
  point.x=Math.max(0,Math.min(point.x,Math.max(0,box.width-label.offsetWidth-12)));point.y=Math.max(0,Math.min(point.y,Math.max(0,box.height-label.offsetHeight-12)));place();
  if(stack.length&&!c.advancedPreviewDemo)drop();
 }
 function geometry(i){
  var x=0,y=0,angle=0,step=Math.min(i,9);
  if(c.stackStyle==='offset')x=step*stackGap;
  if(c.stackStyle==='cascade'){x=step*stackGap;y=-step*stackGap}
  if(c.stackStyle==='fan'){x=step*stackGap*0.4;angle=-18+step*4}
  if(c.stackStyle==='alternating')angle=i%2?8:-8;
  return {x:x,y:y,angle:angle};
 }
 function stackBounds(){
  var b={minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity};
  Array.from({length:10}).forEach(function(item,i){var g=geometry(i),r=g.angle*Math.PI/180,w=Math.abs(iw*Math.cos(r))+Math.abs(ih*Math.sin(r)),h=Math.abs(iw*Math.sin(r))+Math.abs(ih*Math.cos(r));b.minX=Math.min(b.minX,g.x+(iw-w)/2);b.minY=Math.min(b.minY,g.y+(ih-h)/2);b.maxX=Math.max(b.maxX,g.x+(iw+w)/2);b.maxY=Math.max(b.maxY,g.y+(ih+h)/2)});
  return b;
 }
 function updateAnchor(){
    var lw=label.hidden?0:label.offsetWidth,gp=label.hidden?0:Math.min(num('--label-image-gap',24),12),ext=Math.max(0,geometry(9).x),ax=point.x+lw+gp;if(ax+iw+ext>box.width&&point.x-gp-iw-ext>=0)ax=point.x-gp-iw-ext;anchor={x:ax,y:point.y};
 }
 function place(){
  label.style.left=point.x+'px';label.style.top=point.y+'px';if(fake){fake.style.left=(point.x-12)+'px';fake.style.top=(point.y-12)+'px'}
  if(stack.length&&bounds){updateAnchor();stack.forEach(function(img,i){var g=geometry(i);img.style.left=(anchor.x+g.x)+'px';img.style.top=(anchor.y+g.y)+'px'})}
 }
 function move(e){if(c.advancedPreviewDemo&&e.type==='pointermove')return;box=root.getBoundingClientRect();point.x=Math.max(0,Math.min(e.clientX-box.left+12,box.width-label.offsetWidth));point.y=Math.max(0,Math.min(e.clientY-box.top+12,box.height-label.offsetHeight));place()}
 function drop(){
  clearTimeout(timer);timer=0;anchor=null;index=0;var batch=stack.splice(0),duration=ms('--drop-duration',850);
  batch.forEach(function(el,i){
   if(mq.matches||!duration||!el.animate){el.remove();return}
   var left=parseFloat(el.style.left),top=parseFloat(el.style.top),distance=Math.max(box.height,window.innerHeight?window.innerHeight-box.top:box.height)-top+Math.hypot(iw,ih)+Math.abs(num('--image-shadow-offset-y',10))+num('--image-shadow-blur',20)+Math.abs(num('--image-shadow-spread',0))+24,dx=0,rotate=0,scale=1,baseAngle=Number(el.dataset.rotation)||0,fallDuration=duration,fallDelay=Math.min(i*35,duration/3);
   if(c.dropStyle==='scatter'){dx=(i%2?1:-1)*Math.min(80,box.width/5);rotate=i%2?65:-65}
   if(c.dropStyle==='tumble'){rotate=i%2?180:-180}
   if(c.dropStyle==='shrink')scale=0.65;
   if(c.dropStyle==='random'){dx=(Math.random()*2-1)*Math.min(100,box.width/4);rotate=(Math.random()*2-1)*110;fallDuration=duration*(0.8+Math.random()*0.4);fallDelay=Math.random()*Math.min(160,duration/4)}
   dx=Math.max(-left,Math.min(dx,box.width-left-iw));
   var frames=[{transform:'translate(0,0) rotate('+baseAngle+'deg) scale(1)'},{transform:'translate('+dx+'px,'+distance+'px) rotate('+(rotate+baseAngle)+'deg) scale('+scale+')'}];
   var a=el.animate(frames,{duration:fallDuration,delay:fallDelay,easing:'cubic-bezier(.45,0,.85,.45)',fill:'forwards'});animations.push(a);
   a.onfinish=function(){el.remove();animations=animations.filter(function(x){return x!==a})};
  });
 }
 function reveal(){
  if(dead||!box.width||!box.height)return;
  updateAnchor();
  var g=geometry(stack.length),x=anchor.x+g.x,y=anchor.y+g.y;
  var item=items[index%items.length],img=document.createElement('img');img.className='gp-card';img.alt=item.alt||'';img.draggable=false;img.style.width=iw+'px';img.style.height=ih+'px';img.style.left=x+'px';img.style.top=y+'px';img.dataset.shadow=val('--image-shadow-style');img.style.zIndex=String(stack.length+1);img.dataset.rotation=g.angle;img.style.transform='rotate('+g.angle+'deg)';
  img.onerror=function(){img.remove()};img.src=item.src;root.appendChild(img);stack.push(img);index++;place();
  status.textContent=item.alt||String(c.cursorLabel);clearTimeout(timer);
  timer=setTimeout(drop,ms('--drop-timer',1300));
 }
 function click(e){move(e);if(c.advancedPreviewDemo)return;reveal()}
 function key(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();reveal()}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].indexOf(e.key)!==-1){e.preventDefault();point.x+=e.key==='ArrowLeft'?-20:e.key==='ArrowRight'?20:0;point.y+=e.key==='ArrowUp'?-20:e.key==='ArrowDown'?20:0;point.x=Math.max(0,Math.min(point.x,box.width-label.offsetWidth-12));point.y=Math.max(0,Math.min(point.y,box.height-label.offsetHeight-12));place()}}
 function motion(){if(mq.matches){animations.forEach(function(a){a.cancel()});animations=[];root.querySelectorAll('.gp-card').forEach(function(el){if(stack.indexOf(el)===-1)el.remove()})}}
 root.addEventListener('pointermove',move);root.addEventListener('click',click);root.addEventListener('keydown',key);mq.addEventListener('change',motion);
 var demoTimer=0,demoStep=0;var fake=null,glideRaf=0;if(c.advancedPreviewDemo){fake=document.createElement('span');fake.className='gp-demo-cursor';fake.setAttribute('aria-hidden','true');fake.innerHTML='<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5.5 3.48C5.5 2.23 6.94 1.53 7.92 2.3l13.52 10.51c1.13.88.5 2.69-.92 2.69h-6.85c-.5 0-.98.23-1.3.63l-4.19 5.3c-.88 1.11-2.68.49-2.68-.93V3.48Z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>';root.appendChild(fake);box=root.getBoundingClientRect();}
 function center(){var lw=label.hidden?0:label.offsetWidth,gp=label.hidden?0:Math.min(num('--label-image-gap',24),12),g=geometry(5),w=lw+gp+iw+Math.max(0,g.x),up=Math.max(0,-g.y),h=ih+up;return {x:Math.max(12,(box.width-w)/2),y:Math.max(up,(box.height-h)/2+up)}}
 function glide(done){box=root.getBoundingClientRect();var o=center(),r=Math.min(18,box.width*0.03),a=Math.random()*Math.PI*2,tx=o.x+Math.cos(a)*r,ty=o.y+Math.sin(a)*r*0.6,sx=point.x,sy=point.y,t0=0,d=mq.matches?0:900;cancelAnimationFrame(glideRaf);function f(t){if(dead)return;if(!t0)t0=t;var k=d?Math.min(1,(t-t0)/d):1,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;point.x=sx+(tx-sx)*e;point.y=sy+(ty-sy)*e;place();if(k<1)glideRaf=requestAnimationFrame(f);else done()}glideRaf=requestAnimationFrame(f)}

 function demoTick(){if(dead)return;if(demoStep<6){glide(function(){if(dead)return;reveal();clearTimeout(timer);demoStep++;demoTimer=setTimeout(demoTick,demoStep<6?250:Math.max(900,ms('--drop-timer',1300)))})}else{demoStep=0;drop();demoTimer=setTimeout(demoTick,ms('--drop-duration',850)+900)}}
 if(c.advancedPreviewDemo){demoTimer=setTimeout(function(){box=root.getBoundingClientRect();var o=center();point.x=o.x;point.y=o.y;place();demoTick()},400)}
 var ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(measure):null;if(ro)ro.observe(root);else window.addEventListener('resize',measure);measure();
 states.set(root,function(){dead=true;clearTimeout(timer);clearTimeout(demoTimer);cancelAnimationFrame(glideRaf);if(fake)fake.remove();if(feRo)feRo.disconnect();if(feBlock){if(oldHeight[0])root.style.setProperty('height',oldHeight[0],oldHeight[1]);else root.style.removeProperty('height')}if(ro)ro.disconnect();else window.removeEventListener('resize',measure);root.removeEventListener('pointermove',move);root.removeEventListener('click',click);root.removeEventListener('keydown',key);mq.removeEventListener('change',motion);animations.forEach(function(a){a.cancel()});root.querySelectorAll('.gp-card').forEach(function(el){el.remove()});label.remove();status.remove();attrs.forEach(function(k,i){if(saved[i]===null)root.removeAttribute(k);else root.setAttribute(k,saved[i])});if(host){host.parentNode.insertBefore(root,host);host.remove();if(oldPosition!==undefined)section.style.position=oldPosition}Object.keys(placementStyles).forEach(function(k){var v=placementStyles[k];if(v[0])root.style.setProperty(k,v[0],v[1]);else root.style.removeProperty(k)})});
}
window.GhostClickAndStackImages={initAll:initAll};
document.addEventListener('ghost:config',initAll);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll,{once:true});else initAll();
})();


