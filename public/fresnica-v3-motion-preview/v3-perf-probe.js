/* Fresnica V3 optional, local-only device timing probe.
 * Enabled by ?debug=perf after page load. No telemetry is transmitted.
 * rAF callback intervals are NOT rendered GPU FPS. */
(() => {
  'use strict';
  if(new URLSearchParams(location.search).get('debug')!=='perf')return;
  const scroller=document.getElementById('v3-page-scroll');
  if(!scroller)return;

  const style=document.createElement('style');
  style.textContent=
    '#v3-perf-panel{position:fixed;z-index:2000;left:12px;bottom:12px;width:min(252px,calc(100vw - 24px));box-sizing:border-box;padding:12px;border:1px solid #777;border-radius:10px;background:#222226;color:#f5f5f7;box-shadow:0 7px 28px #0003;font:12px/1.45 system-ui,sans-serif}' +
    '#v3-perf-panel h2{font:700 12px/1.4 system-ui,sans-serif;margin:0 0 5px;color:inherit}' +
    '#v3-perf-panel p{margin:5px 0;color:#d0d0d4}' +
    '#v3-perf-panel .v3-perf-actions{display:flex;gap:7px;margin:8px 0}' +
    '#v3-perf-panel button{flex:1;min-height:44px;padding:5px;border:1px solid #818188;border-radius:8px;background:#36363e;color:inherit;font:600 11px system-ui,sans-serif;cursor:pointer}' +
    '#v3-perf-panel button:disabled{opacity:.45;cursor:default}' +
    '#v3-perf-panel button:focus-visible{outline:2px solid #7cdfb0;outline-offset:2px}' +
    '#v3-perf-panel .v3-perf-note{font-size:10px;color:#c3c3c8}';
  document.head.append(style);

  const panel=document.createElement('section');
  panel.id='v3-perf-panel';
  panel.setAttribute('aria-label','Local device performance probe');
  panel.innerHTML='<h2>FRESNICA · DEVICE PERF</h2>' +
    '<p>Navigate to a scene, let it settle, then record for 15 seconds.</p>' +
    '<div class="v3-perf-actions"><button type="button" id="v3-perf-start">Record 15 s</button>' +
    '<button type="button" id="v3-perf-export" disabled>Export JSON</button></div>' +
    '<p id="v3-perf-status" role="status" aria-live="polite">No samples yet.</p>' +
    '<p class="v3-perf-note">Local only · rAF gaps are not GPU FPS.</p>';
  document.body.append(panel);
  const startButton=panel.querySelector('#v3-perf-start');
  const exportButton=panel.querySelector('#v3-perf-export');
  const status=panel.querySelector('#v3-perf-status');
  const samples=[];
  let recording=false;

  const round=value=>Number(value.toFixed(2));
  const percent=(sorted,fraction)=>sorted.length?round(sorted[Math.ceil(sorted.length*fraction)-1]):null;
  const heap=()=>typeof performance.memory?.usedJSHeapSize==='number'?
    round(performance.memory.usedJSHeapSize/1048576):null;
  function visibleScene(){
    const frame=scroller.getBoundingClientRect();
    let best='',area=0;
    for(const el of document.querySelectorAll('.stage,.chapter')){
      const r=el.getBoundingClientRect();
      const shown=Math.max(0,Math.min(r.bottom,frame.bottom)-Math.max(r.top,frame.top))*
        Math.max(0,Math.min(r.right,frame.right)-Math.max(r.left,frame.left));
      if(shown>area){area=shown;best=el.id;}
    }
    return best||'unknown';
  }
  function observe(type,durations,observers){
    if(typeof PerformanceObserver==='undefined'||
      !PerformanceObserver.supportedEntryTypes?.includes(type))return false;
    try{
      const observer=new PerformanceObserver(list=>{
        for(const entry of list.getEntries())durations.push(entry.duration);
      });
      observer.observe({type,buffered:false});
      observers.push({observer,durations});
      return true;
    }catch{return false;}
  }

  async function record(requestMs=15000){
    if(recording)return null;
    const durationMs=Math.max(250,Math.min(15000,Number(requestMs)||15000));
    recording=true;
    startButton.disabled=true;
    exportButton.disabled=true;
    status.textContent='Recording… keep the scene visible.';
    const sceneStart=visibleScene();
    const startMode=matchMedia('(prefers-reduced-motion: reduce)').matches?'reduce':'no-preference';
    const startTheme=document.documentElement.classList.contains('v3-theme-dark')?'dark':'light';
    const startedAt=new Date().toISOString();
    const t0=performance.now(),heapStartMB=heap();
    const intervals=[],tasks=[],longFrames=[],observers=[];
    const longTaskSupported=observe('longtask',tasks,observers);
    const longFrameSupported=observe('long-animation-frame',longFrames,observers);
    let previous=0,raf=0,wasHidden=document.hidden;
    const onVisibility=()=>{if(document.hidden)wasHidden=true;};
    document.addEventListener('visibilitychange',onVisibility);
    function tick(now){
      if(previous)intervals.push(now-previous);
      previous=now;
      raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
    await new Promise(resolve=>setTimeout(resolve,durationMs));
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange',onVisibility);
    for(const {observer,durations} of observers){
      for(const entry of observer.takeRecords())durations.push(entry.duration);
      observer.disconnect();
    }
    const elapsedMs=round(performance.now()-t0);
    const sorted=intervals.slice().sort((a,b)=>a-b);
    const sceneEnd=visibleScene();
    const sample={
      recordedAt:startedAt,scene:sceneStart,sceneEnd,
      theme:startTheme,language:document.documentElement.lang,
      motion:startMode,requestedMs:durationMs,elapsedMs,
      validHold:!wasHidden&&sceneStart===sceneEnd&&
        (matchMedia('(prefers-reduced-motion: reduce)').matches?'reduce':'no-preference')===startMode,
      rafScheduling:{
        intervals:intervals.length,meanIntervalMs:sorted.length?
          round(sorted.reduce((sum,n)=>sum+n,0)/sorted.length):null,
        p95IntervalMs:percent(sorted,.95),maxIntervalMs:sorted.length?round(sorted.at(-1)):null,
        gapsAbove33Ms:intervals.filter(ms=>ms>33.3).length,
        gapsAbove50Ms:intervals.filter(ms=>ms>50).length
      },
      longTasks:longTaskSupported?{
        count:tasks.length,totalMs:round(tasks.reduce((sum,n)=>sum+n,0)),
        maxMs:tasks.length?round(Math.max(...tasks)):0
      }:null,
      longAnimationFrames:longFrameSupported?{
        count:longFrames.length,maxMs:longFrames.length?round(Math.max(...longFrames)):0
      }:null,
      heapUsedMB:{start:heapStartMB,end:heap()}
    };
    samples.push(sample);
    status.textContent='Recorded '+samples.length+' sample(s) · '+
      (sample.validHold?'hold stable':'check scene/visibility')+
      ' · p95 rAF gap '+(sample.rafScheduling.p95IntervalMs??'n/a')+' ms';
    startButton.disabled=false;
    exportButton.disabled=false;
    recording=false;
    return sample;
  }
  function exportJson(){
    if(!samples.length)return;
    const result={
      schema:'fresnica-v3-device-probe-v1',
      caveat:'rAF scheduling is not GPU FPS; use browser/native profilers for final performance acceptance.',
      privacy:'Created locally by an opt-in debug control; not uploaded by Fresnica.',
      page:location.origin+location.pathname,
      environment:{
        userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight},
        dpr:devicePixelRatio,hardwareConcurrency:navigator.hardwareConcurrency||null,
        screen:{width:screen.width,height:screen.height}
      },
      samples
    };
    const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='fresnica-v3-device-perf-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  startButton.addEventListener('click',()=>{void record();});
  exportButton.addEventListener('click',exportJson);
  window.__v3PerfProbe={record,getSamples:()=>samples.slice(),exportJson};
})();
