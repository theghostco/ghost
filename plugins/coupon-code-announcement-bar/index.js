(function () {
  "use strict";
  var DEFAULTS = {
    messageText: "A little treat for your next order.",
    couponCode: "WELCOME10",
    buttonText: "Copy WELCOME10",
    copiedText: "Copied!",
    copyErrorText: "Copy unavailable. Select the code:",
    closeLabel: "Close announcement",
    announcementLabel: "Coupon announcement",
    showClose: true,
    resetAfterClose: "visit",
    storageKey: "welcome-offer"
  };
  var SLUG = "coupon-code-announcement-bar";
  var SELECTOR = ".gp-coupon-announcement";
  var states = new Map();
  var memory = new Map();
  var autoRoot = null;
  var frame = 0;
  var headerState = null;
  var pageObserver = null;

  function str(value) { return value == null ? "" : String(value); }
  function bool(value) { return value === true || value === "true"; }
  function sources(root) {
    var global = window.GhostPluginConfig;
    if (global && global[SLUG] && typeof global[SLUG] === "object") global = global[SLUG];
    var perRoot = null;
    if (window.GhostPlugins && typeof window.GhostPlugins.configFor === "function") {
      try { perRoot = window.GhostPlugins.configFor(root, SLUG); } catch (ignore) {}
    }
    return [global, perRoot];
  }
  function config(root) {
    var settings = Object.assign({}, DEFAULTS);
    var list = sources(root);
    list.forEach(function (source) {
      if (!source || typeof source !== "object") return;
      Object.keys(DEFAULTS).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(source, key)) settings[key] = source[key];
      });
    });
    return { settings: settings, sources: list };
  }
  function store(mode) {
    try { return mode === "visit" ? window.sessionStorage : window.localStorage; }
    catch (ignore) { return null; }
  }
  function key(settings) { return SLUG + ":" + str(settings.storageKey) + ":" + settings.resetAfterClose; }
  function record(settings) {
    var id = key(settings);
    var storage = store(settings.resetAfterClose);
    try {
      var raw = storage && storage.getItem(id);
      if (raw) return JSON.parse(raw);
    } catch (ignore) {}
    return memory.get(id) || null;
  }
  function isDismissed(settings) {
    var saved = record(settings);
    return !!saved && (settings.resetAfterClose === "visit" || saved.until > Date.now());
  }
  function saveDismissal(settings) {
    var duration = settings.resetAfterClose === "week" ? 604800000 : 86400000;
    var saved = { until: Date.now() + duration };
    var id = key(settings);
    memory.set(id, saved);
    try { var storage = store(settings.resetAfterClose); if (storage) storage.setItem(id, JSON.stringify(saved)); }
    catch (ignore) {}
  }
  function svg(kind, className) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.setAttribute("viewBox", "0 0 24 24");
    element.setAttribute("fill", "none");
    element.setAttribute("stroke", "currentColor");
    element.setAttribute("stroke-linecap", "round");
    element.setAttribute("stroke-linejoin", "round");
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("focusable", "false");
    element.setAttribute("class", className);
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", kind === "close" ? "M6 6l12 12M18 6L6 18" : "M9 9h11v11H9zM15 9V4H4v11h5");
    element.appendChild(path);
    return element;
  }
  function restoreHeader() {
    if (!headerState) return;
    var old = headerState;
    if (old.node.style.getPropertyValue("top") === old.applied) {
      if (old.top) old.node.style.setProperty("top", old.top, old.priority);
      else old.node.style.removeProperty("top");
    }
    headerState = null;
  }
  function measureHeader() {
    restoreHeader();
    var header = document.querySelector("#header, header.header");
    if (!header) return;
    var style = getComputedStyle(header);
    if (style.position !== "fixed" && style.position !== "absolute") return;
    var bottom = 0;
    states.forEach(function (state, root) {
      if (!root.hidden && root.isConnected) bottom = Math.max(bottom, root.getBoundingClientRect().bottom);
    });
    var bounds = header.getBoundingClientRect();
    if (bottom <= 0 || bounds.bottom <= 0) return;
    var delta = Math.max(0, bottom - bounds.top);
    if (delta < 0.5) return;
    var top = style.top;
    if (top === "auto") return;
    headerState = { node: header, top: header.style.getPropertyValue("top"), priority: header.style.getPropertyPriority("top"), applied: "" };
    header.style.setProperty("top", "calc(" + top + " + " + delta + "px)", "important");
    headerState.applied = header.style.getPropertyValue("top");
  }
  function scheduleMeasure() {
    if (frame) return;
    frame = requestAnimationFrame(function () { frame = 0; measureHeader(); });
  }
  function destroy(root, state) {
    state.alive = false;
    clearTimeout(state.feedbackTimer);
    clearTimeout(state.resetTimer);
    state.listeners.forEach(function (entry) { entry[0].removeEventListener(entry[1], entry[2]); });
    if (state.observer) state.observer.disconnect();
    root.replaceChildren();
    state.styles.forEach(function (entry) {
      if (root.style.getPropertyValue(entry.target) !== entry.applied) return;
      if (entry.previous) root.style.setProperty(entry.target, entry.previous, entry.priority);
      else root.style.removeProperty(entry.target);
    });
    root.hidden = false;
    root.removeAttribute("data-close");
    root.removeAttribute("role");
    root.removeAttribute("aria-label");
    if (state.anchor && state.anchor.parentNode) {
      state.anchor.parentNode.insertBefore(root, state.anchor);
      state.anchor.remove();
    }
    states.delete(root);
  }
  function build(root) {
    var result = config(root);
    var settings = result.settings;
    if (["visit", "day", "week"].indexOf(settings.resetAfterClose) < 0) settings.resetAfterClose = "visit";
    var state = { alive: true, feedbackTimer: null, resetTimer: null, observer: null, listeners: [], anchor: null, busy: false, styles: [] };
    if (root !== autoRoot) {
      state.anchor = document.createComment("gp-coupon-announcement-position");
      root.parentNode.insertBefore(state.anchor, root);
    }
    states.set(root, state);
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", str(settings.announcementLabel));
    root.setAttribute("data-close", bool(settings.showClose) ? "true" : "false");
    var inner = document.createElement("div");
    inner.className = "gp-inner";
    var group = document.createElement("div");
    group.className = "gp-group";
    inner.appendChild(group);
    var contentExists = !!str(settings.messageText) || !!(str(settings.couponCode) && str(settings.buttonText));
    root.hidden = !contentExists || isDismissed(settings);

    function listen(node, event, handler) {
      node.addEventListener(event, handler);
      state.listeners.push([node, event, handler]);
    }
    function resetTimer() {
      clearTimeout(state.resetTimer);
      if (settings.resetAfterClose === "visit" || !isDismissed(settings)) return;
      var saved = record(settings);
      state.resetTimer = setTimeout(function () {
        if (!state.alive) return;
        root.hidden = !contentExists || isDismissed(settings);
        if (root.hidden && contentExists) resetTimer();
        scheduleMeasure();
      }, Math.max(1, saved.until - Date.now()));
    }
    resetTimer();
    if (str(settings.messageText)) {
      var message = document.createElement("p");
      message.className = "gp-message";
      message.textContent = str(settings.messageText);
      group.appendChild(message);
    }
    var code = str(settings.couponCode);
    var buttonText = str(settings.buttonText);
    if (code && buttonText) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "gp-button";
      var label = document.createElement("span");
      label.className = "gp-button-label";
      label.textContent = buttonText;
      button.appendChild(label);
      button.appendChild(svg("copy", "gp-copy-icon"));
      group.appendChild(button);
      var status = document.createElement("span");
      status.className = "gp-sr";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.setAttribute("aria-atomic", "true");
      inner.appendChild(status);
      function fallbackCopy() {
        if (!state.alive) return false;
        var field = document.createElement("textarea");
        field.className = "gp-copy-fallback";
        field.value = code;
        field.setAttribute("readonly", "");
        root.appendChild(field);
        field.focus({ preventScroll: true });
        field.select();
        field.setSelectionRange(0, code.length);
        var success = false;
        try { success = document.execCommand("copy"); } catch (ignore) {}
        field.remove();
        button.focus({ preventScroll: true });
        return success;
      }
      listen(button, "click", function () {
        if (state.busy) return;
        state.busy = true;
        var attempt;
        try {
          attempt = navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(code).then(function () { return true; }, fallbackCopy) : Promise.resolve(fallbackCopy());
        } catch (ignore) { attempt = Promise.resolve(fallbackCopy()); }
        attempt.then(function (success) {
          if (!state.alive) return;
          state.busy = false;
          clearTimeout(state.feedbackTimer);
          var feedback = success ? str(settings.copiedText) : str(settings.copyErrorText);
          label.textContent = success ? feedback || buttonText : (feedback ? feedback + " " : "") + code;
          status.textContent = success ? feedback : label.textContent;
          scheduleMeasure();
          if (!success) return;
          var duration = getComputedStyle(root).getPropertyValue("--feedback-duration").trim();
          var ms = parseFloat(duration);
          if (/s$/.test(duration) && !/ms$/.test(duration)) ms *= 1000;
          state.feedbackTimer = setTimeout(function () {
            if (!state.alive) return;
            label.textContent = buttonText;
            status.textContent = "";
            scheduleMeasure();
          }, Number.isFinite(ms) ? Math.max(0, ms) : 2000);
        });
      });
    }
    if (bool(settings.showClose)) {
      var close = document.createElement("button");
      close.type = "button";
      close.className = "gp-close";
      close.setAttribute("aria-label", str(settings.closeLabel));
      close.appendChild(svg("close", "gp-close-icon"));
      listen(close, "click", function () {
        saveDismissal(settings);
        root.hidden = true;
        resetTimer();
        measureHeader();
      });
      inner.appendChild(close);
    }
    root.appendChild(inner);
    if (typeof ResizeObserver === "function") {
      state.observer = new ResizeObserver(scheduleMeasure);
      state.observer.observe(root);
    }
  }
  function stopInstances() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (pageObserver) { pageObserver.disconnect(); pageObserver = null; }
    restoreHeader();
    states.forEach(function (state, root) { destroy(root, state); });
  }
  function initAll() {
    if (!document.body) return;
    stopInstances();
    var roots = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    if (autoRoot && roots.some(function (root) { return root !== autoRoot; })) {
      autoRoot.remove(); autoRoot = null;
      roots = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    }
    if (!roots.length) {
      autoRoot = document.createElement("div");
      autoRoot.className = "gp-coupon-announcement";
      autoRoot.setAttribute("data-gp-preset", "");
      document.body.appendChild(autoRoot);
      roots = [autoRoot];
    }
    roots.forEach(build);
    roots.slice().reverse().forEach(function (root) { document.body.insertBefore(root, document.body.firstChild); });
    measureHeader();
    if (typeof MutationObserver === "function") {
      pageObserver = new MutationObserver(function (entries) {
        if (entries.some(function (entry) {
          return !entry.target.closest || !entry.target.closest(SELECTOR);
        })) scheduleMeasure();
      });
      pageObserver.observe(document.body, { childList: true, subtree: true });
    }
  }
  function dispose() {
    document.removeEventListener("ghost:config", initAll);
    document.removeEventListener("DOMContentLoaded", initAll);
    window.removeEventListener("resize", scheduleMeasure);
    window.removeEventListener("scroll", scheduleMeasure);
    window.removeEventListener("pageshow", initAll);
    stopInstances();
    if (autoRoot) { autoRoot.remove(); autoRoot = null; }
  }
  if (window.GhostCouponAnnouncement && typeof window.GhostCouponAnnouncement.dispose === "function") window.GhostCouponAnnouncement.dispose();
  window.GhostCouponAnnouncement = { initAll: initAll, dispose: dispose };
  document.addEventListener("ghost:config", initAll);
  window.addEventListener("resize", scheduleMeasure, { passive: true });
  window.addEventListener("scroll", scheduleMeasure, { passive: true });
  window.addEventListener("pageshow", initAll);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll, { once: true });
  else initAll();
})();
