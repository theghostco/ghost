/*!
 * Kuro Image Hover List — Ghost Plugins  v1.0.0
 * Standalone browser plugin. Works on any site (Squarespace, Webflow, WordPress, plain HTML).
 * Configure with window.KuroHoverListConfig, window.GhostPluginConfig, or per-list data-attributes.
 */
(function () {
  "use strict";

  // The loader can be present twice (site-wide code injection + a code block).
  if (window.KuroImageHoverList) {
    try { window.KuroImageHoverList.initAll(); } catch (e) {}
    return;
  }

  var DEFAULTS = {
    clickableTitles: true,
    openInNewTab: false,
    hoverStyle: "dim",            // dim | slide | underline | outline | italic | scale | none
    imagePlacement: "cursor",     // cursor | right | left | center | overlap
    captionPosition: "top-right", // top-left | top-right | bottom-left | bottom-right | hidden
    showCaption: true,
    followSpeed: 0.16,            // cursor easing (0 = no follow, 1 = instant)
    mobileMode: "stacked",        // stacked | hidden | tap
    activateFirst: false
  };

  var PLACEMENTS = ["cursor", "right", "left", "center", "overlap"];
  var HOVER_STYLES = ["dim", "slide", "underline", "outline", "italic", "scale", "none"];
  var CAPTIONS = ["top-left", "top-right", "bottom-left", "bottom-right", "hidden"];
  var MOBILE_MODES = ["stacked", "hidden", "tap"];

  function bool(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return String(value) !== "false";
  }

  function numf(value, fallback) {
    var n = parseFloat(value);
    return isNaN(n) ? fallback : n;
  }

  function pick(value, choices, fallback) {
    return choices.indexOf(value) !== -1 ? value : fallback;
  }

  function isMobile() {
    return window.matchMedia && window.matchMedia("(max-width: 700px)").matches;
  }

  /**
   * Settings saved in the Ghost Plugin Editor for this installation.
   * The bootstrap loader (data-ghost-key) fetches them and stores the merged
   * object here, so edits go live without re-pasting any markup.
   */
  function liveConfig() {
    try {
      var G = window.GhostPlugins;
      var live = G && G.config && G.config["kuro-image-hover-list"];
      return live && typeof live === "object" ? live : {};
    } catch (e) {
      return {};
    }
  }

  function readSettings(root) {
    var live = liveConfig();
    var global = window.KuroHoverListConfig || {};
    var ghost = window.GhostPluginConfig || {};
    var d = root.dataset;
    function cfg(key, fallback) {
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
      clickableTitles: bool(cfg("clickableTitles", DEFAULTS.clickableTitles), DEFAULTS.clickableTitles),
      openInNewTab: bool(cfg("openInNewTab", DEFAULTS.openInNewTab), DEFAULTS.openInNewTab),
      showCaption: bool(cfg("showCaption", DEFAULTS.showCaption), DEFAULTS.showCaption),
      activateFirst: bool(cfg("activateFirst", DEFAULTS.activateFirst), DEFAULTS.activateFirst),
      hoverStyle: pick(String(cfg("hoverStyle", DEFAULTS.hoverStyle)), HOVER_STYLES, DEFAULTS.hoverStyle),
      imagePlacement: pick(String(cfg("imagePlacement", DEFAULTS.imagePlacement)), PLACEMENTS, DEFAULTS.imagePlacement),
      captionPosition: pick(String(cfg("captionPosition", DEFAULTS.captionPosition)), CAPTIONS, DEFAULTS.captionPosition),
      mobileMode: pick(String(cfg("mobileMode", DEFAULTS.mobileMode)), MOBILE_MODES, DEFAULTS.mobileMode),
      followSpeed: Math.min(1, Math.max(0.02, numf(cfg("followSpeed", DEFAULTS.followSpeed), DEFAULTS.followSpeed)))
    };
  }

  /** Rows saved in the editor (i1..i12), when this install has any. */
  function liveItems() {
    var live = liveConfig();
    var items = [];
    for (var i = 1; i <= 12; i++) {
      var p = "i" + i + "_";
      var title = live[p + "title"];
      var image = live[p + "image"];
      var url = live[p + "url"];
      var caption = live[p + "caption"];
      title = title == null ? "" : String(title).trim();
      image = image == null ? "" : String(image).trim();
      url = url == null ? "" : String(url).trim();
      caption = caption == null ? "" : String(caption).trim();
      if (!title && !image) continue;
      items.push({ title: title, image: image, url: url, caption: caption || title });
    }
    return items;
  }

  function readItems(root) {
    var live = liveItems();
    if (live.length) return live;

    // Squarespace can concatenate adjacent data attributes when a Code Block is
    // saved (`data-kuro-itemdata-image`), so both spellings are accepted.
    var nodes = root.querySelectorAll("[data-kuro-item], [data-kuro-itemdata-image]");
    if (!nodes.length) nodes = root.querySelectorAll(".kuro-source-item");
    if (!nodes.length) {
      var source = root.querySelector(".kuro-list__source");
      if (source) nodes = source.children;
    }
    var items = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var title = (node.getAttribute("data-title") || node.textContent || "").trim();
      items.push({
        title: title,
        image:
          node.getAttribute("data-image") ||
          node.getAttribute("data-kuro-itemdata-image") ||
          "",
        url: node.getAttribute("data-url") || node.getAttribute("href") || "",
        caption: (node.getAttribute("data-caption") || title || "").trim()
      });
    }
    return items;
  }

  function el(doc, tag, cls) {
    var node = doc.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }

  function build(root, items, s) {
    var doc = root.ownerDocument || document;

    root.classList.add("kuro-list");
    root.classList.toggle("kuro-list--clickable", s.clickableTitles);
    PLACEMENTS.forEach(function (p) { root.classList.remove("kuro-list--place-" + p); });
    HOVER_STYLES.forEach(function (h) { root.classList.remove("kuro-list--hover-" + h); });
    MOBILE_MODES.forEach(function (m) { root.classList.remove("kuro-list--mobile-" + m); });
    root.classList.add("kuro-list--place-" + s.imagePlacement);
    root.classList.add("kuro-list--hover-" + s.hoverStyle);
    root.classList.add("kuro-list--mobile-" + s.mobileMode);

    var existing = root.querySelector(".kuro-list__items");
    if (existing) existing.parentNode.removeChild(existing);
    var oldMedia = root.querySelector(".kuro-list__media");
    if (oldMedia) oldMedia.parentNode.removeChild(oldMedia);

    var list = el(doc, "ul", "kuro-list__items");
    var rows = [];

    items.forEach(function (item, index) {
      var li = el(doc, "li", "kuro-item");
      var link = el(doc, s.clickableTitles && item.url ? "a" : "span", "kuro-item__link");
      if (s.clickableTitles && item.url) {
        link.setAttribute("href", item.url);
        if (s.openInNewTab) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        }
      }
      link.textContent = item.title;
      li.appendChild(link);

      if (item.image) {
        var thumb = el(doc, "div", "kuro-item__thumb");
        var timg = el(doc, "img");
        timg.src = item.image;
        timg.alt = item.caption || item.title || "";
        timg.loading = "lazy";
        thumb.appendChild(timg);
        li.appendChild(thumb);
      }

      list.appendChild(li);
      rows.push({ li: li, item: item, index: index });
    });

    var media = el(doc, "div", "kuro-list__media");
    var inner = el(doc, "div", "kuro-list__media-inner");
    var imgs = items.map(function (item) {
      var img = el(doc, "img");
      if (item.image) img.src = item.image;
      img.alt = item.caption || item.title || "";
      img.loading = "lazy";
      inner.appendChild(img);
      return img;
    });
    var caption = el(doc, "div", "kuro-list__caption kuro-list__caption--" + (s.showCaption ? s.captionPosition : "hidden"));
    inner.appendChild(caption);
    media.appendChild(inner);

    root.appendChild(list);
    root.appendChild(media);

    return { rows: rows, media: media, imgs: imgs, caption: caption };
  }

  function initOne(root) {
    if (!root || root.getAttribute("data-kuro-ready") === "1") {
      if (root && root.__kuroRefresh) root.__kuroRefresh();
      return;
    }

    function render() {
      var s = readSettings(root);
      var items = readItems(root);
      if (!items.length) return;

      var built = build(root, items, s);
      var media = built.media;
      var current = -1;

      // Cursor-following placement: ease the image toward the pointer.
      var target = { x: 0, y: 0 };
      var pos = { x: 0, y: 0 };
      var raf = null;
      var following = s.imagePlacement === "cursor";

      function place() {
        pos.x += (target.x - pos.x) * s.followSpeed;
        pos.y += (target.y - pos.y) * s.followSpeed;
        media.style.translate = Math.round(pos.x) + "px " + Math.round(pos.y) + "px";
        raf = requestAnimationFrame(place);
      }

      function stopFollow() {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      }

      function setTargetFromEvent(e) {
        var rect = root.getBoundingClientRect();
        var w = media.offsetWidth || 320;
        var h = media.offsetHeight || 240;
        target.x = e.clientX - rect.left - w / 2;
        target.y = e.clientY - rect.top - h / 2;
      }

      function show(index, e) {
        if (isMobile() && s.mobileMode !== "tap") return;
        if (index === current) return;
        current = index;
        built.imgs.forEach(function (img, i) {
          img.classList.toggle("is-current", i === index);
        });
        var item = built.rows[index] ? built.rows[index].item : null;
        built.caption.textContent = item ? (item.caption || item.title || "") : "";
        media.classList.add("is-visible");
        root.classList.add("is-hovering");
        built.rows.forEach(function (r, i) { r.li.classList.toggle("is-active", i === index); });
        if (following) {
          if (e) setTargetFromEvent(e);
          if (!raf) {
            pos.x = target.x;
            pos.y = target.y;
            raf = requestAnimationFrame(place);
          }
        }
      }

      function hide() {
        current = -1;
        media.classList.remove("is-visible");
        root.classList.remove("is-hovering");
        built.rows.forEach(function (r) { r.li.classList.remove("is-active"); });
        stopFollow();
      }

      built.rows.forEach(function (row, index) {
        row.li.addEventListener("mouseenter", function (e) { show(index, e); });
        row.li.addEventListener("focusin", function () { show(index); });
        if (isMobile() && s.mobileMode === "tap") {
          row.li.addEventListener("click", function (e) {
            if (current !== index) {
              e.preventDefault();
              show(index);
            }
          });
        }
      });

      root.addEventListener("mousemove", function (e) {
        if (!following || current < 0) return;
        setTargetFromEvent(e);
      });
      root.addEventListener("mouseleave", hide);
      root.addEventListener("focusout", function (e) {
        if (!root.contains(e.relatedTarget)) hide();
      });

      if (s.activateFirst && !isMobile()) show(0);

      root.setAttribute("data-kuro-ready", "1");
      root.__kuroCleanup = stopFollow;
    }

    root.__kuroRefresh = function () {
      if (root.__kuroCleanup) root.__kuroCleanup();
      root.removeAttribute("data-kuro-ready");
      render();
    };

    render();
  }

  function initAll(scope) {
    var doc = scope || document;
    var roots = doc.querySelectorAll("[data-kuro], .kuro-list");
    for (var i = 0; i < roots.length; i++) initOne(roots[i]);
  }

  window.KuroImageHoverList = { initAll: initAll, init: initOne, DEFAULTS: DEFAULTS };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { initAll(); });
  } else {
    initAll();
  }

  // Squarespace swaps page content without a reload — re-init on navigation.
  window.addEventListener("load", function () { initAll(); });
  document.addEventListener("ghost:plugins-config", function () {
    var roots = document.querySelectorAll("[data-kuro], .kuro-list");
    for (var i = 0; i < roots.length; i++) {
      if (roots[i].__kuroRefresh) roots[i].__kuroRefresh();
    }
  });
})();
