/* Cursor Image Trail, Ghost Plugins  v1.4.0
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
    image1: "", image2: "", image3: "", image4: "",
    image5: "", image6: "", image7: "", image8: ""
  };

  var DEMO_IMAGES = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&q=70&auto=format&fit=crop"
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
    if (typeof fallback === "boolean") return String(raw) !== "false";
    return String(raw);
  }

  function readConfig(el) {
    var global = window.CursorImageTrailConfig || {};
    // Saved Plugin Studio settings for this installation, published by the
    // install loader. Without this the plugin always renders its demo images.
    var live = (window.GhostPlugins && window.GhostPlugins.config &&
      window.GhostPlugins.config["cursor-image-trail"]) || {};
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

  function init(el) {
    if (!el || el.dataset.ghTrailReady === "true") return;
    el.dataset.ghTrailReady = "true";

    var cfg = readConfig(el);
    var images = parseImages(cfg);
    if (cfg.fullscreen) el.classList.add("gh-trail--fixed");

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
      if (cfg.fullscreen) return;
      style.width = "100%";
      style.height = "100%";
      style.minHeight = "0";
      var node = el.parentElement;
      var hops = 0;
      while (node && hops < 6 && node !== document.body) {
        node.style.height = "100%";
        node.style.width = "100%";
        node.style.maxWidth = "100%";
        node = node.parentElement;
        hops += 1;
      }
      /* If no ancestor supplies a real height, fall back to a measured value
         so the trail area is never collapsed to zero. */
      if (el.getBoundingClientRect().height < 40) {
        var host = el.parentElement;
        var h = host ? host.getBoundingClientRect().height : 0;
        style.height = (h > 40 ? Math.round(h) : 360) + "px";
      }
    }
    fitToParent();
    window.requestAnimationFrame(fitToParent);
    window.addEventListener("load", fitToParent);
    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(fitToParent);
      if (el.parentElement) resizeObserver.observe(el.parentElement);
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
      window.setTimeout(function () {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, cfg.outDuration + 60);
    }

    function scheduleRemoval(node) {
      var stagger = removalQueue * cfg.removalStagger;
      removalQueue += 1;
      window.setTimeout(function () {
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

    function point(e) {
      var rect = el.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onMove(e) {
      var p = point(e);
      lastPointer = p;
      if (cfg.fullscreen === false) {
        var rect = el.getBoundingClientRect();
        if (p.x < 0 || p.y < 0 || p.x > rect.width || p.y > rect.height) return;
      }
      if (!last) { last = p; spawn(p.x, p.y); lastSpawn = Date.now(); return; }
      var dist = Math.hypot(p.x - last.x, p.y - last.y);
      if (dist < threshold) return;
      last = p;
      lastSpawn = Date.now();
      spawn(p.x, p.y);
    }

    function onScroll() {
      if (!cfg.scrollSpawnRate || !lastPointer) return;
      var now = Date.now();
      if (now - lastScrollSpawn < cfg.scrollSpawnRate) return;
      lastScrollSpawn = now;
      lastSpawn = now;
      spawn(lastPointer.x, lastPointer.y);
    }

    var idleTimer = null;
    if (cfg.idleSpawnRate > 0) {
      idleTimer = window.setInterval(function () {
        if (!lastPointer) return;
        if (Date.now() - lastSpawn < cfg.idleSpawnRate) return;
        lastSpawn = Date.now();
        spawn(lastPointer.x, lastPointer.y);
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
      if (idleTimer) window.clearInterval(idleTimer);
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
  document.addEventListener("sqs-announcement-bar-ready", boot);
  window.GhostCursorImageTrail = { init: init, boot: boot };
})();
