/* Fresnica V3 M13 — fast snap-to-complete scenes and auto audience carousel. */
(() => {
  'use strict';
  const scroller=document.getElementById('v3-page-scroll');
  const frame=document.getElementById('v3-page-frame');
  const audience=document.getElementById('audience-track');
  if(!scroller || !frame)return;
  const core=document.querySelector('#v3-ecosystem .ecosystem-core');
  const vectorNS='http://www.w3.org/2000/svg';
  const portal=document.createElementNS(vectorNS,'svg');
  portal.classList.add('m24-portal');
  portal.setAttribute('aria-hidden','true');
  const portalCircle=document.createElementNS(vectorNS,'circle');
  portalCircle.setAttribute('r','4.5');
  portalCircle.setAttribute('fill','#0bbd81');
  portal.append(portalCircle);
  frame.append(portal);
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
        const fraction=id==='v3-ecosystem'?.76:id==='v3-workspace'?.77:
          id==='v3-features'?.47:el.classList.contains('m5-runway')?.73:.46;
        return {id,top:clamp(top+room*fraction,0,max)};
      }).sort((a,b)=>a.top-b.top);
  }
  function cancel(){
    wheelGeneration++;
    if(anim)cancelAnimationFrame(anim);
    anim=0;locked=false;wheelSum=0;wheelDirection=0;lastWheel=0;
    scroller.style.scrollBehavior='';
    portal.style.display='none';
    portal.style.opacity='';
    document.documentElement.classList.remove('m24-transitioning');
  }
  function animateTo(destination){
    if(locked)return;
    const from=scroller.scrollTop,dist=destination-from;
    if(Math.abs(dist)<2)return;
    const duration=clamp(710+Math.abs(dist)*.14,860,1180);
    const begun=performance.now(),gen=++wheelGeneration;
    locked=true;
    const initial=scroller.style.scrollBehavior;
    scroller.style.scrollBehavior='auto';
    function paint(now){
      if(gen!==wheelGeneration)return;
      const t=clamp((now-begun)/duration,0,1);
      const eased=t<.5?8*t*t*t*t:1-Math.pow(-2*t+2,4)/2;
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

  // Screen 02 -> 03: the actual green core grows, turns instantly dark, then
  // expands into the dark download scene. Swap scroll positions while covered.
  function morphToDownload(destination){
    if(locked||!core){animateTo(destination);return;}
    const bounds=frame.getBoundingClientRect();
    const point=core.getBoundingClientRect();
    const x=point.left+point.width/2-bounds.left;
    const y=point.top+point.height/2-bounds.top;
    const far=Math.hypot(Math.max(x,bounds.width-x),Math.max(y,bounds.height-y));
    const cover=far*1.1;
    const duration=960;
    const begun=performance.now(),gen=++wheelGeneration;
    const initial=scroller.style.scrollBehavior;
    let jumped=false,revealed=false;
    locked=true;
    scroller.style.scrollBehavior='auto';
    document.documentElement.classList.add('m24-transitioning');
    portal.setAttribute('viewBox','0 0 '+bounds.width+' '+bounds.height);
    portalCircle.setAttribute('cx',x.toFixed(2));
    portalCircle.setAttribute('cy',y.toFixed(2));
    portalCircle.setAttribute('r','4.5');
    portalCircle.setAttribute('fill','#0bbd81');
    portal.style.display='block';
    portal.style.opacity='1';
    function paint(now){
      if(gen!==wheelGeneration)return;
      const t=clamp((now-begun)/duration,0,1);
      let radius;
      if(t<.24){
        const a=t/.24;
        const ease=a*a*(3-2*a);
        radius=4.5*(1+5.2*ease);
      }else{
        portalCircle.setAttribute('fill','#101312');
        const a=clamp((t-.24)/.30,0,1);
        radius=27.9+(cover-27.9)*Math.pow(a,2.25);
      }
      portalCircle.setAttribute('r',radius.toFixed(2));
      if(t>=.55&&!jumped){
        jumped=true;
        scroller.scrollTop=destination;
      }
      if(t>=.62&&!revealed){
        revealed=true;
        document.documentElement.classList.remove('m24-transitioning');
      }
      if(t>.72){
        const a=clamp((t-.72)/.28,0,1);
        portal.style.opacity=String(1-a*a*(3-2*a));
      }
      if(t<1)anim=requestAnimationFrame(paint);
      else{
        anim=0;
        portal.style.display='none';
        portal.style.opacity='';
        scroller.style.scrollBehavior=initial;
        lockUntil=performance.now()+110;
        locked=false;wheelSum=0;wheelDirection=0;lastWheel=0;
        document.documentElement.classList.remove('m24-transitioning');
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
    if(sign>0&&all[at].id==='v3-ecosystem'&&all[next].id==='v3-availability'){
      morphToDownload(all[next].top);
    }else animateTo(all[next].top);
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
    // The shared corner control returns to the actual scroll origin, not the
    // usual cinematic Hero hold frame positioned inside its sticky runway.
    cancel();animateTo(link.classList.contains('back-to-top')?0:target.top);
    history.replaceState(null,'','#'+encodeURIComponent(id));
  },true);
  reduced.addEventListener('change',cancel);
  compact.addEventListener('change',cancel);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&portal.style.display==='block')cancel();
  });
  window.addEventListener('resize',()=>{
    if(portal.style.display==='block')cancel();
  },{passive:true});

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
