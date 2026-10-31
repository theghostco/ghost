(function () {
  'use strict';
  var SLUG = 'hide-and-seek-images';
  var DEFAULTS = { images: '', placement: 'block', mixedSizes: true, revealStyle: 'opacity', expandOnHover: true, imageShadowStyle: 'soft', showTooltip: true, hiddenSignal: 'breathe' };
  var DEMO = ['demo_light_image.webp', 'demo_dark_image.webp', 'demo_light_image.webp', 'demo_dark_image.webp', 'demo_light_image.webp', 'demo_dark_image.webp'];
  var instances = new Map();
  function on(v) { return v === true || v === 'true' || v === 1 || v === '1'; }
  function parseGallery(value) {
    var list = value;
    if (typeof value === 'string') {
      if (!value.trim()) list = DEMO;
      else { try { list = JSON.parse(value); } catch (_) { list = value.split(/[\n,]+/); } }
    }
    if (!Array.isArray(list)) return [];
    return list.map(function (item) {
      if (typeof item === 'string') item = { src: item.trim() };
      if (!item || typeof item.src !== 'string' || !item.src.trim()) return null;
      try {
        var url = new URL(item.src, document.baseURI);
        if (!/^(https?:|blob:|file:)$/.test(url.protocol)) return null;
        return { src: url.href, alt: typeof item.alt === 'string' ? item.alt : '', link: typeof item.link === 'string' ? item.link : '', newTab: on(item.newTab) || on(item.new_tab) };
      } catch (_) { return null; }
    }).filter(Boolean).slice(0, 30);
  }
  function safeLink(v) {
    if (!v) return '';
    try { var u = new URL(v, document.baseURI); return /^(https?:|mailto:|tel:)$/.test(u.protocol) ? u.href : ''; } catch (_) { return ''; }
  }
  function ratioOf(raw) {
    var s = String(raw || '').trim();
    if (!s || s === 'auto') return 0;
    var p = s.split(/[\/:]/), a = parseFloat(p[0]), b = parseFloat(p[1] || '1');
    return a > 0 && b > 0 ? a / b : 0;
  }
  function initialize(root) {
    var perBlock = window.GhostPlugins && typeof window.GhostPlugins.configFor === 'function' ? window.GhostPlugins.configFor(root, SLUG) : null;
    var config = Object.assign({}, DEFAULTS, window.GhostPluginConfig || {}, perBlock || {});
    var cleanups = [], items = [], frame = 0, dead = false;
    var section = root.closest('section'), marker, changedPosition = false, oldPosition = '';
    if (config.placement === 'section' && section) {
      marker = document.createComment(SLUG);
      root.before(marker);
      oldPosition = section.style.getPropertyValue('position');
      if (getComputedStyle(section).position === 'static') { section.style.position = 'relative'; changedPosition = true; }
      section.appendChild(root);
      root.dataset.placement = 'section';
    } else {
      root.dataset.placement = 'block';
      var gridArea = root.closest('.fe-block, .codemodule-block, #gp-root'), wrapper = root.parentElement;
      while (gridArea && wrapper && wrapper !== gridArea) {
        (function (el) {
          var v = el.style.getPropertyValue('height');
          el.style.setProperty('height', '100%');
          cleanups.push(function () { if (v) el.style.setProperty('height', v); else el.style.removeProperty('height'); });
        })(wrapper);
        wrapper = wrapper.parentElement;
      }
    }
    root.dataset.reveal = /^(blur|grayscale)$/.test(config.revealStyle) ? config.revealStyle : 'opacity';
    root.dataset.expand = String(on(config.expandOnHover));
    root.dataset.shadow = config.imageShadowStyle === 'none' ? 'none' : 'on';
    function schedule() { if (!frame && !dead) frame = requestAnimationFrame(layout); }
    function layout() {
      frame = 0;
      if (dead || !items.length) return;
      var css = getComputedStyle(root), w = root.clientWidth, h = root.clientHeight;
      if (!w || !h) return;
      function num(k, f) { var v = parseFloat(css.getPropertyValue(k)); return isFinite(v) ? v : f; }
      var spread = Math.max(0, Math.min(1, num('--image-spread-distance', 100) / 100));
      var scale = on(config.expandOnHover) ? Math.max(1, num('--image-hover-scale', 1.08)) : 1;
      var fixedRatio = ratioOf(css.getPropertyValue('--image-aspect-ratio'));
      var desired = Math.max(20, num('--image-width', 180)), gap = 16, count = items.length, best = null;
      // Average shape decides the grid; each image owns one cell so nothing overlaps.
      var avg = 0; items.forEach(function (it) { it.ratio = fixedRatio || it.natural || 1; avg += it.ratio; }); avg /= count;
      for (var cols = 1; cols <= count; cols++) {
        var rows = Math.ceil(count / cols), cw = w / cols, ch = h / rows;
        var fit = Math.min(desired, (cw - gap) / scale, ((ch - gap) / scale) * avg);
        if (!best || fit > best.fit) best = { cols: cols, rows: rows, fit: fit };
      }
      var baseW = Math.max(10, best.fit);
      var packW = baseW * scale + gap, packH = (baseW / avg) * scale + gap;
      var cellW = w / best.cols, cellH = h / best.rows;
      var stepX = packW + (cellW - packW) * spread, stepY = packH + (cellH - packH) * spread;
      items.forEach(function (it, i) {
        var iw = baseW * (on(config.mixedSizes) ? 0.65 + it.seed * 0.35 : 1), ih = iw / it.ratio;
        var maxH = (stepY - gap) / scale;
        if (ih > maxH) { ih = maxH; iw = ih * it.ratio; }
        var col = i % best.cols, row = Math.floor(i / best.cols);
        var rowCount = row === best.rows - 1 ? count - row * best.cols : best.cols;
        var x = (w - rowCount * stepX) / 2 + col * stepX + stepX / 2;
        var y = (h - best.rows * stepY) / 2 + row * stepY + stepY / 2;
        x += (it.jx - 0.5) * Math.max(0, stepX - iw * scale - gap);
        y += (it.jy - 0.5) * Math.max(0, stepY - ih * scale - gap);
        var s = it.node.style;
        s.width = iw + 'px'; s.height = ih + 'px'; s.left = (x - iw / 2) + 'px'; s.top = (y - ih / 2) + 'px';
      });
    }
    root.dataset.signal = /^(breathe|glint)$/.test(config.hiddenSignal) ? config.hiddenSignal : 'none';
    // Floating title tooltip that follows the pointer inside the canvas.
    var tip = null;
    if (on(config.showTooltip)) {
      tip = document.createElement('div'); tip.className = 'gp-hsi-tooltip'; tip.hidden = true; tip.setAttribute('aria-hidden', 'true');
      root.appendChild(tip);
    }
    function place(e) {
      if (!tip || tip.hidden) return;
      var r = root.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
      var x = e.clientX - r.left + 14, y = e.clientY - r.top + 18;
      if (x + tw > r.width - 6) x = e.clientX - r.left - tw - 14;
      if (y + th > r.height - 6) y = e.clientY - r.top - th - 14;
      tip.style.transform = 'translate(' + Math.max(6, x) + 'px,' + Math.max(6, y) + 'px)';
    }
    var meta = config.imagesAlt;
    if (typeof meta === 'string') { try { meta = JSON.parse(meta); } catch (_) { meta = null; } }
    parseGallery(config.images).forEach(function (entry, i) {
      var m = meta && meta[entry.src];
      var link = safeLink(entry.link || (m && m.link) || '');
      var node = document.createElement(link ? 'a' : 'div'), img = document.createElement('img');
      node.className = 'gp-hsi-image';
      node.tabIndex = 0;
      node.setAttribute('data-gp-demo-target', '');
      node.style.setProperty('--hsi-delay', (-((i * 0.83) % 4)).toFixed(2) + 's');
      if (link) { node.href = link; if (entry.newTab || (m && on(m.newTab))) { node.target = '_blank'; node.rel = 'noopener noreferrer'; } }
      img.alt = entry.alt || (typeof m === 'string' ? m : (m && m.alt) || '');
      var title = String((m && typeof m === 'object' && m.title) || entry.title || '').trim();
      if (title && tip) {
        node.addEventListener('pointerenter', function (e) { tip.textContent = title; tip.hidden = false; place(e); });
        node.addEventListener('pointermove', place);
        node.addEventListener('pointerleave', function () { tip.hidden = true; });
        node.addEventListener('focus', function () { var r = node.getBoundingClientRect(); tip.textContent = title; tip.hidden = false; place({ clientX: r.left + r.width / 2, clientY: r.bottom }); });
        node.addEventListener('blur', function () { tip.hidden = true; });
      }
      img.draggable = false;
      var it = { node: node, natural: 0, seed: ((i * 37 + 19) % 101) / 101, jx: ((i * 61 + 23) % 101) / 101, jy: ((i * 43 + 67) % 101) / 101 };
      img.addEventListener('load', function () { if (img.naturalWidth && img.naturalHeight) { it.natural = img.naturalWidth / img.naturalHeight; schedule(); } });
      img.addEventListener('error', function () { node.hidden = true; });
      img.src = entry.src;
      node.appendChild(img);
      // Touch screens: tap reveals, tap again follows the link.
      node.addEventListener('touchstart', function (e) {
        if (!node.classList.contains('gp-hsi-on')) { items.forEach(function (o) { o.node.classList.remove('gp-hsi-on'); }); node.classList.add('gp-hsi-on'); if (link) e.preventDefault(); }
      }, { passive: false });
      root.appendChild(node);
      items.push(it);
    });
    var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    if (ro) ro.observe(root);
    window.addEventListener('resize', schedule);
    var mo = new MutationObserver(schedule);
    mo.observe(root, { attributes: true, attributeFilter: ['style', 'class'] });
    var head = new MutationObserver(schedule);
    head.observe(document.head, { childList: true, subtree: true, characterData: true });
    schedule();
    return {
      key: JSON.stringify(config),
      destroy: function () {
        dead = true; cancelAnimationFrame(frame);
        if (ro) ro.disconnect(); mo.disconnect(); head.disconnect();
        window.removeEventListener('resize', schedule);
        items.forEach(function (it) { it.node.remove(); });
        if (tip) tip.remove();
        if (marker) { if (marker.parentNode) marker.before(root); marker.remove(); }
        if (changedPosition && section) { if (oldPosition) section.style.position = oldPosition; else section.style.removeProperty('position'); }
        cleanups.forEach(function (fn) { fn(); });
      }
    };
  }
  function initAll() {
    instances.forEach(function (inst, root) { inst.destroy(); instances.delete(root); });
    document.querySelectorAll('.gp-hide-and-seek-images').forEach(function (root) { instances.set(root, initialize(root)); });
  }
  if (window.GhostHideAndSeekImages && window.GhostHideAndSeekImages.destroy) window.GhostHideAndSeekImages.destroy();
  window.GhostHideAndSeekImages = {
    initAll: initAll,
    destroy: function () {
      instances.forEach(function (inst) { inst.destroy(); }); instances.clear();
      document.removeEventListener('ghost:config', initAll);
      document.removeEventListener('mercury:load', initAll);
    }
  };
  document.addEventListener('ghost:config', initAll);
  document.addEventListener('mercury:load', initAll);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll, { once: true }); else initAll();
})();

