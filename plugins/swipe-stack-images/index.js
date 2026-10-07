/* Swipe Stack Images | Ghost Plugins | v1.0.0 | JavaScript */
(function () {
  'use strict';
  var DEFAULTS = {
    contentGalleryLabel: 'Shuffle Stack image gallery',
    contentPositionText: 'Image {current} of {total}',
    images: '',
    imagesOpenNewTab: false,
    imagesRandomRatio: false,
    imagesShowShadow: true,
    layoutStackStyle: 'scattered',
    layoutStackSize: 4,
    layoutMobileFill: true,
    layoutMobileBreakpoint: 767,
    advancedLoop: true,
    advancedEnableSwipe: true,
    advancedSwipeThreshold: 0.18,
    advancedSwipeVelocity: 0.45
  };
  if (window.GhostShuffleStack) { window.GhostShuffleStack.initAll(); return; }
  var states = new WeakMap();
  function num(value, fallback, min, max) {
    value = parseFloat(value);
    return Number.isFinite(value) ? Math.max(min,Math.min(max,value)) : fallback;
  }
  function safeUrl(value, link) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      var url = new URL(value,document.baseURI);
      return /^https?:$/.test(url.protocol) || (!link && url.protocol === 'blob:') || (link && /^(mailto:|tel:)$/.test(url.protocol)) ? url.href : '';
    } catch (error) { return ''; }
  }
  function initialize(root) {
    var previous = states.get(root);
    if (previous) previous();
    var local = window.GhostPlugins && typeof window.GhostPlugins.configFor === 'function'
      ? window.GhostPlugins.configFor(root,'shuffle-stack') : null;
    var config = Object.assign({},DEFAULTS,window.GhostPluginConfig || {},local || {});
    var cleanups = [], animations = [], disposed = false, frame = 0;
    var cards = [], order = [], index = 0, busy = false, drag = null, suppressClick = false;
    var sizes = [], poses = [], scale = 1, centerX = 0, centerY = 0, distance = 0, swipeAngle = 0;
    var original = ['role','aria-label','data-shadow','data-reduced'].map(function (key) { return [key,root.getAttribute(key)]; });
    var host = document.createElement('div');
    var stage = document.createElement('div');
    var status = document.createElement('span');
    stage.className = 'gp-stage';
    stage.tabIndex = 0;
    stage.setAttribute('role','group');
    stage.setAttribute('aria-label',String(config.contentGalleryLabel));
    status.className = 'gp-status';
    status.setAttribute('aria-live','polite');
    status.setAttribute('aria-atomic','true');
    host.append(stage,status);
    root.appendChild(host);
    root.setAttribute('role','region');
    root.setAttribute('aria-label',String(config.contentGalleryLabel));
    root.setAttribute('data-shadow',String(!!config.imagesShowShadow));
    function listen(target,type,fn,options) {
      target.addEventListener(type,fn,options);
      cleanups.push(function () { target.removeEventListener(type,fn,options); });
    }
    function stopAnimations() { animations.forEach(function (a) { a.cancel(); }); animations = []; }
    states.set(root,function () {
      disposed = true;
      cancelAnimationFrame(frame);
      drag = null;
      stopAnimations();
      cleanups.forEach(function (fn) { fn(); });
      host.remove();
      original.forEach(function (pair) {
        if (pair[1] === null) root.removeAttribute(pair[0]); else root.setAttribute(pair[0],pair[1]);
      });
    });
    var gallery = config.images;
    if (typeof gallery === 'string') {
      var text = gallery.trim();
      if (!text) gallery = [];
      else {
        try { gallery = JSON.parse(text); }
        catch (error) { gallery = text.split(/\r?\n/); }
      }
    }
    if (!Array.isArray(gallery)) gallery = [];
    var items = gallery.map(function (entry) {
      if (typeof entry === 'string') entry = {src:entry};
      if (!entry || typeof entry !== 'object') return null;
      var src = safeUrl(entry.src,false);
      if (!src) return null;
      return {
        src:src,
        alt:typeof entry.alt === 'string' ? entry.alt : '',
        link:safeUrl(entry.link,true),
        newTab:typeof entry.newTab === 'boolean' ? entry.newTab : !!config.imagesOpenNewTab
      };
    }).filter(function (item) { return item !== null; });
    if (!items.length) items = [
      {src:'demo_light_image.webp',alt:'',link:''},
      {src:'demo_dark_image.webp',alt:'',link:''},
      {src:'demo_light_image.webp',alt:'',link:''},
      {src:'demo_dark_image.webp',alt:'',link:''},
      {src:'demo_light_image.webp',alt:'',link:''}
    ];
    items.forEach(function (item,i) {
      var link = safeUrl(item.link,true);
      var card = document.createElement(link ? 'a' : 'div');
      card.className = 'gp-card';
      card.draggable = false;
      if (link) {
        card.href = link;
        if (typeof item.newTab === 'boolean' ? item.newTab : config.imagesOpenNewTab) {
          card.target = '_blank'; card.rel = 'noopener noreferrer';
        }
      }
      var image = document.createElement('img');
      image.src = item.src;
      image.alt = typeof item.alt === 'string' ? item.alt : '';
      image.draggable = false;
      image.decoding = 'async';
      card.appendChild(image);
      stage.appendChild(card);
      cards.push(card); order.push(i);
    });
    var mobileQuery = window.matchMedia('(max-width: '+num(config.layoutMobileBreakpoint,767,320,1200)+'px)');
    if (mobileQuery.addEventListener) listen(mobileQuery,'change',scheduleMeasure);
    else { mobileQuery.addListener(scheduleMeasure); cleanups.push(function () { mobileQuery.removeListener(scheduleMeasure); }); }
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function motionChanged() {
      root.setAttribute('data-reduced',String(reduced.matches));
      scheduleMeasure();
    }
    if (reduced.addEventListener) listen(reduced,'change',motionChanged);
    else { reduced.addListener(motionChanged); cleanups.push(function () { reduced.removeListener(motionChanged); }); }
    root.setAttribute('data-reduced',String(reduced.matches));
    function count() { return Math.round(num(config.layoutStackSize,4,1,cards.length)); }
    function transform(p) {
      return 'translate(-50%,-50%) translate('+p.x*scale+'px,'+p.y*scale+'px) rotate('+p.angle+'deg) scale('+(p.scale*scale)+')';
    }
    function pose(depth) {
      return poses[Math.min(depth,poses.length-1)] || {x:0,y:0,angle:0,scale:1};
    }
    function measure() {
      if (disposed) return;
      if (busy || drag) { stopAnimations(); busy = false; var captured = drag; drag = null; if (captured && stage.hasPointerCapture(captured.id)) stage.releasePointerCapture(captured.id); stage.removeAttribute('data-dragging'); }
      var css = getComputedStyle(root);
      function read(key,fallback,min,max) { return num(css.getPropertyValue(key),fallback,min,max); }
      var w = read('--image-width-size',360,40,2000);
      var h = read('--image-height-size',440,40,2000);
      var ratioText = css.getPropertyValue('--image-aspect-ratio').trim();
      var ratioParts = ratioText.split('/');
      var ratio = ratioText === 'auto' ? 0 : num(ratioParts[0],0,0,10) / (ratioParts.length > 1 ? num(ratioParts[1],1,0.1,10) : 1);
      sizes = cards.map(function (_,i) {
        var r = config.imagesRandomRatio ? [0.75,1,1.25,1.5][i%4] : ratio;
        return {w:w,h:r ? w/r : h};
      });
      var gap = read('--stack-layer-gap',28,0,100);
      var rotation = read('--stack-rotation-size',7,0,30);
      var shrink = read('--stack-scale-size',0.045,0,0.15);
      var maxHeight = Math.max.apply(null,sizes.map(function (s) { return s.h; }));
      poses = [];
      for (var d = 0; d < count(); d++) {
        var p = {x:0,y:d*gap,angle:0,scale:Math.max(0.4,1-d*shrink)};
        if (config.layoutStackStyle === 'scattered') { p.x = d ? (d%2 ? -1 : 1)*gap : 0; p.angle = d ? (d%2 ? -1 : 1)*rotation : 0; }
        else if (config.layoutStackStyle === 'fan') { p.x = d*gap; p.angle = Math.min(60,d*rotation); }
        else if (config.layoutStackStyle === 'cascade') { p.x = d*gap; p.y = -d*gap; }
        else if (config.layoutStackStyle === 'layered-top') { p.y = -d*gap-maxHeight*(1-p.scale)/2; }
        else { p.y += maxHeight*(1-p.scale)/2; }
        poses.push(p);
      }
      distance = w*read('--swipe-distance-size',0.65,0.1,2);
      swipeAngle = read('--swipe-rotation-size',18,0,45);
      var available = root.getBoundingClientRect().width;
      if (!available) return;
      var mobile = window.matchMedia('(max-width: '+num(config.layoutMobileBreakpoint,767,320,1200)+'px)').matches;
      var fill = mobile && config.layoutMobileFill;
      var padding = fill ? read('--stack-mobile-padding-size',0,0,60) : read('--stack-padding-size',0,0,100);
      /* Shadows paint outside the wrapper without adding layout height. */
      var padY = padding;
      var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      /* Center the resting visible deck. Swipe travel does not shrink the cards. */
      poses.forEach(function (p,depth) {
        var s = sizes[order[depth]];
        var a = Math.abs(p.angle)*Math.PI/180;
        var rw = (s.w*Math.cos(a)+s.h*Math.sin(a))*p.scale/2;
        var rh = (s.w*Math.sin(a)+s.h*Math.cos(a))*p.scale/2;
        minX = Math.min(minX,p.x-rw); maxX = Math.max(maxX,p.x+rw);
        minY = Math.min(minY,p.y-rh); maxY = Math.max(maxY,p.y+rh);
      });
      var fitted = Math.max(1,available-padding*2)/(maxX-minX);
      scale = fill ? fitted : Math.min(1,fitted);
      centerX = available/2-(minX+maxX)*scale/2;
      centerY = (-minY+padY)*scale;
      stage.style.height = Math.ceil((maxY-minY+padY*2)*scale)+'px';
      cards.forEach(function (card,i) {
        card.style.width = sizes[i].w+'px';
        card.style.height = sizes[i].h+'px';
        card.style.left = centerX+'px'; card.style.top = centerY+'px';
        card.style.transition = 'none';
      });
      paint();
      void stage.offsetWidth;
      cards.forEach(function (card) { card.style.removeProperty('transition'); });
    }
    function scheduleMeasure() { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); }
    if (typeof ResizeObserver !== 'undefined') {
      var observer = new ResizeObserver(function () {
        var width = root.getBoundingClientRect().width;
        if (width !== observedWidth) { observedWidth = width; scheduleMeasure(); }
      });
      var observedWidth = -1;
      observer.observe(root);
      cleanups.push(function () { observer.disconnect(); });
    } else listen(window,'resize',scheduleMeasure);
    function paint(held,frontHeld) {
      var focused = document.activeElement;
      cards.forEach(function (card,i) {
        var depth = order.indexOf(i);
        var active = depth === 0;
        if (!active && card.contains(focused)) stage.focus({preventScroll:true});
        card.hidden = card === held ? false : depth >= count();
        card.style.zIndex = card === held ? (frontHeld ? String(cards.length+1) : '0') : String(cards.length-depth);
        card.style.pointerEvents = active ? 'auto' : 'none';
        card.setAttribute('aria-hidden',String(!active));
        if (card.tagName === 'A') card.tabIndex = active ? 0 : -1;
        if (card !== held) card.style.transform = transform(pose(depth));
      });
      status.textContent = String(config.contentPositionText).replace(/\{current\}/g,String(index+1)).replace(/\{total\}/g,String(cards.length));
    }
    function animate(card,from,to,duration,easing) {
      var animation = card.animate([{transform:from},{transform:to}],{duration:duration,easing:easing,fill:'forwards'});
      animations.push(animation);
      return animation;
    }
    function move(direction) {
      if (disposed || busy || cards.length < 2) return;
      if (!config.advancedLoop && index === cards.length-1) { paint(); return; }
      /* Both directions send the front card to the back and reveal the next card. */
      var nextOrder = order.slice();
      nextOrder.push(nextOrder.shift());
      var next = nextOrder[0];
      var moving = cards[index];
      if (reduced.matches || typeof moving.animate !== 'function') { index = next; order = nextOrder; measure(); return; }
      var css = getComputedStyle(root);
      var durationText = css.getPropertyValue('--animation-duration').trim();
      var duration = num(parseFloat(durationText)*(/ms$/.test(durationText) ? 1 : 1000),380,0,5000);
      var easing = css.getPropertyValue('--animation-easing').trim() || 'ease';
      if (!CSS.supports('animation-timing-function',easing)) easing = 'ease';
      busy = true;
      var side = direction > 0 ? -1 : 1;
      var extended = transform({x:side*distance,y:0,angle:side*swipeAngle,scale:1});
      var outward = animate(moving,getComputedStyle(moving).transform,extended,duration,easing);
      outward.finished.then(function () {
        if (disposed || !busy) return;
        moving.style.transform = extended;
        outward.cancel();
        index = next; order = nextOrder;
        paint(moving);
        var returned = transform(pose(count()-1));
        var inward = animate(moving,extended,returned,duration,easing);
        inward.finished.then(function () {
          if (disposed || !busy) return;
          moving.style.transform = returned;
          inward.cancel();
          busy = false; animations = []; measure();
        }).catch(function () {});
      }).catch(function () {});
    }
    function eventTime(event) { return Number.isFinite(event.timeStamp) ? event.timeStamp : Date.now(); }
    function beginGesture(event) {
      suppressClick = false;
      if (!config.advancedEnableSwipe || busy || cards.length < 2 || !sizes.length || event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0) || drag) return;
      drag = {id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,rawX:0,lastX:0,lastTime:eventTime(event),velocity:0,moved:false,horizontal:false};
      /* Capture immediately so touch events remain attached to the stage. */
      if (stage.setPointerCapture && event.pointerType !== 'fallback-touch') {
        try { stage.setPointerCapture(drag.id); } catch (error) {}
      }
    }
    function updateGesture(event) {
      if (!drag || event.pointerId !== drag.id) return;
      var dx = event.clientX-drag.x, dy = event.clientY-drag.y;
      if (!drag.horizontal) {
        if (Math.max(Math.abs(dx),Math.abs(dy)) < 8) return;
        drag.moved = true;
        if (Math.abs(dy) > Math.abs(dx)*1.2) { settle(event,true); return; }
        if (Math.abs(dx) < Math.abs(dy)*1.2) return;
        drag.horizontal = true;
        stage.setAttribute('data-dragging','true');
      }
      if (event.cancelable) event.preventDefault();
      var time = eventTime(event);
      if (dx !== drag.lastX) {
        drag.velocity = (dx-drag.lastX)/Math.max(1,time-drag.lastTime);
        drag.lastTime = time;
        drag.lastX = dx;
      }
      /* Commit uses actual finger travel rather than the visual travel cap. */
      drag.rawX = dx;
      drag.dx = Math.max(-distance*scale,Math.min(distance*scale,dx));
      cards[index].style.transform = transform({x:drag.dx/scale,y:0,angle:drag.dx/(distance*scale)*swipeAngle,scale:1});
    }
    function settle(event,canceled) {
      if (!drag || event.pointerId !== drag.id) return;
      var gesture = drag; drag = null;
      stage.removeAttribute('data-dragging');
      if (stage.hasPointerCapture && stage.hasPointerCapture(gesture.id)) stage.releasePointerCapture(gesture.id);
      suppressClick = gesture.moved;
      var threshold = sizes[index].w*scale*num(config.advancedSwipeThreshold,0.18,0.05,0.8);
      var velocity = eventTime(event)-gesture.lastTime <= 100 ? gesture.velocity : 0;
      var flick = Math.abs(gesture.rawX) >= 16 && velocity*Math.sign(gesture.rawX) >= num(config.advancedSwipeVelocity,0.45,0.1,2);
      if (!canceled && gesture.horizontal && (Math.abs(gesture.rawX) >= threshold || flick)) move(gesture.rawX < 0 ? 1 : -1);
      else paint();
    }
    function finishGesture(event) {
      /* Some devices send the final position only in pointerup. */
      updateGesture(event);
      settle(event,false);
    }
    if ('PointerEvent' in window) {
      listen(stage,'pointerdown',beginGesture);
      listen(stage,'pointermove',updateGesture,{passive:false});
      listen(stage,'pointerup',finishGesture);
      listen(stage,'pointercancel',function (event) { settle(event,true); });
      listen(stage,'lostpointercapture',function (event) { settle(event,true); });
    } else {
      function touchEvent(event,touch) {
        return {pointerId:touch.identifier,pointerType:'fallback-touch',isPrimary:true,clientX:touch.clientX,clientY:touch.clientY,timeStamp:event.timeStamp,cancelable:event.cancelable,preventDefault:function () { event.preventDefault(); }};
      }
      listen(stage,'touchstart',function (event) {
        if (event.touches.length === 1) beginGesture(touchEvent(event,event.touches[0]));
        else if (drag) settle({pointerId:drag.id},true);
      },{passive:true});
      listen(stage,'touchmove',function (event) {
        if (event.touches.length !== 1) { if (drag) settle({pointerId:drag.id},true); return; }
        updateGesture(touchEvent(event,event.touches[0]));
      },{passive:false});
      listen(stage,'touchend',function (event) {
        if (!drag) return;
        for (var t = 0; t < event.changedTouches.length; t++) {
          if (event.changedTouches[t].identifier === drag.id) finishGesture(touchEvent(event,event.changedTouches[t]));
        }
      });
      listen(stage,'touchcancel',function () { if (drag) settle({pointerId:drag.id},true); });
      listen(stage,'mousedown',function (event) {
        beginGesture({pointerId:1,pointerType:'mouse',isPrimary:true,button:event.button,clientX:event.clientX,clientY:event.clientY,timeStamp:event.timeStamp});
      });
      listen(window,'mousemove',function (event) {
        updateGesture({pointerId:1,clientX:event.clientX,clientY:event.clientY,timeStamp:event.timeStamp,cancelable:event.cancelable,preventDefault:function () { event.preventDefault(); }});
      });
      listen(window,'mouseup',function (event) {
        finishGesture({pointerId:1,clientX:event.clientX,clientY:event.clientY,timeStamp:event.timeStamp});
      });
    }
    listen(stage,'dragstart',function (event) { event.preventDefault(); });
    listen(stage,'click',function (event) {
      if (suppressClick || busy) { event.preventDefault(); event.stopPropagation(); suppressClick = false; }
    },true);
    listen(stage,'keydown',function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
    });
    scheduleMeasure();
  }
  function initAll() { document.querySelectorAll('.gp-shuffle-stack').forEach(initialize); }
  window.GhostShuffleStack = {initAll:initAll};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initAll,{once:true}); else initAll();
})();
