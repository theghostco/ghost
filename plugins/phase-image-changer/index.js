(function () {
  "use strict";
  var DEFAULTS = {
    images: "",
    demoTitleOne: "Tab Title",
    demoDescriptionOne: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    demoTitleTwo: "Tab Title",
    demoDescriptionTwo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    demoTitleThree: "Tab Title",
    demoDescriptionThree: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    demoLink: "/",
    buttonText: "Button",
    showButton: true,
    openNewTab: false,
    imageSide: "left",
    placement: "block",
    autoplay: true,
    autoplayInterval: 5000,
    showTimer: true,
    pauseOnHover: true,
    swipeEnabled: true,
    galleryLabel: "Featured images",
    untitledTabLabel: "View image",
    imageLabel: "Featured image"
  };
  var SLUG = "phase-image-changer";
  var SELECTOR = ".gp-phase-image-changer";
  var prior = window.GhostPhaseImageChanger;
  if (prior && typeof prior.destroy === "function") prior.destroy();
  var instances = new Map();
  var sectionLeases = new WeakMap();
  var sequence = 0;
  var readyHandler = null;

  function text(value) { return value == null ? "" : String(value); }
  function configFor(root) {
    var globalConfig = window.GhostPluginConfig || {};
    if (globalConfig[SLUG] && typeof globalConfig[SLUG] === "object") globalConfig = globalConfig[SLUG];
    var local = {};
    try {
      if (window.GhostPlugins && typeof window.GhostPlugins.configFor === "function") {
        local = window.GhostPlugins.configFor(root, SLUG) || {};
      }
    } catch (error) { local = {}; }
    return Object.assign({}, DEFAULTS, globalConfig, local);
  }
  function safeURL(value, image) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      var url = new URL(value.trim(), document.baseURI);
      return (image ? /^(https?:|blob:|file:)$/ : /^(https?:|mailto:|tel:|file:)$/).test(url.protocol) ? url.href : "";
    } catch (error) { return ""; }
  }
  function gallery(value, config) {
    var list = value;
    if (typeof list === "string") {
      var raw = list.trim();
      if (!raw) list = [];
      else {
        try { list = JSON.parse(raw); }
        catch (error) {
          if (raw.indexOf("blob:") === 0 && raw.indexOf("\n") < 0) list = [raw];
          else list = raw.split(/[\n,]+/);
        }
      }
    }
    if (!Array.isArray(list)) list = [];
    list = list.map(function (item) {
      if (typeof item === "string") item = { src: item };
      if (!item || typeof item !== "object") return null;
      var src = safeURL(item.src, true);
      return src ? { src: src, alt: text(item.alt), title: text(item.title), caption: text(item.caption), link: safeURL(item.link, false), button: text(item.button), newTab: item.newTab === true || item.newTab === "true" } : null;
    }).filter(Boolean);
    if (!list.length) {
      list = [
        { src: "demo_light_image.webp", alt: text(config.demoTitleOne), title: text(config.demoTitleOne), caption: text(config.demoDescriptionOne), link: safeURL(config.demoLink, false) },
        { src: "demo_dark_image.webp", alt: text(config.demoTitleTwo), title: text(config.demoTitleTwo), caption: text(config.demoDescriptionTwo), link: safeURL(config.demoLink, false) },
        { src: "demo_light_image.webp", alt: text(config.demoTitleThree), title: text(config.demoTitleThree), caption: text(config.demoDescriptionThree), link: safeURL(config.demoLink, false) }
      ];
    }
    return list;
  }
  function acquireSection(section) {
    var lease = sectionLeases.get(section);
    if (!lease) {
      lease = { count: 0, value: section.style.getPropertyValue("position"), priority: section.style.getPropertyPriority("position"), changed: false };
      if (getComputedStyle(section).position === "static") {
        section.style.setProperty("position", "relative");
        lease.changed = true;
      }
      sectionLeases.set(section, lease);
    }
    lease.count++;
    return function () {
      lease.count--;
      if (!lease.count) {
        if (lease.changed && section.style.position === "relative") {
          if (lease.value) section.style.setProperty("position", lease.value, lease.priority);
          else section.style.removeProperty("position");
        }
        sectionLeases.delete(section);
      }
    };
  }
  function build(root) {
    var config = configFor(root);
    var items = gallery(config.images, config);
    var cleanup = [];
    var active = 0;
    var elapsed = 0;
    var lastTime = null;
    var clockFrame = 0;
    var layoutFrame = 0;
    var retries = 0;
    var disposed = false;
    var hovered = false;
    var focused = false;
    var visible = true;
    var touch = null;
    var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var mobile = window.matchMedia("(max-width: 767px)");
    var interval = Math.max(500, Number(config.autoplayInterval) || 5000);
    var ownedStyles = ["height", "min-height", "position", "inset", "z-index"].map(function (name) {
      return [name, root.style.getPropertyValue(name), root.style.getPropertyPriority(name)];
    });
    var attributes = ["data-image-side", "data-image-ratio", "data-shadow-style"].map(function (name) { return [name, root.getAttribute(name)]; });
    var originalNodes = Array.from(root.childNodes);
    var section = root.closest("section.page-section, section[data-section-id], section");
    var block = root.closest(".fe-block");
    var anchor = null;
    var releaseSection = null;
    var animation = null;
    var preloadNodes = [];
    var id = "gp-phase-" + (++sequence);

    function listen(target, type, fn, options) {
      if (target.addEventListener) {
        target.addEventListener(type, fn, options);
        cleanup.push(function () { target.removeEventListener(type, fn, options); });
      } else if (target.addListener) {
        target.addListener(fn);
        cleanup.push(function () { target.removeListener(fn); });
      }
    }
    function node(tag, name, value) {
      var el = document.createElement(tag);
      if (name) el.className = name;
      if (value !== undefined) el.textContent = value;
      return el;
    }
    root.replaceChildren();
    root.dataset.imageSide = config.imageSide === "right" ? "right" : "left";
    if (config.placement === "section" && section) {
      anchor = document.createComment("phase-image-changer");
      root.before(anchor);
      releaseSection = acquireSection(section);
      section.appendChild(root);
      root.style.position = "absolute";
      root.style.inset = "0";
      root.style.zIndex = "1";
    }
    var layout = node("div", "gp-phase-layout");
    var media = node("figure", "gp-phase-media");
    media.id = id + "-image";
    media.setAttribute("role", "region");
    media.setAttribute("aria-label", text(config.imageLabel));
    var image = node("img", "gp-phase-image");
    image.alt = "";
    image.decoding = "async";
    image.draggable = false;
    media.appendChild(image);
    var tabs = node("div", "gp-phase-tabs");
    tabs.setAttribute("role", "group");
    tabs.setAttribute("aria-label", text(config.galleryLabel));
    var status = node("span", "gp-phase-status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    layout.append(media, tabs);
    root.append(layout, status);
    var cards = [], triggers = [], actions = [], rings = [];
    var circumference = 2 * Math.PI * 9;
    items.forEach(function (item, index) {
      var preload = new Image();
      preload.decoding = "async";
      preload.src = item.src;
      preloadNodes.push(preload);
      var card = node("div", "gp-phase-tab");
      var trigger = node("button", "gp-phase-trigger");
      trigger.type = "button";
      trigger.setAttribute("aria-controls", media.id);
      trigger.setAttribute("aria-label", item.title || text(config.untitledTabLabel) + " " + (index + 1));
      var copy = node("span", "gp-phase-copy");
      if (item.title) copy.appendChild(node("span", "gp-phase-title", item.title));
      if (item.caption) copy.appendChild(node("span", "gp-phase-description", item.caption));
      trigger.appendChild(copy);
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("gp-phase-timer");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      var progress;
      ["gp-phase-timer-track", "gp-phase-timer-progress"].forEach(function (name) {
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.classList.add(name);
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "9");
        svg.appendChild(circle);
        if (name === "gp-phase-timer-progress") {
          progress = circle;
          progress.style.strokeDasharray = String(circumference);
          progress.style.strokeDashoffset = String(circumference);
        }
      });
      trigger.appendChild(svg);
      card.appendChild(trigger);
      var actionWrap = node("div", "gp-phase-action-wrap");
      actionWrap.hidden = true;
      var label = item.button || text(config.buttonText);
      if (config.showButton && item.link && label) {
        var action = node("a", "gp-phase-action", label);
        action.href = item.link;
        if (item.newTab || config.openNewTab === true) { action.target = "_blank"; action.rel = "noopener noreferrer"; }
        actionWrap.appendChild(action);
      }
      card.appendChild(actionWrap);
      tabs.appendChild(card);
      cards.push(card); triggers.push(trigger); actions.push(actionWrap);
      rings.push({ svg: svg, progress: progress });
      listen(trigger, "click", function () { select(index, true); });
      listen(trigger, "keydown", function (event) {
        var next = index;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next++;
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next--;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = items.length - 1;
        else return;
        event.preventDefault();
        next = (next + items.length) % items.length;
        select(next, true);
        triggers[next].focus();
      });
    });
    function canPlay() { return Boolean(config.autoplay) && items.length > 1 && !motion.matches; }
    function paused() { return document.hidden || !visible || focused || (config.pauseOnHover && hovered); }
    function paintProgress() {
      rings.forEach(function (ring, index) {
        if (config.showTimer && canPlay() && index === active) ring.svg.removeAttribute("hidden");
        else ring.svg.setAttribute("hidden", "");
        ring.progress.style.strokeDashoffset = String(circumference * (1 - Math.min(1, elapsed / interval)));
      });
    }
    function syncClock() {
      lastTime = null;
      if (clockFrame) cancelAnimationFrame(clockFrame);
      clockFrame = 0;
      paintProgress();
      if (!disposed && canPlay() && !paused()) clockFrame = requestAnimationFrame(tick);
    }
    function tick(time) {
      clockFrame = 0;
      if (disposed || !canPlay() || paused()) { lastTime = null; return; }
      if (lastTime !== null) elapsed += Math.min(time - lastTime, 250);
      lastTime = time;
      if (elapsed >= interval) select(active + 1, false);
      paintProgress();
      if (!disposed && !clockFrame) clockFrame = requestAnimationFrame(tick);
    }
    function duration() {
      var raw = getComputedStyle(root).getPropertyValue("--transition-duration").trim();
      var value = parseFloat(raw) || 0;
      return raw.endsWith("ms") ? value : raw.endsWith("s") ? value * 1000 : value;
    }
    function animateImage() {
      if (animation) animation.cancel();
      animation = null;
      var ms = duration();
      if (!motion.matches && ms > 0 && image.animate) animation = image.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms, easing: "ease-out" });
    }
    function select(index, announce) {
      active = (index + items.length) % items.length;
      elapsed = 0;
      lastTime = null;
      image.hidden = false;
      image.alt = items[active].alt;
      image.src = items[active].src;
      cards.forEach(function (card, i) {
        var selected = i === active;
        card.dataset.active = String(selected);
        triggers[i].setAttribute("aria-pressed", String(selected));
        actions[i].hidden = !selected || !actions[i].firstChild;
      });
      if (announce) status.textContent = items[active].title || text(config.untitledTabLabel) + " " + (active + 1);
      paintProgress();
      queueMeasure();
      syncClock();
    }
    function queueMeasure() { if (!disposed && !layoutFrame) layoutFrame = requestAnimationFrame(measure); }
    function measure() {
      layoutFrame = 0;
      if (disposed) return;
      var css = getComputedStyle(root);
      var ratio = css.getPropertyValue("--image-ratio").trim();
      root.dataset.imageRatio = ratio && ratio !== "auto" ? "fixed" : "auto";
      var shadow = css.getPropertyValue("--tab-shadow-style").trim();
      root.dataset.shadowStyle = shadow === "none" || shadow === "inset" ? shadow : "outer";
      var target = anchor ? section : block || root.parentElement;
      var box = target ? target.getBoundingClientRect() : root.getBoundingClientRect();
      var own = root.getBoundingClientRect();
      var fallback = parseFloat(css.getPropertyValue("--image-height")) || box.width || own.width || 420;
      var padding = parseFloat(css.getPropertyValue("--surface-padding")) || 0;
      var gap = parseFloat(css.getPropertyValue("--layout-gap")) || 0;
      var natural = mobile.matches
        ? media.getBoundingClientRect().height + tabs.getBoundingClientRect().height + gap + padding * 2
        : Math.max(media.getBoundingClientRect().height, tabs.getBoundingClientRect().height) + padding * 2;
      // Code Block mode follows the plugin's own content height. Reading the block height here
      // fed back into itself (the block grows to fit the root), so the block kept getting taller.
      var height = anchor
        ? Math.ceil(Math.max(box.height > 1 ? box.height : fallback, natural || fallback, 1))
        : Math.ceil(natural > 1 ? natural : fallback);
      var px = height + "px";
      if (root.style.height !== px) root.style.height = px;
      if (root.style.minHeight !== px) root.style.minHeight = px;
      if ((!box.width || !box.height) && retries < 3) { retries++; queueMeasure(); }
    }
    listen(image, "load", function () { image.hidden = false; animateImage(); queueMeasure(); });
    listen(image, "error", function () { image.hidden = true; queueMeasure(); });
    listen(root, "mouseenter", function () { hovered = true; syncClock(); });
    listen(root, "mouseleave", function () { hovered = false; syncClock(); });
    listen(root, "focusin", function () { focused = true; syncClock(); });
    listen(root, "focusout", function (event) { focused = Boolean(event.relatedTarget && root.contains(event.relatedTarget)); syncClock(); });
    listen(document, "visibilitychange", syncClock);
    listen(window, "resize", queueMeasure);
    listen(mobile, "change", queueMeasure);
    listen(motion, "change", function () { if (animation) animation.cancel(); syncClock(); });
    if (config.swipeEnabled) {
      listen(media, "touchstart", function (event) {
        touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
      }, { passive: true });
      listen(media, "touchend", function (event) {
        if (!touch || !event.changedTouches.length) return;
        var point = event.changedTouches[0];
        var dx = point.clientX - touch.x, dy = point.clientY - touch.y;
        touch = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) select(active + (dx < 0 ? 1 : -1), true);
      }, { passive: true });
      listen(media, "touchcancel", function () { touch = null; });
    }
    if (typeof ResizeObserver !== "undefined") {
      var observer = new ResizeObserver(queueMeasure);
      if (anchor) observer.observe(section);
      else if (block) observer.observe(block);
      else if (root.parentElement) observer.observe(root.parentElement);
      observer.observe(media); observer.observe(tabs);
      cleanup.push(function () { observer.disconnect(); });
    }
    if (typeof IntersectionObserver !== "undefined") {
      var intersection = new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; syncClock(); });
      intersection.observe(root);
      cleanup.push(function () { intersection.disconnect(); });
    }
    select(0, false);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!disposed) queueMeasure(); });
    return function () {
      disposed = true;
      if (clockFrame) cancelAnimationFrame(clockFrame);
      if (layoutFrame) cancelAnimationFrame(layoutFrame);
      if (animation) animation.cancel();
      cleanup.forEach(function (fn) { fn(); });
      preloadNodes.forEach(function (preload) { preload.removeAttribute("src"); });
      root.replaceChildren.apply(root, originalNodes);
      if (anchor && anchor.parentNode) anchor.replaceWith(root);
      if (releaseSection) releaseSection();
      ownedStyles.forEach(function (entry) {
        if (entry[1]) root.style.setProperty(entry[0], entry[1], entry[2]);
        else root.style.removeProperty(entry[0]);
      });
      attributes.forEach(function (pair) { if (pair[1] === null) root.removeAttribute(pair[0]); else root.setAttribute(pair[0], pair[1]); });
    };
  }
  function initAll() {
    instances.forEach(function (dispose) { dispose(); });
    instances.clear();
    document.querySelectorAll(SELECTOR).forEach(function (root) { instances.set(root, build(root)); });
  }
  function destroy() {
    document.removeEventListener("ghost:config", initAll);
    if (readyHandler) document.removeEventListener("DOMContentLoaded", readyHandler);
    instances.forEach(function (dispose) { dispose(); });
    instances.clear();
  }
  window.GhostPhaseImageChanger = { initAll: initAll, destroy: destroy };
  document.addEventListener("ghost:config", initAll);
  if (document.readyState === "loading") {
    readyHandler = initAll;
    document.addEventListener("DOMContentLoaded", readyHandler, { once: true });
  } else initAll();
})();
