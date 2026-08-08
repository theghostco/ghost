/*!
 * Aiko Testimonial Slider — Ghost Plugins  v1.1.1
 * Standalone browser plugin. Works on any site (Squarespace, Webflow, WordPress, plain HTML).
 * Configure with window.AikoSliderConfig or per-slider data-attributes.
 */
(function () {
  "use strict";

  var DEFAULTS = {
    autoplay: true,
    autoplaySpeed: 5000,
    transitionSpeed: 500,
    loop: true,
    showArrows: true,
    showDots: true,
    pauseOnHover: true,
    swipe: true
  };

  var ARROW_LEFT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  var ARROW_RIGHT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';

  function bool(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return String(value) !== "false";
  }

  function num(value, fallback) {
    var n = parseInt(value, 10);
    return isNaN(n) ? fallback : n;
  }

  function readSettings(root) {
    var global = window.AikoSliderConfig || {};
    var d = root.dataset;
    return {
      autoplay: bool(d.autoplay, bool(global.autoplay, DEFAULTS.autoplay)),
      autoplaySpeed: num(d.autoplaySpeed, num(global.autoplaySpeed, DEFAULTS.autoplaySpeed)),
      transitionSpeed: num(d.transitionSpeed, num(global.transitionSpeed, DEFAULTS.transitionSpeed)),
      loop: bool(d.loop, bool(global.loop, DEFAULTS.loop)),
      showArrows: bool(d.arrows, bool(global.showArrows, DEFAULTS.showArrows)),
      showDots: bool(d.dots, bool(global.showDots, DEFAULTS.showDots)),
      pauseOnHover: bool(d.pauseOnHover, bool(global.pauseOnHover, DEFAULTS.pauseOnHover)),
      swipe: bool(d.swipe, bool(global.swipe, DEFAULTS.swipe))
    };
  }

  function readItems(root) {
    // Preferred hook, then a class fallback, then "any direct child of the
    // source wrapper" so slightly-edited markup on the host site still works.
    var nodes = root.querySelectorAll("[data-aiko-item]");
    if (!nodes.length) nodes = root.querySelectorAll(".aiko-item");
    if (!nodes.length) {
      var source = root.querySelector(".aiko-slider__source");
      if (source) nodes = source.children;
    }
    var items = [];

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      items.push({
        image: node.getAttribute("data-image") || "",
        alt: node.getAttribute("data-alt") || node.getAttribute("data-title") || "Testimonial",
        title: node.getAttribute("data-title") || "",
        subtitle: node.getAttribute("data-subtitle") || "",
        text: (node.innerHTML || "").trim()
      });
    }
    return items;
  }

  function buildSlide(item) {
    var slide = document.createElement("article");
    slide.className = "aiko-slide";
    slide.setAttribute("role", "group");

    var media = document.createElement("div");
    media.className = "aiko-slide__media";
    if (item.image) {
      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.alt;
      img.loading = "lazy";
      media.appendChild(img);
    }

    var body = document.createElement("div");
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
    if (root.getAttribute("data-aiko-ready") === "true") return;

    var items = readItems(root);
    if (!items.length) {
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


    var settings = readSettings(root);
    root.setAttribute("data-aiko-ready", "true");
    root.style.setProperty("--aiko-speed", settings.transitionSpeed + "ms");

    var source = root.querySelector(".aiko-slider__source");
    if (source) source.setAttribute("hidden", "hidden");

    var viewport = document.createElement("div");
    viewport.className = "aiko-slider__viewport";
    var track = document.createElement("div");
    track.className = "aiko-slider__track";
    viewport.appendChild(track);

    items.forEach(function (item) {
      track.appendChild(buildSlide(item));
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
      ["prev", "next"].forEach(function (dir) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "aiko-slider__arrow aiko-slider__arrow--" + dir;
        btn.setAttribute("aria-label", dir === "prev" ? "Previous testimonial" : "Next testimonial");
        btn.innerHTML = dir === "prev" ? ARROW_LEFT : ARROW_RIGHT;
        btn.addEventListener("click", function () {
          goTo(index + (dir === "prev" ? -1 : 1), true);
        });
        root.appendChild(btn);
      });
    }

    if (settings.showDots && items.length > 1) {
      var dotWrap = document.createElement("div");
      dotWrap.className = "aiko-slider__dots";
      items.forEach(function (_, i) {
        var dot = document.createElement("button");
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

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
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

  function initAll() {
    // Accept either the data-attribute hook or the plain class, so a copied
    // markup snippet still works if one of them is dropped by the host editor.
    var roots = document.querySelectorAll("[data-aiko], .aiko-slider");
    for (var i = 0; i < roots.length; i++) init(roots[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  window.addEventListener("load", initAll);
  // Squarespace / Ajax page loads
  document.addEventListener("mercury:load", initAll);
  window.addEventListener("pageshow", initAll);

  // Some hosts render blocks a moment after load — poll briefly, then stop.
  var tries = 0;
  var poll = setInterval(function () {
    initAll();
    if (++tries > 20) clearInterval(poll);
  }, 250);

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
    version: "1.1.1",
    init: init,
    initAll: initAll,
    // Paste AikoTestimonialSlider.debug() in the browser console to see what
    // the script can find on the page.
    debug: function () {
      var roots = document.querySelectorAll("[data-aiko], .aiko-slider");
      var report = {
        version: "1.1.1",
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
