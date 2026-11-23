/* One continuous, mobile-first petal field for all ten invitation sections.
   Canvas stays fixed to the viewport: scrolling never restarts the particles.
   Uses source-approved local royal WebPs when available; the original
   vector petal drawing remains a fail-safe for missing/undecoded assets.
   No DOM particles or section-specific listeners. */
(() => {
  'use strict';
  const canvas = document.getElementById('globalPetalCanvas');
  if (!canvas || !canvas.getContext) return;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const COUNT = 26; // Preserve the continuous 26-particle engine.
  const royal = new URLSearchParams(window.location.search).get('skin') === 'golden-pagoda-garden';
  // Exact GitHub-uploaded artwork is loaded only for the Myanmar royal skin.
  // Order: blush flat lotus 45%, curled lotus 30%, ivory lotus 25%.
  // Flat pink asset has an opaque white matte; royal canvas CSS applies
  // multiply blending so white blends into scenery without modifying source.
  // Missing/undecoded images still fall back to the canvas-drawn petals.
  const royalPetalSources = [
    './assets/skins/golden-pagoda-garden/shared/petals/s00-lotus-petal-pink-flat.webp',
    './assets/skins/golden-pagoda-garden/shared/petals/s00-lotus-petal-pink-curled.webp',
    './assets/skins/golden-pagoda-garden/shared/petals/s00-lotus-petal-ivory.webp'
  ];
  const royalPetalImages = royal ? royalPetalSources.map((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    return img;
  }) : [];
  const TAU = Math.PI * 2;
  const colors = ['#e9bed8', '#f2d8e6', '#d5a6cf', '#f6e6ed', '#bfa0d5'];
  const petals = [];
  let width = 0, height = 0, dpr = 1, frame = 0, previous = 0, lastPaint = 0;
  const PAINT_INTERVAL_MS = 1000 / 30;
  // During Royal Section 1, the 30fps cap makes drifting petals visibly
  // judder against 60/120Hz CSS scenery. Render at 60fps there only; retain
  // the original battery-friendly 30fps budget for Sections 2–10.
  const ROYAL_COVER_INTERVAL_MS = 1000 / 60;
  const royalHero = document.getElementById('viewport');
  let enabled = false;
  // Stable, deterministic distribution avoids synchronized resets.
  const rand = (seed) => {
    const n = Math.sin(seed * 127.1 + 78.233) * 43758.5453;
    return n - Math.floor(n);
  };
  function makePetal(i) {
    const choice = rand(i + 521);
    const species = choice < .45 ? 0 : choice < .75 ? 1 : 2;
    const sizeScale = .76 + rand(i + 571) * .30;
    const naturalSize = [22, 19, 16][species] * sizeScale;
    return {
      id: i,
      // Retain twenty naturally distributed visible petals while all 26
      // particle clocks continue, preserving scroll continuity and timing.
      visibleInRoyal: i % 4 !== 0,
      species,
      naturalSize,
      x: rand(i + 1) * width,
      y: rand(i + 71) * height,
      radius: 2.8 + rand(i + 121) * 3.6,
      speed: 11 + rand(i + 171) * 19,
      drift: 5 + rand(i + 221) * 14,
      phase: rand(i + 271) * TAU,
      frequency: .35 + rand(i + 321) * .5,
      rotation: rand(i + 371) * TAU,
      spin: (rand(i + 421) - .5) * 1.2,
      opacity: .42 + rand(i + 471) * .37,
      color: colors[i % colors.length]
    };
  }
  function resize() {
    const oldWidth = width, oldHeight = height;
    const nextWidth = Math.max(1, window.innerWidth);
    const nextHeight = Math.max(1, window.innerHeight);
    // A 1.5x royal canvas halves the pixels of a 2x buffer while keeping
    // the small painted WebP petals detailed at their approved CSS sizes.
    const nextDpr = Math.min(window.devicePixelRatio || 1, royal ? 1.5 : 2);
    // Mobile address-bar / orientation events may repeat unchanged sizes.
    // Avoid reallocating and clearing the visible canvas in that case.
    if (width === nextWidth && height === nextHeight && dpr === nextDpr &&
        canvas.width === Math.round(nextWidth * nextDpr) &&
        canvas.height === Math.round(nextHeight * nextDpr)) return;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!petals.length) {
      for (let i = 0; i < COUNT; i++) petals.push(makePetal(i));
    } else {
      for (const p of petals) {
        p.x = p.x / oldWidth * width;
        p.y = p.y / oldHeight * height;
      }
    }
  }
  function draw(p, time) {
    if (royal && !p.visibleInRoyal) return;
    const sway = Math.sin(time * p.frequency + p.phase) * p.drift;
    const x = p.x + sway;
    const y = p.y;
    const turn = p.rotation + time * p.spin;
    context.save();
    context.translate(x, y);
    context.rotate(turn);
    context.globalAlpha = royal ? p.opacity * .88 : p.opacity;
    const img = royal && royalPetalImages[p.species];
    if (img && img.complete && img.naturalWidth > 0) {
      const size = p.naturalSize;
      // Draw the entire 256x256 transparent WebP, never stretch, clip or
      // recolor its approved painted silhouette.
      context.drawImage(img, -size / 2, -size / 2, size, size);
      context.restore();
      return;
    }
    // Preserve the known-working petal shape when a WebP is still loading,
    // missing from a preview branch or unsupported in a legacy browser.
    context.fillStyle = p.color;
    context.beginPath();
    context.moveTo(0, -p.radius * 1.65);
    context.bezierCurveTo(p.radius * 1.1, -p.radius * 1.2,
      p.radius * 1.15, p.radius * .75, 0, p.radius * 1.5);
    context.bezierCurveTo(-p.radius * 1.4, p.radius * .65,
      -p.radius * 1.1, -p.radius * 1.1, 0, -p.radius * 1.65);
    context.fill();
    context.restore();
  }
  function tick(now) {
    if (!enabled) return;
    // The callback tracks display refresh; actual full-canvas painting is
    // bounded to approximately 30 fps (including 120 Hz iPhone displays).
    frame = window.requestAnimationFrame(tick);
    const royalCoverVisible = royal && window.scrollY <=
      (royalHero?.clientHeight || window.innerHeight) * 3.25;
    const interval = royalCoverVisible ? ROYAL_COVER_INTERVAL_MS : PAINT_INTERVAL_MS;
    if (lastPaint && now - lastPaint < interval - 1) return;
    const delta = previous ? Math.min((now - previous) / 1000, .05) : 0;
    previous = now;
    lastPaint = now;
    const time = now / 1000;
    context.clearRect(0, 0, width, height);
    for (const p of petals) {
      p.y += p.speed * delta;
      if (p.y > height + p.radius * 2) {
        p.y = -p.radius * 2;
        p.x = rand(p.phase + now) * width;
      }
      draw(p, time);
    }
  }
  function sync() {
    const shouldRun = !motion.matches && !document.hidden;
    if (shouldRun === enabled) return;
    enabled = shouldRun;
    if (enabled) {
      document.documentElement.classList.add('global-petals-active');
      previous = 0;
      lastPaint = 0;
      frame = window.requestAnimationFrame(tick);
    } else {
      window.cancelAnimationFrame(frame);
      context.clearRect(0, 0, width, height);
      document.documentElement.classList.remove('global-petals-active');
    }
  }
  resize();
  sync();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', sync);
  if (motion.addEventListener) motion.addEventListener('change', sync);
  else if (motion.addListener) motion.addListener(sync);
})();
