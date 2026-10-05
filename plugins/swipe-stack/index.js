/* Ghost Plugins | installation config loader */
(function () {
  // Older install snippets were copied while images still pointed at expiring
  // signed links in the private uploads bucket. Rewrite them to the permanent
  // public asset URL so those sites keep showing their images.
  var UPLOADS = "https://assets.ghostplugins.com/storage/v1/object/public/customer-files/assets/uploads";
  var LEGACY = /https?:\/\/[^"'\s)]*\/object\/(?:sign|public)\/user-assets\/([^"'\s)?]+)(?:\?[^"'\s)]*)?/gi;
  function fixUrl(v) {
    if (typeof v !== "string" || v.indexOf("user-assets") === -1) return v;
    return v.replace(LEGACY, function (_m, p) {
      var parts = String(p).split("/");
      return UPLOADS + "/" + parts[parts.length - 1];
    });
  }
  function versionImageUrl(v, version) {
    if (typeof v !== "string" || !/^https?:\/\//i.test(v) || !version) return v;
    if (!/\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(v)) return v;
    var hashAt = v.indexOf("#");
    var hash = hashAt >= 0 ? v.slice(hashAt) : "";
    var clean = hashAt >= 0 ? v.slice(0, hashAt) : v;
    clean = clean.replace(/([?&])_ghv=[^&]*/g, "$1").replace(/[?&]$/, "");
    return clean + (clean.indexOf("?") >= 0 ? "&" : "?") + "_ghv=" + encodeURIComponent(version) + hash;
  }
  function fixDom() {
    var nodes = document.querySelectorAll('[data-image],[data-aiko-itemdata-image],img[src*="user-assets"]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      ["data-image", "data-aiko-itemdata-image", "src"].forEach(function (a) {
        var cur = n.getAttribute(a);
        if (cur) { var next = fixUrl(cur); if (next !== cur) n.setAttribute(a, next); }
      });
    }
  }
  try { fixDom(); } catch (e) {}
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { try { fixDom(); } catch (e) {} });
  }
  function ghPageOk(cfg) {
    try {
      if (!cfg || String(cfg.activeOn) !== "specific") return true;
      var norm = function (p) {
        p = String(p || "").trim();
        if (!p) return "";
        if (/^https?:\/\//i.test(p)) { try { p = new URL(p).pathname; } catch (e) { return ""; } }
        p = p.split("?")[0].split("#")[0];
        if (p.charAt(0) !== "/") p = "/" + p;
        if (p.length > 1) p = p.replace(/\/+$/, "");
        return p.toLowerCase();
      };
      var here = norm(location.pathname) || "/";
      var list = String(cfg.pageSlugs || "").split(/[\n,]+/);
      for (var i = 0; i < list.length; i++) {
        var raw = String(list[i] || "").trim();
        if (!raw) continue;
        var wild = /\*$/.test(raw);
        var p = norm(raw.replace(/\*$/, ""));
        if (!p) continue;
        if (wild ? (here === p || here.indexOf(p === "/" ? "/" : p + "/") === 0) : here === p) return true;
      }
      return false;
    } catch (e) { return true; }
  }
  try {
    var s = document.currentScript;
    var id = s && s.getAttribute("data-ghost-key");
    if (!id) return;
    if (!document.querySelector('script[data-ghost-edit-mode]')) {
      var edit = document.createElement('script');
      edit.src = "https://assets.ghostplugins.com/storage/v1/object/public/customer-files/installs/squarespace-edit.js";
      edit.setAttribute('data-ghost-edit-mode', '');
      document.head.appendChild(edit);
    }
    var base = "https://assets.ghostplugins.com/storage/v1/object/public/customer-files/installs/" + encodeURIComponent(id);
    var G = (window.GhostPlugins = window.GhostPlugins || { config: {}, installs: {} });
    G.config = G.config || {};
    G.installs = G.installs || {};
    if (G.installs[id]) return;
    G.installs[id] = { loading: true };

    // Cache buster: edits saved in the editor must show up on the live site
    // straight away. The stylesheet and config are tiny and mutable, so they
    // are versioned per page load - never served from a stale CDN or browser
    // copy. (Uploaded images are immutable URLs, so they stay fully cached.)
    var bust = "?v=" + Date.now();

    // --- Shared loading standard -------------------------------------
    // Every Super Plugin root is hidden until its saved config is applied,
    // then fades in. That removes the "flash of demo content" on Squarespace
    // without each plugin re-implementing it. A safety timer always reveals,
    // so a failed config fetch can never leave a blank section behind.
    if (!document.getElementById("gh-boot-style")) {
      var st = document.createElement("style");
      st.id = "gh-boot-style";
      st.textContent =
        "[data-ghost-plugin]:not(.gh-ready){visibility:hidden!important}" +
        "[data-ghost-plugin].gh-ready{visibility:visible;animation:gh-fade .28s ease both}" +
        "@keyframes gh-fade{from{opacity:0}to{opacity:1}}" +
        // Squarespace Edit mode: the plugin never renders while editing, so
        // only the Code Block and the shared Ghost placeholder remain.
        ".sqs-edit-mode-active [data-ghost-plugin],.sqs-edit-mode-active [data-ghost-plugin] *," +
        ".sqs-edit-mode-active [data-image-trail],.sqs-edit-mode-active [data-image-trail] *," +
        ".sqs-edit-mode-active .gh-trail__img{visibility:hidden!important;animation:none!important}";
      (document.head || document.documentElement).appendChild(st);
    }
    G.reveal = function (root) {
      var nodes = root ? [root] : document.querySelectorAll("[data-ghost-plugin]");
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("gh-ready");
    };
    setTimeout(function () { try { G.reveal(); } catch (e) {} }, 2500);

    // Link options: any element marked data-gh-link="<config key>" gets its
    // href and target from the saved settings. Values are already normalised
    // to https:// or /page-slug server-side, so they resolve on the host site.
    G.applyLinks = function (cfg) {
      var nodes = document.querySelectorAll("[data-gh-link]");
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var key = n.getAttribute("data-gh-link");
        var href = cfg[key];
        if (typeof href !== "string" || !href) continue;
        n.setAttribute("href", href);
        if (cfg[key + "_new_tab"] === true || cfg[key + "_new_tab"] === "true") {
          n.setAttribute("target", "_blank");
          n.setAttribute("rel", "noopener noreferrer");
        } else {
          n.removeAttribute("target");
        }
      }
    };


    if (!document.querySelector('link[data-ghost-key="' + id + '"]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = base + ".css" + bust;
      link.setAttribute("data-ghost-key", id);
      (document.head || document.documentElement).appendChild(link);
    }

    fetch(base + ".json" + bust, { credentials: "omit", cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (cfg) {
        if (!cfg) return;
        // Config contains script-target settings. Merge it last so runtime
        // behavior and visual settings always come from the same saved preset.
        var merged = Object.assign({}, cfg.presetSettings || {}, cfg.settings || {}, cfg.config || {});
        var imageVersion = cfg.updatedAt || String(Date.now());
        Object.keys(merged).forEach(function (k) {
          merged[k] = fixUrl(merged[k]);
          if (/(^|_)(image|src|icon|logo)(_|$)/i.test(k)) {
            merged[k] = versionImageUrl(merged[k], imageVersion);
          }
        });
        cfg.merged = merged;
        G.installs[id] = cfg;
        if (cfg.pluginId) G.config[cfg.pluginId] = merged;
        var root = document.documentElement;
        Object.keys(merged).forEach(function (k) {
          var v = merged[k];
          if (v === null || v === undefined || typeof v === "object") return;
          root.style.setProperty("--gh-" + String(k).replace(/[^a-z0-9-]+/gi, "-").toLowerCase(), String(v));
        });
        // Warm the customer's uploaded images so hover/reveal effects show
        // them instantly instead of fetching on first interaction.
        Object.keys(merged).forEach(function (k) {
          var v = merged[k];
          if (typeof v === "string" && /^https?:\/\/.+\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(v)) {
            var pre = new Image();
            pre.src = v;
          }
        });
        try { G.applyLinks(merged); } catch (e) {}
        document.dispatchEvent(new CustomEvent("ghost:config", { detail: cfg }));
        // Config applied - let the plugin paint. Plugins that render async can
        // stay hidden by calling G.reveal(root) themselves once they finish.
        requestAnimationFrame(function () { try { G.reveal(); } catch (e) {} });
        // Ghost AI behaviors (hovers, scroll effects, …) ship as a companion
        // file for this install only. Nothing loads when there are none.
        if (cfg.behaviors && !document.querySelector('script[data-ghost-behaviors="' + id + '"]')) {
          var bs = document.createElement("script");
          bs.src = base + ".js" + bust;
          bs.defer = true;
          bs.setAttribute("data-ghost-behaviors", id);
          (document.head || document.documentElement).appendChild(bs);
        }
      })
      .catch(function () {
        // Live config unavailable - the plugin keeps its defaults, and must
        // still be visible on the customer's page.
        try { G.reveal(); } catch (e) {}
      });
  } catch (e) { /* never break the host site */ }

  // --- Per-block presets ------------------------------------------------
  // A Code Block can carry data-ghost-preset="gh_XXXXX" so the same plugin can
  // run several times on one site, each block with its own saved preset.
  // Blocks without it keep using the page-wide install above.
  try {
    var GB = (window.GhostPlugins = window.GhostPlugins || { config: {}, installs: {} });
    GB.config = GB.config || {};
    GB.installs = GB.installs || {};
    GB.blocks = GB.blocks || {};
    if (!GB.configFor) {
      GB.configFor = function (el, pluginId) {
        var host = el && el.closest ? el.closest("[data-ghost-preset]") : null;
        var bid = host && host.getAttribute("data-ghost-preset");
        var b = bid && GB.blocks[bid];
        if (b && b.merged && (!pluginId || !b.pluginId || b.pluginId === pluginId)) return b.merged;
        return (pluginId && GB.config[pluginId]) || null;
      };
    }
    if (GB.blocksBooted) return;
    GB.blocksBooted = true;
    var BBASE = "https://assets.ghostplugins.com/storage/v1/object/public/customer-files/installs/";
    var ID_RE = /^gh_[A-Za-z0-9]{4,24}$/;
    if (!document.getElementById("gh-block-style")) {
      var bst = document.createElement("style");
      bst.id = "gh-block-style";
      bst.textContent = "[data-ghost-preset]:not(.gh-preset-ready){visibility:hidden!important}" +
        ".sqs-edit-mode-active [data-ghost-preset]{visibility:hidden!important}";
      (document.head || document.documentElement).appendChild(bst);
    }
    var applyBlock = function (node, cfg) {
      var m = cfg.merged || {};
      Object.keys(m).forEach(function (k) {
        var v = m[k];
        if (v === null || v === undefined || typeof v === "object") return;
        node.style.setProperty("--gh-" + String(k).replace(/[^a-z0-9-]+/gi, "-").toLowerCase(), String(v));
      });
      var links = node.querySelectorAll("[data-gh-link]");
      for (var i = 0; i < links.length; i++) {
        var key = links[i].getAttribute("data-gh-link"), href = m[key];
        if (typeof href !== "string" || !href) continue;
        links[i].setAttribute("href", href);
        if (m[key + "_new_tab"] === true || m[key + "_new_tab"] === "true") {
          links[i].setAttribute("target", "_blank");
          links[i].setAttribute("rel", "noopener noreferrer");
        } else links[i].removeAttribute("target");
      }
      node.classList.add("gh-preset-ready");
    };
    var each = function (bid, fn) {
      var ns = document.querySelectorAll('[data-ghost-preset="' + bid + '"]');
      for (var i = 0; i < ns.length; i++) fn(ns[i]);
    };
    var loadBlock = function (bid) {
      GB.blocks[bid] = { loading: true };
      if (!document.querySelector('link[data-ghost-preset-css="' + bid + '"]')) {
        var l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = BBASE + encodeURIComponent(bid) + ".scoped.css?v=" + Date.now();
        l.setAttribute("data-ghost-preset-css", bid);
        (document.head || document.documentElement).appendChild(l);
      }
      fetch(BBASE + encodeURIComponent(bid) + ".json?v=" + Date.now(), { credentials: "omit", cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (cfg) {
          if (!cfg) { GB.blocks[bid] = { failed: true }; each(bid, function (n) { n.classList.add("gh-preset-ready"); }); return; }
          var merged = Object.assign({}, cfg.presetSettings || {}, cfg.settings || {}, cfg.config || {});
          var ver = cfg.updatedAt || String(Date.now());
          Object.keys(merged).forEach(function (k) {
            merged[k] = fixUrl(merged[k]);
            if (/(^|_)(image|src|icon|logo)(_|$)/i.test(k)) merged[k] = versionImageUrl(merged[k], ver);
          });
          cfg.merged = merged;
          GB.blocks[bid] = cfg;
          if (!ghPageOk(merged)) { each(bid, function (n) { n.style.display = "none"; }); return; }
          each(bid, function (n) { applyBlock(n, cfg); });
          var detail = Object.assign({}, cfg, { installId: bid, block: true });
          each(bid, function (n) { detail.root = n; });
          document.dispatchEvent(new CustomEvent("ghost:config", { detail: detail }));
          if (GB.reveal) requestAnimationFrame(function () { try { each(bid, function (n) { GB.reveal(n); var ps = n.querySelectorAll("[data-ghost-plugin]"); for (var i = 0; i < ps.length; i++) GB.reveal(ps[i]); }); } catch (e) {} });
        })
        .catch(function () { GB.blocks[bid] = { failed: true }; each(bid, function (n) { n.classList.add("gh-preset-ready"); }); });
    };
    var scan = function () {
      var ns = document.querySelectorAll("[data-ghost-preset]");
      for (var i = 0; i < ns.length; i++) {
        var bid = ns[i].getAttribute("data-ghost-preset");
        if (!ID_RE.test(bid || "")) { ns[i].classList.add("gh-preset-ready"); continue; }
        var b = GB.blocks[bid];
        if (!b) loadBlock(bid);
        else if (b.merged && !ns[i].classList.contains("gh-preset-ready")) applyBlock(ns[i], b);
        else if (b.failed) ns[i].classList.add("gh-preset-ready");
      }
    };
    var queued = false;
    var queue = function () { if (queued) return; queued = true; setTimeout(function () { queued = false; scan(); }, 50); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan); else scan();
    document.addEventListener("mercury:load", queue);
    if (window.MutationObserver) {
      new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true });
    }
    setTimeout(function () {
      var ns = document.querySelectorAll("[data-ghost-preset]:not(.gh-preset-ready)");
      for (var i = 0; i < ns.length; i++) ns[i].classList.add("gh-preset-ready");
    }, 3000);
  } catch (e) { /* never break the host site */ }
})();

/* Ghost Plugins | installation config loader */
(function () {
  // Older install snippets were copied while images still pointed at expiring
  // signed links in the private uploads bucket. Rewrite them to the permanent
  // public asset URL so those sites keep showing their images.
  var UPLOADS = "https://assets.ghostplugins.com/storage/v1/object/public/customer-files/assets/uploads";
  var LEGACY = /https?:\/\/[^"'\s)]*\/object\/(?:sign|public)\/user-assets\/([^"'\s)?]+)(?:\?[^"'\s)]*)?/gi;
  function fixUrl(v) {
    if (typeof v !== "string" || v.indexOf("user-assets") === -1) return v;
    return v.replace(LEGACY, function (_m, p) {
      var parts = String(p).split("/");
      return UPLOADS + "/" + parts[parts.length - 1];
    });
  }
  function versionImageUrl(v, version) {
    if (typeof v !== "string" || !/^https?:\/\//i.test(v) || !version) return v;
    if (!/\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(v)) return v;
    var hashAt = v.indexOf("#");
    var hash = hashAt >= 0 ? v.slice(hashAt) : "";
    var clean = hashAt >= 0 ? v.slice(0, hashAt) : v;
    clean = clean.replace(/([?&])_ghv=[^&]*/g, "$1").replace(/[?&]$/, "");
    return clean + (clean.indexOf("?") >= 0 ? "&" : "?") + "_ghv=" + encodeURIComponent(version) + hash;
  }
  function fixDom() {
    var nodes = document.querySelectorAll('[data-image],[data-aiko-itemdata-image],img[src*="user-assets"]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      ["data-image", "data-aiko-itemdata-image", "src"].forEach(function (a) {
        var cur = n.getAttribute(a);
        if (cur) { var next = fixUrl(cur); if (next !== cur) n.setAttribute(a, next); }
      });
    }
  }
  try { fixDom(); } catch (e) {}
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { try { fixDom(); } catch (e) {} });
  }
  function ghPageOk(cfg) {
    try {
      if (!cfg || String(cfg.activeOn) !== "specific") return true;
      var norm = function (p) {
        p = String(p || "").trim();
        if (!p) return "";
        if (/^https?:\/\//i.test(p)) { try { p = new URL(p).pathname; } catch (e) { return ""; } }
        p = p.split("?")[0].split("#")[0];
        if (p.charAt(0) !== "/") p = "/" + p;
        if (p.length > 1) p = p.replace(/\/+$/, "");
        return p.toLowerCase();
      };
      var here = norm(location.pathname) || "/";
      var list = String(cfg.pageSlugs || "").split(/[\n,]+/);
      for (var i = 0; i < list.length; i++) {
        var raw = String(list[i] || "").trim();
        if (!raw) continue;
        var wild = /\*$/.test(raw);
        var p = norm(raw.replace(/\*$/, ""));
        if (!p) continue;
        if (wild ? (here === p || here.indexOf(p === "/" ? "/" : p + "/") === 0) : here === p) return true;
      }
      return false;
    } catch (e) { return true; }
  }
  try {
    var s = document.currentScript;
    var id = s && s.getAttribute("data-ghost-key");
    if (!id) return;
    if (!document.querySelector('script[data-ghost-edit-mode]')) {
      var edit = document.createElement('script');
      edit.src = "https://assets.ghostplugins.com/storage/v1/object/public/customer-files/installs/squarespace-edit.js";
      edit.setAttribute('data-ghost-edit-mode', '');
      document.head.appendChild(edit);
    }
    var base = "https://assets.ghostplugins.com/storage/v1/object/public/customer-files/installs/" + encodeURIComponent(id);
    var G = (window.GhostPlugins = window.GhostPlugins || { config: {}, installs: {} });
    G.config = G.config || {};
    G.installs = G.installs || {};
    if (G.installs[id]) return;
    G.installs[id] = { loading: true };

    // Cache buster: edits saved in the editor must show up on the live site
    // straight away. The stylesheet and config are tiny and mutable, so they
    // are versioned per page load - never served from a stale CDN or browser
    // copy. (Uploaded images are immutable URLs, so they stay fully cached.)
    var bust = "?v=" + Date.now();

    // --- Shared loading standard -------------------------------------
    // Every Super Plugin root is hidden until its saved config is applied,
    // then fades in. That removes the "flash of demo content" on Squarespace
    // without each plugin re-implementing it. A safety timer always reveals,
    // so a failed config fetch can never leave a blank section behind.
    if (!document.getElementById("gh-boot-style")) {
      var st = document.createElement("style");
      st.id = "gh-boot-style";
      st.textContent =
        "[data-ghost-plugin]:not(.gh-ready){visibility:hidden!important}" +
        "[data-ghost-plugin].gh-ready{visibility:visible;animation:gh-fade .28s ease both}" +
        "@keyframes gh-fade{from{opacity:0}to{opacity:1}}" +
        // Squarespace Edit mode: the plugin never renders while editing, so
        // only the Code Block and the shared Ghost placeholder remain.
        ".sqs-edit-mode-active [data-ghost-plugin],.sqs-edit-mode-active [data-ghost-plugin] *," +
        ".sqs-edit-mode-active [data-image-trail],.sqs-edit-mode-active [data-image-trail] *," +
        ".sqs-edit-mode-active .gh-trail__img{visibility:hidden!important;animation:none!important}";
      (document.head || document.documentElement).appendChild(st);
    }
    G.reveal = function (root) {
      var nodes = root ? [root] : document.querySelectorAll("[data-ghost-plugin]");
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("gh-ready");
    };
    setTimeout(function () { try { G.reveal(); } catch (e) {} }, 2500);

    // Link options: any element marked data-gh-link="<config key>" gets its
    // href and target from the saved settings. Values are already normalised
    // to https:// or /page-slug server-side, so they resolve on the host site.
    G.applyLinks = function (cfg) {
      var nodes = document.querySelectorAll("[data-gh-link]");
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var key = n.getAttribute("data-gh-link");
        var href = cfg[key];
        if (typeof href !== "string" || !href) continue;
        n.setAttribute("href", href);
        if (cfg[key + "_new_tab"] === true || cfg[key + "_new_tab"] === "true") {
          n.setAttribute("target", "_blank");
          n.setAttribute("rel", "noopener noreferrer");
        } else {
          n.removeAttribute("target");
        }
      }
    };


    if (!document.querySelector('link[data-ghost-key="' + id + '"]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = base + ".css" + bust;
      link.setAttribute("data-ghost-key", id);
      (document.head || document.documentElement).appendChild(link);
    }

    fetch(base + ".json" + bust, { credentials: "omit", cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (cfg) {
        if (!cfg) return;
        // Config contains script-target settings. Merge it last so runtime
        // behavior and visual settings always come from the same saved preset.
        var merged = Object.assign({}, cfg.presetSettings || {}, cfg.settings || {}, cfg.config || {});
        var imageVersion = cfg.updatedAt || String(Date.now());
        Object.keys(merged).forEach(function (k) {
          merged[k] = fixUrl(merged[k]);
          if (/(^|_)(image|src|icon|logo)(_|$)/i.test(k)) {
            merged[k] = versionImageUrl(merged[k], imageVersion);
          }
        });
        cfg.merged = merged;
        G.installs[id] = cfg;
        if (cfg.pluginId) G.config[cfg.pluginId] = merged;
        var root = document.documentElement;
        Object.keys(merged).forEach(function (k) {
          var v = merged[k];
          if (v === null || v === undefined || typeof v === "object") return;
          root.style.setProperty("--gh-" + String(k).replace(/[^a-z0-9-]+/gi, "-").toLowerCase(), String(v));
        });
        // Warm the customer's uploaded images so hover/reveal effects show
        // them instantly instead of fetching on first interaction.
        Object.keys(merged).forEach(function (k) {
          var v = merged[k];
          if (typeof v === "string" && /^https?:\/\/.+\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(v)) {
            var pre = new Image();
            pre.src = v;
          }
        });
        try { G.applyLinks(merged); } catch (e) {}
        document.dispatchEvent(new CustomEvent("ghost:config", { detail: cfg }));
        // Config applied - let the plugin paint. Plugins that render async can
        // stay hidden by calling G.reveal(root) themselves once they finish.
        requestAnimationFrame(function () { try { G.reveal(); } catch (e) {} });
        // Ghost AI behaviors (hovers, scroll effects, …) ship as a companion
        // file for this install only. Nothing loads when there are none.
        if (cfg.behaviors && !document.querySelector('script[data-ghost-behaviors="' + id + '"]')) {
          var bs = document.createElement("script");
          bs.src = base + ".js" + bust;
          bs.defer = true;
          bs.setAttribute("data-ghost-behaviors", id);
          (document.head || document.documentElement).appendChild(bs);
        }
      })
      .catch(function () {
        // Live config unavailable - the plugin keeps its defaults, and must
        // still be visible on the customer's page.
        try { G.reveal(); } catch (e) {}
      });
  } catch (e) { /* never break the host site */ }

  // --- Per-block presets ------------------------------------------------
  // A Code Block can carry data-ghost-preset="gh_XXXXX" so the same plugin can
  // run several times on one site, each block with its own saved preset.
  // Blocks without it keep using the page-wide install above.
  try {
    var GB = (window.GhostPlugins = window.GhostPlugins || { config: {}, installs: {} });
    GB.config = GB.config || {};
    GB.installs = GB.installs || {};
    GB.blocks = GB.blocks || {};
    if (!GB.configFor) {
      GB.configFor = function (el, pluginId) {
        var host = el && el.closest ? el.closest("[data-ghost-preset]") : null;
        var bid = host && host.getAttribute("data-ghost-preset");
        var b = bid && GB.blocks[bid];
        if (b && b.merged && (!pluginId || !b.pluginId || b.pluginId === pluginId)) return b.merged;
        return (pluginId && GB.config[pluginId]) || null;
      };
    }
    if (GB.blocksBooted) return;
    GB.blocksBooted = true;
    var BBASE = "https://assets.ghostplugins.com/storage/v1/object/public/customer-files/installs/";
    var ID_RE = /^gh_[A-Za-z0-9]{4,24}$/;
    if (!document.getElementById("gh-block-style")) {
      var bst = document.createElement("style");
      bst.id = "gh-block-style";
      bst.textContent = "[data-ghost-preset]:not(.gh-preset-ready){visibility:hidden!important}" +
        ".sqs-edit-mode-active [data-ghost-preset]{visibility:hidden!important}";
      (document.head || document.documentElement).appendChild(bst);
    }
    var applyBlock = function (node, cfg) {
      var m = cfg.merged || {};
      Object.keys(m).forEach(function (k) {
        var v = m[k];
        if (v === null || v === undefined || typeof v === "object") return;
        node.style.setProperty("--gh-" + String(k).replace(/[^a-z0-9-]+/gi, "-").toLowerCase(), String(v));
      });
      var links = node.querySelectorAll("[data-gh-link]");
      for (var i = 0; i < links.length; i++) {
        var key = links[i].getAttribute("data-gh-link"), href = m[key];
        if (typeof href !== "string" || !href) continue;
        links[i].setAttribute("href", href);
        if (m[key + "_new_tab"] === true || m[key + "_new_tab"] === "true") {
          links[i].setAttribute("target", "_blank");
          links[i].setAttribute("rel", "noopener noreferrer");
        } else links[i].removeAttribute("target");
      }
      node.classList.add("gh-preset-ready");
    };
    var each = function (bid, fn) {
      var ns = document.querySelectorAll('[data-ghost-preset="' + bid + '"]');
      for (var i = 0; i < ns.length; i++) fn(ns[i]);
    };
    var loadBlock = function (bid) {
      GB.blocks[bid] = { loading: true };
      if (!document.querySelector('link[data-ghost-preset-css="' + bid + '"]')) {
        var l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = BBASE + encodeURIComponent(bid) + ".scoped.css?v=" + Date.now();
        l.setAttribute("data-ghost-preset-css", bid);
        (document.head || document.documentElement).appendChild(l);
      }
      fetch(BBASE + encodeURIComponent(bid) + ".json?v=" + Date.now(), { credentials: "omit", cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (cfg) {
          if (!cfg) { GB.blocks[bid] = { failed: true }; each(bid, function (n) { n.classList.add("gh-preset-ready"); }); return; }
          var merged = Object.assign({}, cfg.presetSettings || {}, cfg.settings || {}, cfg.config || {});
          var ver = cfg.updatedAt || String(Date.now());
          Object.keys(merged).forEach(function (k) {
            merged[k] = fixUrl(merged[k]);
            if (/(^|_)(image|src|icon|logo)(_|$)/i.test(k)) merged[k] = versionImageUrl(merged[k], ver);
          });
          cfg.merged = merged;
          GB.blocks[bid] = cfg;
          if (!ghPageOk(merged)) { each(bid, function (n) { n.style.display = "none"; }); return; }
          each(bid, function (n) { applyBlock(n, cfg); });
          var detail = Object.assign({}, cfg, { installId: bid, block: true });
          each(bid, function (n) { detail.root = n; });
          document.dispatchEvent(new CustomEvent("ghost:config", { detail: detail }));
          if (GB.reveal) requestAnimationFrame(function () { try { each(bid, function (n) { GB.reveal(n); var ps = n.querySelectorAll("[data-ghost-plugin]"); for (var i = 0; i < ps.length; i++) GB.reveal(ps[i]); }); } catch (e) {} });
        })
        .catch(function () { GB.blocks[bid] = { failed: true }; each(bid, function (n) { n.classList.add("gh-preset-ready"); }); });
    };
    var scan = function () {
      var ns = document.querySelectorAll("[data-ghost-preset]");
      for (var i = 0; i < ns.length; i++) {
        var bid = ns[i].getAttribute("data-ghost-preset");
        if (!ID_RE.test(bid || "")) { ns[i].classList.add("gh-preset-ready"); continue; }
        var b = GB.blocks[bid];
        if (!b) loadBlock(bid);
        else if (b.merged && !ns[i].classList.contains("gh-preset-ready")) applyBlock(ns[i], b);
        else if (b.failed) ns[i].classList.add("gh-preset-ready");
      }
    };
    var queued = false;
    var queue = function () { if (queued) return; queued = true; setTimeout(function () { queued = false; scan(); }, 50); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan); else scan();
    document.addEventListener("mercury:load", queue);
    if (window.MutationObserver) {
      new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true });
    }
    setTimeout(function () {
      var ns = document.querySelectorAll("[data-ghost-preset]:not(.gh-preset-ready)");
      for (var i = 0; i < ns.length; i++) ns[i].classList.add("gh-preset-ready");
    }, 3000);
  } catch (e) { /* never break the host site */ }
})();

(function () {
  'use strict';
  var DEFAULTS = {
    contentGalleryLabel: 'Swipeable image gallery',
    contentPositionText: 'Image {current} of {total}',
    imagesCardsJson: '[{"src":"demo_light_image.webp","alt":"Sunlit mountain landscape","link":"","newTab":false},{"src":"demo_dark_image.webp","alt":"Mountain landscape at dusk","link":"","newTab":false},{"src":"demo_light_image.webp","alt":"Quiet mountain valley","link":"","newTab":false},{"src":"demo_dark_image.webp","alt":"Evening over the mountains","link":"","newTab":false},{"src":"demo_light_image.webp","alt":"Open alpine landscape","link":"","newTab":false}]',
    imagesUseAspectRatio: false,
    imagesRandomRatio: false,
    imagesRandomRatioMin: 0.72,
    imagesRandomRatioMax: 1.12,
    imagesShowShadow: true,
    layoutStackStyle: 'scattered',
    layoutStackSize: 4,
    advancedLoop: true,
    advancedEnableSwipe: true,
    advancedSwipeThreshold: 0.18,
  };
  if (window.GhostSwipeStack && typeof window.GhostSwipeStack.initAll === 'function') {
    window.GhostSwipeStack.initAll();
    return;
  }
  var SELECTOR = '.gp-swipe-stack';
  var SLUG = 'swipe-stack';
  var instances = new WeakMap();
  function number(value, fallback, min, max) {
    value = Number(value);
    return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
  }
  function safeUrl(value, link) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      var url = new URL(value, document.baseURI);
      if (/^https?:$/.test(url.protocol) || (link && /^(mailto:|tel:)$/.test(url.protocol))) return url.href;
    } catch (error) {}
    return '';
  }
  function initialize(root) {
    var old = instances.get(root);
    if (old) old();
    var settings = Object.assign({}, DEFAULTS, window.GhostPluginConfig || {});
    if (window.GhostPlugins && typeof window.GhostPlugins.configFor === 'function') {
      settings = Object.assign(settings, window.GhostPlugins.configFor(root, SLUG) || {});
    }
    var cleanup = [], cards = [], index = 0, drag = null, timer = null, busy = false, suppressClick = false;
    var originalAttributes = ['role','aria-label','data-ratio','data-reduced','data-shadow'].map(function (name) { return [name, root.getAttribute(name)]; });
    var host = document.createElement('div');
    root.appendChild(host);
    function listen(target, type, handler, options) {
      target.addEventListener(type, handler, options);
      cleanup.push(function () { target.removeEventListener(type, handler, options); });
    }
    instances.set(root, function () {
      clearTimeout(timer);
      if (drag && stage.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id);
      cleanup.forEach(function (dispose) { dispose(); });
      host.remove();
      originalAttributes.forEach(function (item) { if (item[1] === null) root.removeAttribute(item[0]); else root.setAttribute(item[0], item[1]); });
    });
    var items;
    try { items = JSON.parse(settings.imagesCardsJson); } catch (error) { items = JSON.parse(DEFAULTS.imagesCardsJson); }
    if (!Array.isArray(items)) items = JSON.parse(DEFAULTS.imagesCardsJson);
    items = items.filter(function (item) { return item && safeUrl(item.src, false); });
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', String(settings.contentGalleryLabel));
    var fixedRatio = (getComputedStyle(root).getPropertyValue('--image-aspect-ratio') || 'auto').trim();
    root.setAttribute('data-ratio', String(!!(settings.imagesRandomRatio || (fixedRatio && fixedRatio !== 'auto'))));
    root.setAttribute('data-shadow', String(!!settings.imagesShowShadow));
    var stage = document.createElement('div');
    stage.className = 'gp-stage';
    stage.tabIndex = 0;
    stage.setAttribute('role', 'group');
    stage.setAttribute('aria-label', String(settings.contentGalleryLabel));
    host.appendChild(stage);
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function mediaListen(query, fn) {
      if (query.addEventListener) listen(query, 'change', fn);
      else { query.addListener(fn); cleanup.push(function () { query.removeListener(fn); }); }
    }
    function updateMotion() { root.setAttribute('data-reduced', String(reduced.matches)); }
    mediaListen(reduced, updateMotion);
    updateMotion();
    items.forEach(function (item, i) {
      var href = safeUrl(item.link, true);
      var card = document.createElement(href ? 'a' : 'div');
      card.className = 'gp-card';
      if (href) {
        card.href = href;
        if (item.newTab === true) { card.target = '_blank'; card.rel = 'noopener noreferrer'; }
      }
      card.draggable = false;
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = typeof item.alt === 'string' ? item.alt : '';
      img.draggable = false;
      img.loading = i < settings.layoutStackSize ? 'eager' : 'lazy';
      img.decoding = 'async';
      card.appendChild(img);
      if (settings.imagesRandomRatio) {
        var min = number(settings.imagesRandomRatioMin,0.72,0.25,3);
        var max = number(settings.imagesRandomRatioMax,1.12,min,3);
        card.style.setProperty('--card-ratio', String(min + (max-min) * (((i+1)*0.61803398875)%1)));
      }
      stage.appendChild(card);
      cards.push(card);
    });
    var status = document.createElement('span');
    status.className = 'gp-status';
    status.setAttribute('aria-live','polite');
    status.setAttribute('aria-atomic','true');
    host.appendChild(status);
    function rawPose(depth) {
      var style = getComputedStyle(root);
      var offset = parseFloat(style.getPropertyValue('--stack-offset-size')) || 0;
      var angle = parseFloat(style.getPropertyValue('--stack-rotation-size')) || 0;
      var shrink = number(style.getPropertyValue('--stack-scale-size'),0.045,0,0.15);
      var x = 0, y = depth*offset, rotation = 0;
      if (settings.layoutStackStyle === 'fan') { x = depth*offset; rotation = depth*angle; }
      else if (settings.layoutStackStyle === 'scattered') { x = depth === 0 ? 0 : (depth%2 ? -1 : 1)*offset; rotation = depth === 0 ? 0 : (depth%2 ? -1 : 1)*angle*(1+depth*0.15); }
      else if (settings.layoutStackStyle === 'layered-top') { y = -depth*offset; }
      else if (settings.layoutStackStyle === 'cascade') { x = depth*offset; y = -depth*offset; }
      if (settings.layoutStackStyle === 'layered' || settings.layoutStackStyle === 'layered-bottom' || settings.layoutStackStyle === 'layered-top') {
        var cardHeight = cards[index] ? cards[index].offsetHeight : stage.clientHeight;
        y += (y < 0 ? -1 : 1)*cardHeight*(1-Math.max(0.4,1-depth*shrink))/2;
      }
      return {x:x,y:y,angle:rotation,scale:Math.max(0.4,1-depth*shrink)};
    }
    var layoutPositions = [], groupHeight = 0;
    function centeredPoses(count) {
      var positions = [], left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
      for (var depth = 0; depth < count; depth++) {
        var position = rawPose(depth);
        var card = cards[(index+depth)%cards.length];
        var width = (card ? card.offsetWidth : stage.clientWidth)*position.scale;
        var height = (card ? card.offsetHeight : stage.clientHeight)*position.scale;
        var radians = Math.abs(position.angle)*Math.PI/180;
        var boundsWidth = Math.abs(width*Math.cos(radians))+Math.abs(height*Math.sin(radians));
        var boundsHeight = Math.abs(width*Math.sin(radians))+Math.abs(height*Math.cos(radians));
        left = Math.min(left,position.x-boundsWidth/2);
        right = Math.max(right,position.x+boundsWidth/2);
        top = Math.min(top,position.y-boundsHeight/2);
        bottom = Math.max(bottom,position.y+boundsHeight/2);
        positions.push(position);
      }
      groupHeight = Number.isFinite(top) ? bottom-top : 0;
      var shiftX = Number.isFinite(left) ? -(left+right)/2 : 0;
      var shiftY = Number.isFinite(top) ? -(top+bottom)/2 : 0;
      return positions.map(function (position) {
        return {x:position.x+shiftX,y:position.y+shiftY,angle:position.angle,scale:position.scale};
      });
    }
    function pose(depth) {
      return layoutPositions[depth] || rawPose(depth);
    }
    function applyPose(card, position) {
      card.style.setProperty('--card-x',position.x+'px');
      card.style.setProperty('--card-y',position.y+'px');
      card.style.setProperty('--card-angle',position.angle+'deg');
      card.style.setProperty('--card-scale',String(position.scale));
    }
    function paint(heldCard) {
      var count = Math.round(number(settings.layoutStackSize,4,1,cards.length || 1));
      var positions = centeredPoses(count);
      layoutPositions = positions;
      var shadowClearance = settings.imagesShowShadow ? (parseFloat(getComputedStyle(root).getPropertyValue('--image-shadow-blur-size')) || 0) : 0;
      host.style.setProperty('--stack-top-clearance-size',(Math.max.apply(null,positions.map(function (p) { return Math.max(0,-p.y); }))+shadowClearance)+'px');
      host.style.setProperty('--stack-bottom-clearance-size',(Math.max.apply(null,positions.map(function (p) { return Math.max(0,p.y); }))+shadowClearance)+'px');
      /* Grow the stage to the whole visible group so back cards and shadows never clip. */
      stage.style.minHeight = Math.ceil(groupHeight+shadowClearance*2+4)+'px';
      var focused = document.activeElement;
      cards.forEach(function (card,i) {
        var depth = (i-index+cards.length)%cards.length;
        var visible = depth < count;
        if (!settings.advancedLoop && i < index) visible = false;
        if (focused && card.contains(focused) && depth !== 0) stage.focus({preventScroll:true});
        var wasHidden = card.hidden;
        /* Mid-animation, cards leaving the stack stay rendered until the final paint. */
        var leaving = heldCard && !wasHidden && !visible && card !== heldCard;
        card.hidden = card === heldCard || leaving ? false : !visible;
        if (wasHidden && !card.hidden && card !== heldCard) prepare(card,pose(depth));
        card.style.zIndex = card === heldCard ? '0' : String(cards.length-depth);
        card.style.pointerEvents = depth === 0 ? 'auto' : 'none';
        card.setAttribute('aria-hidden',String(depth !== 0));
        if (card.tagName === 'A') card.tabIndex = depth === 0 ? 0 : -1;
        if (card !== heldCard) applyPose(card,pose(leaving ? Math.max(0,Math.min(depth,count-1)) : depth));
      });
      status.textContent = String(settings.contentPositionText).replace(/\{current\}/g,String(cards.length ? index+1 : 0)).replace(/\{total\}/g,String(cards.length));
      if (window.GhostPlugins && typeof window.GhostPlugins.reveal === 'function') window.GhostPlugins.reveal(root);
    }
    /* Place a card instantly (no transition) and commit it before any animation. */
    function prepare(card, position) {
      card.style.transition = 'none';
      card.hidden = false;
      applyPose(card,position);
      void card.offsetWidth;
      card.style.transition = '';
    }
    function move(direction, exitSide) {
      if (busy || cards.length < 2) return;
      var destination = index+direction;
      if (!settings.advancedLoop && (destination < 0 || destination >= cards.length)) { paint(); return; }
      var outgoing = cards[index];
      var nextIndex = (destination+cards.length)%cards.length;
      if (reduced.matches) { index = nextIndex; paint(); return; }
      busy = true;
      var style = getComputedStyle(root);
      var distance = stage.clientWidth*number(style.getPropertyValue('--swipe-distance-size'),0.65,0.1,3);
      var rotation = parseFloat(style.getPropertyValue('--swipe-rotation-size')) || 0;
      var duration = style.getPropertyValue('--animation-duration').trim();
      var milliseconds = number(parseFloat(duration)*(/ms$/.test(duration) ? 1 : 1000),380,0,10000);
      var side = exitSide || (direction > 0 ? -1 : 1);
      var count = Math.round(number(settings.layoutStackSize,4,1,cards.length));
      /* Same sequence both ways: the incoming card waits directly behind the
         front card at a consistent depth-1 pose, prepared without transition. */
      var incoming = cards[nextIndex];
      outgoing.style.zIndex = String(cards.length+1);
      if (incoming !== outgoing) {
        incoming.style.zIndex = String(cards.length);
        incoming.style.pointerEvents = 'none';
        incoming.setAttribute('aria-hidden','true');
        if (incoming.hidden) prepare(incoming,pose(1));
      }
      /* Commit a released drag position before starting the outward transition. */
      void outgoing.offsetWidth;
      applyPose(outgoing,{x:side*distance,y:0,angle:side*rotation,scale:1});
      timer = setTimeout(function () {
        /* Outward phase done: only now restack, then return behind the stack. */
        index = nextIndex;
        paint(outgoing);
        var depth = (cards.indexOf(outgoing)-index+cards.length)%cards.length;
        applyPose(outgoing,pose(Math.min(depth,count-1)));
        timer = setTimeout(function () { busy = false; paint(); },milliseconds);
      },milliseconds);
    }
    function settle(event, canceled) {
      if (!drag || event.pointerId !== drag.id) return;
      var gesture = drag;
      drag = null;
      stage.removeAttribute('data-dragging');
      if (stage.hasPointerCapture(gesture.id)) stage.releasePointerCapture(gesture.id);
      suppressClick = gesture.moved;
      var threshold = stage.clientWidth * number(settings.advancedSwipeThreshold,0.18,0.05,0.8);
      /* A swipe in either direction reveals the card visibly waiting behind,
         and the front card leaves toward the side it was thrown. */
      var direction = 1;
      var exitSide = gesture.dx < 0 ? -1 : 1;
      var allowed = settings.advancedLoop || (index+direction >= 0 && index+direction < cards.length);
      if (!canceled && gesture.horizontal && Math.abs(gesture.dx) >= threshold && allowed) {
        move(direction, exitSide);
      } else paint();
    }
    listen(stage,'pointerdown',function (event) {
      suppressClick = false;
      if (!settings.advancedEnableSwipe || busy || cards.length < 2 || !event.isPrimary || event.button !== 0 || drag) return;
      drag = {id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,moved:false,horizontal:false};
    });
    listen(window,'pointermove',function (event) {
      if (!drag || event.pointerId !== drag.id) return;
      var dx = event.clientX-drag.x, dy = event.clientY-drag.y;
      if (!drag.horizontal && Math.max(Math.abs(dx),Math.abs(dy)) > 8) {
        drag.moved = true;
        if (Math.abs(dy) > Math.abs(dx)) { settle(event,true); return; }
        drag.horizontal = true;
        stage.setPointerCapture(drag.id);
        stage.setAttribute('data-dragging','true');
      }
      if (!drag || !drag.horizontal) return;
      drag.dx = dx;
      if (event.cancelable) event.preventDefault();
      cards[index].style.setProperty('--card-x',dx+'px');
      cards[index].style.setProperty('--card-angle',dx/stage.clientWidth*20+'deg');
    },{passive:false});
    listen(window,'pointerup',function (event) { settle(event,false); });
    listen(window,'pointercancel',function (event) { settle(event,true); });
    listen(stage,'lostpointercapture',function (event) { settle(event,true); });
    listen(stage,'click',function (event) { if (suppressClick || busy) { event.preventDefault(); event.stopPropagation(); suppressClick = false; } },true);
    listen(stage,'dragstart',function (event) { event.preventDefault(); });
    listen(stage,'keydown',function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
    });
    paint();
  }
  function initAll() { document.querySelectorAll(SELECTOR).forEach(initialize); }
  window.GhostSwipeStack = {initAll:initAll};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initAll,{once:true});
  else initAll();
  document.addEventListener('ghost:config',initAll);
  document.addEventListener('mercury:load',function () { setTimeout(initAll,50); });
})();


