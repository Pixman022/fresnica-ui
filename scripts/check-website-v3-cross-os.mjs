#!/usr/bin/env node
// V3 cross-OS browser smoke gate. macOS WebKit is not the branded Safari app.
// Browser-engine layout and motion checks are not native 200% zoom or GPU approval.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';

const osLabel=process.env.V3_OS_LABEL||process.platform;
const engineNames=(process.env.V3_OS_BROWSERS||'webkit').split(',').map(x=>x.trim()).filter(Boolean);
const out=path.resolve('artifacts/website-v3-os',osLabel);
const publicRoot=path.resolve('public');
const previewRoot=path.join(publicRoot,'fresnica-v3-motion-preview');
const failures=[],observations=[];
fs.mkdirSync(out,{recursive:true});
fs.mkdirSync(path.join(previewRoot,'fonts'),{recursive:true});
for(const weight of [400,500,600,700]){
  fs.copyFileSync(path.resolve('node_modules/@fontsource/roboto/files/roboto-latin-'+weight+'-normal.woff2'),
    path.join(previewRoot,'fonts/roboto-latin-'+weight+'-normal.woff2'));
}
for(const weight of [400,500,700]){
  const name='noto-sans-sc-chinese-simplified-'+weight+'-normal.woff2';
  fs.copyFileSync(path.resolve('src/assets/fonts',name),path.join(previewRoot,'fonts',name));
}
const requirePlaywright=createRequire(path.resolve('.v3-playwright','package.json'));
const {chromium,firefox,webkit}=requirePlaywright('playwright');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2',
  '.png':'image/png','.jpg':'image/jpeg','.json':'application/json'};
const server=http.createServer((req,res)=>{
  try{
    let urlPath=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    if(urlPath.endsWith('/'))urlPath+='index.html';
    const filename=path.resolve(publicRoot,'.'+urlPath);
    if(!filename.startsWith(publicRoot+path.sep)){
      res.writeHead(403);res.end();return;
    }
    fs.readFile(filename,(error,bytes)=>{
      if(error){res.writeHead(404);res.end('Not found');return;}
      res.writeHead(200,{'Content-Type':mime[path.extname(filename).toLowerCase()]||'application/octet-stream'});
      res.end(bytes);
    });
  }catch(error){res.writeHead(400);res.end('Bad request');}
});
const reportPath=path.join(out,'cross-os-results.json');
const check=(ok,message)=>{if(!ok)throw new Error(message);};
let base='',serverStarted=false;
const run=async(tag,fn)=>{
  try{
    const data=await fn();
    observations.push({tag,status:'PASS',...data});
    console.log('[V3 cross-OS] '+tag+' PASS');
  }catch(error){
    const message=tag+': '+String(error.message||error).slice(0,650);
    failures.push(message);
    console.error('[V3 cross-OS] '+message);
  }
};

try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  serverStarted=true;
  base='http://127.0.0.1:'+server.address().port+'/fresnica-v3-motion-preview/';
  for(const name of engineNames){
    const engine=name==='webkit'?webkit:name==='firefox'?firefox:name==='msedge'?chromium:null;
    if(!engine){failures.push('Unsupported browser '+name);continue;}
    let browser;
    try{
      browser=await engine.launch({headless:true,...(name==='msedge'?{channel:'msedge'}:{})});
      for(const config of [
        {name:'desktop',width:1440,height:900},
        {name:'mobile',width:390,height:844},
        {name:'zoom-equivalent',width:720,height:450}
      ]){
        for(const theme of ['light','dark']){
          const tag=name+'/'+config.name+'/'+theme;
          await run(tag,async()=>{
            const page=await browser.newPage({viewport:{width:config.width,height:config.height},reducedMotion:'reduce'});
            const errors=[];
            page.on('pageerror',error=>errors.push(error.message));
            try{
              await page.goto(base,{waitUntil:'domcontentloaded',timeout:40000});
              await page.evaluate(()=>document.fonts.ready);
              await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed'),null,{timeout:12000});
              if(theme==='dark')await page.locator('#theme-toggle').click();
              const data=await page.evaluate(()=>{
                const controls=['scene-menu-button','locale-toggle','theme-toggle','download-menu-button']
                  .map(id=>{const r=document.getElementById(id)?.getBoundingClientRect();
                    return {id,width:r?.width,height:r?.height,left:r?.left,right:r?.right};});
                const quickIcons=[...document.querySelectorAll('#v3-availability .phone-quick > span')].map(card=>{
                  const icon=card.querySelector('.phone-quick-icon'),svg=icon?.querySelector('svg');
                  const style=icon&&getComputedStyle(icon),r=icon?.getBoundingClientRect();
                  const inner=svg?.getBoundingClientRect(),outer=card.getBoundingClientRect();
                  return {padding:style?.paddingTop,border:style?.borderTopWidth,
                    width:r?.width,height:r?.height,
                    centered:r&&inner&&Math.abs(r.left+r.width/2-inner.left-inner.width/2)<=1&&
                      Math.abs(r.top+r.height/2-inner.top-inner.height/2)<=1&&
                      Math.abs(r.left+r.width/2-outer.left-outer.width/2)<=2};
                });
                const scene=document.querySelector('#v3-workspace')?.getBoundingClientRect();
                const cta=document.querySelector('#v3-workspace .desktop-download')?.getBoundingClientRect();
                const mini=document.querySelector('#v3-workspace .workspace-mini')?.getBoundingClientRect();
                return {theme:document.documentElement.classList.contains('v3-theme-dark')?'dark':'light',
                  overflow:document.documentElement.scrollWidth-innerWidth,controls,quickIcons,
                  cards:document.querySelectorAll('.feature-card').length,
                  firstCardLeft:document.querySelector('#v3-features .feature-card')?.getBoundingClientRect().left,
                  disabled:[...document.querySelectorAll('.download-action')].every(el=>el.disabled),
                  reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
                  cta:scene&&cta?{top:cta.top-scene.top,bottom:cta.bottom-scene.top,sceneHeight:scene.height}:null,
                  mini:scene&&mini?{top:mini.top-scene.top,width:mini.width,height:mini.height}:null};
              });
              check(data.theme===theme&&data.cards===5&&data.disabled&&data.reduced,tag+' base contract');
              check(data.quickIcons.length===3&&data.quickIcons.every(icon=>
                parseFloat(icon.padding)===0&&parseFloat(icon.border)===0&&
                Math.abs(icon.width-22)<=1&&Math.abs(icon.height-22)<=1&&icon.centered),
                tag+' Send/Receive/Swap icon misaligned '+JSON.stringify(data.quickIcons));
              check(data.overflow<=8,tag+' horizontal overflow '+data.overflow);
              for(const c of data.controls){
                check(c.width>=39&&c.height>=39,tag+' '+c.id+' target too small');
                check(c.left>=-2&&c.right<=config.width+2,tag+' '+c.id+' outside viewport');
              }
              if(config.width<=430)check(data.firstCardLeft>=10,tag+' first card clipped');
              if(config.width>=681)check(data.cta&&data.cta.top>=12&&data.cta.bottom<=data.cta.sceneHeight-12,
                tag+' desktop CTA clipped '+JSON.stringify(data.cta));
              // On 720x450, the app preview must clear the fixed top navigation.
              // This also catches a WebKit intrinsic grid height overriding 16:9.
              if(config.name==='zoom-equivalent')check(data.mini&&data.mini.top>=70,
                tag+' desktop preview under header '+JSON.stringify(data.mini));
              if(config.name==='desktop'&&theme==='light'){
                for(const [button,menu,hidden] of [
                  ['scene-menu-button','scene-menu',false],
                  ['download-menu-button','download-menu',false],
                  ['locale-toggle','language-menu',true]]){
                  await page.locator('#'+button).focus();
                  await page.keyboard.press('Enter');
                  check(await page.locator('#'+menu).evaluate((el,h)=>h?!el.hidden:el.classList.contains('is-open'),hidden),
                    tag+' keyboard Enter failed for '+menu);
                  await page.keyboard.press('Escape');
                  check(await page.locator('#'+menu).evaluate((el,h)=>h?el.hidden:!el.classList.contains('is-open'),hidden),
                    tag+' keyboard Escape failed for '+menu);
                  check(await page.evaluate(id=>document.activeElement?.id===id,button),
                    tag+' focus not restored to '+button);
                }
                await page.evaluate(()=>document.getElementById('v3-security')?.scrollIntoView({block:'start',behavior:'instant'}));
                await page.screenshot({path:path.join(out,name+'-desktop-light-security.png'),animations:'disabled'});
              }
              await page.locator('#locale-toggle').click();
              await page.locator('[data-language="zh-CN"]').click();
              const zh=await page.evaluate(()=>({lang:document.documentElement.lang,
                title:document.getElementById('feature-title')?.textContent,
                overflow:document.documentElement.scrollWidth-innerWidth}));
              check(zh.lang==='zh-CN'&&zh.title?.includes('核心能力')&&zh.overflow<=8,tag+' Chinese layout');
              if(config.name==='mobile'&&theme==='dark'){
                await page.evaluate(()=>document.getElementById('v3-features')?.scrollIntoView({block:'start',behavior:'instant'}));
                await page.screenshot({path:path.join(out,name+'-mobile-dark-zh-features.png'),animations:'disabled'});
              }
              if(config.name==='zoom-equivalent'&&theme==='dark'){
                await page.evaluate(()=>document.getElementById('v3-workspace')?.scrollIntoView({block:'start',behavior:'instant'}));
                await page.screenshot({path:path.join(out,name+'-zoom-equivalent-dark-zh-workspace.png'),animations:'disabled'});
              }
              // Four desktop modules should remain readable on each native OS engine.
              if((config.name==='desktop'&&theme==='light')||
                (config.name==='zoom-equivalent'&&theme==='dark')||
                (config.name==='mobile'&&theme==='dark')){
                for(const id of ['assets','payments','swap','connect']){
                  await page.locator('#desktop-tab-'+id).click();
                  const panel=await page.evaluate(id=>{
                    const scene=document.getElementById('v3-workspace');
                    const el=document.getElementById('desktop-panel-'+id);
                    const r=el.getBoundingClientRect(),last=el.lastElementChild?.getBoundingClientRect();
                    return {selected:scene.dataset.desktopTab,
                      scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,
                      scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,
                      lastBottom:last?.bottom,bottom:r.bottom,
                      sidebar:[...scene.querySelectorAll('[data-desktop-nav].desktop-current')].map(x=>x.dataset.desktopNav)};
                  },id);
                  check(panel.selected==='desktop-tab-'+id&&panel.sidebar.length===1&&
                    panel.sidebar[0]===id&&panel.scrollHeight<=panel.clientHeight+5&&
                    panel.scrollWidth<=panel.clientWidth+3&&panel.lastBottom<=panel.bottom+5,
                    tag+' '+id+' desktop panel clipped or desynchronized '+JSON.stringify(panel));
                  if(config.name!=='mobile'){
                    await page.locator('#v3-workspace .workspace-mini').screenshot({
                      path:path.join(out,name+'-'+config.name+'-'+theme+'-zh-desktop-'+id+'.png'),
                      animations:'disabled'});
                  }
                }
              }
              check(errors.length===0,tag+' browser errors '+errors.join('; '));
              return {overflow:data.overflow,zhOverflow:zh.overflow};
            }finally{await page.close();}
          });
        }
      }
      await run(name+'/normal-motion-portal',async()=>{
        const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        try{
          await page.goto(base,{waitUntil:'domcontentloaded',timeout:40000});
          await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed')&&
            !!document.querySelector('.m24-portal'),null,{timeout:12000});
          await page.mouse.move(150,500);
          await page.mouse.wheel(0,170);
          await page.waitForFunction(()=>document.documentElement.dataset.m14Active==='v3-ecosystem',null,{timeout:6500});
          await page.waitForTimeout(1400);
          await page.mouse.wheel(0,170);
          await page.waitForFunction(()=>document.querySelector('.m24-portal')?.style.display==='block',null,{timeout:2500});
          await page.waitForFunction(()=>document.documentElement.dataset.m14Active==='v3-availability'&&
            document.querySelector('.m24-portal')?.style.display==='none',null,{timeout:6500});
          await page.waitForTimeout(1550);
          const art=await page.evaluate(()=>{
            const el=document.querySelector('#v3-availability .download-art'),r=el.getBoundingClientRect();
            const st=getComputedStyle(el);
            return {scene:document.documentElement.dataset.m14Active,phoneArea:[r.width,r.height],
              visibility:st.visibility,opacity:st.opacity,filter:st.filter};
          });
          check(art.scene==='v3-availability'&&art.phoneArea[0]>150&&art.phoneArea[1]>180&&
            art.visibility==='visible'&&Number(art.opacity)>.9&&!/opacity\(0(?:\.0+)?\)/.test(art.filter),
            name+' phone artwork did not settle '+JSON.stringify(art));
          check(errors.length===0,name+' normal motion browser errors '+errors.join('; '));
          await page.screenshot({path:path.join(out,name+'-motion-download.png'),timeout:20000});
          return art;
        }finally{await page.close();}
      });
    }catch(error){failures.push(name+' setup: '+String(error.message||error).slice(0,800));}
    finally{if(browser)await browser.close();}
  }
}finally{
  if(serverStarted)await new Promise(resolve=>server.close(resolve));
  const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),os:osLabel,
    browsers:engineNames,scope:'OS-specific Playwright engines / Edge, not native 200% zoom, actual Safari or GPU sign-off',
    observations,failures};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
  console.log('[V3 cross-OS] '+report.status+' '+observations.length+' checks '+failures.length+' failures');
  if(failures.length)process.exitCode=1;
}
