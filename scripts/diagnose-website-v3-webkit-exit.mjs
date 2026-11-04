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
  {name:'overview-to-clarity',target:'v3-clarity'},
  {name:'overview-to-clarity-reduced',target:'v3-clarity',reduced:true},
  {name:'security-to-clarity-no-qa-idle',target:'v3-clarity',fromSecurity:true,noQaIdle:true},
  {name:'security-to-clarity-no-css-animation',target:'v3-clarity',fromSecurity:true,noAllCss:true},
  {name:'overview-to-about',target:'v3-about'}
];
const results=[];
for(const variant of variants){
  let browser,page,last='launch';
  const events=[];
  try{
    browser=await engine.launch({headless:true,
      ...(name==='chromium'&&process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
      ...(name==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
    page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:variant.reduced?'reduce':'no-preference'});
    page.on('crash',()=>events.push('page crashed during '+last));
    page.on('pageerror',e=>events.push('JS error: '+e.message));
    last='navigation';
    if(process.env.V3_INLINE_FIXTURE)await page.setContent(fs.readFileSync(process.env.V3_INLINE_FIXTURE,'utf8'),{waitUntil:'domcontentloaded'});
    else await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
      !!document.getElementById('v3-clarity'),null,{timeout:15000});
    if(variant.noQaIdle){
      await page.addStyleTag({content:'html.m14-motion #v3-clarity.m14-current .qa-heading::after,html.m14-motion #v3-clarity.m14-current .qa-list button span{animation:none!important;}'});
    }
    if(variant.noAllCss){
      await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;filter:none!important;clip-path:none!important;}'});
    }
    last='target positioning';
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
    if(variant.fromSecurity){
      await goHold('v3-security');
      await page.waitForFunction(()=>document.documentElement.dataset.m14Active==='v3-security',null,{timeout:5000});
      await page.waitForTimeout(800);
    }
    last='instant jump to '+variant.target;
    await goHold(variant.target);
    last='settling on '+variant.target;
    await page.waitForTimeout(1900);
    const state=await page.evaluate(id=>{
      const scroller=document.getElementById('v3-page-scroll');
      const a=scroller.getBoundingClientRect();
      const r=document.getElementById(id).getBoundingClientRect();
      const center=a.top+scroller.clientHeight/2;
      return {scene:document.documentElement.dataset.m14Active,
        targetShown:r.top<=center&&r.bottom>=center,
        top:scroller.scrollTop,
        portal:document.querySelector('.m24-portal')?.style.display,
        transitioning:document.documentElement.classList.contains('m24-transitioning')};
    },variant.target);
    if(!state.targetShown||(!variant.reduced&&state.scene!==variant.target)||state.transitioning||state.portal==='block')
      throw new Error('Incorrect settled target state '+JSON.stringify(state));
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
