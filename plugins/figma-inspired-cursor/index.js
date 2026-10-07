/* Figma Inspired Cursor | Ghost Plugins | v1.2.5 | JavaScript */
(function () {
  'use strict';
  var SLUG = 'figma-inspired-cursor';
  var KEY = '__gpFigmaInspiredCursorRuntime';
  if (window[KEY]) return;
  window[KEY] = true;
  var cursor = null, tag = null, icon = null;
  var precise = window.matchMedia('(hover: hover) and (pointer: fine)');
  var html = document.documentElement;
  var current = {
    label: 'Ghost Plugins', color: '#000000', labelColor: '#000000', textColor: '#ffffff', cursorIcon: 'solid',
    iconSize: 40, hoverCursorIcon: 'open-hand', hoverIconSize: 40, hoverIconColor: '#000000',
    labelFill: true, labelShape: 'pill', labelOutline: 0, labelRadius: 0,
    labelPaddingX: 10, labelPaddingY: 6, labelFont: 'inherit', labelWeight: '600',
    labelStyle: 'normal', labelSize: 18, labelLineHeight: 1.2, labelLetterSpacing: 0,
    labelAlignment: 'left', labelTransform: 'none', labelDecoration: 'none', labelSpacing: 20, labelSpacingY: 20, iconFill: '', hoverIconFill: ''
  };
  var icons = {
    solid: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.92098 2.29927C6.93571 1.53286 5.5 2.23498 5.5 3.48325V20.492C5.5 21.9142 7.2945 22.538 8.17661 21.4224L12.3676 16.1222C12.6806 15.7264 13.1574 15.4956 13.6619 15.4956H20.5143C21.9425 15.4956 22.5626 13.6885 21.4353 12.8116L7.92098 2.29927Z" fill="currentColor"/></svg>',
    outline: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.48325C5.5 2.23498 6.93571 1.53286 7.92098 2.29927L21.4353 12.8116C22.5626 13.6885 21.9425 15.4956 20.5143 15.4956H13.6619C13.1574 15.4956 12.6806 15.7264 12.3676 16.1222L8.17661 21.4224C7.2945 22.538 5.5 21.9142 5.5 20.492L5.5 3.48325ZM20.5143 13.9956L7 3.48325L7 20.492L11.191 15.1918C11.7884 14.4363 12.6987 13.9956 13.6619 13.9956H20.5143Z" fill="currentColor"/></svg>',
    'open-hand': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>',
    'pointing-hand': '<svg stroke="currentColor" height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 20v-3a4 4 0 0 0-4-4h-1a1 1 0 0 1-1-1V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10l-2.4-3.2A2 2 0 0 0 6 12h-.382C4.724 12 4 12.724 4 13.618v0c0 .251.058.499.17.724L7 20"/></svg>'
  };
  function finite(value, fallback) { var n = Number(value); return value !== '' && isFinite(n) ? n : fallback; }
  function shapeRadius() {
    if (current.labelShape === 'pill') return '999px';
    if (current.labelShape === 'oval') return '50%';
    if (current.labelShape === 'leaf') return '0 ' + Math.max(finite(current.labelRadius, 0), 16) + 'px 0 ' + Math.max(finite(current.labelRadius, 0), 16) + 'px';
    return current.labelShape === 'rounded' ? finite(current.labelRadius, 0) + 'px' : '0';
  }
  function safeCustom(data) {
    if (typeof data !== 'string' || !/^data:image\/svg\+xml(?:;charset=[\w-]+)?,/i.test(data)) return '';
    try {
      var markup = decodeURIComponent(data.slice(data.indexOf(',') + 1));
      var doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
      if (doc.documentElement.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror,script,foreignObject,iframe,object,embed,style,animate,set')) return '';
      var all = [doc.documentElement].concat(Array.from(doc.documentElement.querySelectorAll('*')));
      for (var i = 0; i < all.length; i++) {
        var node = all[i];
        for (var j = node.attributes.length - 1; j >= 0; j--) {
          var attr = node.attributes[j];
          if (/^on/i.test(attr.name) || /^(href|xlink:href|style)$/i.test(attr.name) || /url\s*\(/i.test(attr.value)) node.removeAttribute(attr.name);
        }
      }
      return new XMLSerializer().serializeToString(doc.documentElement);
    } catch (_) { return ''; }
  }
  function hide() { if (cursor) cursor.hidden = true; html.classList.remove('fic-cursor-replaced'); }
  function renderIcon(hover) {
    var key = hover ? current.hoverCursorIcon : current.cursorIcon;
    var markup = key !== 'custom' && icons[key] ? icons[key] : safeCustom(hover ? current.hoverCursorSvg : current.cursorSvg);
    var fill = String((hover ? current.hoverIconFill : current.iconFill) || '');
    if (!/^(#[0-9a-fA-F]{3,8}|rgba?\([^)<>"]*\)|[a-zA-Z]+)$/.test(fill) || fill === 'transparent') fill = '';
    markup = markup || (hover ? icons['open-hand'] : icons.solid);
    if (fill && key === 'outline') markup = markup.replace('<path', '<path d="M7.92098 2.29927C6.93571 1.53286 5.5 2.23498 5.5 3.48325V20.492C5.5 21.9142 7.2945 22.538 8.17661 21.4224L12.3676 16.1222C12.6806 15.7264 13.1574 15.4956 13.6619 15.4956H20.5143C21.9425 15.4956 22.5626 13.6885 21.4353 12.8116L7.92098 2.29927Z" fill="' + fill + '"/><path');
    else if (fill && key === 'solid') markup = markup.replace('fill="currentColor"', 'fill="' + fill + '" stroke="currentColor" stroke-width="1"');
    else if (fill && !icons[key]) markup = markup.replace(/fill="[^"]*"/g, 'fill="' + fill + '"').replace(/<svg(?![^>]*\bfill=)/, '<svg fill="' + fill + '"');
    else if (fill && key !== 'custom') markup = markup.replace(/<svg([^>]*?)fill="none"/, '<svg$1fill="' + fill + '"');
    icon.innerHTML = markup;
    var size = Math.min(300, Math.max(8, finite(hover ? current.hoverIconSize : current.iconSize, 40)));
    icon.style.width = size + 'px'; icon.style.height = size + 'px';
    cursor.style.color = hover ? current.hoverIconColor : current.color;
  }
  function apply(cfg) {
    if (!cfg) return;
    Object.keys(current).concat(['cursorSvg', 'hoverCursorSvg']).forEach(function (key) {
      if (cfg[key] !== undefined && cfg[key] !== null) current[key] = cfg[key];
    });
    if (!cursor || !tag) return;
    tag.textContent = String(current.label);
    tag.hidden = !current.label;
    tag.style.backgroundColor = current.labelFill === false || current.labelFill === 'false' || current.labelShape === 'text' ? 'transparent' : current.labelColor;
    tag.style.color = current.textColor;
    tag.style.border = finite(current.labelOutline, 0) + 'px solid ' + current.labelColor;
    tag.style.borderRadius = shapeRadius();
    tag.style.padding = finite(current.labelPaddingY, 6) + 'px ' + finite(current.labelPaddingX, 10) + 'px';
    tag.style.fontFamily = current.labelFont === 'inherit' ? 'inherit' : String(current.labelFont);
    tag.style.fontWeight = String(current.labelWeight);
    tag.style.fontStyle = String(current.labelStyle);
    tag.style.fontSize = finite(current.labelSize, 18) + 'px';
    tag.style.lineHeight = String(current.labelLineHeight);
    tag.style.letterSpacing = finite(current.labelLetterSpacing, 0) + 'px';
    tag.style.textAlign = String(current.labelAlignment);
    tag.style.textTransform = String(current.labelTransform);
    tag.style.textDecoration = String(current.labelDecoration);
    renderIcon(false);
  }
  function saved() { var G = window.GhostPlugins; return G && G.configFor && G.configFor(document.documentElement, SLUG); }
  function configured(event) {
    var detail = event.detail || {};
    if (detail.pluginId !== SLUG || detail.block) return;
    apply(saved() || detail.merged || detail.config || detail.settings);
  }
  function move(event) {
    if (!precise.matches || event.pointerType === 'touch') { hide(); return; }
    if (!cursor || !tag || html.classList.contains('sqs-edit-mode-active')) { hide(); return; }
    var target = event.target;
    renderIcon(!!(target && target.closest && target.closest('a,button,[role="button"],input,select,textarea')));
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
    cursor.hidden = false;
    var bounds = tag.getBoundingClientRect();
    var gap = Math.max(0, finite(current.labelSpacing, 20));
    tag.style.left = event.clientX + 8 + gap + bounds.width > innerWidth - 8 ? (-bounds.width - gap) + 'px' : (8 + gap) + 'px';
    var gapY = finite(current.labelSpacingY, 20);
    tag.style.top = event.clientY + 20 + gapY + bounds.height > innerHeight - 8 ? (-bounds.height - Math.max(0, gapY)) + 'px' : (20 + gapY) + 'px';
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
    icon = document.createElement('span'); icon.className = 'fic-replacement-icon';
    tag = document.createElement('span'); tag.className = 'fic-replacement-label';
    cursor.appendChild(icon); cursor.appendChild(tag);
    document.body.appendChild(cursor);
    apply(saved() || {});
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
  document.addEventListener('mercury:load', function () { if (!cursor || !cursor.isConnected) { cursor = null; tag = null; icon = null; mount(); } });
})();
