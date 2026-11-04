#!/usr/bin/env node
// Browser checks for the isolated V3 marketing preview. Screenshots are audit
// artifacts, not a golden visual approval; review them before marking P2 done.
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const dest=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-browser');
const setups=[
  {name:'desktop-1440',width:1440,height:900},
  {name:'tablet-768',width:768,height:1024},
  {name:'mobile-430',width:430,height:932},
  {name:'mobile-393',width:393,height:852},
  {name:'mobile-360',width:360,height:780},
  {name:'mobile-320',width:320,height:720},
  {name:'zoom200-equivalent',width:720,height:450}
];
const sceneIds=['overview','v3-ecosystem','v3-availability','v3-features','v3-workspace','v3-for-you','v3-security','v3-clarity','v3-about'];
const failures=[],reports=[],captures=[];
fs.mkdirSync(dest,{recursive:true});
const browser=await chromium.launch({
  headless:true,
  ...(process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
  args:['--no-sandbox','--disable-dev-shm-usage']
});
const assert=(condition,message)=>{if(!condition)failures.push(message);};
try{
  for(const {name,width,height} of setups){
    for(const theme of ['light','dark']){
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
      const pageErrors=[];
      page.on('pageerror',e=>pageErrors.push(String(e.message)));
      try{
        await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
        await page.evaluate(()=>document.fonts.ready);
        await page.waitForTimeout(300);
        if(theme==='dark')await page.locator('#theme-toggle').click();
        const state=await page.evaluate(()=>{
          const selector='#scene-menu-button,#locale-toggle,#theme-toggle,#download-menu-button';
          const controls=[...document.querySelectorAll(selector)].map(el=>{
            const r=el.getBoundingClientRect();
            return {id:el.id,width:r.width,height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom};
          });
          const q=s=>document.querySelector(s);
          return {
            theme:document.documentElement.classList.contains('v3-theme-dark')?'dark':'light',
            scrollWidth:document.documentElement.scrollWidth,
            innerWidth:window.innerWidth,
            controls,
            cards:document.querySelectorAll('.feature-card').length,
            firstCardLeft:q('#v3-features .feature-card')?.getBoundingClientRect().left??null,
            sendBackground:getComputedStyle(q('.mini-send-button')).backgroundColor,
            swapBackground:getComputedStyle(q('.mini-swap-button')).backgroundColor,
            activitySurface:getComputedStyle(q('.activity-demo')).backgroundColor,
            reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,
            disabledDownloads:[...document.querySelectorAll('.download-action')].every(b=>b.disabled)
          };
        });
        const prefix=name+'/'+theme;
        assert(state.theme===theme,`${prefix}: theme switch mismatch`);
        assert(state.cards===5,`${prefix}: missing feature card`);
        if(width<=430)assert(state.firstCardLeft!==null&&state.firstCardLeft>=10,
          `${prefix}: feature card begins too close to left edge (${state.firstCardLeft}px)`);
        assert(state.reducedMotion,`${prefix}: reduced-motion emulation inactive`);
        assert(state.disabledDownloads,`${prefix}: unverified download unexpectedly enabled`);
        assert(state.scrollWidth<=state.innerWidth+8,`${prefix}: document overflows horizontally by ${state.scrollWidth-state.innerWidth}px`);
        for(const c of state.controls){
          assert(c.width>=39&&c.height>=39,`${prefix}: ${c.id} is below 40px target (${c.width.toFixed(1)}x${c.height.toFixed(1)})`);
          assert(c.left>=-2&&c.right<=width+2,`${prefix}: ${c.id} clipped at viewport edge`);
        }
        const files=[];
        for(const id of name==='desktop-1440'?sceneIds:['overview','v3-features','v3-workspace']){
          await page.evaluate(id=>{document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});if(id==='v3-features'){const reel=document.getElementById('feature-window');if(reel)reel.scrollLeft=0;}},id);
          await page.waitForTimeout(160);
          const target=path.join(dest,`${prefix}-${id}.png`);
          fs.mkdirSync(path.dirname(target),{recursive:true});
          await page.screenshot({path:target,animations:'disabled',timeout:20000});
          files.push(path.relative(dest,target));
        }
        if(name==='desktop-1440'&&theme==='light'){
          await page.locator('#scene-menu-button').focus();
          await page.keyboard.press('Enter');
          assert(await page.locator('#scene-menu').evaluate(e=>e.classList.contains('is-open')),'Keyboard Enter did not open section menu');
          await page.keyboard.press('Escape');
          assert(!await page.locator('#scene-menu').evaluate(e=>e.classList.contains('is-open')),'Escape did not close section menu');
          assert(await page.evaluate(()=>document.activeElement?.id==='scene-menu-button'),'Escape did not return focus to section button');
          await page.locator('#download-menu-button').focus();
          await page.keyboard.press('Enter');
          assert(await page.locator('#download-menu').evaluate(e=>e.classList.contains('is-open')),'Keyboard Enter did not open download menu');
          await page.keyboard.press('Escape');
          assert(!await page.locator('#download-menu').evaluate(e=>e.classList.contains('is-open')),'Escape did not close download menu');
          assert(await page.evaluate(()=>document.activeElement?.id==='download-menu-button'),'Escape did not return focus to download button');
          await page.locator('#locale-toggle').focus();
          await page.keyboard.press('Enter');
          assert(!await page.locator('#locale-menu').evaluate(el=>el.hidden),'Keyboard Enter did not open language menu');
          await page.keyboard.press('Escape');
          assert(await page.locator('#locale-menu').evaluate(el=>el.hidden),'Escape did not close language menu');
          assert(await page.evaluate(()=>document.activeElement?.id==='locale-toggle'),'Escape did not return focus to language button');
          await page.locator('#locale-toggle').click();
          await page.locator('[data-language="zh-CN"]').click();
          await page.waitForFunction(()=>document.documentElement.lang==='zh-CN'&&
            document.querySelector('.footer-top > div:first-child > p:not(.chapter-kicker)')?.textContent?.includes('Fresnica 是面向'),null,{timeout:5000}).catch(()=>{});
          const locale=await page.evaluate(()=>({lang:document.documentElement.lang,footer:document.querySelector('.footer-top > div:first-child > p:not(.chapter-kicker)')?.textContent||''}));
          assert(locale.lang==='zh-CN','Language picker did not switch to Chinese');
          assert(locale.footer.includes('Fresnica 是面向'),`Chinese footer translation missing; got: ${locale.footer.slice(0,120)}`);
          await page.screenshot({path:path.join(dest,'desktop-1440-zh.png'),animations:'disabled'});
          files.push('desktop-1440-zh.png');
        }
        assert(pageErrors.length===0,`${prefix}: browser script errors: ${pageErrors.join('; ').slice(0,500)}`);
        reports.push({viewport:name,theme,state,captures:files,pageErrors});
        captures.push(...files);
        console.log(`[V3 browser] ${prefix} cards=${state.cards} overflow=${state.scrollWidth-state.innerWidth}px shots=${files.length}`);
      }catch(error){
        failures.push(`${name}/${theme}: ${String(error.message||error).slice(0,700)}`);
      }finally{
        await page.close();
      }
    }
  }
}finally{
  await browser.close();
}
const result={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),url:base,checks:'theme, key targets, horizontal overflow, reduced motion, demo only buttons, menu keyboard, zh translation, screenshots',viewports:setups.map(s=>s.name),captureCount:captures.length,reports,failures};
fs.writeFileSync(path.join(dest,'results.json'),JSON.stringify(result,null,2)+'\n');
console.log('[V3 browser] '+result.status+'; '+reports.length+' viewport/themes; '+captures.length+' screenshots; '+failures.length+' findings');
for(const failure of failures)console.error('[V3 browser] '+failure);
if(failures.length)process.exitCode=1;
