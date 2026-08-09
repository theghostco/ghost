/* Ghost Plugins — installation config loader.
 * Embedded in the standalone master because ghosthub.boo serves static files
 * directly; it cannot inject the app's universal loader at request time. */
(function () {
  try {
    var script = document.currentScript;
    var installId = script && script.getAttribute("data-ghost-key");
    if (!installId) return;
    var base = "https://project--fa2ec63b-c01c-48e9-8664-a2eaaf9a6e38.lovable.app/api/public/install/" + encodeURIComponent(installId);
    var ghost = (window.GhostPlugins = window.GhostPlugins || { config: {}, installs: {} });
    ghost.config = ghost.config || {};
    ghost.installs = ghost.installs || {};
    if (ghost.installs[installId]) return;
    ghost.installs[installId] = { loading: true };

    if (!document.querySelector('link[data-ghost-key="' + installId + '"]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = base + ".css";
      link.setAttribute("data-ghost-key", installId);
      (document.head || document.documentElement).appendChild(link);
    }

    fetch(base + ".json", { credentials: "omit", cache: "no-store" })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (saved) {
        if (!saved) return;
        var merged = Object.assign({}, saved.presetSettings || {}, saved.settings || {}, saved.config || {});
        saved.merged = merged;
        ghost.installs[installId] = saved;
        if (saved.pluginId) ghost.config[saved.pluginId] = merged;
        document.dispatchEvent(new CustomEvent("ghost:config", { detail: saved }));
      })
      .catch(function () { /* Keep pasted defaults if live settings are unavailable. */ });
  } catch (error) { /* Never break the host site. */ }
})();

/*!
 * Aiko Testimonial Slider — Ghost Plugins  v1.4.0
 * Standalone browser plugin. Works on any site (Squarespace, Webflow, WordPress, plain HTML).
 * Configure with window.AikoSliderConfig, window.GhostPluginConfig, or per-slider data-attributes.
 */
(function () {
  "use strict";

  // The loader can be present twice (site-wide code injection + a code block).
  // Re-run the existing instance instead of defining a second one.
  if (window.AikoTestimonialSlider) {
    try { window.AikoTestimonialSlider.initAll(); } catch (e) {}
    return;
  }

  var DEFAULTS = {
    autoplay: true,
    autoplaySpeed: 5000,
    transitionSpeed: 500,
    loop: true,
    showArrows: true,
    showDots: true,
    pauseOnHover: true,
    swipe: true,
    quoteStyle: "default",
    arrowStyle: "default"
  };

  var ARROWS = {
    default: {
      left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>',
      right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>'
    },
    minimal: {
      left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>',
      right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>'
    },
    round: {
      left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="14 16 10 12 14 8"></polyline></svg>',
      right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="10 8 14 12 10 16"></polyline></svg>'
    },
    caret: {
      left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="13 17 8 12 13 7"></polyline></svg>',
      right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="11 7 16 12 11 17"></polyline></svg>'
    },
    line: {
      left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
      right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
    }
  };

  function bool(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return String(value) !== "false";
  }

  function num(value, fallback) {
    var n = parseInt(value, 10);
    return isNaN(n) ? fallback : n;
  }

  function pick(value, choices, fallback) {
    return choices.indexOf(value) !== -1 ? value : fallback;
  }

  /**
   * Settings saved in the Ghost Plugin Editor for this installation.
   * The bootstrap loader (data-ghost-key) fetches them and stores the merged
   * object here, so edits go live without re-pasting any markup.
   */
  function liveConfig() {
    try {
      var G = window.GhostPlugins;
      var live = G && G.config && G.config["aiko-testimonial-slider"];
      return live && typeof live === "object" ? live : {};
    } catch (e) {
      return {};
    }
  }

  function readSettings(root) {
    var live = liveConfig();
    var global = window.AikoSliderConfig || {};
    var ghost = (window.GhostPluginConfig || {});
    var d = root.dataset;
    function cfg(key, fallback) {
      // Saved editor settings win: they are the customer's current choices.
      var v = live[key];
      if (v !== undefined && v !== "") return v;
      v = d[key];
      if (v !== undefined && v !== "") return v;
      v = global[key];
      if (v !== undefined && v !== "") return v;
      v = ghost[key];
      if (v !== undefined && v !== "") return v;
      return fallback;
    }
    return {
      autoplay: bool(cfg("autoplay", DEFAULTS.autoplay), DEFAULTS.autoplay),
      autoplaySpeed: num(cfg("autoplaySpeed", DEFAULTS.autoplaySpeed), DEFAULTS.autoplaySpeed),
      transitionSpeed: num(cfg("transitionSpeed", DEFAULTS.transitionSpeed), DEFAULTS.transitionSpeed),
      loop: bool(cfg("loop", DEFAULTS.loop), DEFAULTS.loop),
      showArrows: bool(cfg("showArrows", DEFAULTS.showArrows), DEFAULTS.showArrows),
      showDots: bool(cfg("showDots", DEFAULTS.showDots), DEFAULTS.showDots),
      pauseOnHover: bool(cfg("pauseOnHover", DEFAULTS.pauseOnHover), DEFAULTS.pauseOnHover),
      swipe: bool(cfg("swipe", DEFAULTS.swipe), DEFAULTS.swipe),
      quoteStyle: pick(String(cfg("quoteStyle", DEFAULTS.quoteStyle)), ["default", "minimal", "brackets", "apostrophe", "none"], DEFAULTS.quoteStyle),
      arrowStyle: pick(String(cfg("arrowStyle", DEFAULTS.arrowStyle)), ["default", "minimal", "round", "caret", "line"], DEFAULTS.arrowStyle)
    };
  }

  /** Testimonials saved in the editor (t1..t10), when this install has any. */
  function liveItems() {
    var live = liveConfig();
    var items = [];
    for (var i = 1; i <= 10; i++) {
      var p = "t" + i + "_";
      var text = live[p + "text"];
      var title = live[p + "title"];
      var image = live[p + "image"];
      var subtitle = live[p + "subtitle"];
      text = text == null ? "" : String(text).trim();
      title = title == null ? "" : String(title).trim();
      image = image == null ? "" : String(image).trim();
      subtitle = subtitle == null ? "" : String(subtitle).trim();
      if (!text && !title && !image) continue;
      items.push({
        image: image,
        alt: title || "Testimonial",
        title: title,
        subtitle: subtitle,
        text: text
      });
    }
    return items;
  }

  function readItems(root) {
    // Saved editor content is the source of truth once an installation key is
    // present; the pasted markup is only the fallback / first render.
    var live = liveItems();
    if (live.length) return live;

    // Preferred hook, then a class fallback, then "any direct child of the
    // source wrapper" so slightly-edited markup on the host site still works.
    // Squarespace can concatenate adjacent boolean/data attributes when a Code
    // Block is saved, producing `data-aiko-itemdata-image`. Treat that as a
    // valid item so previously pasted install markup repairs itself.
    var nodes = root.querySelectorAll(
      "[data-aiko-item], [data-aiko-itemdata-image]"
    );
    if (!nodes.length) nodes = root.querySelectorAll(".aiko-item");
    if (!nodes.length) {
      var source = root.querySelector(".aiko-slider__source");
      if (source) nodes = source.children;
    }
    var items = [];

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      items.push({
        image:
          node.getAttribute("data-image") ||
          node.getAttribute("data-aiko-itemdata-image") ||
          "",
        alt: node.getAttribute("data-alt") || node.getAttribute("data-title") || "Testimonial",
        title: node.getAttribute("data-title") || "",
        subtitle: node.getAttribute("data-subtitle") || "",
        text: (node.innerHTML || "").trim()
      });
    }
    return items;
  }

  function buildSlide(item, doc) {
    doc = doc || document;
    var slide = doc.createElement("article");
    slide.className = "aiko-slide";
    slide.setAttribute("role", "group");

    var media = doc.createElement("div");
    media.className = "aiko-slide__media";
    if (item.image) {
      var img = doc.createElement("img");
      img.src = item.image;
      img.alt = item.alt;
      img.loading = "lazy";
      media.appendChild(img);
    }

    var body = doc.createElement("div");
    body.className = "aiko-slide__body";
    body.innerHTML =
      '<span class="aiko-slide__quote-mark aiko-slide__quote-mark--open" aria-hidden="true">\u201C</span>' +
      '<p class="aiko-slide__text">' + item.text + "</p>" +
      (item.title ? '<h3 class="aiko-slide__title">' + item.title + "</h3>" : "") +
      (item.subtitle ? '<p class="aiko-slide__subtitle">' + item.subtitle + "</p>" : "") +
      '<span class="aiko-slide__quote-mark aiko-slide__quote-mark--close" aria-hidden="true">\u201D</span>';

    slide.appendChild(media);
    slide.appendChild(body);
    return slide;
  }

  function init(root) {
    // Already rendered and still intact — nothing to do.
    if (
      root.getAttribute("data-aiko-ready") === "true" &&
      root.querySelector(".aiko-slider__viewport")
    ) {
      return;
    }

    // Stale state (page editors such as Squarespace restore saved HTML and can
    // drop our generated nodes) — clear everything we own and rebuild.
    var stale = root.querySelectorAll(
      ".aiko-slider__viewport, .aiko-slider__arrow, .aiko-slider__dots"
    );
    for (var s = 0; s < stale.length; s++) {
      if (stale[s].parentNode) stale[s].parentNode.removeChild(stale[s]);
    }
    root.removeAttribute("data-aiko-ready");

    var items = readItems(root);
    if (!items.length) {
      // Make sure the raw markup stays visible so the block is never blank.
      var rawSource = root.querySelector(".aiko-slider__source");
      if (rawSource) rawSource.removeAttribute("hidden");
      if (!root.__aikoWarned) {
        root.__aikoWarned = true;
        if (window.console && console.warn) {
          console.warn(
            "[Aiko] Found a slider wrapper but no testimonials inside it. " +
              "Each testimonial needs a data-aiko-item element inside .aiko-slider__source.",
            root
          );
        }
      }
      return;
    }

    var doc = root.ownerDocument || document;
    var settings = readSettings(root);
    root.setAttribute("data-aiko-ready", "true");
    root.setAttribute("data-aiko-quote-style", settings.quoteStyle);
    root.setAttribute("data-aiko-arrow-style", settings.arrowStyle);
    root.style.setProperty("--aiko-speed", settings.transitionSpeed + "ms");

    var source = root.querySelector(".aiko-slider__source");
    if (source) source.setAttribute("hidden", "hidden");


    var viewport = doc.createElement("div");
    viewport.className = "aiko-slider__viewport";
    var track = doc.createElement("div");
    track.className = "aiko-slider__track";
    viewport.appendChild(track);

    items.forEach(function (item) {
      track.appendChild(buildSlide(item, doc));
    });
    root.appendChild(viewport);

    var index = 0;
    var timer = null;
    var dots = [];

    function render() {
      track.style.transform = "translate3d(" + -index * 100 + "%,0,0)";
      dots.forEach(function (dot, i) {
        dot.setAttribute("aria-current", i === index ? "true" : "false");
      });
    }

    function goTo(next, userInitiated) {
      if (settings.loop) {
        index = (next + items.length) % items.length;
      } else {
        index = Math.max(0, Math.min(items.length - 1, next));
      }
      render();
      if (userInitiated) restart();
    }

    if (settings.showArrows && items.length > 1) {
      var arrowSet = ARROWS[settings.arrowStyle] || ARROWS.default;
      ["prev", "next"].forEach(function (dir) {
        var btn = doc.createElement("button");
        btn.type = "button";
        btn.className = "aiko-slider__arrow aiko-slider__arrow--" + dir;
        btn.setAttribute("aria-label", dir === "prev" ? "Previous testimonial" : "Next testimonial");
        btn.innerHTML = dir === "prev" ? arrowSet.left : arrowSet.right;
        btn.addEventListener("click", function () {
          goTo(index + (dir === "prev" ? -1 : 1), true);
        });
        root.appendChild(btn);
      });
    }

    if (settings.showDots && items.length > 1) {
      var dotWrap = doc.createElement("div");
      dotWrap.className = "aiko-slider__dots";
      items.forEach(function (_, i) {
        var dot = doc.createElement("button");
        dot.type = "button";
        dot.className = "aiko-slider__dot";
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i, true);
        });
        dotWrap.appendChild(dot);
        dots.push(dot);
      });
      root.appendChild(dotWrap);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      if (!settings.autoplay || items.length < 2) return;
      stop();
      timer = setInterval(function () {
        goTo(index + 1);
      }, Math.max(1200, settings.autoplaySpeed));
    }

    function restart() {
      stop();
      start();
    }

    if (settings.pauseOnHover) {
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);
    }

    doc.addEventListener("visibilitychange", function () {
      if (doc.hidden) stop();
      else start();
    });

    if (settings.swipe) {
      var startX = null;
      viewport.addEventListener(
        "touchstart",
        function (e) {
          startX = e.touches[0].clientX;
          stop();
        },
        { passive: true }
      );
      viewport.addEventListener(
        "touchend",
        function (e) {
          if (startX === null) return;
          var delta = e.changedTouches[0].clientX - startX;
          if (Math.abs(delta) > 40) goTo(index + (delta < 0 ? 1 : -1), true);
          else start();
          startX = null;
        },
        { passive: true }
      );
    }

    render();
    start();
  }

  // Squarespace (and other builders) render the site inside an editor iframe
  // and re-write the DOM every time you save. Collect every same-origin
  // document we are allowed to touch so the slider renders in edit mode too.
  function scanDocs() {
    var docs = [document];
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) {
      try {
        var d = frames[i].contentDocument;
        if (d && d.body && docs.indexOf(d) === -1) docs.push(d);
      } catch (e) {
        /* cross-origin frame — ignore */
      }
    }
    return docs;
  }

  var STYLE_HREF = "https://ghosthub.boo/plugins/aiko-testimonial-slider/style.css";

  function ensureStyles(doc) {
    try {
      if (doc.querySelector('link[href*="aiko-testimonial-slider"]')) return;
      var link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = STYLE_HREF;
      (doc.head || doc.documentElement).appendChild(link);
    } catch (e) {
      /* noop */
    }
  }

  function isEditor() {
    try {
      return (
        /(^|\/)config(\/|$)/.test(location.pathname) ||
        !!document.querySelector(
          ".sqs-edit-mode, .sqs-edit-mode-active, body[data-edit-mode], #sqs-cms"
        ) ||
        window.top !== window.self
      );
    } catch (e) {
      return true;
    }
  }

  function initAll() {
    // Accept either the data-attribute hook or the plain class, so a copied
    // markup snippet still works if one of them is dropped by the host editor.
    var docs = scanDocs();
    for (var d = 0; d < docs.length; d++) {
      var doc = docs[d];
      var roots = doc.querySelectorAll("[data-aiko], .aiko-slider");
      if (!roots.length) continue;
      ensureStyles(doc);
      for (var i = 0; i < roots.length; i++) init(roots[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  window.addEventListener("load", initAll);

  // The installation config arrives asynchronously. Rebuild every slider once
  // it lands so saved images and script settings replace the pasted markup.
  document.addEventListener("ghost:config", function () {
    try {
      var stale = document.querySelectorAll('[data-aiko-ready="true"]');
      for (var i = 0; i < stale.length; i++) stale[i].removeAttribute("data-aiko-ready");
    } catch (e) {}
    initAll();
  });
  // Squarespace / Ajax page loads
  document.addEventListener("mercury:load", initAll);
  window.addEventListener("pageshow", initAll);

  // Some hosts render blocks a moment after load — poll briefly, then stop.
  // In a page editor the DOM is rebuilt on every save, so keep watching there.
  var tries = 0;
  var editing = isEditor();
  var poll = setInterval(
    function () {
      initAll();
      if (!editing && ++tries > 20) clearInterval(poll);
    },
    editing ? 700 : 250
  );


  // Host sites can also inject blocks much later (lazy sections, editor) — re-scan safely.
  if (typeof MutationObserver === "function") {
    var pending = null;
    new MutationObserver(function () {
      if (pending) return;
      pending = setTimeout(function () {
        pending = null;
        initAll();
      }, 120);
    }).observe(document.documentElement, { childList: true, subtree: true });
  }


  window.AikoTestimonialSlider = {
    version: "1.4.0",
    init: init,
    initAll: initAll,
    // Paste AikoTestimonialSlider.debug() in the browser console to see what
    // the script can find on the page.
    debug: function () {
      var roots = document.querySelectorAll("[data-aiko], .aiko-slider");
      var report = {
        version: "1.4.0",
        stylesheetLoaded: !!document.querySelector('link[href*="aiko-testimonial-slider"]'),
        wrappersFound: roots.length,
        wrappers: []
      };
      for (var i = 0; i < roots.length; i++) {
        report.wrappers.push({
          ready: roots[i].getAttribute("data-aiko-ready") === "true",
          items: readItems(roots[i]).length
        });
      }
      if (window.console && console.log) console.log("[Aiko]", report);
      return report;
    }
  };
})();
