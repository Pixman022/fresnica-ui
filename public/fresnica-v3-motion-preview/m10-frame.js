/* Fresnica V3 M10: one rounded browser-page canvas and scroll-driven screen changes.
 * Progressive enhancement only; approved Hero WebGL and M5–M7 product motion unchanged. */
(() => {
  'use strict';
  const hero = document.getElementById('overview');
  const header = document.querySelector('.site-header');
  if (!hero || !header || document.getElementById('v3-page-scroll')) return;

  const viewport = document.createElement('div');
  viewport.id = 'v3-page-frame';
  viewport.className = 'v3-page-frame';
  viewport.setAttribute('aria-label', 'Fresnica website');
  const scroller = document.createElement('div');
  scroller.id = 'v3-page-scroll';
  scroller.className = 'v3-page-scroll';
  scroller.tabIndex = -1;

  // M5 has already wrapped five pinned chapters. Preserve those runways exactly.
  const chapters = [...document.body.children].filter(node =>
    node.matches?.('.stage, .chapter, .m5-runway, .feature-scroll'));
  if (!chapters.length) return;
  document.body.insertBefore(viewport, chapters[0]);
  viewport.append(header, scroller);
  const plain = [];
  for (const section of chapters) {
    if (section.matches('.m5-runway, .feature-scroll')) {
      scroller.append(section);
      continue;
    }
    const runway = document.createElement('div');
    runway.className = 'v3-screen-runway';
    runway.dataset.sceneId = section.id;
    section.classList.add('v3-plain-screen');
    // Make long scenes long enough to breathe while keeping the screen itself fixed.
    runway.style.setProperty('--v3-runway',
      section.id === 'overview' ? '145dvh' :
      section.id === 'v3-about' ? '155dvh' : '148dvh');
    runway.append(section);
    scroller.append(runway);
    plain.push({section, runway});
  }
  document.documentElement.classList.add('m10-framed');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 680px)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = (a,b,value) => {
    const v = clamp((value-a)/(b-a));
    return v*v*(3-2*v);
  };
  let pending = false;
  let enabled = false;
  const paint = () => {
    pending = false;
    if (!enabled) return;
    const frame = scroller.getBoundingClientRect();
    for (const {section, runway} of plain) {
      const r = runway.getBoundingClientRect();
      if (r.bottom < frame.top-30 || r.top > frame.bottom+30) continue;
      const travel = Math.max(1, runway.offsetHeight-scroller.clientHeight);
      const progress = clamp((frame.top-r.top)/travel);
      const enter = section === hero ? 1 : (.84+.16*smooth(0,.15,progress));
      const exit = section.id === 'v3-about' ? 1 : 1-.48*smooth(.78,1,progress);
      section.style.setProperty('--v3-screen-alpha', (enter*exit).toFixed(3));
      section.style.setProperty('--v3-screen-shift',
        `${(13*(1-enter)-19*smooth(.80,1,progress)).toFixed(2)}px`);
      section.dataset.screenPhase = progress<.18?'enter':progress<.79?'hold':'exit';
    }
  };
  const requestPaint = () => {
    if (!pending) {pending = true;requestAnimationFrame(paint);}
  };
  const mode = () => {
    enabled = !reduced.matches && !compact.matches;
    document.documentElement.classList.toggle('m10-scenes', enabled);
    if (!enabled) for (const {section} of plain) {
      section.style.removeProperty('--v3-screen-alpha');
      section.style.removeProperty('--v3-screen-shift');
      delete section.dataset.screenPhase;
    }
    requestPaint();
  };
  // Existing M1–M7 scroll scripts listen to window. Keep them working while
  // the real scroll now belongs to the bounded page canvas.
  scroller.addEventListener('scroll', () => {
    window.dispatchEvent(new Event('scroll'));
    requestPaint();
  }, {passive:true});
  reduced.addEventListener('change', mode);
  compact.addEventListener('change', mode);
  window.addEventListener('resize', () => {mode();requestPaint();}, {passive:true});

  // Browser anchor navigation should target the actual section runway, even
  // when the section itself is currently sticky and already visible.
  function jump(target) {
    if (!target) return;
    const runway = target.closest('.v3-screen-runway, .m5-runway, .feature-scroll');
    const anchor = runway || target;
    const top = scroller.scrollTop + anchor.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top;
    scroller.scrollTo({top,behavior:reduced.matches?'instant':'smooth'});
  }
  viewport.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    jump(target);
    history.replaceState(null,'','#'+encodeURIComponent(id));
  });

  mode();
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));
  if (location.hash) {
    const id=decodeURIComponent(location.hash.slice(1));
    const target=document.getElementById(id);
    if (target) requestAnimationFrame(() => jump(target));
  }
})();
