
(function () {
  'use strict';
  var DEFAULTS = {
    videoUrl: 'https://www.youtube.com/watch?v=-i0xQKHmhO8',
    customIcon: '',
    autoplay: true,
    youtubeEmbedMode: 'standard',
    followStyle: 'smooth',
    cursorOffset: 28,
    idleDelay: 100,
    magneticSettle: true,
    fadingTrail: false,
    motionTilt: false,
    idlePulse: false,
    orbitRadius: 22,
    aspectRatioFallback: '16/9',
    closeStyle: 'circle'
  };
  var SELECTOR = '.gp-follow-me-play-button-lightbox';
  var SLUG = 'follow-me-play-button-lightbox';
  var instances = [];
  // A transform moving under a stationary cursor never re-runs the browser hit
  // test, so the settled play button keeps the normal cursor until the mouse
  // moves. Instances report whether they sit under the pointer and a shared
  // count keeps the pointer cursor on the document while any button does.
  var pointerClaims = 0;
  function claimPointer(on) {
    var next = Math.max(0, pointerClaims + (on ? 1 : -1));
    if (next === pointerClaims) return;
    pointerClaims = next;
    try { document.documentElement.style.cursor = next ? 'pointer' : ''; } catch (e) {}
  }
  var PLAY = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16" aria-hidden="true"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/></svg>';
  var CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke-linecap="round"/></svg>';
  function clamp(n, low, high) { return Math.max(low, Math.min(high, n)); }
  function num(value, fallback, low, high) { var n = parseFloat(value); return Number.isFinite(n) ? clamp(n, low, high) : fallback; }
  function yes(value) { return value === true || value === 'true'; }
  function videoInfo(value) {
    try {
      var u = new URL(String(value).trim()), host = u.hostname.toLowerCase().replace(/^www\./, ''), p = u.pathname.split('/').filter(Boolean), id;
      if (!['https:', 'http:'].includes(u.protocol)) return null;
      if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'youtu.be'].includes(host)) {
        id = host === 'youtu.be' ? p[0] : u.searchParams.get('v') || (['shorts', 'embed', 'live'].includes(p[0]) ? p[1] : '');
        return /^[\w-]{11}$/.test(id || '') ? { provider: 'youtube', id: id, shorts: p[0] === 'shorts', canonical: 'https://www.youtube.com/watch?v=' + id } : null;
      }
      if (['vimeo.com', 'player.vimeo.com'].includes(host)) {
        var index = p[0] === 'video' ? 1 : 0, hash = u.searchParams.get('h') || p[index + 1] || '';
        id = p[index]; if (!/^\d+$/.test(id || '')) return null;
        hash = /^[a-zA-Z0-9]+$/.test(hash) ? hash : '';
        return { provider: 'vimeo', id: id, hash: hash, canonical: 'https://vimeo.com/' + id + (hash ? '/' + hash : '') };
      }
    } catch (error) {}
    return null;
  }
  function iconValue(value) {
    if (value && typeof value === 'object') return value.icon || value.src || value.url || value.value || '';
    return typeof value === 'string' ? value : '';
  }
  function imageUrl(value) {
    try { var u = new URL(String(value), document.baseURI); return ['http:', 'https:', 'blob:'].includes(u.protocol) || /^data:image\/(svg\+xml|png|jpeg|webp|gif|avif);/i.test(String(value)) ? u.href : ''; } catch (error) { return ''; }
  }
  function inlineIcon(value) {
    try {
      var source = value;
      if (/^data:image\/svg\+xml[;,]/i.test(source)) {
        var comma = source.indexOf(','); source = /;base64/i.test(source.slice(0, comma)) ? atob(source.slice(comma + 1)) : decodeURIComponent(source.slice(comma + 1));
      }
      if (!/^\s*<svg[\s>]/i.test(source)) return null;
      var parsed = new DOMParser().parseFromString(source, 'image/svg+xml'), svg = parsed.documentElement;
      if (svg.localName !== 'svg' || parsed.querySelector('parsererror')) return null;
      var tags = ['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon'];
      var attrs = ['viewbox', 'width', 'height', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'points', 'fill', 'fill-rule', 'clip-rule', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'transform', 'opacity'];
      Array.from(svg.querySelectorAll('*')).forEach(function (n) { if (!tags.includes(n.localName)) n.remove(); });
      [svg].concat(Array.from(svg.querySelectorAll('*'))).forEach(function (n) {
        Array.from(n.attributes).forEach(function (a) { if (!attrs.includes(a.name.toLowerCase()) || /url\s*\(/i.test(a.value)) n.removeAttribute(a.name); });
        ['fill', 'stroke'].forEach(function (a) { var v = n.getAttribute(a); if (v && v !== 'none') n.setAttribute(a, 'currentColor'); });
      });
      svg.setAttribute('aria-hidden', 'true'); return document.importNode(svg, true);
    } catch (error) { return null; }
  }
  function configFor(root) {
    var local = {}, legacy = window.GhostPluginConfig || {};
    if (legacy[SLUG] && typeof legacy[SLUG] === 'object') legacy = legacy[SLUG];
    try { if (window.GhostPlugins && typeof window.GhostPlugins.configFor === 'function') local = window.GhostPlugins.configFor(root, SLUG) || {}; } catch (error) {}
    return Object.assign({}, DEFAULTS, legacy, local);
  }
  function spring(p, v, target, omega, dt) {
    var d = p - target, c = v + omega * d, decay = Math.exp(-omega * dt);
    return [target + (d + c * dt) * decay, (v - omega * c * dt) * decay];
  }
  function init(root, index) {
    var config = configFor(root), info = videoInfo(config.videoUrl), alive = true, opened = false, inside = false, focused = false;
    var parent = root.parentNode, next = root.nextSibling, originalTouch = root.getAttribute('data-touch');
    var events = [], raf = 0, idleTimer = 0, fetchTimer = 0, controller = new AbortController(), observer;
    var x = -250, y = -250, tx = x, ty = y, vx = 0, vy = 0, scale = 1, targetScale = 1, scaleVelocity = 0, lastTime = 0, phase = 0, resting = false;
    var player = null, playbackTimer = 0, handshakeTimer = 0, playerReady = false, playbackError = '';
    var lastX = null, lastY = null, restX = null, restY = null, keyboardMode = false, previousFocus = null;
    var forcedPointer = false;
    function setPointer(on) { if (on !== forcedPointer) { forcedPointer = on; claimPointer(on); } }
    var hover = matchMedia('(hover: hover) and (pointer: fine)'), reduced = matchMedia('(prefers-reduced-motion: reduce)'), touch = !hover.matches;
    var ratios = { '16/9': 16 / 9, '9/16': 9 / 16, '4/3': 4 / 3, '1/1': 1, '4/5': 4 / 5 };
    var ratio = info && info.shorts ? 9 / 16 : ratios[config.aspectRatioFallback] || 16 / 9;
    document.body.appendChild(root);
    function node(tag, className) { var n = document.createElement(tag); n.className = className; return n; }
    var ghosts = Array.from({ length: 5 }, function () { var n = node('span', 'gp-trail'); n.setAttribute('aria-hidden', 'true'); root.appendChild(n); return { node: n, x: x, y: y }; });
    var play = node('button', 'gp-play'), icon = node('span', 'gp-play-icon'), dialog = node('div', 'gp-dialog'), overlay = node('div', 'gp-overlay'), panel = node('div', 'gp-video'), close = node('button', 'gp-close');
    play.type = close.type = 'button'; play.hidden = true; play.setAttribute('aria-label', 'Play video'); play.setAttribute('aria-haspopup', 'dialog');
    dialog.hidden = true; dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true');
    dialog.id = SLUG + '-dialog-' + index; dialog.setAttribute('aria-label', 'Video player'); play.setAttribute('aria-controls', dialog.id);
    close.setAttribute('aria-label', 'Close video'); close.dataset.style = ['circle', 'square', 'minimal'].includes(config.closeStyle) ? config.closeStyle : 'circle'; close.innerHTML = CLOSE;
    icon.setAttribute('aria-hidden', 'true'); icon.innerHTML = PLAY;
    var value = iconValue(config.customIcon), inline = inlineIcon(value), custom = value ? imageUrl(value) : '', image;
    if (inline) icon.replaceChildren(inline);
    else if (custom) { image = document.createElement('img'); image.alt = ''; image.onerror = function () { if (alive) icon.innerHTML = PLAY; }; image.src = custom; icon.replaceChildren(image); }
    var status = node('div', 'gp-playback-status'), statusText = node('span', 'gp-playback-message'), details = node('pre', 'gp-playback-details'), watch = node('a', 'gp-watch-video');
    status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); details.hidden = true;
    watch.textContent = 'Open video'; watch.target = '_blank'; watch.rel = 'noopener'; watch.href = info ? info.canonical : '#';
    status.append(statusText, watch, details);
    play.appendChild(icon); dialog.append(overlay, panel, close, status); root.append(play, dialog);
    var followDuration = 320, iconSize = 64, restScale = 1.12;
    function on(target, name, fn, options) { target.addEventListener(name, fn, options); events.push(function () { target.removeEventListener(name, fn, options); }); }
    function css(name, fallback, low, high) { return num(getComputedStyle(root).getPropertyValue(name), fallback, low, high); }
    function measure() { root.dataset.touch = String(touch); followDuration = css('--follow-duration', 320, 0, 2000); restScale = css('--rest-scale', 1.12, 1, 1.5); iconSize = Math.max(touch ? 48 : 24, css('--play-icon-size', 64, 24, 200)); }
    function viewport() { return { width: document.documentElement.clientWidth || window.innerWidth, height: window.innerHeight }; }
    function fit() {
      var box = viewport(), styles = getComputedStyle(panel), border = num(styles.borderLeftWidth, 0, 0, 40) + num(styles.borderRightWidth, 0, 0, 40);
      var desired = css('--video-width', 1100, 160, 4000), width = Math.max(1, Math.min(desired - border, box.width - 32 - border, (box.height - 160 - border) * ratio));
      panel.style.width = (width + border) + 'px'; panel.style.height = (width / ratio + border) + 'px';
      if (player) { player.style.width = width + 'px'; player.style.height = (width / ratio) + 'px'; player.width = String(Math.round(width)); player.height = String(Math.round(width / ratio)); }
    }
    function paint() { play.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; icon.style.transform = 'scale(' + scale + ')'; }
    function wake() { if (alive && !raf) { lastTime = 0; raf = requestAnimationFrame(draw); } }
    function aim(a, b) { tx = a; ty = b; wake(); }
    function rest(value) { resting = value; if (value) { restX = lastX; restY = lastY; } phase = 0; targetScale = value ? restScale : 1; wake(); }
    function draw(time) {
      raf = 0; if (!alive) return;
      var dt = lastTime ? Math.min(.05, (time - lastTime) / 1000) : 1 / 60; lastTime = time;
      var ax = tx, ay = ty, animate = !reduced.matches && !touch;
      var orbit = animate && config.followStyle === 'orbit' && inside && !opened && !resting;
      if (orbit) { ax += Math.cos(time / 450) * num(config.orbitRadius, 22, 4, 100); ay += Math.sin(time / 450) * num(config.orbitRadius, 22, 4, 100); }
      if (!animate || !followDuration || config.followStyle === 'direct') { x = ax; y = ay; vx = vy = 0; scale = targetScale; scaleVelocity = 0; }
      else { var omega = (config.followStyle === 'float' ? 3.5 : 5) / Math.max(.08, followDuration / 1000), a = spring(x, vx, ax, omega, dt), b = spring(y, vy, ay, omega, dt), c = spring(scale, scaleVelocity, targetScale, 14, dt); x = a[0]; vx = a[1]; y = b[0]; vy = b[1]; scale = c[0]; scaleVelocity = c[1]; }
      phase += dt * 3;
      var pulse = animate && yes(config.idlePulse) && resting && inside && !opened;
      var tilt = animate && yes(config.motionTilt) && !resting ? clamp(vx * .025, -18, 18) : 0;
      play.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; icon.style.transform = 'scale(' + (scale + (pulse ? Math.sin(phase) * .025 : 0)) + ') rotate(' + tilt + 'deg)';
      setPointer(inside && !opened && !touch && lastX !== null && lastX >= x && lastX <= x + iconSize && lastY >= y && lastY <= y + iconSize);
      var gx = x, gy = y, trailMoving = false;
      ghosts.forEach(function (g, i) { var visible = animate && yes(config.fadingTrail) && inside && !opened, blend = 1 - Math.exp(-dt / .055), size = iconSize * (.2 - i * .025); g.x += (gx - g.x) * blend; g.y += (gy - g.y) * blend; var distance = Math.hypot(x - g.x, y - g.y); g.node.style.width = g.node.style.height = size + 'px'; g.node.style.opacity = visible ? Math.min(.22, distance / 200) * (1 - i / 6) : 0; g.node.style.transform = 'translate3d(' + (g.x + iconSize / 2 - size / 2) + 'px,' + (g.y + iconSize / 2 - size / 2) + 'px,0)'; if (visible && distance > .2) trailMoving = true; gx = g.x; gy = g.y; });
      var moving = Math.abs(ax - x) + Math.abs(ay - y) + Math.abs(vx) + Math.abs(vy) > .02 || Math.abs(targetScale - scale) + Math.abs(scaleVelocity) > .001;
      if (moving || pulse || orbit || trailMoving) raf = requestAnimationFrame(draw); else lastTime = 0;
    }
    function dock() { setPointer(false); measure(); var box = viewport(), step = index * (iconSize + 12); play.hidden = !info || opened; x = tx = Math.max(12, box.width - iconSize - 24 - step); y = ty = Math.max(12, box.height - iconSize - 24); vx = vy = 0; scale = targetScale = 1; paint(); }
    function hide() { setPointer(false); inside = false; lastX = lastY = null; clearTimeout(idleTimer); rest(false); if (touch || (focused && keyboardMode)) { if (!opened) dock(); return; } play.hidden = true; x = tx = y = ty = -iconSize * 3; vx = vy = 0; ghosts.forEach(function (g) { g.node.style.opacity = 0; }); paint(); }
    function touchMode() { setPointer(false); if (touch) return; touch = true; hide(); measure(); if (!opened) dock(); }
    function move(e) {
      if (opened || !info) return;
      if (e.pointerType === 'touch' || e.pointerType === 'pen') { touchMode(); return; }
      if (e.pointerType !== 'mouse' || (focused && keyboardMode)) return;
      if (touch) { touch = false; measure(); }
      if (inside && e.clientX === lastX && e.clientY === lastY) return;
      if (resting && yes(config.magneticSettle) && restX !== null && Math.hypot(e.clientX - restX, e.clientY - restY) < 8) {
        lastX = e.clientX; lastY = e.clientY; aim(lastX - iconSize / 2, lastY - iconSize / 2); return;
      }
      if (inside && !resting && Math.hypot(e.clientX - lastX, e.clientY - lastY) < .25) return;
      var fresh = !inside, box = viewport(), px = e.clientX, py = e.clientY, offset = num(config.cursorOffset, 28, 0, 160);
      lastX = px; lastY = py; inside = true; play.hidden = false; rest(false);
      tx = clamp(px + offset, 4, Math.max(4, box.width - iconSize - 4)); ty = clamp(py + offset, 4, Math.max(4, box.height - iconSize - 4));
      if (fresh) { x = tx; y = ty; vx = vy = 0; ghosts.forEach(function (g) { g.x = x; g.y = y; }); paint(); }
      wake(); clearTimeout(idleTimer); idleTimer = setTimeout(function () { if (!alive || !inside || opened || (focused && keyboardMode)) return; if (yes(config.magneticSettle)) aim(px - iconSize / 2, py - iconSize / 2); rest(true); }, num(config.idleDelay, 100, 0, 2000));
    }
    function report(message, error) {
      if (!opened || !alive) return;
      status.hidden = false; statusText.textContent = message;
      if (error) {
        playbackError = error;
        var rect = player && player.getBoundingClientRect ? player.getBoundingClientRect() : { width: 0, height: 0 };
        var sandbox = 'unavailable';
        try { sandbox = window.frameElement ? window.frameElement.getAttribute('sandbox') || 'none' : 'top-level'; } catch (e) {}
        var policy = document.permissionsPolicy || document.featurePolicy, autoplayAllowed = 'unknown';
        try { if (policy && policy.allowsFeature) autoplayAllowed = String(policy.allowsFeature('autoplay')); } catch (e) {}
        details.hidden = false;
        details.textContent = 'Plugin 1.0.3 | ' + error + '\nProvider: ' + (info ? info.provider : 'none') + '\nPlayer size: ' + Math.round(rect.width) + ' × ' + Math.round(rect.height) + '\nFrame connected: ' + !!(player && player.isConnected) + '\nAutoplay allowed: ' + autoplayAllowed + '\nSandbox: ' + sandbox;
      }
    }
    function clearPlaybackTimers() { clearTimeout(playbackTimer); clearInterval(handshakeTimer); playbackTimer = handshakeTimer = 0; }
    function readyPlayer() { if (!opened) return; playerReady = true; clearPlaybackTimers(); status.hidden = true; }
    function handshake() {
      if (!opened || !player || !player.contentWindow || !info) return;
      var origin = info.provider === 'youtube' ? (config.youtubeEmbedMode === 'privacy' ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com') : 'https://player.vimeo.com';
      try {
        if (info.provider === 'youtube') {
          player.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: dialog.id }), origin);
          ['onReady', 'onError', 'onStateChange'].forEach(function (event) { player.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: [event], id: dialog.id }), origin); });
        } else player.contentWindow.postMessage(JSON.stringify({ method: 'ping' }), origin);
      } catch (error) {}
    }
    function shut(restore) {
      if (!opened) return; opened = false; clearPlaybackTimers(); if (player) { player.onload = player.onerror = null; } panel.replaceChildren(); player = null; dialog.hidden = true;
      if (restore && previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
      if (touch || (focused && keyboardMode)) dock(); else hide();
    }
    function open() {
      if (!info || opened) return;
      instances.forEach(function (instance) { instance.close(false); });
      previousFocus = document.activeElement; opened = true; playerReady = false; playbackError = ''; clearTimeout(idleTimer); rest(false); play.hidden = true; setPointer(false);
      player = document.createElement('iframe'); var autoplay = yes(config.autoplay) ? '1' : '0';
      player.style.cssText = 'display:block;position:relative;visibility:visible;opacity:1;max-width:none;max-height:none;border:0'; player.loading = 'eager';
      player.title = 'Video player'; player.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; player.allowFullscreen = true; player.referrerPolicy = 'strict-origin-when-cross-origin';
      player.src = info.provider === 'youtube' ? (config.youtubeEmbedMode === 'privacy' ? 'https://www.youtube-nocookie.com/embed/' : 'https://www.youtube.com/embed/') + info.id + '?autoplay=' + autoplay + '&playsinline=1&controls=1&enablejsapi=1&rel=0' : 'https://player.vimeo.com/video/' + info.id + '?autoplay=' + autoplay + '&playsinline=1' + (info.hash ? '&h=' + encodeURIComponent(info.hash) : '');
      player.onload = function () { if (!alive || !opened || playerReady || playbackError) return; report('Video frame loaded. Connecting to player…'); handshake(); };
      player.onerror = function () { report('Studio could not load the video frame.', 'FRAME_LOAD_FAILED'); };
      dialog.hidden = false; details.hidden = true; status.hidden = false; fit(); panel.replaceChildren(player); report('Connecting to video…'); close.focus({ preventScroll: true });
      handshakeTimer = setInterval(handshake, 500);
      playbackTimer = setTimeout(function () { if (!playerReady && !playbackError) { clearInterval(handshakeTimer); report('The player did not respond. Open the video or share the details below.', 'PLAYER_NO_RESPONSE'); } }, 10000);
    }
    on(play, 'click', open); on(close, 'click', function () { shut(true); }); on(overlay, 'click', function () { shut(true); });
    on(dialog, 'keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); shut(true); }
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === close) { e.preventDefault(); if (!status.hidden) watch.focus(); else if (player) player.focus(); }
        else if (!e.shiftKey && document.activeElement === close && player) { e.preventDefault(); player.focus(); }
        else if (!e.shiftKey && document.activeElement === watch) { e.preventDefault(); close.focus(); }
      }
    });
    on(document, 'focusin', function (e) { if (opened && !dialog.contains(e.target)) close.focus({ preventScroll: true }); });
    on(window, 'message', function (e) {
      if (!opened || !player || e.source !== player.contentWindow || !['https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://player.vimeo.com'].includes(e.origin)) return;
      var data; try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (error) { return; }
      if (!data || typeof data !== 'object') return;
      if (data.event === 'onError' || data.event === 'error') { clearPlaybackTimers(); var code = data.info || (data.data && data.data.message) || 'PROVIDER_ERROR'; report('The video provider reported an error: ' + code, 'PROVIDER_' + code); return; }
      if (data.event === 'onReady' || data.event === 'initialDelivery' || data.event === 'infoDelivery' || data.event === 'ready' || data.method === 'ping' || data.event === 'onStateChange') readyPlayer();
    });
    on(document, 'securitypolicyviolation', function (e) {
      if (!opened || !player || !/frame-src|child-src|default-src/.test(e.effectiveDirective || '')) return;
      var blocked = String(e.blockedURI || ''); if (!/youtube|vimeo/.test(blocked)) return;
      clearPlaybackTimers(); report('Studio is blocking the video embed. Its preview policy needs to allow this video provider.', 'STUDIO_FRAME_POLICY_BLOCKED');
    });
    on(document, 'pointermove', move, { passive: true }); on(document, 'pointerdown', function (e) { keyboardMode = false; if (e.pointerType === 'touch' || e.pointerType === 'pen') touchMode(); }, { passive: true });
    function leaveViewport(e) { var box = viewport(); if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= box.width || e.clientY >= box.height) hide(); }
    on(document.documentElement, 'pointerleave', leaveViewport); on(document, 'pointerout', function (e) { if (!e.relatedTarget) leaveViewport(e); }); on(window, 'blur', hide);
    on(document, 'visibilitychange', function () { if (document.hidden) hide(); });
    on(play, 'focus', function () { focused = true; clearTimeout(idleTimer); if (!opened && (keyboardMode || touch || !inside)) dock(); }); on(play, 'blur', function () { focused = false; if (!opened && !touch) hide(); });
    on(document, 'keydown', function (e) { if (e.key === 'Tab' && !opened && info) { keyboardMode = true; dock(); } }, true);
    on(hover, 'change', function () { touch = !hover.matches; measure(); hide(); }); on(reduced, 'change', function () { wake(); });
    on(window, 'resize', function () { measure(); fit(); if (touch || (focused && keyboardMode)) dock(); else if (!opened) hide(); }, { passive: true });
    on(document, 'wheel', function (e) { if (opened && !panel.contains(e.target)) e.preventDefault(); }, { passive: false });
    observer = new ResizeObserver(function () { measure(); if (opened) fit(); else if (touch || (focused && keyboardMode)) dock(); }); observer.observe(root);
    measure(); if (touch) dock();
    if (info && !info.shorts) {
      fetchTimer = setTimeout(function () { controller.abort(); }, 6000);
      var endpoint = info.provider === 'youtube' ? 'https://www.youtube.com/oembed?format=json&url=' : 'https://vimeo.com/api/oembed.json?url=';
      fetch(endpoint + encodeURIComponent(info.canonical), { signal: controller.signal, credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error('Metadata unavailable'); return r.json(); }).then(function (data) {
        if (!alive) return; var w = Number(data.width), h = Number(data.height), value = w / h;
        if (w > 0 && h > 0 && value >= .1 && value <= 10) { var standard = Object.values(ratios).find(function (r) { return Math.abs(r - value) / r < .005; }); ratio = standard || value; if (opened) fit(); }
      }).catch(function () {}).finally(function () { clearTimeout(fetchTimer); });
    }
    return { close: shut, destroy: function () { setPointer(false); alive = false; clearPlaybackTimers(); if (player) { player.onload = player.onerror = null; } events.forEach(function (off) { off(); }); controller.abort(); clearTimeout(fetchTimer); clearTimeout(idleTimer); cancelAnimationFrame(raf); observer.disconnect(); shut(false); if (image) image.onerror = null; play.remove(); dialog.remove(); ghosts.forEach(function (g) { g.node.remove(); }); if (originalTouch === null) root.removeAttribute('data-touch'); else root.setAttribute('data-touch', originalTouch); if (parent && parent.isConnected) parent.insertBefore(root, next && next.parentNode === parent ? next : null); } };
  }
  function initAll() {
    if (!document.body) return;
    instances.forEach(function (instance) { instance.destroy(); }); instances = [];
    var roots = Array.from(document.querySelectorAll(SELECTOR));
    if (!roots.length) { var root = document.createElement('div'); root.className = SELECTOR.slice(1); root.setAttribute('data-gp-preset', ''); document.body.appendChild(root); roots.push(root); }
    roots.forEach(function (root, index) { instances.push(init(root, index)); });
  }
  if (window.GhostFollowMePlayButtonLightbox && typeof window.GhostFollowMePlayButtonLightbox.destroy === 'function') window.GhostFollowMePlayButtonLightbox.destroy();
  function ready() { initAll(); }
  window.GhostFollowMePlayButtonLightbox = { initAll: initAll, destroy: function () { instances.forEach(function (instance) { instance.destroy(); }); instances = []; document.removeEventListener('ghost:config', ready); document.removeEventListener('DOMContentLoaded', ready); } };
  document.addEventListener('ghost:config', ready);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true }); else initAll();
})();
