/* Doodle Pen, Ghost Plugins  v1.1.0
   Lets visitors draw and doodle inside a Code Block on your Squarespace site. */
(function () {
  "use strict";

  var DEFAULTS = {
    background: "transparent", // canvas background colour
    lineColor: "#111111",      // pen line colour
    lineStyle: "solid",        // solid | hand-drawn | dashed | dotted
    lineWidth: 4,              // pen line width in px
    cursorPreset: "brush",       // pen | pencil | brush | marker
    cursorSvg: "",             // custom cursor SVG markup or image URL (overrides preset)
    cursorSize: 50,            // cursor size in px
    cursorColor: "#111111",    // colour applied to the preset cursors
    minWidth: 768
  };

  var CURSORS = {
    pen:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>' +
      '<path d="m15 5 4 4"/>' +
      "</svg>",
    pencil:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">' +
      '<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>' +
      "</svg>",
    brush:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">' +
      '<path d="M7.49478 13.753C10.5833 10.1644 17.5788 3.15478 20.5387 3.00445C22.3699 2.82906 18.7218 9.32547 10.0785 16.4339M11.4581 10.0449L13.7157 12.3249M3 20.8546C3.70948 18.3472 3.26187 19.5794 3.50407 16.6919C3.63306 16.2644 3.89258 14.9377 5.51358 14.2765C7.35618 13.5249 8.70698 14.6611 9.05612 15.195C10.0847 16.3102 10.2039 17.6952 9.05612 19.2774C7.9083 20.8596 4.50352 21.2527 3 20.8546Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>",
    marker:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">' +
      '<path d="M230.64,25.36a32,32,0,0,0-45.26,0q-.21.21-.42.45L131.55,88.22,121,77.64a24,24,0,0,0-33.95,0l-76.69,76.7a8,8,0,0,0,0,11.31l80,80a8,8,0,0,0,11.31,0L178.36,169a24,24,0,0,0,0-33.95l-10.58-10.57L230.19,71c.15-.14.31-.28.45-.43A32,32,0,0,0,230.64,25.36ZM96,228.69,79.32,212l22.34-22.35a8,8,0,0,0-11.31-11.31L68,200.68,55.32,188l22.34-22.35a8,8,0,0,0-11.31-11.31L44,176.68,27.31,160,72,115.31,140.69,184ZM219.52,59.1l-68.71,58.81a8,8,0,0,0-.46,11.74L167,146.34a8,8,0,0,1,0,11.31l-15,15L83.32,104l15-15a8,8,0,0,1,11.31,0l16.69,16.69a8,8,0,0,0,11.74-.46L196.9,36.48A16,16,0,0,1,219.52,59.1Z"/>' +
      "</svg>"
  };

  function cfg(root) {
    var global = window.DoodlePenConfig || {};
    var live = (window.GhostPlugins && window.GhostPlugins.config &&
      window.GhostPlugins.config["doodle-pen"]) || {};
    var out = {};
    for (var k in DEFAULTS) if (Object.prototype.hasOwnProperty.call(DEFAULTS, k)) out[k] = DEFAULTS[k];
    [global, live].forEach(function (src) {
      for (var k in out) if (src[k] !== undefined && src[k] !== null && src[k] !== "") out[k] = src[k];
    });
    // data-* attributes on the wrapper win over everything.
    for (var key in out) {
      var attr = root.getAttribute("data-" + key.replace(/[A-Z]/g, function (c) { return "-" + c.toLowerCase(); }));
      if (attr !== null && attr !== "") out[key] = attr;
    }
    return out;
  }

  function num(v, fallback) {
    var n = parseFloat(v);
    return isNaN(n) ? fallback : n;
  }

  function dashFor(style, width) {
    if (style === "dashed") return [width * 4, width * 3];
    if (style === "dotted") return [0.1, width * 2.4];
    return [];
  }

  // Deterministic pseudo-random so a hand-drawn stroke does not shimmer.
  function jitter(seed) {
    var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return (x - Math.floor(x)) - 0.5;
  }

  function init(root) {
    if (!root || root.getAttribute("data-dp-ready") === "1") return;
    root.setAttribute("data-dp-ready", "1");
    var o = cfg(root);

    root.style.setProperty("--dp-bg", String(o.background || "transparent"));
    root.style.setProperty("--dp-cursor-size", num(o.cursorSize, 28) + "px");

    var canvas = document.createElement("canvas");
    canvas.className = "gh-doodle__canvas";
    root.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var cursor = document.createElement("div");
    cursor.className = "gh-doodle__cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.style.color = String(o.cursorColor || "#111111");
    var customCursor = String(o.cursorSvg || "").trim();
    if (customCursor) {
      if (/^https?:|^\/\//.test(customCursor)) {
        var img = document.createElement("img");
        img.src = customCursor;
        img.alt = "";
        cursor.appendChild(img);
      } else {
        cursor.innerHTML = customCursor;
      }
    } else {
      cursor.innerHTML = CURSORS[String(o.cursorPreset || "pen")] || CURSORS.pen;
    }
    root.appendChild(cursor);

    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var drawing = false;
    var last = null;
    var strokeSeed = 0;

    function enabled() {
      return window.innerWidth >= num(o.minWidth, 768) &&
        window.matchMedia("(pointer: fine)").matches;
    }

    function resize() {
      var rect = root.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width));
      var h = Math.max(1, Math.round(rect.height));
      var snapshot = null;
      if (canvas.width > 0 && canvas.height > 0) {
        snapshot = document.createElement("canvas");
        snapshot.width = canvas.width;
        snapshot.height = canvas.height;
        snapshot.getContext("2d").drawImage(canvas, 0, 0);
      }
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      if (snapshot) ctx.drawImage(snapshot, 0, 0);
    }

    function pos(e) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr
      };
    }

    function segment(a, b) {
      var width = num(o.lineWidth, 4) * dpr;
      var style = String(o.lineStyle || "solid");
      ctx.strokeStyle = String(o.lineColor || "#111111");
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (style === "hand-drawn") {
        // Sketch effect: two wobbly passes with deterministic jitter.
        for (var pass = 0; pass < 2; pass++) {
          ctx.setLineDash([]);
          ctx.globalAlpha = pass === 0 ? 0.85 : 0.35;
          ctx.beginPath();
          var steps = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / (6 * dpr)));
          for (var i = 0; i <= steps; i++) {
            var t = i / steps;
            var jx = jitter(strokeSeed + pass * 91 + i) * width * 0.9;
            var jy = jitter(strokeSeed + pass * 57 + i * 3) * width * 0.9;
            var x = a.x + (b.x - a.x) * t + jx;
            var y = a.y + (b.y - a.y) * t + jy;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      } else {
        ctx.setLineDash(dashFor(style, width));
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    function onDown(e) {
      if (!enabled() || (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen")) return;
      drawing = true;
      strokeSeed = Math.random() * 1000;
      last = pos(e);
      segment(last, { x: last.x + 0.01, y: last.y + 0.01 });
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    }
    function onMove(e) {
      var p = { x: e.clientX, y: e.clientY };
      var rect = root.getBoundingClientRect();
      cursor.style.transform =
        "translate(" + (p.x - rect.left) + "px," + (p.y - rect.top) + "px)";
      cursor.classList.add("is-visible");
      if (!drawing || !last) return;
      var np = pos(e);
      segment(last, np);
      last = np;
    }
    function onUp() { drawing = false; last = null; }
    function onLeave() { cursor.classList.remove("is-visible"); }

    canvas.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    root.addEventListener("pointerleave", onLeave);

    var ro = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(function () { resize(); });
      ro.observe(root);
    } else {
      window.addEventListener("resize", resize);
    }
    resize();
    root.classList.add("gh-ready");
  }

  function boot() {
    document.querySelectorAll("[data-doodle], .gh-doodle").forEach(init);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("ghost:config", boot);
  window.DoodlePen = { init: boot, cursors: CURSORS };
})();
