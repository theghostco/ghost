(function () {
  'use strict';
  var DEFAULTS = { images: '', placement: 'block', cursorStyle: 'grab', mixedSizes: true, expandOnHover: true, tiltOnHover: true };
  var instances = new Map();
  function parseGallery(value) {
    var list = value;
    if (typeof value === 'string') {
      if (!value.trim()) list = ['demo_light_image.webp', 'demo_dark_image.webp'];
      else { try { list = JSON.parse(value); } catch (_) { list = value.split(/[\n,]+/); } }
    }
    if (!Array.isArray(list)) return [];
    return list.map(function (item) {
      if (typeof item === 'string') item = { src: item.trim() };
      if (!item || typeof item.src !== 'string' || !item.src.trim()) return null;
      try {
        var url = new URL(item.src, document.baseURI);
        if (!/^(https?:|blob:|file:)$/.test(url.protocol)) return null;
        return { src: url.href, alt: typeof item.alt === 'string' ? item.alt : '' };
      } catch (_) { return null; }
    }).filter(Boolean).slice(0, 20);
  }
  function initialize(root) {
    var perBlock = window.GhostPlugins && typeof window.GhostPlugins.configFor === 'function' ? window.GhostPlugins.configFor(root, 'mood-board-images') : null;
    var config = Object.assign({}, DEFAULTS, window.GhostPluginConfig || {}, perBlock || {});
    var cleanups = [], items = [], frame = 0, dead = false, layer = 1, sizeLocked = false;
    var desktop = matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
    var reduced = matchMedia('(prefers-reduced-motion: reduce)');
    var section = root.closest('section'), marker, originalPosition, originalPriority, changedPosition = false;
    function listen(target, event, handler) {
      target.addEventListener(event, handler);
      cleanups.push(function () { target.removeEventListener(event, handler); });
    }
    if (config.placement === 'section' && section) {
      marker = document.createComment('mood-board-images');
      root.before(marker);
      originalPosition = section.style.getPropertyValue('position');
      originalPriority = section.style.getPropertyPriority('position');
      if (getComputedStyle(section).position === 'static') { section.style.position = 'relative'; changedPosition = true; }
      section.appendChild(root);
      root.dataset.placement = 'section';
    } else root.dataset.placement = 'block';
    // Stretch only this Code Block's wrappers inside its Fluid Engine grid area.
    if (config.placement !== 'section' || !section) {
      var gridArea = root.closest('.fe-block');
      if (gridArea) {
        var wrapper = root.parentElement;
        while (wrapper && wrapper !== gridArea) {
          (function (element) {
            var value = element.style.getPropertyValue('height');
            var priority = element.style.getPropertyPriority('height');
            element.style.setProperty('height', '100%');
            cleanups.push(function () {
              if (value) element.style.setProperty('height', value, priority);
              else element.style.removeProperty('height');
            });
          })(wrapper);
          wrapper = wrapper.parentElement;
        }
      }
    }
    root.dataset.keyboard = 'false';
    listen(root, 'keydown', function () { root.dataset.keyboard = 'true'; });
    listen(root, 'pointerdown', function () { root.dataset.keyboard = 'false'; });
    root.dataset.cursor = config.cursorStyle === 'move' ? 'move' : 'grab';
    root.dataset.expand = String(config.expandOnHover === true);
    root.dataset.tilt = String(config.tiltOnHover === true);
    function clamp(n, low, high) { return Math.max(low, Math.min(high, n)); }
    function move(item, x, y, remember) {
      item.x = clamp(x, item.lx, item.hx); item.y = clamp(y, item.ly, item.hy);
      item.node.style.left = item.x + 'px'; item.node.style.top = item.y + 'px';
      if (remember) {
        item.moved = true;
        item.nx = item.hx > item.lx ? (item.x - item.lx) / (item.hx - item.lx) : .5;
        item.ny = item.hy > item.ly ? (item.y - item.ly) / (item.hy - item.ly) : .5;
      }
    }
    function layout() {
      frame = 0; if (dead) return;
      var css = getComputedStyle(root);
      function n(key, fallback) { var v = parseFloat(css.getPropertyValue(key)); return Number.isFinite(v) ? v : fallback; }
      root.dataset.shadow = css.getPropertyValue('--image-shadow-style').trim() === 'none' ? 'none' : 'solid';
      root.dataset.desktop = String(desktop.matches);
      var size = (function () {
        var box = config.placement === 'section' && section ? section : root.closest('.fe-block');
        var own = root.getBoundingClientRect();
        var bounds = box ? box.getBoundingClientRect() : own;
        var bw = Math.round(bounds.width) || Math.round(own.width) || 320;
        /* Code Block mode: fill only the space left inside the block, so the block never grows to fit the plugin. */
        var bh = (box && !(config.placement === 'section' && section) ? (function(el,blk){el.style.boxSizing='border-box';var r=el.getBoundingClientRect(),b=blk.getBoundingClientRect(),inset=0,n=el.parentElement,s;while(n&&n!==blk){s=getComputedStyle(n);inset+=(parseFloat(s.paddingBottom)||0)+(parseFloat(s.borderBottomWidth)||0);n=n.parentElement}s=getComputedStyle(blk);inset+=(parseFloat(s.paddingBottom)||0)+(parseFloat(s.borderBottomWidth)||0)+(parseFloat(getComputedStyle(el).marginBottom)||0);return Math.max(0,Math.floor(b.bottom-r.top-inset))})(root, box) : Math.round(bounds.height)) || Math.round(own.height);
        if (!bh) bh = Math.max(320, Math.round(bw * .6));
        if (own.height < bh - 1) {
          root.style.setProperty('height', bh + 'px');
          root.style.setProperty('min-height', bh + 'px');
          if (!sizeLocked) {
            sizeLocked = true;
            cleanups.push(function () { root.style.removeProperty('height'); root.style.removeProperty('min-height'); });
          }
        }
        return { w: Math.max(1, bw), h: Math.max(1, bh) };
      })();
      var w = root.clientWidth || size.w, h = root.clientHeight || size.h;
      if (!w || !h) { schedule(); return; }
      var min = Math.max(1, n('--image-minimum-size', 110)), max = Math.max(1, n('--image-maximum-height', 280));
      var spread = clamp(n('--image-spread-distance', 100) / 100, 0, 1);
      var scale = desktop.matches && !reduced.matches && config.expandOnHover === true ? Math.max(1, n('--image-hover-scale', 1.08)) : 1;
      var shadow = root.dataset.shadow === 'none' ? 0 : 2 * Math.max(0, n('--image-shadow-blur', 24)) + Math.max(0, n('--image-shadow-spread', 0)) + Math.max(Math.abs(n('--image-shadow-offset-x', 0)), Math.abs(n('--image-shadow-offset-y', 8)));
      var edge = Math.min(shadow * scale, Math.max(0, (Math.min(w, h) - 1) / 2));
      items.forEach(function (item) {
        if (!item.loaded) return;
        item.node.tabIndex = desktop.matches ? 0 : -1;
        var ih = config.mixedSizes === true ? Math.min(min, max) + item.size * Math.max(0, max - min) : max;
        var ratioValue = css.getPropertyValue('--image-aspect-ratio').trim();
        var ratios = { '1/1': 1, '4/3': 4/3, '3/2': 3/2, '16/9': 16/9, '9/16': 9/16 };
        var ratio = ratios[ratioValue] || item.image.naturalWidth / item.image.naturalHeight;
        var iw = ih * ratio;
        var diagonal = Math.hypot(iw, ih) * scale;
        var fit = Math.min(1, Math.max(1, w - edge * 2) / diagonal, Math.max(1, h - edge * 2) / diagonal);
        iw *= fit; ih *= fit;
        item.node.style.width = iw + 'px'; item.node.style.height = ih + 'px';
        var ex = iw * scale / 2 + edge, ey = ih * scale / 2 + edge;
        var tx = Math.max(0, w / 2 - ex), ty = Math.max(0, h / 2 - ey);
        item.lx = Math.max(0, w / 2 - tx - iw / 2); item.hx = Math.max(item.lx, w / 2 + tx - iw / 2);
        item.ly = Math.max(0, h / 2 - ty - ih / 2); item.hy = Math.max(item.ly, h / 2 + ty - ih / 2);
        var nx = item.moved ? item.nx : .5 + (item.seedX - .5) * spread;
        var ny = item.moved ? item.ny : .5 + (item.seedY - .5) * spread;
        move(item, item.lx + nx * (item.hx - item.lx), item.ly + ny * (item.hy - item.ly), false);
      });
    }
    function schedule() { if (!frame && !dead) frame = requestAnimationFrame(layout); }
    parseGallery(config.images).forEach(function (entry) {
      var node = document.createElement('button'), img = document.createElement('img');
      node.type = 'button'; node.className = 'gp-mbi-item'; node.hidden = true; node.tabIndex = -1;
      node.setAttribute('aria-label', entry.alt || ''); img.alt = entry.alt; img.draggable = false;
      node.appendChild(img); root.appendChild(node);
      var item = { node: node, image: img, loaded: false, moved: false, seedX: Math.random(), seedY: Math.random(), size: Math.random(), nx: .5, ny: .5, x: 0, y: 0 }, drag;
      items.push(item);
      listen(img, 'load', function () { item.loaded = true; node.hidden = false; schedule(); });
      listen(img, 'error', function () { item.loaded = false; node.hidden = true; });
      listen(node, 'pointerdown', function (e) {
        if (!desktop.matches || e.pointerType === 'touch' || e.button !== 0) return;
        e.preventDefault(); node.focus({ preventScroll: true }); node.style.zIndex = String(++layer);
        var bounds = root.getBoundingClientRect();
        drag = { id: e.pointerId, x: e.clientX, y: e.clientY, left: item.x, top: item.y, sx: root.clientWidth / bounds.width || 1, sy: root.clientHeight / bounds.height || 1 };
        node.dataset.dragging = 'true'; node.setPointerCapture(e.pointerId);
      });
      listen(node, 'pointermove', function (e) { if (drag && drag.id === e.pointerId) move(item, drag.left + (e.clientX - drag.x) * drag.sx, drag.top + (e.clientY - drag.y) * drag.sy, true); });
      function finish(e) { if (drag && drag.id === e.pointerId) { drag = null; delete node.dataset.dragging; } }
      listen(node, 'pointerup', finish); listen(node, 'pointercancel', finish); listen(node, 'lostpointercapture', finish);
      listen(node, 'keydown', function (e) {
        if (!desktop.matches) return;
        var step = e.shiftKey ? 30 : 10, directions = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }, d = directions[e.key];
        if (!d) return; e.preventDefault(); node.style.zIndex = String(++layer); move(item, item.x + d[0], item.y + d[1], true);
      });
      img.src = entry.src;
    });
    var observer = new ResizeObserver(schedule); observer.observe(root);
    listen(window, 'resize', schedule); listen(desktop, 'change', schedule); listen(reduced, 'change', schedule); schedule();
    return function () {
      dead = true; cancelAnimationFrame(frame); observer.disconnect(); cleanups.forEach(function (fn) { fn(); }); items.forEach(function (i) { i.node.remove(); });
      if (marker) {
        if (marker.parentNode) marker.before(root); marker.remove();
        if (changedPosition) { if (originalPosition) section.style.setProperty('position', originalPosition, originalPriority); else section.style.removeProperty('position'); }
      }
      ['placement', 'cursor', 'expand', 'tilt', 'shadow', 'desktop', 'keyboard'].forEach(function (key) { delete root.dataset[key]; });
    };
  }
  function initAll() {
    instances.forEach(function (cleanup) { cleanup(); }); instances.clear();
    document.querySelectorAll('.gp-mood-board-images').forEach(function (root) { instances.set(root, initialize(root)); });
  }
  window.GhostMoodBoardImages = { initAll: initAll };
  document.addEventListener('ghost:config', initAll);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll, { once: true }); else initAll();
})();
