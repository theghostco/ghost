
/* Cursor Image Flow, Ghost Plugins  v1.5.0
   Standalone browser script. No dependencies.
   Config: window.CursorImageTrailConfig, or per block data attributes. */
(function () {
  "use strict";

  var DEFAULTS = {
    images: "",
    background: "transparent",
    imageWidth: 220,
    imageHeight: 280,
    cornerRadius: 12,
    imageFit: "cover",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    maxRotation: 14,
    trailLength: 8,
    lifespan: 900,
    trailOrder: "sequential",
    sensitivity: "medium",
    animateIn: "scale",
    inDuration: 420,
    inEasing: "spring",
    animateOut: "fade-scale",
    outDuration: 520,
    outEasing: "ease-out",
    spawnDistance: 110,
    scrollSpawnRate: 220,
    idleSpawnRate: 0,
    removalStagger: 60,
    fullscreen: false,
    activeOn: "all",
    pageSlugs: "",
    image1: "", image2: "", image3: "", image4: "",
    image5: "", image6: "", image7: "", image8: ""
  };

  var DEMO_IMAGES = [
    "https://www.ghostplugins.com/demo_light_image.webp",
    "https://www.ghostplugins.com/demo_light_image.webp",
    "https://www.ghostplugins.com/demo_light_image.webp",
    "https://www.ghostplugins.com/demo_light_image.webp",
    "https://www.ghostplugins.com/demo_light_image.webp",
    "https://www.ghostplugins.com/demo_light_image.webp"
  ];

  var EASINGS = {
    linear: "linear",
    ease: "ease",
    "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
    "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
    "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    tween: "cubic-bezier(0.22, 1, 0.36, 1)"
  };

  var SENSITIVITY = { low: 1.8, medium: 1, high: 0.55 };

  function camelToDash(key) {
    return key.replace(/[A-Z]/g, function (c) { return "-" + c.toLowerCase(); });
  }

  function coerce(fallback, raw) {
    if (raw === null || raw === undefined || raw === "") return fallback;
    if (typeof fallback === "number") {
      var n = parseFloat(raw);
      return isFinite(n) ? n : fallback;
    }
    if (typeof fallback === "boolean") return raw === true || String(raw) === "true";
    return String(raw);
  }

  function readConfig(el) {
    var global = window.CursorImageTrailConfig || {};
    // Saved Plugin Studio settings for this installation, published by the
    // install loader. Without this the plugin always renders its demo images.
    var G0 = window.GhostPlugins;
    var live = (G0 && (G0.configFor ? G0.configFor(el, "cursor-image-trail") : (G0.config && G0.config["cursor-image-trail"]))) || {};
    var cfg = {};
    for (var key in DEFAULTS) {
      if (!Object.prototype.hasOwnProperty.call(DEFAULTS, key)) continue;
      var value = DEFAULTS[key];
      if (live[key] !== undefined && live[key] !== null && live[key] !== "") value = coerce(DEFAULTS[key], live[key]);
      if (global[key] !== undefined) value = coerce(DEFAULTS[key], global[key]);
      var attr = el.getAttribute("data-" + camelToDash(key));
      if (attr !== null) value = coerce(DEFAULTS[key], attr);
      cfg[key] = value;
    }
    return cfg;
  }

  function parseImages(cfg) {
    var list = String(cfg.images || "")
      .split(/[\n,]+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
    for (var i = 1; i <= 8; i += 1) {
      var slot = String(cfg["image" + i] || "").trim();
      if (slot) list.push(slot);
    }
    return list.length ? list : DEMO_IMAGES.slice();
  }

  function easing(name) {
    return EASINGS[name] || EASINGS.tween;
  }

  function enterTransform(style) {
    if (style === "scale") return "translate3d(0,0,0) scale(0.6)";
    if (style === "slide-up") return "translate3d(0,26px,0) scale(1)";
    if (style === "slide-down") return "translate3d(0,-26px,0) scale(1)";
    if (style === "zoom") return "translate3d(0,0,0) scale(1.35)";
    return "translate3d(0,0,0) scale(1)"; /* fade */
  }

  function exitTransform(style) {
    if (style === "fade-scale") return "translate3d(0,0,0) scale(0.72)";
    if (style === "slide-up") return "translate3d(0,-34px,0) scale(1)";
    if (style === "slide-down") return "translate3d(0,34px,0) scale(1)";
    if (style === "zoom") return "translate3d(0,0,0) scale(1.25)";
    return "translate3d(0,0,0) scale(1)"; /* fade */
  }

  /* Page targeting: "all" runs everywhere; "specific" runs only on the listed
     page slugs. A trailing * matches every page under that path. Ghost Plugins
     previews always run so the Studio canvas never goes blank. */
  function normPath(p) {
    p = String(p || "").trim();
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) { try { p = new URL(p).pathname; } catch (e) { return ""; } }
    p = p.split("?")[0].split("#")[0];
    if (p.charAt(0) !== "/") p = "/" + p;
    if (p.length > 1) p = p.replace(/\/+$/, "");
    return p.toLowerCase();
  }
  function pageAllowed(cfg) {
    if (String(cfg.activeOn) !== "specific") return true;
    var host = window.location.hostname;
    if (/(^|\.)ghostplugins\.com$|lovable\.app$|lovableproject\.com$|^localhost$/.test(host)) return true;
    var here = normPath(window.location.pathname) || "/";
    var list = String(cfg.pageSlugs || "").split(/[\n,]+/);
    for (var i = 0; i < list.length; i += 1) {
      var raw = String(list[i] || "").trim();
      if (!raw) continue;
      var wild = /\*$/.test(raw);
      var p = normPath(raw.replace(/\*$/, ""));
      if (!p) continue;
      if (wild) { if (here === p || here.indexOf(p === "/" ? "/" : p + "/") === 0) return true; }
      else if (here === p) return true;
    }
    return false;
  }

  function init(el) {
    if (!el || el.dataset.ghTrailReady === "true") return;
    el.dataset.ghTrailReady = "true";

    /* Connected installs: wait for saved settings instead of flashing the
       demo photos. Falls back to demo photos only if nothing arrives. */
    var G1 = window.GhostPlugins;
    var liveReady = G1 && (G1.configFor ? G1.configFor(el, "cursor-image-trail") : (G1.config && G1.config["cursor-image-trail"]));
    var managed = el.hasAttribute("data-ghost-plugin") || !!window.GhostPlugins;
    if (!liveReady && managed && !window.CursorImageTrailConfig &&
        !el.hasAttribute("data-images") && !el.ghTrailWaited) {
      el.dataset.ghTrailReady = "";
      if (!el.ghTrailWaitTimer) {
        el.ghTrailWaitTimer = window.setTimeout(function () {
          el.ghTrailWaited = true; init(el);
        }, 3000);
      }
      return;
    }
    if (el.ghTrailWaitTimer) { window.clearTimeout(el.ghTrailWaitTimer); el.ghTrailWaitTimer = null; }

    var cfg = readConfig(el);
    if (!pageAllowed(cfg)) {
      el.dataset.ghTrailReady = "";
      el.classList.remove("gh-ready");
      el.style.display = "none";
      return;
    }
    el.style.removeProperty("display");
    /* Accessibility: honor the visitor's reduced-motion setting. */
    var reduceMotion = typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      cfg.inDuration = 0;
      cfg.outDuration = 0;
      cfg.idleSpawnRate = 0;
      cfg.scrollSpawnRate = 0;
      cfg.animateIn = "fade";
      cfg.animateOut = "fade";
    }
    var images = parseImages(cfg);
    /* Full Page Section uses the containing Squarespace section as its bounds.
       Older placeholder values (a/b) remain bounded until explicitly changed. */
    var section = typeof el.closest === "function" ? el.closest(".page-section, .sqs-section") : null;
    cfg.fullscreen = cfg.fullscreen === true && !!section;
    if (cfg.fullscreen) el.classList.add("gh-trail--fixed");
    else el.classList.remove("gh-trail--fixed");

    var style = el.style;
    style.setProperty("--it-bg", cfg.background);
    style.setProperty("--it-img-w", cfg.imageWidth + "px");
    style.setProperty("--it-img-h", cfg.imageHeight + "px");
    style.setProperty("--it-radius", cfg.cornerRadius + "px");
    style.setProperty("--it-fit", cfg.imageFit);
    style.setProperty("--it-border-width", cfg.borderWidth + "px");
    style.setProperty("--it-border-style", cfg.borderStyle);
    style.setProperty("--it-border-color", cfg.borderColor);
    style.setProperty("--it-in-duration", cfg.inDuration + "ms");
    style.setProperty("--it-out-duration", cfg.outDuration + "ms");
    style.setProperty("--it-in-ease", easing(cfg.inEasing));
    style.setProperty("--it-out-ease", easing(cfg.outEasing));

    /* Squarespace code blocks have no intrinsic height, so the plugin and
       every wrapper between it and the block are stretched to 100%. */
    var resizeObserver = null;
    function fitToParent() {
      if (cfg.fullscreen && section) {
        var bounds = section.getBoundingClientRect();
        style.left = bounds.left + "px";
        style.top = bounds.top + "px";
        style.width = bounds.width + "px";
        style.height = bounds.height + "px";
        style.minHeight = "0";
        return;
      }
      style.width = "100%";
      style.minHeight = "0";
      var block = typeof el.closest === "function" ? el.closest(".sqs-block-code") : null;
      /* Fluid Engine: the grid cell (.fe-block) owns the size the customer
         dragged. Stretch only the wrappers inside that cell so the canvas
         fills the whole Code Block and never leaves it. */
      var cell = typeof el.closest === "function" ? el.closest(".fe-block") : null;
      if (cell) {
        var node = el.parentElement;
        while (node && node !== cell) {
          node.style.height = "100%";
          node.style.minHeight = "0";
          node = node.parentElement;
        }
        var ch = Math.round(cell.getBoundingClientRect().height);
        style.height = ch > 40 ? ch + "px" : "360px";
        return;
      }
      var host = block || el.parentElement;
      var rect = host ? host.getBoundingClientRect() : null;
      var h = rect && rect.height > 40 ? Math.round(rect.height) : 360;
      style.height = h + "px";
    }
    fitToParent();
    window.requestAnimationFrame(fitToParent);
    window.addEventListener("load", fitToParent);
    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(fitToParent);
      var watch = (cfg.fullscreen && section) || (typeof el.closest === "function" && el.closest(".fe-block")) || el.parentElement;
      if (watch) resizeObserver.observe(watch);
    } else {
      window.addEventListener("resize", fitToParent);
    }

    /* Preload so the first pass of the trail is not blank. */
    images.forEach(function (src) { var i = new Image(); i.src = src; });

    var live = [];
    var index = 0;
    var last = null;
    var lastPointer = null;
    var lastSpawn = 0;
    var lastScrollSpawn = 0;
    var removalQueue = 0;
    var timers = [];

    /* Every deferred step is tracked so teardown leaves nothing pending. */
    function defer(fn, ms) {
      var id = window.setTimeout(function () {
        var at = timers.indexOf(id);
        if (at !== -1) timers.splice(at, 1);
        fn();
      }, ms);
      timers.push(id);
      return id;
    }
    var threshold = Math.max(8, cfg.spawnDistance * (SENSITIVITY[cfg.sensitivity] || 1));

    function nextSrc() {
      if (cfg.trailOrder === "random") {
        return images[Math.floor(Math.random() * images.length)];
      }
      var src = images[index % images.length];
      index += 1;
      return src;
    }

    function remove(node) {
      var pos = live.indexOf(node);
      if (pos !== -1) live.splice(pos, 1);
      node.classList.remove("is-in");
      node.classList.add("is-out");
      node.style.transform = node.dataset.base + " " + exitTransform(cfg.animateOut);
      defer(function () {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, cfg.outDuration + 60);
    }

    function scheduleRemoval(node) {
      var stagger = removalQueue * cfg.removalStagger;
      removalQueue += 1;
      defer(function () {
        removalQueue = Math.max(0, removalQueue - 1);
        if (node.parentNode) remove(node);
      }, cfg.lifespan + stagger);
    }

    function spawn(x, y) {
      var img = document.createElement("img");
      img.className = "gh-trail__img";
      img.src = nextSrc();
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.decoding = "async";
      img.loading = "eager";

      var rotate = (Math.random() * 2 - 1) * cfg.maxRotation;
      var base = "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px,0) rotate(" + rotate.toFixed(2) + "deg)";
      img.dataset.base = base;
      img.style.transform = base + " " + enterTransform(cfg.animateIn);

      el.appendChild(img);
      live.push(img);

      /* Next frame so the enter transition actually runs. */
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          img.classList.add("is-in");
          img.style.transform = base + " translate3d(0,0,0) scale(1)";
        });
      });

      while (live.length > cfg.trailLength) remove(live[0]);
      scheduleRemoval(img);
    }

    var lastClient = null;
    function point(e) {
      var rect = el.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    /* Re-measure the cursor against the canvas's current position, so
       scroll and idle spawns land under the cursor even after the page moved. */
    function livePointer() {
      if (!lastClient) return lastPointer;
      var p = point(lastClient);
      var rect = el.getBoundingClientRect();
      if (p.x < 0 || p.y < 0 || p.x > rect.width || p.y > rect.height) return null;
      return p;
    }

    function onMove(e) {
      var p = point(e);
      lastClient = { clientX: e.clientX, clientY: e.clientY };
      lastPointer = p;
      var rect = el.getBoundingClientRect();
      if (p.x < 0 || p.y < 0 || p.x > rect.width || p.y > rect.height) {
        last = null;
        lastPointer = null;
        return;
      }
      if (!last) { last = p; spawn(p.x, p.y); lastSpawn = Date.now(); return; }
      var dist = Math.hypot(p.x - last.x, p.y - last.y);
      if (dist < threshold) return;
      last = p;
      lastSpawn = Date.now();
      spawn(p.x, p.y);
    }

    function onScroll() {
      if (cfg.fullscreen) fitToParent();
      if (!cfg.scrollSpawnRate || !lastPointer) return;
      var now = Date.now();
      if (now - lastScrollSpawn < cfg.scrollSpawnRate) return;
      var sp = livePointer();
      if (!sp) return;
      lastScrollSpawn = now;
      lastSpawn = now;
      lastPointer = sp;
      last = sp;
      spawn(sp.x, sp.y);
    }

    var idleTimer = null;
    if (cfg.idleSpawnRate > 0) {
      idleTimer = window.setInterval(function () {
        if (!lastPointer) return;
        if (Date.now() - lastSpawn < cfg.idleSpawnRate) return;
        var ip = livePointer();
        if (!ip) return;
        lastSpawn = Date.now();
        spawn(ip.x, ip.y);
      }, Math.max(80, cfg.idleSpawnRate / 2));
    }

    var target = cfg.fullscreen ? window : el;
    target.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    el.classList.add("gh-ready");

    el.ghTrailDestroy = function () {
      target.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", fitToParent);
      window.removeEventListener("resize", fitToParent);
      if (resizeObserver) resizeObserver.disconnect();
      el.classList.remove("gh-trail--fixed");
      style.removeProperty("left");
      style.removeProperty("top");
      style.removeProperty("width");
      style.removeProperty("height");
      style.removeProperty("min-height");
      if (idleTimer) window.clearInterval(idleTimer);
      for (var t = 0; t < timers.length; t += 1) window.clearTimeout(timers[t]);
      timers.length = 0;
    };
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-image-trail], .gh-trail");
    for (var i = 0; i < nodes.length; i += 1) init(nodes[i]);
  }

  /* Saved settings arrive asynchronously. Rebuild every trail with the live
     config as soon as it lands, so a saved preset always wins over demo data. */
  function reboot() {
    var nodes = document.querySelectorAll("[data-image-trail], .gh-trail");
    for (var i = 0; i < nodes.length; i += 1) {
      var el = nodes[i];
      if (typeof el.ghTrailDestroy === "function") {
        try { el.ghTrailDestroy(); } catch (e) {}
      }
      el.removeAttribute("data-gh-trail-ready");
      var kids = el.querySelectorAll(".gh-trail__img");
      for (var k = 0; k < kids.length; k += 1) kids[k].remove();
      init(el);
    }
  }
  document.addEventListener("ghost:config", reboot);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", boot);
  document.addEventListener("mercury:load", reboot);
  window.addEventListener("pageshow", boot);
  document.addEventListener("sqs-announcement-bar-ready", boot);
  window.GhostCursorImageTrail = { init: init, boot: boot };
})();



