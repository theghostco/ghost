(function () {
  "use strict";
  var DEFAULTS = {
    contentBrandMode: "image",
    contentBrandText: "logo",
    contentLoadingText: "Loading...",
    imagesLogoSrc: "demo_light_image.webp",
    imagesLogoAltText: "Logo",
    imagesLogoWidthSize: "180px",
    imagesLogoHeightSize: "120px",
    imagesLogoFitStyle: "contain",
    typographyTextFontFamily: "Arial, sans-serif",
    typographyTextFontWeight: "500",
    typographyTextFontStyle: "normal",
    typographyTextFontSize: "48px",
    typographyTextLineHeight: "1.2",
    typographyTextLetterSpacing: "0px",
    typographyTextColor: "#111111",
    typographyTextAlignment: "center",
    backgroundColor: "#ffffff",
    backgroundImageSrc: "",
    backgroundImagePosition: "center",
    backgroundImageSize: "cover",
    layoutBrandBarGap: "28px",
    layoutTextWidthSize: "280px",
    layoutContentPaddingSize: "24px",
    layoutFullScreen: true,
    layoutPlacement: "center",
    layoutHorizontalPosition: "50%",
    layoutVerticalPosition: "50%",
    layoutBoundedHeightSize: "420px",
    advancedEnabled: true,
    advancedShowOnEveryPageLoad: true,
    advancedShowOnlyOncePerVisit: false,
    advancedPreviewReplay: false,
    advancedLoadingDuration: 2400,
    advancedLoadingInAnimation: "fade",
    advancedLoadingOutAnimation: "fade",
    advancedLoadingInAnimationDuration: 350,
    advancedLoadingOutAnimationDuration: 500,
    advancedLoadingAnimationEasing: "ease",
    advancedLoadingSlideDistanceSize: "36px",
    advancedLoadingFallDistanceSize: "100%",
    advancedLoadingBarStyle: "sweep",
    advancedLoadingBarStaticStyle: "solid",
    advancedLoadingBarColor: "#111111",
    advancedLoadingBarBackgroundColor: "#e8e8e8",
    advancedLoadingBarWidthSize: "180px",
    advancedLoadingBarHeightSize: "4px",
    advancedLoadingBarRadius: "999px",
    advancedLoadingBarSegmentSize: "40%",
    advancedLoadingBarAnimationDuration: 1000,
    advancedOverlayLayerIndex: 2147483000
  };
  var states = new Map(), visitedMemory = false;
  // Pre-paint veil: the workspace connection covers the page with the loading
  // screen backdrop before content renders. This runtime remembers the veil
  // (and its backdrop color) and releases it the moment the loader is shown
  // or skipped, so content never flashes behind the animation.
  function releaseVeil() { try { document.documentElement.classList.remove("gh-veil"); var t = document.getElementById("gh-veil-style"); if (t) t.remove(); } catch (e) {} }
  function rememberVeil(color) { try { localStorage.setItem("ghost-plugins:veil", JSON.stringify({ color: String(color || "#ffffff") })); } catch (e) {} }
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var sessionKey = "ghost-plugins:logo-loader:shown";
  if (window.GhostLogoLoader && window.GhostLogoLoader.destroyAll) window.GhostLogoLoader.destroyAll();
  function bool(v) { return v === true || v === "true" || v === 1; }
  function number(v, fallback, max) { v = Number(v); return Number.isFinite(v) ? Math.max(0, Math.min(max, v)) : fallback; }
  function object(v) { return v && typeof v === "object" ? v : {}; }
  function choice(v, values, fallback) { return values.indexOf(v) >= 0 ? v : fallback; }
  function source(v) {
    if (typeof v !== "string" || !v.trim()) return ""; if (/^\/?demo_(light|dark)_image\.webp$/.test(v.trim())) return "https://ghostplugins.lovable.app/" + v.trim().replace(/^\//, "");
    try { var u = new URL(v, document.baseURI); if (/^https?:$/.test(u.protocol) || u.protocol === "blob:" || /^data:image\/(png|jpeg|gif|webp|avif);base64,/i.test(v)) return v; } catch (e) {}
    return "";
  }
  function visited() { try { return visitedMemory || sessionStorage.getItem(sessionKey) === "1"; } catch (e) { return visitedMemory; } }
  function settings(root) {
    var g = object(window.GhostPluginConfig), local = {};
    try { if (window.GhostPlugins && typeof window.GhostPlugins.configFor === "function") local = object(window.GhostPlugins.configFor(root, "logo-loading-screen-bar") || window.GhostPlugins.configFor(root, "logo-loader")); } catch (e) {}
    return Object.assign({}, DEFAULTS, g, object(g["logo-loader"]), local);
  }
  function initialize(root, c, alreadyVisited) {
    var s = { timers: [], animations: [], cleanups: [], html: root.innerHTML, style: root.getAttribute("style"), hidden: root.hidden, attributes: {} };
    ["data-full-screen", "data-static-style", "data-phase", "aria-busy"].forEach(function (name) { s.attributes[name] = root.getAttribute(name); });
    states.set(root, s); root.hidden = true;
    if (!bool(c.advancedEnabled) || ((bool(c.advancedShowOnlyOncePerVisit) || !bool(c.advancedShowOnEveryPageLoad)) && alreadyVisited && !bool(c.advancedPreviewReplay))) { releaseVeil(); return; }
    var content = root.querySelector(".gp-logo-loader__content"), image = root.querySelector(".gp-logo-loader__image"), text = root.querySelector(".gp-logo-loader__text"), line = root.querySelector(".gp-logo-loader__line"), status = root.querySelector(".gp-logo-loader__status");
    function imageError() { image.hidden = true; }
    image.addEventListener("error", imageError); s.cleanups.push(function () { image.removeEventListener("error", imageError); });
    var style = "sweep";
    function applyVisuals(c) {
      var mapping = {
        "background-color": "backgroundColor", "background-image-position": "backgroundImagePosition", "background-image-size": "backgroundImageSize",
        "logo-width-size": "imagesLogoWidthSize", "logo-height-size": "imagesLogoHeightSize", "logo-fit-style": "imagesLogoFitStyle",
        "text-font-family": "typographyTextFontFamily", "text-font-weight": "typographyTextFontWeight", "text-font-style": "typographyTextFontStyle", "text-font-size": "typographyTextFontSize", "text-line-height": "typographyTextLineHeight", "text-letter-spacing": "typographyTextLetterSpacing", "text-color": "typographyTextColor", "text-alignment": "typographyTextAlignment",
        "text-width-size": "layoutTextWidthSize", "brand-bar-gap": "layoutBrandBarGap", "content-padding-size": "layoutContentPaddingSize", "bounded-height-size": "layoutBoundedHeightSize",
        "loading-bar-color": "advancedLoadingBarColor", "loading-bar-background-color": "advancedLoadingBarBackgroundColor", "loading-bar-width-size": "advancedLoadingBarWidthSize", "loading-bar-height-size": "advancedLoadingBarHeightSize", "loading-bar-radius": "advancedLoadingBarRadius", "loading-bar-segment-size": "advancedLoadingBarSegmentSize", "loading-slide-distance-size": "advancedLoadingSlideDistanceSize", "loading-fall-distance-size": "advancedLoadingFallDistanceSize"
      };
      Object.keys(mapping).forEach(function (key) { root.style.setProperty("--" + key, String(c[mapping[key]])); });
      root.style.setProperty("--overlay-layer-index", String(Math.round(number(c.advancedOverlayLayerIndex, 2147483000, 2147483647))));
      var bg = source(c.backgroundImageSrc);
      root.style.setProperty("--background-image", bg ? "url(" + JSON.stringify(bg) + ")" : "none");
      var placement = c.layoutPlacement;
      root.style.setProperty("--content-horizontal-position", placement === "custom" ? String(c.layoutHorizontalPosition) : placement === "left" ? "25%" : placement === "right" ? "75%" : "50%");
      root.style.setProperty("--content-vertical-position", placement === "custom" ? String(c.layoutVerticalPosition) : placement === "top" ? "20%" : placement === "bottom" ? "80%" : "50%");
      root.setAttribute("data-full-screen", String(bool(c.layoutFullScreen)));
      var textMode = c.contentBrandMode === "text", src = source(c.imagesLogoSrc);
      image.hidden = textMode || !src; text.hidden = !textMode;
      text.textContent = String(c.contentBrandText == null ? "" : c.contentBrandText);
      image.alt = String(c.imagesLogoAltText || "");
      if (src) image.src = src;
      status.textContent = String(c.contentLoadingText || "");
      style = choice(c.advancedLoadingBarStyle, ["sweep", "progress", "pulse", "static"], "sweep");
      root.setAttribute("data-static-style", style === "static" ? choice(c.advancedLoadingBarStaticStyle, ["solid", "outline", "segment"], "solid") : "solid");
    }
    applyVisuals(c);
    if (bool(c.layoutFullScreen) && document.body && root.parentNode !== document.body) {
      var anchor = document.createComment("Ghost logo loader location"); root.parentNode.insertBefore(anchor, root); document.body.appendChild(root);
      s.cleanups.push(function () { if (anchor.parentNode) { anchor.parentNode.insertBefore(root, anchor); anchor.remove(); } else root.remove(); });
    }
    function later(fn, ms) { s.timers.push(setTimeout(fn, ms)); }
    function animate(el, frames, options) { if (typeof el.animate !== "function") return; try { s.animations.push(el.animate(frames, options)); } catch (e) {} }
    function frames(type, entering) {
      var visible = { opacity: 1, transform: "translateY(0)" };
      var offset = type === "fall" ? "var(--loading-fall-distance-size)" : type === "slide" ? "var(--loading-slide-distance-size)" : "0px";
      var away = { opacity: 0, transform: "translateY(" + (entering && type === "fall" || !entering && type === "slide" ? "calc(-1 * " + offset + ")" : offset) + ")" };
      return entering ? [away, visible] : [visible, away];
    }
    var duration = number(c.advancedLoadingDuration, 2400, 60000), out = number(c.advancedLoadingOutAnimationDuration, 500, 5000);
    var enterType = choice(c.advancedLoadingInAnimation, ["none", "fade", "slide", "fall"], "fade"), exitType = choice(c.advancedLoadingOutAnimation, ["none", "fade", "slide", "fall"], "fade");
    var easing = String(c.advancedLoadingAnimationEasing);
    var enterOptions = { duration: Math.min(duration, number(c.advancedLoadingInAnimationDuration, 350, 5000)), easing: easing };
    var finished = false;
    function finish() { if (finished) return; finished = true; root.hidden = true; root.removeAttribute("aria-busy"); status.textContent = ""; s.animations.forEach(function (a) { a.cancel(); }); }
    function motionChanged() { if (!motion.matches) return; s.animations.forEach(function (a) { a.cancel(); }); line.style.width = "100%"; if (root.getAttribute("data-phase") === "exit") finish(); }
    if (motion.addEventListener) { motion.addEventListener("change", motionChanged); s.cleanups.push(function () { motion.removeEventListener("change", motionChanged); }); }
    else if (motion.addListener) { motion.addListener(motionChanged); s.cleanups.push(function () { motion.removeListener(motionChanged); }); }
    root.hidden = false; root.setAttribute("aria-busy", "true"); root.setAttribute("data-phase", "enter");
    // The backdrop paints instantly (it covers the site). The logo and bar stay
    // invisible until the real settings and the logo image are ready, then
    // enter together, so the default demo content never flashes first.
    var revealed = false, configReady = !window.GhostWorkspace || Object.keys(object(window.GhostPluginConfig)).length > 0 || !!(window.GhostPlugins && window.GhostPlugins.config && Object.keys(object(window.GhostPlugins.config)).length);
    content.style.opacity = "0";
    function reveal() {
      if (revealed || finished) return; revealed = true; content.style.opacity = "";
      if (!motion.matches && enterType !== "none") animate(content, frames(enterType, true), enterOptions);
    }
    function tryReveal() {
      if (revealed || !configReady) return;
      if (image.hidden || !image.getAttribute("src") || (image.complete && image.naturalWidth)) return reveal();
      image.addEventListener("load", reveal, { once: true }); image.addEventListener("error", reveal, { once: true });
    }
    later(function () { configReady = true; reveal(); }, 1500);
    s.update = function (next) { c = next; applyVisuals(next); exitType = choice(next.advancedLoadingOutAnimation, ["none", "fade", "slide", "fall"], exitType); out = number(next.advancedLoadingOutAnimationDuration, out, 5000); configReady = true; tryReveal(); };
    s.isActive = function () { return !finished; };
    rememberVeil(c.backgroundColor); releaseVeil();
    visitedMemory = true; try { sessionStorage.setItem(sessionKey, "1"); } catch (e) {}
    if (!motion.matches) {
      var barDuration = Math.max(16, number(c.advancedLoadingBarAnimationDuration, 1000, 60000));
      if (style === "sweep") { line.style.width = "var(--loading-bar-segment-size)"; animate(line, [{ left: "0%", transform: "translateX(-100%)" }, { left: "100%", transform: "translateX(0)" }], { duration: barDuration, iterations: Infinity }); }
      if (style === "progress") animate(line, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: duration, fill: "forwards" });
      if (style === "pulse") animate(line, [{ opacity: 0.3 }, { opacity: 1 }, { opacity: 0.3 }], { duration: barDuration, iterations: Infinity });
    }
    tryReveal();
    later(function () {
      root.setAttribute("data-phase", "exit");
      if (motion.matches || exitType === "none" || !out) finish();
      else { animate(root, frames(exitType, false), { duration: out, easing: easing, fill: "forwards" }); later(finish, out); }
    }, duration);
  }
  function destroyAll() {
    document.removeEventListener("DOMContentLoaded", initAll); document.removeEventListener("mercury:load", initAll);
    states.forEach(function (s, root) {
      s.timers.forEach(clearTimeout); s.animations.forEach(function (a) { a.cancel(); }); s.cleanups.reverse().forEach(function (fn) { fn(); });
      root.innerHTML = s.html; root.hidden = s.hidden;
      if (s.style === null) root.removeAttribute("style"); else root.setAttribute("style", s.style);
      Object.keys(s.attributes).forEach(function (name) { if (s.attributes[name] === null) root.removeAttribute(name); else root.setAttribute(name, s.attributes[name]); });
    }); states.clear();
  }
  var SITE_MARKUP = "<div class=\"gp-logo-loader\" data-gp-preset=\"logo-loader\" hidden>\n  <div class=\"gp-logo-loader__content\">\n    <img class=\"gp-logo-loader__image\" src=\"demo_light_image.webp\" alt=\"\">\n    <div class=\"gp-logo-loader__text\" hidden></div>\n    <div class=\"gp-logo-loader__bar\" aria-hidden=\"true\"><span class=\"gp-logo-loader__line\"></span></div>\n    <span class=\"gp-logo-loader__status\" role=\"status\" aria-live=\"polite\"></span>\n  </div>\n</div>";
  // Site-wide installs (header injection) have no Code Block markup, so add it once.
  function ensureMarkup() { if (document.querySelector(".gp-logo-loader")) return; var host = document.body || document.documentElement; if (!host) return; var t = document.createElement("template"); t.innerHTML = SITE_MARKUP; var el = t.content.firstElementChild; if (el) { el.setAttribute("data-ghost-site-wide", ""); host.appendChild(el); } }
  function initAll() { destroyAll(); ensureMarkup(); var alreadyVisited = visited(); document.querySelectorAll(".gp-logo-loader").forEach(function (root) { initialize(root, settings(root), alreadyVisited); }); document.addEventListener("mercury:load", initAll); }
  window.GhostLogoLoader = { initAll: initAll, destroyAll: destroyAll }; document.addEventListener("ghost:config", function () { var live = false; states.forEach(function (st, r) { if (st.update && st.isActive && st.isActive()) { live = true; st.update(settings(r)); } }); if (live) return; visitedMemory = false; try { sessionStorage.removeItem(sessionKey); } catch (e) {} initAll(); });
  initAll();
})();

