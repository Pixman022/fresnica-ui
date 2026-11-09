#!/usr/bin/env node
// Verify the hero's existing gradient fallback recovers after GPU context reset.
import {chromium} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const browser=await chromium.launch({headless:true,
  ...(process.env.V3_CHROME_PATH?{executablePath:process.env.V3_CHROME_PATH}:{}),
  args:['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>document.documentElement.classList.contains('m10-framed'));
  const lost=await page.evaluate(async()=>{
    const canvas=document.getElementById('orb-canvas');
    const gl=canvas.getContext('webgl2');
    const extension=gl?.getExtension('WEBGL_lose_context');
    if(!extension)return {supported:false,reason:gl?'WEBGL_lose_context unavailable':'WebGL2 unavailable'};
    const event=new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>reject(Error('webglcontextlost event missing')),3500);
      canvas.addEventListener('webglcontextlost',()=>{clearTimeout(timeout);resolve();},{once:true});
    });
    extension.loseContext();
    await event;
    return {supported:true,contextLost:gl.isContextLost(),
      canvasHidden:canvas.style.display==='none',
      fallbackVisible:document.getElementById('fallback-orb').style.display==='block'};
  });
  if(!lost.supported){
    console.log('[V3 WebGL recovery] SKIP: '+lost.reason+' (not a passing recovery test)');
    process.exitCode=0;
  }else{
    if(!lost.contextLost||!lost.canvasHidden||!lost.fallbackVisible)
      throw Error('Lost context did not show fallback: '+JSON.stringify(lost));
    // A viewport resize while WebGL is unavailable must not throw or
    // leave the restored canvas with a 2x2 drawing buffer.
    await page.setViewportSize({width:1280,height:800});
    // WEBGL_lose_context must dispatch restored before the UI recovers.
    await page.evaluate(async()=>{
      const canvas=document.getElementById('orb-canvas');
      const gl=canvas.getContext('webgl2');
      const restored=new Promise((resolve,reject)=>{
        const timeout=setTimeout(()=>reject(Error('webglcontextrestored event missing')),4000);
        canvas.addEventListener('webglcontextrestored',()=>{clearTimeout(timeout);resolve();},{once:true});
      });
      gl.getExtension('WEBGL_lose_context').restoreContext();
      await restored;
    });
    await page.waitForFunction(()=>{
      const canvas=document.getElementById('orb-canvas');
      const gl=canvas.getContext('webgl2');
      const fallback=document.getElementById('fallback-orb');
      return !gl.isContextLost()&&canvas.style.display!=='none'&&
        fallback.style.display==='none'&&canvas.width>100&&canvas.height>100&&
        !!gl.getParameter(gl.CURRENT_PROGRAM)&&!!gl.getParameter(gl.VERTEX_ARRAY_BINDING);
    },null,{timeout:4000});
    if(errors.length)throw Error('Page errors after recovery: '+errors.join(' | '));
    console.log('[V3 WebGL recovery] PASS: loss fallback and restored shader mesh');
  }
}finally{await browser.close();}
