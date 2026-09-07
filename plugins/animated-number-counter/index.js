/* Animated Number Counter, Ghost Plugins  v1.0.0
   Dependency-free number counters that animate when they scroll into view. */
(function () {
  "use strict";

  var DEFAULTS = {
    prefix: "",              // text before every number, e.g. "$"
    suffix: "",              // text after every number, e.g. ".00" or "+"
    thousandsSeparator: true, // 1,000 style grouping
    decimals: 0,             // decimal places on the animated value
    duration: 2000,          // count duration in ms
    startFrom: 0,            // value the count starts at
    easing: "easeOut",       // easeOut | easeInOut | linear
    animationStyle: "fade-up", // fade-up | fade | scale | blur | flip | none
    animationSpeed: 700,     // card reveal speed in ms
    stagger: 120,            // delay between cards in ms
    animateOnce: true,       // replay when scrolled back into view?
    threshold: 0.25,         // how much of the card must be visible
    columns: 3,
    columnsTablet: 2,
    columnsMobile: 1,
    showIcons: true,
    showTitles: true,
    showDescriptions: true,
    cardShadow: true
  };

  function cfg(root) {
    var global = window.AnimatedCounterConfig || {};
    var live = (window.GhostPlugins && window.GhostPlugins.config &&
      window.GhostPlugins.config["animated-number-counter"]) || {};
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

  function bool(v, fallback) {
    if (v === undefined || v === null || v === "") return fallback;
    return !(v === false || v === "false" || v === 0 || v === "0");
  }
  function num(v, fallback) {
    var n = parseFloat(v);
    return isNaN(n) ? fallback : n;
  }

  var EASINGS = {
    linear: function (t) { return t; },
    easeOut: function (t) { return 1 - Math.pow(1 - t, 3); },
    easeInOut: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  };

  function format(value, o) {
    var decimals = Math.max(0, Math.min(4, num(o.decimals, 0)));
    var fixed = Number(value).toFixed(decimals);
    var parts = fixed.split(".");
    if (bool(o.thousandsSeparator, true)) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return String(o.prefix || "") + parts.join(".") + String(o.suffix || "");
  }

  function readItems(root) {
    var nodes = root.querySelectorAll("[data-anc-item]");
    var items = [];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      items.push({
        number: n.getAttribute("data-number") || n.textContent.trim() || "0",
        title: n.getAttribute("data-title") || "",
        desc: n.getAttribute("data-desc") || n.getAttribute("data-description") || "",
        icon: n.getAttribute("data-icon") || "",
        prefix: n.getAttribute("data-prefix"),
        suffix: n.getAttribute("data-suffix")
      });
    }
    return items;
  }

  function build(root, items, o) {
    var frag = document.createDocumentFragment();
    var cards = [];
    items.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "anc-stats__item";
      card.setAttribute("data-anc-anim", String(o.animationStyle || "fade-up"));

      if (bool(o.showIcons, true) && item.icon) {
        var icon = document.createElement("span");
        icon.className = "anc-stats__icon";
        if (/^https?:|^\/\//.test(item.icon)) {
          var img = document.createElement("img");
          img.src = item.icon;
          img.alt = "";
          icon.appendChild(img);
        } else {
          icon.innerHTML = item.icon;
        }
        card.appendChild(icon);
      }

      if (bool(o.showTitles, true) && item.title) {
        var title = document.createElement("p");
        title.className = "anc-stats__title";
        title.textContent = item.title;
        card.appendChild(title);
      }

      var value = document.createElement("span");
      value.className = "anc-stats__number";
      var target = num(String(item.number).replace(/[^0-9.\-]/g, ""), 0);
      var opts = {
        prefix: item.prefix !== null && item.prefix !== undefined ? item.prefix : o.prefix,
        suffix: item.suffix !== null && item.suffix !== undefined ? item.suffix : o.suffix,
        decimals: o.decimals,
        thousandsSeparator: o.thousandsSeparator
      };
      value.textContent = format(num(o.startFrom, 0), opts);
      card.appendChild(value);

      if (bool(o.showDescriptions, true) && item.desc) {
        var desc = document.createElement("p");
        desc.className = "anc-stats__desc";
        desc.textContent = item.desc;
        card.appendChild(desc);
      }

      cards.push({ card: card, value: value, target: target, opts: opts });
      frag.appendChild(card);
    });

    root.querySelectorAll(".anc-stats__item").forEach(function (el) { el.remove(); });
    root.appendChild(frag);
    return cards;
  }

  function count(entry, o) {
    var duration = Math.max(120, num(o.duration, 2000));
    var ease = EASINGS[o.easing] || EASINGS.easeOut;
    var from = num(o.startFrom, 0);
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var v = from + (entry.target - from) * ease(t);
      entry.value.textContent = format(v, entry.opts);
      if (t < 1) requestAnimationFrame(tick);
      else entry.value.textContent = format(entry.target, entry.opts);
    }
    requestAnimationFrame(tick);
  }

  function apply(root, o) {
    root.style.setProperty("--anc-columns", String(num(o.columns, 3)));
    root.style.setProperty("--anc-columns-tablet", String(num(o.columnsTablet, 2)));
    root.style.setProperty("--anc-columns-mobile", String(num(o.columnsMobile, 1)));
    root.style.setProperty("--anc-speed", num(o.animationSpeed, 700) + "ms");
    root.classList.toggle("anc-stats--flat", !bool(o.cardShadow, true));
  }

  function init(root) {
    if (!root || root.getAttribute("data-anc-ready") === "1") return;
    var o = cfg(root);
    var items = readItems(root);
    if (!items.length) return;
    root.setAttribute("data-anc-ready", "1");
    apply(root, o);
    var cards = build(root, items, o);

    var once = bool(o.animateOnce, true);
    var stagger = Math.max(0, num(o.stagger, 120));

    function run(entry, i) {
      setTimeout(function () {
        entry.card.classList.add("is-visible");
        count(entry, o);
      }, i * stagger);
    }

    if (!("IntersectionObserver" in window)) {
      cards.forEach(run);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = cards.findIndex(function (c) { return c.card === e.target; });
        if (i < 0) return;
        if (e.isIntersecting) {
          run(cards[i], i);
          if (once) io.unobserve(e.target);
        } else if (!once) {
          cards[i].card.classList.remove("is-visible");
          cards[i].value.textContent = format(num(o.startFrom, 0), cards[i].opts);
        }
      });
    }, { threshold: Math.min(0.95, Math.max(0, num(o.threshold, 0.25))) });

    cards.forEach(function (c) { io.observe(c.card); });
  }

  function boot() {
    document.querySelectorAll("[data-anc], .anc-stats").forEach(init);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("ghost:config", boot);
  window.AnimatedCounter = { init: boot };
})();
