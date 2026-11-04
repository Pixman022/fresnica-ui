#!/usr/bin/env node
// Real Chromium page zoom, driven by X11 keyboard shortcuts in a headed browser.
// Not CSS zoom, device emulation, or a mobile-device acceptance test.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const dest=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-browser');
const cases=[{name:'1440',width:1440,height:900}];
const failures=[],results=[];
fs.mkdirSync(dest,{recursive:true});
const check=(ok,message)=>{if(!ok)failures.push(message);};

for(const item of cases){
  const browser=await chromium.launch({
    headless:false,
    ...(process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
    args:['--no-sandbox','--disable-dev-shm-usage',`--window-size=${item.width},${item.height}`]
  });
  const page=await browser.newPage({
    viewport:{width:item.width,height:item.height},deviceScaleFactor:1,reducedMotion:'reduce'
  });
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(error.message));
  try{
    if(process.env.V3_QA_INLINE){
      // Offline CI rehearsal without a network-capable browser profile.
      await page.setContent(fs.readFileSync(process.env.V3_QA_INLINE,'utf8'),{waitUntil:'domcontentloaded'});
    }else await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('#locale-toggle').focus();
    const initial=await page.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio}));
    execFileSync('python3',['scripts/v3-native-zoom-keys.py'],{stdio:'inherit'});
    await page.waitForTimeout(300);
    const zoom=await page.evaluate(()=>({
      width:innerWidth,dpr:devicePixelRatio,
      cssZoom:getComputedStyle(document.documentElement).zoom,
      visualScale:visualViewport.scale
    }));
    const prefix=`native200/${item.name}`;
    check(Math.abs(zoom.dpr/initial.dpr-2)<.03&&
      Math.abs(zoom.width-initial.width/2)<=2&&
      Math.abs(zoom.visualScale-1)<.01&&Number(zoom.cssZoom)===1,
      `${prefix}: Chrome did not reach native page zoom 200%: ${JSON.stringify({initial,zoom})}`);
    const samples=[];
    for(const lang of ['en','zh-CN']){
      if(lang==='zh-CN'){
        await page.locator('#locale-toggle').click();
        await page.locator('[data-language="zh-CN"]').click();
      }
      for(const theme of ['light','dark']){
        if(theme==='dark')await page.locator('#theme-toggle').click();
        if(theme==='light'&&lang==='zh-CN')await page.locator('#theme-toggle').click();
        for(const scene of ['overview','v3-features','v3-workspace']){
          await page.evaluate(id=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'}),scene);
          await page.waitForTimeout(150);
          const state=await page.evaluate(()=>{
            const rect=element=>{
              const r=element?.getBoundingClientRect();
              return r&&{top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height,width:r.width};
            };
            const controlIds=['scene-menu-button','locale-toggle','theme-toggle','download-menu-button'];
            return {
              width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,
              theme:document.documentElement.classList.contains('v3-theme-dark')?'dark':'light',
              lang:document.documentElement.lang,
              cta:rect(document.querySelector('#v3-workspace .desktop-download')),
              workspace:rect(document.querySelector('#v3-workspace')),
              controls:controlIds.map(id=>({id,rect:rect(document.getElementById(id))})),
              disabledDownloads:[...document.querySelectorAll('.download-action')].every(b=>b.disabled)
            };
          });
          const key=`${prefix}/${lang}/${theme}/${scene}`;
          check(state.overflow<=8,`${key}: horizontal overflow ${state.overflow}px`);
          check(state.lang===lang&&state.theme===theme,`${key}: theme or language mismatch`);
          check(state.disabledDownloads,`${key}: an unverified download became enabled`);
          for(const {id,rect:r} of state.controls){
            check(r&&r.left>=-2&&r.right<=state.width+2&&r.width>=39&&r.height>=39,
              `${key}: ${id} outside viewport or undersized: ${JSON.stringify(r)}`);
          }
          if(scene==='v3-workspace'){
            const cta=state.cta,section=state.workspace;
            check(cta&&section&&cta.top>=section.top+15&&cta.bottom<=section.bottom-15,
              `${key}: desktop download CTA outside chapter: ${JSON.stringify({cta,section})}`);
          }
          if(scene!=='v3-features'){
            const file=`native-zoom200-${item.name}-${lang}-${theme}-${scene}.png`;
            await page.screenshot({path:path.join(dest,file),animations:'disabled'});
            samples.push({scene,lang,theme,file,overflow:state.overflow});
          }
        }
      }
    }
    if(item.name==='1440'){
      await page.locator('#scene-menu-button').focus();
      await page.keyboard.press('Enter');
      check(await page.locator('#scene-menu').evaluate(e=>e.classList.contains('is-open')),
        `${prefix}: cannot open section menu with Enter`);
      await page.keyboard.press('Escape');
      check(await page.evaluate(()=>document.activeElement?.id==='scene-menu-button'),
        `${prefix}: Escape failed to restore section menu focus`);
    }
    check(pageErrors.length===0,`${prefix}: page errors ${pageErrors.join('; ').slice(0,500)}`);
    results.push({viewport:item,initial,nativeZoom:zoom,samples,pageErrors});
    console.log(`[V3 native zoom] ${item.name}: DPR ${zoom.dpr.toFixed(2)}, CSS width ${zoom.width}, captured ${samples.length}`);
  }catch(error){
    failures.push(`native200/${item.name}: ${String(error.message||error).slice(0,800)}`);
  }finally{
    await page.close();
    await browser.close();
  }
}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),
  meaning:'Real Chromium page zoom via X11 Ctrl+plus; not CSS zoom, not device QA',
  cases:results,failures};
fs.writeFileSync(path.join(dest,'native-zoom-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(`[V3 native zoom] ${report.status}; ${results.length} browser sizes; ${failures.length} findings`);
for(const finding of failures)console.error('[V3 native zoom] '+finding);
if(failures.length)process.exitCode=1;
