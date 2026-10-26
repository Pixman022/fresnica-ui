/* global window, document, requestAnimationFrame, cancelAnimationFrame, MutationObserver, IntersectionObserver, ResizeObserver */
/* Fresnica hero point-cloud orbit: 1500 points, 60% size, 10s/revolution. */
(() => {
    'use strict';
    const settings = { count: 1500, size: 0.6, seconds: 10, guides: true, secondOrbit: true };
    const W = 760, H = 540, cx = 470, cy = 266, R = 145;
    const mainOrbit = { rx: 265, ry: 100, tilt: -24 * Math.PI / 180 };
    const secondOrbit = { rx: 223, ry: 67, tilt: 22 * Math.PI / 180 };
    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = Array.from({ length: settings.count }, (_, i) => {
        const z = 1 - 2 * (i + 0.5) / settings.count;
        const s = Math.sqrt(1 - z * z);
        const phi = i * golden;
        const random = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
        const jitter = random < 0.08 ? 1.7 + random * 0.9
            : random < 0.28 ? 1.18 + random * 0.55
                : 0.78 + random * 0.44;
        return { x: s * Math.cos(phi), y: s * Math.sin(phi), z, jitter };
    });
    let canvas = null, ctx = null, visible = false, frameId = 0, lastTime = 0;
    let angle = Math.PI * 0.72, rotation = 0.27;
    let inViewObserver = null, sizeObserver = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function orbitPoint(orbit, t) {
        const x = orbit.rx * Math.cos(t), y = orbit.ry * Math.sin(t);
        return {
            x: cx + x * Math.cos(orbit.tilt) - y * Math.sin(orbit.tilt),
            y: cy + x * Math.sin(orbit.tilt) + y * Math.cos(orbit.tilt)
        };
    }
    function orbitPath(orbit, start, end) {
        ctx.beginPath();
        for (let n = 0; n <= 150; n++) {
            const p = orbitPoint(orbit, start + (end - start) * n / 150);
            if (n === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
    }
    function strokeOrbit(orbit, start, end, color, width, dash = []) {
        orbitPath(orbit, start, end);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.setLineDash(dash);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    function drawGuides() {
        if (!settings.guides) return;
        ctx.save();
        ctx.strokeStyle = 'rgba(158,174,165,.25)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 8]);
        ctx.beginPath();
        ctx.moveTo(70, cy); ctx.lineTo(740, cy);
        ctx.moveTo(cx, 48); ctx.lineTo(cx, 492);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, R + 65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(135,151,141,.4)';
        ctx.beginPath();
        ctx.moveTo(123, 156); ctx.lineTo(150, 156);
        ctx.moveTo(136, 143); ctx.lineTo(136, 169);
        ctx.moveTo(676, 352); ctx.lineTo(702, 352);
        ctx.moveTo(689, 339); ctx.lineTo(689, 365);
        ctx.stroke();
        ctx.fillStyle = 'rgba(123,143,132,.72)';
        ctx.font = '9px sans-serif';
        ctx.fillText('01 / POINT CLOUD', 535, 77);
        ctx.fillText('02 / ORBIT', 120, 423);
        ctx.restore();
    }
    function drawTicks(start, end) {
        if (!settings.guides) return;
        ctx.save();
        for (let n = 0; n < 48; n++) {
            const t = n * Math.PI * 2 / 48;
            if (t < start || t >= end) continue;
            const p = orbitPoint(mainOrbit, t), q = orbitPoint(mainOrbit, t + 0.001);
            const d = Math.hypot(q.x - p.x, q.y - p.y);
            if (d < 0.001) continue;
            const nx = -(q.y - p.y) / d, ny = (q.x - p.x) / d;
            const long = n % 6 === 0, len = long ? 7 : 3.5;
            ctx.strokeStyle = long ? 'rgba(100,125,110,.62)' : 'rgba(135,154,143,.3)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x + 2 * nx, p.y + 2 * ny);
            ctx.lineTo(p.x + (2 + len) * nx, p.y + (2 + len) * ny);
            ctx.stroke();
        }
        ctx.restore();
    }
    function drawMoon(front) {
        const p = orbitPoint(mainOrbit, angle), scale = front ? 1 : 0.86;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(scale, scale);
        ctx.globalAlpha = front ? 1 : 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(113,156,127,.44)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 5.4, 0, Math.PI * 2);
        ctx.fillStyle = '#508362';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-1, -1.1, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
    }
    function drawPointSphere() {
        const ca = Math.cos(rotation), sa = Math.sin(rotation);
        const ct = Math.cos(.22), st = Math.sin(.22);
        for (const d of points) {
            const x = d.x * ca + d.z * sa, z1 = -d.x * sa + d.z * ca;
            const y = d.y * ct - z1 * st, z = d.y * st + z1 * ct;
            const perspective = 3.65 / (3.65 - z), depth = (z + 1) * .5;
            const radius = (.26 + 2.05 * Math.pow(depth, 1.42)) * perspective * d.jitter * settings.size;
            const alpha = .12 + .8 * Math.pow(depth, .92);
            ctx.fillStyle = depth > .62 ? 'rgba(98,124,106,' + alpha + ')'
                : depth > .4 ? 'rgba(136,153,140,' + alpha + ')'
                    : 'rgba(167,184,173,' + alpha + ')';
            ctx.beginPath();
            ctx.arc(cx + R * x * perspective, cy + R * y * perspective, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    function paint() {
        if (!ctx || !canvas || !canvas.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        drawGuides();
        if (settings.secondOrbit) strokeOrbit(secondOrbit, 0, Math.PI * 2, 'rgba(162,178,168,.42)', .85, [3, 6]);
        strokeOrbit(mainOrbit, Math.PI, Math.PI * 2, 'rgba(155,175,159,.55)', 1.1);
        drawTicks(Math.PI, Math.PI * 2);
        if (Math.sin(angle) < 0) drawMoon(false);
        drawPointSphere();
        strokeOrbit(mainOrbit, 0, Math.PI, 'rgba(116,145,129,.74)', 1.12);
        drawTicks(0, Math.PI);
        if (Math.sin(angle) >= 0) drawMoon(true);
    }
    function resize() {
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
        paint();
    }
    function stop() {
        if (frameId) cancelAnimationFrame(frameId);
        frameId = 0;
    }
    function tick(now) {
        frameId = 0;
        if (!visible || !canvas || !canvas.isConnected || reduceMotion.matches || document.hidden) return;
        const dt = Math.min((now - (lastTime || now)) / 1000, .05);
        lastTime = now;
        angle = (angle + dt * Math.PI * 2 / settings.seconds) % (Math.PI * 2);
        rotation += dt * .095;
        paint();
        frameId = requestAnimationFrame(tick);
    }
    function wake() {
        stop();
        if (!ctx) return;
        paint();
        if (!visible || reduceMotion.matches || document.hidden) return;
        lastTime = 0;
        frameId = requestAnimationFrame(tick);
    }
    function mount() {
        const next = document.querySelector('.geo-v2-hero-art canvas.fresnica-point-orbit');
        if (!next || next === canvas) return;
        stop();
        inViewObserver?.disconnect();
        sizeObserver?.disconnect();
        canvas = next;
        ctx = canvas.getContext('2d');
        if (!ctx) return;
        resize();
        if ('IntersectionObserver' in window) {
            inViewObserver = new IntersectionObserver(entries => {
                visible = Boolean(entries[0]?.isIntersecting);
                wake();
            }, { threshold: .01 });
            inViewObserver.observe(canvas);
        } else {
            visible = true;
            wake();
        }
        if ('ResizeObserver' in window) {
            sizeObserver = new ResizeObserver(resize);
            sizeObserver.observe(canvas);
        }
    }
    const app = document.querySelector('#app');
    if (app) new MutationObserver(mount).observe(app, { childList: true });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', wake);
    reduceMotion.addEventListener?.('change', wake);
    mount();
})();
