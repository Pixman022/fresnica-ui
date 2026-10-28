/* Fresnica V3 M7 — reference-aligned typography and navigation polish.
 * The approved Hero orb and prior scroll chapters are not changed. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 680px)');
  const scene = document.getElementById('v3-contrast');
  const nav = document.querySelector('.top-nav');
  if (!nav) return;
  const lines = [...(scene?.querySelectorAll('.contrast-line') || [])];
  const css = document.createElement('style');
  css.id = 'v3-m7-polish-styles';
  css.textContent = `
    @media (min-width:681px) and (prefers-reduced-motion:no-preference) {
      html.m7-motion #v3-contrast .contrast-line {
        clip-path: inset(0 var(--m7-mask,0%) 0 0);
        will-change: clip-path;
      }
      html.m7-motion .top-nav { transition: background-color .32s ease, color .32s ease, box-shadow .32s ease; }
      html.m7-motion .nav-dropdown {
        display: block; opacity:0; visibility:hidden;
        transform:translate(-50%,-9px) scale(.97); transform-origin:50% 0;
        background:rgba(17,22,20,.94); backdrop-filter:blur(16px);
        transition: opacity .23s ease,transform .23s ease,visibility .23s;
      }
      html.m7-motion .nav-dropdown.is-open {
        opacity:1;visibility:visible;transform:translate(-50%,0) scale(1);
      }
      html.m7-motion .nav-button[aria-expanded=true] {box-shadow:0 0 0 2px rgba(18,172,112,.18)}
    }
    @media (prefers-reduced-motion:reduce) {
      #v3-contrast .contrast-line {clip-path:none!important;will-change:auto!important}
      .nav-dropdown,.top-nav {transition:none!important;backdrop-filter:none!important}
    }
  `;
  document.head.append(css);
  const clamp = x => Math.max(0,Math.min(1,x));
  const smooth = (a,b,x) => {
    const v=clamp((x-a)/(b-a));
    return v*v*(3-2*v);
  };
  let active = false, pending = false;
  function update() {
    pending = false;
    if (!active) return;
    const runway=scene?.closest('.m5-runway');
    if (!runway) return;
    const r=runway.getBoundingClientRect();
    const p=clamp(-r.top/Math.max(1,runway.offsetHeight-innerHeight));
    lines.forEach((line,i) => {
      // Reveal each line from left to right, synchronized with the existing M5 fades.
      const visible=smooth(.07+i*.13,.29+i*.14,p);
      line.style.setProperty('--m7-mask',`${((1-visible)*100).toFixed(2)}%`);
    });
  }
  function requestUpdate() {
    if(active && !pending){pending=true;requestAnimationFrame(update);}
  }
  function mode() {
    active=!reduced.matches&&!compact.matches&&document.documentElement.classList.contains('m5-motion');
    document.documentElement.classList.toggle('m7-motion',active);
    if(!active) lines.forEach(line=>line.style.removeProperty('--m7-mask'));
    else requestUpdate();
  }
  mode();
  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',mode,{passive:true});
  reduced.addEventListener('change',mode);
  compact.addEventListener('change',mode);
})();
