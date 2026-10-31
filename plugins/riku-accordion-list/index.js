(function () {
  "use strict";
  var DEFAULTS = {
    titleText: "Velvet Dreams Studio\nNeon Pulse Agency\nMidnight Canvas\nEcho Digital Lab\nPrism Media House\nAurora Design Co",
    subtitleText: "2026\n2025\n2025\n2024\n2024\n2023",
    projectLinks: "",
    images: "",
    closeText: "Close",
    layout: "sideways",
    openMode: "block",
    initialProject: 1,
    openInteraction: "hover",
    linkNewTab: false,
    animationEnabled: true,
    mobileBreakpoint: 767,
    fullSection: false,
    dividerVisibility: "all"
  };
  var STYLE_SETTINGS = [{"key":"titleFontFamily","target":"--title-font-family","choices":["inherit","Arial, sans-serif","Helvetica, Arial, sans-serif","Georgia, serif","'Times New Roman', serif","'Courier New', monospace"]},{"key":"titleFontWeight","target":"--title-font-weight","choices":["100","200","300","400","500","600","700","800","900"]},{"key":"titleFontStyle","target":"--title-font-style","choices":["normal","italic","oblique"]},{"key":"titleFontSize","target":"--title-font-size","min":10,"max":120,"unit":"px"},{"key":"titleLineHeight","target":"--title-line-height","min":0.8,"max":3,"unit":""},{"key":"titleLetterSpacing","target":"--title-letter-spacing","min":-5,"max":12,"unit":"px"},{"key":"titleColor","target":"--title-color"},{"key":"titleAlignment","target":"--title-text-alignment","choices":["left","center","right"]},{"key":"titleDecoration","target":"--title-text-decoration","choices":["none","underline","overline","line-through"]},{"key":"titleTransform","target":"--title-text-transform","choices":["none","uppercase","lowercase","capitalize"]},{"key":"titleActiveColor","target":"--title-active-color"},{"key":"subtitleFontFamily","target":"--subtitle-font-family","choices":["inherit","Arial, sans-serif","Helvetica, Arial, sans-serif","Georgia, serif","'Times New Roman', serif","'Courier New', monospace"]},{"key":"subtitleFontWeight","target":"--subtitle-font-weight","choices":["100","200","300","400","500","600","700","800","900"]},{"key":"subtitleFontStyle","target":"--subtitle-font-style","choices":["normal","italic","oblique"]},{"key":"subtitleFontSize","target":"--subtitle-font-size","min":10,"max":120,"unit":"px"},{"key":"subtitleLineHeight","target":"--subtitle-line-height","min":0.8,"max":3,"unit":""},{"key":"subtitleLetterSpacing","target":"--subtitle-letter-spacing","min":-5,"max":12,"unit":"px"},{"key":"subtitleColor","target":"--subtitle-color"},{"key":"subtitleAlignment","target":"--subtitle-text-alignment","choices":["left","center","right"]},{"key":"subtitleDecoration","target":"--subtitle-text-decoration","choices":["none","underline","overline","line-through"]},{"key":"subtitleTransform","target":"--subtitle-text-transform","choices":["none","uppercase","lowercase","capitalize"]},{"key":"subtitleActiveColor","target":"--subtitle-active-color"},{"key":"focusColor","target":"--focus-color"},{"key":"imageHeight","target":"--image-height","min":80,"max":1600,"unit":"px"},{"key":"imageRatio","target":"--image-aspect-ratio","choices":["auto","1/1","4/3","3/2","16/9","9/16"]},{"key":"imagePosition","target":"--image-position","choices":["center","top","bottom","left","right","left top","right top","left bottom","right bottom"]},{"key":"imageObjectFit","target":"--image-object-fit","choices":["cover","contain","fill","none","scale-down"]},{"key":"imageBorderStyle","target":"--image-border-style","choices":["none","solid","dashed","dotted","double"]},{"key":"imageBorderWidth","target":"--image-border-width","min":0,"max":20,"unit":"px"},{"key":"imageBorderColor","target":"--image-border-color"},{"key":"imageBorderRadius","target":"--image-border-radius","min":0,"max":160,"unit":"px"},{"key":"railSize","target":"--rail-size","min":44,"max":180,"unit":"px"},{"key":"contentPaddingVertical","target":"--content-padding-vertical","min":0,"max":80,"unit":"px"},{"key":"contentPaddingHorizontal","target":"--content-padding-horizontal","min":0,"max":80,"unit":"px"},{"key":"contentGap","target":"--content-gap","min":0,"max":80,"unit":"px"},{"key":"dividerWidth","target":"--divider-width","min":0,"max":12,"unit":"px"},{"key":"dividerColor","target":"--divider-color"},{"key":"dividerStyle","target":"--divider-style","choices":["none","solid","dashed","dotted","double"]},{"key":"openingDuration","target":"--opening-duration","min":0,"max":2000,"unit":"ms"},{"key":"closingDuration","target":"--closing-duration","min":0,"max":2000,"unit":"ms"},{"key":"animationEasing","target":"--animation-easing","choices":["cubic-bezier(0.22, 1, 0.36, 1)","ease-in-out","linear","cubic-bezier(0.34, 1.56, 0.64, 1)"]},{"key":"elementPaddingVertical","target":"--element-padding-vertical","min":0,"max":120,"unit":"px"},{"key":"elementPaddingHorizontal","target":"--element-padding-horizontal","min":0,"max":120,"unit":"px"},{"key":"mobileElementPaddingVertical","target":"--mobile-element-padding-vertical","min":0,"max":120,"unit":"px"},{"key":"mobileElementPaddingHorizontal","target":"--mobile-element-padding-horizontal","min":0,"max":120,"unit":"px"},{"key":"mobileContentPaddingVertical","target":"--mobile-content-padding-vertical","min":0,"max":120,"unit":"px"},{"key":"mobileContentPaddingHorizontal","target":"--mobile-content-padding-horizontal","min":0,"max":120,"unit":"px"}];
  var states = new Map();
  var serial = 0;
  var slug = "riku-accordion-list";
  if (window.GhostRikuAccordionList && window.GhostRikuAccordionList.destroy) {
    window.GhostRikuAccordionList.destroy();
  }
  function bool(value) { return value === true || value === "true" || value === 1; }
  function lines(value) { return String(value == null ? "" : value).split(/\r?\n/); }
  function url(value, image) {
    var text = String(value || "").trim();
    if (!text) return "";
    try {
      var protocol = new URL(text, document.baseURI).protocol;
      var allowed = image ? ["http:", "https:", "blob:", "data:", "file:"] : ["http:", "https:", "mailto:", "tel:"];
      return allowed.indexOf(protocol) >= 0 ? text : "";
    } catch (error) { return ""; }
  }
  function gallery(value) {
    if (typeof value === "string") {
      if (!value.trim()) return [];
      try { value = JSON.parse(value); }
      catch (error) { value = value.split(/\r?\n|,/); }
    }
    if (!Array.isArray(value)) value = [value];
    return value.map(function (entry) {
      if (typeof entry === "string") entry = { src: entry };
      entry = entry || {};
      return { src: url(entry.src, true), alt: String(entry.alt || ""), link: url(entry.link, false) };
    });
  }
  function settings(root) {
    var local = {};
    if (window.GhostPlugins && typeof window.GhostPlugins.configFor === "function") {
      try { local = window.GhostPlugins.configFor(root, slug) || {}; } catch (error) {}
    }
    var global = window.GhostPluginConfig || {};
    if (global[slug] && typeof global[slug] === "object") global = global[slug];
    return Object.assign({}, DEFAULTS, global, local);
  }
  function node(tag, className, text) {
    var el = document.createElement(tag);
    el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }
  function init(root) {
    var config = settings(root);
    var cleanups = [];
    var attributes = {};
    var variables = [];
    var section = root.closest(".page-section, section");
    var originalWidth = root.style.getPropertyValue("width");
    var originalWidthPriority = root.style.getPropertyPriority("width");
    var originalLeft = root.style.getPropertyValue("left");
    var originalLeftPriority = root.style.getPropertyPriority("left");
    var sectionOffset = 0;
    var sectionTopOffset = 0;
    var canvas = root.closest(".fe-block, .codemodule-block, #gp-root, [data-gp-canvas]") || root.closest(".sqs-block-code") || root.parentElement;
    var originalHeight = root.style.getPropertyValue("height");
    var originalHeightPriority = root.style.getPropertyPriority("height");
    var originalTop = root.style.getPropertyValue("top");
    var originalTopPriority = root.style.getPropertyPriority("top");
    ["--resolved-rail-size", "--resolved-image-width", "--resolved-list-height"].forEach(function (name) {
      variables.push({ name: name, value: root.style.getPropertyValue(name), priority: root.style.getPropertyPriority(name) });
    });
    var original = document.createDocumentFragment();
    while (root.firstChild) original.appendChild(root.firstChild);
    function attribute(name, value) {
      if (!(name in attributes)) attributes[name] = root.getAttribute(name);
      root.setAttribute(name, value);
    }
    function on(target, event, handler) {
      target.addEventListener(event, handler);
      cleanups.push(function () { target.removeEventListener(event, handler); });
    }
    STYLE_SETTINGS.forEach(function (setting) {
      var value = config[setting.key];
      if (value == null) return;
      if (setting.choices && setting.choices.indexOf(String(value)) < 0) return;
      if (setting.min != null) {
        value = Number(value);
        if (!Number.isFinite(value)) return;
        value = String(Math.min(setting.max, Math.max(setting.min, value))) + setting.unit;
      }
      variables.push({ name: setting.target, value: root.style.getPropertyValue(setting.target), priority: root.style.getPropertyPriority(setting.target) });
      root.style.setProperty(setting.target, String(value));
    });
    attribute("data-layout", config.layout === "horizontal" ? "horizontal" : "sideways");
    attribute("data-dividers", config.dividerVisibility === "none" ? "none" : config.dividerVisibility === "hide-top" ? "hide-top" : "all");
    var ratio = getComputedStyle(root).getPropertyValue("--image-aspect-ratio").trim();
    attribute("data-ratio", ratio === "auto" ? "auto" : "fixed");
    var reduced = matchMedia("(prefers-reduced-motion: reduce)");
    var hover = matchMedia("(hover: hover) and (pointer: fine)");
    function motion() { attribute("data-reduced", String(reduced.matches || !bool(config.animationEnabled))); }
    motion();
    if (reduced.addEventListener) on(reduced, "change", motion);
    var list = node("div", "pf-list");
    var dialog = node("dialog", "pf-dialog");
    dialog.setAttribute("aria-label", config.closeText);
    var close = node("button", "pf-close", config.closeText);
    close.type = "button";
    dialog.appendChild(close);
    root.appendChild(list);
    root.appendChild(dialog);
    var titles = lines(config.titleText);
    var subtitles = lines(config.subtitleText);
    var links = lines(config.projectLinks);
    var images = gallery(config.images);
    var items = [];
    var active = -1;
    var opener = null;
    function open(index) {
      active = index;
      items.forEach(function (item, i) {
        var expanded = i === index;
        item.node.dataset.open = String(expanded);
        item.trigger.setAttribute("aria-expanded", String(expanded));
        item.panel.setAttribute("aria-hidden", String(!expanded));
        item.panel.inert = !expanded;
        if (item.imageLink) item.imageLink.tabIndex = expanded ? 0 : -1;
      });
      measure();
    }
    function fullscreen(trigger) {
      if (dialog.open) return;
      opener = trigger;
      dialog.appendChild(list);
      try { dialog.showModal(); trigger.focus({ preventScroll: true }); }
      catch (error) { root.insertBefore(list, dialog); }
    }
    titles.forEach(function (title, sourceIndex) {
      if (!title.trim()) return;
      var index = items.length;
      var imageEntry = images[sourceIndex] || {};
      var href = url(links[sourceIndex], false) || imageEntry.link || "";
      var id = "gp-riku-accordion-list-" + (++serial);
      var item = node("div", "pf-item");
      var trigger = node(href ? "a" : "button", "pf-trigger");
      trigger.id = id + "-trigger";
      trigger.setAttribute("aria-controls", id + "-panel");
      if (href) {
        trigger.href = href;
        if (bool(config.linkNewTab)) { trigger.target = "_blank"; trigger.rel = "noopener noreferrer"; }
      } else trigger.type = "button";
      if (subtitles[sourceIndex]) trigger.appendChild(node("span", "pf-subtitle", subtitles[sourceIndex]));
      trigger.appendChild(node("span", "pf-title", title));
      var panel = node("div", "pf-panel");
      panel.id = id + "-panel";
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", trigger.id);
      var inner = node("div", "pf-inner");
      var content = node("div", "pf-content");
      var image = node("img", "pf-image");
      on(image, "load", measure);
      image.src = imageEntry.src || (sourceIndex % 2 ? "demo_light_image.webp" : "demo_dark_image.webp");
      image.alt = imageEntry.alt || title;
      image.decoding = "async";
      var imageLink = null;
      if (href) {
        imageLink = node("a", "pf-image-link");
        imageLink.href = href;
        if (bool(config.linkNewTab)) { imageLink.target = "_blank"; imageLink.rel = "noopener noreferrer"; }
        imageLink.appendChild(image);
        content.appendChild(imageLink);
      } else content.appendChild(image);
      inner.appendChild(content);
      panel.appendChild(inner);
      item.appendChild(trigger);
      item.appendChild(panel);
      list.appendChild(item);
      items.push({ node: item, trigger: trigger, panel: panel, imageLink: imageLink, image: image });
      on(trigger, "click", function (event) {
        var needsFullscreen = config.openMode === "fullscreen" && !dialog.open;
        if (href && active === index && !needsFullscreen) return;
        event.preventDefault();
        open(active === index && !needsFullscreen ? -1 : index);
        if (active >= 0 && needsFullscreen) fullscreen(trigger);
      });
      on(trigger, "pointerenter", function (event) {
        if (config.openMode !== "fullscreen" && config.openInteraction === "hover" && hover.matches && event.pointerType !== "touch") open(index);
      });
      on(trigger, "keydown", function (event) {
        var next = index;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next++;
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next--;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = items.length - 1;
        else if (event.key === " " && href) { event.preventDefault(); trigger.click(); return; }
        else return;
        event.preventDefault();
        items[(next + items.length) % items.length].trigger.focus();
      });
    });
    function restore() {
      root.insertBefore(list, dialog);
      open(-1);
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      opener = null;
    }
    on(close, "click", function () { dialog.close(); });
    on(dialog, "cancel", function (event) { event.preventDefault(); dialog.close(); });
    on(dialog, "close", restore);
    function measure() {
      if (bool(config.fullSection) && section) {
        var sectionBounds = section.getBoundingClientRect();
        var rootBounds = root.getBoundingClientRect();
        var nextOffset = sectionBounds.left - (rootBounds.left - sectionOffset);
        sectionOffset = nextOffset;
        root.style.width = sectionBounds.width + "px";
        root.style.left = nextOffset + "px";
        sectionTopOffset = sectionBounds.top - (rootBounds.top - sectionTopOffset);
        root.style.top = sectionTopOffset + "px";
      }
      var heightHost = bool(config.fullSection) && section ? section : canvas;
      var hostBounds = heightHost ? heightHost.getBoundingClientRect() : null;
      var currentBounds = root.getBoundingClientRect();
      var bottomPadding = 0;
      var ancestor = root.parentElement;
      if (!(bool(config.fullSection) && section)) {
        while (ancestor) {
          bottomPadding += parseFloat(getComputedStyle(ancestor).paddingBottom) || 0;
          if (ancestor === heightHost) break;
          ancestor = ancestor.parentElement;
        }
      }
      var hostHeight = hostBounds && hostBounds.height > 0 ? hostBounds.bottom - currentBounds.top - bottomPadding : window.innerHeight - currentBounds.top;
      var computedRoot = getComputedStyle(root);
      var verticalPadding = (parseFloat(computedRoot.paddingTop) || 0) + (parseFloat(computedRoot.paddingBottom) || 0);
      root.style.height = Math.max(0, hostHeight) + "px";
      root.style.setProperty("--resolved-list-height", Math.max(0, hostHeight - verticalPadding) + "px");
      var width = root.getBoundingClientRect().width;
      var breakpoint = Number(config.mobileBreakpoint);
      if (!Number.isFinite(breakpoint)) breakpoint = DEFAULTS.mobileBreakpoint;
      var phone = window.matchMedia("(max-width: 767px)").matches;
      var minimumRail = parseFloat(getComputedStyle(root).getPropertyValue("--rail-size")) || 68;
      attribute("data-mobile", String(phone || width <= breakpoint));
      var computed = getComputedStyle(root);
      var available = Math.max(0, width - parseFloat(computed.paddingLeft || 0) - parseFloat(computed.paddingRight || 0));
      var panelHeight = Math.max(0, hostHeight - verticalPadding);
      var paddingY = parseFloat(computed.getPropertyValue("--content-padding-vertical")) || 0;
      var paddingX = parseFloat(computed.getPropertyValue("--content-padding-horizontal")) || 0;
      var selected = items[active >= 0 ? active : 0];
      var image = selected && selected.image;
      var imageRatio = image && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 2 / 3;
      var ratioValue = computed.getPropertyValue("--image-aspect-ratio").trim();
      if (ratioValue !== "auto") {
        var ratioParts = ratioValue.split("/");
        var configuredRatio = Number(ratioParts[0]) / Number(ratioParts[1] || 1);
        if (Number.isFinite(configuredRatio) && configuredRatio > 0) imageRatio = configuredRatio;
      }
      var preferredImage = Math.max(1, panelHeight - paddingY * 2) * imageRatio + paddingX * 2;
      var border = parseFloat(computed.getPropertyValue("--divider-width")) || 0;
      var dividerBudget = border * (items.length + 1);
      var labelMinimum = Math.min(minimumRail, Math.max(24, (parseFloat(computed.getPropertyValue("--title-font-size")) || 30) * (parseFloat(computed.getPropertyValue("--title-line-height")) || 1.15)));
      var count = Math.max(1, items.length);
      var rail = Math.min(minimumRail, Math.max(labelMinimum, (available - dividerBudget - (active >= 0 ? preferredImage : 0)) / count));
      rail = Math.min(rail, Math.max(1, (available - dividerBudget) / count));
      var imageWidth = Math.min(preferredImage, Math.max(0, available - dividerBudget - rail * items.length));
      root.style.setProperty("--resolved-rail-size", rail + "px");
      root.style.setProperty("--resolved-image-width", imageWidth + "px");
    }
    measure();
    on(window, "resize", measure);
    if (window.ResizeObserver) {
      var observer = new ResizeObserver(measure);
      observer.observe(root);
      if (canvas && canvas !== root) observer.observe(canvas);
      if (section && bool(config.fullSection)) observer.observe(section);
      cleanups.push(function () { observer.disconnect(); });
    }
    var initial = Math.floor(Number(config.initialProject)) - 1;
    open(initial >= 0 && initial < items.length ? initial : -1);
    states.set(root, function () {
      cleanups.forEach(function (cleanup) { cleanup(); });
      if (dialog.open) dialog.close();
      list.remove();
      dialog.remove();
      root.appendChild(original);
      if (originalHeight) root.style.setProperty("height", originalHeight, originalHeightPriority);
      else root.style.removeProperty("height");
      if (originalTop) root.style.setProperty("top", originalTop, originalTopPriority);
      else root.style.removeProperty("top");
      if (bool(config.fullSection) && section) {
        if (originalWidth) root.style.setProperty("width", originalWidth, originalWidthPriority);
        else root.style.removeProperty("width");
        if (originalLeft) root.style.setProperty("left", originalLeft, originalLeftPriority);
        else root.style.removeProperty("left");
      }
      variables.forEach(function (saved) {
        if (saved.value) root.style.setProperty(saved.name, saved.value, saved.priority);
        else root.style.removeProperty(saved.name);
      });
      Object.keys(attributes).forEach(function (name) {
        if (attributes[name] === null) root.removeAttribute(name);
        else root.setAttribute(name, attributes[name]);
      });
    });
  }
  function initAll() {
    states.forEach(function (dispose) { dispose(); });
    states.clear();
    document.querySelectorAll(".gp-riku-accordion-list").forEach(init);
  }
  function destroy() {
    document.removeEventListener("DOMContentLoaded", initAll);
    document.removeEventListener("ghost:config", initAll);
    states.forEach(function (dispose) { dispose(); });
    states.clear();
  }
  window.GhostRikuAccordionList = { initAll: initAll, destroy: destroy };
  document.addEventListener("ghost:config", initAll);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll, { once: true });
  else initAll();
})();
