#!/usr/bin/env node
// Reproducible Chromium software-rendering baseline for four V3 animated scenes.
// Observational only: does not set arbitrary FPS budgets or claim real GPU results.
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const dest=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-browser');
const sampleMs=1600;
const scenes=[
  {id:'overview',label:'hero sphere',fraction:.46},
  {id:'v3-ecosystem',label:'ecosystem particles',fraction:.76},
  {id:'v3-for-you',label:'audience carousel',fraction:.46},
  {id:'v3-security',label:'security particles',fraction:.46}
];
const observations=[],failures=[];
fs.mkdirSync(dest,{recursive:true});
const browser=await chromium.launch({headless:true,
  ...(process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
  args:['--no-sandbox','--disable-dev-shm-usage']});
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const metrics=async client=>{
  const result=await client.send('Performance.getMetrics');
  return Object.fromEntries(result.metrics.map(entry=>[entry.name,entry.value]));
};
const difference=(a,b,key)=>Number(((b[key]-a[key])*1000).toFixed(1));
try{
  for(const motion of ['no-preference','reduce']){
    const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:motion});
    await context.addInitScript(()=>{
      const original=window.requestAnimationFrame.bind(window);
      const state={scheduled:0,executed:0,cancelled:0,callbackMs:0,
        maxCallbackMs:0,ticks:[],longTasks:[],longTaskSupported:false};
      window.__v3PerfState=state;
      window.requestAnimationFrame=callback=>{
        state.scheduled++;
        return original(stamp=>{
          const start=performance.now();
          try{return callback(stamp);}
          finally{
            const ms=performance.now()-start;
            state.executed++;
            state.callbackMs+=ms;
            state.maxCallbackMs=Math.max(state.maxCallbackMs,ms);
            if(state.ticks.at(-1)!==stamp)state.ticks.push(stamp);
          }
        });
      };
      const cancel=window.cancelAnimationFrame.bind(window);
      window.cancelAnimationFrame=id=>{state.cancelled++;return cancel(id);};
      window.__v3PerfReset=()=>{
        state.scheduled=state.executed=state.cancelled=state.callbackMs=state.maxCallbackMs=0;
        state.ticks=[];state.longTasks=[];return performance.now();
      };
      try{
        const observer=new PerformanceObserver(list=>{
          for(const task of list.getEntries())
            state.longTasks.push({at:task.startTime,ms:task.duration});
        });
        observer.observe({entryTypes:['longtask']});
        state.longTaskSupported=true;
      }catch{}
    });
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const client=await context.newCDPSession(page);
    await client.send('Performance.enable');
    try{
      await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
        document.getElementById('v3-page-scroll')&&document.getElementById('v3-security'),
        null,{timeout:15000});
      for(const scene of scenes){
        const layout=await page.evaluate(({id,fraction})=>{
          const scroll=document.getElementById('v3-page-scroll');
          const section=document.getElementById(id);
          const run=[...scroll.children].find(el=>
            el.matches('.v3-screen-runway,.m5-runway,.feature-scroll,.stage,.chapter')&&
            (el.dataset.sceneId||el.querySelector('.stage,.chapter')?.id||el.id)===id);
          if(!run||!section)return null;
          const root=scroll.getBoundingClientRect();
          const top=scroll.scrollTop+run.getBoundingClientRect().top-root.top;
          const room=Math.max(0,run.offsetHeight-scroll.clientHeight);
          const target=Math.max(0,Math.min(scroll.scrollHeight-scroll.clientHeight,top+room*fraction));
          const previous=scroll.style.scrollBehavior;
          scroll.style.scrollBehavior='auto';
          scroll.scrollTop=target;
          scroll.style.scrollBehavior=previous;
          return {target,room};
        },scene);
        assert(layout,motion+' missing scene '+scene.id);
        await page.waitForTimeout(550);
        const visible=await page.evaluate(id=>{
          const scroll=document.getElementById('v3-page-scroll').getBoundingClientRect();
          const rect=document.getElementById(id).getBoundingClientRect();
          const overlap=Math.max(0,Math.min(rect.bottom,scroll.bottom)-Math.max(rect.top,scroll.top));
          return {overlap,active:document.documentElement.dataset.m14Active||'',
            cssRunning:document.getElementById(id).getAnimations({subtree:true})
              .filter(animation=>animation.playState==='running').length,
            canvases:document.getElementById(id).querySelectorAll('canvas').length};
        },scene.id);
        assert(visible.overlap>80,motion+' scene is not visible: '+scene.id+' '+JSON.stringify(visible));
        if(motion==='no-preference')assert(visible.active===scene.id,
          scene.id+' active scene mismatch: '+visible.active);
        await page.evaluate(()=>window.__v3PerfReset());
        const before=await metrics(client);
        const started=Date.now();
        await page.waitForTimeout(sampleMs);
        const after=await metrics(client);
        const raf=await page.evaluate(()=>{
          const s=window.__v3PerfState;
          const ticks=s.ticks;
          const intervals=ticks.slice(1).map((t,i)=>t-ticks[i]);
          return {scheduled:s.scheduled,executed:s.executed,cancelled:s.cancelled,
            callbackMs:Number(s.callbackMs.toFixed(1)),
            maxCallbackMs:Number(s.maxCallbackMs.toFixed(2)),
            animationTicks:ticks.length,
            meanTickIntervalMs:intervals.length?
              Number((intervals.reduce((a,b)=>a+b,0)/intervals.length).toFixed(1)):null,
            longTasks:s.longTasks.length,
            longTaskMs:Number(s.longTasks.reduce((sum,t)=>sum+t.ms,0).toFixed(1)),
            longTaskSupported:s.longTaskSupported};
        });
        const elapsed=Date.now()-started;
        observations.push({motion,scene:scene.id,label:scene.label,elapsedMs:elapsed,
          raf:{...raf,callbacksPerSec:Number((raf.executed/(elapsed/1000)).toFixed(1)),
            ticksPerSec:Number((raf.animationTicks/(elapsed/1000)).toFixed(1))},
          cpu:{taskMs:difference(before,after,'TaskDuration'),
            scriptMs:difference(before,after,'ScriptDuration'),
            layoutMs:difference(before,after,'LayoutDuration')},
          heapMB:Number((after.JSHeapUsedSize/1048576).toFixed(1)),
          cssRunning:visible.cssRunning,canvases:visible.canvases});
        console.log('[V3 perf] '+motion+' '+scene.id+' RAF='+raf.executed+
          ' tick/s='+(raf.animationTicks/(elapsed/1000)).toFixed(1)+
          ' taskMs='+difference(before,after,'TaskDuration'));
      }
      assert(errors.length===0,motion+' page errors: '+errors.join(' | '));
    }finally{await page.close();await context.close();}
  }
}catch(error){failures.push(String(error.stack||error));console.error('[V3 perf] '+String(error.message||error));}
finally{await browser.close();}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),
  url:base,environment:'Chromium headless 1440x900; software or runner GPU rendering is not physical-device telemetry',
  scope:'Four scenes, normal and reduced motion, ~1.6s per scene; RAF callbacks and ticks, CSS animations, CDP main-thread task time, heap',
  limitations:'Instrumentation adds overhead; RAF ticks are not GPU FPS, TaskDuration is not CPU utilization, and heap is not total memory. No regression thresholds or GPU sign-off.',
  observations,failures};
fs.writeFileSync(path.join(dest,'performance-baseline.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 perf] '+report.status+' samples='+observations.length);
if(failures.length)process.exitCode=1;
