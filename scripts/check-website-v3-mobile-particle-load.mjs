#!/usr/bin/env node
// Observational mobile Chromium baseline for the restored screen-two CSS particles.
// Headless runner timings are NOT physical-device FPS, GPU load or power measurements.
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const output=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-browser');
fs.mkdirSync(output,{recursive:true});
const samples=[],failures=[];
const browser=await chromium.launch({headless:true,
  ...(process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
  args:['--no-sandbox','--disable-dev-shm-usage']});
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const readMetrics=async client=>Object.fromEntries(
  (await client.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
const ms=(a,b,key)=>Number(((b[key]-a[key])*1000).toFixed(1));
try{
  for(const motion of ['no-preference','reduce']){
    const context=await browser.newContext({viewport:{width:393,height:852},
      deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:motion});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    try{
      await page.goto(base,{waitUntil:'load',timeout:45000});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
        document.querySelectorAll('#v3-ecosystem .stream-dot').length===136);
      await page.evaluate(()=>document.getElementById('v3-ecosystem')
        .scrollIntoView({block:'center',behavior:'instant'}));
      await page.waitForTimeout(650);
      const state=await page.evaluate(()=>{
        const dot=document.querySelector('#v3-ecosystem .stream-dot');
        const style=getComputedStyle(dot);
        return {count:document.querySelectorAll('#v3-ecosystem .stream-dot').length,
          name:style.animationName,playState:style.animationPlayState,
          current:document.documentElement.dataset.m14Active,
          noWebGL:document.getElementById('orb-canvas').style.display==='none'};
      });
      assert(state.noWebGL&&state.count===136,motion+' changed mobile density/WebGL '+JSON.stringify(state));
      if(motion==='reduce')assert(state.name==='none',motion+' is not static '+JSON.stringify(state));
      else assert(state.name==='ecosystem-mobile-stream-in'&&state.playState==='running'&&
        state.current==='v3-ecosystem','Mobile dot motion not running '+JSON.stringify(state));
      const client=await context.newCDPSession(page);
      await client.send('Performance.enable');
      for(let take=1;take<=3;take++){
        const before=await readMetrics(client);
        const started=Date.now();
        await page.waitForTimeout(1600);
        const after=await readMetrics(client);
        samples.push({motion,take,elapsedMs:Date.now()-started,
          taskMs:ms(before,after,'TaskDuration'),
          scriptMs:ms(before,after,'ScriptDuration'),
          layoutMs:ms(before,after,'LayoutDuration'),
          heapMB:Number((after.JSHeapUsedSize/1048576).toFixed(1)),
          dotCount:state.count,animation:state.name});
        console.log('[V3 mobile particle load] '+motion+' take='+take+
          ' taskMs='+samples.at(-1).taskMs+' scriptMs='+samples.at(-1).scriptMs);
      }
      assert(errors.length===0,motion+' page errors: '+errors.join(' | '));
    }finally{await page.close();await context.close();}
  }
}catch(error){failures.push(String(error.stack||error));console.error('[V3 mobile particle load] '+error);}
finally{await browser.close();}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),url:base,
  environment:'Headless Chromium, mobile emulation 393x852 DPR 2, 136 CSS dots',
  scope:'Three 1.6-second observational holds per motion preference on mobile screen two',
  limitations:'TaskDuration is CDP main-thread task time, not CPU percent. ScriptDuration excludes compositor/GPU cost. Runner GPU, FPS, power, heat and real-device smoothness are NOT measured. Different CI runners can be noisy; no arbitrary pass thresholds.',
  samples,failures};
fs.writeFileSync(path.join(output,'mobile-particle-load.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 mobile particle load] '+report.status+' samples='+samples.length);
if(failures.length)process.exitCode=1;
