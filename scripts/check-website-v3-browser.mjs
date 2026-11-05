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
          const scene=q('#v3-workspace')?.getBoundingClientRect();
          const cta=q('#v3-workspace .desktop-download')?.getBoundingClientRect();
          return {
            theme:document.documentElement.classList.contains('v3-theme-dark')?'dark':'light',
            scrollWidth:document.documentElement.scrollWidth,
            innerWidth:window.innerWidth,
            controls,
            cards:document.querySelectorAll('.feature-card').length,
            firstCardLeft:q('#v3-features .feature-card')?.getBoundingClientRect().left??null,
            workspaceCta:scene&&cta?{
              top:cta.top-scene.top,bottom:cta.bottom-scene.top,sceneHeight:scene.height
            }:null,
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
        if(width>=681){
          const cta=state.workspaceCta;
          assert(cta&&cta.top>=15&&cta.bottom<=cta.sceneHeight-15,
            `${prefix}: desktop download CTA clipped in reduced-motion scene (${JSON.stringify(cta)})`);
        }
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
        if(name==='desktop-1440'&&theme==='dark'){
          // Dark-theme orb uses the same approved uniforms and keeps its own green palette.
          await page.evaluate(()=>document.getElementById('orb-field')?.scrollIntoView({block:'center',behavior:'instant'}));
          await page.waitForFunction(()=>document.getElementById('orb-tuner')?.hidden===false,null,{timeout:8000});
          const canvas=page.locator('#orb-canvas');
          const hasWebGL=await canvas.evaluate(el=>el.style.display!=='none'&&Boolean(el.getContext('webgl2')));
          const before=hasWebGL?await canvas.screenshot({animations:'disabled'}):null;
          const backgroundBefore=await page.locator('#fallback-orb').evaluate(el=>el.style.background);
          await page.locator('#orb-tuner-toggle').click();
          assert(await page.locator('#orb-tuner-panel').isVisible(),'Dark-mode gradient tuner failed to open');
          await page.locator('#orb-tuner-spread').evaluate(el=>{
            el.value='0.20';el.dispatchEvent(new Event('input',{bubbles:true}));
          });
          await page.locator('#orb-tuner-inner').evaluate(el=>{
            el.value='0.84';el.dispatchEvent(new Event('input',{bubbles:true}));
          });
          await page.waitForTimeout(130);
          const adjusted=await page.evaluate(()=>{
            const el=document.getElementById('orb-canvas');
            const gl=el.getContext('webgl2');
            const program=gl?.getParameter(gl.CURRENT_PROGRAM);
            return {
              spread:document.getElementById('orb-tuner-spread-value').textContent,
              inner:document.getElementById('orb-tuner-inner-value').textContent,
              background:document.getElementById('fallback-orb').style.background,
              dark:document.documentElement.classList.contains('v3-theme-dark'),
              gpuMode:program?gl.getUniform(program,gl.getUniformLocation(program,'uLightMode')):null,
              gpuSpread:program?gl.getUniform(program,gl.getUniformLocation(program,'uSpread')):null
            };
          });
          assert(adjusted.dark&&adjusted.spread==='0.20'&&adjusted.inner==='0.84'&&
            adjusted.background!==backgroundBefore,
            'Dark mode orb controls did not update: '+JSON.stringify(adjusted));
          if(hasWebGL){
            assert(adjusted.gpuMode===0&&Math.abs(adjusted.gpuSpread-.20)<.001,
              'Dark mode shader failed to receive live gradient uniforms: '+JSON.stringify(adjusted));
            const after=await canvas.screenshot({animations:'disabled'});
            assert(!before.equals(after),'Dark-mode orb canvas did not react to gradient change');
          }
          await page.locator('#orb-tuner-reset').click();
          await page.keyboard.press('Escape');
        }
        if(name==='desktop-1440'&&theme==='light'){
          // Live gradient controls update the shader inputs and the CSS fallback without a reload.
          await page.evaluate(()=>document.getElementById('orb-field')?.scrollIntoView({block:'center',behavior:'instant'}));
          await page.waitForFunction(()=>document.getElementById('orb-tuner')?.hidden===false,null,{timeout:8000});
          await page.locator('#orb-tuner-toggle').click();
          assert(await page.locator('#orb-tuner-panel').isVisible(),'Orb gradient tuner failed to open');
          const fallbackBefore=await page.locator('#fallback-orb').evaluate(el=>el.style.background);
          await page.locator('#orb-tuner-spread').evaluate(el=>{
            el.value='0.70';el.dispatchEvent(new Event('input',{bubbles:true}));
          });
          const tuned=await page.evaluate(()=>({
            value:document.getElementById('orb-tuner-spread').value,
            display:document.getElementById('orb-tuner-spread-value').textContent,
            fallback:document.getElementById('fallback-orb').style.background
          }));
          assert(Number(tuned.value)===.70&&tuned.display==='0.70'&&tuned.fallback!==fallbackBefore,
            'Orb slider did not update its value and fallback gradient: '+JSON.stringify(tuned));
          await page.waitForTimeout(100);
          const gpu=await page.evaluate(()=>{
            const canvas=document.getElementById('orb-canvas');
            if(canvas.style.display==='none')return null;
            const gl=canvas.getContext('webgl2');
            if(!gl)return null;
            const program=gl.getParameter(gl.CURRENT_PROGRAM);
            if(!program)return null;
            const location=gl.getUniformLocation(program,'uSpread');
            return location===null?null:gl.getUniform(program,location);
          });
          if(gpu!==null)assert(Math.abs(gpu-.70)<.001,'WebGL did not receive the live spread uniform');
          await page.locator('#orb-tuner-reset').click();
          const reset=await page.evaluate(()=>Object.fromEntries(
            ['spread','blend','outer','inner'].map(key=>[key,document.getElementById('orb-tuner-'+key).value])));
          assert(reset.spread==='0.62'&&reset.blend==='0.6'&&reset.outer==='0.24'&&reset.inner==='0.68',
            'Orb gradient reset failed: '+JSON.stringify(reset));
          await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{
            configurable:true,value:{writeText:async value=>{window.__orbCopied=value;}}
          }));
          await page.locator('#orb-tuner-copy').click();
          await page.waitForFunction(()=>window.__orbCopied?.includes('spread=0.62'),null,{timeout:3000});
          assert(await page.locator('#orb-tuner-status').textContent()==='Values copied.',
            'Orb parameter copy did not confirm success');
          await page.keyboard.press('Escape');
          assert(await page.locator('#orb-tuner-panel').isHidden()&&
            await page.evaluate(()=>document.activeElement?.id==='orb-tuner-toggle'),
            'Escape did not close tuner and restore keyboard focus');
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
          assert(!await page.locator('#language-menu').evaluate(el=>el.hidden),'Keyboard Enter did not open language menu');
          await page.keyboard.press('Escape');
          assert(await page.locator('#language-menu').evaluate(el=>el.hidden),'Escape did not close language menu');
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
  // Bilingual layouts at representative wide and narrow viewports (the baseline
  // above remains reduced-motion to keep screenshots deterministic).
  for(const {name,width,height} of [
    {name:'desktop-1440',width:1440,height:900},
    {name:'mobile-430',width:430,height:932},
    {name:'mobile-320',width:320,height:720}
  ]){
    for(const theme of ['light','dark']){
      const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
      page.on('pageerror',err=>failures.push(`zh/${name}/${theme}: browser error ${err.message}`));
      try{
        await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
        await page.evaluate(()=>document.fonts.ready);
        if(theme==='dark')await page.locator('#theme-toggle').click();
        await page.locator('#locale-toggle').click();
        await page.locator('[data-language="zh-CN"]').click();
        await page.waitForFunction(()=>document.documentElement.lang==='zh-CN'&&
          document.getElementById('feature-title')?.textContent?.includes('核心能力'),null,{timeout:5000});
        const data=await page.evaluate(()=>{
          const selectors=['#feature-title','#workspace-title','#clarity-title'];
          return {lang:document.documentElement.lang,
            theme:document.documentElement.classList.contains('v3-theme-dark')?'dark':'light',
            overflow:document.documentElement.scrollWidth-window.innerWidth,
            titles:selectors.map(selector=>{
              const node=document.querySelector(selector);
              return {selector,text:node?.textContent?.trim()||'',
                excess:(node?.scrollWidth||0)-(node?.clientWidth||0)};
            })};
        });
        assert(data.lang==='zh-CN'&&data.theme===theme,`zh/${name}/${theme}: language/theme mismatch`);
        assert(data.overflow<=8,`zh/${name}/${theme}: horizontal document overflow ${data.overflow}px`);
        for(const title of data.titles){
          assert(title.excess<=4,`zh/${name}/${theme}: ${title.selector} text overflows by ${title.excess}px`);
        }
        for(const id of ['overview','v3-features','v3-workspace','v3-clarity']){
          await page.evaluate(id=>{document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});},id);
          await page.waitForTimeout(140);
          const filename=`zh-${name}-${theme}-${id}.png`;
          await page.screenshot({path:path.join(dest,filename),animations:'disabled'});
          captures.push(filename);
        }
        console.log(`[V3 browser] zh/${name}/${theme} overflow=${data.overflow}px titles=${data.titles.length}`);
      }catch(error){
        failures.push(`zh/${name}/${theme}: ${String(error.message||error).slice(0,550)}`);
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
