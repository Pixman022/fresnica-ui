#!/usr/bin/env node
// Four real tab panels in the V3 marketing mockup, across engines, themes and widths.
// Asset quick actions switch preview tabs; no wallet operation occurs in the mockup.
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
  {id:'assets',child:'.dp-balance',count:1,detail:'.dp-asset-row',details:2,title:'Assets Overview',zh:'资产总览'},
  {id:'payments',child:'.dp-payment-grid',count:1,detail:'.dp-field',details:2,title:'Payments',zh:'收付款'},
  {id:'swap',child:'.dp-swap-asset',count:2,detail:'.dp-preview-action',details:1,title:'Swap',zh:'兑换'},
  {id:'connect',child:'.dp-permissions > div',count:1,detail:'.dp-preview-action',details:1,title:'Connect',zh:'连接'}
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
        if(cfg.width<=680){
          await page.locator('#m60-menu-toggle').click();
          check(await page.locator('.m60-section-links a').count()===9&&
            await page.locator('.m60-download-links a').count()===2,
            name+'/'+cfg.name+' compact drawer missing destinations');
          if(cfg.theme==='dark')await page.locator('[data-m60-theme]').click();
          if(cfg.locale==='zh-CN')await page.locator('[data-m60-language="zh-CN"]').click();
          await page.keyboard.press('Escape');
          check(await page.evaluate(()=>!document.documentElement.classList.contains('m60-menu-open')),
            name+'/'+cfg.name+' drawer remained open after locale/theme selection');
        }else{
          if(cfg.theme==='dark')await page.locator('#theme-toggle').click();
          if(cfg.locale==='zh-CN'){
            await page.locator('#locale-toggle').click();
            await page.locator('[data-language="zh-CN"]').click();
          }
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
          check(await page.locator('#desktop-panel-'+m.id+' '+m.detail).count()===m.details,
            tag+' should show only essential product details '+m.detail);
          if(m.id==='assets'){
            check(await page.locator('#desktop-panel-assets .dp-asset-row:visible').count()===2,
              tag+' both asset rows must remain visible in the compact preview');
            const chart=await page.locator('#desktop-panel-assets .dp-portfolio-chart').evaluate(svg=>{
              const line=svg.querySelector('.dp-trend-line');
              const markers=[...svg.querySelectorAll('.dp-trend-points circle')];
              const total=line.getTotalLength();
              const distances=markers.map(marker=>{
                const x=Number(marker.getAttribute('cx')),y=Number(marker.getAttribute('cy'));
                let min=Infinity;
                for(let j=0;j<=1000;j++){
                  const p=line.getPointAtLength(total*j/1000);
                  min=Math.min(min,Math.hypot(p.x-x,p.y-y));
                }
                return min;
              });
              const matrix=svg.getScreenCTM();
              const scaleX=Math.hypot(matrix.a,matrix.b),scaleY=Math.hypot(matrix.c,matrix.d);
              return {curved:line.getAttribute('d').includes('C'),
                count:markers.length,maxDistance:Math.max(...distances),
                markerShapeRatio:scaleX/scaleY};
            });
            check(chart.curved&&chart.count===5&&chart.maxDistance<.9&&Math.abs(chart.markerShapeRatio-1)<.02,
              tag+' chart points must lie on the smooth curve and remain circular '+JSON.stringify(chart));
            check(await page.locator('#desktop-panel-assets .dp-quick-action').count()===3,
              tag+' missing Send / Receive / Swap actions');
          }
          if(m.id==='payments'){
            check(await page.locator('#desktop-panel-payments .dp-payment-amount').count()===1&&
              await page.locator('#desktop-panel-payments .dp-receive-address').count()===1,
              tag+' Send amount and Receive address must both be represented');
          }
          if(m.id==='swap'){
            check(await page.locator('#desktop-panel-swap .dp-swap-shell').count()===1&&
              (await page.locator('#desktop-panel-swap .dp-swap-hint').innerText()).length>5,
              tag+' Swap must explain that the displayed quote is a preview');
          }
          if(m.id==='connect'){
            check(await page.locator('#desktop-panel-connect .dp-connect-shell').count()===1&&
              await page.locator('#desktop-panel-connect .dp-request-tag').count()===1,
              tag+' Connect must display app identity, request and permission review');
          }
          if(cfg.theme==='dark'&&m.id!=='assets'){
            const bg=await page.locator('#desktop-panel-'+m.id+
              (m.id==='payments'?' .dp-payment-card':m.id==='swap'?' .dp-swap-shell':' .dp-connect-shell'))
              .evaluate(el=>getComputedStyle(el).backgroundColor);
            const rgb=bg.match(/[0-9.]+/g)?.slice(0,3).map(Number)||[];
            check(rgb.length===3&&Math.max(...rgb)-Math.min(...rgb)<=8,
              tag+' dark preview card must use neutral gray, not tinted green '+bg);
          }
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
        // Quick actions should navigate preview sections, never trigger wallet operations.
        const actions=[{label:'Send',tab:'payments'},{label:'Receive',tab:'payments'},{label:'Swap',tab:'swap'}];
        for(const [index,{label,tab}] of actions.entries()){
          await page.locator('#desktop-tab-assets').click();
          await page.locator('#desktop-panel-assets .dp-quick-action').nth(index).click();
          check(await page.locator('#desktop-tab-'+tab).getAttribute('aria-selected')==='true',
            name+'/'+cfg.name+' '+label+' did not navigate to '+tab+' preview');
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
