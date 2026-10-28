/* Fresnica V3 M5: scroll-scrubbed choreography. The approved Hero orb is untouched. */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 680px)');
  const clamp = x => Math.max(0, Math.min(1, x));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const fadeOut = (x, a = .87, b = 1) => 1 - smooth(a, b, x);
  const css = document.createElement('style');
  css.id = 'v3-m5-story-styles';
  css.textContent = `
@media (min-width: 681px) and (prefers-reduced-motion: no-preference) {
  html.m5-motion .m5-runway {height:var(--m5-height,185vh);position:relative;isolation:isolate;}
  html.m5-motion .m5-runway>.chapter {position:sticky;top:24px;margin-top:8px;margin-bottom:8px;}
  html.m5-motion .m5-runway .reveal {transition:none!important;opacity:var(--m5-appear,1)!important;transform:translate3d(0,var(--m5-shift,0px),0)!important;}
  html.m5-motion #v3-ecosystem .orbital-intro {opacity:var(--m5-top-alpha,1);translate:0 var(--m5-top-shift,0px);}
  html.m5-motion #v3-ecosystem .bottom-intro {opacity:var(--m5-bottom-alpha,1);translate:0 var(--m5-bottom-shift,0px);}
  html.m5-motion #v3-ecosystem .particle-cloud {opacity:var(--m5-cloud-alpha,.9)!important;transform:scale(var(--m5-cloud-scale,1));}
  html.m5-motion #v3-contrast .contrast-line {opacity:var(--m5-line-alpha,1)!important;transform:translate3d(0,var(--m5-line-shift,0px),0)!important;}
  html.m5-motion #v3-workspace .ws-stat {transition:background-color .18s ease,box-shadow .18s ease,transform .18s ease;}
  html.m5-motion #v3-workspace .ws-stat.m5-focus {background:#e6f4ee;box-shadow:inset 3px 0 #10a578;transform:translateX(2px);}
  html.m5-motion #v3-workspace .workspace-mini {scale:var(--m5-ws-scale,1)!important;translate:0 var(--m5-ws-shift,0px)!important;}
  html.m5-motion #v3-workspace .network polyline {stroke-dashoffset:var(--m5-network-offset,1)!important;transition:none!important;}
  html.m5-motion #v3-workspace .network svg>circle {transition:opacity .12s linear;}
  html.m5-motion .feature-card.is-active .feature-ui {translate:0 -6px;box-shadow:0 24px 45px #13231d1b;}
}
`;
  document.head.append(css);

  const specs = [
    ['v3-ecosystem', 'particles', '172vh'],
    ['v3-contrast', 'contrast', '185vh'],
    ['v3-workspace', 'workspace', '190vh']
  ];
  const scenes = specs.map(([id, key, height]) => {
    const scene = document.getElementById(id);
    if (!scene) return null;
    const runway = document.createElement('div');
    runway.className = `m5-runway m5-runway-${key}`;
    runway.style.setProperty('--m5-height', height);
    runway.setAttribute('data-m5-scene', key);
    scene.parentNode.insertBefore(runway, scene);
    runway.append(scene);
    return {scene, runway, key, progress:0};
  }).filter(Boolean);
  const sceneBy = Object.fromEntries(scenes.map(s => [s.key, s.scene]));
  const contrastLines = [...(sceneBy.contrast?.querySelectorAll('.contrast-line') || [])];
  const compareCards = [...(sceneBy.contrast?.querySelectorAll('.compare-card') || [])];
  const statBoxes = [...(sceneBy.workspace?.querySelectorAll('.ws-stat') || [])];
  const networkNodes = [...(sceneBy.workspace?.querySelectorAll('.network svg>circle') || [])];
  const reveal = (el, alpha) => {
    if (!el) return;
    const v = clamp(alpha);
    el.style.setProperty('--m5-appear', v.toFixed(3));
    el.style.setProperty('--m5-shift', `${((1-v)*19).toFixed(2)}px`);
  };
  const focus = (items, idx) => items.forEach((item, i) => item.classList.toggle('m5-focus', i === idx));
  const set = (node, name, value) => node?.style.setProperty(name, String(value));

  function paintParticles(p) {
    const section = sceneBy.particles;
    const upper = smooth(.02, .19, p) * fadeOut(p, .94, 1);
    const lower = smooth(.38, .62, p) * fadeOut(p, .88, 1);
    set(section, '--m5-top-alpha', upper.toFixed(3));
    set(section, '--m5-top-shift', `${(-24*smooth(.44,.70,p)).toFixed(2)}px`);
    set(section, '--m5-bottom-alpha', lower.toFixed(3));
    set(section, '--m5-bottom-shift', `${((1-lower)*19).toFixed(2)}px`);
    set(section, '--m5-cloud-alpha', (.22+.7*smooth(.12,.36,p)*fadeOut(p,.75,.99)).toFixed(3));
    set(section, '--m5-cloud-scale', (.93+.10*smooth(.08,.73,p)).toFixed(3));
    set(section, '--m5-core-alpha', (smooth(.18,.46,p)*fadeOut(p,.88,1)).toFixed(3));
    sceneBy.particles.querySelectorAll('.orbital-intro .reveal').forEach((el,i) => reveal(el, upper*smooth(.02+i*.04,.17+i*.05,p)));
    sceneBy.particles.querySelectorAll('.bottom-intro .reveal').forEach((el,i) => reveal(el, lower*smooth(.36+i*.06,.56+i*.06,p)));
  }
  function paintContrast(p) {
    const section = sceneBy.contrast;
    const stay = fadeOut(p,.88,1);
    contrastLines.forEach((el,i) => {
      const v=smooth(.06+i*.13,.30+i*.14,p)*stay;
      set(el,'--m5-line-alpha',v.toFixed(3));
      set(el,'--m5-line-shift',`${((1-v)*23).toFixed(2)}px`);
    });
    compareCards.forEach((el,i)=>reveal(el,smooth(.32+i*.18,.57+i*.15,p)*stay));
    reveal(section.querySelector('.mode-switch'), smooth(.08,.27,p)*stay);
  }
  function paintWorkspace(p) {
    const section=sceneBy.workspace;
    const show=smooth(.12,.40,p);
    const leave=fadeOut(p,.90,1);
    reveal(section.querySelector('.workspace-copy'),smooth(.04,.28,p)*leave);
    reveal(section.querySelector('.workspace-mini'),show*leave);
    set(section,'--m5-ws-scale',(.955+.045*show).toFixed(3));
    set(section,'--m5-ws-shift',`${((1-show)*18).toFixed(2)}px`);
    const path=smooth(.31,.79,p);
    set(section,'--m5-network-offset',(1-path).toFixed(3));
    networkNodes.forEach((node,i)=>{
      const k=smooth(.24+i*.085,.42+i*.085,p);
      node.style.opacity=(.18+.82*k).toFixed(3);
    });
    focus(statBoxes, p<.43?0:p<.7?1:2);
  }
  const painters={particles:paintParticles,contrast:paintContrast,workspace:paintWorkspace};
  let enabled=false, pending=false;
  function paint() {
    pending=false;
    if (!enabled) return;
    const viewport=window.innerHeight;
    for (const item of scenes) {
      const rect=item.runway.getBoundingClientRect();
      if (rect.bottom < -viewport*.2 || rect.top > viewport*1.2) continue;
      const room=Math.max(1,item.runway.offsetHeight-viewport);
      const p=clamp(-rect.top/room);
      item.progress=p;
      item.scene.dataset.m5Phase=p<.24?'enter':p<.58?'build':p<.86?'hold':'exit';
      painters[item.key](p);
    }
  }
  const requestPaint=()=>{if(!pending){pending=true;requestAnimationFrame(paint);}};
  const mode=()=>{
    enabled=!reduced.matches&&!compact.matches;
    document.documentElement.classList.toggle('m5-motion',enabled);
    if(enabled) requestPaint();
    else {
      scenes.forEach(({scene})=>{delete scene.dataset.m5Phase;});
      focus(statBoxes,-1);
    }
  };
  mode();
  window.addEventListener('scroll',requestPaint,{passive:true});
  window.addEventListener('resize',()=>{mode();requestPaint();},{passive:true});
  reduced.addEventListener('change',mode);
  compact.addEventListener('change',mode);
})();
