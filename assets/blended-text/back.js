
const CONFIG = {
  steps: 8, // number of shadow layers
  distance: 140, // max layer offset distance
  minDistance: 1, // min layer offset distance
  faceColor: '#ffffff', // top text color
  color1: '#fff', // end gradient color
  color2: '#fff', // start gradient color
  strokePx: 0.8, // max stroke width
  smooth: 0.05, // mouse follow smoothing
  expandSmooth: 0.04, // expand smoothing
  selector: '#blended-text h1 a' // target text selector
};

(function (CONFIG) {
  const hex2rgb = (h) => {
    let c = h.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    return {
      r: parseInt(c.slice(0, 2), 16),
      g: parseInt(c.slice(2, 4), 16),
      b: parseInt(c.slice(4, 6), 16)
    };
  };

  const lerp = (a, b, t) => a + (b - a) * t;

  const lerpRgb = (c1, c2, t) =>
    'rgb(' +
    Math.round(lerp(c1.r, c2.r, t)) + ',' +
    Math.round(lerp(c1.g, c2.g, t)) + ',' +
    Math.round(lerp(c1.b, c2.b, t)) + ')';

  function init() {
    const anchors = document.querySelectorAll(CONFIG.selector);
    if (!anchors.length) return;

    anchors.forEach((anchor) => {
      if (anchor.dataset.blendBuilt === 'true') return;
      anchor.dataset.blendBuilt = 'true';

      const text = anchor.textContent.trim();
      if (!text) return;

      const section =
        anchor.closest('section') ||
        anchor.closest('.page-section') ||
        anchor.parentElement;

      if (!section) return;

      const cs = window.getComputedStyle(anchor);

      const textStyle = [
        'font-size:' + cs.fontSize,
        'font-family:' + cs.fontFamily,
        'font-weight:100',
        'line-height:' + cs.lineHeight,
        'letter-spacing:' + cs.letterSpacing,
        'display:inline-block',
        'white-space:nowrap'
      ].join(';');

      const c1 = hex2rgb(CONFIG.color1);
      const c2 = hex2rgb(CONFIG.color2);

      const wrapper = document.createElement('span');
      wrapper.className = 'blend-text-wrapper';
      wrapper.style.setProperty('--blend-stroke', CONFIG.strokePx + 'px');
      wrapper.setAttribute('aria-label', text);

      const layers = [];

      for (let i = 0; i < CONFIG.steps; i++) {
        const progress = CONFIG.steps === 1 ? 1 : i / (CONFIG.steps - 1);
        const curved = 1 - progress;
        const color = lerpRgb(c2, c1, progress);

        const span = document.createElement('span');
        span.className = 'blend-text-layer';
        span.setAttribute('aria-hidden', 'true');
        span.style.cssText = textStyle + ';color:' + color + ';opacity:0;';
        span.textContent = text;
        span.dataset.curved = curved; // layer depth factor

        wrapper.appendChild(span);
        layers.push(span);
      }

      const top = document.createElement('span');
      top.className = 'blend-text-top';
      top.style.cssText = textStyle + ';color:' + CONFIG.faceColor + ';';
      top.textContent = text;

      wrapper.appendChild(top);

      anchor.textContent = '';
      anchor.appendChild(wrapper);

      let rect = null;

      const targetMouse = { x: 0, y: 0 }; // target cursor position
      const currentMouse = { x: 0, y: 0 }; // smoothed cursor position

      let targetExpand = 0; // target expansion amount
      let currentExpand = 0; // smoothed expansion amount

      let rafId = null;
      let insideSection = false; // pointer state

      function getRect() {
        rect = wrapper.getBoundingClientRect();
      }

      function startTick() {
        if (!rafId) rafId = requestAnimationFrame(tick);
      }

      function isOverWord(clientX, clientY) {
        const r = wrapper.getBoundingClientRect();
        return (
          clientX >= r.left &&
          clientX <= r.right &&
          clientY >= r.top &&
          clientY <= r.bottom
        );
      }

      function applyLayers(cx, cy, expand) {
        const angle = Math.atan2(cy, cx);
        const dist =
          CONFIG.minDistance +
          (CONFIG.distance - CONFIG.minDistance) * expand;

        layers.forEach((layer, index) => {
          const cv = parseFloat(layer.dataset.curved);

          const x = Math.cos(angle) * dist * cv;
          const y = Math.sin(angle) * dist * cv;

          const depth = index / (layers.length - 1 || 1);
          const stroke = CONFIG.strokePx * (0.1 + depth * 0.9);

          layer.style.webkitTextStrokeWidth = stroke + 'px'; // stroke by depth
          layer.style.transform =
            'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
          layer.style.opacity =
            expand <= 0.001 ? '0' : String(0.15 + expand * 0.85); // fade layers
        });
      }

      function tick() {
        currentMouse.x += (targetMouse.x - currentMouse.x) * CONFIG.smooth;
        currentMouse.y += (targetMouse.y - currentMouse.y) * CONFIG.smooth;

        currentExpand +=
          (targetExpand - currentExpand) * CONFIG.expandSmooth;

        applyLayers(currentMouse.x, currentMouse.y, currentExpand);

        const movingMouse =
          Math.abs(targetMouse.x - currentMouse.x) > 0.05 ||
          Math.abs(targetMouse.y - currentMouse.y) > 0.05;

        const movingExpand =
          Math.abs(targetExpand - currentExpand) > 0.001;

        if (movingMouse || movingExpand || insideSection) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
        }
      }

      function onMove(clientX, clientY) {
        getRect();
        if (!rect) return;

        if (isOverWord(clientX, clientY)) {
          targetExpand = 0; // collapse on hover
          startTick();
          return;
        }

        targetExpand = 1; // expand outside text

        const cx = clientX - (rect.left + rect.width / 2);
        const cy = clientY - (rect.top + rect.height / 2);

        targetMouse.x = cx;
        targetMouse.y = cy;

        startTick();
      }

      section.addEventListener('pointerenter', () => {
        insideSection = true;
        targetExpand = 1;
        getRect();
        startTick();
      });

      section.addEventListener('pointerleave', () => {
        insideSection = false;
        targetExpand = 0;
        startTick();
      });

      section.addEventListener(
        'pointermove',
        (e) => {
          onMove(e.clientX, e.clientY);
        },
        { passive: true }
      );

      section.addEventListener(
        'touchmove',
        (e) => {
          if (e.touches.length) {
            onMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );

      window.addEventListener(
        'resize',
        () => {
          getRect(); // refresh bounds
        },
        { passive: true }
      );

      getRect();
      applyLayers(0, 0, 0); // initial state
    });
  }

  function waitForElement() {
    const el = document.querySelector(CONFIG.selector);

    if (el) {
      init();
    } else {
      requestAnimationFrame(waitForElement); // wait until target exists
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForElement);
  } else {
    waitForElement();
  }
})(CONFIG);
