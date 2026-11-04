#!/usr/bin/env node
// Headed Microsoft Edge, real Windows desktop key events and verified 200% page zoom.
// Fail closed when the CI runner has no interactive desktop/window focus.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';

const output=path.resolve('artifacts/website-v3-windows-zoom');
const publicRoot=path.resolve('public');
const fontsDir=path.join(publicRoot,'fresnica-v3-motion-preview/fonts');
const failures=[],samples=[];
fs.mkdirSync(output,{recursive:true});
fs.mkdirSync(fontsDir,{recursive:true});
for(const weight of [400,500,600,700]){
  const name='roboto-latin-'+weight+'-normal.woff2';
  fs.copyFileSync(path.resolve('node_modules/@fontsource/roboto/files',name),path.join(fontsDir,name));
}
for(const weight of [400,500,700]){
  const name='noto-sans-sc-chinese-simplified-'+weight+'-normal.woff2';
  fs.copyFileSync(path.resolve('src/assets/fonts',name),path.join(fontsDir,name));
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2',
  '.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((request,response)=>{
  try{
    let pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname);
    if(pathname.endsWith('/'))pathname+='index.html';
    const file=path.resolve(publicRoot,'.'+pathname);
    if(!file.startsWith(publicRoot+path.sep)){response.writeHead(403);response.end();return;}
    fs.readFile(file,(error,data)=>{
      if(error){response.writeHead(404);response.end('Not found');return;}
      response.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream'});
      response.end(data);
    });
  }catch{response.writeHead(400);response.end();}
});
const {chromium}=createRequire(path.resolve('.v3-playwright/package.json'))('playwright');
const check=(ok,message)=>{if(!ok)throw new Error(message);};
const bounds=()=>({width:innerWidth,dpr:devicePixelRatio,visualScale:visualViewport.scale,
  cssZoom:getComputedStyle(document.documentElement).zoom});
let initial,zoom,browser,page,errors=[];
try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+'/fresnica-v3-motion-preview/';
  browser=await chromium.launch({headless:false,channel:'msedge',args:[
    '--no-first-run','--no-default-browser-check','--window-position=0,0','--window-size=1500,980'
  ]});
  page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed'),null,{timeout:12000});
  await page.locator('#locale-toggle').focus();
  await page.bringToFront();
  initial=await page.evaluate(bounds);
  check(initial.width===1440,'Unexpected baseline CSS width '+initial.width);
  execFileSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',
    'scripts/v3-native-zoom-windows.ps1'],{stdio:'inherit',timeout:20000});
  await page.waitForFunction(state=>innerWidth<=state.width*.55&&devicePixelRatio>=state.dpr*1.9,
    initial,{timeout:7000});
  zoom=await page.evaluate(bounds);
  check(Math.abs(zoom.width-initial.width/2)<=2,'Not 200% native page zoom '+JSON.stringify({initial,zoom}));
  check(Math.abs(zoom.dpr/initial.dpr-2)<.04,'Native zoom did not double DPR '+JSON.stringify(zoom));
  check(Number(zoom.cssZoom)===1&&Math.abs(zoom.visualScale-1)<.01,
    'CSS zoom or visual pinch scale must remain 1 '+JSON.stringify(zoom));
  console.log('[V3 Windows native zoom] baseline '+JSON.stringify(initial)+' native '+JSON.stringify(zoom));
  for(const lang of ['en','zh-CN']){
    if(lang==='zh-CN'){
      await page.locator('#locale-toggle').click();
      await page.locator('[data-language="zh-CN"]').click();
    }
    for(const theme of ['light','dark']){
      if(theme==='dark'||(lang==='zh-CN'&&theme==='light'))await page.locator('#theme-toggle').click();
      for(const scene of ['overview','v3-features','v3-workspace']){
        await page.evaluate(id=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'}),scene);
        await page.waitForTimeout(140);
        const state=await page.evaluate(()=>{
          const rect=el=>{const r=el?.getBoundingClientRect();
            return r&&{top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height};};
          return {width:innerWidth,lang:document.documentElement.lang,
            theme:document.documentElement.classList.contains('v3-theme-dark')?'dark':'light',
            overflow:document.documentElement.scrollWidth-innerWidth,
            controls:['scene-menu-button','locale-toggle','theme-toggle','download-menu-button']
              .map(id=>({id,rect:rect(document.getElementById(id))})),
            section:rect(document.getElementById('v3-workspace')),
            cta:rect(document.querySelector('#v3-workspace .desktop-download')),
            mini:rect(document.querySelector('#v3-workspace .workspace-mini')),
            tabs:rect(document.querySelector('#v3-workspace .desktop-tabs')),
            disabled:[...document.querySelectorAll('.download-action')].every(b=>b.disabled)};
        });
        const key=lang+'/'+theme+'/'+scene;
        check(state.width===zoom.width,'Viewport changed unexpectedly '+key);
        check(state.lang===lang&&state.theme===theme,'Locale/theme mismatch '+key);
        check(state.overflow<=8,'Horizontal overflow '+key+': '+state.overflow);
        check(state.disabled,'Unreleased downloads enabled '+key);
        for(const c of state.controls){
          check(c.rect&&c.rect.width>=39&&c.rect.height>=39&&
            c.rect.left>=-2&&c.rect.right<=state.width+2,
            'Header control clipped '+key+' '+c.id+' '+JSON.stringify(c.rect));
        }
        if(scene==='v3-workspace'){
          check(state.cta&&state.section&&state.cta.top>=state.section.top+12&&
            state.cta.bottom<=state.section.bottom-12,
            'Desktop CTA clipped '+key);
          check(state.mini&&state.mini.top-state.section.top>=70,
            'Desktop preview under header '+key+' '+JSON.stringify(state.mini));
          check(state.tabs&&state.tabs.top-state.cta.bottom>=12,
            'Desktop CTA overlaps tab strip '+key);
        }
        const filename='windows-edge-native200-'+lang+'-'+theme+'-'+scene+'.png';
        await page.screenshot({path:path.join(output,filename),animations:'disabled'});
        samples.push({lang,theme,scene,file:filename,overflow:state.overflow,
          miniTop:scene==='v3-workspace'?Math.round(state.mini.top-state.section.top):null});
        console.log('[V3 Windows native zoom] '+key+' PASS');
      }
    }
  }
  await page.locator('#scene-menu-button').focus();
  await page.keyboard.press('Enter');
  check(await page.locator('#scene-menu').evaluate(e=>e.classList.contains('is-open')),
    'Cannot open chapter menu at native 200%');
  await page.keyboard.press('Escape');
  check(await page.evaluate(()=>document.activeElement?.id==='scene-menu-button'),
    'Menu focus not returned after Escape');
  check(errors.length===0,'Browser script exceptions: '+errors.join(' | ').slice(0,500));
}catch(error){failures.push(String(error.message||error).slice(0,1200));}
finally{
  if(page)await page.close().catch(()=>{});
  if(browser)await browser.close().catch(()=>{});
  if(server.listening)await new Promise(resolve=>server.close(resolve));
  const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),
    meaning:'Real Windows OS keyboard Ctrl+plus in headed Edge, verified CSS viewport/DPR at 200%; not Safari or hardware GPU sign-off',
    initial,nativeZoom:zoom,samples,errors,failures};
  fs.writeFileSync(path.join(output,'windows-native-zoom-results.json'),JSON.stringify(report,null,2)+'\n');
  console.log('[V3 Windows native zoom] '+report.status+' '+samples.length+' screenshots '+failures.length+' failures');
  for(const error of failures)console.error('[V3 Windows native zoom] '+error);
  if(failures.length)process.exitCode=1;
}
