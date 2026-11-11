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
const failures=[],reports=[],captures=[],mobileDownloadObservations=[];
const measureMobileDownloads=()=>[...document.querySelectorAll('#v3-availability .download-action')].map(button=>{
  const icon=button.querySelector('svg'),label=button.querySelector('span');
  const box=button.getBoundingClientRect(),mark=icon?.getBoundingClientRect();
  const text=label?.getBoundingClientRect();
  return {disabled:button.disabled,brand:icon?.getAttribute('class'),
    fill:icon?.getAttribute('fill'),iconColor:icon?getComputedStyle(icon).color:null,
    renderedFill:icon?getComputedStyle(icon).fill:null,
    text:label?.textContent?.trim(),ariaLabel:button.getAttribute('aria-label'),
    height:box.height,iconWidth:mark?.width,iconHeight:mark?.height,
    iconBeforeText:!!mark&&!!text&&mark.right<text.left,
    aligned:!!mark&&!!text&&Math.abs((mark.top+mark.height/2)-(text.top+text.height/2))<=4,
    unclipped:!!mark&&!!text&&mark.left>=box.left+3&&text.right<=box.right-5,
    oneLine:label?.getClientRects().length===1};
});
const checkMobileDownloads=(actions,prefix,lang)=>{
  const expected=lang==='zh-CN'?['下载 iOS','下载 Android']:['Download iOS','Download Android'];
  const accessible=lang==='zh-CN'?['下载 iOS 版本','下载 Android 版本']:
    ['Download for iOS','Download for Android'];
  assert(actions.length===2,prefix+': mobile iOS/Android buttons missing');
  for(let i=0;i<actions.length;i++){
    const a=actions[i];
    assert(a.disabled&&a.brand===(i===0?'platform-mark-apple':'platform-mark-android')&&
      a.fill==='currentColor'&&a.renderedFill===a.iconColor,
      prefix+': platform '+i+' icon/disabled contract failed '+JSON.stringify(a));
    assert(a.text===expected[i]&&a.ariaLabel===accessible[i]&&
      a.oneLine&&a.iconBeforeText&&a.aligned&&a.unclipped&&
      a.height>=55&&a.iconWidth>=18&&a.iconHeight>=18,
      prefix+': platform '+i+' text or layout failed '+JSON.stringify(a));
  }
};
// Validate actual browser-computed button text/icon identity (not just CSS strings).
const measureActionIdentity=()=>{
  const read=(selector,iconSelector,labelSelector)=>{
    const button=document.querySelector(selector);
    const icon=button.querySelector(iconSelector);
    const label=button.querySelector(labelSelector);
    const b=getComputedStyle(button),i=getComputedStyle(icon),l=getComputedStyle(label);
    return {
      buttonColor:b.color,iconColor:i.color,labelColor:l.color,
      fontFamily:b.fontFamily,labelFontFamily:l.fontFamily,
      fontWeight:l.fontWeight,fontSize:l.fontSize,
      iconWidth:icon.getBoundingClientRect().width
    };
  };
  return {
    header:read('#download-menu-button','.download-mark','.download-label'),
    ios:read('#v3-availability .download-action','.platform-mark-apple','span'),
    android:read('#v3-availability .download-action.secondary','.platform-mark-android','span'),
    desktop:read('#v3-workspace .desktop-download','svg','span')
  };
};
const measureControlRadii=()=>Object.fromEntries(Object.entries({
  hero:'#overview .cta.primary',
  header:'#download-menu-button',
  mobile:'#v3-availability .download-action',
  desktop:'#v3-workspace .desktop-download',
  send:'#v3-features .mini-send-button',
  swap:'#v3-features .mini-swap-button',
  preview:'#v3-workspace .dp-preview-action',
  desktopTabs:'#v3-workspace .desktop-tabs',
  navSection:'#scene-menu-button',
  navTheme:'#theme-toggle',
  tuner:'#orb-tuner-toggle',
  downloadOption:'#download-menu a',
  localeOption:'#language-menu button',
  tunerAction:'#orb-tuner .ot-action',
  tunerClose:'#orb-tuner .ot-close',
  quick:'#v3-workspace .dp-quick-action',
  desktopTab:'#v3-workspace .desktop-tabs button',
  backToTop:'.back-to-top',
  swapDirection:'#v3-features .mini-swap-direction'
}).map(([kind,selector])=>{
  const element=document.querySelector(selector);
  return [kind,element?getComputedStyle(element).borderTopLeftRadius:null];
}));
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
        const getButton=await page.locator('#download-menu-button').evaluate(el=>({
          label:el.innerText.trim(),
          accessible:el.getAttribute('aria-label'),
          icon:!!el.querySelector('.download-mark'),
          chevron:!!el.querySelector('.download-chevron')
        }));
        assert(getButton.label===(width<=480?'Get':'Get Fresnica')&&
          getButton.accessible==='Get Fresnica download options'&&
          getButton.icon&&!getButton.chevron,
          `Top-right Get Fresnica button failed: ${name}/${theme} ${JSON.stringify(getButton)}`);
        await page.waitForTimeout(300);
        const freshEntry=await page.evaluate(()=>({
          hash:location.hash,
          scrollTop:document.getElementById('v3-page-scroll')?.scrollTop,
          active:document.documentElement.dataset.m14Active
        }));
        assert(freshEntry.hash===''&&freshEntry.scrollTop<2,
          `Fresh entry should stay on the overview, not scroll to scene two: ${name}/${theme} ${JSON.stringify(freshEntry)}`);
        assert(!await page.locator('#orb-tuner-toggle').isVisible(),
          `${name}/${theme}: engineering orb tuner is exposed in a normal preview`);
        assert(await page.evaluate(()=>!window.__v3PerfProbe&&!document.getElementById('v3-perf-panel')),
          `${name}/${theme}: device performance probe was loaded in normal preview`);
        if(width<=430){
          const mobileHero=await page.evaluate(()=>{
            const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};};
            const view=rect(document.getElementById('v3-page-scroll'));
            const field=rect(document.getElementById('orb-field'));
            // The CSS fallback is intentionally display:none while WebGL runs,
            // so measure the sphere's nominal 61% footprint in the live field.
            const diameter=field.bottom-field.top;
            const sphere={top:field.top+diameter*.195,bottom:field.top+diameter*.805};
            const art=rect(document.querySelector('#overview .hero-art'));
            const actions=[...document.querySelectorAll('#overview .actions .cta')].map(rect);
            const visible=(r)=>Math.max(0,Math.min(view.bottom,r.bottom)-Math.max(view.top,r.top));
            return {fieldVisible:visible(field),sphereVisible:visible(sphere),
              artTop:art.top,viewBottom:view.bottom,actions};
          });
          assert(mobileHero.fieldVisible>=155&&mobileHero.sphereVisible>=110,
            `${name}/${theme}: hero orb is almost invisible on first load (${JSON.stringify(mobileHero)})`);
          assert(mobileHero.actions.length===2&&mobileHero.actions.every(r=>r.top>=0&&r.bottom<=mobileHero.viewBottom)&&
            mobileHero.actions.every(r=>r.bottom<=mobileHero.artTop-7),
            `${name}/${theme}: compact hero CTA overlaps the orb (${JSON.stringify(mobileHero)})`);
        }
        if(theme==='dark'){
          await page.locator('#theme-toggle').click();
          await page.waitForFunction(()=>document.querySelector('.site-header')?.classList.contains('on-dark'));
          // Wait for the 0.18-0.2s button color transitions before sampling computed colors.
          await page.waitForTimeout(320);
        }
        const state=await page.evaluate(()=>{
          const selector='#scene-menu-button,#locale-toggle,#theme-toggle,#download-menu-button';
          const controls=[...document.querySelectorAll(selector)].map(el=>{
            const r=el.getBoundingClientRect();
            return {id:el.id,width:r.width,height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom};
          });
          const q=s=>document.querySelector(s);
          const scene=q('#v3-workspace')?.getBoundingClientRect();
          const cta=q('#v3-workspace .desktop-download')?.getBoundingClientRect();
          const nav=q('.site-header .top-nav').getBoundingClientRect();
          const brand=q('.site-header .brand').getBoundingClientRect();
          const download=q('#download-menu-button').getBoundingClientRect();
          return {
            theme:document.documentElement.classList.contains('v3-theme-dark')?'dark':'light',
            scrollWidth:document.documentElement.scrollWidth,
            innerWidth:window.innerWidth,
            controls,
            navigation:{
              background:getComputedStyle(q('.site-header .top-nav')).backgroundColor,
              border:getComputedStyle(q('.site-header .top-nav')).borderColor,
              width:nav.width,left:nav.left,right:nav.right,
              brandRight:brand.right,downloadLeft:download.left
            },
            cards:document.querySelectorAll('.feature-card').length,
            firstCardLeft:q('#v3-features .feature-card')?.getBoundingClientRect().left??null,
            workspaceCta:scene&&cta?{
              top:cta.top-scene.top,bottom:cta.bottom-scene.top,sceneHeight:scene.height
            }:null,
            sendBackground:getComputedStyle(q('.mini-send-button')).backgroundColor,
            swapBackground:getComputedStyle(q('.mini-swap-button')).backgroundColor,
            buttonSystem:{
              primary:getComputedStyle(q('#overview .cta.primary')).backgroundColor,
              primaryInk:getComputedStyle(q('#overview .cta.primary')).color,
              secondary:getComputedStyle(q('#overview .cta.secondary')).backgroundColor,
              topDownload:getComputedStyle(q('#download-menu-button')).backgroundColor,
              swapInk:getComputedStyle(q('.mini-swap-button')).color,
              swapDirection:getComputedStyle(q('.mini-swap-direction')).backgroundColor,
              selectedTab:getComputedStyle(q('#v3-workspace .desktop-tabs button[aria-selected="true"]')).backgroundColor,
              selectedTabInk:getComputedStyle(q('#v3-workspace .desktop-tabs button[aria-selected="true"]')).color,
              disabledMobile:[...document.querySelectorAll('#v3-availability .download-action')].map(el=>({
                disabled:el.disabled,background:getComputedStyle(el).backgroundColor
              })),
              disabledDesktop:{
                disabled:q('#v3-workspace .desktop-download').disabled,
                background:getComputedStyle(q('#v3-workspace .desktop-download')).backgroundColor
              }
            },
            activitySurface:getComputedStyle(q('.activity-demo')).backgroundColor,
            cardSurfaces:[
              '#overview .orb-card',
              '#v3-features .feature-art',
              '#v3-features .feature-ui',
              '#v3-features .activity-entry.is-new',
              '#v3-workspace .dp-balance',
              '#v3-workspace .dp-receive-card',
              '#v3-for-you .audience-card',
              '#v3-for-you .audience-card.featured',
              '#v3-security .security-principle'
            ].map(selector=>({selector,color:getComputedStyle(q(selector)).backgroundColor})),
            reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,
            disabledDownloads:[...document.querySelectorAll('.download-action')].every(b=>b.disabled)
          };
        });
        const prefix=name+'/'+theme;
        // The right-hand WALLET caption must stay entirely within the orb and
        // remain readable even when the orb has its maximum 6px pointer parallax.
        const walletCaption=await page.evaluate(()=>{
          const card=document.querySelector('#overview .orb-card.second');
          const field=document.getElementById('orb-field');
          const art=document.querySelector('#overview .hero-art');
          const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};};
          return {
            card:rect(card),field:rect(field),art:rect(art),
            text:card.textContent.trim(),
            cssRight:getComputedStyle(card).right,
            clippedContent:card.scrollWidth>card.clientWidth+1||card.scrollHeight>card.clientHeight+1
          };
        });
        assert(walletCaption.text.includes('WALLET')&&walletCaption.text.includes('Assets, in one place.')&&
          walletCaption.card.left>=walletCaption.field.left-1&&
          walletCaption.card.right<=walletCaption.field.right+1&&
          walletCaption.card.left>=walletCaption.art.left-1&&
          walletCaption.card.right<=walletCaption.art.right+1&&
          !walletCaption.clippedContent,
          `${prefix}: WALLET hero caption is clipped (${JSON.stringify(walletCaption)})`);
        const actionIdentity=await page.evaluate(measureActionIdentity);
        const controlRadii=await page.evaluate(measureControlRadii);
        for(const kind of ['hero','header','mobile','desktop','send','swap','preview','desktopTabs','navSection','navTheme','tuner']){
          assert(controlRadii[kind]==='12px',
            `${prefix}: ${kind} action radius expected 12px, got ${controlRadii[kind]}`);
        }
        for(const kind of ['downloadOption','localeOption','tunerAction','tunerClose','quick']){
          assert(controlRadii[kind]==='8px',
            `${prefix}: ${kind} compact radius expected 8px, got ${controlRadii[kind]}`);
        }
        assert(controlRadii.desktopTab==='0px'&&
          controlRadii.backToTop==='50%'&&controlRadii.swapDirection==='50%',
          `${prefix}: joined tabs or circular control radius differs (${JSON.stringify(controlRadii)})`);
        for(const [kind,style] of Object.entries(actionIdentity)){
          assert(style.buttonColor===style.iconColor&&style.iconColor===style.labelColor,
            `${prefix}: ${kind} icon and label colors differ (${JSON.stringify(style)})`);
          assert(style.fontFamily===style.labelFontFamily&&style.fontFamily.includes('Roboto')&&
            style.fontWeight==='600',
            `${prefix}: ${kind} button typography differs from Fresnica tokens (${JSON.stringify(style)})`);
        }
        for(const kind of ['ios','android','desktop']){
          const style=actionIdentity[kind];
          assert(style.fontSize==='13px'&&style.iconWidth>=19.5&&style.iconWidth<=20.5,
            `${prefix}: ${kind} download typography/icon size is inconsistent (${JSON.stringify(style)})`);
        }
        const expectedNavWidth=width<=375?Math.min(184,width-172):
          width<=680?Math.min(210,width-172):340;
        assert(Math.abs(state.navigation.width-expectedNavWidth)<=1,
          `${prefix}: navigation capsule width changed from the viewport preset ${expectedNavWidth}px (${state.navigation.width}px)`);
        assert(state.navigation.left>=-1&&state.navigation.right<=width+1&&
          state.navigation.left>=state.navigation.brandRight-1&&
          state.navigation.right<=state.navigation.downloadLeft+1,
          `${prefix}: fixed navigation overlaps brand/download or viewport (${JSON.stringify(state.navigation)})`);
        const mobileActions=await page.evaluate(measureMobileDownloads);
        checkMobileDownloads(mobileActions,prefix,'en');
        mobileDownloadObservations.push({viewport:name,theme,locale:'en',actions:mobileActions});
        assert(state.theme===theme,`${prefix}: theme switch mismatch`);
        assert(state.cards===5,`${prefix}: missing feature card`);
        const palette=state.buttonSystem;
        const primary=theme==='dark'?'rgb(9, 118, 84)':'rgb(8, 120, 82)';
        const secondary=theme==='dark'?'rgb(42, 42, 48)':'rgb(255, 255, 255)';
        assert(palette.primary===primary&&palette.primaryInk==='rgb(255, 255, 255)',
          `${prefix}: primary button no longer AA green/white (${palette.primary}, ${palette.primaryInk})`);
        assert(state.sendBackground===primary,
          `${prefix}: Send example no longer uses primary surface (${state.sendBackground})`);
        assert(palette.secondary===secondary&&palette.topDownload===secondary,
          `${prefix}: hero/header secondary surfaces differ (${palette.secondary}, ${palette.topDownload})`);
        assert(state.swapBackground===(theme==='dark'?'rgb(255, 255, 255)':'rgb(17, 18, 20)'),
          `${prefix}: Swap example lost inverse action (${state.swapBackground})`);
        assert(palette.swapInk===(theme==='dark'?'rgb(17, 18, 20)':'rgb(255, 255, 255)'),
          `${prefix}: Swap inverse foreground is incorrect (${palette.swapInk})`);
        assert(palette.selectedTab===primary&&palette.selectedTabInk==='rgb(255, 255, 255)',
          `${prefix}: desktop selected tab should be green with white type (${palette.selectedTab}, ${palette.selectedTabInk})`);
        assert(palette.disabledMobile.length===2&&palette.disabledMobile.every(x=>x.disabled&&x.background==='rgb(52, 52, 60)'),
          `${prefix}: mobile download controls should be neutral and disabled (${JSON.stringify(palette.disabledMobile)})`);
        assert(palette.disabledDesktop.disabled&&palette.disabledDesktop.background===(theme==='dark'?'rgb(52, 52, 60)':'rgb(243, 243, 245)'),
          `${prefix}: desktop download should be neutral and disabled (${JSON.stringify(palette.disabledDesktop)})`);
        if(theme==='dark'){
          assert(state.navigation.background==='rgb(42, 42, 48)',
            `${prefix}: dark navigation background differs from Fresnica raised surface (${state.navigation.background})`);
          assert(state.navigation.border==='rgb(72, 72, 80)',
            `${prefix}: dark navigation border differs from neutral border (${state.navigation.border})`);
          for(const {selector,color} of state.cardSurfaces){
            const rgb=color.match(/[\d.]+/g)?.slice(0,3).map(Number)||[];
            assert(rgb.length===3&&Math.max(...rgb)-Math.min(...rgb)<=8,
              `${prefix}: ${selector} still has tinted card background ${color}`);
          }
        }
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
        for(const id of name==='desktop-1440'?sceneIds:['overview','v3-availability','v3-features','v3-workspace']){
          await page.evaluate(id=>{document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});if(id==='v3-features'){const reel=document.getElementById('feature-window');if(reel)reel.scrollLeft=0;}},id);
          await page.waitForTimeout(160);
          const navWidth=await page.locator('.site-header .top-nav').evaluate(el=>el.getBoundingClientRect().width);
          assert(Math.abs(navWidth-state.navigation.width)<=1,
            `${prefix}/${id}: navigation width changed when chapter title updated (${navWidth}px vs ${state.navigation.width}px)`);
          if(theme==='light'&&['v3-availability','v3-clarity'].includes(id)){
            const darkSceneNav=await page.evaluate(()=>{
              const header=document.querySelector('.site-header');
              const nav=header.querySelector('.top-nav');
              const style=getComputedStyle(nav);
              return {
                isDark:header.classList.contains('on-dark'),
                background:style.backgroundColor,
                border:style.borderColor,
                text:style.color
              };
            });
            assert(darkSceneNav.isDark,`${prefix}: ${id} did not activate dark-scene navigation`);
            assert(darkSceneNav.background==='rgb(42, 42, 48)' &&
              darkSceneNav.border==='rgb(72, 72, 80)' &&
              darkSceneNav.text==='rgb(245, 245, 247)',
              `${prefix}: ${id} navigation capsule blends into black background (${JSON.stringify(darkSceneNav)})`);
          }
          if(theme==='dark'&&id==='v3-about'){
            const footerNav=await page.evaluate(()=>{
              const header=document.querySelector('.site-header');
              return {
                isFooter:header.classList.contains('on-footer-dark'),
                background:getComputedStyle(header.querySelector('.top-nav')).backgroundColor
              };
            });
            assert(footerNav.isFooter,`${prefix}: footer navigation state was not activated`);
            assert(footerNav.background==='rgb(42, 42, 48)',
              `${prefix}: footer navigation reverted to light surface (${footerNav.background})`);
          }
          const target=path.join(dest,`${prefix}-${id}.png`);
          fs.mkdirSync(path.dirname(target),{recursive:true});
          await page.screenshot({path:target,animations:'disabled',timeout:20000});
          files.push(path.relative(dest,target));
        }
        if(name==='desktop-1440'&&theme==='dark'){
          await page.evaluate(()=>document.getElementById('orb-tuner').setAttribute('data-debug-enabled',''));
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
          await page.evaluate(()=>document.getElementById('orb-tuner').setAttribute('data-debug-enabled',''));
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
          const platformOptions=await page.locator('#download-menu a').evaluateAll(links=>
            links.map(link=>({label:link.textContent.trim(),href:link.getAttribute('href')})));
          assert(platformOptions.length===2&&
            platformOptions[0].label==='Mobile · iOS & Android'&&
            platformOptions[0].href==='#v3-availability'&&
            platformOptions[1].label==='Desktop'&&
            platformOptions[1].href==='#v3-workspace',
            'Download menu repeats labels or targets: '+JSON.stringify(platformOptions));
          await page.keyboard.press('Escape');
          assert(!await page.locator('#download-menu').evaluate(e=>e.classList.contains('is-open')),'Escape did not close download menu');
          assert(await page.evaluate(()=>document.activeElement?.id==='download-menu-button'),'Escape did not return focus to download button');
          await page.locator('#locale-toggle').focus();
          await page.keyboard.press('Enter');
          assert(!await page.locator('#language-menu').evaluate(el=>el.hidden),'Keyboard Enter did not open language menu');
          await page.keyboard.press('Escape');
          assert(await page.locator('#language-menu').evaluate(el=>el.hidden),'Escape did not close language menu');
          assert(await page.evaluate(()=>document.activeElement?.id==='locale-toggle'),'Escape did not return focus to language button');
          // The locale popup advertises role=menu/menuitemradio: support arrow
          // navigation (including opening from the trigger) and Home/End.
          await page.keyboard.press('ArrowDown');
          assert(!await page.locator('#language-menu').evaluate(el=>el.hidden),
            'ArrowDown did not open the language menu');
          const focusedLanguage=()=>page.evaluate(()=>document.activeElement?.dataset?.language||'');
          assert(await focusedLanguage()==='en','ArrowDown did not focus English');
          await page.keyboard.press('ArrowDown');
          assert(await focusedLanguage()==='zh-CN','ArrowDown did not move to Chinese');
          await page.keyboard.press('ArrowUp');
          assert(await focusedLanguage()==='en','ArrowUp did not return to English');
          await page.keyboard.press('End');
          assert(await focusedLanguage()==='zh-CN','End did not focus last language');
          await page.keyboard.press('Home');
          assert(await focusedLanguage()==='en','Home did not focus first language');
          await page.keyboard.press('Escape');
          assert(await page.locator('#language-menu').evaluate(el=>el.hidden)&&
            await page.evaluate(()=>document.activeElement?.id==='locale-toggle'),
            'Escape did not close keyboard-navigated language menu and restore focus');
          // Keyboard-only switching must not leave two header disclosures open.
          // Pointer clicks already dismiss the locale menu via document pointerdown.
          for(const target of ['scene-menu-button','download-menu-button']){
            await page.locator('#locale-toggle').focus();
            await page.keyboard.press('Enter');
            assert(!await page.locator('#language-menu').evaluate(el=>el.hidden),
              'Language menu did not open before keyboard disclosure switch');
            await page.locator('#'+target).focus();
            await page.keyboard.press('Enter');
            const state=await page.evaluate(id=>({
              languageHidden:document.getElementById('language-menu').hidden,
              languageExpanded:document.getElementById('locale-toggle').getAttribute('aria-expanded'),
              targetExpanded:document.getElementById(id).getAttribute('aria-expanded')
            }),target);
            assert(state.languageHidden&&state.languageExpanded==='false'&&state.targetExpanded==='true',
              'Keyboard disclosure switch left language menu open: '+target+' '+JSON.stringify(state));
            await page.keyboard.press('Escape');
          }
          // Switching to theme or home must dismiss any header disclosure,
          // including keyboard clicks which have no outside pointerdown.
          for(const trigger of ['scene-menu-button','download-menu-button','locale-toggle']){
            await page.locator('#'+trigger).focus();
            await page.keyboard.press('Enter');
            assert(await page.locator('#'+(trigger==='locale-toggle'?'language-menu':
              trigger==='scene-menu-button'?'scene-menu':'download-menu'))
              .evaluate(el=>el.id==='language-menu'?!el.hidden:el.classList.contains('is-open')),
              'Header disclosure did not open before theme switch: '+trigger);
            await page.locator('#theme-toggle').focus();
            await page.keyboard.press('Enter');
            const menus=await page.evaluate(()=>({
              scene:document.getElementById('scene-menu').classList.contains('is-open'),
              download:document.getElementById('download-menu').classList.contains('is-open'),
              language:!document.getElementById('language-menu').hidden,
              expanded:[...document.querySelectorAll('#scene-menu-button,#download-menu-button,#locale-toggle')]
                .map(el=>el.getAttribute('aria-expanded'))
            }));
            assert(!menus.scene&&!menus.download&&!menus.language&&menus.expanded.every(x=>x==='false'),
              'Switching theme left a header disclosure expanded: '+trigger+' '+JSON.stringify(menus));
          }
          // Three theme toggles above leave dark mode on; restore original light state.
          await page.locator('#theme-toggle').click();
          for(const trigger of ['scene-menu-button','download-menu-button','locale-toggle']){
            await page.locator('#'+trigger).focus();
            await page.keyboard.press('Enter');
            await page.locator('.site-header .brand').focus();
            await page.keyboard.press('Enter');
            const closed=await page.evaluate(()=>({
              scene:document.getElementById('scene-menu').classList.contains('is-open'),
              download:document.getElementById('download-menu').classList.contains('is-open'),
              language:!document.getElementById('language-menu').hidden
            }));
            assert(!closed.scene&&!closed.download&&!closed.language,
              'Brand home navigation left disclosure expanded: '+trigger+' '+JSON.stringify(closed));
          }
          await page.locator('#locale-toggle').click();
          await page.locator('[data-language="zh-CN"]').click();
          await page.waitForFunction(()=>document.documentElement.lang==='zh-CN'&&
            document.querySelector('.footer-top > div:first-child > p:not(.chapter-kicker)')?.textContent?.includes('Fresnica 是面向'),null,{timeout:5000}).catch(()=>{});
          const locale=await page.evaluate(()=>({lang:document.documentElement.lang,footer:document.querySelector('.footer-top > div:first-child > p:not(.chapter-kicker)')?.textContent||''}));
          assert(locale.lang==='zh-CN','Language picker did not switch to Chinese');
          const zhGetButton=await page.locator('#download-menu-button').evaluate(el=>({
            label:el.innerText.trim(),accessible:el.getAttribute('aria-label')
          }));
          assert(zhGetButton.label===(width<=480?'获取':'获取 Fresnica')&&
            zhGetButton.accessible==='获取 Fresnica 下载选项',
            'Top-right Get Fresnica Chinese label failed: '+JSON.stringify(zhGetButton));
          const zhPlatformOptions=await page.locator('#download-menu a').allTextContents();
          assert(zhPlatformOptions.length===2&&
            zhPlatformOptions[0].trim()==='移动端 · iOS / Android'&&
            zhPlatformOptions[1].trim()==='桌面端',
            'Chinese download menu labels are redundant or untranslated: '+JSON.stringify(zhPlatformOptions));
          const chineseNavWidth=await page.locator('.site-header .top-nav').evaluate(el=>el.getBoundingClientRect().width);
          assert(Math.abs(chineseNavWidth-state.navigation.width)<=1,
            `Changing the navigation language resized its capsule: ${chineseNavWidth}px vs ${state.navigation.width}px`);
          assert(locale.footer.includes('Fresnica 是面向'),`Chinese footer translation missing; got: ${locale.footer.slice(0,120)}`);
          // The compact footer link must preserve Chinese when navigating to
          // third-party notices and back, while keeping the original license text.
          const noticeLink=page.locator('#v3-about .platform-credit');
          assert((await noticeLink.textContent())?.trim()==='第三方声明',
            'Third-party notices footer link was not localized');
          const noticeHref=await noticeLink.getAttribute('href');
          const noticePage=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
          try{
            await noticePage.goto(new URL(noticeHref,base).href,{waitUntil:'domcontentloaded',timeout:30000});
            const notice=await noticePage.evaluate(()=>({
              lang:document.documentElement.lang,
              title:document.querySelector('h1')?.textContent?.trim(),
              credit:document.body.textContent.includes('Android is a trademark of Google LLC.'),
              back:document.querySelector('.back')?.textContent?.trim()
            }));
            assert(notice.lang==='zh-CN'&&notice.title==='第三方声明'&&notice.credit&&
              notice.back?.includes('返回'),
              'Chinese notice page did not preserve language and legal credit: '+JSON.stringify(notice));
            await noticePage.locator('.back').click();
            await noticePage.waitForURL(url=>url.pathname.endsWith('/index.html'),{timeout:10000});
            const returned=await noticePage.evaluate(()=>({
              lang:document.documentElement.lang,
              hash:location.hash,
              scroll:document.getElementById('v3-page-scroll')?.scrollTop
            }));
            assert(returned.lang==='zh-CN'&&returned.hash==='#v3-about',
              'Notice return link lost language or footer anchor: '+JSON.stringify(returned));
          }finally{await noticePage.close();}
          const localized=await page.evaluate(()=>{
            const txt=selector=>document.querySelector(selector)?.textContent?.trim()||'';
            const attr=(selector,name)=>document.querySelector(selector)?.getAttribute(name)||'';
            return {
              title:document.title,
              description:document.querySelector('meta[name="description"]')?.content||'',
              sendPreview:txt('#v3-features .feature-card:nth-child(2) .mini-label'),
              activity:txt('#v3-features .feature-card:nth-child(5)'),
              payments:txt('#desktop-panel-payments .dp-payment-footer > span:first-child'),
              swap:txt('#desktop-panel-swap .dp-swap-hint'),
              connect:txt('#desktop-panel-connect .dp-connect-hint'),
              permission:txt('#desktop-panel-connect .dp-permissions-label'),
              languageMenu:attr('#language-menu','aria-label'),
              gradient:attr('#orb-tuner','aria-label'),
              gradientButton:attr('#orb-tuner-toggle','title'),
              gradientClose:attr('#orb-tuner-close','aria-label'),
              sendDescription:attr('#v3-features .feature-card:nth-child(2) [aria-label]','aria-label'),
              portfolio:attr('#desktop-panel-assets .dp-portfolio-chart','aria-label')
            };
          });
          for(const [key,expected] of Object.entries({
            title:'你的 Stellar 钱包',
            description:'专注 Stellar 生态',
            sendPreview:'发送 / 核对',
            activity:'查看活动记录',
            payments:'确认前核对交易信息',
            swap:'预估兑换',
            connect:'请先核对权限',
            permission:'请求的权限',
            languageMenu:'语言选项',
            gradient:'球体渐变参数调整',
            gradientButton:'调整球体渐变',
            gradientClose:'关闭渐变参数面板',
            sendDescription:'预览发送动画',
            portfolio:'资产总值趋势'
          })){
            assert(localized[key]?.includes(expected),
              `Chinese locale: ${key} not localized, got ${String(localized[key]).slice(0,120)}`);
          }
          await page.locator('#theme-toggle').click();
          assert((await page.locator('#theme-toggle').getAttribute('aria-label'))==='切换为浅色模式',
            'Chinese theme toggle did not update its accessible label');
          await page.locator('#theme-toggle').click();
          await page.screenshot({path:path.join(dest,'desktop-1440-zh.png'),animations:'disabled'});
          await page.locator('#locale-toggle').click();
          await page.locator('[data-language="en"]').click();
          assert((await page.title())==='Fresnica — Your Stellar Wallet',
            'Switching back to English did not restore document title');
          assert((await page.locator('#orb-tuner-close').getAttribute('aria-label'))==='Close gradient panel',
            'Switching back to English did not restore gradient controls');
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
        // Font fallback can render Chinese as empty squares without causing
        // text overflow or a browser script error. Require the bundled CJK
        // font to load, not merely the presence of translated strings.
        const chineseFonts=await page.evaluate(async()=>{
          const glyphs='中文钱包资产下载安全';
          const weights=[400,500,700];
          const counts=[];
          for(const weight of weights){
            const faces=await document.fonts.load(weight+' 24px "Noto Sans SC"',glyphs);
            counts.push(faces.filter(face=>face.family.replace(/["']/g,'')==='Noto Sans SC'&&
              face.status==='loaded').length);
          }
          await document.fonts.ready;
          return {counts,available:weights.map(weight=>
            document.fonts.check(weight+' 24px "Noto Sans SC"',glyphs))};
        });
        assert(chineseFonts.counts.every(n=>n>0)&&chineseFonts.available.every(Boolean),
          `zh/${name}/${theme}: bundled Noto Sans SC not loaded ${JSON.stringify(chineseFonts)}`);
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
        const zhNavWidth=await page.locator('.site-header .top-nav').evaluate(el=>el.getBoundingClientRect().width);
        const presetNavWidth=width<=375?Math.min(184,width-172):width<=680?Math.min(210,width-172):340;
        assert(Math.abs(zhNavWidth-presetNavWidth)<=1,
          `zh/${name}/${theme}: navigation capsule changed width after localization (${zhNavWidth}px vs ${presetNavWidth}px)`);
        assert(data.overflow<=8,`zh/${name}/${theme}: horizontal document overflow ${data.overflow}px`);
        const zhMobileActions=await page.evaluate(measureMobileDownloads);
        checkMobileDownloads(zhMobileActions,`zh/${name}/${theme}`,'zh-CN');
        mobileDownloadObservations.push({viewport:name,theme,locale:'zh-CN',actions:zhMobileActions});
        for(const title of data.titles){
          assert(title.excess<=4,`zh/${name}/${theme}: ${title.selector} text overflows by ${title.excess}px`);
        }
        for(const id of ['overview','v3-availability','v3-features','v3-workspace','v3-clarity']){
          await page.evaluate(id=>{document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});},id);
          await page.waitForTimeout(140);
          const filename=`zh-${name}-${theme}-${id}.png`;
          await page.screenshot({path:path.join(dest,filename),animations:'disabled'});
          captures.push(filename);
          if(width<=430&&id==='v3-workspace'){
            // Mobile chapters can be taller than the viewport: the tab strip must
            // remain reachable by native scrolling, without a floating overlay.
            await page.evaluate(()=>{
              const scroll=document.getElementById('v3-page-scroll');
              const tab=document.querySelector('#v3-workspace .desktop-tabs');
              scroll.scrollTop+=tab.getBoundingClientRect().bottom-scroll.getBoundingClientRect().bottom+18;
            });
            await page.waitForTimeout(180);
            const mobile=await page.evaluate(()=>{
              const scroll=document.getElementById('v3-page-scroll').getBoundingClientRect();
              const tabs=document.querySelector('#v3-workspace .desktop-tabs').getBoundingClientRect();
              const back=document.querySelector('.back-to-top');
              return {workspaceVisible:back.classList.contains('v3-over-workspace'),
                tabsTop:tabs.top,tabsBottom:tabs.bottom,scrollTop:scroll.top,scrollBottom:scroll.bottom,
                backVisibility:getComputedStyle(back).visibility,
                brandHome:document.querySelector('.site-header .brand')?.getAttribute('href')};
            });
            assert(mobile.tabsTop>=mobile.scrollTop-4&&mobile.tabsBottom<=mobile.scrollBottom+4,
              `zh/${name}/${theme}: desktop preview tabs are not reachable (${JSON.stringify(mobile)})`);
            assert(mobile.workspaceVisible&&mobile.backVisibility==='hidden'&&mobile.brandHome==='#overview',
              `zh/${name}/${theme}: back-to-top covers the compact desktop demo (${JSON.stringify(mobile)})`);
          }
        }
        console.log(`[V3 browser] zh/${name}/${theme} overflow=${data.overflow}px titles=${data.titles.length}`);
      }catch(error){
        failures.push(`zh/${name}/${theme}: ${String(error.message||error).slice(0,550)}`);
      }finally{
        await page.close();
      }
    }
  }
  // Confirm the documented URL opt-in opens the existing developer controls.
  const debugPage=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  try{
    const debugUrl=new URL(base);
    debugUrl.searchParams.set('debug','orb');
    await debugPage.goto(debugUrl.href,{waitUntil:'load',timeout:45000});
    await debugPage.waitForFunction(()=>{
      const tuner=document.getElementById('orb-tuner');
      return tuner?.hasAttribute('data-debug-enabled')&&!tuner.hidden;
    },null,{timeout:8000});
    assert(await debugPage.locator('#orb-tuner-toggle').isVisible(),
      'Orb gradient debugging must be available only via ?debug=orb');
  }catch(error){
    failures.push('orb debug URL: '+String(error.message||error).slice(0,500));
  }finally{await debugPage.close();}
  // A short opt-in sample must export locally, without starting on normal pages.
  const perfPage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',acceptDownloads:true});
  try{
    const perfUrl=new URL(base);
    perfUrl.searchParams.set('debug','perf');
    await perfPage.goto(perfUrl.href,{waitUntil:'load',timeout:45000});
    await perfPage.waitForFunction(()=>Boolean(window.__v3PerfProbe),null,{timeout:8000});
    assert(await perfPage.locator('#v3-perf-panel').isVisible(),
      'The opt-in performance probe did not open');
    const sample=await perfPage.evaluate(()=>window.__v3PerfProbe.record(350));
    assert(sample?.scene==='overview'&&sample?.motion==='reduce'&&
      sample?.elapsedMs>=250&&sample?.rafScheduling?.intervals>=1&&
      typeof sample?.validHold==='boolean'&&
      await perfPage.locator('#v3-perf-export').isEnabled(),
      'Opt-in device probe failed to produce a valid sample: '+JSON.stringify(sample));
    const downloadPromise=perfPage.waitForEvent('download',{timeout:5000});
    await perfPage.locator('#v3-perf-export').click();
    const download=await downloadPromise;
    assert(/^fresnica-v3-device-perf-\d{4}-\d{2}-\d{2}\.json$/.test(download.suggestedFilename()),
      'Unexpected device probe export name: '+download.suggestedFilename());
  }catch(error){
    failures.push('opt-in device probe: '+String(error.message||error).slice(0,600));
  }finally{await perfPage.close();}
  // Explicit scene-two deep links are different from fresh homepage entries.
  // They must resolve to the completed hold frame after assets/fonts settle.
  const deepLink=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  try{
    await deepLink.goto(new URL('#v3-ecosystem',base).href,{waitUntil:'load',timeout:45000});
    await deepLink.evaluate(()=>document.fonts.ready);
    await deepLink.waitForTimeout(700);
    const sceneTwo=await deepLink.evaluate(()=>{
      const scroller=document.getElementById('v3-page-scroll');
      const section=document.getElementById('v3-ecosystem');
      const upper=section.querySelector('.orbital-intro');
      const lower=section.querySelector('.bottom-intro');
      const rect=e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom};};
      return {hash:location.hash,scrollTop:scroller.scrollTop,
        topAlpha:Number(getComputedStyle(section).getPropertyValue('--m5-top-alpha')),
        bottomAlpha:Number(getComputedStyle(section).getPropertyValue('--m5-bottom-alpha')),
        top:rect(upper),bottom:rect(lower),view:rect(scroller)};
    });
    assert(sceneTwo.hash==='#v3-ecosystem'&&sceneTwo.scrollTop>0&&
      sceneTwo.topAlpha>.98&&sceneTwo.bottomAlpha>.98&&
      sceneTwo.top.top>=sceneTwo.view.top-2&&sceneTwo.top.bottom<=sceneTwo.view.bottom+2&&
      sceneTwo.bottom.top>=sceneTwo.view.top-2&&sceneTwo.bottom.bottom<=sceneTwo.view.bottom+2,
      'Scene two deep link did not settle on a fully visible hold frame: '+JSON.stringify(sceneTwo));
  }catch(error){
    failures.push('scene-two initial load: '+String(error.message||error).slice(0,600));
  }finally{await deepLink.close();}
}finally{
  await browser.close();
}
const result={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),url:base,checks:'theme, mobile platform icons and one-line labels, key targets, horizontal overflow, reduced motion, demo only buttons, menu keyboard, zh translation, screenshots',viewports:setups.map(s=>s.name),captureCount:captures.length,mobileDownloadObservations,reports,failures};
fs.writeFileSync(path.join(dest,'results.json'),JSON.stringify(result,null,2)+'\n');
console.log('[V3 browser] '+result.status+'; '+reports.length+' viewport/themes; '+captures.length+' screenshots; '+failures.length+' findings');
for(const failure of failures)console.error('[V3 browser] '+failure);
if(failures.length)process.exitCode=1;
