/* Doodle Pen | Ghost Plugins | v1.4.0 | JavaScript */
(function () {
  "use strict";

  var DEFAULTS = {
    lineColor: "#111111",      // pen line color
    lineStyle: "solid",        // solid | hand-drawn | dashed | dotted
    lineWidth: 6,              // pen line width in px
    fadeAway: false,           // fade starts two seconds after stroke ends, then lasts four seconds
    cursorPreset: "pen",       // seven built-in icons or custom
    cursorSize: 64,            // cursor size in px
    cursorColor: "#111111",    // color applied to the preset cursors
    cursorSvg: "",             // self-contained Icon Library image or legacy hosted cursor
    sizeMode: "block"          // block = stays in its Code Block | section = fills the page section
  };

  var CURSORS = {
    pen: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7566 2.62145C16.5852 0.792851 19.5499 0.792851 21.3785 2.62145C23.2071 4.45005 23.2071 7.41479 21.3785 9.24339L11.8932 18.7287C11.3513 19.2706 11.0323 19.5897 10.6774 19.8665C10.2591 20.1927 9.80652 20.4725 9.32763 20.7007C8.92133 20.8943 8.49331 21.037 7.7662 21.2793L4.43508 22.3897L3.633 22.6571C2.98244 22.8739 2.26519 22.7046 1.78029 22.2197C1.29539 21.7348 1.12607 21.0175 1.34293 20.367L2.72065 16.2338C2.96299 15.5067 3.10565 15.0787 3.29929 14.6724C3.52752 14.1935 3.80724 13.7409 4.1335 13.3226C4.41032 12.9677 4.72936 12.6487 5.27134 12.1067L14.7566 2.62145ZM4.40048 20.8201L7.242 19.8729C8.03311 19.6092 8.36924 19.4958 8.6823 19.3466C9.06284 19.1653 9.42249 18.943 9.75489 18.6837C10.0283 18.4704 10.2801 18.2205 10.8698 17.6308L18.4392 10.0614C17.6506 9.78321 16.6346 9.26763 15.6835 8.31651C14.7324 7.36538 14.2168 6.34939 13.9386 5.56075L6.36914 13.1302C5.77948 13.7199 5.52956 13.9716 5.31627 14.2451C5.05701 14.5775 4.83473 14.9371 4.65337 15.3177C4.50418 15.6307 4.39077 15.9669 4.12706 16.758L3.17989 19.5995L4.40048 20.8201ZM15.1553 4.34404C15.1895 4.519 15.2473 4.75684 15.3438 5.03487C15.561 5.66083 15.9712 6.48288 16.7441 7.25585C17.5171 8.02881 18.3392 8.43903 18.9651 8.6562C19.2431 8.75266 19.481 8.81046 19.6559 8.84466L20.3179 8.18272C21.5607 6.93991 21.5607 4.92492 20.3179 3.68211C19.0751 2.4393 17.0601 2.4393 15.8173 3.68211L15.1553 4.34404Z" fill="currentColor"/> </svg>',
    pencil: '<svg height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M221.66,90.34,192,120,136,64l29.66-29.66a8,8,0,0,1,11.31,0L221.66,79A8,8,0,0,1,221.66,90.34Z" opacity="0.2"/><path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31l83.67-83.66,3.48,13.9-36.8,36.79a8,8,0,0,0,11.31,11.32l40-40a8,8,0,0,0,2.11-7.6l-6.9-27.61L227.32,96A16,16,0,0,0,227.32,73.37ZM48,208V179.31L76.69,208Zm48-3.31L51.31,160,136,75.31,180.69,120Zm96-96L147.32,64l24-24L216,84.69Z"/></svg>',
    nib: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M248 92.68a15.86 15.86 0 0 0-4.69-11.31l-68.68-68.69a16 16 0 0 0-22.63 0l-28.43 28.43-58 21.77a16.06 16.06 0 0 0-10.22 12.35L32.11 214.68A8 8 0 0 0 40 224a8.4 8.4 0 0 0 1.32-.11l139.44-23.24a16 16 0 0 0 12.35-10.17l21.77-58L243.31 104A15.87 15.87 0 0 0 248 92.68Zm-69.87 92.19L63.32 204l47.37-47.37a28 28 0 1 0-11.32-11.32L52 192.7 71.13 77.86 126 57.29 198.7 130ZM112 132a12 12 0 1 1 12 12 12 12 0 0 1-12-12Zm96-15.32L139.31 48l24-24L232 92.68Z"/></svg>',
    brush: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21v-4a4 4 0 1 1 4 4H3"/><path d="M21 3A16 16 0 0 0 8.2 13.2M21 3a16 16 0 0 1-10.2 12.8M10.6 9a9 9 0 0 1 4.4 4.4"/></svg>',
    marker: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>',
    pencilFill: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31 73.37 182.63 28.68a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69A15.86 15.86 0 0 0 104 219.31L227.31 96a16 16 0 0 0 0-22.63ZM51.31 160 136 75.31 152.69 92 68 176.68ZM48 179.31 76.69 208H48Zm48 25.38L79.31 188 164 103.31 180.69 120Zm96-96L147.31 64l24-24L216 84.68Z"/></svg>',
    doodle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15c2 3 4 4 7 4s7-3 7-7-3-7-6-7-5 1.5-5 4 2 5 6 5 8.408-2.453 10-5"/></svg>',
    quill: '<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2277 17.7884C11.0288 17.7884 10.838 17.7093 10.6974 17.5687L10.5208 17.3921L8.92999 18.9829C8.43153 19.4814 7.7072 19.6163 7.08648 19.3876C7.05762 19.4326 7.02381 19.4748 6.98541 19.5132L6.62159 19.877C6.44318 20.0554 6.18701 20.1322 5.93989 20.0812L3.59474 19.598C3.3246 19.5423 3.10682 19.3429 3.02766 19.0786C2.94851 18.8144 3.02075 18.5281 3.21578 18.3331L4.51053 17.0383C4.54946 16.9994 4.59159 16.9656 4.63609 16.9371C4.40758 16.3164 4.54252 15.5922 5.0409 15.0938L6.63171 13.503L6.45474 13.326C6.16185 13.0332 6.16185 12.5583 6.45474 12.2654L14.94 3.7801C15.8187 2.90142 17.2433 2.90142 18.122 3.7801L20.2433 5.90142C21.122 6.7801 21.122 8.20472 20.2433 9.0834L11.758 17.5687C11.6174 17.7093 11.4266 17.7884 11.2277 17.7884ZM9.46014 16.3314L7.69237 14.5637L6.10156 16.1545C6.00393 16.2521 6.00393 16.4104 6.10156 16.508L7.51578 17.9223C7.61341 18.0199 7.7717 18.0199 7.86933 17.9223L9.46014 16.3314ZM11.0513 15.8009L11.065 15.8149L11.2277 15.9777L19.1827 8.02274C19.4756 7.72985 19.4756 7.25498 19.1827 6.96208L17.0613 4.84076C16.7684 4.54787 16.2936 4.54787 16.0007 4.84076L8.04573 12.7957L8.20876 12.9587L8.22288 12.9725L11.0513 15.8009Z" fill="currentColor"/> </svg>'
  };

  function cfg(root) {
    var global = Object.assign({}, window.DoodlePenConfig || {}, window.GhostPluginConfig || {});
    var G0 = window.GhostPlugins;
    var live = (G0 && (G0.configFor ? G0.configFor(root, "doodle-pen") : (G0.config && G0.config["doodle-pen"]))) || {};
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

  /* Cursor essentials live in the script so the pen shows even when style.css
     is blocked, cached, or slow on the host site. */
  function ensureCursorStyles() {
    if (document.getElementById("gh-doodle-cursor-style-v133")) return;
    var st = document.createElement("style");
    st.id = "gh-doodle-cursor-style-v133";
    st.textContent =
      ".gh-doodle__canvas{cursor:none}" +
      ".gh-doodle__cursor{width:var(--dp-cursor-size,64px);height:var(--dp-cursor-size,64px);margin:calc(var(--dp-cursor-size,64px) * -0.92) 0 0 calc(var(--dp-cursor-size,64px) * -0.08);transition:opacity .15s ease;line-height:0;z-index:2}" +
      ".gh-doodle__cursor.is-visible{opacity:1!important}" +
      ".gh-doodle__cursor svg,.gh-doodle__cursor img{width:100%;height:100%;display:block}" +
      "@media (pointer:coarse){.gh-doodle__canvas{cursor:default}.gh-doodle__cursor{display:none!important}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function init(root) {
    if (!root || root.getAttribute("data-dp-ready") === "1") return;
    root.setAttribute("data-dp-ready", "1");
    var o = cfg(root);

    /* Plugin Canvas: Code Block by default; opt-in Full Page Section moves the
       canvas over its enclosing section and is fully reversed on teardown. */
    var sectionHost = null, sectionMark = null, sectionPos = "", sectionMinH = false;
    if (String(o.sizeMode) === "section" && root.getAttribute("data-gp-preview") !== "true") {
      var sec = root.parentElement && root.parentElement.closest("section");
      if (sec && !sec.querySelector('[data-dp-section="1"]')) {
        sectionMark = document.createComment("Doodle Pen original Code Block location");
        root.parentNode.insertBefore(sectionMark, root);
        sectionHost = sec; sectionPos = sec.style.position;
        if (getComputedStyle(sec).position === "static") sec.style.position = "relative";
        sec.appendChild(root);
        root.setAttribute("data-dp-section", "1");
        if (sec.getBoundingClientRect().height < 320) { sec.style.minHeight = "max(600px, 70vh)"; sectionMinH = true; }
      }
    }

    root.style.setProperty("--dp-cursor-size", num(o.cursorSize, 64) + "px");

    var canvas = document.createElement("canvas");
    canvas.className = "gh-doodle__canvas";
    root.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var cursor = document.createElement("div");
    cursor.className = "gh-doodle__cursor";
    /* Inline safety styles so the pen never flashes in page flow before the stylesheet arrives. */
    cursor.style.cssText = "position:absolute;top:0;left:0;opacity:0;pointer-events:none;";
    ensureCursorStyles();
    cursor.setAttribute("aria-hidden", "true");
    cursor.style.color = String(o.cursorColor || "#111111");
    if (o.cursorPreset === "custom" && (/^https:\/\//.test(String(o.cursorSvg || "")) || /^data:image\/svg\+xml[;,]/i.test(String(o.cursorSvg || "")))) {
      var image = document.createElement("img");
      image.src = /^data:image\/svg\+xml/i.test(String(o.cursorSvg))
        ? String(o.cursorSvg).replace(/currentColor/gi, encodeURIComponent(String(o.cursorColor || "#111111")))
        : String(o.cursorSvg);
      image.alt = "";
      cursor.appendChild(image);
    } else {
      cursor.innerHTML = CURSORS[String(o.cursorPreset || "pen")] || CURSORS.pen;
    }
    root.appendChild(cursor);

    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var drawing = false;
    var last = null;
    var strokeSeed = 0;
    var strokes = [];
    var current = null;
    var frame = 0;
    var fading = o.fadeAway === true || String(o.fadeAway) === "true";
    var duration = 4000;
    var fadeDelay = 2000;

    function paint(now) {
      frame = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = strokes.length - 1; i >= 0; i--) {
        var old = strokes[i];
        if (old !== current && now - old.at >= duration) strokes.splice(i, 1);
      }
      for (var j = 0; j < strokes.length; j++) {
        var stroke = strokes[j];
        var age = now - stroke.at;
        ctx.globalAlpha = Math.max(0, 1 - age / duration);
        ctx.drawImage(stroke.layer, 0, 0);
      }
      ctx.globalAlpha = 1;
      if (strokes.length) frame = requestAnimationFrame(paint);
    }

    function enabled() {
      return window.matchMedia("(pointer: fine)").matches;
    }

    var host = (root.closest && (root.closest(".fe-block") || root.closest(".sqs-block"))) || null;
    function resize() {
      /* Measure the natural height first, then fall back to the Squarespace
         block height (Fluid Engine gives the block an explicit size even when
         the inner wrappers are auto height). Recomputed on every resize so a
         block that grows after load is never clipped. */
      root.style.height = "";
      root.style.minHeight = "";
      var rect = root.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width));
      var h = Math.round(rect.height);
      if (h < 80) {
        var hostH = host ? Math.round(host.getBoundingClientRect().height) : 0;
        h = hostH >= 80 ? hostH : 320;
        root.style.height = h + "px";
      }
      if (canvas.width === Math.round(w * dpr) && canvas.height === Math.round(h * dpr)) return;
      h = Math.max(1, h);
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
      strokes.forEach(function (stroke) {
        var layer = document.createElement("canvas");
        layer.width = canvas.width; layer.height = canvas.height;
        layer.getContext("2d").drawImage(stroke.layer, 0, 0);
        stroke.layer = layer;
      });
      if (snapshot && !fading) ctx.drawImage(snapshot, 0, 0);
    }

    function pos(e) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr
      };
    }

    function segment(a, b) {
      var pen = fading && current ? current.layer.getContext("2d") : ctx;
      var width = num(o.lineWidth, 6) * dpr;
      var style = String(o.lineStyle || "solid");
      pen.strokeStyle = String(o.lineColor || "#111111");
      pen.lineWidth = width;
      pen.lineCap = "round";
      pen.lineJoin = "round";
      if (style === "hand-drawn") {
        // Sketch effect: two wobbly passes with deterministic jitter.
        for (var pass = 0; pass < 2; pass++) {
          pen.setLineDash([]);
          pen.globalAlpha = pass === 0 ? 0.85 : 0.35;
          pen.beginPath();
          var steps = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / (6 * dpr)));
          for (var i = 0; i <= steps; i++) {
            var t = i / steps;
            var jx = jitter(strokeSeed + pass * 91 + i) * width * 0.9;
            var jy = jitter(strokeSeed + pass * 57 + i * 3) * width * 0.9;
            var x = a.x + (b.x - a.x) * t + jx;
            var y = a.y + (b.y - a.y) * t + jy;
            if (i === 0) pen.moveTo(x, y); else pen.lineTo(x, y);
          }
          pen.stroke();
        }
        pen.globalAlpha = 1;
      } else {
        pen.setLineDash(dashFor(style, width));
        pen.beginPath();
        pen.moveTo(a.x, a.y);
        pen.lineTo(b.x, b.y);
        pen.stroke();
        pen.setLineDash([]);
      }
    }

    function onDown(e) {
      if (!enabled() || (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen")) return;
      drawing = true;
      strokeSeed = Math.random() * 1000;
      if (fading) {
        var layer = document.createElement("canvas");
        layer.width = canvas.width; layer.height = canvas.height;
        current = { layer: layer, at: Infinity };
        strokes.push(current);
        if (!frame) frame = requestAnimationFrame(paint);
      }
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
    function onUp() {
      if (current) current.at = performance.now() + fadeDelay;
      drawing = false; last = null; current = null;
    }
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
      if (host) ro.observe(host);
    } else {
      window.addEventListener("resize", resize);
    }
    resize();
    root.classList.add("gh-ready");

    /* Teardown, so a settings change rebuilds cleanly with no duplicate
       listeners or observers left behind. */
    root.ghDoodleDestroy = function () {
      canvas.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      root.classList.remove("gh-ready");
      root.removeAttribute("data-dp-ready");
      if (sectionHost) {
        root.removeAttribute("data-dp-section");
        if (sectionMark && sectionMark.parentNode) { sectionMark.parentNode.insertBefore(root, sectionMark); sectionMark.parentNode.removeChild(sectionMark); }
        sectionHost.style.position = sectionPos;
        if (sectionMinH) sectionHost.style.removeProperty("min-height");
        sectionHost = null;
      }
      delete root.ghDoodleDestroy;
    };
  }

  function boot() {
    document.querySelectorAll("[data-doodle], .gh-doodle").forEach(init);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  /* Saved settings arrive after first paint: rebuild every canvas so the
     saved configuration always wins over the built-in defaults. */
  function reboot() {
    document.querySelectorAll("[data-doodle], .gh-doodle").forEach(function (root) {
      if (typeof root.ghDoodleDestroy === "function") {
        try { root.ghDoodleDestroy(); } catch (e) {}
      }
      init(root);
    });
  }
  document.addEventListener("ghost:config", reboot);
  document.addEventListener("mercury:load", boot);
  window.addEventListener("pageshow", boot);
  window.DoodlePen = { init: boot, cursors: CURSORS };
})();


