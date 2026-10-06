
/*!
 * Aiko Testimonial Slider, Ghost Plugins  v1.6.0
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
    showArrowsMobile: false,
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
    bold: {
      left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>',
      right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>'
    },
    square: {
      left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><polyline points="14 16 10 12 14 8"></polyline></svg>',
      right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><polyline points="10 8 14 12 10 16"></polyline></svg>'
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
  function liveConfig(root) {
    try {
      var G = window.GhostPlugins;
      // Per-block preset (data-ghost-preset) first, then the page-wide install.
      var live = G && (G.configFor ? G.configFor(root, "aiko-testimonial-slider") : (G.config && G.config["aiko-testimonial-slider"]));
      return live && typeof live === "object" ? live : {};
    } catch (e) {
      return {};
    }
  }

  function readSettings(root) {
    var live = liveConfig(root);
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
      showArrowsMobile: bool(cfg("showArrowsMobile", DEFAULTS.showArrowsMobile), DEFAULTS.showArrowsMobile),
      showDots: bool(cfg("showDots", DEFAULTS.showDots), DEFAULTS.showDots),
      pauseOnHover: bool(cfg("pauseOnHover", DEFAULTS.pauseOnHover), DEFAULTS.pauseOnHover),
      swipe: bool(cfg("swipe", DEFAULTS.swipe), DEFAULTS.swipe),
      quoteStyle: pick(String(cfg("quoteStyle", DEFAULTS.quoteStyle)), ["default", "minimal", "brackets", "apostrophe", "round", "square", "double", "thin", "ghost", "none", "custom"], DEFAULTS.quoteStyle),
      arrowStyle: pick(String(cfg("arrowStyle", DEFAULTS.arrowStyle)), ["default", "minimal", "round", "caret", "line", "bold", "square", "custom"], DEFAULTS.arrowStyle),
      arrowSvg: String(cfg("arrowSvg", "")),
      quoteSvg: String(cfg("quoteSvg", ""))
    };
  }

  /** Testimonials saved in the editor (t1..t10), when this install has any. */
  function liveItems(root) {
    var live = liveConfig(root);
    var items = [];
    var itemKeys = [
      {"text": "t1_text", "title": "t1_title", "image": "t1_image", "subtitle": "t1_subtitle"},
      {"text": "t2_text", "title": "t2_title", "image": "t2_image", "subtitle": "t2_subtitle"},
      {"text": "t3_text", "title": "t3_title", "image": "t3_image", "subtitle": "t3_subtitle"},
      {"text": "t4_text", "title": "t4_title", "image": "t4_image", "subtitle": "t4_subtitle"},
      {"text": "t5_text", "title": "t5_title", "image": "t5_image", "subtitle": "t5_subtitle"},
      {"text": "t6_text", "title": "t6_title", "image": "t6_image", "subtitle": "t6_subtitle"},
      {"text": "t7_text", "title": "t7_title", "image": "t7_image", "subtitle": "t7_subtitle"},
      {"text": "t8_text", "title": "t8_title", "image": "t8_image", "subtitle": "t8_subtitle"},
      {"text": "t9_text", "title": "t9_title", "image": "t9_image", "subtitle": "t9_subtitle"},
      {"text": "t10_text", "title": "t10_title", "image": "t10_image", "subtitle": "t10_subtitle"}
    ];
    for (var i = 1; i <= 10; i++) {
      var p = "t" + i + "_";
      var text = live[itemKeys[i - 1].text];
      var title = live[itemKeys[i - 1].title];
      var image = live[itemKeys[i - 1].image];
      var subtitle = live[itemKeys[i - 1].subtitle];
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

  /* Shown when the Code Block is the empty canvas and no testimonials are saved yet. */
  var DEMO_IMG = "https://www.ghostplugins.com/demo_light_image.webp";
  var DEMO_ITEMS = [
    { image: DEMO_IMG, alt: "Amelia Hart", title: "Amelia Hart", subtitle: "Founder, Aiko Studio", text: "Working with the team was effortless. Our new site launched in under two weeks and our online bookings have doubled since." },
    { image: DEMO_IMG, alt: "Marcus Doyle", title: "Marcus Doyle", subtitle: "Creative Director", text: "The attention to detail is unreal. Every section feels considered, and the whole thing is easy for our team to update." },
    { image: DEMO_IMG, alt: "Priya Raman", title: "Priya Raman", subtitle: "Owner, North Coffee", text: "I finally have a website that looks like the brand in my head. Customers mention it almost every single day." }
  ];

  function readItems(root) {
    // Saved editor content is the source of truth once an installation key is
    // present; the pasted markup is only the fallback / first render.
    var live = liveItems(root);
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
    if (!items.length) items = DEMO_ITEMS.slice();
    return items;
  }

  /**
   * Quote marks are inline SVG icons (not text characters), so they render the
   * same on every host site regardless of the fonts Squarespace loads.
   * The closing mark is the same icon rotated 180deg in CSS.
   */
  var QUOTE_ICONS = {
    default:
      '<path d="M10.2 4.8C6.6 6.5 4.2 9.9 4.2 13.7c0 3.3 2 5.5 4.8 5.5 2.4 0 4.2-1.8 4.2-4.1 0-2.3-1.7-4-3.9-4-.3 0-.6 0-.9.1.5-2.1 2-3.9 4.1-5l-2.3-1.4Zm9.3 0c-3.6 1.7-6 5.1-6 8.9 0 3.3 2 5.5 4.8 5.5 2.4 0 4.2-1.8 4.2-4.1 0-2.3-1.7-4-3.9-4-.3 0-.6 0-.9.1.5-2.1 2-3.9 4.1-5l-2.3-1.4Z"/>',
    minimal:
      '<path d="M6.2 4.6h3.6l-1.2 9.6H7.4L6.2 4.6Zm8 0h3.6l-1.2 9.6h-1.2l-1.2-9.6Z"/>',
    brackets:
      '<path d="M11 5.6 4.6 12 11 18.4M20 5.6 13.6 12 20 18.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    apostrophe:
      '<path d="M13.4 4.8c-3.6 1.7-6 5.1-6 8.9 0 3.3 2 5.5 4.8 5.5 2.4 0 4.2-1.8 4.2-4.1 0-2.3-1.7-4-3.9-4-.3 0-.6 0-.9.1.5-2.1 2-3.9 4.1-5l-2.3-1.4Z"/>',
    round:
      '<path d="M14 16C14 14.1144 14 13.1716 14.5858 12.5858C15.1716 12 16.1144 12 18 12C19.8856 12 20.8284 12 21.4142 12.5858C22 13.1716 22 14.1144 22 16C22 17.8856 22 18.8284 21.4142 19.4142C20.8284 20 19.8856 20 18 20C16.1144 20 15.1716 20 14.5858 19.4142C14 18.8284 14 17.8856 14 16ZM2 16C2 14.1144 2 13.1716 2.58579 12.5858C3.17157 12 4.11438 12 6 12C7.88562 12 8.82843 12 9.41421 12.5858C10 13.1716 10 14.1144 10 16C10 17.8856 10 18.8284 9.41421 19.4142C8.82843 20 7.88562 20 6 20C4.11438 20 3.17157 20 2.58579 19.4142C2 18.8284 2 17.8856 2 16Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 16V11.8626C14 8.19569 16.5157 5.08584 20 4M2 16V11.8626C2 8.19569 4.51571 5.08584 8 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    square:
      '<path d="M16.0039 19C14.3752 19 13.0513 17.702 13.0068 16.084C13.0037 16.0564 13.001 16.0285 13.001 16C13.001 13.0673 14.0679 10.6182 15.1143 8.91896C15.6388 8.06714 16.1639 7.39495 16.5596 6.93361C16.7576 6.70272 16.9242 6.52334 17.043 6.40041C17.1022 6.3391 17.1499 6.29189 17.1836 6.2588C17.2004 6.24224 17.2139 6.22906 17.2236 6.21974C17.2284 6.21514 17.2324 6.21082 17.2354 6.20802L17.2393 6.20509L17.2402 6.20314C17.5424 5.91999 18.0176 5.93521 18.3008 6.23732C18.5839 6.53953 18.5687 7.01367 18.2666 7.29689C18.2666 7.29689 18.2642 7.29941 18.2617 7.30177C18.2563 7.30697 18.2468 7.31591 18.2344 7.32814C18.2095 7.3526 18.1711 7.3916 18.1211 7.44337C18.021 7.54694 17.8751 7.70394 17.6982 7.91017C17.3435 8.32377 16.8676 8.93304 16.3916 9.70607C15.8041 10.6602 15.2257 11.8516 14.8662 13.2246C15.2172 13.0806 15.601 13 16.0039 13C17.6608 13 19.0039 14.3432 19.0039 16C19.0039 17.6569 17.6608 19 16.0039 19ZM8.00391 19C6.37515 19 5.05134 17.702 5.00684 16.084C5.00375 16.0564 5.00098 16.0285 5.00098 16C5.00098 13.0673 6.06791 10.6182 7.11426 8.91896C7.63881 8.06714 8.16389 7.39495 8.55957 6.93361C8.7576 6.70272 8.9242 6.52334 9.04297 6.40041C9.1022 6.3391 9.14993 6.29189 9.18359 6.2588C9.20045 6.24224 9.21392 6.22906 9.22363 6.21974C9.22843 6.21514 9.2324 6.21082 9.23535 6.20802L9.23926 6.20509L9.24023 6.20314C9.54245 5.91999 10.0176 5.93521 10.3008 6.23732C10.5839 6.53953 10.5687 7.01367 10.2666 7.29689C10.2666 7.29689 10.2642 7.29941 10.2617 7.30177C10.2563 7.30697 10.2468 7.31591 10.2344 7.32814C10.2095 7.3526 10.1711 7.3916 10.1211 7.44337C10.021 7.54694 9.87513 7.70394 9.69824 7.91017C9.34351 8.32377 8.8676 8.93304 8.3916 9.70607C7.80409 10.6602 7.22574 11.8516 6.86621 13.2246C7.21719 13.0806 7.60103 13 8.00391 13C9.66076 13 11.0039 14.3432 11.0039 16C11.0039 17.6569 9.66076 19 8.00391 19Z"/>',
    double:
      '<path d="M8.5 5.5c-2.2 1-3.7 3.1-3.7 5.5 0 2 1.2 3.4 2.9 3.4 1.5 0 2.6-1.1 2.6-2.5 0-1.4-1-2.4-2.3-2.4-.2 0-.4 0-.6.1.3-1.3 1.3-2.4 2.6-3.1L8.5 5.5Zm4.5 0c-2.2 1-3.7 3.1-3.7 5.5 0 2 1.2 3.4 2.9 3.4 1.5 0 2.6-1.1 2.6-2.5 0-1.4-1-2.4-2.3-2.4-.2 0-.4 0-.6.1.3-1.3 1.3-2.4 2.6-3.1L13 5.5Zm4.5 0c-2.2 1-3.7 3.1-3.7 5.5 0 2 1.2 3.4 2.9 3.4 1.5 0 2.6-1.1 2.6-2.5 0-1.4-1-2.4-2.3-2.4-.2 0-.4 0-.6.1.3-1.3 1.3-2.4 2.6-3.1L17.5 5.5Z"/>',
    thin:
      '<path d="M10.5 5C7.5 6.5 5.5 9.5 5.5 12.8c0 2.7 1.6 4.5 3.8 4.5 1.9 0 3.3-1.4 3.3-3.2 0-1.7-1.2-3-2.9-3-.2 0-.5 0-.7.1.4-1.6 1.6-3 3.2-3.9L10.5 5Zm8.5 0c-3 1.5-5 4.5-5 7.8 0 2.7 1.6 4.5 3.8 4.5 1.9 0 3.3-1.4 3.3-3.2 0-1.7-1.2-3-2.9-3-.2 0-.5 0-.7.1.4-1.6 1.6-3 3.2-3.9L19 5Z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>',
    ghost:
      '<path d="M7.5 4.5C5.2 4.5 3.5 6.5 3.5 9c0 2 1 3.5 2.5 4.2v3.3c0 .4.3.7.8.7h.3c.2 0 .3-.2.3-.3v-1.2c0-.2.2-.3.3-.3s.3.1.3.3v1.2c0 .2.2.3.3.3h.3c.2 0 .3-.2.3-.3v-1.2c0-.2.2-.3.3-.3s.3.1.3.3v1.2c0 .2.2.3.3.3h.3c.4 0 .8-.3.8-.8v-3c1.6-.8 2.7-2.5 2.7-4.5 0-2.5-2-4.5-4.5-4.5Zm6.5 0c-2.3 0-4 2-4 4.5 0 2 1 3.5 2.5 4.2v3.3c0 .4.3.7.8.7h.3c.2 0 .3-.2.3-.3v-1.2c0-.2.2-.3.3-.3s.3.1.3.3v1.2c0 .2.2.3.3.3h.3c.2 0 .3-.2.3-.3v-1.2c0-.2.2-.3.3-.3s.3.1.3.3v1.2c0 .2.2.3.3.3h.3c.4 0 .8-.3.8-.8v-3c1.6-.8 2.7-2.5 2.7-4.5 0-2.5-2-4.5-4.5-4.5ZM6.5 8c.6 0 1.1.5 1.1 1.1S7.1 10.2 6.5 10.2 5.4 9.7 5.4 9.1 5.9 8 6.5 8Zm2.8 0c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1Zm6.2 0c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1Zm2.8 0c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1Z"/>',
    none: ""
  };

  function escapeHtml(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function inlineIconSvg(value) {
    try {
      if (!/^data:image\/svg\+xml(?:;charset=utf-8)?,/i.test(value)) return "";
      var svg = decodeURIComponent(value.slice(value.indexOf(",") + 1));
      if (!/^\s*<svg\b/i.test(svg) || /\bon\w+\s*=|\b(?:href|src|style)\s*=|url\s*\(|<!|<\?/i.test(svg)) return "";
      var allowed = ["svg", "g", "path", "circle", "ellipse", "rect", "line", "polyline", "polygon", "title", "desc"];
      var tags = svg.match(/<\/?[\w:-]+/g) || [];
      if (tags.some(function (tag) { return allowed.indexOf(tag.replace(/^<\/?/, "").toLowerCase()) === -1; })) return "";
      return svg;
    } catch (e) { return ""; }
  }
  function quoteSvg(style, which, customSvg) {
    var custom = style === "custom" ? inlineIconSvg(customSvg || "") : "";
    if (custom) return '<span class="aiko-slide__quote-mark aiko-slide__quote-mark--' + which + '" aria-hidden="true">' + custom + '</span>';
    if (style === "custom" && /^data:image\/svg\+xml(?:;charset=utf-8)?,/i.test(customSvg || "")) return '<span class="aiko-slide__quote-mark aiko-slide__quote-mark--' + which + '" aria-hidden="true"><span class="aiko-slide__quote-custom" style="mask-image:url(&quot;' + escapeHtml(customSvg) + '&quot;);-webkit-mask-image:url(&quot;' + escapeHtml(customSvg) + '&quot;)"></span></span>';
    var icon = QUOTE_ICONS[style] || QUOTE_ICONS.default;
    if (!icon) return "";
    return (
      '<span class="aiko-slide__quote-mark aiko-slide__quote-mark--' + which + '" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">' +
      icon +
      "</svg></span>"
    );
  }

  function buildSlide(item, doc, quoteStyle, customSvg) {
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
      quoteSvg(quoteStyle, "open", customSvg) +
      '<p class="aiko-slide__text">' + item.text + "</p>" +
      (item.title ? '<h3 class="aiko-slide__title">' + item.title + "</h3>" : "") +
      (item.subtitle ? '<p class="aiko-slide__subtitle">' + item.subtitle + "</p>" : "") +
      quoteSvg(quoteStyle, "close", customSvg);


    slide.appendChild(media);
    slide.appendChild(body);
    return slide;
  }

  var AIKO_START = Date.now();
  function settingsSettled(root) {
    if (Date.now() - AIKO_START > 3000) return true;
    var G = window.GhostPlugins || {};
    var host = root.closest ? root.closest("[data-ghost-preset]") : null;
    var bid = host && host.getAttribute("data-ghost-preset");
    if (bid && /^gh_[A-Za-z0-9]{4,24}$/.test(bid)) {
      var b = G.blocks && G.blocks[bid];
      return !!(b && (b.merged || b.failed));
    }
    if (document.querySelector("script[data-ghost-workspace], script[data-ghost-key]")) {
      return !!(G.config && G.config["aiko-testimonial-slider"]);
    }
    return true;
  }

  function init(root) {
    // Already rendered and still intact, nothing to do.
    if (
      root.getAttribute("data-aiko-ready") === "true" &&
      root.querySelector(".aiko-slider__viewport")
    ) {
      return;
    }

    // Stale state (page editors such as Squarespace restore saved HTML and can
    // drop our generated nodes), clear everything we own and rebuild.
    /* A rebuild retires the previous instance first, otherwise its autoplay
       timer and page listeners keep running alongside the new one. */
    if (typeof root.__aikoDestroy === "function") {
      try { root.__aikoDestroy(); } catch (e) {}
    }

    var stale = root.querySelectorAll(
      ".aiko-slider__viewport, .aiko-slider__arrow, .aiko-slider__dots"
    );
    for (var s = 0; s < stale.length; s++) {
      if (stale[s].parentNode) stale[s].parentNode.removeChild(stale[s]);
    }
    root.removeAttribute("data-aiko-ready");

    /* Wait for this block's saved preset (or the page install settings)
       before painting, so the demo never flashes first. Gives up after 3s. */
    if (!settingsSettled(root)) {
      root.style.visibility = "hidden";
      if (!root.__aikoWait) {
        root.__aikoWait = setTimeout(function () { root.__aikoWait = null; init(root); }, 3100);
      }
      return;
    }
    root.style.visibility = "";

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
    /* Accessibility: no automatic movement for visitors who ask for
       reduced motion, they still get the arrows and dots. */
    if (typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settings.autoplay = false;
      settings.transitionSpeed = 0;
    }
    root.setAttribute("data-aiko-ready", "true");
    root.setAttribute("data-aiko-quote-style", settings.quoteStyle);
    root.setAttribute("data-aiko-arrow-style", settings.arrowStyle);
    root.setAttribute("data-aiko-arrows-mobile", settings.showArrowsMobile ? "true" : "false");
    root.style.setProperty("--aiko-speed", settings.transitionSpeed + "ms");
    var visual = Object.assign({}, window.GhostPluginConfig || {}, window.AikoSliderConfig || {}, root.dataset, liveConfig(root));
    var styleKeys = {
      image_ratio: ["--aiko-image-ratio", ""], quote_fill: ["--aiko-quote-fill", ""],
      quote_stroke_width: ["--aiko-quote-stroke-width", ""], arrow_fill: ["--aiko-arrow-fill", ""],
      arrow_stroke_width: ["--aiko-arrow-stroke-width", ""], arrow_icon_size: ["--aiko-arrow-icon-size", "px"]
    };
    Object.keys(styleKeys).forEach(function (key) {
      if (visual[key] === undefined || visual[key] === "") return;
      var spec = styleKeys[key];
      var value = String(visual[key]);
      if (spec[1] && /^-?[\d.]+$/.test(value)) value += spec[1];
      root.style.setProperty(spec[0], value);
    });

    var source = root.querySelector(".aiko-slider__source");
    if (source) source.setAttribute("hidden", "hidden");


    var viewport = doc.createElement("div");
    viewport.className = "aiko-slider__viewport";
    var track = doc.createElement("div");
    track.className = "aiko-slider__track";
    viewport.appendChild(track);

    items.forEach(function (item) {
      track.appendChild(buildSlide(item, doc, settings.quoteStyle, settings.quoteSvg));
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

    if (settings.showArrows && items.length > 0) {
      var arrowSet = ARROWS[settings.arrowStyle] || ARROWS.default;
      ["prev", "next"].forEach(function (dir) {
        var btn = doc.createElement("button");
        btn.type = "button";
        btn.className = "aiko-slider__arrow aiko-slider__arrow--" + dir;
        btn.setAttribute("aria-label", dir === "prev" ? "Previous testimonial" : "Next testimonial");
        if (settings.arrowStyle === "custom" && /^data:image\/svg\+xml(?:;charset=utf-8)?,/i.test(settings.arrowSvg)) {
          var custom = inlineIconSvg(settings.arrowSvg);
          var ic = doc.createElement("span");
          ic.className = custom ? "aiko-slider__arrow-inline" : "aiko-slider__arrow-custom";
          if (custom) ic.innerHTML = custom;
          ic.style.setProperty("-webkit-mask-image", 'url("' + settings.arrowSvg.replace(/"/g, "%22") + '")');
          ic.style.setProperty("mask-image", 'url("' + settings.arrowSvg.replace(/"/g, "%22") + '")');
          btn.appendChild(ic);
        } else {
          btn.innerHTML = dir === "prev" ? arrowSet.left : arrowSet.right;
        }
        btn.addEventListener("click", function () {
          goTo(index + (dir === "prev" ? -1 : 1), true);
        });
        root.appendChild(btn);
      });
    }

    if (settings.showDots && items.length > 0) {
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

    function onVisibility() {
      if (doc.hidden) stop();
      else start();
    }

    if (settings.pauseOnHover) {
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);
    }

    doc.addEventListener("visibilitychange", onVisibility);

    root.__aikoDestroy = function () {
      stop();
      root.removeEventListener("mouseenter", stop);
      root.removeEventListener("mouseleave", start);
      doc.removeEventListener("visibilitychange", onVisibility);
    };

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
        /* cross-origin frame, ignore */
      }
    }
    return docs;
  }

  // Use the real public object URL. The short /plugins/... path is not routed
  // by the storage origin and returns 404 on third-party sites.
  var STYLE_HREF = "https://assets.ghostplugins.com/storage/v1/object/public/customer-files/plugins/aiko-testimonial-slider/style.css";

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

  // Some hosts render blocks a moment after load, poll briefly, then stop.
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


  // Host sites can also inject blocks much later (lazy sections, editor), re-scan safely.
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
    version: "1.5.2",
    init: init,
    initAll: initAll,
    // Paste AikoTestimonialSlider.debug() in the browser console to see what
    // the script can find on the page.
    debug: function () {
      var roots = document.querySelectorAll("[data-aiko], .aiko-slider");
      var report = {
        version: "1.5.2",
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
