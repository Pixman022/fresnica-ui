#!/usr/bin/env node
// Local comparison of user-exported V3 device probe files. No network or FPS claims.
import fs from 'node:fs';
import path from 'node:path';

const files=process.argv.slice(2);
if(!files.length){
  console.error('用法：node scripts/summarize-website-v3-device-performance.mjs <记录1.json> [记录2.json ...]');
  process.exit(2);
}
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const median=values=>{
  const xs=values.filter(finite).sort((a,b)=>a-b);
  if(!xs.length)return null;
  const i=Math.floor(xs.length/2);
  return xs.length%2?xs[i]:(xs[i-1]+xs[i])/2;
};
const fmt=n=>n===null?'—':n.toFixed(1);
const safe=s=>String(s??'未知').replace(/[|\r\n]/g,' ').trim();
const chapters={
  overview:'01 首屏球体',
  'v3-ecosystem':'02 粒子与电流',
  'v3-for-you':'06 走马灯',
  'v3-security':'07 安全粒子'
};
console.log('# Fresnica V3 设备采样整理（供人工复核）');
console.log('');
console.log('每个文件独立统计，不跨文件合并设备；仅把同一章节、动态模式、主题、语言、逐次视口和 DPR 的有效完整记录用于中位数。');
console.log('**rAF 调度间隔不是 GPU FPS，JS 堆不是总内存；达到三轮也不代表真实设备性能验收通过。**');
let failed=false;
for(const file of files){
  try{
    const doc=JSON.parse(fs.readFileSync(file,'utf8'));
    if(doc.schema!=='fresnica-v3-device-probe-v1'||!Array.isArray(doc.samples)||!doc.environment)
      throw new Error('不是支持的 Fresnica V3 性能采样 JSON');
    const groups=new Map();
    for(const sample of doc.samples){
      if(!sample||typeof sample.scene!=='string'||typeof sample.motion!=='string')
        throw new Error('样本缺少章节或动态模式字段');
      const view=sample.viewport||doc.environment.viewport||{};
      const dpr=sample.viewport?.dpr??doc.environment.dpr;
      const key=JSON.stringify([sample.scene,sample.motion,sample.theme,sample.language,
        view.width??'未知',view.height??'未知',dpr??'未知']);
      if(!groups.has(key))groups.set(key,{sample,view,dpr,valid:[],total:0,excluded:[]});
      const group=groups.get(key);
      group.total++;
      const issues=[];
      if(sample.validHold!==true||sample.scene!==sample.sceneEnd)
        issues.push('驻留不稳定');
      const flags=sample.changedDuringSample;
      if(!flags||['scrolled','resized','theme','language','motion'].some(k=>flags[k]!==false))
        issues.push('期间发生更改或缺少变更记录');
      if(!sample.viewport||!finite(view.width)||!finite(view.height)||!finite(dpr))
        issues.push('缺少逐次视口/DPR');
      if(!finite(sample.elapsedMs)||sample.elapsedMs<14000)
        issues.push('采样时间不足14秒');
      if(!finite(sample.rafScheduling?.p95IntervalMs))
        issues.push('缺少rAF间隔');
      if(issues.length)group.excluded.push(issues.join('、'));
      else group.valid.push(sample);
    }
    console.log('');
    console.log('## '+safe(path.basename(file)));
    console.log('');
    console.log('| 章节 | 模式 / 主题 / 语言 | 视口 / DPR | 有效 / 总数 | rAF p95中位数(ms) | 长任务次数中位数 | JS堆变化中位数(MB) | 采样状态 |');
    console.log('| --- | --- | --- | ---: | ---: | ---: | ---: | --- |');
    for(const group of groups.values()){
      const s=group.sample,v=group.valid;
      const name=chapters[s.scene]||s.scene;
      const timings=v.map(x=>x.rafScheduling.p95IntervalMs);
      const tasks=v.map(x=>x.longTasks?.count);
      const heap=v.map(x=>{
        const h=x.heapUsedMB;
        return finite(h?.start)&&finite(h?.end)?h.end-h.start:null;
      });
      const dimensions=String(group.view.width??'?')+' × '+String(group.view.height??'?')+
        ' / '+String(group.dpr??'?');
      const status=v.length>=3?'够三轮，仍需人工签收':'有效记录不足三轮';
      console.log('| '+[name,[s.motion,s.theme,s.language].join(' / '),dimensions,
        v.length+' / '+group.total,fmt(median(timings)),fmt(median(tasks)),
        fmt(median(heap)),status].map(safe).join(' | ')+' |');
      if(group.excluded.length){
        console.log('');
        console.log('  - 本组排除 '+group.excluded.length+' 条记录：'+
          safe(group.excluded.join('；')));
      }
    }
    if(!groups.size)console.log('| 无数据 | — | — | 0 / 0 | — | — | — | 待采样 |');
  }catch(error){
    failed=true;
    console.error('无法整理 '+file+'：'+error.message);
  }
}
if(failed)process.exitCode=1;
