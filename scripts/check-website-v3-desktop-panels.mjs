#!/usr/bin/env node
// Four real tab panels in the V3 marketing mockup, across engines, themes and widths.
// All controls inside the wallet picture are presentation-only; only the outer tabs interact.
import fs from 'node:fs';
import path from 'node:path';
import {chromium,firefox,webkit} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const output=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-browser');
const names=(process.env.V3_BROWSER_ENGINES||'chromium').split(',').map(x=>x.trim()).filter(Boolean);
const configs=[
  {name:'desktop-light-en',width:1440,height:900,theme:'light',locale:'en'},
  {name:'desktop-dark-zh',width:1440,height:900,theme:'dark',locale:'zh-CN'},
  {name:'tablet-light-en',width:768,height:1024,theme:'light',locale:'en'},
  {name:'zoom-dark-zh',width:720,height:450,theme:'dark',locale:'zh-CN'},
  {name:'mobile-dark-zh',width:390,height:844,theme:'dark',locale:'zh-CN'}
];
const modules=[
  {id:'assets',child:'.dp-balance',count:1,title:'Assets overview',zh:'资产总览'},
  {id:'payments',child:'.dp-payment-grid',count:1,title:'Send & receive',zh:'发送与接收'},
  {id:'swap',child:'.dp-swap-asset',count:2,title:'Swap assets',zh:'资产兑换'},
  {id:'connect',child:'.dp-permissions > div',count:2,title:'App connection',zh:'应用连接请求'}
];
fs.mkdirSync(output,{recursive:true});
const results=[],failures=[];
const check=(ok,message)=>{if(!ok)throw Error(message);};
for(const name of names){
  const engine={chromium,firefox,webkit}[name];
  if(!engine){failures.push('Unknown browser '+name);continue;}
  let browser;
  try{
    browser=await engine.launch({headless:true,
      ...(name==='chromium'&&process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
      ...(name==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
    for(const cfg of configs){
      const page=await browser.newPage({viewport:{width:cfg.width,height:cfg.height},
        reducedMotion:'reduce',deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',err=>errors.push(err.message));
      try{
        await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
        await page.evaluate(()=>document.fonts.ready);
        await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
          document.getElementById('v3-workspace')?.dataset.desktopTab==='desktop-tab-assets',null,{timeout:15000});
        if(cfg.theme==='dark')await page.locator('#theme-toggle').click();
        if(cfg.locale==='zh-CN'){
          await page.locator('#locale-toggle').click();
          await page.locator('[data-language="zh-CN"]').click();
        }
        await page.evaluate(()=>document.getElementById('v3-workspace')?.scrollIntoView({block:'start',behavior:'instant'}));
        for(const m of modules){
          const tag=[name,cfg.name,m.id].join('/');
          await page.locator('#desktop-tab-'+m.id).click();
          const state=await page.evaluate(id=>{
            const root=document.getElementById('v3-workspace');
            const panel=document.getElementById('desktop-panel-'+id);
            const visible=[...root.querySelectorAll('.desktop-panel')].filter(el=>!el.hidden);
            const active=[...root.querySelectorAll('.desktop-tabs [role="tab"]')].filter(el=>el.getAttribute('aria-selected')==='true');
            const side=[...root.querySelectorAll('[data-desktop-nav]')].filter(el=>el.classList.contains('desktop-current'));
            const last=panel?.lastElementChild?.getBoundingClientRect();
            const rect=panel?.getBoundingClientRect();
            return {lang:document.documentElement.lang,
              theme:document.documentElement.classList.contains('v3-theme-dark')?'dark':'light',
              selected:active.map(el=>el.id),visible:visible.map(el=>el.id),
              sidebar:side.map(el=>el.dataset.desktopNav),title:panel?.querySelector('h3')?.textContent?.trim(),
              scrollWidth:panel?.scrollWidth,clientWidth:panel?.clientWidth,
              scrollHeight:panel?.scrollHeight,clientHeight:panel?.clientHeight,
              lastBottom:last?.bottom,panelBottom:rect?.bottom,
              dataset:root.dataset.desktopTab};
          },m.id);
          check(state.lang===cfg.locale&&state.theme===cfg.theme,tag+' theme/language mismatch');
          check(state.selected.length===1&&state.selected[0]==='desktop-tab-'+m.id&&
            state.visible.length===1&&state.visible[0]==='desktop-panel-'+m.id&&
            state.sidebar.length===1&&state.sidebar[0]===m.id&&
            state.dataset==='desktop-tab-'+m.id,tag+' tab/sidebar state '+JSON.stringify(state));
          check(state.title===(cfg.locale==='en'?m.title:m.zh),tag+' unexpected panel title '+state.title);
          check(await page.locator('#desktop-panel-'+m.id+' '+m.child).count()===m.count,
            tag+' missing functional product elements '+m.child);
          check(state.scrollWidth<=state.clientWidth+3,tag+' horizontal panel clipping '+JSON.stringify(state));
          check(state.scrollHeight<=state.clientHeight+5&&state.lastBottom<=state.panelBottom+5,
            tag+' vertical panel clipping '+JSON.stringify(state));
          if(cfg.name!=='tablet-light-en'){
            const file='desktop-preview-'+name+'-'+cfg.name+'-'+m.id+'.png';
            await page.locator('#v3-workspace .workspace-mini').screenshot({
              path:path.join(output,file),animations:'disabled',timeout:20000});
          }
          results.push({tag,status:'PASS',panelHeight:state.clientHeight,
            panelContentHeight:state.scrollHeight});
          console.log('[V3 desktop panels] '+tag+' PASS');
        }
        const tabs=page.locator('#v3-workspace .desktop-tabs [role="tab"]');
        await tabs.nth(0).focus();
        await page.keyboard.press('ArrowRight');
        check(await tabs.nth(1).getAttribute('aria-selected')==='true'&&
          await tabs.nth(1).evaluate(el=>el===document.activeElement),
          name+'/'+cfg.name+' arrow key tab switching broken');
        check(errors.length===0,name+'/'+cfg.name+' JavaScript errors: '+errors.join(' | '));
      }catch(error){
        const message=name+'/'+cfg.name+': '+String(error.message||error).slice(0,800);
        failures.push(message);console.error('[V3 desktop panels] '+message);
      }finally{await page.close();}
    }
  }catch(error){failures.push(name+' setup: '+String(error.message||error).slice(0,700));}
  finally{if(browser)await browser.close();}
}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),
  meaning:'V3 four desktop wallet showcase tabs, bilingual copy, theme and 16:9 content bounds; not wallet functionality',
  results,failures};
fs.writeFileSync(path.join(output,'desktop-panels-results.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 desktop panels] '+report.status+' '+results.length+' modules '+failures.length+' failures');
if(failures.length)process.exitCode=1;
