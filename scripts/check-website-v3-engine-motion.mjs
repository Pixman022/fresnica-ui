#!/usr/bin/env node
// Normal-motion scene transitions in browser engines, not GPU performance sign-off.
import fs from 'node:fs';
import path from 'node:path';
import {chromium,firefox,webkit} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const engines=(process.env.V3_BROWSER_ENGINES||'firefox,webkit').split(',').map(s=>s.trim()).filter(Boolean);
const output=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-engines');
const findings=[],observations=[];
fs.mkdirSync(output,{recursive:true});
const requireThat=(ok,message)=>{if(!ok)throw new Error(message);};
for(const name of engines){
  const engine={chromium,firefox,webkit}[name];
  if(!engine){findings.push('Unknown engine '+name);continue;}
  let browser,page;
  try{
    browser=await engine.launch({headless:true,
      ...(name==='chromium'&&process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
      ...(name==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
    page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    if(process.env.V3_INLINE_FIXTURE)await page.setContent(fs.readFileSync(process.env.V3_INLINE_FIXTURE,'utf8'),{waitUntil:'domcontentloaded'});
    else await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
      !!document.querySelector('.m24-portal'),null,{timeout:15000});
    requireThat(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: no-preference)').matches),name+' full motion disabled');
    await page.mouse.move(150,500);
    await page.mouse.wheel(0,170);
    await page.waitForFunction(()=>document.documentElement.dataset.m14Active==='v3-ecosystem',null,{timeout:5000});
    await page.waitForTimeout(1250);
    const first=await page.evaluate(()=>({scene:document.documentElement.dataset.m14Active,
      top:document.getElementById('v3-page-scroll').scrollTop}));
    requireThat(first.scene==='v3-ecosystem',name+' failed to settle on screen 2');
    await page.mouse.wheel(0,170);
    await page.waitForFunction(()=>document.querySelector('.m24-portal')?.style.display==='block',null,{timeout:1800});
    await page.waitForFunction(()=>document.querySelector('.m24-portal circle')?.getAttribute('fill')==='#101312',null,{timeout:2000});
    await page.screenshot({path:path.join(output,name+'-motion-portal.png'),timeout:20000});
    await page.waitForFunction(()=>document.documentElement.dataset.m14Active==='v3-availability'&&
      document.querySelector('.m24-portal')?.style.display==='none',null,{timeout:5500});
    await page.waitForTimeout(210);
    const second=await page.evaluate(()=>({scene:document.documentElement.dataset.m14Active,
      top:document.getElementById('v3-page-scroll').scrollTop,
      transitioning:document.documentElement.classList.contains('m24-transitioning')}));
    requireThat(second.scene==='v3-availability'&&!second.transitioning,name+' screen 3 has residual portal');
    // The chapter state changes before its staggered 780ms entrance completes.
    // Compare only the settled phone, never a frame inside its reveal delay.
    await page.waitForTimeout(1400);
    const art=await page.evaluate(()=>{
      const el=document.querySelector('#v3-availability .download-art');
      const style=getComputedStyle(el),box=el.getBoundingClientRect();
      return {width:box.width,height:box.height,visibility:style.visibility,
        opacity:style.opacity,filter:style.filter,animation:style.animationName};
    });
    requireThat(art.width>=160&&art.height>=200&&art.visibility==='visible',
      name+' mobile artwork has invalid geometry or visibility');
    requireThat(!/opacity\(0(?:\.0+)?\)/.test(art.filter)&&Number(art.opacity)>0.9,
      name+' mobile artwork remains invisible after entrance: '+art.filter);
    requireThat(errors.length===0,name+' runtime errors: '+errors.join(' | '));
    await page.screenshot({path:path.join(output,name+'-motion-download.png'),timeout:20000});
    observations.push({engine:name,status:'PASS',screen2:first,screen3:second,
      artwork:art,pageErrors:errors.length});
    console.log('[V3 engine motion] '+name+' PASS');
  }catch(error){const message=name+': '+String(error.message||error).slice(0,650);
    findings.push(message);console.error('[V3 engine motion] '+message);}
  finally{if(page)await page.close();if(browser)await browser.close();}
}
const report={status:findings.length?'FAIL':'PASS',date:new Date().toISOString(),url:base,
  meaning:'Normal-motion Firefox/WebKit first two scene transitions, not GPU throughput or visual approval',
  observations,findings};
fs.writeFileSync(path.join(output,'engine-motion-results.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 engine motion] '+report.status+' '+observations.length+' engines '+findings.length+' failures');
if(findings.length)process.exitCode=1;
