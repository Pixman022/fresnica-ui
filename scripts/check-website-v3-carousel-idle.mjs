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

  await scroll(900);await sleep(750);
  const active=await read();observations.push({state:'visible',...active});
  check(active.frames>8&&active.left>10,'Visible carousel failed to move');

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

  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
    document.dispatchEvent(new Event('visibilitychange'));});
  await inactive('Hidden-tab carousel');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});
    document.dispatchEvent(new Event('visibilitychange'));});
  await sleep(260);const shown=await read();await sleep(280);
  check((await read()).frames-shown.frames>4,'Carousel did not resume after tab visibility');
  observations.push({state:'final',...await read()});
}catch(error){failures.push(String(error.message||error));}
finally{await page.close();await browser.close();}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),
  scope:'M13 carousel visible/offscreen/reduced/focus/pause/tab visibility',observations,failures};
fs.writeFileSync(path.join(dest,'carousel-idle-results.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 carousel idle] '+report.status+' '+JSON.stringify(observations));
for(const message of failures)console.error('[V3 carousel idle] '+message);
if(failures.length)process.exitCode=1;
