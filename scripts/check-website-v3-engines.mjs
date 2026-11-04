#!/usr/bin/env node
// Linux Firefox/WebKit compatibility smoke checks, not native OS sign-off.
import fs from 'node:fs';
import path from 'node:path';
import {firefox,webkit} from 'playwright';

const base=process.env.V3_PREVIEW_URL||'http://127.0.0.1:4173/fresnica-v3-motion-preview/';
const output=path.resolve(process.env.V3_QA_OUTPUT||'artifacts/website-v3-engines');
const setups=[{name:'desktop',width:1440,height:900},{name:'tablet',width:768,height:1024},
  {name:'mobile',width:390,height:844}];
const failures=[],results=[];
fs.mkdirSync(output,{recursive:true});
function check(ok,message){if(!ok)throw new Error(message);}
for(const [name,engine] of Object.entries({firefox,webkit})){
  let browser;
  try{
    browser=await engine.launch({headless:true});
    for(const config of setups){
      for(const theme of ['light','dark']){
        const tag=name+'/'+config.name+'/'+theme;
        const page=await browser.newPage({viewport:{width:config.width,height:config.height},
          reducedMotion:'reduce',deviceScaleFactor:1});
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        try{
          await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
          await page.evaluate(()=>document.fonts.ready);
          await page.waitForTimeout(240);
          if(theme==='dark')await page.locator('#theme-toggle').click();
          const state=await page.evaluate(()=>{
            const controls=['scene-menu-button','locale-toggle','theme-toggle','download-menu-button']
              .map(id=>{const rect=document.getElementById(id)?.getBoundingClientRect();
                return {id,width:rect?.width,height:rect?.height,left:rect?.left,right:rect?.right};});
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
            const section=document.querySelector('#v3-workspace')?.getBoundingClientRect();
            const cta=document.querySelector('#v3-workspace .desktop-download')?.getBoundingClientRect();
            return {theme:document.documentElement.classList.contains('v3-theme-dark')?'dark':'light',
              lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth-innerWidth,
              cards:document.querySelectorAll('.feature-card').length,controls,quickIcons,
              cardLeft:document.querySelector('#v3-features .feature-card')?.getBoundingClientRect().left,
              reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
              disabled:[...document.querySelectorAll('.download-action')].every(b=>b.disabled),
              cta:section&&cta?{top:cta.top-section.top,bottom:cta.bottom-section.top,height:section.height}:null};
          });
          check(state.theme===theme&&state.lang==='en',tag+' theme/English mismatch');
          check(state.cards===5&&state.reduced&&state.disabled,tag+' cards/motion/download contract broken');
          check(state.quickIcons.length===3&&state.quickIcons.every(icon=>
            parseFloat(icon.padding)===0&&parseFloat(icon.border)===0&&
            Math.abs(icon.width-22)<=1&&Math.abs(icon.height-22)<=1&&icon.centered),
            tag+' Send/Receive/Swap icon misaligned '+JSON.stringify(state.quickIcons));
          check(state.overflow<=8,tag+' horizontal overflow '+state.overflow+'px');
          for(const c of state.controls){
            check(c.width>=39&&c.height>=39,tag+' '+c.id+' hit target too small');
            check(c.left>=-2&&c.right<=config.width+2,tag+' '+c.id+' clipped');
          }
          if(config.width<=430)check(state.cardLeft>=10,tag+' first feature card clipped');
          if(config.width>=681){
            check(state.cta&&state.cta.top>=14&&state.cta.bottom<=state.cta.height-14,
              tag+' desktop download CTA clipped');
          }
          if(config.name==='desktop'&&theme==='light'){
            for(const [button,menu,isHidden] of [
              ['scene-menu-button','scene-menu',false],
              ['download-menu-button','download-menu',false],
              ['locale-toggle','language-menu',true]]){
              await page.locator('#'+button).focus();
              await page.keyboard.press('Enter');
              const isOpen=await page.locator('#'+menu).evaluate((el,hidden)=>
                hidden?!el.hidden:el.classList.contains('is-open'),isHidden);
              check(isOpen,tag+' Enter failed to open '+menu);
              await page.keyboard.press('Escape');
              const isClosed=await page.locator('#'+menu).evaluate((el,hidden)=>
                hidden?el.hidden:!el.classList.contains('is-open'),isHidden);
              check(isClosed,tag+' Escape failed to close '+menu);
              check(await page.evaluate(id=>document.activeElement?.id===id,button),
                tag+' focus not returned to '+button);
            }
            for(const scene of ['overview','v3-features','v3-workspace','v3-security']){
              await page.evaluate(id=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'}),scene);
              const height=await page.locator('#'+scene).evaluate(el=>el.getBoundingClientRect().height);
              check(height>=120,tag+' missing '+scene+' geometry');
            }
            await page.screenshot({path:path.join(output,name+'-desktop-light.png'),
              animations:'disabled',timeout:20000});
          }
          await page.locator('#locale-toggle').click();
          await page.locator('[data-language="zh-CN"]').click();
          const zh=await page.evaluate(()=>({lang:document.documentElement.lang,
            title:document.getElementById('feature-title')?.textContent||'',
            overflow:document.documentElement.scrollWidth-innerWidth}));
          check(zh.lang==='zh-CN'&&zh.title.includes('核心能力'),tag+' Chinese translation missing');
          check(zh.overflow<=8,tag+' Chinese overflow '+zh.overflow+'px');
          if(config.name==='mobile'&&theme==='dark'){
            await page.evaluate(()=>document.getElementById('v3-features')?.scrollIntoView({block:'start',behavior:'instant'}));
            await page.screenshot({path:path.join(output,name+'-mobile-dark-zh.png'),
              animations:'disabled',timeout:20000});
          }
          check(errors.length===0,tag+' JavaScript errors: '+errors.join(' | '));
          results.push({tag,status:'PASS',overflow:state.overflow,zhOverflow:zh.overflow});
          console.log('[V3 engines] '+tag+' PASS');
        }catch(error){
          const message=tag+': '+String(error.message||error).slice(0,550);
          failures.push(message);
          console.error('[V3 engines] '+message);
        }finally{await page.close();}
      }
    }
  }catch(error){failures.push(name+' setup: '+String(error.message||error).slice(0,600));}
  finally{if(browser)await browser.close();}
}
const report={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),url:base,
  meaning:'Linux Firefox and WebKit engine smoke checks, not Windows/macOS browser or visual approval',
  results,failures};
fs.writeFileSync(path.join(output,'engine-results.json'),JSON.stringify(report,null,2)+'\n');
console.log('[V3 engines] '+report.status+' '+results.length+' cases '+failures.length+' failures');
if(failures.length)process.exitCode=1;
