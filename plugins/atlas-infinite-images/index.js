/*!
 * Infinite Image Wall, Ghost Plugins  v1.0.2
 * Standalone browser plugin. Vanilla ES6+, no dependencies.
 * Drag, swipe, momentum, autoplay and endless tile recycling inside a bounded
 * Code Block (default) or, opt-in, the whole enclosing page section.
 * Settings: Ghost Plugins saved preset (data-ghost-key), window.AtlasInfiniteImagesConfig,
 * or data-gp-* attributes on the root.
 */
(function () {
  'use strict';
  const SLUG = 'atlas-infinite-images';
  const KEY = Symbol.for('ghost-plugins.atlas-infinite-images.v1');
  if (window[KEY]) { window[KEY].init(); return; }
  const selector = '.gp-infinite-images[data-gp-plugin="atlas-infinite-images"], .gp-infinite-images[data-gp-plugin="infinite-images"]';
  const instances = new Map();
  const COMPACT_WIDTH = 600;
  const MAX_ITEMS = 20;
  const DEMO_IMAGES = [
    'https://www.ghostplugins.com/__l5e/assets-v1/c5dd9fff-8419-4039-bd53-d1e302c530dd/demo_dark_image.webp',
    'https://www.ghostplugins.com/__l5e/assets-v1/aa3b89ca-f48e-480f-bf52-94cf97bff6e6/demo_light_image.webp'
  ];
  const DEMO_CAPTIONS = [
    ['Alpine stillness', 'Rocky peaks rise into the clouds, catching the first light of a new day.'],
    ['Along the coast', 'Waves trace the shoreline in layers of blue, white, and warm sand.'],
    ['Into the green', 'Sunlight filters through a forest canopy, inviting a slower pace.'],
    ['Quiet confidence', 'A portrait study in warm light and stillness.'],
    ['City rhythm', 'Texture and movement from a day in the city.'],
    ['After dark', 'A sky full of possibility after the sun has set.'],
    ['Clean lines', 'A study in rhythm, proportion, and architectural light.'],
    ['Blue horizon', 'A wide blue horizon and the steady rhythm of the sea.']
  ];

  /* Every Plugin Studio key with its default. Purely visual keys become CSS
     variables on the root; behavior keys become data-gp-* attributes that the
     engine below already reads. */
  const DEFAULTS = {
    sizeMode: 'block', height: 600, mobileHeight: 420, width: 100, mobileWidth: 100,
    spacing: 100, separateSpacing: false, horizontalSpacing: 90, verticalSpacing: 90, mobileSpacing: 52, rotation: 0,
    background: '#f5f5f5', padding: 0, mobilePadding: 0, radius: 0,
    aspectMode: 'uniform', aspectRatio: '3 / 4', ratioSeed: 7, imageWidth: 200, mobileImageWidth: 140,
    imageShape: 'rounded', imageRadius: 8, borderWidth: 0, borderStyle: 'solid', borderColor: '#ffffff', imageFit: 'cover', imagePosition: 'center',
    captionMode: 'hidden', showDescription: false, captionPosition: 'bottom', captionFont: 'inherit',
    captionSize: 14, captionColor: '#ffffff', captionAlign: 'left', captionBackground: 'rgba(0, 0, 0, 0.6)',
    captionGradient: true, captionPadding: 14, descriptionSize: 12, descriptionColor: 'rgba(255, 255, 255, 0.8)',
    hoverStyle: 'none', hoverScale: 1.04, hoverLift: 8, hoverBrightness: 75, hoverGrayscale: 100, hoverShadow: true,
    hoverDuration: 220, hoverEasing: 'ease',
    inertia: true, momentumStrength: 1.35, friction: 0.975, mouseFollow: false, followSpeed: 140, wheel: true, dragThreshold: 7,
    autoplay: true, autoplayDirection: 'random', autoplaySpeed: 18, directionInterval: 4000, autoplayX: 18, autoplayY: 0, pauseOnHover: true
  };
  const ATTRS = {
    sizeMode: 'size-mode', aspectMode: 'aspect-mode', ratioSeed: 'ratio-seed', imageShape: 'image-shape',
    captionMode: 'caption-mode', showDescription: 'caption-description', captionPosition: 'caption-position',
    inertia: 'inertia', momentumStrength: 'momentum-strength', friction: 'friction', mouseFollow: 'mouse-follow',
    followSpeed: 'follow-speed', wheel: 'wheel', dragThreshold: 'drag-threshold', autoplay: 'autoplay',
    autoplayDirection: 'autoplay-direction', autoplaySpeed: 'autoplay-speed', directionInterval: 'direction-interval',
    autoplayX: 'autoplay-x', autoplayY: 'autoplay-y', pauseOnHover: 'pause-hover', hoverStyle: 'hover-style'
  };
  const FONTS = {
    inherit: 'inherit', 'sans-serif': 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, "Times New Roman", serif', mono: 'ui-monospace, SFMono-Regular, Menlo, monospace'
  };

  const mod = (n, d) => ((n % d) + d) % d;
  const safeURL = (value) => {
    try {
      if (!value || !String(value).trim()) return '';
      const url = new URL(value, document.baseURI);
      return /^https?:$/.test(url.protocol) ? url.href : '';
    } catch (_) { return ''; }
  };
  const isTrue = (v) => v === true || v === 'true' || v === 1 || v === '1';
  const num = (v, fallback) => { const n = Number(v); return Number.isFinite(n) ? n : fallback; };
  const px = (v, fallback) => num(v, fallback) + 'px';

  function liveConfig(root) {
    try {
      const G = window.GhostPlugins;
      const live = G && (G.configFor ? G.configFor(root, SLUG) : (G.config && G.config[SLUG]));
      return live && typeof live === 'object' ? live : null;
    } catch (_) { return null; }
  }
  function globalConfig() {
    const g = window.AtlasInfiniteImagesConfig;
    return g && typeof g === 'object' ? g : null;
  }

  /** Build the viewport, plane and source list when the Code Block only holds the root. */
  function scaffold(root) {
    let viewport = root.querySelector('.gp-ii-viewport');
    if (!viewport) {
      viewport = document.createElement('div');
      viewport.className = 'gp-ii-viewport';
      root.appendChild(viewport);
    }
    if (!viewport.hasAttribute('tabindex')) viewport.tabIndex = 0;
    if (!viewport.hasAttribute('role')) viewport.setAttribute('role', 'region');
    if (!viewport.hasAttribute('aria-label')) viewport.setAttribute('aria-label', 'Image wall. Drag or use arrow keys to explore. Press Enter to open the center image link, when provided.');
    if (!viewport.querySelector('.gp-ii-plane')) {
      const plane = document.createElement('div');
      plane.className = 'gp-ii-plane'; plane.setAttribute('aria-hidden', 'true');
      viewport.insertBefore(plane, viewport.firstChild);
    }
    let sources = viewport.querySelector('.gp-ii-sources');
    if (!sources) {
      sources = document.createElement('ul'); sources.className = 'gp-ii-sources';
      viewport.appendChild(sources);
    }
    if (root.__atlasOwnItems === undefined) root.__atlasOwnItems = sources.children.length > 0;
    return sources;
  }

  function demoItems(images) {
    const list = images && images.length ? images : DEMO_IMAGES;
    return DEMO_CAPTIONS.concat(DEMO_CAPTIONS).slice(0, 12).map((c, i) => ({
      src: list[i % list.length], alt: 'Demo image ' + (i + 1), title: c[0], description: c[1], href: '', newTab: false
    }));
  }

  function configItems(cfg) {
    const items = [];
    for (let i = 1; i <= MAX_ITEMS; i++) {
      const src = cfg['item' + i + '_image'];
      if (typeof src !== 'string' || !src.trim()) continue;
      items.push({
        src: src.trim(), alt: String(cfg['item' + i + '_alt'] || ''),
        title: String(cfg['item' + i + '_title'] || ''), description: String(cfg['item' + i + '_description'] || ''),
        href: String(cfg['item' + i + '_link'] || ''), newTab: isTrue(cfg['item' + i + '_link_new_tab'])
      });
    }
    return items;
  }

  function writeItems(sources, items) {
    const sig = JSON.stringify(items);
    if (sources.__atlasSig === sig) return;
    sources.__atlasSig = sig;
    const frag = document.createDocumentFragment();
    items.forEach((item) => {
      const li = document.createElement('li');
      const href = safeURL(item.href);
      const wrap = document.createElement(href ? 'a' : 'span');
      if (href) {
        wrap.href = href;
        if (item.newTab) { wrap.target = '_blank'; wrap.rel = 'noopener noreferrer'; }
      } else wrap.setAttribute('data-gp-item', '');
      if (item.title) wrap.setAttribute('data-gp-title', item.title);
      if (item.description) wrap.setAttribute('data-gp-description', item.description);
      const img = document.createElement('img');
      img.src = item.src; img.alt = item.alt || item.title || ''; img.loading = 'lazy'; img.decoding = 'async';
      const label = document.createElement('span'); label.textContent = item.title || item.alt || '';
      wrap.appendChild(img); wrap.appendChild(label); li.appendChild(wrap); frag.appendChild(li);
    });
    sources.replaceChildren(frag);
  }

  /** Apply one merged settings object (defaults + saved values) to a root. */
  function applyConfig(root, cfg, opts) {
    opts = opts || {};
    const sources = scaffold(root);
    const raw = cfg || {};
    const v = (k) => (raw[k] !== undefined && raw[k] !== null && raw[k] !== '') ? raw[k] : DEFAULTS[k];
    if (opts.preview) root.dataset.gpPreview = 'true';

    const vars = {
      '--gp-height': px(v('height'), 600), '--gp-mobile-height': px(v('mobileHeight'), 420),
      '--gp-width': num(v('width'), 100) + '%', '--gp-mobile-width': num(v('mobileWidth'), 100) + '%',
      '--gp-wall-rotation': num(v('rotation'), 0) + 'deg', '--gp-bg': String(v('background')),
      '--gp-padding': px(v('padding'), 0), '--gp-mobile-padding': px(v('mobilePadding'), 0),
      '--gp-container-radius': px(v('radius'), 0), '--gp-image-aspect': String(v('aspectRatio')),
      '--gp-image-width': px(v('imageWidth'), 200), '--gp-mobile-image-width': px(v('mobileImageWidth'), 140),
      '--gp-image-radius': px(v('imageRadius'), 8), '--gp-image-border-width': px(v('borderWidth'), 0),
      '--gp-image-border-color': String(v('borderColor')), '--gp-image-border-style': String(v('borderStyle')), '--gp-image-fit': String(v('imageFit')),
      '--gp-image-position': String(v('imagePosition')),
      '--gp-font-family': FONTS[v('captionFont')] || String(v('captionFont')),
      '--gp-caption-size': px(v('captionSize'), 14), '--gp-caption-color': String(v('captionColor')),
      '--gp-caption-align': String(v('captionAlign')), '--gp-caption-padding': px(v('captionPadding'), 14),
      '--gp-caption-description-size': px(v('descriptionSize'), 12),
      '--gp-caption-description-color': String(v('descriptionColor')),
      '--gp-transition-duration': num(v('hoverDuration'), 220) + 'ms', '--gp-transition-timing': String(v('hoverEasing'))
    };
    const optionalText = {
      captionWeight: '--gp-caption-weight', captionStyle: '--gp-caption-style',
      captionLineHeight: '--gp-caption-line-height', captionLetterSpacing: '--gp-caption-letter-spacing',
      captionDecoration: '--gp-caption-decoration', captionTransform: '--gp-caption-transform',
      descriptionFont: '--gp-description-font', descriptionWeight: '--gp-description-weight',
      descriptionStyle: '--gp-description-style', descriptionLineHeight: '--gp-description-line-height',
      descriptionLetterSpacing: '--gp-description-letter-spacing', descriptionAlign: '--gp-description-align',
      descriptionDecoration: '--gp-description-decoration', descriptionTransform: '--gp-description-transform'
    };
    Object.keys(optionalText).forEach((key) => {
      const value = raw[key];
      if (value === undefined || value === null || value === '') return;
      vars[optionalText[key]] = key === 'descriptionFont' ? (FONTS[value] || String(value))
        : /LineHeight/.test(key) ? String(value)
        : /LetterSpacing/.test(key) ? px(value, 0)
        : String(value);
    });
    if (raw.captionWeight !== undefined) vars['--gp-caption-weight'] = String(raw.captionWeight);
    const capBg = String(v('captionBackground'));
    vars['--gp-caption-background'] = isTrue(v('captionGradient')) ? 'linear-gradient(transparent, ' + capBg + ')' : capBg;
    const h = num(v('spacing'), 90);
    const separate = isTrue(v('separateSpacing'));
    vars['--gp-gap'] = px(separate ? v('horizontalSpacing') : h, h);
    vars['--gp-row-gap'] = px(separate ? v('verticalSpacing') : h, h);
    const mobile = num(v('mobileSpacing'), 52);
    vars['--gp-mobile-gap'] = mobile + 'px';
    vars['--gp-mobile-row-gap'] = (separate && num(v('horizontalSpacing'), h) > 0
      ? Math.round(mobile * num(v('verticalSpacing'), h) / num(v('horizontalSpacing'), h)) : mobile) + 'px';

    // Hover presets only use their own value; Custom combines all of them.
    const style = String(v('hoverStyle'));
    const custom = style === 'custom';
    vars['--gp-hover-scale'] = String(style === 'zoom' || custom ? num(v('hoverScale'), 1.04) : 1);
    vars['--gp-hover-lift'] = (style === 'lift' || custom ? -Math.abs(num(v('hoverLift'), 8)) : 0) + 'px';
    vars['--gp-hover-brightness'] = String(style === 'dim' || custom ? num(v('hoverBrightness'), 75) / 100 : 1);
    vars['--gp-hover-grayscale'] = String(style === 'grayscale' || custom ? num(v('hoverGrayscale'), 100) / 100 : 0);
    vars['--gp-hover-shadow'] = style !== 'none' && isTrue(v('hoverShadow')) ? '0 14px 35px #00000026' : 'none';

    Object.keys(ATTRS).forEach((k) => {
      const val = v(k);
      const out = typeof DEFAULTS[k] === 'boolean' ? String(isTrue(val)) : String(val);
      if (root.getAttribute('data-gp-' + ATTRS[k]) !== out) root.setAttribute('data-gp-' + ATTRS[k], out);
    });
    Object.keys(vars).forEach((name) => {
      if (root.style.getPropertyValue(name) !== vars[name]) root.style.setProperty(name, vars[name]);
    });

    const items = configItems(raw);
    if (items.length) writeItems(sources, items);
    else if (!root.__atlasOwnItems || sources.__atlasSig) writeItems(sources, demoItems(opts.demoImages));
  }

  function mount(root) {
    if (root.dataset.gpReady === 'true') return;
    const viewport = root.querySelector('.gp-ii-viewport');
    const plane = root.querySelector('.gp-ii-plane');
    const sources = root.querySelector('.gp-ii-sources');
    // Older browsers retain the ordinary linked source gallery.
    if (!viewport || !plane || !sources || !window.ResizeObserver || !window.PointerEvent) return;
    let items = [], tiles = [], width = 0, height = 0, stepX = 1, stepY = 1;
    let columns = 0, rows = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, lastTime = 0;
    let boundsWidth = 0, boundsHeight = 0, autoX = 0, autoY = 0, targetAutoX = 0, targetAutoY = 0, randomElapsed = 0, initialPosition = true;
    let pointer = null, hovered = false, visible = true, destroyed = false;
    let followX = 0, followY = 0, keyboardFocus = false, settings = {}, needsLayout = true;
    const listeners = [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listen = (el, type, fn, options) => {
      el.addEventListener(type, fn, options);
      listeners.push(() => el.removeEventListener(type, fn, options));
    };
    const make = (tag, className, parent) => {
      const el = document.createElement(tag); el.className = className;
      if (parent) parent.appendChild(el); return el;
    };
    let sectionHost = null, sectionPosition = '', sectionPlaceholder = null;
    function releaseSection() {
      if (!sectionHost) return;
      if (sectionPlaceholder && sectionPlaceholder.parentNode) sectionPlaceholder.replaceWith(root);
      // Restore only the inline positioning owned by this instance.
      if (sectionHost.style.position === 'relative' && sectionPosition === '') sectionHost.style.removeProperty('position');
      else if (sectionHost.style.position === 'relative') sectionHost.style.position = sectionPosition;
      sectionHost = null; sectionPlaceholder = null; delete root.dataset.gpSectionActive;
    }
    function updateSectionMode() {
      if (root.dataset.gpSizeMode !== 'section' || root.dataset.gpPreview === 'true') { releaseSection(); return; }
      if (sectionHost) return;
      const host = root.parentElement && root.parentElement.closest('section');
      if (!host || host.classList.contains('gp-infinite-images')) return;
      // A dedicated section is required; do not stack two full-section canvases.
      if (host.querySelector('[data-gp-section-active="true"]')) return;
      sectionPlaceholder = document.createComment('Infinite Image Wall original Code Block location');
      root.before(sectionPlaceholder); sectionHost = host; sectionPosition = host.style.position;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.appendChild(root); root.dataset.gpSectionActive = 'true';
    }
    const measure = make('div', 'gp-ii-measure', viewport);
    measure.setAttribute('aria-hidden', 'true');
    function readSettings() {
      updateSectionMode();
      const bool = (name, fallback) => root.hasAttribute('data-gp-' + name) ? root.getAttribute('data-gp-' + name) === 'true' : fallback;
      const number = (name, fallback, min, max) => {
        const raw = root.getAttribute('data-gp-' + name);
        const n = raw === null || raw.trim() === '' ? fallback : Number(raw);
        return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
      };
      settings = {
        follow: bool('mouse-follow', false), wheel: bool('wheel', true), inertia: bool('inertia', true),
        autoplay: bool('autoplay', false), direction: root.dataset.gpAutoplayDirection || 'right',
        speed: number('autoplay-speed', 18, 0, 300), randomInterval: number('direction-interval', 4000, 500, 30000), pauseHover: bool('pause-hover', true),
        speedX: number('autoplay-x', 18, -300, 300), speedY: number('autoplay-y', 0, -300, 300),
        momentumStrength: number('momentum-strength', 1.35, 0, 3), followSpeed: number('follow-speed', 100, 0, 400), friction: number('friction', 0.975, 0.5, 0.995),
        ratioSeed: number('ratio-seed', 7, 0, 100000), threshold: number('drag-threshold', 7, 3, 30)
      };
      tiles.forEach((tile) => { tile.index = -1; });
      selectAutoplayDirection(); autoX = targetAutoX; autoY = targetAutoY; randomElapsed = 0;
      vx = vy = 0; needsLayout = true; request();
    }
    function selectAutoplayDirection() {
      const directions = { right: [1, 0], left: [-1, 0], down: [0, 1], up: [0, -1],
        'down-right': [Math.SQRT1_2, Math.SQRT1_2], 'down-left': [-Math.SQRT1_2, Math.SQRT1_2],
        'up-right': [Math.SQRT1_2, -Math.SQRT1_2], 'up-left': [-Math.SQRT1_2, -Math.SQRT1_2] };
      if (settings.direction === 'random') {
        const angle = Math.random() * Math.PI * 2;
        targetAutoX = Math.cos(angle) * settings.speed; targetAutoY = Math.sin(angle) * settings.speed;
      } else if (settings.direction === 'custom') {
        targetAutoX = settings.speedX; targetAutoY = settings.speedY;
      } else {
        const vector = directions[settings.direction] || directions.right;
        targetAutoX = vector[0] * settings.speed; targetAutoY = vector[1] * settings.speed;
      }
    }
    function readItems() {
      items = Array.from(sources.querySelectorAll('li > a, li > [data-gp-item]')).map((a) => {
        const img = a.querySelector('img'); if (!img) return null;
        const src = safeURL(img.getAttribute('src')); if (!src) return null;
        return { src, href: safeURL(a.getAttribute('href')),
          target: a.getAttribute('target') === '_blank' ? '_blank' : '_self',
          alt: img.getAttribute('alt') || '', title: a.dataset.gpTitle || img.alt || 'Image',
          description: a.dataset.gpDescription || '' };
      }).filter(Boolean);
      // Keep the fallback visible when content is empty or invalid.
      sources.hidden = false;
      plane.hidden = items.length === 0;
      tiles.forEach((tile) => { tile.index = -1; });
      needsLayout = true;
      request();
    }
    function createTile() {
      const el = make('a', 'gp-ii-tile', plane); el.tabIndex = -1; el.draggable = false;
      const card = make('span', 'gp-ii-card', el);
      const img = make('img', '', card); img.alt = ''; img.decoding = 'async'; img.draggable = false;
      const caption = make('span', 'gp-ii-caption', card);
      const captionTitle = make('span', 'gp-ii-caption-title', caption);
      const captionDescription = make('span', 'gp-ii-caption-description', caption);
      const error = make('span', 'gp-ii-error', card); error.textContent = 'Image unavailable'; error.hidden = true;
      img.addEventListener('error', () => { error.hidden = false; img.style.visibility = 'hidden'; });
      img.addEventListener('load', () => { error.hidden = true; img.style.visibility = ''; });
      return { el, img, captionTitle, captionDescription, error, index: -1 };
    }
    function layout() {
      needsLayout = false;
      const rect = measure.getBoundingClientRect();
      width = viewport.clientWidth; height = viewport.clientHeight;
      const css = getComputedStyle(root);
      const degrees = parseFloat(css.getPropertyValue('--gp-wall-rotation')) || 0;
      const angle = degrees * Math.PI / 180;
      boundsWidth = Math.abs(Math.cos(angle)) * width + Math.abs(Math.sin(angle)) * height;
      boundsHeight = Math.abs(Math.sin(angle)) * width + Math.abs(Math.cos(angle)) * height;
      const viewportCSS = getComputedStyle(viewport);
      const gap = Math.max(0, parseFloat(viewportCSS.columnGap) || 0);
      const rowGap = Math.max(0, parseFloat(viewportCSS.rowGap) || 0);
      const newX = Math.max(40, rect.width) + gap, newY = Math.max(40, rect.height) + rowGap;
      x = x / stepX * newX; y = y / stepY * newY; stepX = newX; stepY = newY;
      if (initialPosition && width > 0 && height > 0) {
        x = stepX / 2; y = Math.min(140, height * 0.1); initialPosition = false;
      }
      columns = width > 0 ? Math.ceil(boundsWidth / stepX) + 3 : 0;
      rows = height > 0 ? Math.ceil(boundsHeight / stepY) + 3 : 0;
      const count = items.length ? columns * rows : 0;
      // Hard allocation cap protects against pathological custom dimensions.
      if (count > 500) {
        const factor = Math.sqrt(count / 480);
        stepX *= factor; stepY *= factor;
        columns = Math.ceil(boundsWidth / stepX) + 3; rows = Math.ceil(boundsHeight / stepY) + 3;
      }
      const needed = items.length ? columns * rows : 0;
      while (tiles.length < needed) tiles.push(createTile());
      while (tiles.length > needed) tiles.pop().el.remove();
    }
    function ratioFor(index) {
      // Stable pseudo-random ratio: recycling never changes an image's proportions.
      let hash = (index + Math.floor(settings.ratioSeed) + 1) >>> 0;
      hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
      hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
      hash = (hash ^ (hash >>> 16)) >>> 0;
      return ['portrait', 'square', 'landscape'][hash % 3];
    }
    function render() {
      if (!items.length || !columns || !rows) return;
      // Rebase only at large distances, using periods that preserve source AND pool slots.
      const periodX = items.length * columns * stepX, periodY = items.length * rows * stepY;
      if (Math.abs(x) > 10000000) x -= Math.trunc(x / periodX) * periodX;
      if (Math.abs(y) > 10000000) y -= Math.trunc(y / periodY) * periodY;
      const startCol = Math.floor(((width - boundsWidth) / 2 - x) / stepX) - 1;
      const startRow = Math.floor(((height - boundsHeight) / 2 - y) / stepY) - 1;
      const stride = Math.max(1, items.length - 1);
      for (let r = 0; r < rows; r++) for (let c = 0; c < columns; c++) {
        const col = startCol + c, row = startRow + r;
        // Toroidal pool: a world cell keeps its DOM tile until it leaves the overscan area.
        const tile = tiles[mod(row, rows) * columns + mod(col, columns)];
        const index = mod(col + row * stride, items.length);
        tile.el.style.transform = 'translate3d(' + (col * stepX + x) + 'px,' + (row * stepY + y) + 'px,0)';
        if (tile.index !== index) {
          const item = items[index]; tile.index = index; tile.el.dataset.gpIndex = String(index); tile.el.dataset.gpRatio = ratioFor(index);
          if (item.href) { tile.el.href = item.href; tile.el.target = item.target; tile.el.rel = 'noopener noreferrer'; }
          else { tile.el.removeAttribute('href'); tile.el.removeAttribute('target'); tile.el.removeAttribute('rel'); }
          tile.captionTitle.textContent = item.title; tile.captionDescription.textContent = item.description; tile.el.setAttribute('aria-label', item.title);
          tile.error.hidden = true; tile.img.style.visibility = '';
          if (tile.img.getAttribute('src') !== item.src) tile.img.src = item.src;
        }
      }
    }
    function canMove() { return visible && !document.hidden && width > 0 && height > 0 && items.length > 0; }
    function request() { if (!raf && !destroyed && visible && !document.hidden) raf = requestAnimationFrame(frame); }
    function frame(time) {
      raf = 0;
      if (destroyed || !root.isConnected) return;
      if (needsLayout) layout();
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60; lastTime = time;
      let moving = false;
      if (canMove() && !pointer && !reduced.matches && !(keyboardFocus && viewport.contains(document.activeElement))) {
        if (settings.inertia && (Math.abs(vx) > 3 || Math.abs(vy) > 3)) {
          x += vx * dt; y += vy * dt;
          const decay = Math.pow(settings.friction, dt * 60); vx *= decay; vy *= decay; moving = true;
        } else { vx = vy = 0; }
        if (settings.autoplay && !(hovered && settings.pauseHover)) {
          if (settings.direction === 'random') {
            randomElapsed += dt * 1000;
            if (randomElapsed >= settings.randomInterval) { randomElapsed = 0; selectAutoplayDirection(); }
            const blend = 1 - Math.exp(-3 * dt);
            autoX += (targetAutoX - autoX) * blend; autoY += (targetAutoY - autoY) * blend;
          }
          x += autoX * dt; y += autoY * dt;
          moving = moving || !!(autoX || autoY || settings.speed && settings.direction === 'random');
        }
        if (settings.follow && hovered && (followX || followY)) {
          x += followX * settings.followSpeed * dt; y += followY * settings.followSpeed * dt; moving = true;
        }
      }
      render();
      if (moving) request(); else lastTime = 0;
    }
    function activate(index, event) {
      const item = items[index]; if (!item) return;
      if (item.href) {
        if (item.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey) window.open(item.href, '_blank', 'noopener,noreferrer');
        else window.location.assign(item.href);
      }
    }
    function screenDelta(dx, dy) {
      const angle = (parseFloat(getComputedStyle(root).getPropertyValue('--gp-wall-rotation')) || 0) * Math.PI / 180;
      return [dx * Math.cos(angle) + dy * Math.sin(angle), -dx * Math.sin(angle) + dy * Math.cos(angle)];
    }
    const tileFrom = (target) => target instanceof Element ? target.closest('.gp-ii-tile') : null;
    listen(viewport, 'pointerdown', (event) => {
      if (sources.contains(event.target) || pointer || event.button !== 0 || !event.isPrimary || !items.length) return;
      const tile = tileFrom(event.target);
      keyboardFocus = false;
      pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY,
        lastX: event.clientX, lastY: event.clientY, time: performance.now(), moved: false,
        index: tile ? Number(tile.dataset.gpIndex) : null };
      vx = vy = 0; followX = followY = 0;
      viewport.setPointerCapture(event.pointerId);
    });
    listen(viewport, 'pointermove', (event) => {
      if (!pointer) {
        if (event.pointerType !== 'mouse' || !settings.follow || reduced.matches) return;
        const rect = viewport.getBoundingClientRect();
        followX = -(event.clientX - rect.left - rect.width / 2) / Math.max(1, rect.width / 2);
        followY = -(event.clientY - rect.top - rect.height / 2) / Math.max(1, rect.height / 2);
        // Dead zone makes selecting an image near the center easier.
        if (Math.abs(followX) < 0.15) followX = 0;
        if (Math.abs(followY) < 0.15) followY = 0;
        request(); return;
      }
      if (event.pointerId !== pointer.id) return;
      const now = performance.now();
      if (!pointer.moved && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) >= settings.threshold) {
        pointer.moved = true; root.dataset.gpDragging = 'true';
      }
      if (!pointer.moved) return;
      const [dx, dy] = screenDelta(event.clientX - pointer.lastX, event.clientY - pointer.lastY);
      const seconds = Math.max(0.008, (now - pointer.time) / 1000);
      x += dx; y += dy;
      // Smooth recent pointer velocity so one noisy event does not cause a sudden fling.
      const blend = 1 - Math.exp(-seconds * 35);
      vx += (Math.max(-2400, Math.min(2400, dx / seconds)) - vx) * blend;
      vy += (Math.max(-2400, Math.min(2400, dy / seconds)) - vy) * blend;
      pointer.lastX = event.clientX; pointer.lastY = event.clientY; pointer.time = now;
      event.preventDefault(); request();
    }, { passive: false });
    function endPointer(event, canceled) {
      if (!pointer || event.pointerId !== pointer.id) return;
      const finished = pointer; pointer = null; delete root.dataset.gpDragging;
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (canceled || !finished.moved || !settings.inertia || reduced.matches || performance.now() - finished.time > 180) vx = vy = 0;
      else {
        const releaseAge = Math.max(0, performance.now() - finished.time);
        const retention = Math.exp(-Math.max(0, releaseAge - 40) / 100);
        vx *= settings.momentumStrength * retention; vy *= settings.momentumStrength * retention;
      }
      if (!canceled && !finished.moved && finished.index !== null) activate(finished.index, event);
      request();
    }
    listen(viewport, 'pointerup', (e) => endPointer(e, false));
    listen(viewport, 'pointercancel', (e) => endPointer(e, true));
    listen(viewport, 'lostpointercapture', (e) => endPointer(e, true));
    listen(viewport, 'click', (event) => {
      if (!items.length || sources.contains(event.target)) return;
      event.preventDefault();
      // Pointer taps are handled on pointerup, avoiding accidental clicks after a drag.
      const tile = tileFrom(event.target);
      if (event.detail === 0 && tile) activate(Number(tile.dataset.gpIndex), event);
    });
    listen(viewport, 'dragstart', (e) => e.preventDefault());
    listen(viewport, 'pointerenter', () => { hovered = true; });
    listen(viewport, 'pointerleave', () => { hovered = false; followX = followY = 0; request(); });
    listen(viewport, 'wheel', (event) => {
      if (sources.contains(event.target) || !settings.wheel || event.ctrlKey || !items.length) return;
      event.preventDefault(); vx = vy = 0;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
      let dx = event.deltaX * unit, dy = event.deltaY * unit;
      if (event.shiftKey && !dx) { dx = dy; dy = 0; }
      const delta = screenDelta(dx, dy);
      x -= Math.max(-2000, Math.min(2000, delta[0])); y -= Math.max(-2000, Math.min(2000, delta[1])); request();
    }, { passive: false });
    listen(viewport, 'keydown', (event) => {
      if (sources.contains(event.target)) return;
      keyboardFocus = true;
      if (!items.length) return;
      const moves = { ArrowLeft: [80, 0], ArrowRight: [-80, 0], ArrowUp: [0, 80], ArrowDown: [0, -80] };
      if (moves[event.key]) { event.preventDefault(); vx = vy = 0; const delta = screenDelta(...moves[event.key]); x += delta[0]; y += delta[1]; request(); }
      else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const stride = Math.max(1, items.length - 1);
        const col = Math.floor((width / 2 - x) / stepX), row = Math.floor((height / 2 - y) / stepY);
        activate(mod(col + row * stride, items.length), event);
      }
    });
    listen(viewport, 'focusin', () => { if (!pointer) keyboardFocus = true; });
    listen(viewport, 'focusout', () => { keyboardFocus = false; request(); });
    listen(document, 'visibilitychange', () => {
      vx = vy = 0; lastTime = 0;
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; } else request();
    });
    const motionChange = () => { vx = vy = 0; followX = followY = 0; request(); };
    if (reduced.addEventListener) listen(reduced, 'change', motionChange);
    function updateCompact() {
      const host = root.parentElement;
      const w = (host && host.clientWidth) || window.innerWidth;
      const next = w > 0 && w <= COMPACT_WIDTH ? 'true' : 'false';
      if (root.dataset.gpCompact !== next) root.dataset.gpCompact = next;
    }
    updateCompact();
    const resize = new ResizeObserver(() => { updateCompact(); needsLayout = true; request(); });
    resize.observe(viewport); resize.observe(measure); if (root.parentElement) resize.observe(root.parentElement);
    const intersection = window.IntersectionObserver ? new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      lastTime = 0; vx = vy = 0;
      if (visible) request(); else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: '100px' }) : null;
    if (intersection) intersection.observe(root);
    const contentObserver = new MutationObserver(readItems);
    contentObserver.observe(sources, { childList: true, subtree: true, attributes: true, characterData: true,
      attributeFilter: ['src', 'alt', 'href', 'target', 'data-gp-title', 'data-gp-description'] });
    const settingsObserver = new MutationObserver(readSettings);
    settingsObserver.observe(root, { attributes: true, attributeFilter: ['style', 'class', 'data-gp-size-mode', 'data-gp-aspect-mode', 'data-gp-image-shape', 'data-gp-ratio-seed',
      'data-gp-momentum-strength', 'data-gp-mouse-follow', 'data-gp-wheel', 'data-gp-inertia', 'data-gp-autoplay',
      'data-gp-autoplay-direction', 'data-gp-autoplay-speed', 'data-gp-direction-interval', 'data-gp-autoplay-x', 'data-gp-autoplay-y', 'data-gp-follow-speed', 'data-gp-friction',
      'data-gp-drag-threshold', 'data-gp-pause-hover'] });
    root.dataset.gpReady = 'true'; readSettings(); readItems();
    return () => {
      destroyed = true; if (raf) cancelAnimationFrame(raf);
      listeners.forEach((off) => off()); resize.disconnect(); contentObserver.disconnect(); settingsObserver.disconnect();
      if (intersection) intersection.disconnect();
      releaseSection(); measure.remove(); plane.replaceChildren();
      sources.hidden = false; delete root.dataset.gpReady; delete root.dataset.gpDragging; delete root.dataset.gpCompact;
    };
  }

  function configure(root) {
    const sources = scaffold(root);
    const live = liveConfig(root);
    const global = globalConfig();
    if (live || global) applyConfig(root, Object.assign({}, global || {}, live || {}));
    else if (!sources.children.length) writeItems(sources, demoItems());
  }
  function init() {
    instances.forEach((destroy, root) => { if (!root.isConnected || !root.matches(selector)) { destroy(); instances.delete(root); } });
    document.querySelectorAll(selector).forEach((root) => {
      if (root.dataset.gpPreview === 'true') return; // Plugin Studio drives its own preview root.
      configure(root);
      if (!instances.has(root)) { const destroy = mount(root); if (destroy) instances.set(root, destroy); }
    });
  }
  /** Plugin Studio preview: apply settings to one root and start it. */
  function preview(root, cfg, opts) {
    applyConfig(root, cfg, Object.assign({ preview: true }, opts || {}));
    if (!instances.has(root)) { const destroy = mount(root); if (destroy) instances.set(root, destroy); }
  }
  function destroyRoot(root) {
    const destroy = instances.get(root);
    if (destroy) { destroy(); instances.delete(root); }
  }
  window[KEY] = { init };
  window.AtlasInfiniteImages = { version: '1.0.2', init, preview, destroy: destroyRoot, defaults: DEFAULTS };
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  window.addEventListener('mercury:load', init);
  // Saved preset arrives after the script runs: re-apply when it lands.
  document.addEventListener('ghost:config', init);
  // Also handles dynamically inserted Code Blocks and cleans up removed instances.
  const navigationObserver = new MutationObserver((records) => {
    if (records.some((r) => Array.from(r.addedNodes).concat(Array.from(r.removedNodes)).some((n) =>
      n.nodeType === 1 && (n.matches(selector) || n.querySelector(selector))))) init();
  });
  navigationObserver.observe(document.documentElement, { childList: true, subtree: true });
  init();
})();
