#!/usr/bin/env node
// V3 real-wheel scene holds, portal cleanup, and mid-transition viewport changes.
// Browser assertions are not a substitute for GPU profiling or visual sign-off.
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const dest=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-browser');
const scenes=['overview','v3-ecosystem','v3-availability','v3-features','v3-workspace',
  'v3-for-you','v3-security','v3-clarity','v3-about'];
const observations=[],failures=[];
fs.mkdirSync(dest,{recursive:true});
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const browser=await chromium.launch({headless:true,
  ...(process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
  args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
page.on('pageerror',error=>failures.push('Browser exception: '+error.message));
const run=async(name,fn)=>{try{const data=await fn();observations.push({name,...data});
  console.log('[V3 scenes] '+name+' PASS');}catch(error){const issue=name+': '+String(error.message||error).slice(0,600);
  failures.push(issue);console.error('[V3 scenes] '+issue);}};
const wheel=sign=>page.mouse.wheel(0,sign*170);
const state=()=>page.evaluate(()=>{
  const scroll=document.getElementById('v3-page-scroll');
  const portal=document.querySelector('.m24-portal');
  return {scene:document.documentElement.dataset.m14Active,top:scroll.scrollTop,
    portalDisplay:portal?.style.display,portalFill:portal?.querySelector('circle')?.getAttribute('fill'),
    portalRadius:Number(portal?.querySelector('circle')?.getAttribute('r')),
    transitioning:document.documentElement.classList.contains('m24-transitioning')};
});
const holdTop=id=>page.evaluate(id=>{
  const scroll=document.getElementById('v3-page-scroll');
  const root=scroll.getBoundingClientRect(),max=Math.max(0,scroll.scrollHeight-scroll.clientHeight);
  const runway=[...scroll.children].find(e=>e.matches('.v3-screen-runway,.m5-runway,.feature-scroll')&&
    (e.dataset.sceneId||e.querySelector('.stage,.chapter')?.id||e.id)===id);
  if(!runway)return null;
  const room=Math.max(0,runway.offsetHeight-scroll.clientHeight);
  const fraction=id==='v3-ecosystem'?.76:id==='v3-workspace'?.77:id==='v3-features'?.47:
    runway.classList.contains('m5-runway')?.73:.46;
  const top=scroll.scrollTop+runway.getBoundingClientRect().top-root.top;
  return Math.max(0,Math.min(max,top+room*fraction));
},id);
async function settled(id,context){
  await page.waitForFunction(scene=>document.documentElement.dataset.m14Active===scene,id,{timeout:5000});
  await page.waitForTimeout(180);
  const current=await state(),want=await holdTop(id);
  assert(Number.isFinite(want),context+': missing '+id);
  assert(Math.abs(current.top-want)<=10,
    context+': '+id+' stopped at '+Math.round(current.top)+' rather than '+Math.round(want));
  assert(!current.transitioning,context+': transition class remained active');
  return {scene:id,top:Math.round(current.top)};
}
async function reset(){
  await page.evaluate(()=>{const el=document.getElementById('v3-page-scroll');
    el.style.scrollBehavior='auto';el.scrollTop=0;el.style.scrollBehavior='';});
  await page.waitForTimeout(330);
}
try{
  if(process.env.V3_INLINE_FIXTURE){
    await page.setContent(fs.readFileSync(process.env.V3_INLINE_FIXTURE,'utf8'),{waitUntil:'domcontentloaded'});
  }else await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
    !!document.querySelector('.m24-portal'),null,{timeout:15000});
  await page.mouse.move(150,500);
  await run('nine-scene-forward-and-reverse',async()=>{
    const forward=[],backward=[];
    assert((await state()).scene===scenes[0],'Initial scene should be overview');
    for(let i=1;i<scenes.length;i++){
      await wheel(1);
      if(i===2){
        await page.waitForFunction(()=>document.querySelector('.m24-portal')?.style.display==='block',null,{timeout:1200});
        await page.waitForFunction(()=>document.querySelector('.m24-portal circle')?.getAttribute('fill')==='#101312',null,{timeout:1200});
        assert((await state()).portalRadius>25,'The black portal has not expanded');
        await page.screenshot({path:path.join(dest,'transition-02-03-portal.png'),timeout:15000});
      }
      await page.waitForTimeout(1280);
      forward.push(await settled(scenes[i],'forward '+i));
      if(i===2){
        assert((await state()).portalDisplay==='none','Portal did not disappear after transition');
        await page.screenshot({path:path.join(dest,'transition-03-download-settled.png'),timeout:15000});
      }
    }
    for(let i=scenes.length-2;i>=scenes.length-4;i--){
      await wheel(-1);await page.waitForTimeout(1280);
      backward.push(await settled(scenes[i],'backward '+i));
    }
    return {forward,backward};
  });
  await run('resize-during-regular-snap',async()=>{
    await reset();
    await wheel(1);await page.waitForTimeout(100);
    await page.setViewportSize({width:1200,height:720});
    await page.waitForTimeout(480);
    return {result:await settled('v3-ecosystem','regular resize')};
  });
  await run('resize-during-green-to-black-portal',async()=>{
    await reset();
    await page.setViewportSize({width:1440,height:900});
    await wheel(1);await page.waitForTimeout(1330);
    await settled('v3-ecosystem','portal precondition');
    await wheel(1);
    await page.waitForFunction(()=>document.querySelector('.m24-portal')?.style.display==='block',null,{timeout:1200});
    await page.setViewportSize({width:1200,height:720});
    await page.waitForTimeout(350);
    const current=await state();
    assert(current.portalDisplay==='none'&&!current.transitioning,
      'Viewport resize must clean up the portal overlay');
    return {result:await settled('v3-availability','portal resize')};
  });
  await run('escape-clears-portal',async()=>{
    await reset();
    await page.setViewportSize({width:1440,height:900});
    await wheel(1);await page.waitForTimeout(1330);
    await settled('v3-ecosystem','Escape precondition');
    await wheel(1);
    await page.waitForFunction(()=>document.querySelector('.m24-portal')?.style.display==='block',null,{timeout:1200});
    await page.keyboard.press('Escape');await page.waitForTimeout(200);
    const current=await state();
    assert(current.portalDisplay==='none'&&!current.transitioning,'Escape left a portal overlay');
    return {scene:current.scene};
  });
  await run('reduced-motion-native-wheel',async()=>{
    await reset();await page.emulateMedia({reducedMotion:'reduce'});
    await wheel(1);await page.waitForTimeout(450);
    const current=await state();
    assert(current.top>20&&current.top<900,'Reduced-motion scroll was not native');
    assert(current.portalDisplay!=='block'&&!current.transitioning,
      'Reduced-motion unexpectedly played the portal');
    return {top:Math.round(current.top)};
  });
}finally{await page.close();await browser.close();}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),url:base,
  meaning:'Browser wheel scene holds and resize interruptions; not a GPU benchmark or visual sign-off',
  observations,failures};
fs.writeFileSync(path.join(dest,'transition-results.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 scenes] '+report.status+'; '+observations.length+' scenarios; '+failures.length+' failures');
if(failures.length)process.exitCode=1;
