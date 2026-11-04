#!/usr/bin/env node
// Standalone Fresnica V3 website audit. Does not change component-library CI.
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const preview=path.join(root,'public/fresnica-v3-motion-preview');
const html=fs.readFileSync(path.join(preview,'index.html'),'utf8');
const scripts=['m12-experience.js','m10-frame.js'];
const errors=[];
const check=(ok,message)=>{if(!ok)errors.push(message);};
const styleTagOpen=(html.match(/<style\b/g)||[]).length;
const styleTagClose=(html.match(/<\/style>/g)||[]).length;
const styleBlocks=[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)];
check(styleTagOpen===styleTagClose&&styleBlocks.length===styleTagOpen,'Unbalanced style tags');
check(styleBlocks.every(block=>!/<style\b/.test(block[1])),'Nested style tags; CSS may be ignored by browser');

const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const knownIds=new Set(ids);
check(ids.length===knownIds.size,'Duplicate HTML id detected');
const rawLinks=[html,...scripts.map(s=>fs.readFileSync(path.join(preview,s),'utf8'))];
const anchors=[...new Set(rawLinks.flatMap(s=>[...s.matchAll(/href="#([^"]+)"/g)].map(m=>m[1])))];
const broken=anchors.filter(anchor=>!knownIds.has(anchor));
check(broken.length===0,`Unresolved in-page anchors: ${broken.join(', ')}`);

const assets=[...html.matchAll(/(?:src|href)="\.\/([^"#?]+)"/g)].map(m=>m[1]);
const missing=[...new Set(assets)].filter(asset=>!fs.existsSync(path.join(preview,asset)));
check(missing.length===0,`Referenced local assets missing: ${missing.join(', ')}`);

const cards=(html.match(/<article class="feature-card">/g)||[]).length;
check(cards===5,`Expected five feature cards, got ${cards}`);
const foot=html.slice(html.indexOf('<footer class='),html.indexOf('</footer>')+9);
const footerAnchors=[...foot.matchAll(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(m=>m[1]);
check(footerAnchors.length===new Set(footerAnchors).size,'Duplicate footer navigation destinations');
check(!foot.includes('Made for everyday control.</p>'),'Repeated footer intro sentence');
check(html.includes('id="theme-toggle"'),'Theme switch missing');
check(html.includes('prefers-reduced-motion:reduce'),'Reduced-motion CSS missing');
for(const keyframe of ['m33-send-press','m37-success-draw','m44-hub-hide','m43-activity-shift','m45-trend-dot-visibility']){
  check(html.includes(keyframe),`Approved card animation missing: ${keyframe}`);
}
check(html.includes('m47-a11y-alignment'),'Accessibility styles missing');
check(html.includes('m48-product-ui-tokens'),'Fresnica semantic bridge missing');

const luminance=hex=>{
  const rgb=[0,2,4].map(i=>parseInt(hex.slice(i+1,i+3),16)/255);
  return rgb.reduce((sum,x,i)=>{
    const c=x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4;
    return sum+c*[.2126,.7152,.0722][i];
  },0);
};
const contrast=(a,b)=>{
  const x=luminance(a),y=luminance(b);
  return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
};
const actionFills=[...html.matchAll(/--v3-action-aa:\s*(#[0-9a-fA-F]{6})/g)].map(m=>m[1]);
check(actionFills.length===2,'Expected separate light/dark accessible action colors');
for(const fill of actionFills){
  check(contrast(fill,'#FFFFFF')>=4.5,`White button text below AA on ${fill}`);
}
const primaryColors=[...html.matchAll(/--Fresnica-primary-color:\s*(#[0-9a-fA-F]{6})/g)].map(m=>m[1].toLowerCase());
check(primaryColors.includes('#00a875')&&primaryColors.includes('#00ca8a'),'Canonical brand primary colors missing');
check(html.includes('--v3-gain-ink:#087852;')&&html.includes('--v3-gain-ink:#32DFA4;'),'Light/dark gain-text contrast pair missing');
const hrefs=new Set(footerAnchors);
check(hrefs.has('#v3-security')&&hrefs.has('#v3-clarity'),'Footer must include Security and Questions');
check(html.includes('aria-label="Preview send animation, no payment is made"'),'Send preview must not imply a real transaction');

const report={
  result:errors.length?'FAIL':'PASS',checks:'anchors, IDs, assets, brand colors, action contrast, card animations, footer, non-live action wording',
  ids:ids.length,anchors:anchors.length,localAssets:assets.length,cards,
  whiteButtonContrast:actionFills.map(fill=>({fill,ratio:Number(contrast(fill,'#FFFFFF').toFixed(2))})),
  errors
};
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;
