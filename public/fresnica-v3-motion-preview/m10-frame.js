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
  const backTop=document.createElement('a');
  backTop.className='back-to-top';
  backTop.href='#overview';
  backTop.setAttribute('aria-label','Back to top');
  backTop.setAttribute('title','Back to top');
  backTop.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg><span>Back to top</span>';
  backTop.hidden=true;
  viewport.append(backTop);
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
      section.id === 'v3-about' ? '88dvh' : '148dvh');
    runway.append(section);
    scroller.append(runway);
    plain.push({section, runway});
  }
  document.documentElement.classList.add('m10-framed');

  // The compact desktop mockup occupies the lower mobile viewport. Avoid
  // covering its controls, including in reduced-motion mode where M14 has
  // no active scene marker. The fixed brand link remains a home shortcut.
  const workspace=document.getElementById('v3-workspace');
  if(workspace){
    const observer=new IntersectionObserver(([entry])=>{
      backTop.classList.toggle('v3-over-workspace',entry.isIntersecting);
    },{root:scroller});
    observer.observe(workspace);
  }

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
      const enter = section === hero || section.id === 'v3-about' ? 1 : (.84+.16*smooth(0,.15,progress));
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
    backTop.hidden=scroller.scrollTop<scroller.clientHeight*.7;
    window.dispatchEvent(new Event('scroll'));
    requestPaint();
  }, {passive:true});
  reduced.addEventListener('change', mode);
  compact.addEventListener('change', mode);
  window.addEventListener('resize', () => {mode();requestPaint();}, {passive:true});

  // Browser anchor navigation should target the actual section runway, even
  // when the section itself is currently sticky and already visible.
  function jump(target, immediate = false) {
    if (!target) return;
    const runway = target.closest('.v3-screen-runway, .m5-runway, .feature-scroll');
    const anchor = runway || target;
    const top = scroller.scrollTop + anchor.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top;
    scroller.scrollTo({top,behavior:immediate||reduced.matches?'instant':'smooth'});
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

  // Reparenting the full-page scenes into a new scroll container must not
  // inherit a stale browser scroll position. Deep links are handled below.
  if ('scrollRestoration' in history) history.scrollRestoration='manual';
  const resetUnaddressedEntry=()=>{
    if(location.hash || window.__v3InitialAnchor)return;
    const behavior=scroller.style.scrollBehavior;
    scroller.style.scrollBehavior='auto';
    scroller.scrollTop=0;
    scroller.style.scrollBehavior=behavior;
  };
  resetUnaddressedEntry();
  // Browser scroll restoration and late fonts can move a nested scroller
  // after our DOM reparenting. Only correct an untouched, hash-free entry.
  let userNavigated=false;
  const markUserNavigation=()=>{userNavigated=true;};
  for(const type of ['wheel','touchstart','pointerdown','keydown'])
    viewport.addEventListener(type,markUserNavigation,{passive:true,once:true});
  const settleCleanEntry=()=>{
    if(userNavigated)return;
    resetUnaddressedEntry();
    requestAnimationFrame(()=>{
      if(!userNavigated)resetUnaddressedEntry();
    });
  };
  window.addEventListener('load',settleCleanEntry,{once:true});
  window.addEventListener('pageshow',settleCleanEntry,{once:true});
  mode();
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));
  const initialSection=window.__v3InitialAnchor ||
    (location.hash?decodeURIComponent(location.hash.slice(1)):'');
  if (initialSection && (compact.matches || reduced.matches)) {
    const target=document.getElementById(initialSection);
    if (target) requestAnimationFrame(() => jump(target,true));
  }
  // The real scroll owner is this nested viewport. Chrome can restore a
  // fragment to the start of a sticky M5 runway, where scene-two copy is
  // intentionally invisible. Correct it here rather than relying on a later
  // scene-navigation script being ready during the first page load.
  function alignChapterHold(id){
    const section=document.getElementById(id);
    const runway=section?.closest('.v3-screen-runway,.m5-runway,.feature-scroll');
    if(!runway)return;
    if(compact.matches || reduced.matches){jump(section,true);return;}
    const frame=scroller.getBoundingClientRect();
    const start=scroller.scrollTop+runway.getBoundingClientRect().top-frame.top;
    const room=Math.max(0,runway.offsetHeight-scroller.clientHeight);
    const fraction=id==='v3-ecosystem'?.76:
      id==='v3-workspace'?.77:
      id==='v3-features'?.47:
      runway.classList.contains('m5-runway')?.73:.46;
    const max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
    const destination=id==='overview'?0:Math.max(0,Math.min(max,start+room*fraction));
    const saved=scroller.style.scrollBehavior;
    scroller.style.scrollBehavior='auto';
    scroller.scrollTop=destination;
    scroller.style.scrollBehavior=saved;
    (window.__v3FrameAnchorTrace ||= []).push({
      expected:Math.round(destination),actual:Math.round(scroller.scrollTop),
      room:Math.round(room),section:id
    });
    window.dispatchEvent(new Event('scroll'));
  }
  if(initialSection && !compact.matches && !reduced.matches){
    const settleFragment=()=>{if(!userNavigated)alignChapterHold(initialSection);};
    requestAnimationFrame(settleFragment);
    window.addEventListener('pageshow',()=>{
      requestAnimationFrame(settleFragment);
      for(const delay of [90,240,520])setTimeout(settleFragment,delay);
    },{once:true});
  }
  // A fragment-only navigation does NOT reload the document, so startup code
  // never runs. Browser-native anchoring lands at progress=0 (hidden copy).
  window.addEventListener('hashchange',()=>{
    const id=decodeURIComponent(location.hash.slice(1));
    if(!id||!document.getElementById(id))return;
    userNavigated=true; // prevent stale startup corrections from overriding it
    requestAnimationFrame(()=>alignChapterHold(id));
  });
})();
