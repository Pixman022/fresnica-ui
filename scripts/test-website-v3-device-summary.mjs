#!/usr/bin/env node
// Synthetic fixtures verify grouping, stable-hold filtering and unsupported metrics.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const tool=path.join(import.meta.dirname,'summarize-website-v3-device-performance.mjs');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fresnica-v3-device-summary-'));
const flags={scrolled:false,resized:false,theme:false,language:false,motion:false};
const makeSample=(viewport,p95)=>({
  scene:'overview',sceneEnd:'overview',motion:'no-preference',
  theme:'light',language:'en',viewport,validHold:true,
  changedDuringSample:{...flags},elapsedMs:15015,
  rafScheduling:{p95IntervalMs:p95},
  longTasks:{count:1},heapUsedMB:{start:40,end:42}
});
const document=(viewport,samples)=>({
  schema:'fresnica-v3-device-probe-v1',
  environment:{userAgent:'synthetic-test',viewport,dpr:viewport.dpr},
  samples
});
try{
  const desktopView={width:1440,height:900,dpr:1};
  const phoneView={width:390,height:844,dpr:3};
  const interrupted=makeSample(desktopView,100);
  interrupted.validHold=true;
  interrupted.changedDuringSample.scrolled=true;
  const desktop=path.join(dir,'desktop.json');
  fs.writeFileSync(desktop,JSON.stringify(document(desktopView,[
    makeSample(desktopView,18),makeSample(desktopView,20),
    makeSample(desktopView,22),interrupted
  ])));
  const legacy=makeSample(phoneView,26);
  delete legacy.viewport;
  const mobile=makeSample(phoneView,24);
  mobile.longTasks=null;
  mobile.heapUsedMB={start:null,end:null};
  const phone=path.join(dir,'phone.json');
  fs.writeFileSync(phone,JSON.stringify(document(phoneView,[mobile,legacy])));
  const result=spawnSync(process.execPath,[tool,desktop,phone],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,/3 \/ 4/);
  assert.match(result.stdout,/20\.0/);
  assert.match(result.stdout,/够三轮，仍需人工签收/);
  assert.match(result.stdout,/1 \/ 2/);
  assert.match(result.stdout,/有效记录不足三轮/);
  assert.match(result.stdout,/缺少逐次视口\/DPR/);
  assert.match(result.stdout,/1440 × 900 \/ 1/);
  assert.match(result.stdout,/390 × 844 \/ 3/);
  assert.match(result.stdout,/rAF 调度间隔不是 GPU FPS/);
  const broken=path.join(dir,'broken.json');
  fs.writeFileSync(broken,JSON.stringify({schema:'wrong',samples:[]}));
  const negative=spawnSync(process.execPath,[tool,broken],{encoding:'utf8'});
  assert.notEqual(negative.status,0);
  assert.match(negative.stderr,/不是支持的 Fresnica V3 性能采样 JSON/);
  console.log('[V3 device summary] PASS; separate files, interrupted/legacy exclusion, medians and invalid schema');
}finally{
  fs.rmSync(dir,{recursive:true,force:true});
}
