/* Scrolling Logo Marquee | Ghost Plugins | v1.2.3 | JavaScript */
(function () {
  "use strict";

  var MAX_LOGOS = 30;

  var DEFAULTS = {
    logos: "",
    logoHeight: 90,
    logoMaxWidth: 140,
    logoSpacing: 26,
    speed: 80,
    direction: "left",
    pauseOnHover: true,
    fadeEdges: true,
    fadeWidth: 96,
    logoOpacity: 100,
    hoverOpacity: 100,
    grayscale: false,
    background: "transparent",
    padding: 52,
    splitRows: true,
    rowDirection: "opposite",
    rowGap: 24,
    linkNewTab: true,
    wave: false,
    waveHeight: 12,
    waveSpeed: 3
  };

  var DEMO_LOGOS = [
    { name: "Tootie", tm: false, weight: 500, spacing: -0.5 },
    { name: "STONES", tm: false, weight: 800, spacing: 1 },
    { name: "The Parent", tm: false, weight: 600, spacing: -0.5 },
    { name: "FUGZ", tm: false, weight: 900, spacing: 0.5 },
    { name: "Halo Goods", tm: false, weight: 500, spacing: 0 },
    { name: "NORTHBAY", tm: false, weight: 700, spacing: 2 }
  ];

  var STYLE_ID = "gh-marquee-runtime-style-v123";
  var ROOT_SELECTOR = "[data-logo-marquee], .gh-marquee";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".gh-marquee{--mq-logo-height:34px;--mq-logo-max-width:200px;--mq-spacing:72px;--mq-fade:96px;--mq-opacity:1;--mq-opacity-hover:1;--mq-bg:transparent;--mq-padding:28px;--mq-row-gap:24px;--mq-grayscale:0;display:block;width:100%;background:var(--mq-bg);padding:var(--mq-padding) 0;overflow:hidden;box-sizing:border-box}" +
      ".gh-marquee--split .gh-marquee__row+.gh-marquee__row{margin-top:var(--mq-row-gap)}" +
      ".gh-marquee__row{position:relative;width:100%;overflow:hidden}" +
      ".gh-marquee--fade .gh-marquee__row{-webkit-mask-image:linear-gradient(to right,transparent 0,#000 var(--mq-fade),#000 calc(100% - var(--mq-fade)),transparent 100%);mask-image:linear-gradient(to right,transparent 0,#000 var(--mq-fade),#000 calc(100% - var(--mq-fade)),transparent 100%)}" +
      ".gh-marquee__track{display:flex;width:max-content;animation-name:gh-marquee-scroll;animation-timing-function:linear;animation-iteration-count:infinite}" +
      ".gh-marquee--pause:hover .gh-marquee__track{animation-play-state:paused}" +
      ".gh-marquee__group{display:flex;align-items:center;gap:var(--mq-spacing);padding-right:var(--mq-spacing)}" +
      ".gh-marquee__logo{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;opacity:var(--mq-opacity);filter:grayscale(var(--mq-grayscale));transition:opacity .25s ease,filter .25s ease;text-decoration:none;color:inherit}" +
      ".gh-marquee__logo:hover{opacity:var(--mq-opacity-hover);filter:grayscale(0)}" +
      ".gh-marquee__img,.gh-marquee__mark svg{display:block;height:var(--mq-logo-height)!important;width:auto!important;max-width:var(--mq-logo-max-width)!important;object-fit:contain}" +
      ".gh-marquee__mark{display:inline-flex;align-items:center;color:currentColor}" +
      "@keyframes gh-marquee-scroll{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}" +
      ".gh-marquee--wave .gh-marquee__row{padding:var(--mq-wave-height,12px) 0}" +
      ".gh-marquee--wave .gh-marquee__logo{animation:gh-marquee-wave var(--mq-wave-speed,3s) ease-in-out infinite;animation-delay:var(--mq-wave-delay,0s);will-change:transform}" +
      "@keyframes gh-marquee-wave{0%,100%{transform:translateY(calc(var(--mq-wave-height,12px) / 2))}50%{transform:translateY(calc(var(--mq-wave-height,12px) / -2))}}" +
      "@media (prefers-reduced-motion:reduce){.gh-marquee__track,.gh-marquee__logo{animation:none!important}}";
    (document.head || document.documentElement).appendChild(style);
  }

  function isEditor() {
    try {
      var b = document.body;
      return !!(b && b.classList.contains("sqs-edit-mode-active"));
    } catch (_error) {
      return true;
    }
  }

  function syncEditorState() {
    var editing = isEditor();
    var nodes = document.querySelectorAll(ROOT_SELECTOR);
    for (var i = 0; i < nodes.length; i += 1) {
      nodes[i].setAttribute("data-ghost-plugin", "scrolling-logo-marquee");
      if (editing) {
        nodes[i].style.setProperty("display", "none", "important");
      } else if (nodes[i].style.getPropertyValue("display") === "none") {
        nodes[i].style.removeProperty("display");
      }
    }
    return editing;
  }

  var measureCtx = null;
  function demoTextWidth(item) {
    var font = item.weight + ' 30px "Helvetica Neue", Helvetica, Arial, sans-serif';
    if (!measureCtx) measureCtx = document.createElement("canvas").getContext("2d");
    if (measureCtx) {
      measureCtx.font = font;
      return measureCtx.measureText(item.name).width + item.spacing * Math.max(0, item.name.length - 1);
    }
    return item.name.length * 30 * 0.72;
  }

  function demoLogo(item) {
    var width = Math.max(120, Math.ceil(demoTextWidth(item)) + 16 + (item.tm ? 22 : 0));
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' 48" width="' + width + '" height="48">' +
      '<text x="' + width / 2 + '" y="34" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30"' +
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
    var G0 = window.GhostPlugins;
    var live = (G0 && (G0.configFor ? G0.configFor(el, "scrolling-logo-marquee") : (G0.config && G0.config["scrolling-logo-marquee"]))) || {};
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
      /* Plugin Studio saves the new tab choice next to the link option. */
      var tab = [live["logo" + i + "Link_new_tab"], live["logo" + i + "_new_tab"], global["logo" + i + "Link_new_tab"], global["logo" + i + "_new_tab"]]
        .filter(function (v) { return v !== undefined && v !== null && v !== ""; })[0];
      slots.push({
        src: src,
        name: String(live["logo" + i + "Name"] || global["logo" + i + "Name"] || "").trim(),
        alt: String(live["logo" + i + "Alt"] || global["logo" + i + "Alt"] || "").trim(),
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
      var nodes = (el.ghMarqueeSource || el).querySelectorAll("img[src]");
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
      media.alt = item.alt || item.name || "";
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
    wrap.style.setProperty("--mq-wave-delay", (-(index % 12) * 0.25).toFixed(2) + "s");
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
    s.setProperty("--mq-wave-height", Number(o.waveHeight) + "px");
    s.setProperty("--mq-wave-speed", Math.max(0.5, Number(o.waveSpeed) || 3) + "s");
    root.classList.toggle("gh-marquee--wave", !!o.wave);
  }

  function render(root) {
    root.setAttribute("data-ghost-plugin", "scrolling-logo-marquee");
    /* Remember the original markup once, so repeated renders never read back
       the logos this script generated and duplicate the row. */
    if (!root.ghMarqueeSource) {
      var source = document.createElement("div");
      source.innerHTML = root.innerHTML;
      root.ghMarqueeSource = source;
    }
    var o = readConfig(root);
    /* Skip identical re-renders (window load, repeated config events) so the
       track never restarts or flashes a different number of logos. */
    var signature = JSON.stringify(o);
    if (root.ghMarqueeSignature === signature && root.classList.contains("gh-ready")) return;
    root.ghMarqueeSignature = signature;
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

  /* When a saved install is still fetching its settings, wait for them so
     visitors never see default or demo logos before the real ones. */
  function configPending() {
    var G = window.GhostPlugins;
    if (!G || !G.installs) return false;
    if (G.config && G.config["scrolling-logo-marquee"]) return false;
    for (var id in G.installs) {
      if (Object.prototype.hasOwnProperty.call(G.installs, id) && G.installs[id] && G.installs[id].loading) return true;
    }
    return false;
  }

  var waited = false;
  function boot() {
    ensureStyles();
    if (syncEditorState()) return;
    if (configPending() && !waited) {
      if (!boot.timer) boot.timer = setTimeout(function () { waited = true; boot(); }, 2500);
      return;
    }
    var nodes = document.querySelectorAll(ROOT_SELECTOR);
    for (var i = 0; i < nodes.length; i += 1) render(nodes[i]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("ghost:config", boot);
  window.addEventListener("load", boot);
  document.addEventListener("mercury:load", boot);
  window.addEventListener("pageshow", boot);
  var editorWasActive = isEditor();
  var editorObserver = new MutationObserver(function () {
    var editing = syncEditorState();
    if (editorWasActive && !editing) boot();
    editorWasActive = editing;
  });
  editorObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-edit-mode"] });
  if (document.body) {
    editorObserver.observe(document.body, { attributes: true, childList: true, attributeFilter: ["class", "data-edit-mode"] });
  }
  window.LogoMarquee = { init: boot, reboot: boot };
})();

