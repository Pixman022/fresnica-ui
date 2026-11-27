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
  {name:'mobile-680',width:680,height:900},
  {name:'mobile-480',width:480,height:900},
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
const measureMobileHeroCaptions=()=>{
  const third=document.querySelector('#overview .orb-card.third').getBoundingClientRect();
  const status=document.querySelector('#overview .orb-status').getBoundingClientRect();
  return {
    horizontalOverlap:Math.max(0,Math.min(third.right,status.right)-Math.max(third.left,status.left)),
    verticalGap:status.top-third.bottom,
    thirdBottom:third.bottom,statusTop:status.top
  };
};
// Count painted text lines, not scrollWidth: a Chinese phrase can wrap into
// an unnatural extra line without producing horizontal overflow.
const measureHeadlineWrap=()=>{
  const selectors={
    hero:'#overview .hero h1',
    availability:'#availability-title',
    features:'#feature-title',
    workspace:'#workspace-title',
    experience:'#audience-title',
    security:'#security-title',
    faq:'#clarity-title'
  };
  return Object.fromEntries(Object.entries(selectors).map(([name,selector])=>{
    const el=document.querySelector(selector);
    if(!el)return [name,{missing:true}];
    const style=getComputedStyle(el),height=el.getBoundingClientRect().height;
    const lineHeight=parseFloat(style.lineHeight);
    return [name,{lines:lineHeight?Math.round(height/lineHeight):0,
      height,lineHeight,scrollExcess:el.scrollWidth-el.clientWidth,
      text:el.textContent.trim().slice(0,70)}];
  }));
};
const measureFooterLines=()=>{
  const title=document.querySelector('#footer-title');
  const node=[...title.childNodes].find(child=>child.nodeType===Node.TEXT_NODE);
  const rows=[];
  if(!node)return rows;
  const range=document.createRange();
  for(let i=0;i<node.length;i++){
    range.setStart(node,i);range.setEnd(node,i+1);
    const rect=range.getBoundingClientRect();
    if(rect.width<.5)continue;
    let row=rows.find(item=>Math.abs(item.top-rect.top)<2);
    if(!row){row={top:rect.top,text:''};rows.push(row);}
    row.text+=node.textContent[i];
  }
  return rows.sort((a,b)=>a.top-b.top).map(row=>row.text.trim());
};
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
        const compactHeader=width<=680;
        const topControl=compactHeader ? await page.locator('#m60-menu-toggle').isVisible()&&
          await page.locator('#download-menu-button').isHidden() : getButton.label==='Get Fresnica';
        assert(topControl&&getButton.accessible==='Get Fresnica download options'&&
          getButton.icon&&!getButton.chevron,
          `Mobile/desktop header contract failed: ${name}/${theme} ${JSON.stringify(getButton)}`);
        if(compactHeader){
          const mobileBrand=await page.locator('.site-header .brand').evaluate(el=>{
            const logo=el.querySelector('.brand-logo');
            const label=el.querySelector('.brand-label');
            const menu=document.getElementById('m60-menu-toggle');
            const brandBox=el.getBoundingClientRect(),logoBox=logo.getBoundingClientRect();
            const labelBox=label.getBoundingClientRect(),menuBox=menu.getBoundingClientRect();
            return {
              text:label.textContent.trim(),
              labelVisible:getComputedStyle(label).display!=='none'&&labelBox.width>0,
              logoWidth:logoBox.width,logoHeight:logoBox.height,
              centered:Math.abs((brandBox.top+brandBox.height/2)-(logoBox.top+logoBox.height/2))<2,
              menuGap:menuBox.left-brandBox.right,
              height:brandBox.height
            };
          });
          assert(mobileBrand.text==='Fresnica'&&mobileBrand.labelVisible&&
            mobileBrand.logoWidth>=29&&mobileBrand.logoWidth<=31&&
            mobileBrand.logoHeight>=29&&mobileBrand.logoHeight<=31&&
            mobileBrand.centered&&mobileBrand.menuGap>=8&&mobileBrand.height>=44,
            `Mobile brand alignment/legibility failed: ${name}/${theme} ${JSON.stringify(mobileBrand)}`);
        }
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
        if(width<=680){
          const mobileHero=await page.evaluate(()=>{
            const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width};};
            const view=rect(document.getElementById('v3-page-scroll'));
            const field=rect(document.getElementById('orb-field'));
            // The CSS fallback is intentionally display:none while WebGL runs,
            // so measure the sphere's nominal 61% footprint in the live field.
            const diameter=field.bottom-field.top;
            const sphere={top:field.top+diameter*.195,bottom:field.top+diameter*.805};
            const art=rect(document.querySelector('#overview .hero-art'));
            const ticker=rect(document.querySelector('#overview .ticker'));
            const actions=[...document.querySelectorAll('#overview .actions .cta')].map(rect);
            const labels=[...document.querySelectorAll('#overview .orb-card')].map(el=>{
              const r=rect(el),cx=field.left+diameter/2,cy=field.top+diameter/2;
              const dx=Math.max(r.left-cx,0,cx-r.right);
              const dy=Math.max(r.top-cy,0,cy-r.bottom);
              return {rect:r,radius:parseFloat(getComputedStyle(el).borderTopLeftRadius),
                pointer:getComputedStyle(el).pointerEvents,
                sphereIntrusion:Math.max(0,diameter*.305-Math.hypot(dx,dy))};
            });
            const status=rect(document.querySelector('#overview .orb-status'));
            const title=rect(document.querySelector('#overview h1'));
            const visible=(r)=>Math.max(0,Math.min(view.bottom,r.bottom)-Math.max(view.top,r.top));
            return {fieldVisible:visible(field),sphereVisible:visible(sphere),
              fieldDiameter:diameter,artTop:art.top,artBottom:art.bottom,
              viewBottom:view.bottom,tickerTop:ticker.top,status,labels,title,actions};
          });
          assert(mobileHero.fieldVisible>=185&&mobileHero.sphereVisible>=112&&
            mobileHero.fieldDiameter<=285,
            `${name}/${theme}: mobile hero sphere size/visibility failed (${JSON.stringify(mobileHero)})`);
          assert(mobileHero.actions.length===2&&
            mobileHero.actions.every(r=>r.top>=0&&r.bottom<=mobileHero.viewBottom)&&
            mobileHero.actions.every(r=>r.bottom<=mobileHero.artTop-5),
            `${name}/${theme}: compact hero CTA overlaps the orb (${JSON.stringify(mobileHero)})`);
          assert(mobileHero.title.top>=54&&mobileHero.artBottom<=mobileHero.tickerTop-5&&
            mobileHero.status.bottom<=mobileHero.tickerTop-6&&
            mobileHero.labels.length===3&&mobileHero.labels.every(l=>
              l.rect.left>=-1&&l.rect.right<=width+1&&
              l.rect.top>=0&&l.rect.bottom<=mobileHero.tickerTop-5&&
              l.sphereIntrusion<=8&&
              l.radius<=4&&l.pointer==='none'),
            `${name}/${theme}: mobile first fold, non-interactive labels or sphere clearance failed (${JSON.stringify(mobileHero)})`);
        }
        if(theme==='dark'){
          if(width<=680){
            await page.locator('#m60-menu-toggle').click();
            await page.locator('[data-m60-theme]').click();
            await page.keyboard.press('Escape');
          }else await page.locator('#theme-toggle').click();
          await page.waitForFunction(()=>document.querySelector('.site-header')?.classList.contains('on-dark'));
          // Wait for the 0.18-0.2s button color transitions before sampling computed colors.
          await page.waitForTimeout(320);
        }
        const state=await page.evaluate(()=>{
          const selector=innerWidth<=680?'#m60-menu-toggle':'#scene-menu-button,#locale-toggle,#theme-toggle,#download-menu-button';
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
        assert((await page.locator('#v3-about').getAttribute('data-chapter'))==='About',
          `${prefix}: English About chapter label is too long for fixed navigation`);
        if(width>=1280){
          const wraps=await page.evaluate(measureHeadlineWrap);
          for(const [kind,expected] of Object.entries({
            hero:3,availability:2,features:2,workspace:2,experience:2,security:2,faq:2
          })){
            assert(wraps[kind]?.lines===expected&&wraps[kind]?.scrollExcess<=3,
              `${prefix}: English ${kind} heading unexpectedly wraps (${JSON.stringify(wraps[kind])})`);
          }
        }
        // Desktop labels stay in the sphere field; mobile labels deliberately
        // extend beyond it, but must remain fully visible inside the viewport.
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
          (width<=680?
            (walletCaption.card.left>=4&&walletCaption.card.right<=width-4):
            (walletCaption.card.left>=walletCaption.field.left-1&&
             walletCaption.card.right<=walletCaption.field.right+1&&
             walletCaption.card.left>=walletCaption.art.left-1&&
             walletCaption.card.right<=walletCaption.art.right+1))&&
          !walletCaption.clippedContent,
          `${prefix}: WALLET hero caption is clipped (${JSON.stringify(walletCaption)})`);
        if(width<=480){
          const captions=await page.evaluate(measureMobileHeroCaptions);
          assert(captions.horizontalOverlap<=1||captions.verticalGap>=8,
            `${prefix}: mobile hero caption overlaps status (${JSON.stringify(captions)})`);
        }
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
        if(width>680){
          assert(Math.abs(state.navigation.width-expectedNavWidth)<=1,
            `${prefix}: navigation capsule width changed from the viewport preset ${expectedNavWidth}px (${state.navigation.width}px)`);
          assert(state.navigation.left>=-1&&state.navigation.right<=width+1&&
            state.navigation.left>=state.navigation.brandRight-1&&
            state.navigation.right<=state.navigation.downloadLeft+1,
            `${prefix}: fixed navigation overlaps brand/download or viewport (${JSON.stringify(state.navigation)})`);
        }else{
          assert(state.controls.length===1&&state.controls[0].id==='m60-menu-toggle'&&
            state.navigation.width===0,
            `${prefix}: compact navigation has not become one drawer control`);
          await page.locator('#m60-menu-toggle').click();
          const mobileMenu=await page.evaluate(()=>({
            expanded:document.getElementById('m60-menu-toggle').getAttribute('aria-expanded'),
            sections:document.querySelectorAll('.m60-section-links a').length,
            downloads:document.querySelectorAll('.m60-download-links a').length,
            channels:[...document.querySelectorAll('.m60-download-links [data-download-platform]')].map(el=>({
              platform:el.dataset.downloadPlatform,
              disabled:el.getAttribute('aria-disabled')==='true',
              href:el.getAttribute('href'),
              iconCount:el.querySelectorAll('svg.download-platform-icon').length,
              iconDecorative:el.querySelector('svg.download-platform-icon')?.getAttribute('aria-hidden')==='true'
            })),
            downloadSurfaces:[
              getComputedStyle(document.querySelector('.m60-download-mobile')).backgroundColor,
              getComputedStyle(document.querySelector('.m60-download-desktop')).backgroundColor
            ],
            locked:document.documentElement.classList.contains('m60-menu-open'),
            backgroundInert:document.getElementById('v3-page-frame')?.inert,
            preferences:(()=>{
              const language=document.querySelector('.m60-language');
              const theme=document.querySelector('.m60-theme');
              const a=language.getBoundingClientRect(),b=theme.getBoundingClientRect();
              const measured=[theme,...language.querySelectorAll('button')].map(el=>({
                tag:el.tagName,
                text:el.textContent.trim(),
                client:el.clientWidth,
                scroll:el.scrollWidth,
                width:el.getBoundingClientRect().width
              }));
              return {
                sameRow:Math.abs(a.top-b.top)<=1&&Math.abs(a.bottom-b.bottom)<=1&&a.right+4<=b.left,
                targetHeight:Math.min(b.height,...[...language.querySelectorAll('button')].map(el=>el.getBoundingClientRect().height)),
                noClipping:measured.every(el=>el.scroll<=el.client+1),
                iconOnly:theme.textContent.trim()===''&&
                  theme.querySelectorAll('svg.m60-theme-glyph').length===1&&
                  !document.querySelector('.m60-preferences .m60-group-label')&&
                  b.width>=44&&b.width<=56,
                measured,svgCount:theme.querySelectorAll('svg.m60-theme-glyph').length,
                themeHtml:theme.outerHTML.slice(0,360)
              };
            })()
          }));
          assert(mobileMenu.expanded==='true'&&mobileMenu.sections===9&&mobileMenu.downloads===3&&
            mobileMenu.locked&&mobileMenu.backgroundInert&&
            mobileMenu.channels.map(entry=>entry.platform).join(',')==='ios,android,desktop'&&
            mobileMenu.channels.every(entry=>entry.disabled&&entry.href===null&&
              entry.iconCount===1&&entry.iconDecorative)&&
            mobileMenu.downloadSurfaces[0]!==mobileMenu.downloadSurfaces[1],
            `${prefix}: mobile navigation drawer contract failed ${JSON.stringify(mobileMenu)}`);
          assert(mobileMenu.preferences.sameRow&&mobileMenu.preferences.targetHeight>=44&&
            mobileMenu.preferences.noClipping&&mobileMenu.preferences.iconOnly,
            `${prefix}: language and theme preferences must fit in one row ${JSON.stringify(mobileMenu.preferences)}`);
          await page.keyboard.press('Escape');
          assert(await page.evaluate(()=>document.activeElement?.id==='m60-menu-toggle'&&
            !document.documentElement.classList.contains('m60-menu-open')),
            `${prefix}: closing mobile drawer did not restore trigger focus`);
          const compactLayout=await page.evaluate(()=>{
            const q=selector=>document.querySelector(selector);
            const workspace=q('#v3-workspace'),copy=q('#v3-workspace .workspace-copy');
            const preview=q('#v3-workspace .workspace-mini');
            const tabs=q('#v3-workspace .desktop-tabs');
            const intro=copy.getBoundingClientRect(),demo=preview.getBoundingClientRect();
            const controls=tabs.getBoundingClientRect(),track=q('#v3-for-you .audience-track');
            const cards=track.querySelectorAll('.audience-card');
            const first=cards[0].getBoundingClientRect(),second=cards[1].getBoundingClientRect();
            const featureCards=q('#v3-features .feature-track').querySelectorAll('.feature-card');
            const featureFirst=featureCards[0].getBoundingClientRect();
            const featureSecond=featureCards[1].getBoundingClientRect();
            const featureViewport=q('#v3-features .feature-window').getBoundingClientRect();
            const visibleAssets=[...q('#v3-workspace .dp-panel-assets').querySelectorAll('.dp-asset-row')]
              .filter(row=>getComputedStyle(row).display!=='none');
            const finalAsset=visibleAssets.at(-1).getBoundingClientRect();
            const previewScale=parseFloat(getComputedStyle(q('#v3-workspace .ws-content'))
              .getPropertyValue('--preview-content-scale'));
            const phone=q('#v3-availability .download-phone').getBoundingClientRect();
            const phoneArt=q('#v3-availability .download-art').getBoundingClientRect();
            const cardArt=q('#v3-features .feature-card .feature-art').getBoundingClientRect();
            const innerCard=q('#v3-features .feature-card .feature-ui').getBoundingClientRect();
            return {
              workspaceStack:intro.bottom+8<=demo.top&&demo.bottom+8<=controls.top,
              workspaceWidth:demo.left>=-1&&demo.right<=innerWidth+1&&
                controls.left>=-1&&controls.right<=innerWidth+1,
              workspaceMin:parseFloat(getComputedStyle(workspace).minHeight),
              fullViewportChapters:['v3-features','v3-workspace','v3-for-you',
                'v3-clarity','v3-about'].map(id=>{
                  const el=q('#'+id);
                  return {id,height:el.getBoundingClientRect().height,
                    computedMin:getComputedStyle(el).minHeight};
                }),
              footerTouchTargets:[...q('#v3-about .footer-top').querySelectorAll('a')]
                .every(el=>{
                  const rect=el.getBoundingClientRect();
                  return rect.width>=44&&rect.height>=43.5;
                })&&parseFloat(getComputedStyle(q('#v3-about .platform-credit')).fontSize)>=12,
              swipeHints:[...document.querySelectorAll('.m61-swipe-hint')].length===2&&
                [...document.querySelectorAll('.m61-swipe-hint')].every(el=>getComputedStyle(el).display!=='none'),
              featureScrollable:q('#v3-features .feature-window').scrollWidth>
                q('#v3-features .feature-window').clientWidth+100,
              experienceSnap:getComputedStyle(track).scrollSnapType.includes('x'),
              experiencePeek:innerWidth<=480 ?
                first.left>=10&&first.right<=innerWidth-10&&second.left>=innerWidth-16&&
                  second.left<innerWidth&&second.right>innerWidth :
                first.left>=-1&&first.right<=innerWidth+1&&second.left<innerWidth-8,
              featureFull:featureFirst.left>=10&&featureFirst.right<=innerWidth-10&&
                (innerWidth>480||featureSecond.left>=featureFirst.right+8&&
                  featureSecond.left<innerWidth-8),
              featureNoPartialTitle:innerWidth>480||(
                Math.abs(featureViewport.width-featureFirst.width)<=2&&
                featureFirst.left>=featureViewport.left-1&&
                featureFirst.right<=featureViewport.right+1&&
                featureSecond.left>=featureViewport.right+8),
              featureCompact:featureFirst.width<=Math.min(300,innerWidth-88)+2&&
                cardArt.height<=247&&innerCard.left>=cardArt.left-2&&
                innerCard.right<=cardArt.right+2&&
                innerCard.top>=cardArt.top-2&&innerCard.bottom<=cardArt.bottom+2,
              phoneCompact:phone.width<=235&&phoneArt.height<=491&&
                phone.left>=phoneArt.left-2&&phone.right<=phoneArt.right+2&&
                phone.top>=phoneArt.top-2&&phone.bottom<=phoneArt.bottom-12,
              demoCompact:demo.width<=(innerWidth<=480?
                Math.min(340,innerWidth-58):Math.min(480,innerWidth-80))+2&&
                Math.abs(demo.width-controls.width)<=2,
              previewAssetsVisible:innerWidth>480||finalAsset.bottom<=demo.bottom-3,
              previewAssetCount:innerWidth>480||visibleAssets.length===(innerWidth<=360?1:2),
              previewScale:innerWidth>480||
                previewScale>=(innerWidth<=360?.72:.80)-.001,
              previewLandscape:Math.abs(demo.width/demo.height-16/9)<=.025,
              previewReadable:innerWidth>480||(
                q('#v3-workspace .ws-sidebar').getBoundingClientRect().width<=67&&
                parseFloat(getComputedStyle(q('#v3-workspace .dp-quick-action')).fontSize)>=10&&
                parseFloat(getComputedStyle(q('#v3-workspace .dp-heading h3')).fontSize)>=14),
              securityCopyReadable:
                parseFloat(getComputedStyle(q('#v3-security .security-principle p')).fontSize)>=13&&
                parseFloat(getComputedStyle(q('#v3-security .security-disclaimer')).fontSize)>=10,
              swipeHintReadable:parseFloat(getComputedStyle(q('#v3-features .m61-swipe-hint')).fontSize)>=12
            };
          });
          assert(compactLayout.workspaceStack&&compactLayout.workspaceWidth&&
            compactLayout.workspaceMin<=970&&
            compactLayout.fullViewportChapters.every(item=>item.height>=height-1)&&
            compactLayout.footerTouchTargets&&
            compactLayout.swipeHints&&compactLayout.featureScrollable&&
            compactLayout.experienceSnap&&compactLayout.experiencePeek&&
            compactLayout.featureFull&&compactLayout.featureNoPartialTitle&&
            compactLayout.featureCompact&&compactLayout.phoneCompact&&
            compactLayout.demoCompact&&compactLayout.previewLandscape&&
            compactLayout.previewAssetsVisible&&compactLayout.previewAssetCount&&
            compactLayout.previewScale&&compactLayout.previewReadable&&
            compactLayout.securityCopyReadable&&compactLayout.swipeHintReadable,
            `${prefix}: mobile scenes must stack naturally and expose swipable cards ${JSON.stringify(compactLayout)}`);
        }
        const mobileActions=await page.evaluate(measureMobileDownloads);
        checkMobileDownloads(mobileActions,prefix,'en');
        mobileDownloadObservations.push({viewport:name,theme,locale:'en',actions:mobileActions});
        assert(state.theme===theme,`${prefix}: theme switch mismatch`);
        assert(state.cards===5,`${prefix}: missing feature card`);
        const palette=state.buttonSystem;
        // Approved Web/Native 1.1.0 semantic action and raised-surface palette.
        const primary=theme==='dark'?'rgb(0, 202, 138)':'rgb(15, 121, 84)';
        const onPrimary=theme==='dark'?'rgb(16, 19, 18)':'rgb(255, 255, 255)';
        const secondary=theme==='dark'?'rgb(32, 38, 35)':'rgb(255, 255, 255)';
        assert(palette.primary===primary&&palette.primaryInk===onPrimary,
          `${prefix}: primary button differs from approved 1.1.0 action/on-primary pair (${palette.primary}, ${palette.primaryInk})`);
        assert(state.sendBackground===primary,
          `${prefix}: Send example no longer uses primary surface (${state.sendBackground})`);
        assert(palette.secondary===secondary&&palette.topDownload===secondary,
          `${prefix}: hero/header secondary surfaces differ (${palette.secondary}, ${palette.topDownload})`);
        assert(state.swapBackground===(theme==='dark'?'rgb(255, 255, 255)':'rgb(17, 18, 20)'),
          `${prefix}: Swap example lost inverse action (${state.swapBackground})`);
        assert(palette.swapInk===(theme==='dark'?'rgb(17, 18, 20)':'rgb(255, 255, 255)'),
          `${prefix}: Swap inverse foreground is incorrect (${palette.swapInk})`);
        assert(palette.selectedTab===primary&&palette.selectedTabInk===onPrimary,
          `${prefix}: desktop selected tab must use the approved mode-specific on-primary text (${palette.selectedTab}, ${palette.selectedTabInk})`);
        assert(palette.disabledMobile.length===2&&palette.disabledMobile.every(x=>x.disabled&&x.background==='rgb(52, 52, 60)'),
          `${prefix}: mobile download controls should be neutral and disabled (${JSON.stringify(palette.disabledMobile)})`);
        assert(palette.disabledDesktop.disabled&&palette.disabledDesktop.background===(theme==='dark'?'rgb(41, 51, 46)':'rgb(243, 243, 245)'),
          `${prefix}: desktop download should be neutral and disabled (${JSON.stringify(palette.disabledDesktop)})`);
        if(theme==='dark'&&width>680){
          assert(state.navigation.background==='rgb(32, 38, 35)',
            `${prefix}: dark navigation background differs from Fresnica raised surface (${state.navigation.background})`);
          assert(state.navigation.border==='rgb(48, 57, 52)',
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
        for(const id of name==='desktop-1440'?sceneIds:['overview','v3-ecosystem','v3-availability','v3-features','v3-workspace']){
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
            assert(footerNav.background==='rgb(32, 38, 35)',
              `${prefix}: footer navigation reverted to light surface (${footerNav.background})`);
          }
          if(id==='v3-ecosystem'&&width<=680){
            const particles=await page.evaluate(()=>{
              const scene=document.getElementById('v3-ecosystem').getBoundingClientRect();
              const intro=document.querySelector('#v3-ecosystem .orbital-intro').getBoundingClientRect();
              const bottom=document.querySelector('#v3-ecosystem .bottom-intro').getBoundingClientRect();
              const cloud=document.querySelector('#v3-ecosystem .particle-cloud').getBoundingClientRect();
              const rects=[...document.querySelectorAll('#v3-ecosystem .stream-dot')]
                .map(dot=>dot.getBoundingClientRect());
              const minX=Math.min(...rects.map(r=>r.left));
              const maxX=Math.max(...rects.map(r=>r.right));
              const minY=Math.min(...rects.map(r=>r.top));
              const maxY=Math.max(...rects.map(r=>r.bottom));
              return {count:rects.length,centerX:cloud.left+cloud.width/2,
                cloudWidth:cloud.width,sceneWidth:scene.width,minX,maxX,
                topGap:minY-intro.bottom,bottomGap:bottom.top-maxY,
                sceneTop:scene.top,sceneBottom:scene.bottom};
            });
            assert(particles.count===136&&Math.abs(particles.centerX-width/2)<2&&
              particles.cloudWidth>=particles.sceneWidth*.9&&
              particles.maxX-particles.minX>=width*.78&&
              particles.minX>=-2&&particles.maxX<=width+2&&
              particles.topGap>=5&&particles.bottomGap>=5,
              `${prefix}: mobile particle composition is clipped or overlaps copy (${JSON.stringify(particles)})`);
          }
          if(id==='v3-features'&&name==='desktop-1440'){
            const balance=await page.evaluate(()=>{
              const scene=document.querySelector('#v3-features .feature-chapter');
              const heading=scene.querySelector('.feature-heading').getBoundingClientRect();
              const cards=[...scene.querySelectorAll('.feature-card')].map(card=>card.getBoundingClientRect());
              const frame=scene.getBoundingClientRect();
              const bottom=Math.max(...cards.map(rect=>rect.bottom));
              return {
                centerRatio:((heading.top+bottom)/2-frame.top)/frame.height,
                headingTop:heading.top-frame.top,
                contentBottom:bottom-frame.top,
                firstLeft:cards[0].left,lastRight:cards.at(-1).right,
                frameHeight:frame.height
              };
            });
            assert(balance.centerRatio>=.42&&balance.centerRatio<=.55&&
              balance.headingTop>=75&&balance.contentBottom<=balance.frameHeight-40&&
              balance.firstLeft>=-1&&balance.lastRight<=width+1,
              `${prefix}: five-card feature group is not vertically balanced or clipped (${JSON.stringify(balance)})`);
          }
          if(id==='v3-for-you'&&name==='desktop-1440'){
            const balance=await page.evaluate(()=>{
              const scene=document.getElementById('v3-for-you');
              const heading=scene.querySelector('.audience-title').getBoundingClientRect();
              const card=scene.querySelector('.audience-card').getBoundingClientRect();
              const frame=scene.getBoundingClientRect();
              return {
                centerRatio:((heading.top+card.bottom)/2-frame.top)/frame.height,
                headingTop:heading.top-frame.top,
                cardBottom:card.bottom-frame.top,
                frameHeight:frame.height
              };
            });
            assert(balance.centerRatio>=.44&&balance.centerRatio<=.54&&
              balance.headingTop>=90&&balance.cardBottom<=balance.frameHeight-90,
              `${prefix}: experience reel is vertically off-balance or clipped (${JSON.stringify(balance)})`);
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
          const platformOptions=await page.locator('#download-menu [data-download-platform]').evaluateAll(links=>
            links.map(link=>({
              platform:link.dataset.downloadPlatform,
              label:link.textContent.trim(),
              href:link.getAttribute('href'),
              disabled:link.getAttribute('aria-disabled')==='true',
              iconCount:link.querySelectorAll('svg.download-platform-icon').length,
              iconDecorative:link.querySelector('svg.download-platform-icon')?.getAttribute('aria-hidden')==='true',
              group:getComputedStyle(link.closest('.download-platform-group')).backgroundColor
            })));
          assert(platformOptions.length===3&&
            platformOptions.map(option=>option.platform).join(',')==='ios,android,desktop'&&
            platformOptions.map(option=>option.label).join(',')==='iOS,Android,Desktop'&&
            platformOptions.every(option=>option.href===null&&option.disabled&&
              option.iconCount===1&&option.iconDecorative)&&
            platformOptions[0].group===platformOptions[1].group&&
            platformOptions[0].group!==platformOptions[2].group,
            'Download options must be distinct, direct-link-ready, and safely unavailable: '+
              JSON.stringify(platformOptions));
          const initialHash=await page.evaluate(()=>location.hash);
          await page.locator('#download-menu [data-download-platform="ios"]').click();
          assert(await page.evaluate(()=>location.hash)===initialHash&&
            await page.locator('#download-menu').evaluate(el=>el.classList.contains('is-open')),
            'Unavailable download option must not scroll to a page section');
          if(name==='desktop-1440'&&theme==='light'){
            const image=path.join(dest,'download-menu-desktop-1440.png');
            await page.screenshot({path:image,animations:'disabled'});
            captures.push(path.relative(dest,image));
          }
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
            document.querySelector('.footer-top > div:first-child > p:not(.chapter-kicker)')?.textContent?.includes('你的资产、收发与连接'),null,{timeout:5000}).catch(()=>{});
          const locale=await page.evaluate(()=>({lang:document.documentElement.lang,footer:document.querySelector('.footer-top > div:first-child > p:not(.chapter-kicker)')?.textContent||''}));
          assert(locale.lang==='zh-CN','Language picker did not switch to Chinese');
          const zhGetButton=await page.locator('#download-menu-button').evaluate(el=>({
            label:el.innerText.trim(),accessible:el.getAttribute('aria-label')
          }));
          assert(zhGetButton.label===(width<=480?'获取':'获取 Fresnica')&&
            zhGetButton.accessible==='获取 Fresnica 下载选项',
            'Top-right Get Fresnica Chinese label failed: '+JSON.stringify(zhGetButton));
          const zhPlatformOptions=await page.locator('#download-menu [data-download-platform]').allTextContents();
          assert(zhPlatformOptions.length===3&&
            zhPlatformOptions.map(label=>label.trim()).join(',')==='iOS,Android,桌面端',
            'Chinese download channels are untranslated or merged: '+JSON.stringify(zhPlatformOptions));
          const chineseNavWidth=await page.locator('.site-header .top-nav').evaluate(el=>el.getBoundingClientRect().width);
          assert(Math.abs(chineseNavWidth-state.navigation.width)<=1,
            `Changing the navigation language resized its capsule: ${chineseNavWidth}px vs ${state.navigation.width}px`);
          assert(locale.footer.includes('你的资产、收发与连接'),`Chinese footer translation missing; got: ${locale.footer.slice(0,120)}`);
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
            title:'让每一步更清晰',
            description:'面向 Stellar 生态',
            sendPreview:'发送 / 核对',
            activity:'每笔交易，清楚可查',
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
          assert((await page.title())==='Fresnica — A Clearer Way to Move',
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
    {name:'desktop-1280',width:1280,height:800},
    {name:'mobile-430',width:430,height:932},
    {name:'mobile-320',width:320,height:720}
  ]){
    for(const theme of ['light','dark']){
      const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
      page.on('pageerror',err=>failures.push(`zh/${name}/${theme}: browser error ${err.message}`));
      try{
        await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
        await page.evaluate(()=>document.fonts.ready);
        if(width<=680){
          await page.locator('#m60-menu-toggle').click();
          if(theme==='dark')await page.locator('[data-m60-theme]').click();
          await page.locator('[data-m60-language="zh-CN"]').click();
          await page.keyboard.press('Escape');
        }else{
          if(theme==='dark')await page.locator('#theme-toggle').click();
          await page.locator('#locale-toggle').click();
          await page.locator('[data-language="zh-CN"]').click();
        }
        await page.waitForFunction(()=>document.documentElement.lang==='zh-CN'&&
          document.getElementById('feature-title')?.textContent?.includes('核心所需'),null,{timeout:5000});
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
        if(width>680)assert(Math.abs(zhNavWidth-presetNavWidth)<=1,
          `zh/${name}/${theme}: navigation capsule changed width after localization (${zhNavWidth}px vs ${presetNavWidth}px)`);
        else {
          assert(await page.locator('#m60-menu-toggle').isVisible(),
            `zh/${name}/${theme}: mobile menu trigger missing after language change`);
          await page.locator('#m60-menu-toggle').click();
          await page.waitForFunction(()=>document.querySelector('.m60-theme')?.getAttribute('aria-label')==='切换深浅主题');
          assert((await page.locator('.m60-theme').getAttribute('aria-label'))==='切换深浅主题',
            `zh/${name}/${theme}: compact theme button accessibility label is not localized`);
          await page.keyboard.press('Escape');
        }
        assert(data.overflow<=8,`zh/${name}/${theme}: horizontal document overflow ${data.overflow}px`);
        if(width<=480){
          const captions=await page.evaluate(measureMobileHeroCaptions);
          assert(captions.horizontalOverlap<=1||captions.verticalGap>=8,
            `zh/${name}/${theme}: mobile hero caption overlaps status (${JSON.stringify(captions)})`);
        }
        assert((await page.locator('#v3-about').getAttribute('data-chapter'))==='关于',
          `zh/${name}/${theme}: About chapter label is not compact`);
        const footerLines=await page.evaluate(measureFooterLines);
        assert(footerLines.length>0&&footerLines.length<=(width<=430?2:1)&&
          footerLines.at(-1).length>=4,
          `zh/${name}/${theme}: footer headline leaves an orphan line (${JSON.stringify(footerLines)})`);
        const zhWraps=await page.evaluate(measureHeadlineWrap);
        for(const [kind,expected] of Object.entries({
          hero:3,availability:2,features:2,workspace:2,experience:2,security:2,faq:2
        })){
          assert(zhWraps[kind]?.lines===expected&&zhWraps[kind]?.scrollExcess<=3,
            `zh/${name}/${theme}: Chinese ${kind} heading unexpectedly wraps (${JSON.stringify(zhWraps[kind])})`);
        }
        const securityLabels=await page.evaluate(()=>[
          '#v3-security .security-visual > span:last-child',
          '#v3-security .security-principle > span',
          '#v3-security .security-disclaimer'
        ].map(selector=>{
          const el=document.querySelector(selector);
          return {selector,font:getComputedStyle(el).fontFamily,text:el.textContent.trim()};
        }));
        assert(securityLabels.every(label=>label.font.includes('Noto Sans SC')&&
          /[\u4e00-\u9fff]/.test(label.text)),
          `zh/${name}/${theme}: Chinese security micro-labels lack a CJK font (${JSON.stringify(securityLabels)})`);
        const zhMobileActions=await page.evaluate(measureMobileDownloads);
        checkMobileDownloads(zhMobileActions,`zh/${name}/${theme}`,'zh-CN');
        mobileDownloadObservations.push({viewport:name,theme,locale:'zh-CN',actions:zhMobileActions});
        for(const title of data.titles){
          assert(title.excess<=4,`zh/${name}/${theme}: ${title.selector} text overflows by ${title.excess}px`);
        }
        // Capture every scene in Chinese at 1440px, plus all text-bearing
        // chapters in compact layouts; 1280px checks the desktop breakpoint.
        const zhScenes=name==='desktop-1440'?sceneIds:
          name==='desktop-1280'?
            ['overview','v3-workspace','v3-security','v3-clarity','v3-about']:
            ['overview','v3-availability','v3-features','v3-workspace',
              'v3-for-you','v3-security','v3-clarity','v3-about'];
        for(const id of zhScenes){
          await page.evaluate(id=>{document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});},id);
          await page.waitForTimeout(140);
          if(id==='v3-for-you'&&name==='desktop-1440'){
            const balance=await page.evaluate(()=>{
              const scene=document.getElementById('v3-for-you');
              const heading=scene.querySelector('.audience-title').getBoundingClientRect();
              const card=scene.querySelector('.audience-card').getBoundingClientRect();
              const frame=scene.getBoundingClientRect();
              return {
                centerRatio:((heading.top+card.bottom)/2-frame.top)/frame.height,
                headingTop:heading.top-frame.top,
                cardBottom:card.bottom-frame.top,
                frameHeight:frame.height
              };
            });
            assert(balance.centerRatio>=.44&&balance.centerRatio<=.54&&
              balance.headingTop>=90&&balance.cardBottom<=balance.frameHeight-90,
              `zh/${name}/${theme}: experience reel is vertically off-balance or clipped (${JSON.stringify(balance)})`);
          }
          if(id==='v3-about'){
            if(width<=680){
              const footerGeometry=await page.locator('#v3-about').evaluate(el=>({
                top:el.getBoundingClientRect().top,
                height:el.getBoundingClientRect().height,
                computedMin:getComputedStyle(el).minHeight,
                scrollTop:document.getElementById('v3-page-scroll').scrollTop
              }));
              assert(Math.abs(footerGeometry.top)<=2,
                `zh/${name}/${theme}: footer cannot start at viewport top ${JSON.stringify(footerGeometry)}`);
            }
            const navLabel=await page.locator('#scene-menu-button').innerText();
            assert(navLabel.trim()==='关于',
              `zh/${name}/${theme}: footer navigation label is truncated (${navLabel})`);
          }
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
  // Opening a secondary page must preserve both the selected theme and locale.
  const noticeTrip=await browser.newPage({
    viewport:{width:1440,height:900},reducedMotion:'reduce',colorScheme:'light'
  });
  try{
    await noticeTrip.goto(base,{waitUntil:'load',timeout:45000});
    await noticeTrip.locator('#theme-toggle').click();
    await noticeTrip.locator('#locale-toggle').click();
    await noticeTrip.locator('[data-language="zh-CN"]').click();
    const href=await noticeTrip.locator('#v3-about .platform-credit').getAttribute('href');
    assert(href?.includes('lang=zh-CN')&&href?.includes('theme=dark'),
      'Theme/locale not passed to third-party notices: '+href);
    await noticeTrip.goto(new URL(href,base).href,{waitUntil:'load',timeout:30000});
    const noticeState=await noticeTrip.evaluate(()=>({
      lang:document.documentElement.lang,
      theme:document.documentElement.dataset.theme,
      background:getComputedStyle(document.body).backgroundColor,
      returnHref:document.querySelector('.back')?.getAttribute('href'),
      title:document.querySelector('h1')?.textContent?.trim(),
      chineseAttribution:document.querySelector('[data-i18n="robot"]')?.textContent?.includes('Android 机器人图标'),
      licenseTranslated:document.querySelector('[data-i18n="license"]')?.textContent?.includes('知识共享'),
      originalVisible:!document.querySelector('#original-copy')?.hidden,
      navigation:!!document.querySelector('.notice-header .brand img')&&
        !!document.querySelector('#section-toggle')&&
        !!document.querySelector('#download-toggle')
    }));
    assert(noticeState.lang==='zh-CN'&&noticeState.theme==='dark'&&
      noticeState.background==='rgb(23, 24, 27)'&&
      noticeState.returnHref?.includes('theme=dark')&&
      noticeState.title==='第三方声明'&&noticeState.chineseAttribution&&
      noticeState.licenseTranslated&&noticeState.originalVisible&&noticeState.navigation,
      'Notice page lost dark preference, navigation or Chinese legal copy: '+JSON.stringify(noticeState));
    await noticeTrip.locator('.back').click();
    await noticeTrip.waitForURL(url=>url.pathname.endsWith('/index.html'),{timeout:15000});
    // The preview defers fragment restoration until pageshow + a layout frame.
    // Observe the restored hash, not the moment the document URL first changes.
    await noticeTrip.waitForFunction(()=>location.hash==='#v3-about',null,{timeout:4000});
    const restored=await noticeTrip.evaluate(()=>({
      lang:document.documentElement.lang,
      dark:document.documentElement.classList.contains('v3-theme-dark'),
      pressed:document.querySelector('#theme-toggle')?.getAttribute('aria-pressed'),
      footerDay:document.querySelector('#v3-about')?.classList.contains('day'),
      hash:location.hash
    }));
    assert(restored.lang==='zh-CN'&&restored.dark&&restored.pressed==='true'&&
      !restored.footerDay&&restored.hash==='#v3-about',
      'Return navigation lost selected theme/locale: '+JSON.stringify(restored));
    await noticeTrip.locator('#theme-toggle').click();
    const lightHref=await noticeTrip.locator('#v3-about .platform-credit').getAttribute('href');
    assert(lightHref?.includes('theme=light'),'Explicit light theme not passed to notices');
    await noticeTrip.goto(new URL(lightHref,base).href,{waitUntil:'domcontentloaded',timeout:30000});
    assert(await noticeTrip.evaluate(()=>getComputedStyle(document.body).backgroundColor)==='rgb(247, 248, 247)',
      'Explicit light notice theme not honored');
  }catch(error){
    failures.push('notice language/theme roundtrip: '+String(error.message||error).slice(0,650));
  }finally{await noticeTrip.close();}
  // The secondary page has its own fully functional desktop and mobile header.
  for(const width of [320,393,1440]){
    const mobile=width<=680;
    const noticePage=await browser.newPage({
      viewport:{width,height:mobile?780:900},reducedMotion:'reduce',colorScheme:'light'
    });
    try{
      const url=new URL('third-party-notices.html?lang=zh-CN&theme=dark',base);
      await noticePage.goto(url.href,{waitUntil:'load',timeout:30000});
      const initial=await noticePage.evaluate(()=>{
        const rect=el=>el.getBoundingClientRect();
        const brand=rect(document.querySelector('.notice-header .brand'));
        const menu=rect(document.querySelector('#mobile-menu-toggle'));
        return {
          lang:document.documentElement.lang,theme:document.documentElement.dataset.theme,
          heading:document.querySelector('h1').textContent,
          chinese:document.querySelector('[data-i18n="trademark"]').textContent,
          robot:document.querySelector('[data-i18n="robot"]').textContent,
          originalVisible:!document.getElementById('original-copy').hidden,
          originalCredit:document.getElementById('original-copy').textContent.includes(
            'The Android robot is reproduced or modified from work created and shared by Google'),
          logoReady:document.querySelector('.brand img').naturalWidth>0,
          overflow:document.documentElement.scrollWidth-innerWidth,
          brandRight:brand.right,menuLeft:menu.left,
          dropdownArrowHidden:(()=>{
            const button=document.getElementById('section-toggle');
            return !button.querySelector('.chevron')&&
              getComputedStyle(button,'::before').display==='none'&&
              getComputedStyle(button,'::after').display==='none';
          })(),
          menuShown:getComputedStyle(document.getElementById('mobile-menu-toggle')).display!=='none',
          desktopShown:getComputedStyle(document.querySelector('.center-nav')).display!=='none'
        };
      });
      assert(initial.lang==='zh-CN'&&initial.theme==='dark'&&initial.heading==='第三方声明'&&
        initial.chinese.includes('Google LLC')&&initial.robot.includes('Android 机器人图标')&&
        initial.originalVisible&&initial.originalCredit&&initial.logoReady&&initial.overflow<=1&&
        initial.dropdownArrowHidden&&
        (mobile?(initial.menuShown&&initial.menuLeft-initial.brandRight>=8):initial.desktopShown),
        'Notice header/attribution failed '+width+': '+JSON.stringify(initial));
      const noticeChannels=await noticePage.evaluate(()=>{
        const inspect=selector=>[...document.querySelectorAll(selector)].map(el=>({
          platform:el.dataset.downloadPlatform,
          disabled:el.getAttribute('aria-disabled'),
          href:el.getAttribute('href'),
          tabindex:el.getAttribute('tabindex'),
          role:el.getAttribute('role')
        }));
        return {desktop:inspect('#download-menu [data-download-platform]'),
          mobile:inspect('#mobile-drawer [data-download-platform]'),
          groups:[...document.querySelectorAll('#download-menu [role="group"]')]
            .map(group=>group.getAttribute('aria-label')),
          caption:document.querySelector('[data-i18n="downloadCaption"]').textContent.trim()};
      });
      assert(noticeChannels.desktop.length===3&&noticeChannels.mobile.length===3&&
        [...noticeChannels.desktop,...noticeChannels.mobile].every((el,index)=>
          el.platform===['ios','android','desktop'][index%3]&&
          el.disabled==='true'&&el.href===null&&
          el.tabindex==='0'&&el.role==='link')&&
        noticeChannels.caption==='官方下载渠道尚未开放'&&
        noticeChannels.groups.join(',')==='移动端应用,桌面端',
        'Notice download menus must be bilingual and unavailable: '+JSON.stringify(noticeChannels));
      if(mobile){
        await noticePage.locator('#mobile-menu-toggle').click();
        assert(!await noticePage.locator('#mobile-drawer').evaluate(el=>el.hidden)&&
          await noticePage.locator('#mobile-menu-toggle').getAttribute('aria-expanded')==='true',
          'Notice mobile drawer did not open '+width);
        const noticeUrlBefore=noticePage.url();
        const mobileUnavailable=noticePage.locator('#mobile-drawer [data-download-platform="ios"]');
        assert(!await mobileUnavailable.isEnabled(),'Notice mobile download should be disabled');
        await mobileUnavailable.dispatchEvent('click');
        assert(noticePage.url()===noticeUrlBefore&&
          !await noticePage.locator('#mobile-drawer').evaluate(el=>el.hidden),
          'Unavailable notice mobile download must not navigate or close drawer');
        await noticePage.locator('#mobile-drawer [data-language="en"]').click();
        const english=await noticePage.evaluate(()=>({
          lang:document.documentElement.lang,
          title:document.querySelector('h1').textContent,
          copy:document.querySelector('[data-i18n="robot"]').textContent,
          originalHidden:document.getElementById('original-copy').hidden,
          closed:document.getElementById('mobile-drawer').hidden
        }));
        assert(english.lang==='en'&&english.title==='Third-party notices'&&
          english.copy.startsWith('The Android robot is reproduced')&&
          english.originalHidden&&english.closed,
          'Notice mobile language switch failed '+width+': '+JSON.stringify(english));
        await noticePage.locator('#mobile-menu-toggle').click();
        await noticePage.locator('#mobile-drawer [data-language="zh-CN"]').click();
        await noticePage.locator('#mobile-menu-toggle').click();
        await noticePage.locator('#mobile-theme').click();
        const prefs=await noticePage.evaluate(()=>({
          lang:document.documentElement.lang,theme:document.documentElement.dataset.theme,
          href:document.querySelector('#mobile-drawer [data-target="v3-workspace"]').getAttribute('href')
        }));
        assert(prefs.lang==='zh-CN'&&prefs.theme==='light'&&
          prefs.href.includes('lang=zh-CN')&&prefs.href.includes('theme=light')&&
          prefs.href.includes('#v3-workspace'),
          'Notice mobile state not preserved in page links '+width+': '+JSON.stringify(prefs));
        await noticePage.keyboard.press('Escape');
        assert(await noticePage.locator('#mobile-drawer').evaluate(el=>el.hidden),
          'Notice mobile Escape did not close drawer');
      }else{
        await noticePage.locator('#section-toggle').click();
        assert(!await noticePage.locator('#section-menu').evaluate(el=>el.hidden),
          'Notice section navigation did not open');
        await noticePage.keyboard.press('Escape');
        assert(await noticePage.locator('#section-menu').evaluate(el=>el.hidden),
          'Notice section navigation did not close with Escape');
        await noticePage.locator('#download-toggle').click();
        assert(!await noticePage.locator('#download-menu').evaluate(el=>el.hidden)&&
          await noticePage.locator('#download-menu [data-download-platform]').count()===3,
          'Notice desktop download menu did not show separate channels');
        const noticeUrlBefore=noticePage.url();
        const desktopUnavailable=noticePage.locator('#download-menu [data-download-platform="ios"]');
        assert(!await desktopUnavailable.isEnabled(),'Notice desktop download should be disabled');
        await desktopUnavailable.dispatchEvent('click');
        assert(noticePage.url()===noticeUrlBefore&&
          !await noticePage.locator('#download-menu').evaluate(el=>el.hidden),
          'Unavailable notice desktop download must not navigate or close menu');
        await noticePage.keyboard.press('Escape');
        await noticePage.locator('#language-toggle').click();
        await noticePage.locator('#language-menu [data-language="en"]').click();
        await noticePage.locator('#theme-toggle').click();
        const prefs=await noticePage.evaluate(()=>({
          lang:document.documentElement.lang,theme:document.documentElement.dataset.theme,
          text:document.querySelector('[data-i18n="trademark"]').textContent,
          href:document.querySelector('.back').getAttribute('href')
        }));
        assert(prefs.lang==='en'&&prefs.theme==='light'&&
          prefs.text==='Android is a trademark of Google LLC.'&&
          prefs.href.includes('theme=light')&&!prefs.href.includes('lang=zh-CN'),
          'Notice desktop locale/theme controls failed: '+JSON.stringify(prefs));
      }
      const image=path.join(dest,'notice-header-'+width+'.png');
      await noticePage.screenshot({path:image});
      captures.push(path.relative(dest,image));
      console.log('[V3 browser] notice-header-'+width+' PASS');
    }catch(error){
      failures.push('notice header '+width+': '+String(error.message||error).slice(0,700));
    }finally{await noticePage.close();}
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
      sample?.validHold===true&&sample?.viewport?.width===390&&
      sample?.viewport?.height===844&&
      await perfPage.locator('#v3-perf-export').isEnabled(),
      'Opt-in device probe failed to produce a valid stable sample: '+JSON.stringify(sample));
    const interrupted=await perfPage.evaluate(async()=>{
      const scroller=document.getElementById('v3-page-scroll');
      const root=document.documentElement;
      const initialScroll=scroller.scrollTop,initialLang=root.lang;
      const oldDark=root.classList.contains('v3-theme-dark');
      const sampling=window.__v3PerfProbe.record(350);
      await new Promise(resolve=>setTimeout(resolve,80));
      scroller.scrollTop=initialScroll+180;
      root.classList.toggle('v3-theme-dark');
      root.lang=initialLang==='en'?'zh-CN':'en';
      await new Promise(resolve=>setTimeout(resolve,80));
      scroller.scrollTop=initialScroll;
      root.classList.toggle('v3-theme-dark',oldDark);
      root.lang=initialLang;
      return sampling;
    });
    assert(interrupted?.validHold===false&&
      interrupted.changedDuringSample?.scrolled===true&&
      interrupted.changedDuringSample?.theme===true&&
      interrupted.changedDuringSample?.language===true,
      'Probe accepted a scrolled/changed sample that returned to its start state: '+
        JSON.stringify(interrupted));
    const downloadPromise=perfPage.waitForEvent('download',{timeout:5000});
    await perfPage.locator('#v3-perf-export').click();
    const download=await downloadPromise;
    assert(/^fresnica-v3-device-perf-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z-1\.json$/.test(download.suggestedFilename()),
      'Unexpected device probe export name: '+download.suggestedFilename());
    const exported=JSON.parse(await fs.promises.readFile(await download.path(),'utf8'));
    assert(exported.schema==='fresnica-v3-device-probe-v1'&&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(exported.exportedAt)&&
      download.suggestedFilename().includes(exported.exportedAt.replace(/[:.]/g,'-'))&&
      exported.samples?.length===2&&
      exported.samples[0].validHold===true&&
      exported.samples[0].viewport?.width===390&&
      exported.samples[1].validHold===false&&
      exported.samples[1].changedDuringSample?.scrolled===true,
      'Downloaded device report lost the raw stable/interrupted results');
    // Consecutive exports must not reuse a name or silently overwrite an earlier capture.
    const secondPromise=perfPage.waitForEvent('download',{timeout:5000});
    await perfPage.locator('#v3-perf-export').click();
    const second=await secondPromise;
    assert(second.suggestedFilename()!==download.suggestedFilename()&&
      /^fresnica-v3-device-perf-.*-2\.json$/.test(second.suggestedFilename()),
      'Two same-session device exports reused a filename');
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
  // Emulated touch input complements viewport-only QA; this is not physical-device approval.
  const touchPage=await browser.newPage({viewport:{width:390,height:844},
    deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  try{
    await touchPage.goto(base,{waitUntil:'load',timeout:45000});
    await touchPage.evaluate(()=>document.fonts.ready);
    await touchPage.waitForFunction(()=>
      document.documentElement.classList.contains('m10-framed')&&
      document.getElementById('m60-menu-toggle'));
    const cdp=await touchPage.context().newCDPSession(touchPage);
    const swipe=async(x1,y1,x2,y2)=>{
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',
        touchPoints:[{x:x1,y:y1,id:0}]});
      for(let step=1;step<=12;step++){
        const t=step/12;
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{
          x:x1+(x2-x1)*t,y:y1+(y2-y1)*t,id:0
        }]});
        await touchPage.waitForTimeout(18);
      }
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await touchPage.waitForTimeout(360);
    };
    const before=await touchPage.evaluate(()=>({
      width:innerWidth,scroll:document.getElementById('v3-page-scroll').scrollTop,
      touch:matchMedia('(pointer:coarse)').matches
    }));
    assert(before.width===390&&before.touch,'Mobile touch emulation not active: '+JSON.stringify(before));
    await touchPage.locator('#m60-menu-toggle').tap();
    const modalScroll=await touchPage.evaluate(()=>document.getElementById('v3-page-scroll').scrollTop);
    await swipe(330,675,330,275);
    const locked=await touchPage.evaluate(()=>({
      scroll:document.getElementById('v3-page-scroll').scrollTop,
      open:document.documentElement.classList.contains('m60-menu-open'),
      inert:document.getElementById('v3-page-frame').inert
    }));
    assert(locked.open&&locked.inert&&Math.abs(locked.scroll-modalScroll)<=2,
      'Mobile drawer did not lock background during touch scroll: '+JSON.stringify(locked));
    await touchPage.locator('.m60-drawer-close').tap();
    await swipe(190,715,190,250);
    const afterScroll=await touchPage.evaluate(()=>document.getElementById('v3-page-scroll').scrollTop);
    assert(afterScroll>=before.scroll+45,
      'Touch swipe did not scroll the mobile page: '+JSON.stringify({before,afterScroll}));

    async function checkTouchRail(selector){
      const info=await touchPage.evaluate(selector=>{
        const node=document.querySelector(selector);
        node.scrollIntoView({block:'center',behavior:'instant'});
        node.scrollLeft=0;
        const r=node.getBoundingClientRect();
        return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,
          extent:node.scrollWidth-node.clientWidth};
      },selector);
      const y=Math.max(100,Math.min(740,(info.top+info.bottom)/2));
      await swipe(info.right-45,y,info.left+45,y);
      const moved=await touchPage.locator(selector).evaluate(el=>el.scrollLeft);
      assert(info.extent>100&&moved>=30,
        'Horizontal touch swipe failed for '+selector+': '+JSON.stringify({info,moved}));
    }
    await checkTouchRail('#feature-window');
    await checkTouchRail('#v3-for-you .audience-track');
    await touchPage.locator('#desktop-tab-swap').tap();
    assert(await touchPage.locator('#desktop-tab-swap').getAttribute('aria-selected')==='true',
      'Mobile tap did not switch desktop preview to Swap');
    // The long security chapter remains scrollable; the following FAQ occupies its own
    // viewport without exposing the prior security content or the next footer.
    const securityTop=await touchPage.evaluate(()=>{
      const chapter=document.getElementById('v3-security');
      chapter.scrollIntoView({block:'start',behavior:'instant'});
      return document.getElementById('v3-page-scroll').scrollTop;
    });
    await swipe(190,700,190,255);
    const securityScrolled=await touchPage.evaluate(()=>
      document.getElementById('v3-page-scroll').scrollTop);
    assert(securityScrolled>=securityTop+45,
      'Security chapter did not accept vertical touch scrolling');
    const faqBoundary=await touchPage.evaluate(()=>{
      const faq=document.getElementById('v3-clarity');
      faq.scrollIntoView({block:'start',behavior:'instant'});
      const root=document.getElementById('v3-page-scroll').getBoundingClientRect();
      const previous=document.getElementById('v3-security').getBoundingClientRect();
      const current=faq.getBoundingClientRect();
      const next=document.getElementById('v3-about').getBoundingClientRect();
      return {rootTop:root.top,rootBottom:root.bottom,previousBottom:previous.bottom,
        faqTop:current.top,faqHeight:current.height,nextTop:next.top,viewport:innerHeight};
    });
    assert(Math.abs(faqBoundary.faqTop-faqBoundary.rootTop)<=2&&
      faqBoundary.previousBottom<=faqBoundary.rootTop+2&&
      faqBoundary.faqHeight>=faqBoundary.viewport-1&&
      faqBoundary.nextTop>=faqBoundary.rootBottom-2,
      'Mobile security/FAQ boundary exposed adjacent chapters: '+
        JSON.stringify(faqBoundary));
    await touchPage.locator('#v3-clarity .faq-line button').first().tap();
    assert(await touchPage.locator('#v3-clarity .faq-line button').first()
      .getAttribute('aria-expanded')==='true',
      'Mobile FAQ did not expand via touch');
    console.log('[V3 browser] touch-mobile-390 PASS (scroll, drawer, rails, tabs, security/FAQ)');
  }catch(error){
    failures.push('mobile touch emulation: '+String(error.message||error).slice(0,700));
  }finally{await touchPage.close();}
  // Mobile particle upgrade: verify real no-preference operation (not only reduced-motion screenshots).
  const staticPage=await browser.newPage({viewport:{width:393,height:852},
    reducedMotion:'no-preference',deviceScaleFactor:1});
  try{
    await staticPage.goto(base,{waitUntil:'load',timeout:45000});
    await staticPage.evaluate(()=>document.fonts.ready);
    await staticPage.waitForFunction(()=>
      document.documentElement.classList.contains('m10-framed')&&
      document.getElementById('orb-center-logo')?.naturalWidth>0&&
      document.getElementById('orb-particles')?.dataset.dotCount==='980');
    const state=await staticPage.evaluate(()=>{
      const dot=document.querySelector('#v3-ecosystem .stream-dot');
      const core=document.querySelector('#v3-ecosystem .ecosystem-core');
      return {
        heroDots:Number(document.getElementById('orb-particles').dataset.dotCount),
        mobileNoWebGL:document.getElementById('orb-canvas').style.display==='none',
        fallbackShown:document.getElementById('fallback-orb').style.display==='block',
        ecosystemDots:document.querySelectorAll('#v3-ecosystem .stream-dot').length,
        ecosystemDotRange:(()=>{
          const widths=[...document.querySelectorAll('#v3-ecosystem .stream-dot')]
            .map(el=>parseFloat(el.style.width));
          return [Math.min(...widths),Math.max(...widths)];
        })(),
        ecosystemSpreads:(()=>{
          const dot=[...document.querySelectorAll('#v3-ecosystem .stream-dot')]
            .find(el=>Math.abs(parseFloat(el.style.getPropertyValue('--from-x')))>5&&
              Math.abs(parseFloat(el.style.getPropertyValue('--from-y')))>5);
          if(!dot)return null;
          return {
            horizontal:Math.abs(parseFloat(dot.style.getPropertyValue('--fallback-x'))/
              parseFloat(dot.style.getPropertyValue('--from-x'))),
            vertical:Math.abs(parseFloat(dot.style.getPropertyValue('--fallback-y'))/
              parseFloat(dot.style.getPropertyValue('--from-y')))
          };
        })(),
        ecosystemPaused:getComputedStyle(dot).animationName==='ecosystem-mobile-stream-in'&&
          getComputedStyle(dot).animationPlayState==='paused',
        ecosystemCoreStill:getComputedStyle(core,'::before').animationName==='none'
      };
    });
    assert(state.mobileNoWebGL&&state.fallbackShown&&state.heroDots===980&&
      state.ecosystemDots===136&&state.ecosystemPaused&&state.ecosystemCoreStill&&
      state.ecosystemDotRange[0]>=2.1&&state.ecosystemDotRange[1]<=4.6&&
      Math.abs(state.ecosystemSpreads.horizontal-1.50)<.02&&
      Math.abs(state.ecosystemSpreads.vertical-.50)<.02,
      'Mobile particle size/density/idle contract failed: '+JSON.stringify(state));
    const motionDot=staticPage.locator('#v3-ecosystem .stream-dot').first();
    await staticPage.evaluate(()=>document.getElementById('v3-ecosystem')
      .scrollIntoView({block:'center',behavior:'instant'}));
    await staticPage.waitForFunction(()=>document.documentElement.dataset.m14Active==='v3-ecosystem'&&
      getComputedStyle(document.querySelector('#v3-ecosystem .stream-dot')).animationPlayState==='running');
    const beforeMove=await motionDot.evaluate(el=>getComputedStyle(el).transform);
    await staticPage.waitForTimeout(250);
    const afterMove=await motionDot.evaluate(el=>getComputedStyle(el).transform);
    assert(beforeMove!==afterMove,
      'Mobile screen-two dots did not move inward during the active scene');
    await staticPage.locator('#m60-menu-toggle').click();
    await staticPage.waitForFunction(()=>getComputedStyle(document.querySelector(
      '#v3-ecosystem .stream-dot')).animationPlayState==='paused');
    await staticPage.keyboard.press('Escape');
    await staticPage.waitForFunction(()=>getComputedStyle(document.querySelector(
      '#v3-ecosystem .stream-dot')).animationPlayState==='running');
    await staticPage.evaluate(()=>document.getElementById('v3-availability')
      .scrollIntoView({block:'center',behavior:'instant'}));
    await staticPage.waitForFunction(()=>document.documentElement.dataset.m14Active!=='v3-ecosystem'&&
      getComputedStyle(document.querySelector('#v3-ecosystem .stream-dot')).animationPlayState==='paused');
    await staticPage.emulateMedia({reducedMotion:'reduce'});
    const reducedDot=await motionDot.evaluate(el=>({
      animation:getComputedStyle(el).animationName,
      opacity:Number(getComputedStyle(el).opacity)
    }));
    assert(reducedDot.animation==='none'&&reducedDot.opacity>=.68,
      'Mobile reduce-motion fallback lost static dots: '+JSON.stringify(reducedDot));
    await staticPage.emulateMedia({reducedMotion:'no-preference'});
    console.log('[V3 browser] mobile-393 screen-two particle motion PASS (visible, menu, offscreen, reduce)');
    async function checkStaticCanvas(scene,selector,ready,minDots){
      await staticPage.evaluate(id=>document.getElementById(id)?.scrollIntoView({
        block:'center',behavior:'instant'}),scene);
      await staticPage.waitForFunction(({selector,ready})=>{
        const element=document.querySelector(selector);
        return element&&Number(element.dataset.dotCount)>0&&
          (!ready||document.querySelector(ready));
      },{selector,ready},{timeout:12000});
      await staticPage.waitForTimeout(280);
      const before=await staticPage.locator(selector).evaluate(el=>({
        fingerprint:el.toDataURL('image/png'),dots:Number(el.dataset.dotCount)
      }));
      await staticPage.waitForTimeout(680);
      const after=await staticPage.locator(selector).evaluate(el=>el.toDataURL('image/png'));
      assert(before.dots>=minDots&&before.fingerprint===after,
        `Mobile static ${scene} Canvas changed while idle or lost density: `+
        JSON.stringify({dots:before.dots,stable:before.fingerprint===after}));
      const image=path.join(dest,`mobile-static-${scene}.png`);
      await staticPage.screenshot({path:image,animations:'disabled'});
      captures.push(path.relative(dest,image));
    }
    await checkStaticCanvas('overview','#orb-particles',null,980);
    await checkStaticCanvas('v3-security','#v3-security .security-particle-canvas',
      '#v3-security .has-particle-shape',1200);
    await checkStaticCanvas('v3-about','#footer-particles',
      '#v3-about .particles-ready',80);
    const footerBefore=await staticPage.locator('#footer-particles')
      .evaluate(el=>el.toDataURL('image/png'));
    await staticPage.locator('#m60-menu-toggle').click();
    await staticPage.locator('[data-m60-theme]').click();
    await staticPage.keyboard.press('Escape');
    const footerAfter=await staticPage.locator('#footer-particles')
      .evaluate(el=>el.toDataURL('image/png'));
    assert(footerBefore!==footerAfter,
      'Static mobile footer failed to recolor when the theme changed');
  }catch(error){
    failures.push('mobile static particle QA: '+String(error.message||error).slice(0,700));
  }finally{await staticPage.close();}
  // Check the two compact breakpoints with animation enabled, not only static screenshots.
  for(const [width,height] of [[320,720],[680,900]]){
    const movingPage=await browser.newPage({viewport:{width,height},
      reducedMotion:'no-preference',deviceScaleFactor:1});
    try{
      await movingPage.goto(base,{waitUntil:'load',timeout:45000});
      await movingPage.evaluate(()=>document.fonts.ready);
      await movingPage.evaluate(()=>document.getElementById('v3-ecosystem')
        .scrollIntoView({block:'center',behavior:'instant'}));
      await movingPage.waitForFunction(()=>
        document.documentElement.dataset.m14Active==='v3-ecosystem'&&
        getComputedStyle(document.querySelector('#v3-ecosystem .stream-dot')).animationPlayState==='running');
      const state=await movingPage.evaluate(()=>{
        const scene=document.getElementById('v3-ecosystem');
        const top=scene.querySelector('.orbital-intro').getBoundingClientRect();
        const bottom=scene.querySelector('.bottom-intro').getBoundingClientRect();
        const dots=[...scene.querySelectorAll('.stream-dot')];
        const rects=dots.map(el=>el.getBoundingClientRect());
        const styles=dots.map(el=>getComputedStyle(el));
        return {
          count:dots.length,
          sizes:[Math.min(...dots.map(el=>parseFloat(el.style.width))),
            Math.max(...dots.map(el=>parseFloat(el.style.width)))],
          animation:styles[0].animationName,
          cloudWidth:scene.querySelector('.particle-cloud').getBoundingClientRect().width,
          sceneWidth:scene.getBoundingClientRect().width,
          topGap:Math.min(...rects.map(r=>r.top))-top.bottom,
          bottomGap:bottom.top-Math.max(...rects.map(r=>r.bottom)),
          left:Math.min(...rects.map(r=>r.left)),right:Math.max(...rects.map(r=>r.right))
        };
      });
      assert(state.count===136&&state.animation==='ecosystem-mobile-stream-in'&&
        state.sizes[0]>=2.1&&state.sizes[1]<=4.6&&
        state.cloudWidth>=state.sceneWidth*.9&&
        state.topGap>=-2&&state.bottomGap>=-2&&state.left>=-2&&state.right<=width+2,
        `Mobile animated particle geometry is clipped or overlaps text at ${width}px: ${JSON.stringify(state)}`);
      const first=await movingPage.locator('#v3-ecosystem .stream-dot').first()
        .evaluate(el=>getComputedStyle(el).transform);
      await movingPage.waitForTimeout(240);
      const next=await movingPage.locator('#v3-ecosystem .stream-dot').first()
        .evaluate(el=>getComputedStyle(el).transform);
      assert(first!==next,`Particle motion did not advance at ${width}px`);
      // Screenshot the settled chapter, not its staggered text entrance frames.
      await movingPage.waitForFunction(()=>{
        const copy=document.querySelectorAll('#v3-ecosystem .bottom-intro .reveal');
        return copy.length===3&&[...copy].every(el=>
          Number(getComputedStyle(el).opacity)>=.99&&
          !el.getAnimations().some(animation=>animation.playState==='running'));
      },null,{timeout:6000});
      const image=path.join(dest,`mobile-ecosystem-motion-${width}.png`);
      await movingPage.screenshot({path:image});
      captures.push(path.relative(dest,image));
      await movingPage.evaluate(()=>document.getElementById('v3-availability')
        .scrollIntoView({block:'center',behavior:'instant'}));
      await movingPage.waitForFunction(()=>document.documentElement.dataset.m14Active!=='v3-ecosystem'&&
        getComputedStyle(document.querySelector('#v3-ecosystem .stream-dot')).animationPlayState==='paused');
      await movingPage.evaluate(()=>document.getElementById('v3-ecosystem')
        .scrollIntoView({block:'center',behavior:'instant'}));
      await movingPage.waitForFunction(()=>document.documentElement.dataset.m14Active==='v3-ecosystem'&&
        getComputedStyle(document.querySelector('#v3-ecosystem .stream-dot')).animationPlayState==='running');
      console.log(`[V3 browser] mobile-${width} particle animation/reentry PASS`);
    }catch(error){
      failures.push(`mobile particle animation ${width}px: ${String(error.message||error).slice(0,650)}`);
    }finally{await movingPage.close();}
  }
  const dynamicPage=await browser.newPage({viewport:{width:1440,height:900},
    reducedMotion:'no-preference',deviceScaleFactor:1});
  try{
    await dynamicPage.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
    const desktopParticles=await dynamicPage.evaluate(()=>{
      const dot=document.querySelector('#v3-ecosystem .stream-dot');
      return {count:document.querySelectorAll('#v3-ecosystem .stream-dot').length,
        animation:getComputedStyle(dot).animationName,
        maxDotSize:Math.max(...[...document.querySelectorAll('#v3-ecosystem .stream-dot')]
          .map(el=>parseFloat(el.style.width)))};
    });
    assert(desktopParticles.count===96&&desktopParticles.animation==='ecosystem-stream-in'&&
      desktopParticles.maxDotSize>=5.5,
      'Desktop ecosystem particle animation unexpectedly changed: '+
      JSON.stringify(desktopParticles));
  }catch(error){
    failures.push('desktop particle motion regression: '+String(error.message||error).slice(0,550));
  }finally{await dynamicPage.close();}

  // Product-gallery regression: one shared dApps surface, approved accent roles,
  // bilingual labels, and a real 44px wallet switch inside the 61.8% header boundary.
  for(const config of [{theme:'light',lang:'en'},{theme:'dark',lang:'zh'}]){
    const gallery=await browser.newPage({viewport:{width:390,height:844},
      reducedMotion:'reduce',deviceScaleFactor:1});
    try{
      await gallery.addInitScript(({theme,lang})=>{
        localStorage.setItem('fresnica-gallery-theme',theme);
        localStorage.setItem('fresnica-gallery-language',lang);
      },config);
      await gallery.goto(new URL('mobile-dapps.html',base).href,{waitUntil:'load',timeout:45000});
      await gallery.waitForSelector('.gallery-sample-grid .gallery-app-card');
      const apps=await gallery.evaluate(()=>{
        const grid=document.querySelector('.gallery-sample-grid');
        const style=getComputedStyle(grid);
        const cards=[...grid.querySelectorAll('.gallery-app-card')];
        return {
          heading:document.querySelector('.gallery-section-title')?.textContent?.trim(),
          accessible:grid.getAttribute('aria-label'),
          containerColor:style.backgroundColor,
          borderWidth:parseFloat(style.borderTopWidth),
          apps:cards.map(card=>{
            const mark=card.querySelector('.gallery-app-mark');
            return {
              label:card.textContent.trim(),tileColor:getComputedStyle(card).backgroundColor,
              markColor:getComputedStyle(mark).backgroundColor,
              iconColor:getComputedStyle(mark).color,
              targetHeight:card.getBoundingClientRect().height
            };
          })
        };
      });
      const expected=config.lang==='zh'?'热门应用':'Popular apps';
      assert(apps.heading===expected&&apps.accessible===expected,
        'dApps localized section/accessible label mismatch: '+JSON.stringify({config,apps}));
      assert(apps.borderWidth>=1&&apps.apps.length===3&&
        new Set(apps.apps.map(app=>app.markColor)).size===3&&
        apps.apps.every(app=>app.tileColor==='rgba(0, 0, 0, 0)'&&
          app.markColor!==apps.containerColor&&app.targetHeight>=44),
        'dApps shared surface / colorful app mark regression: '+JSON.stringify({config,apps}));
      console.log('[V3 gallery] '+config.lang+'/'+config.theme+' dApps '+JSON.stringify(apps));
      const appImage=path.join(dest,'gallery-dapps-'+config.theme+'-'+config.lang+'.png');
      await gallery.locator('.home11-phone').screenshot({path:appImage,animations:'disabled'});
      captures.push(path.relative(dest,appImage));

      await gallery.goto(new URL('mobile-demo-1-1.html',base).href,{waitUntil:'load',timeout:45000});
      for(const width of [320,390]){
        await gallery.setViewportSize({width,height:844});
        const wallet=await gallery.evaluate(()=>{
          const header=document.querySelector('.home11-phone .phone-header');
          const overview=document.querySelector('.home11-account-overview');
          const brand=header?.querySelector('.phone-brand');
          const summary=document.querySelector('.home11-wallet-summary');
          const name=document.querySelector('.home11-wallet-name');
          const address=document.querySelector('.home11-wallet-address');
          const switcher=document.querySelector('.home11-wallet-switch');
          const avatar=document.querySelector('.home11-wallet-avatar');
          const avatarStyle=getComputedStyle(avatar);
          const network=header.querySelector('.home11-network-trigger');
          const group=summary.getBoundingClientRect(),overviewBox=overview.getBoundingClientRect();
          const usable=overview.clientWidth;
          return {
            walletName:name.textContent.trim(),
            brandName:brand?.textContent.trim(),
            brandLogo:!!brand?.querySelector('img[src="./Fresnica-logo.svg"]'),
            networkLabel:network?.textContent.trim(),
            walletIcon:!!avatar.querySelector('svg rect')&&!avatar.querySelector('svg circle'),
            avatarBg:avatarStyle.backgroundColor,avatarColor:avatarStyle.color,
            avatarSize:avatar.getBoundingClientRect().width,
            avatarIconSize:avatar.querySelector('svg').getBoundingClientRect().width,
            nameFont:parseFloat(getComputedStyle(name).fontSize),
            nameLineHeight:parseFloat(getComputedStyle(name).lineHeight),
            addressFont:parseFloat(getComputedStyle(address).fontSize),
            addressLineHeight:parseFloat(getComputedStyle(address).lineHeight),
            buttonWidth:switcher.getBoundingClientRect().width,
            buttonHeight:switcher.getBoundingClientRect().height,
            switchIconSize:switcher.querySelector('svg').getBoundingClientRect().width,
            switchIconPath:switcher.querySelector('svg path')?.getAttribute('d'),
            summaryWidth:group.width,allowedWidth:usable*.618,
            summaryRight:group.right,overviewLeft:overviewBox.left,
            nameClipped:name.scrollWidth>name.clientWidth+1,
            addressClipped:address.scrollWidth>address.clientWidth+1
          };
        });
        // Wallet identity keeps the same pale accent on both themes.
        const bluePalette={bg:'rgb(233, 239, 255)',ink:'rgb(30, 45, 82)'};
        assert(wallet.walletIcon&&wallet.avatarBg===bluePalette.bg&&
          wallet.avatarColor===bluePalette.ink&&wallet.avatarSize>=30&&
          wallet.avatarIconSize>=18,
          'Wallet avatar icon/auxiliary palette violation at '+width+
            'px: '+JSON.stringify({config,wallet}));
        assert(wallet.brandName==='Fresnica'&&wallet.brandLogo&&
          wallet.networkLabel.includes('Stellar')&&
          wallet.nameFont>=16&&wallet.nameLineHeight>=22&&
          wallet.addressFont>=12&&wallet.addressLineHeight>=16&&
          wallet.buttonWidth>=44&&wallet.buttonHeight>=44&&
          wallet.switchIconSize===16&&wallet.switchIconPath==='m7 10 5 5 5-5'&&
          wallet.summaryWidth<=wallet.allowedWidth+2&&
          wallet.summaryRight<=wallet.overviewLeft+wallet.allowedWidth+3,
          'Home brand/account typography, target or golden ratio violation at '+width+
            'px: '+JSON.stringify({config,wallet}));
        console.log('[V3 gallery] '+config.lang+'/'+config.theme+' wallet-'+width+' '+JSON.stringify(wallet));
      }
      await gallery.locator('.home11-wallet-switch').click();
      assert(await gallery.locator('.home11-wallet-switch').getAttribute('aria-expanded')==='true'&&
        await gallery.locator('#home11-wallet-selector').isVisible(),
        'Wallet chevron did not open wallet selector: '+JSON.stringify(config));
      await gallery.keyboard.press('Escape');
      assert(await gallery.locator('.home11-wallet-switch').getAttribute('aria-expanded')==='false'&&
        await gallery.locator('#home11-wallet-selector').isHidden(),
        'Wallet selector did not close on Escape: '+JSON.stringify(config));
      // Home H02/H04/H06/H07/H10: real UI interactions, with no ledger actions.
      await gallery.locator('.home11-category-trigger').click();
      await gallery.locator('[data-home-category="claimable"]').click();
      assert(await gallery.locator('.home-feature-empty').isVisible()&&
        await gallery.locator('.phone-asset:not([hidden])').count()===0,
        'Claimable category failed: '+JSON.stringify(config));
      await gallery.locator('.home11-category-trigger').click();
      await gallery.locator('[data-home-category="assets"]').click();
      assert(await gallery.locator('.phone-asset:not([hidden])').count()===3,
        'Assets category not restored: '+JSON.stringify(config));
      await gallery.locator('.phone-asset-add').click();
      assert(await gallery.locator('[data-home-catalog-asset="USDC"]').isDisabled(),
        'Existing trustline should not be offered: '+JSON.stringify(config));
      await gallery.locator('[data-home-catalog-asset="DEMO"]').click();
      assert((await gallery.locator('[data-review-asset]').textContent()).trim()==='DEMO',
        'Asset review missing: '+JSON.stringify(config));
      await gallery.locator('.home-feature-close').click();
      await gallery.locator('.home11-network-trigger').click();
      await gallery.locator('[data-home-network="testnet"]').click();
      assert(await gallery.locator('.home-feature-state').isVisible()&&
        await gallery.locator('.phone-asset:not([hidden])').count()===0,
        'Testnet incorrectly reused Mainnet balances: '+JSON.stringify(config));
      await gallery.locator('[data-home-network="mainnet"]').click();
      await gallery.locator('[data-home-state="offline"]').click();
      await gallery.locator('.home-feature-close').click();
      assert(await gallery.locator('.home-feature-state').isVisible()&&
        await gallery.locator('.phone-asset:not([hidden])').count()===0,
        'Offline balances still visible: '+JSON.stringify(config));
      await gallery.locator('[data-home-retry]').click();
      await gallery.locator('.phone-asset:not([hidden])').first().waitFor({state:'visible'});
      await gallery.locator('.home11-wallet-switch').click();
      await gallery.locator('.home11-wallet-add-entry').click();
      await gallery.locator('[data-home-account="import"]').click();
      assert(await gallery.locator('.home-feature-sheet').isVisible()&&
        (await gallery.locator('.home-feature-body').textContent()).includes(
          config.lang==='zh'?'私钥':'secret'),
        'Account import preview missing: '+JSON.stringify(config));
      await gallery.locator('.home-feature-close').click();
      await gallery.locator('.home11-wallet-switch').click();
      await gallery.locator('[data-home-switch-error]').check();
      await gallery.locator('[data-wallet-index="1"]').click();
      assert(await gallery.locator('.home11-wallet-error').isVisible()&&
        (await gallery.locator('.home11-wallet-name').textContent()).trim()==='SuperWallet',
        'Failed wallet switch changed selection: '+JSON.stringify(config));
      await gallery.locator('[data-home-switch-retry]').click();
      assert((await gallery.locator('.home11-wallet-name').textContent()).trim()==='Wallet 2',
        'Wallet switch retry did not succeed: '+JSON.stringify(config));
      await gallery.locator('.home11-wallet-switch').click();
      await gallery.locator('[data-wallet-index="0"]').click();
      const homeImage=path.join(dest,'gallery-home-'+config.theme+'-'+config.lang+'.png');
      await gallery.locator('.home11-phone').screenshot({path:homeImage,animations:'disabled'});
      captures.push(path.relative(dest,homeImage));

      // A01/A02/A03/A06: Activity search, compound filters, row states and local dates.
      await gallery.goto(new URL('mobile-activity.html',base).href,{waitUntil:'load',timeout:45000});
      const visibleActivity=()=>gallery.locator('.home11-scroll [data-activity-kind]:visible').count();
      assert(await visibleActivity()===4,'Activity default should retain four sample rows');
      assert(await gallery.locator('[data-activity-day="0"] span').textContent()===
        (config.lang==='zh'?'今天':'Today'),'Activity relative day label not localized');
      const expectedToday=await gallery.evaluate(()=>new Intl.DateTimeFormat(
        document.documentElement.lang.startsWith('zh')?'zh-CN':'en-US',
        {month:'short',day:'numeric'}).format(new Date()));
      assert(await gallery.locator('[data-activity-day="0"] [data-activity-date]').textContent()===expectedToday,
        'Activity date does not follow viewer local day');
      assert(await gallery.locator('.gallery-activity-row-meta').count()===6,
        'Activity records lack timestamp/status metadata');
      const activityImage=path.join(dest,'gallery-activity-'+config.theme+'-'+config.lang+'.png');
      await gallery.locator('.home11-phone').screenshot({path:activityImage,animations:'disabled'});
      captures.push(path.relative(dest,activityImage));
      assert(await gallery.locator('.gallery-activity-search-input').isVisible()&&
        await gallery.locator('.gallery-activity-search-trigger').count()===0&&
        await gallery.evaluate(()=>{
          const search=document.querySelector('.gallery-activity-search');
          return search&&!search.hidden&&search.nextElementSibling?.classList.contains('home11-scroll');
        }),
        'Activity search must stay visible above the scrolling list');
      await gallery.locator('.gallery-activity-search-input').fill('USDC');
      assert(await visibleActivity()===2,'Activity search should match loaded USDC operations');
      await gallery.locator('.gallery-activity-search-input').fill('no-such-demo-operation');
      assert(await visibleActivity()===0&&await gallery.locator('.gallery-activity-no-match').isVisible(),
        'Activity no-match search behavior failed');
      await gallery.locator('.gallery-activity-search-clear').click();
      assert(await visibleActivity()===4,'Clearing Activity search should restore four rows');
      await gallery.locator('.gallery-activity-filter-trigger').click();
      assert(await gallery.locator('[data-activity-tab]').count()===0&&
        await gallery.locator('[data-activity-filter]').count()===0&&
        await gallery.locator('.gallery-activity-filter-advanced').isVisible(),
        'Activity filter should display advanced controls without a Basic/Advanced switch');
      await gallery.locator('[data-activity-choice-group="direction"] [data-activity-choice="outgoing"]').click();
      await gallery.locator('.gallery-activity-apply').click();
      assert(await visibleActivity()===1,'Activity outgoing direction filter failed');
      await gallery.locator('.gallery-activity-filter-trigger').click();
      await gallery.locator('[data-activity-choice-group="direction"] [data-activity-choice="all"]').click();
      await gallery.locator('[data-activity-choice-group="family"] [data-activity-choice="payment"]').click();
      await gallery.locator('[data-activity-choice-group="asset"] [data-activity-choice="XLM"]').click();
      await gallery.locator('[data-activity-amount-mode]').selectOption('greater');
      await gallery.locator('[data-activity-amount-value]').fill('100');
      await gallery.locator('.gallery-activity-apply').click();
      assert(await visibleActivity()===1,'Activity advanced combined filters failed');
      await gallery.locator('.gallery-activity-filter-trigger').click();
      await gallery.locator('[data-activity-amount-mode]').selectOption('any');
      await gallery.locator('[data-activity-switch="showFailed"]').check();
      await gallery.locator('.gallery-activity-apply').click();
      assert(await visibleActivity()===3&&
        await gallery.locator('[data-activity-status="failed"]').isVisible(),
        'Activity failed-record option failed');
      await gallery.locator('.gallery-activity-filter-trigger').click();
      await gallery.locator('.gallery-activity-reset').click();
      await gallery.locator('[data-activity-switch="showMarked"]').check();
      await gallery.locator('[data-activity-switch="hideDust"]').check();
      await gallery.locator('.gallery-activity-apply').click();
      assert(await visibleActivity()===4,'Activity dust and marked interaction failed');
      await gallery.locator('.gallery-activity-filter-trigger').click();
      await gallery.locator('.gallery-activity-reset').click();
      await gallery.locator('.gallery-activity-apply').click();
      assert(await visibleActivity()===4,'Activity filter reset failed');

      // XLM retains just Reserve as its expandable information card.
      await gallery.goto(new URL('mobile-asset-details.html?asset=xlm',base).href,
        {waitUntil:'load',timeout:45000});
      const nativeAsset=await gallery.evaluate(()=>({
        symbol:document.querySelector('[data-asset-label]')?.textContent.trim(),
        reserveHidden:document.querySelector('[data-asset-reserve-section]')?.hidden,
        issuedInformationAbsent:!document.querySelector('[data-asset-issued-section]'),
        reserve:document.querySelector('[data-asset-reserve]')?.textContent.trim(),
        buttonHeight:document.querySelector('[data-asset-reserve-toggle]')?.getBoundingClientRect().height,
        activeRoute:document.querySelector('.preview-nav a.is-current')?.getAttribute('href')
      }));
      assert(nativeAsset.symbol==='XLM'&&!nativeAsset.reserveHidden&&
        nativeAsset.issuedInformationAbsent&&nativeAsset.reserve==='12 XLM'&&
        nativeAsset.buttonHeight>=44&&nativeAsset.activeRoute?.includes('asset=xlm'),
        'XLM asset-only Reserve contract failed: '+JSON.stringify({config,nativeAsset}));
      const reserveToggle=gallery.locator('[data-asset-reserve-toggle]');
      await reserveToggle.click();
      const reserveExpanded=await gallery.evaluate(()=>({
        expanded:document.querySelector('[data-asset-reserve-toggle]').getAttribute('aria-expanded'),
        detailsVisible:!document.querySelector('[data-asset-reserve-details]').hidden,
        pairs:[...document.querySelectorAll('[data-asset-reserve-details] .secondary-pair')]
          .map(el=>el.textContent.trim()),
        note:document.querySelector('.secondary-reserve-note')?.textContent.trim()
      }));
      assert(reserveExpanded.expanded==='true'&&reserveExpanded.detailsVisible&&
        reserveExpanded.pairs.length===2&&reserveExpanded.pairs.some(x=>x.includes('1 XLM'))&&
        reserveExpanded.pairs.some(x=>x.includes('11 XLM')),
        'XLM Reserve breakdown disclosure failed: '+JSON.stringify({config,reserveExpanded}));
      const xlmImage=path.join(dest,'gallery-asset-xlm-'+config.theme+'-'+config.lang+'.png');
      await gallery.locator('.home11-phone').screenshot({path:xlmImage,animations:'disabled'});
      captures.push(path.relative(dest,xlmImage));
      await reserveToggle.click();
      assert(await reserveToggle.getAttribute('aria-expanded')==='false'&&
        await gallery.locator('[data-asset-reserve-details]').isHidden(),
        'XLM Reserve disclosure failed to collapse');

      // USDC is a separate issued-asset route with issuer subtitle and own activity.
      await gallery.goto(new URL('mobile-asset-details.html?asset=usdc',base).href,
        {waitUntil:'load',timeout:45000});
      const issuedAsset=await gallery.evaluate(()=>({
        symbol:document.querySelector('[data-asset-label]')?.textContent.trim(),
        balance:document.querySelector('[data-asset-balance]')?.textContent.trim(),
        reserveHidden:document.querySelector('[data-asset-reserve-section]')?.hidden,
        issuedInformationAbsent:!document.querySelector('[data-asset-issued-section]'),
        issuerSubtitle:document.querySelector('[data-asset-note]')?.textContent.trim(),
        oldInfoLabelPresent:document.querySelector('.secondary-scroll')?.textContent.includes('Asset information'),
        activity:[...document.querySelectorAll('[data-asset-activity-list] a')].map(x=>({
          label:x.textContent.trim(),href:x.getAttribute('href')
        })),
        symbolIcon:!!document.querySelector('[data-asset-mark].is-usdc svg'),
        activeRoute:document.querySelector('.preview-nav a.is-current')?.getAttribute('href')
      }));
      assert(issuedAsset.symbol==='USDC'&&issuedAsset.balance==='250.00'&&
        issuedAsset.reserveHidden&&issuedAsset.issuedInformationAbsent&&
        issuedAsset.issuerSubtitle==='GCPQ...R7KM'&&!issuedAsset.oldInfoLabelPresent&&
        issuedAsset.symbolIcon&&
        issuedAsset.activity.length===1&&
        issuedAsset.activity[0].href?.includes('received-usdc')&&
        issuedAsset.activeRoute?.includes('asset=usdc'),
        'USDC issued-asset detail contract failed: '+JSON.stringify({config,issuedAsset}));
      const usdcImage=path.join(dest,'gallery-asset-usdc-'+config.theme+'-'+config.lang+'.png');
      await gallery.locator('.home11-phone').screenshot({path:usdcImage,animations:'disabled'});
      captures.push(path.relative(dest,usdcImage));
      console.log('[V3 gallery] '+config.lang+'/'+config.theme+' asset variants '+
        JSON.stringify({nativeAsset,reserveExpanded,issuedAsset}));
    }catch(error){
      failures.push('gallery product visual '+config.lang+'/'+config.theme+': '+
        String(error.message||error).slice(0,900));
    }finally{await gallery.close();}
  }
}finally{
  await browser.close();
}
const result={status:failures.length?'FAIL':'PASS',date:new Date().toISOString(),url:base,checks:'theme, mobile platform icons and one-line labels, key targets, horizontal overflow, reduced motion, demo only buttons, menu keyboard, zh translation, screenshots',viewports:setups.map(s=>s.name),captureCount:captures.length,mobileDownloadObservations,reports,failures};
fs.writeFileSync(path.join(dest,'results.json'),JSON.stringify(result,null,2)+'\n');
console.log('[V3 browser] '+result.status+'; '+reports.length+' viewport/themes; '+captures.length+' screenshots; '+failures.length+' findings');
for(const failure of failures)console.error('[V3 browser] '+failure);
if(failures.length)process.exitCode=1;
