(function () {
  'use strict';
  var SLUG = 'figma-inspired-cursor';
  var KEY = '__gpFigmaInspiredCursorRuntime';
  if (window[KEY]) return;
  window[KEY] = true;
  var cursor = null, tag = null;
  var precise = window.matchMedia('(hover: hover) and (pointer: fine)');
  var html = document.documentElement;
  var current = { label: 'Ghost Plugins', color: '#000000', textColor: '#ffffff' };

  function hide() {
    if (cursor) cursor.hidden = true;
    html.classList.remove('fic-cursor-replaced');
  }
  function apply(cfg) {
    if (!cfg) return;
    ['label', 'color', 'textColor'].forEach(function (key) {
      if (cfg[key] !== undefined && cfg[key] !== null) current[key] = String(cfg[key]);
    });
    if (!cursor || !tag) return;
    cursor.style.setProperty('--fic-color', current.color);
    cursor.style.setProperty('--fic-text-color', current.textColor);
    tag.textContent = current.label;
    tag.hidden = !current.label;
  }
  function saved() {
    var G = window.GhostPlugins;
    return G && G.configFor && G.configFor(document.documentElement, SLUG);
  }
  function configured(event) {
    var detail = event.detail || {};
    if (detail.pluginId !== SLUG || detail.block) return;
    apply(saved() || detail.merged || detail.config || detail.settings);
  }
  function move(event) {
    if (!precise.matches || event.pointerType === 'touch') { hide(); return; }
    if (!cursor || !tag) return;
    cursor.style.left = (event.clientX - 2) + 'px';
    cursor.style.top = (event.clientY - 2) + 'px';
    cursor.hidden = false;
    var bounds = tag.getBoundingClientRect();
    tag.style.left = event.clientX + 16 + bounds.width > innerWidth - 8 ? (-bounds.width - 8) + 'px' : '16px';
    tag.style.top = event.clientY + 28 + bounds.height > innerHeight - 8 ? (-bounds.height - 8) + 'px' : '28px';
    html.classList.add('fic-cursor-replaced');
  }
  function leave(event) { if (!event.relatedTarget) hide(); }
  function visibility() { if (document.hidden) hide(); }
  function down(event) { if (event.pointerType === 'touch') hide(); }
  function mount() {
    if (cursor || !document.body) return;
    cursor = document.createElement('div');
    cursor.className = 'fic-replacement';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.hidden = true;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 36 42');
    svg.setAttribute('focusable', 'false');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M3 3L32 19L19 23L13 37Z');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('stroke', 'white');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    tag = document.createElement('span');
    tag.className = 'fic-replacement-label';
    cursor.appendChild(svg);
    cursor.appendChild(tag);
    document.body.appendChild(cursor);
    apply(saved());
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave);
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointercancel', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('resize', hide);
    document.addEventListener('visibilitychange', visibility);
    precise.addEventListener('change', hide);
    document.addEventListener('ghost:config', configured);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
  document.addEventListener('mercury:load', function () { if (!cursor || !cursor.isConnected) { cursor = null; tag = null; mount(); } });
})();
