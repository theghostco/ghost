/* Scrolling Logo Marquee, Ghost Plugins  v1.1.0
   Standalone browser script. No dependencies.
   Config: window.LogoMarqueeConfig, live Plugin Studio settings, or per block data attributes. */
(function () {
  "use strict";

  var MAX_LOGOS = 30;

  var DEFAULTS = {
    logos: "",
    logoHeight: 71,
    logoMaxWidth: 176,
    logoSpacing: 32,
    speed: 80,
    direction: "left",
    pauseOnHover: true,
    fadeEdges: true,
    fadeWidth: 96,
    logoOpacity: 100,
    hoverOpacity: 100,
    grayscale: false,
    background: "transparent",
    padding: 34,
    splitRows: false,
    rowDirection: "opposite",
    rowGap: 24,
    linkNewTab: true
  };

  var DEMO_LOGOS = [
    { name: "Tootie", tm: false, weight: 500, spacing: -0.5 },
    { name: "STONES", tm: false, weight: 800, spacing: 1 },
    { name: "The Parent", tm: false, weight: 600, spacing: -0.5 },
    { name: "FUGZ", tm: false, weight: 900, spacing: 0.5 },
    { name: "Halo Goods", tm: false, weight: 500, spacing: 0 },
    { name: "NORTHBAY", tm: false, weight: 700, spacing: 2 }
  ];

  function demoLogo(item) {
    var width = Math.max(120, item.name.length * 22 + (item.tm ? 22 : 0));
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' 48" width="' + width + '" height="48">' +
      '<text x="0" y="34" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30"' +
      ' font-weight="' + item.weight + '" letter-spacing="' + item.spacing + '" fill="currentColor">' +
      item.name.replace(/&/g, "&amp;") + "</text>" +
      (item.tm ? '<text x="' + (width - 18) + '" y="16" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="11" fill="currentColor">TM</text>' : "") +
      "</svg>";
  }

  function camelToDash(key) {
    return key.replace(/[A-Z]/g, function (c) { return "-" + c.toLowerCase(); });
  }

  function coerce(fallback, raw) {
    if (raw === null || raw === undefined || raw === "") return fallback;
    if (typeof fallback === "number") {
      var n = parseFloat(raw);
      return isFinite(n) ? n : fallback;
    }
    if (typeof fallback === "boolean") return String(raw) !== "false" && String(raw) !== "0";
    return String(raw);
  }

  function readConfig(el) {
    var global = window.LogoMarqueeConfig || {};
    var live = (window.GhostPlugins && window.GhostPlugins.config && window.GhostPlugins.config["scrolling-logo-marquee"]) || {};
    var out = {};
    var key;
    for (key in DEFAULTS) if (Object.prototype.hasOwnProperty.call(DEFAULTS, key)) out[key] = DEFAULTS[key];
    [global, live].forEach(function (src) {
      for (var k in out) if (Object.prototype.hasOwnProperty.call(out, k)) out[k] = coerce(out[k], src[k]);
    });

    var slots = [];
    for (var i = 1; i <= MAX_LOGOS; i += 1) {
      var src = String(live["logo" + i] || global["logo" + i] || el.getAttribute("data-logo-" + i) || "").trim();
      if (!src) continue;
      var tab = live["logo" + i + "_new_tab"] !== undefined ? live["logo" + i + "_new_tab"] : global["logo" + i + "_new_tab"];
      slots.push({
        src: src,
        name: String(live["logo" + i + "Name"] || global["logo" + i + "Name"] || "").trim(),
        link: String(live["logo" + i + "Link"] || global["logo" + i + "Link"] || "").trim(),
        newTab: coerce(true, tab)
      });
    }

    for (key in out) {
      if (!Object.prototype.hasOwnProperty.call(out, key)) continue;
      var attr = el.getAttribute("data-" + camelToDash(key));
      if (attr !== null && attr !== "") out[key] = coerce(out[key], attr);
    }

    if (!slots.length) {
      var nodes = el.querySelectorAll("img[src]");
      for (var n = 0; n < nodes.length && slots.length < MAX_LOGOS; n += 1) {
        var img = nodes[n];
        var anchor = img.closest("a");
        slots.push({
          src: img.getAttribute("src"),
          name: img.getAttribute("alt") || "",
          link: anchor ? anchor.getAttribute("href") || "" : "",
          newTab: anchor ? anchor.getAttribute("target") === "_blank" : out.linkNewTab
        });
      }
    }

    if (!slots.length && String(out.logos).trim()) {
      String(out.logos).split(/[\n,]+/).forEach(function (url) {
        var clean = url.trim();
        if (clean && slots.length < MAX_LOGOS) slots.push({ src: clean, name: "", link: "", newTab: out.linkNewTab });
      });
    }

    out.items = slots;
    return out;
  }

  function makeLogo(item, o, index) {
    var media;
    if (item.demo) {
      media = document.createElement("span");
      media.className = "gh-marquee__mark";
      media.innerHTML = demoLogo(item.demo);
    } else {
      media = document.createElement("img");
      media.className = "gh-marquee__img";
      media.src = item.src;
      media.alt = item.name || "";
      media.loading = "lazy";
      media.decoding = "async";
      media.draggable = false;
    }

    var wrap;
    if (item.link) {
      wrap = document.createElement("a");
      wrap.href = item.link;
      if (item.newTab) {
        wrap.target = "_blank";
        wrap.rel = "noopener noreferrer";
      }
      if (!item.name) wrap.setAttribute("aria-label", "Partner logo");
    } else {
      wrap = document.createElement("span");
    }
    wrap.className = "gh-marquee__logo";
    wrap.appendChild(media);
    return wrap;
  }

  function buildRow(items, o, direction) {
    var row = document.createElement("div");
    row.className = "gh-marquee__row";

    var track = document.createElement("div");
    track.className = "gh-marquee__track";
    track.style.animationDuration = Math.max(4, Number(o.speed) || 32) + "s";
    track.style.animationDirection = direction === "right" ? "reverse" : "normal";

    var filled = [];
    var reps = Math.max(1, Math.ceil(12 / Math.max(1, items.length)));
    for (var r = 0; r < reps; r += 1) filled = filled.concat(items);

    for (var copy = 0; copy < 2; copy += 1) {
      var group = document.createElement("div");
      group.className = "gh-marquee__group";
      group.setAttribute("aria-hidden", copy === 1 ? "true" : "false");
      filled.forEach(function (item, i) {
        group.appendChild(makeLogo(item, o, i));
      });
      track.appendChild(group);
    }

    row.appendChild(track);
    return row;
  }

  function apply(root, o) {
    var s = root.style;
    s.setProperty("--mq-logo-height", Number(o.logoHeight) + "px");
    s.setProperty("--mq-logo-max-width", Number(o.logoMaxWidth) + "px");
    s.setProperty("--mq-spacing", Number(o.logoSpacing) + "px");
    s.setProperty("--mq-fade", (o.fadeEdges ? Number(o.fadeWidth) : 0) + "px");
    s.setProperty("--mq-opacity", (Number(o.logoOpacity) / 100).toFixed(2));
    s.setProperty("--mq-opacity-hover", (Number(o.hoverOpacity) / 100).toFixed(2));
    s.setProperty("--mq-bg", String(o.background || "transparent"));
    s.setProperty("--mq-padding", Number(o.padding) + "px");
    s.setProperty("--mq-row-gap", Number(o.rowGap) + "px");
    s.setProperty("--mq-grayscale", o.grayscale ? "1" : "0");
    root.classList.toggle("gh-marquee--pause", !!o.pauseOnHover);
    root.classList.toggle("gh-marquee--fade", !!o.fadeEdges);
  }

  function render(root) {
    var o = readConfig(root);
    var items = o.items;

    if (!items.length) {
      items = DEMO_LOGOS.map(function (d) {
        return { src: "", name: d.name, link: "", newTab: false, demo: d };
      });
    }

    apply(root, o);
    root.innerHTML = "";

    if (o.splitRows && items.length > 1) {
      var half = Math.ceil(items.length / 2);
      var first = items.slice(0, half);
      var second = items.slice(half);
      if (!second.length) second = first.slice();
      var otherDirection = o.rowDirection === "same" ? o.direction : (o.direction === "right" ? "left" : "right");
      root.appendChild(buildRow(first, o, o.direction));
      root.appendChild(buildRow(second, o, otherDirection));
      root.classList.add("gh-marquee--split");
    } else {
      root.classList.remove("gh-marquee--split");
      root.appendChild(buildRow(items, o, o.direction));
    }

    root.classList.add("gh-ready");
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-logo-marquee], .gh-marquee");
    for (var i = 0; i < nodes.length; i += 1) render(nodes[i]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("ghost:config", boot);
  window.addEventListener("load", boot);
  window.LogoMarquee = { init: boot, reboot: boot };
})();
