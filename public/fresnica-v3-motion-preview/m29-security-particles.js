/* M30: reconstruct the supplied Fresnica symbol from sampled SVG pixels. */
(() => {
  'use strict';
  const visual = document.querySelector('#v3-security .security-visual');
  const artwork = visual?.querySelector('img.security-artwork');
  if (!visual || !artwork) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'security-particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d', {alpha:true});
  if (!ctx) return;
  visual.insertBefore(canvas, visual.firstChild);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 680px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const pointer = {x:0, y:0, active:false};
  const rasterSize = 320;
  let seed = 291017;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  let shapeMask = null, filledCount = 0, particles = [];
  let width = 0, height = 0, scale = 0;
  let ready = false, visible = false, running = false, frameId = 0, lastDraw = 0;

  function sampleShape() {
    const raster = document.createElement('canvas');
    raster.width = raster.height = rasterSize;
    const mask = raster.getContext('2d', {willReadFrequently:true});
    if (!mask) return false;
    mask.drawImage(artwork, 0, 0, rasterSize, rasterSize);
    const pixels = mask.getImageData(0, 0, rasterSize, rasterSize).data;
    const area = new Uint8Array(rasterSize * rasterSize);
    let occupied = 0;
    for (let i = 0; i < area.length; i++) {
      const filled = pixels[i * 4 + 3] >= 128 ? 1 : 0;
      area[i] = filled;
      occupied += filled;
    }
    if (occupied < 1000) return false;
    shapeMask = area;
    filledCount = occupied;
    return true;
  }

  function buildParticles() {
    seed = 291017;
    // Place uniform, lightly jittered samples across the filled silhouette.
    // No dedicated perimeter points, outlines, strokes, or edge-specific colors.
    const target = compact.matches ? 1050 : 1650;
    const spacing = Math.sqrt(filledCount / target);
    const points = [];
    for (let row = 0, y = spacing * 0.5; y < rasterSize; row++, y += spacing) {
      const shift = row % 2 ? spacing * 0.5 : 0;
      for (let x = spacing * 0.5 + shift; x < rasterSize; x += spacing) {
        const px = x + (random() - 0.5) * spacing * 0.48;
        const py = y + (random() - 0.5) * spacing * 0.48;
        if (px < 0 || px >= rasterSize || py < 0 || py >= rasterSize) continue;
        if (shapeMask[Math.floor(py) * rasterSize + Math.floor(px)]) points.push([px, py]);
      }
    }
    particles = points.map(point => {
      const tone = random();
      const accent = random() < 0.06;
      const light = accent
        ? 'rgba(15,159,106,' + (0.70 + tone * 0.20).toFixed(2) + ')'
        : 'rgba(62,89,76,' + (0.69 + tone * 0.18).toFixed(2) + ')';
      const dark = accent
        ? 'rgba(105,226,158,' + (0.70 + tone * 0.20).toFixed(2) + ')'
        : 'rgba(194,219,203,' + (0.69 + tone * 0.18).toFixed(2) + ')';
      return {
        u: point[0] / rasterSize - 0.5,
        v: point[1] / rasterSize - 0.5,
        size: 1.25 + random() * 0.72,
        phase: random() * Math.PI * 2,
        speed: 0.65 + random() * 0.6,
        light, dark, x:0, y:0, vx:0, vy:0
      };
    });
    resize();
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width < 2 || bounds.height < 2) return;
    width = bounds.width;
    height = bounds.height;
    scale = Math.min(width * 0.96, height * 0.98);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pxWidth = Math.max(1, Math.round(width * dpr));
    const pxHeight = Math.max(1, Math.round(height * dpr));
    if (canvas.width !== pxWidth || canvas.height !== pxHeight) {
      canvas.width = pxWidth;
      canvas.height = pxHeight;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const p of particles) {
      p.x = width / 2 + p.u * scale;
      p.y = height / 2 + p.v * scale;
      p.vx = p.vy = 0;
    }
    if (ready) draw(performance.now(), 0);
  }

  function draw(now, step) {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const dark = document.documentElement.classList.contains('v3-theme-dark');
    const still = reduced.matches;
    const t = still ? 0 : now / 1000;
    const breath = still ? 1 : 1 + Math.sin(t * 0.70) * 0.006;
    for (const p of particles) {
      const dx = still ? 0 : Math.sin(t * p.speed + p.phase) * 0.32;
      const dy = still ? 0 : Math.cos(t * p.speed * 0.8 + p.phase) * 0.32;
      const targetX = width / 2 + p.u * scale * breath + dx;
      const targetY = height / 2 + p.v * scale * breath + dy;
      if (still || !step) {
        p.x = targetX;
        p.y = targetY;
        p.vx = p.vy = 0;
      } else {
        p.vx += (targetX - p.x) * 0.085 * step;
        p.vy += (targetY - p.y) * 0.085 * step;
        if (pointer.active) {
          const awayX = p.x - pointer.x;
          const awayY = p.y - pointer.y;
          const dist = Math.hypot(awayX, awayY);
          if (dist > 0.01 && dist < 44) {
            const force = (1 - dist / 44) * 1.25 * step;
            p.vx += awayX / dist * force;
            p.vy += awayY / dist * force;
          }
        }
        p.vx *= 0.79;
        p.vy *= 0.79;
        p.x += p.vx;
        p.y += p.vy;
      }
      ctx.fillStyle = dark ? p.dark : p.light;
      ctx.globalAlpha = still ? 1 : 0.89 + 0.11 * Math.sin(t * p.speed + p.phase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    if (!running) return;
    if (now - lastDraw >= 33) {
      const step = Math.min(1.8, (now - (lastDraw || now - 33)) / 33);
      draw(now, step);
      lastDraw = now;
    }
    frameId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  }
  function start() {
    if (!ready || !visible || reduced.matches || document.hidden || running) return;
    running = true;
    lastDraw = 0;
    frameId = requestAnimationFrame(frame);
  }
  function refreshMotion() {
    if (reduced.matches || document.hidden || !visible) stop();
    else start();
    if (ready && !running) draw(performance.now(), 0);
  }
  function init() {
    if (ready || !artwork.naturalWidth) return;
    try {
      if (!sampleShape()) return;
    } catch (_) { return; } // Keep the original SVG fallback if canvas sampling fails.
    ready = true;
    buildParticles();
    visual.classList.add('has-particle-shape');
    draw(performance.now(), 0);
    start();
  }

  canvas.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches) return;
    const box = canvas.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
    pointer.active = true;
  }, {passive:true});
  canvas.addEventListener('pointerleave', () => {pointer.active = false;});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      refreshMotion();
    }, {threshold:0.05}).observe(visual);
  } else visible = true;
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, {passive:true});
  compact.addEventListener('change', () => {
    if (ready) buildParticles();
  });
  reduced.addEventListener('change', refreshMotion);
  document.addEventListener('visibilitychange', refreshMotion);
  if ('MutationObserver' in window) {
    new MutationObserver(() => {
      if (ready && !running) draw(performance.now(), 0);
    }).observe(document.documentElement, {attributes:true, attributeFilter:['class']});
  }
  if (artwork.complete) init();
  else artwork.addEventListener('load', init, {once:true});
})();
