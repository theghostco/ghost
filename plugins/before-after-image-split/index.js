(function () {
  'use strict';
  var DEFAULTS = {
    beforeImage: '', afterImage: '', beforeAlt: 'Before comparison image', afterAlt: 'After comparison image',
    beforeText: 'Before', afterText: 'After', beforeLink: '', afterLink: '',
    openLinksInNewTab: false, startPosition: 50, keyboardStep: 1,
    sliderLabel: 'Image comparison', sliderHelp: 'Click an image or drag the handle. Use arrow keys when the handle is focused. Select a label to open its link.',
    beforeValueText: 'Before image visible', afterValueText: 'After image visible',
    arrowStyle: 'default', arrowSvg: '', linkIconStyle: 'default', linkIconSvg: ''
  };
  var SLUG = 'before-after-image-split';
  var states = new Map();
  if (window.GhostBeforeAfterImageSplit && window.GhostBeforeAfterImageSplit.destroy) window.GhostBeforeAfterImageSplit.destroy();
  function text(v) { return v == null ? '' : String(v); }
  function numeric(v, fallback, min, max) { v = Number(v); return Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback; }
  function url(v, image) {
    if (!text(v).trim()) return '';
    try { var u = new URL(text(v).trim(), document.baseURI); return (image ? ['http:', 'https:', 'blob:'] : ['http:', 'https:', 'mailto:', 'tel:']).includes(u.protocol) ? u.href : ''; } catch (e) { return ''; }
  }
  function node(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function icon(value, fallback) {
    try {
      if (!/^data:image\/svg\+xml(?:;charset=utf-8)?,/i.test(text(value))) return fallback;
      var svg = decodeURIComponent(value.slice(value.indexOf(',') + 1));
      if (!/^\s*<svg\b/i.test(svg) || /\bon\w+\s*=|\b(?:href|src|style)\s*=|url\s*\(|<!|<\?/i.test(svg)) return fallback;
      var parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
      var allowed = ['svg','g','path','circle','ellipse','rect','line','polyline','polygon','title','desc'];
      if (parsed.querySelector('parsererror') || Array.from(parsed.querySelectorAll('*')).some(function (el) { return allowed.indexOf(el.localName) < 0; })) return fallback;
      var root = parsed.documentElement;
      root.setAttribute('aria-hidden', 'true'); root.setAttribute('focusable', 'false');
      ['width','height','fill','stroke','stroke-width'].forEach(function (attr) { root.removeAttribute(attr); });
      root.querySelectorAll('*').forEach(function (el) { ['fill','stroke','stroke-width'].forEach(function (attr) { el.removeAttribute(attr); }); });
      return new XMLSerializer().serializeToString(root);
    } catch (e) { return fallback; }
  }
  function configFor(root) {
    var global = window.GhostPluginConfig || {};
    if (global[SLUG]) global = global[SLUG];
    var local = {};
    if (window.GhostPlugins && typeof window.GhostPlugins.configFor === 'function') {
      try { local = window.GhostPlugins.configFor(root, SLUG) || {}; } catch (e) {}
    }
    return Object.assign({}, DEFAULTS, global, local);
  }
  function init(root) {
    var c = configFor(root), cleanup = [], position = numeric(c.startPosition, 50, 0, 100), pointer = null;
    var stage = node('div', 'gp-stage'), before, after;
    function on(target, type, fn, opts) { target.addEventListener(type, fn, opts); cleanup.push(function () { target.removeEventListener(type, fn, opts); }); }
    function layer(side) {
      var wrap = node('div', 'gp-layer gp-' + side), img = node('img', 'gp-photo');
      img.src = url(c[side + 'Image'], true) || (side === 'before' ? 'demo_light_image.webp' : 'demo_dark_image.webp');
      img.alt = text(c[side + 'Alt']); img.draggable = false; img.decoding = 'async';
      wrap.appendChild(img);
      on(img, 'error', function () { img.hidden = true; });
      var labelText = text(c[side + 'Text']), href = url(c[side + 'Link'], false);
      if (labelText.trim() || href) {
        var label = node(href ? 'a' : 'span', 'gp-label');
        if (labelText.trim()) label.textContent = labelText;
        else { var name = node('span', 'gp-sr-only'); name.textContent = text(c[side + 'Alt']) || text(c.sliderLabel); label.appendChild(name); label.classList.add('gp-link-icon'); label.insertAdjacentHTML('afterbegin', c.linkIconStyle === 'custom' ? icon(c.linkIconSvg, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-3 3M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l3-3"/></svg>') : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-3 3M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l3-3"/></svg>'); }
        if (href) { label.href = href; if (c.openLinksInNewTab === true || c.openLinksInNewTab === 'true') { label.target = '_blank'; label.rel = 'noopener noreferrer'; } }
        wrap.appendChild(label);
      }
      stage.appendChild(wrap); return wrap;
    }
    after = layer('after'); before = layer('before');
    var divider = node('div', 'gp-divider'); divider.setAttribute('aria-hidden', 'true'); stage.appendChild(divider);
    var handle = node('button', 'gp-handle'); handle.type = 'button'; handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', text(c.sliderLabel)); handle.setAttribute('aria-description', text(c.sliderHelp));
    handle.setAttribute('aria-orientation', 'horizontal'); handle.setAttribute('aria-valuemin', '0'); handle.setAttribute('aria-valuemax', '100');
    handle.innerHTML = c.arrowStyle === 'custom' ? icon(c.arrowSvg, '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6 3 12l6 6M15 6l6 6-6 6"/></svg>') : '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6 3 12l6 6M15 6l6 6-6 6"/></svg>';
    stage.appendChild(handle); root.appendChild(stage);
    function render(v) {
      position = numeric(v, position, 0, 100);
      before.style.clipPath = 'inset(0 ' + (100-position) + '% 0 0)'; after.style.clipPath = 'inset(0 0 0 ' + position + '%)';
      divider.style.left = position + '%'; placeHandle();
      handle.setAttribute('aria-valuenow', String(Math.round(position * 10) / 10));
      handle.setAttribute('aria-valuetext', text(c.beforeValueText) + ': ' + Math.round(position) + '%. ' + text(c.afterValueText) + ': ' + Math.round(100-position) + '%.');
      [before, after].forEach(function (layer, i) { var a = layer.querySelector('a'); if (a) { var hidden = i === 0 ? position === 0 : position === 100; a.tabIndex = hidden ? -1 : 0; a.setAttribute('aria-hidden', String(hidden)); } });
    }
    var bounds;
    function placeHandle() { var half = handle.offsetWidth / 2; handle.style.left = 'clamp(' + half + 'px, ' + position + '%, calc(100% - ' + half + 'px))'; }
    function measure() { bounds = stage.getBoundingClientRect(); placeHandle(); }
    function move(e) { measure(); if (bounds.width) render((e.clientX-bounds.left)/bounds.width*100); }
    on(stage, 'click', function (e) { if (e.target.closest('a') || e.target.closest('.gp-handle')) return; move(e); handle.focus({preventScroll:true}); });
    on(handle, 'pointerdown', function (e) { if (e.button !== 0 || !e.isPrimary) return; e.preventDefault(); pointer = e.pointerId; handle.focus({preventScroll:true}); handle.setPointerCapture(pointer); move(e); });
    on(handle, 'pointermove', function (e) { if (pointer === e.pointerId) move(e); });
    function end(e) { if (pointer !== e.pointerId) return; if (handle.hasPointerCapture(pointer)) handle.releasePointerCapture(pointer); pointer = null; }
    on(handle, 'pointerup', end); on(handle, 'pointercancel', end); on(handle, 'lostpointercapture', function () { pointer = null; });
    on(handle, 'keydown', function (e) {
      var v = position, step = numeric(c.keyboardStep, 1, 0.1, 25) * (e.shiftKey ? 10 : 1);
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v += step;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v -= step;
      else if (e.key === 'Home') v = 0; else if (e.key === 'End') v = 100;
      else if (e.key === 'PageUp') v += 10; else if (e.key === 'PageDown') v -= 10; else return;
      e.preventDefault(); render(v);
    });
    render(position); measure();
    if (window.ResizeObserver) { var observer = new ResizeObserver(measure); observer.observe(root); cleanup.push(function () { observer.disconnect(); }); }
    else on(window, 'resize', measure);
    states.set(root, function () { if (pointer !== null && handle.hasPointerCapture(pointer)) handle.releasePointerCapture(pointer); cleanup.forEach(function (fn) { fn(); }); stage.remove(); });
  }
  function initAll() { states.forEach(function (dispose) { dispose(); }); states.clear(); document.querySelectorAll('.gp-before-after-image-split').forEach(init); }
  function destroy() { document.removeEventListener('ghost:config', initAll); document.removeEventListener('DOMContentLoaded', initAll); states.forEach(function (dispose) { dispose(); }); states.clear(); }
  window.GhostBeforeAfterImageSplit = {initAll:initAll, destroy:destroy};
  document.addEventListener('ghost:config', initAll);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll, {once:true}); else initAll();
})();
