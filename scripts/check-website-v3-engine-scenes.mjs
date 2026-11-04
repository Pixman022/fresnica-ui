#!/usr/bin/env node
// Full nine-chapter normal-motion traversal in Firefox/WebKit.
// Tests scene identity/hold geometry, not hardware FPS or design sign-off.
import fs from 'node:fs';
import path from 'node:path';
import {chromium,firefox,webkit} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const engines=(process.env.V3_BROWSER_ENGINES||'firefox,webkit').split(',').map(x=>x.trim()).filter(Boolean);
const dest=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-engines');
const scenes=['overview','v3-ecosystem','v3-availability','v3-features','v3-workspace',
  'v3-for-you','v3-security','v3-clarity','v3-about'];
const observations=[],failures=[];
fs.mkdirSync(dest,{recursive:true});
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
for(const name of engines){
  const engine={chromium,firefox,webkit}[name];
  if(!engine){failures.push('Unknown browser engine '+name);continue;}
  let browser,page,lastPhase='launch';
  const events=[];
  try{
    browser=await engine.launch({headless:true,
      ...(name==='chromium'&&process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
      ...(name==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
    // Run the fresh 07 -> 08 diagnostic in a separate browser process.
    if(process.env.V3_SCENE_PROBE_ONLY==='1'){
      const probe=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
      probe.on('crash',()=>events.push('fresh probe page crashed during '+lastPhase));
      probe.on('close',()=>events.push('fresh probe page closed during '+lastPhase));
      try{
        lastPhase='fresh security probe navigation';
        if(process.env.V3_SCENE_PROBE_DISABLE_SECURITY==='1'){
          await probe.route('**/m29-security-particles.js',route=>route.fulfill({body:'/* isolated security particle script */',contentType:'application/javascript'}));
        }
        if(process.env.V3_INLINE_FIXTURE)
          await probe.setContent(fs.readFileSync(process.env.V3_INLINE_FIXTURE,'utf8'),{waitUntil:'domcontentloaded'});
        else await probe.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
        await probe.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
          document.documentElement.dataset.m14Active==='overview',null,{timeout:15000});
        lastPhase='fresh security probe positioning';
        await probe.evaluate(()=>{
          const scroller=document.getElementById('v3-page-scroll');
          const section=document.getElementById('v3-security');
          const runway=section.closest('.v3-screen-runway,.m5-runway,.feature-scroll');
          const bounds=scroller.getBoundingClientRect();
          const top=scroller.scrollTop+runway.getBoundingClientRect().top-bounds.top;
          const room=Math.max(0,runway.offsetHeight-scroller.clientHeight);
          scroller.style.scrollBehavior='auto';
          scroller.scrollTop=top+room*.46;
          scroller.style.scrollBehavior='';
        });
        await probe.waitForFunction(()=>document.documentElement.dataset.m14Active==='v3-security',null,{timeout:5000});
        lastPhase='fresh security probe hold';
        await probe.waitForTimeout(850);
        await probe.mouse.move(150,500);
        lastPhase='fresh security probe wheel';
        await probe.mouse.wheel(0,170);
        lastPhase='fresh security probe waiting for clarity';
        await probe.waitForTimeout(1800);
        const scene=await probe.evaluate(()=>document.documentElement.dataset.m14Active);
        assert(scene==='v3-clarity',name+' direct security exit landed on '+scene);
        console.log('[V3 nine-scene engines] '+name+' fresh security -> clarity PASS');
      }finally{await probe.close();}
      observations.push({engine:name,status:'PASS',directSecurityExit:true});
      continue;
    }
    page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('crash',()=>events.push('page crash during '+lastPhase));
    page.on('close',()=>events.push('page closed during '+lastPhase));
    browser.on('disconnected',()=>events.push('browser disconnected during '+lastPhase));
    if(process.env.V3_INLINE_FIXTURE)
      await page.setContent(fs.readFileSync(process.env.V3_INLINE_FIXTURE,'utf8'),{waitUntil:'domcontentloaded'});
    else await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
      !!document.querySelector('.m24-portal')&&!!document.documentElement.dataset.m14Active,
      null,{timeout:15000});
    assert(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: no-preference)').matches),
      name+' normal motion not enabled');
    await page.mouse.move(150,500);
    const getState=()=>page.evaluate(()=>{
      const scroll=document.getElementById('v3-page-scroll'),root=scroll.getBoundingClientRect();
      const max=Math.max(0,scroll.scrollHeight-scroll.clientHeight);
      const scene=document.documentElement.dataset.m14Active;
      const runway=[...scroll.children].find(el=>el.matches('.v3-screen-runway,.m5-runway,.feature-scroll')&&
        (el.dataset.sceneId||el.querySelector('.stage,.chapter')?.id||el.id)===scene);
      let expected=null;
      if(runway){
        const room=Math.max(0,runway.offsetHeight-scroll.clientHeight);
        const fraction=scene==='v3-ecosystem'?.76:scene==='v3-workspace'?.77:
          scene==='v3-features'?.47:runway.classList.contains('m5-runway')?.73:.46;
        expected=Math.max(0,Math.min(max,scroll.scrollTop+runway.getBoundingClientRect().top-root.top+room*fraction));
      }
      const portal=document.querySelector('.m24-portal');
      return {scene,top:scroll.scrollTop,expected,scrollWidth:document.documentElement.scrollWidth,
        viewportWidth:innerWidth,portal:portal?.style.display,
        transitioning:document.documentElement.classList.contains('m24-transitioning'),
        current:document.querySelectorAll('.m14-current').length,
        seen:document.getElementById(scene)?.classList.contains('m22-seen')??false};
    });
    const verify=async(id,label)=>{
      const state=await getState();
      assert(state.scene===id,label+' scene='+state.scene+' expected '+id);
      assert(Number.isFinite(state.expected),label+' missing runway hold');
      assert(Math.abs(state.top-state.expected)<=12,label+' hold '+state.top.toFixed(1)+' vs '+state.expected.toFixed(1));
      assert(!state.transitioning&&state.portal!=='block',label+' portal remains visible');
      assert(state.current===1&&state.seen,label+' scene gating or entrance state missing');
      assert(state.scrollWidth<=state.viewportWidth+8,label+' horizontal overflow');
      return {scene:id,top:Math.round(state.top),hold:Math.round(state.expected)};
    };
    // Slow software-rendered WebKit frames can run beyond a fixed wall-clock
    // delay. Observe the actual chapter hold, with a hard timeout, rather than
    // accepting an incomplete animation or hiding a permanently stuck scene.
    const waitForHold=async id=>{
      // Allow the wheel and portal RAF sequence to run before polling geometry.
      await page.waitForTimeout(1170);
      await page.waitForFunction(id=>{
        const scroll=document.getElementById('v3-page-scroll');
        const root=scroll.getBoundingClientRect();
        const runway=[...scroll.children].find(el=>el.matches('.v3-screen-runway,.m5-runway,.feature-scroll')&&
          (el.dataset.sceneId||el.querySelector('.stage,.chapter')?.id||el.id)===id);
        if(!runway||document.documentElement.dataset.m14Active!==id)return false;
        const room=Math.max(0,runway.offsetHeight-scroll.clientHeight);
        const fraction=id==='v3-ecosystem'?.76:id==='v3-workspace'?.77:
          id==='v3-features'?.47:runway.classList.contains('m5-runway')?.73:.46;
        const top=scroll.scrollTop+runway.getBoundingClientRect().top-root.top;
        const expected=Math.max(0,Math.min(scroll.scrollHeight-scroll.clientHeight,top+room*fraction));
        return Math.abs(scroll.scrollTop-expected)<=12&&
          !document.documentElement.classList.contains('m24-transitioning')&&
          document.querySelector('.m24-portal')?.style.display!=='block';
      },id,{timeout:5500,polling:120});
      await page.waitForTimeout(120);
    };
    const forward=[],reverse=[],screenshots=[];
    const capture=(process.env.V3_SCENE_SCREENSHOT_ENGINES||'firefox').split(',').includes(name);
    assert((await getState()).scene===scenes[0],name+' initial chapter is not overview');
    for(let i=1;i<scenes.length;i++){
      lastPhase='forward '+scenes[i];
      await page.mouse.wheel(0,170);
      await waitForHold(scenes[i]);
      forward.push(await verify(scenes[i],name+' forward '+i));
      console.log('[V3 nine-scene engines] '+name+' reached '+scenes[i]);
      if(i>=3&&capture){
        lastPhase='screenshot '+scenes[i];
        await page.screenshot({path:path.join(dest,name+'-scene-'+String(i+1).padStart(2,'0')+'.png'),timeout:20000});
        screenshots.push(scenes[i]);
      }
    }
    for(let i=scenes.length-2;i>=0;i--){
      lastPhase='reverse '+scenes[i];
      await page.mouse.wheel(0,-170);
      await waitForHold(scenes[i]);
      reverse.push(await verify(scenes[i],name+' reverse '+i));
      console.log('[V3 nine-scene engines] '+name+' returned '+scenes[i]);
    }
    assert(errors.length===0,name+' page errors: '+errors.join(' | '));
    observations.push({engine:name,status:'PASS',forward,reverse,screenshots,pageErrors:errors.length});
    console.log('[V3 nine-scene engines] '+name+' PASS forward='+forward.length+' reverse='+reverse.length);
  }catch(error){const message=name+': '+String(error.message||error).slice(0,750);
    failures.push(message+'; phase='+lastPhase+'; events='+events.join(' / '));
    console.error('[V3 nine-scene engines] '+message+'; phase='+lastPhase+'; events='+events.join(' / '));
  }finally{if(page)await page.close();if(browser)await browser.close();}
}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),url:base,
  meaning:'Linux browser engines normal-motion nine-scene geometry and direction checks, not GPU FPS or design approval',
  observations,failures};
const reportFile=process.env.V3_SCENE_PROBE_ONLY==='1'?'engine-security-exit-results.json':'engine-scenes-results.json';
fs.writeFileSync(path.join(dest,reportFile),JSON.stringify(report,null,2)+'\n');
console.log('[V3 nine-scene engines] '+report.status+' '+observations.length+' engines '+failures.length+' failures');
if(failures.length)process.exitCode=1;
