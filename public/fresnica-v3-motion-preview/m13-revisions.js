/* Fresnica V3 M13 — fast snap-to-complete scenes and auto audience carousel. */
(() => {
  'use strict';
  const scroller=document.getElementById('v3-page-scroll');
  const frame=document.getElementById('v3-page-frame');
  const audience=document.getElementById('audience-track');
  if(!scroller || !frame)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const compact=matchMedia('(max-width: 680px)');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const snapEnabled=()=>!compact.matches&&!reduced.matches;
  let wheelSum=0,wheelDirection=0,lastWheel=0,anim=0,locked=false,lockUntil=0;
  let wheelGeneration=0;
  function stops(){
    const root=scroller.getBoundingClientRect();
    const max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
    return [...scroller.children].filter(el=>el.matches('.v3-screen-runway,.m5-runway,.feature-scroll'))
      .map(el=>{
        const id=el.dataset.sceneId || el.querySelector('.stage,.chapter')?.id || el.id;
        const top=scroller.scrollTop+el.getBoundingClientRect().top-root.top;
        const room=Math.max(0,el.offsetHeight-scroller.clientHeight);
        // Stable internal frames: text/cards visible, before any fade-out.
        const fraction=id==='v3-ecosystem'?.76:id==='v3-assets'?.78:
          id==='v3-workspace'?.77:id==='v3-paths'?.78:
          id==='v3-features'?.47:el.classList.contains('m5-runway')?.73:.46;
        return {id,top:clamp(top+room*fraction,0,max)};
      }).sort((a,b)=>a.top-b.top);
  }
  function cancel(){
    wheelGeneration++;
    if(anim)cancelAnimationFrame(anim);
    anim=0;locked=false;wheelSum=0;wheelDirection=0;lastWheel=0;
    scroller.style.scrollBehavior='';
  }
  function animateTo(destination){
    if(locked)return;
    const from=scroller.scrollTop,dist=destination-from;
    if(Math.abs(dist)<2)return;
    const duration=clamp(390+Math.abs(dist)*.085,440,680);
    const begun=performance.now(),gen=++wheelGeneration;
    locked=true;
    const initial=scroller.style.scrollBehavior;
    scroller.style.scrollBehavior='auto';
    function paint(now){
      if(gen!==wheelGeneration)return;
      const t=clamp((now-begun)/duration,0,1);
      const eased=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
      scroller.scrollTop=from+dist*eased;
      if(t<1)anim=requestAnimationFrame(paint);
      else{
        anim=0;scroller.scrollTop=destination;scroller.style.scrollBehavior=initial;
        // Ignore trackpad inertia from this same deliberate gesture.
        lockUntil=performance.now()+110;
        locked=false;wheelSum=0;wheelDirection=0;lastWheel=0;
      }
    }
    anim=requestAnimationFrame(paint);
  }
  function advance(sign){
    const all=stops();if(all.length<2)return;
    const y=scroller.scrollTop;
    let at=0,best=Infinity;
    all.forEach((stop,i)=>{const d=Math.abs(stop.top-y);if(d<best){best=d;at=i;}});
    const next=clamp(at+sign,0,all.length-1);
    if(at===next)return;
    animateTo(all[next].top);
  }
  // Capturing wheel events supersedes the earlier M12 bubble listener on desktop;
  // mobile, touch and reduced-motion continue to use their original native paths.
  frame.addEventListener('wheel',event=>{
    if(!snapEnabled()||!event.cancelable||event.ctrlKey||event.metaKey||event.shiftKey)return;
    if(Math.abs(event.deltaX)>Math.abs(event.deltaY)*1.25||!event.deltaY)return;
    if(event.target.closest('[data-native-wheel]'))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(locked||performance.now()<lockUntil)return;
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?scroller.clientHeight:1);
    const sign=Math.sign(delta),now=performance.now();
    if(now-lastWheel>380||wheelDirection!==sign)wheelSum=0;
    wheelDirection=sign;lastWheel=now;wheelSum+=delta;
    if(Math.abs(wheelSum)<74)return;
    wheelSum=0;advance(sign);
  },{capture:true,passive:false});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')cancel();});
  frame.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link || !snapEnabled() || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
    const id=decodeURIComponent(link.hash.slice(1));
    const target=stops().find(x=>x.id===id);
    if(!target)return;
    event.preventDefault();event.stopImmediatePropagation();
    cancel();animateTo(target.top);
    history.replaceState(null,'','#'+encodeURIComponent(id));
  },true);
  reduced.addEventListener('change',cancel);
  compact.addEventListener('change',cancel);

  if(!audience)return;
  const originals=[...audience.querySelectorAll('.audience-card')];
  if(!originals.length)return;
  let pausedUntil=0,focused=false,visible=false,lastFrame=0;
  const activate=()=>!reduced.matches&&!compact.matches&&visible&&!focused&&performance.now()>=pausedUntil;
  const pause=()=>{pausedUntil=performance.now()+4500;};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.48;},
    {root:scroller,threshold:[0,.48,.75]});
  observer.observe(audience.closest('.chapter')||audience);
  originals.forEach(card=>{
    const clone=card.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    clone.classList.add('m13-clone');
    audience.append(clone);
  });
  audience.classList.add('m13-auto');
  audience.addEventListener('focusin',()=>{focused=true;});
  audience.addEventListener('focusout',()=>{focused=false;pause();});
  audience.addEventListener('pointerdown',pause,{passive:true});
  document.getElementById('audience-prev')?.addEventListener('click',pause);
  document.getElementById('audience-next')?.addEventListener('click',pause);
  function loop(now){
    const dt=lastFrame?Math.min(50,now-lastFrame):0;lastFrame=now;
    if(activate()){
      const gap=parseFloat(getComputedStyle(audience).gap)||16;
      const unit=originals[0].getBoundingClientRect().width+gap;
      const period=unit*originals.length;
      if(period>0){
        audience.scrollLeft+=dt*.037;
        if(audience.scrollLeft>=period)audience.scrollLeft-=period;
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
