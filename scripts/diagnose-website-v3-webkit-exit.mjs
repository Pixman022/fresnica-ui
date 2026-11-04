#!/usr/bin/env node
// Diagnostic-only WebKit reproducer. It reports cases without declaring QA success.
// The separate full nine-scene regression remains the actual acceptance gate.
import fs from 'node:fs';
import path from 'node:path';
import {chromium,webkit} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const name=process.env.V3_DIAG_ENGINE||'webkit';
const engine={chromium,webkit}[name];
if(!engine)throw new Error('Unknown engine '+name);
const output=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-engines');
fs.mkdirSync(output,{recursive:true});
const variants=[
  {name:'animated-baseline'},
  {name:'animated-no-arrival-compositing',noEntrance:true},
  {name:'instant-navigation',instant:true}
];
const results=[];
for(const variant of variants){
  let browser,page,last='launch';
  const events=[];
  try{
    browser=await engine.launch({headless:true,
      ...(name==='chromium'&&process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
      ...(name==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
    page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
    page.on('crash',()=>events.push('page crashed during '+last));
    page.on('pageerror',e=>events.push('JS error: '+e.message));
    last='navigation';
    if(process.env.V3_INLINE_FIXTURE)await page.setContent(fs.readFileSync(process.env.V3_INLINE_FIXTURE,'utf8'),{waitUntil:'domcontentloaded'});
    else await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
      document.documentElement.dataset.m14Active==='overview',null,{timeout:15000});
    if(variant.noEntrance){
      await page.addStyleTag({content:'html.m10-framed .v3-page-scroll .m22-entrance,html.m10-framed .v3-page-scroll .m14-current .m22-entrance{animation:none!important;filter:none!important;clip-path:none!important;translate:none!important;}'});
    }
    last='security positioning';
    const goHold=id=>page.evaluate(id=>{
      const scroll=document.getElementById('v3-page-scroll');
      const section=document.getElementById(id);
      const runway=section.closest('.v3-screen-runway,.m5-runway,.feature-scroll');
      const root=scroll.getBoundingClientRect();
      const room=Math.max(0,runway.offsetHeight-scroll.clientHeight);
      const top=scroll.scrollTop+runway.getBoundingClientRect().top-root.top;
      const fraction=id==='v3-ecosystem'?.76:id==='v3-workspace'?.77:id==='v3-features'?.47:runway.classList.contains('m5-runway')?.73:.46;
      scroll.style.scrollBehavior='auto';scroll.scrollTop=top+room*fraction;scroll.style.scrollBehavior='';
    },id);
    await goHold('v3-security');
    await page.waitForFunction(()=>document.documentElement.dataset.m14Active==='v3-security',null,{timeout:5000});
    await page.waitForTimeout(800);
    await page.mouse.move(150,500);
    last=variant.instant?'instant clarity jump':'security-to-clarity wheel';
    if(variant.instant)await goHold('v3-clarity');
    else await page.mouse.wheel(0,170);
    last='settling on clarity';
    await page.waitForTimeout(1900);
    const state=await page.evaluate(()=>({scene:document.documentElement.dataset.m14Active,
      top:document.getElementById('v3-page-scroll').scrollTop,
      portal:document.querySelector('.m24-portal')?.style.display,
      transitioning:document.documentElement.classList.contains('m24-transitioning')}));
    if(state.scene!=='v3-clarity'||state.transitioning||state.portal==='block')
      throw new Error('Incorrect settled clarity state '+JSON.stringify(state));
    results.push({variant:variant.name,status:'PASS',state,events});
    console.log('[V3 WebKit exit diagnostic] '+variant.name+' PASS '+JSON.stringify(state));
  }catch(error){
    const entry={variant:variant.name,status:'FAIL',phase:last,message:String(error.message||error).slice(0,900),events};
    results.push(entry);
    console.log('[V3 WebKit exit diagnostic] '+variant.name+' FAIL '+entry.phase+' '+entry.message+' '+events.join(' / '));
  }finally{if(page)await page.close().catch(()=>{});if(browser)await browser.close().catch(()=>{});}
}
const report={date:new Date().toISOString(),engine:name,scope:'diagnostic only, does not override full scene QA status',results};
fs.writeFileSync(path.join(output,'webkit-security-exit-diagnostic.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 WebKit exit diagnostic] completed '+results.length+' variants.');
