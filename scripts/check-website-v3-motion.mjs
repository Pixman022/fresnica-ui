#!/usr/bin/env node
// Supplemental non-reduced motion and browser CSS-zoom regression tests.
// CSS zoom is a layout approximation, NOT Chrome's native 200% page zoom.
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const dest=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-browser');
fs.mkdirSync(dest,{recursive:true});
const failures=[],observations=[];
const check=(ok,message)=>{if(!ok)failures.push(message);};
const browser=await chromium.launch({
  headless:true,
  ...(process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
  args:['--no-sandbox','--disable-dev-shm-usage']
});
const page=await browser.newPage({viewport:{width:430,height:932},reducedMotion:'no-preference'});
page.on('pageerror',error=>failures.push('Browser error: '+error.message));
const run=async(name,fn)=>{
  try{await fn();console.log('[V3 motion] checked '+name);}
  catch(error){failures.push(name+': '+String(error.message||error).slice(0,500));}
};
const showCard=async index=>{
  await page.locator('#v3-features').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
  await page.locator(`#v3-features .feature-card:nth-child(${index})`).evaluate(card=>{
    const reel=document.getElementById('feature-window');
    const box=reel.getBoundingClientRect(),target=card.getBoundingClientRect();
    reel.scrollBy({left:target.left-box.left-(box.width-target.width)/2,behavior:'instant'});
  });
  await page.waitForTimeout(420);
};
const screenshot=async name=>page.screenshot({path:path.join(dest,name),timeout:15000});

try{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  check(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: no-preference)').matches),
    'Normal motion mode was not enabled');

  await run('trend-dot-path',async()=>{
    await showCard(1);
    await page.locator('#v3-features .feature-card:first-child').hover();
    await page.waitForTimeout(220);
    const data=await page.evaluate(()=>{
      const path=document.querySelector('#m45-asset-trend-path');
      const dot=document.querySelector('.mini-trend-dot');
      const off=parseFloat(getComputedStyle(path).strokeDashoffset);
      const progress=Number.isFinite(off)?Math.max(0,Math.min(1,1-off)):1;
      const point=path.getPointAtLength(path.getTotalLength()*progress);
      return {distance:Math.hypot(point.x-Number(dot.getAttribute('cx')),point.y-Number(dot.getAttribute('cy'))),progress};
    });
    observations.push({test:'trend',...data});
    check(data.distance<4.5,'Trend dot is not on its SVG curve ('+data.distance.toFixed(2)+' SVG units)');
    await screenshot('motion-trend.png');
  });
  await run('send-animation',async()=>{
    await showCard(2);
    await page.locator('.mini-send-button').click();
    check(await page.locator('.mini-send-demo').evaluate(x=>x.classList.contains('is-sending')),'SEND animation did not start');
    const name=await page.locator('.mini-send-button').evaluate(x=>getComputedStyle(x).animationName);
    check(name.includes('m33-send-press'),'SEND animation not visible in computed styles: '+name);
    await page.waitForFunction(()=>!document.querySelector('.mini-send-demo')?.classList.contains('is-sending'),null,{timeout:5000});
    observations.push({test:'send',animationName:name,reset:true});
  });
  await run('swap-success',async()=>{
    await showCard(3);
    await page.locator('.mini-swap-button').click();
    check(await page.locator('.mini-swap-preview').evaluate(x=>x.classList.contains('is-playing')),'Swap animation did not start');
    const name=await page.locator('.mini-swap-success').evaluate(x=>getComputedStyle(x).animationName);
    check(name.includes('m37-success-popup'),'Swap success animation not active: '+name);
    await page.waitForFunction(()=>!document.querySelector('.mini-swap-preview')?.classList.contains('is-playing'),null,{timeout:6000});
    observations.push({test:'swap',animationName:name,reset:true});
  });
  await run('dapp-sync-return',async()=>{
    await showCard(4);
    await page.locator('#v3-features .feature-card:nth-child(4)').evaluate(el=>
      el.dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'})));
    await page.waitForFunction(()=>document.querySelector('.dapp-hive')?.classList.contains('is-playing'),null,{timeout:1600});
    await page.waitForFunction(()=>document.querySelector('.dapp-hive')?.classList.contains('is-absorbing'),null,{timeout:3800});
    await page.waitForFunction(()=>document.querySelector('.dapp-hive')?.classList.contains('is-clearing'),null,{timeout:1500});
    await screenshot('motion-dapp-hub-hidden.png');
    await page.waitForFunction(()=>document.querySelector('.dapp-hive')?.classList.contains('is-returning'),null,{timeout:1600});
    const all=await page.locator('.dapp-node').evaluateAll(nodes=>nodes.every(el=>getComputedStyle(el).animationName.includes('m41-hive-return')));
    check(all,'DApp center and surrounding icons do not return together');
    await screenshot('motion-dapp-return.png');
    await page.waitForFunction(()=>!document.querySelector('.dapp-hive')?.classList.contains('is-playing'),null,{timeout:2500});
    observations.push({test:'dapp',allReturnTogether:all,reset:true});
  });
  await run('activity-scroll',async()=>{
    await showCard(5);
    await page.locator('#v3-features .feature-card:nth-child(5)').evaluate(el=>
      el.dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'})));
    await page.waitForFunction(()=>document.querySelector('.activity-demo')?.classList.contains('is-playing'),null,{timeout:1200});
    const animation=await page.locator('.activity-entry.is-new').evaluate(x=>getComputedStyle(x).animationName);
    check(animation.includes('m43-activity-new'),'Activity scroll animation not active: '+animation);
    await page.waitForTimeout(1250);
    await screenshot('motion-activity-receipt.png');
    await page.waitForFunction(()=>!document.querySelector('.activity-demo')?.classList.contains('is-playing'),null,{timeout:2500});
    observations.push({test:'activity',animationName:animation,reset:true});
  });

  // Practical browser layout stress test. Not native Chrome page zoom.
  await run('css-zoom-200-simulation',async()=>{
    const zoom=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
    try{
      await zoom.goto(base,{waitUntil:'domcontentloaded'});
      await zoom.evaluate(()=>{document.documentElement.style.zoom='2';});
      await zoom.waitForTimeout(500);
      const state=await zoom.evaluate(()=>{
        const controlIds=['scene-menu-button','locale-toggle','theme-toggle','download-menu-button'];
        const controls=controlIds.map(id=>{
          const r=document.getElementById(id)?.getBoundingClientRect();
          return {id,left:r?.left,right:r?.right,width:r?.width};
        });
        return {computedZoom:getComputedStyle(document.documentElement).zoom,scrollWidth:document.documentElement.scrollWidth,
          viewport:window.innerWidth,controls};
      });
      observations.push({test:'cssZoom2x',...state,nativeZoom:false});
      check(Number(state.computedZoom)>=1.99,'CSS 2x zoom not applied');
      check(state.scrollWidth<=state.viewport+8,
        'CSS zoom 2x causes document horizontal overflow: '+(state.scrollWidth-state.viewport)+'px');
      for(const c of state.controls)check(c.left>=-2&&c.right<=state.viewport+2,
        'CSS zoom 2x clips '+c.id+' offscreen ('+c.left+'-'+c.right+')');
      await zoom.screenshot({path:path.join(dest,'css-zoom200-approx.png'),animations:'disabled'});
    }finally{await zoom.close();}
  });
}finally{
  await page.close();
  await browser.close();
}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),url:base,
  meaning:'Automated no-preference motion states + CSS 2x layout approximation, not native browser zoom',
  observations,failures};
fs.writeFileSync(path.join(dest,'motion-results.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 motion] '+report.status+'; '+observations.length+' observations; '+failures.length+' findings');
for(const failure of failures)console.error('[V3 motion] '+failure);
if(failures.length)process.exitCode=1;
