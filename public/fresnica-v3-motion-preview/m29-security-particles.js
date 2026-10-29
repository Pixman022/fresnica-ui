/* M29: compact canvas particle shield for the seventh website scene. */
(() => {
  'use strict';
  const visual = document.querySelector('#v3-security .security-visual');
  if (!visual) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'security-particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d', {alpha: true});
  if (!ctx) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 680px)');
  let seed = 291017;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const edge = y => {
    if (y < -0.73) return 0.715;
    if (y < 0.09) return 0.715 - (y + 0.73) * 0.032;
    const t = Math.min(1, (y - 0.09) / 0.95);
    return 0.69 * Math.pow(1 - t, 0.72);
  };
  const top = x => -0.96 + 0.23 * Math.abs(x) / 0.715;
  const particles = [];
  const add = (x, y, kind) => particles.push({
    x, y, kind, size: 0.58 + random() * (kind === 'check' ? 1.25 : 1.06),
    phase: random() * Math.PI * 2, tone: random(), speed: 0.65 + random() * 0.65
  });

  const insideCount = compact.matches ? 520 : 1160;
  for (let i = 0; i < insideCount; i++) {
    let x, y;
    do {
      x = (random() - 0.5) * 1.51;
      y = -0.96 + random() * 1.995;
    } while (Math.abs(x) > edge(y) || y < top(x));
    add(x, y, 'body');
  }
  const edgePoints = compact.matches ? 125 : 230;
  for (let i = 0; i <= edgePoints; i++) {
    const y = -0.73 + 1.76 * i / edgePoints;
    add(edge(y), y, 'edge');
    add(-edge(y), y, 'edge');
  }
  for (let i = 0; i < 115; i++) {
    const x = -0.715 + 1.43 * i / 114;
    add(x, top(x), 'edge');
  }
  const check = [[-0.32, 0.02], [-0.08, 0.28], [0.41, -0.28]];
  for (let segment = 0; segment < check.length - 1; segment++) {
    const a = check[segment], b = check[segment + 1];
    const count = segment === 0 ? 38 : 73;
    for (let i = 0; i <= count; i++) {
      const k = i / count;
      add(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, 'check');
    }
  }

  visual.insertBefore(canvas, visual.firstChild);
  visual.classList.add('has-particle-shield');
  let width = 350, height = 230, visible = false, running = false, lastDraw = 0;
  function resize() {
    const box = canvas.getBoundingClientRect();
    width = Math.max(1, box.width);
    height = Math.max(1, box.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  }
  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    const dark = document.documentElement.classList.contains('v3-theme-dark');
    const t = reduced.matches ? 0 : now / 1000;
    const sx = width * 0.405;
    const sy = height * 0.427;
    const cx = width * 0.5;
    const cy = height * 0.492;
    for (const p of particles) {
      const moving = reduced.matches ? 0 : Math.sin(t * p.speed + p.phase);
      const x = cx + p.x * sx + moving * (p.kind === 'body' ? 0.8 : 0.28);
      const y = cy + p.y * sy + moving * (p.kind === 'body' ? 0.55 : 0.22);
      const scan = Math.exp(-Math.pow((p.x - Math.sin(t * 0.36) * 0.92) / 0.32, 2));
      const alpha = (p.kind === 'check' ? 0.78 : p.kind === 'edge' ? 0.65 : 0.19 + p.tone * 0.36)
        * (0.87 + moving * 0.1 + scan * 0.19);
      if (p.kind === 'check') ctx.fillStyle = 'rgba(13,168,113,' + Math.min(alpha, 1) + ')';
      else if (p.kind === 'edge' || p.tone > 0.58)
        ctx.fillStyle = 'rgba(12,149,107,' + Math.min(alpha, 1) + ')';
      else ctx.fillStyle = dark
        ? 'rgba(194,218,202,' + Math.min(alpha, 1) + ')'
        : 'rgba(83,112,98,' + Math.min(alpha, 1) + ')';
      const radius = p.size * (p.kind === 'check' ? 1.03 : 0.77 + scan * 0.17);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function frame(now) {
    if (!visible || reduced.matches || document.hidden) {running = false; return;}
    if (now - lastDraw >= 32) {draw(now); lastDraw = now;}
    requestAnimationFrame(frame);
  }
  function start() {
    if (!running && visible && !reduced.matches && !document.hidden) {
      running = true;
      requestAnimationFrame(frame);
    }
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) {draw(performance.now()); start();}
    }, {threshold: 0.05}).observe(visual);
  } else {visible = true;}
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, {passive:true});
  reduced.addEventListener('change', () => {draw(performance.now()); start();});
  document.addEventListener('visibilitychange', start);
  resize();
  start();
})();