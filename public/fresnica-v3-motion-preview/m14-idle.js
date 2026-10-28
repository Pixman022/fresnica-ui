/* M14: keep each current chapter's content alive while wheel-snapped.
 * A single visible-scene flag scopes the independent CSS loops. M5/M6/M10
 * keep ownership of scroll progress; no Hero shader or full-scene animation changes. */
(() => {
  'use strict';
  const scroller=document.getElementById('v3-page-scroll');
  const frame=document.getElementById('v3-page-frame');
  if (!scroller || !frame) return;
  const ids=['overview','v3-ecosystem','v3-availability','v3-features',
    'v3-assets','v3-for-you','v3-workspace','v3-paths','v3-clarity','v3-about'];
  const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const eligible=()=>!reduced.matches&&!document.hidden;
  const root=document.documentElement;
  let current=null, pending=false, signalFrame=0;
  const svg=document.querySelector('#v3-workspace .network svg');
  const svgNS='http://www.w3.org/2000/svg';
  let signal=null;
  if(svg){
    signal=document.createElementNS(svgNS,'circle');
    signal.classList.add('m14-network-signal');
    signal.setAttribute('r','4.1');
    signal.setAttribute('fill','#10b981');
    signal.setAttribute('opacity','0');
    signal.setAttribute('aria-hidden','true');
    svg.append(signal);
  }
  function visibleScene(){
    const bounds=scroller.getBoundingClientRect();
    const x=bounds.left+bounds.width*.50, y=bounds.top+bounds.height*.51;
    for(const el of document.elementsFromPoint(x,y)){
      const section=el.closest?.('.stage,.chapter,.feature-scroll');
      if(section && sections.includes(section))return section;
    }
    // Fallback for a center covered by an overlay: select the scene exposing
    // the greatest portion of the page canvas, not the nearest runway top.
    let winner=null,area=0;
    for(const section of sections){
      const r=section.getBoundingClientRect();
      const shown=Math.max(0,Math.min(r.bottom,bounds.bottom)-Math.max(r.top,bounds.top))
        *Math.max(0,Math.min(r.right,bounds.right)-Math.max(r.left,bounds.left));
      if(shown>area){area=shown;winner=section;}
    }
    return winner;
  }
  function selectedPath(){
    const workspace=document.getElementById('v3-workspace');
    const groups=[...svg?.querySelectorAll('.m6-network-layer > g') || []];
    const index=Math.max(0,Math.min(groups.length-1,(Number(workspace?.dataset.m6NetworkStep)||1)-1));
    return [...groups[index]?.querySelectorAll('path')||[]].filter(path=>path.getTotalLength()>0);
  }
  function packet(now){
    signalFrame=0;
    if(!signal||current?.id!=='v3-workspace'||!eligible()){
      if(signal)signal.setAttribute('opacity','0');
      return;
    }
    const paths=selectedPath();
    const fallback=svg.querySelector('polyline');
    if(!paths.length && fallback)paths.push(fallback);
    if(paths.length){
      const cycle=(now%6100)/6100;
      const position=cycle*paths.length;
      const path=paths[Math.min(paths.length-1,Math.floor(position))];
      const length=path.getTotalLength();
      const point=path.getPointAtLength(length*(position%1));
      signal.setAttribute('cx',point.x.toFixed(2));
      signal.setAttribute('cy',point.y.toFixed(2));
      signal.setAttribute('opacity','1');
    }
    signalFrame=requestAnimationFrame(packet);
  }

  // M21: irregular, downward-travelling electrical signals. Only schedule
  // while screen 2 is visible; stop immediately on scene change/hidden/reduce.
  const ecosystemSpine=document.querySelector('#v3-ecosystem .particle-spine');
  let currentTimer=0;
  function stopCurrent(){
    clearTimeout(currentTimer);currentTimer=0;
    ecosystemSpine?.classList.remove('m21-flowing');
  }
  function scheduleCurrent(){
    if(!ecosystemSpine||currentTimer||current?.id!=='v3-ecosystem'||!eligible())return;
    currentTimer=setTimeout(()=>{
      currentTimer=0;
      if(current?.id!=='v3-ecosystem'||!eligible())return;
      ecosystemSpine.classList.add('m21-flowing');
      currentTimer=setTimeout(()=>{
        currentTimer=0;
        ecosystemSpine.classList.remove('m21-flowing');
        scheduleCurrent();
      },680);
    },2300+Math.random()*5000);
  }
  function refresh(){
    pending=false;
    const next=eligible()?visibleScene():null;
    if(current!==next){
      if(current)current.classList.remove('m14-current');
      current=next;
      if(current)current.classList.add('m14-current');
    }
    root.classList.toggle('m14-motion',eligible());
    root.dataset.m14Active=current?.id||'';
    if(current?.id==='v3-ecosystem'&&eligible())scheduleCurrent();
    else if(currentTimer||ecosystemSpine?.classList.contains('m21-flowing'))stopCurrent();
    if(current?.id==='v3-workspace'&&eligible()){
      if(!signalFrame)signalFrame=requestAnimationFrame(packet);
    }else if(signalFrame){
      cancelAnimationFrame(signalFrame);signalFrame=0;
      if(signal)signal.setAttribute('opacity','0');
    }
  }
  const request=()=>{if(!pending){pending=true;requestAnimationFrame(refresh);}};
  scroller.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',request,{passive:true});
  reduced.addEventListener('change',request);
  document.addEventListener('visibilitychange',request);
  request();
})();
