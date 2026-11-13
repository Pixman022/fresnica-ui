#!/usr/bin/env node
// Verify the M13 reel only requests frames when visible and allowed to animate.
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const source=fs.readFileSync('public/fresnica-v3-motion-preview/m13-revisions.js','utf8');
const dest=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-browser');
fs.mkdirSync(dest,{recursive:true});
const failures=[],observations=[];
const check=(ok,message)=>{if(!ok)failures.push(message);};
const browser=await chromium.launch({headless:true,
  ...(process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
  args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
page.on('pageerror',err=>failures.push('Browser error: '+err.message));
const cards=Array.from({length:5},(_,i)=>'<div class="audience-card" tabindex="0">'+i+'</div>').join('');
const fixture='<style>html,body{margin:0}#v3-page-frame{width:1440px;height:900px;overflow:hidden}'
  +'#v3-page-scroll{height:100%;overflow-y:auto;scroll-behavior:auto}'
  +'.chapter{height:900px;box-sizing:border-box;padding:30px}'
  +'#audience-track{display:flex;gap:16px;width:600px;overflow-x:auto;scroll-behavior:auto}'
  +'.audience-card{height:200px;flex:0 0 240px}</style>'
  +'<div id="v3-page-frame"><div id="v3-page-scroll">'
  +'<div class="v3-screen-runway"><section class="chapter" id="overview">Hero</section></div>'
  +'<div class="v3-screen-runway"><section class="chapter" id="v3-for-you"><div id="audience-track">'
  +cards+'</div></section></div>'
  +'<div class="v3-screen-runway"><section class="chapter" id="v3-security">Security</section></div>'
  +'</div></div>';
const read=()=>page.evaluate(()=>({frames:window.__carouselRafCount,
  left:document.getElementById('audience-track').scrollLeft,
  cards:document.querySelectorAll('.audience-card').length}));
const scroll=y=>page.evaluate(v=>{document.getElementById('v3-page-scroll').scrollTop=v;},y);
const sleep=ms=>page.waitForTimeout(ms);
const inactive=async(label)=>{await sleep(120);const a=await read();await sleep(350);
  const b=await read();check(b.frames-a.frames<=1,label+' still schedules frames');};
try{
  await page.setContent(fixture);
  await page.evaluate(()=>{window.__carouselRafCount=0;
    const original=window.requestAnimationFrame;
    window.requestAnimationFrame=function(callback){
      window.__carouselRafCount++;return original.call(window,callback);
    };
  });
  await page.addScriptTag({content:source});
  await sleep(400);
  const first=await read();observations.push({state:'initial',...first});
  check(first.frames===0,'Carousel schedules frames on the Hero screen');
  check(first.cards===10,'Carousel must preserve five originals and five clones');

  await scroll(900);await sleep(1150);
  const settled=await read();await sleep(400);
  const held=await read();
  observations.push({state:'first-card-hold',settled,held});
  check(Math.abs(settled.left-256)<=2&&Math.abs(held.left-settled.left)<=1,
    'Carousel did not move one whole card then hold: '+JSON.stringify({settled,held}));
  await sleep(1400);
  const active=await read();observations.push({state:'second-card-move',...active});
  check(active.frames>8&&active.left>held.left+80,
    'Carousel did not advance to the next card after a hold');

  await scroll(1800);await inactive('Offscreen carousel');
  await scroll(900);await sleep(300);
  await page.emulateMedia({reducedMotion:'reduce'});
  await inactive('Reduced-motion carousel');
  await page.emulateMedia({reducedMotion:'no-preference'});await sleep(250);
  const restored=await read();await sleep(300);
  check((await read()).frames-restored.frames>4,'Carousel did not resume after reduced-motion');

  await page.locator('.audience-card').first().focus();
  await inactive('Keyboard-focused carousel');
  await page.locator('.audience-card').first().blur();
  await inactive('Interaction-paused carousel');
  await sleep(4150);
  const unpaused=await read();await sleep(300);
  check((await read()).frames-unpaused.frames>4,'Carousel did not resume after the 4.5s pause');

  // A real pointer interaction can focus a native scroll container in some
  // browsers; it should resume after the timed pause, without a focusout.
  await page.evaluate(()=>{
    const reel=document.getElementById('audience-track');
    reel.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));
    reel.dispatchEvent(new FocusEvent('focusin',{bubbles:true}));
  });
  await inactive('Pointer-focused carousel');
  await sleep(4150);
  const pointerResumed=await read();await sleep(320);
  check((await read()).frames-pointerResumed.frames>4,
    'Pointer-focused carousel remained paused after the 4.5s delay');

  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
    document.dispatchEvent(new Event('visibilitychange'));});
  await inactive('Hidden-tab carousel');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});
    document.dispatchEvent(new Event('visibilitychange'));});
  await sleep(260);const shown=await read();await sleep(280);
  check((await read()).frames-shown.frames>4,'Carousel did not resume after tab visibility');
  observations.push({state:'final',...await read()});
}catch(error){failures.push(String(error.message||error));}
finally{await page.close();}
// The fixture above can pass even when the deployed scene stops moving while
// parked. Verify the real V3 scene across multiple frames and a loop boundary.
const previewPage=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
try{
  const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
  await previewPage.goto(new URL('#v3-for-you',base).href,{waitUntil:'load',timeout:45000});
  await previewPage.waitForFunction(()=>document.querySelectorAll('#audience-track .m13-clone').length===6,
    null,{timeout:9000});
  await previewPage.waitForTimeout(1600);
  const measure=()=>previewPage.evaluate(()=>{
    const reel=document.getElementById('audience-track');
    const chapter=document.getElementById('v3-for-you');
    const scroller=document.getElementById('v3-page-scroll');
    const root=scroller.getBoundingClientRect(),rect=chapter.getBoundingClientRect();
    const overlap=Math.max(0,Math.min(root.bottom,rect.bottom)-Math.max(root.top,rect.top));
    const first=reel.querySelector('.audience-card');
    return {
      left:reel.scrollLeft,max:reel.scrollWidth-reel.clientWidth,
      period:(first.getBoundingClientRect().width+(parseFloat(getComputedStyle(reel).gap)||16))*6,
      ratio:overlap/rect.height,chapterTop:rect.top,scrollTop:scroller.scrollTop,
      clones:reel.querySelectorAll('.m13-clone').length
    };
  });
  const history=[];
  for(let n=0;n<25;n++){
    history.push(await measure());
    await previewPage.waitForTimeout(250);
  }
  const unit=history[0].period/6;
  const changes=history.slice(1).map((v,i)=>v.left-history[i].left);
  const settledSteps=new Set(history.filter(v=>
    Math.abs(v.left-Math.round(v.left/unit)*unit)<=2)
    .map(v=>Math.round(v.left/unit)));
  observations.push({state:'real-stepped-hold',start:history[0],end:history.at(-1),
    pauses:changes.filter(d=>Math.abs(d)<=1).length,steps:[...settledSteps]});
  check(history[0].clones===6&&history[0].ratio>.48,
    'Real chapter not parked with six cloned cards: '+JSON.stringify(history[0]));
  check(changes.filter(d=>Math.abs(d)<=1).length>=6&&settledSteps.size>=2&&
    history.at(-1).left-history[0].left>=unit*1.3,
    'Real scene did not move full cards with pauses: '+JSON.stringify({history,changes}));
  check(history[0].max>=history[0].period+30,
    'Real carousel cannot reach its wrap point: '+JSON.stringify(history[0]));

  // Jump near the loop edge only while Reduced Motion disables automatic
  // movement, then check a complete final-card step and an invisible rewind.
  await previewPage.emulateMedia({reducedMotion:'reduce'});
  await previewPage.evaluate(({period,unit})=>{
    document.getElementById('audience-track').scrollLeft=period-unit;
  },{period:history[0].period,unit});
  await previewPage.emulateMedia({reducedMotion:'no-preference'});
  await previewPage.waitForFunction(period=>
    document.getElementById('audience-track').scrollLeft>=period-2,
    history[0].period,{timeout:5000});
  const finalCard=await measure();
  await previewPage.waitForFunction(unit=>
    document.getElementById('audience-track').scrollLeft<unit*.5,
    unit,{timeout:5000});
  const wrapped=await measure();
  await previewPage.waitForTimeout(450);
  const continuing=await measure();
  observations.push({state:'real-scene-wrap',finalCard,wrapped,continuing});
  check(finalCard.left>=history[0].period-2&&wrapped.left<unit*.5&&
    continuing.left>wrapped.left+12,
    'Real scene failed to wrap after a whole card and resume: '+
      JSON.stringify({finalCard,wrapped,continuing}));
  await previewPage.evaluate(()=>{
    const reel=document.getElementById('audience-track');
    reel.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));
    reel.dispatchEvent(new FocusEvent('focusin',{bubbles:true}));
  });
  await previewPage.waitForTimeout(4700);
  const pointerRest=await measure();
  await previewPage.waitForTimeout(450);
  const pointerAdvance=await measure();
  observations.push({state:'real-pointer-resume',before:pointerRest,after:pointerAdvance});
  check(pointerAdvance.left>pointerRest.left+12,
    'Real carousel did not resume a stepped move after pointer focus: '+
      JSON.stringify({pointerRest,pointerAdvance}));
}catch(error){failures.push('Real preview carousel: '+String(error.message||error));}
finally{await previewPage.close();await browser.close();}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),
  scope:'M13 stepped card, hold, seamless loop, pause and resume on real preview',observations,failures};
fs.writeFileSync(path.join(dest,'carousel-idle-results.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 carousel idle] '+report.status+' '+JSON.stringify(observations));
for(const message of failures)console.error('[V3 carousel idle] '+message);
if(failures.length)process.exitCode=1;
