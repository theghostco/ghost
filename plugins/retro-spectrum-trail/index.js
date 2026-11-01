(function () {
  "use strict";
  var DEFAULTS = { enabled: true, colorCount: 5, trailPoints: 22, followSpeed: 0.32, enableTouch: false, showIdleDot: true, borderStyle: "none" };
  var SLUG = "retro-spectrum-trail";
  var SELECTOR = ".gp-retro-spectrum-trail";
  var NS = "http://www.w3.org/2000/svg";
  var BORDER_STYLES = ["none", "solid", "dashed", "dotted", "double"];
  var instances = new Map();
  var disposed = false;
  if (window.GhostRetroSpectrumTrail && window.GhostRetroSpectrumTrail.destroy) window.GhostRetroSpectrumTrail.destroy();
  function bool(v, d) { return v === true || v === "true" ? true : v === false || v === "false" ? false : d; }
  function num(v, d, a, b) { v = Number(v); return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : d; }
  function initialize(root) {
    var global = window.GhostPluginConfig || {}, local = {};
    if (window.GhostPlugins && typeof window.GhostPlugins.configFor === "function") {
      try { local = window.GhostPlugins.configFor(root, SLUG) || {}; } catch (error) { local = {}; }
    }
    var c = Object.assign({}, DEFAULTS, global, local);
    var enabled = bool(c.enabled, true), touch = bool(c.enableTouch, false), idle = bool(c.showIdleDot, true);
    var colorCount = Math.round(num(c.colorCount, 5, 1, 5));
    var count = Math.round(num(c.trailPoints, 22, 8, 80)), speed = num(c.followSpeed, 0.32, 0.05, 0.8);
    // Trail border: style comes from config, color and width from CSS variables
    // (--trail-border-color, --trail-border-width) so saved presets style the
    // outline without a plugin restart. "double" falls back to solid: SVG
    // strokes cannot paint the transparent gap a true double border needs.
    var borderStyle = String(c.borderStyle || "none").toLowerCase();
    if (BORDER_STYLES.indexOf(borderStyle) < 0 || borderStyle === "double") borderStyle = borderStyle === "double" ? "solid" : "none";
    BORDER_STYLES.forEach(function (s) { root.classList.remove("gp-border-" + s); });
    root.classList.add("gp-border-" + borderStyle);
    var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var listeners = [], points = [], paths = [], outlines = [], lengths = [], frame = 0, last = 0;
    var x = 0, y = 0, inside = false, touchId = null, initialized = false;
    var svg = document.createElementNS(NS, "svg");
    svg.classList.add("gp-trail-svg"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
    svg.setAttribute("preserveAspectRatio", "none");
    root.setAttribute("aria-hidden", "true");
    for (var i = 0; i < colorCount; i++) {
      var outline = document.createElementNS(NS, "path"); outline.classList.add("gp-trail-outline");
      svg.appendChild(outline); outlines.push(outline);
      var path = document.createElementNS(NS, "path"); path.classList.add("gp-trail-path"); path.classList.add("gp-trail-color-" + (i + 1));
      svg.appendChild(path); paths.push(path); lengths.push(Math.max(2, Math.round(count - i * (count - 4) / Math.max(1, colorCount - 1))));
    }
    root.appendChild(svg);
    function on(target, event, fn, options) {
      target.addEventListener(event, fn, options);
      listeners.push(function () { target.removeEventListener(event, fn, options); });
    }
    function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }
    function reset(px, py) {
      x = px; y = py; points = [];
      for (var j = 0; j < count; j++) points.push({ x: x, y: y });
      initialized = true;
    }
    function draw() {
      paths.forEach(function (path, layer) {
        var d = "";
        for (var j = 0; j < lengths[layer]; j++) d += (j ? " L " : "M ") + points[j].x.toFixed(2) + " " + points[j].y.toFixed(2);
        path.setAttribute("d", d);
        outlines[layer].setAttribute("d", d);
      });
    }
    function measure() {
      var box = root.getBoundingClientRect();
      var w = Math.max(1, box.width || window.innerWidth || 1), h = Math.max(1, box.height || window.innerHeight || 1);
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      if (!initialized) reset(w / 2, h / 2);
      draw();
    }
    function tick(time) {
      frame = 0;
      if (!enabled || motion.matches || document.hidden || root.hidden) return;
      var dt = last ? Math.min(50, time - last) : 16.667;
      var amount = 1 - Math.pow(1 - speed, dt / 16.667), distance = 0;
      last = time;
      for (var j = 0; j < count; j++) {
        var dest = j ? points[j - 1] : { x: x, y: y };
        points[j].x += (dest.x - points[j].x) * amount;
        points[j].y += (dest.y - points[j].y) * amount;
        distance = Math.max(distance, Math.abs(points[j].x - x), Math.abs(points[j].y - y));
      }
      if (distance < 0.08) {
        reset(x, y); draw(); last = 0;
        if (!inside || !idle) root.hidden = true;
        return;
      }
      draw(); frame = requestAnimationFrame(tick);
    }
    function move(e) {
      if (!enabled || motion.matches || document.hidden || e.isPrimary === false) return;
      if (e.pointerType === "touch" && (!touch || touchId !== e.pointerId)) return;
      var rect = root.getBoundingClientRect(), px = e.clientX - rect.left, py = e.clientY - rect.top;
      if (root.hidden) { root.hidden = false; measure(); rect = root.getBoundingClientRect(); px = e.clientX - rect.left; py = e.clientY - rect.top; reset(px, py); }
      x = px; y = py; inside = true; draw();
      if (!frame) { last = 0; frame = requestAnimationFrame(tick); }
    }
    function leave() { inside = false; if (!frame) root.hidden = true; }
    function hide() { stop(); root.hidden = true; inside = false; touchId = null; }
    function motionChange() {
      stop(); initialized = false; root.hidden = !enabled || motion.matches || !idle;
      if (!root.hidden) measure();
    }
    root.hidden = !enabled || motion.matches || !idle;
    measure();
    on(window, "pointermove", move, { passive: true });
    on(window, "pointerdown", function (e) { if (touch && e.pointerType === "touch" && e.isPrimary !== false) { touchId = e.pointerId; move(e); } }, { passive: true });
    function endTouch(e) { if (touchId === e.pointerId) { touchId = null; leave(); } }
    on(window, "pointerup", endTouch, { passive: true }); on(window, "pointercancel", endTouch, { passive: true });
    on(document.documentElement, "pointerleave", leave); on(window, "blur", hide);
    on(document, "visibilitychange", function () { if (document.hidden) hide(); });
    on(window, "resize", measure, { passive: true });
    if (motion.addEventListener) on(motion, "change", motionChange);
    else { motion.addListener(motionChange); listeners.push(function () { motion.removeListener(motionChange); }); }
    var observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (observer) observer.observe(root);
    return function () { stop(); listeners.forEach(function (off) { off(); }); if (observer) observer.disconnect(); svg.remove(); root.hidden = false; };
  }
  function initAll() {
    if (disposed || !document.body) return;
    instances.forEach(function (cleanup) { cleanup(); }); instances.clear();
    if (!document.querySelector(SELECTOR)) {
      var root = document.createElement("div"); root.className = "gp-retro-spectrum-trail";
      root.setAttribute("data-gp-preset", "default"); root.setAttribute("data-gp-generated", "true"); document.body.appendChild(root);
    }
    document.querySelectorAll(SELECTOR).forEach(function (root) { instances.set(root, initialize(root)); });
  }
  function destroy() {
    disposed = true; document.removeEventListener("ghost:config", initAll); document.removeEventListener("DOMContentLoaded", initAll);
    instances.forEach(function (cleanup, root) { cleanup(); if (root.getAttribute("data-gp-generated") === "true") root.remove(); }); instances.clear();
  }
  window.GhostRetroSpectrumTrail = { initAll: initAll, destroy: destroy };
  document.addEventListener("ghost:config", initAll);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll, { once: true }); else initAll();
})();
