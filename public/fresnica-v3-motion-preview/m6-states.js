/* Fresnica V3 M6: illustrative product states and scroll-scrubbed network detail.
 * Standalone progressive enhancement; no changes to the approved Hero or M5 source. */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 680px)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = (a, b, value) => {
    const t = clamp((value - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const byId = id => document.getElementById(id);
  const assets = byId('v3-assets');
  const workspace = byId('v3-workspace');
  const paths = byId('v3-paths');
  if (!assets || !workspace || !paths) return;

  const stylesheet = document.createElement('style');
  stylesheet.id = 'v3-m6-ui-styles';
  stylesheet.textContent = `
    .m6-panel-set,.m6-network-caption,.m6-path-status{display:none}
    @media(min-width:681px) and (prefers-reduced-motion:no-preference){
      html.m6-motion #v3-assets .asset-board.m6-enhanced>.asset-columns{display:none}
      html.m6-motion #v3-assets .m6-panel-set{display:block}
      html.m6-motion .m6-network-caption,html.m6-motion .m6-path-status{display:block}
      .m6-panel-set{margin-top:11px}
      .m6-stage-track{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:13px}
      .m6-stage-track span{border:1px solid #e4ece7;border-radius:9px;padding:8px 9px;font:10px Consolas,monospace;color:#7a8780;transition:background .15s,border-color .15s,color .15s}
      .m6-stage-track span.m6-active{color:#12583c;border-color:#9cd7b7;background:#e9f7ef}
      .m6-stage-viewport{position:relative;height:237px;overflow:hidden;border:1px solid #e8eee9;border-radius:14px;background:linear-gradient(155deg,#f9fbf9,#eff6f0)}
      .m6-stage{position:absolute;inset:0;padding:18px 19px;opacity:0;visibility:hidden;pointer-events:none;display:flex;flex-direction:column;justify-content:space-between;will-change:opacity,transform}
      .m6-eyebrow{font:9px Consolas,monospace;letter-spacing:.13em;color:#74877b}
      .m6-stage h3{margin:3px 0 6px;font-weight:500;font-size:23px;letter-spacing:-.045em;color:#18251e}
      .m6-stage p{font-size:11px;color:#76877b;margin:0;line-height:1.4}
      .m6-amount{font-size:32px;font-weight:440;letter-spacing:-.045em;color:#18251e}
      .m6-amount small{font-size:13px;color:#596d61}
      .m6-asset-lines{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .m6-asset-lines>span,.m6-fields>span,.m6-trade-row{border:1px solid #e6ece7;background:#fff;border-radius:9px;padding:10px 11px;font-size:11px;color:#3c4a42;display:flex;justify-content:space-between;gap:8px;align-items:center}
      .m6-asset-lines b,.m6-fields b,.m6-trade-row b{font-weight:550;color:#154e39}
      .m6-fields{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .m6-fields>span:first-child{grid-column:1/-1}
      .m6-trade-row{margin-top:6px}
      .m6-status{font:10px Consolas,monospace;color:#148663;letter-spacing:.05em;display:flex;justify-content:space-between;gap:9px;align-items:center}
      .m6-status::before{content:'';width:6px;height:6px;background:#1aaa75;border-radius:50%;flex:none}
      .m6-status span{flex:1}
      .m6-status em{font-style:normal;color:#829389}
      .m6-network-layer{pointer-events:none;overflow:visible}
      .m6-network-layer .m6-net-link{fill:none;stroke:#0ea17b;stroke-width:1.65;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1}
      .m6-network-layer .m6-net-node{fill:#0ea17b;stroke:#fff;stroke-width:1.4}
      .m6-network-layer .m6-net-soft{fill:#9ccbb2;opacity:.66}
      .m6-network-layer .m6-net-text{font:9px Consolas,monospace;letter-spacing:.09em;fill:#21694f}
      html.m6-motion #v3-workspace .workspace-mini.m6-enhanced .ws-sidebar span:first-of-type{background:transparent;color:#797f7c}
      html.m6-motion #v3-workspace .workspace-mini.m6-enhanced .ws-sidebar span.m6-current{background:#e7f5ed;color:#165b42;box-shadow:inset 3px 0 #16a477}
      .m6-network-caption{position:absolute;bottom:10px;right:12px;max-width:80%;padding:7px 10px;border:1px solid #dce8df;background:rgba(255,255,255,.91);border-radius:9px;color:#235c46;font:10px Consolas,monospace;backdrop-filter:blur(5px)}
      .m6-path-status{margin-top:13px;padding:10px 12px;background:#f3f9f4;border:1px solid #dceee2;border-radius:10px;font:10px Consolas,monospace;color:#276b4f}
      html.m6-motion #v3-paths .path-steps span.m6-step-current{background:#e1f5e8;color:#07593a;box-shadow:inset 0 0 0 1px #9cd7b7}
      html.m6-motion #v3-paths .path-steps span.m6-step-done{color:#507a62;background:#eef6f0}
    }
    @media(prefers-reduced-motion:reduce),(max-width:680px){.m6-network-layer{display:none}}
  `;
  document.head.append(stylesheet);

  const assetBoard = assets.querySelector('.asset-board');
  const originalAssets = assetBoard?.querySelector('.asset-columns');
  const sidebar = [...workspace.querySelectorAll('.ws-sidebar span')];
  const network = workspace.querySelector('.network');
  const svg = network?.querySelector('svg');
  const pathCards = [...paths.querySelectorAll('.path-card')];
  if (!assetBoard || !originalAssets || !svg || pathCards.length < 2) return;

  const walkthrough = document.createElement('div');
  walkthrough.className = 'm6-panel-set';
  walkthrough.innerHTML = `
    <div class="m6-stage-track" aria-hidden="true"><span>01 / ASSETS</span><span>02 / PAYMENT</span><span>03 / SWAP</span></div>
    <div class="m6-stage-viewport">
      <section class="m6-stage" aria-label="Illustrative asset overview"><div><div class="m6-eyebrow">ASSETS · OVERVIEW / DEMO</div><h3>Everything in view.</h3><p>Understand supported Stellar assets in one place.</p></div><div class="m6-amount">1,248.50 <small>XLM · sample balance</small></div><div class="m6-asset-lines"><span>XLM <b>Native asset</b></span><span>Issued assets <b>Explore</b></span></div><div class="m6-status"><span>ILLUSTRATIVE · NOT LIVE DATA</span><em>01 / 03</em></div></section>
      <section class="m6-stage" aria-label="Illustrative payment review"><div><div class="m6-eyebrow">SEND / RECEIVE · DEMO</div><h3>Review every detail.</h3><p>Payment details shown before any action.</p></div><div class="m6-fields"><span>Destination <b>GABX…7BD</b></span><span>Asset <b>XLM</b></span><span>Amount <b>25.00</b></span></div><div class="m6-status"><span>MEMO: OPTIONAL · PREVIEW ONLY</span><em>02 / 03</em></div></section>
      <section class="m6-stage" aria-label="Illustrative swap preview"><div><div class="m6-eyebrow">SWAP · DISCOVERY / DEMO</div><h3>Explore a possible route.</h3><p>Preview supported assets before taking action.</p></div><div><div class="m6-trade-row">From <b>XLM</b></div><div class="m6-trade-row">To <b>Stellar-issued asset</b></div></div><div class="m6-status"><span>PAIR / RATE NOT LIVE · PREVIEW ONLY</span><em>03 / 03</em></div></section>
    </div>`;
  assetBoard.append(walkthrough);
  const assetStages = [...walkthrough.querySelectorAll('.m6-stage')];
  const assetLabels = [...walkthrough.querySelectorAll('.m6-stage-track span')];
  const assetNavigation = [...assets.querySelectorAll('.bottom-stepper span')];

  const ns = 'http://www.w3.org/2000/svg';
  const networkLayer = document.createElementNS(ns, 'g');
  networkLayer.classList.add('m6-network-layer');
  networkLayer.setAttribute('aria-hidden','true');
  const networks = [
    { title:'ASSETS IN VIEW', nodes:[[65,100],[120,74],[154,140],[211,94],[228,165]], links:['M65 100 Q90 74 120 74','M120 74 Q155 103 154 140','M154 140 Q179 118 211 94','M211 94 Q225 125 228 165'], label:[51,52,'ASSETS'] },
    { title:'PAYMENT DETAIL PATH', nodes:[[179,108],[226,57],[283,93],[321,144],[362,97]], links:['M179 108 Q190 66 226 57','M226 57 Q251 67 283 93','M283 93 Q301 118 321 144','M321 144 Q338 118 362 97'], label:[204,37,'PAYMENTS'] },
    { title:'COMPATIBLE APPS', nodes:[[281,112],[339,62],[392,82],[415,143],[462,100]], links:['M281 112 Q312 75 339 62','M339 62 Q370 59 392 82','M392 82 Q411 103 415 143','M415 143 Q443 124 462 100'], label:[356,35,'APPS'] }
  ];
  const networkGroups = networks.map(def => {
    const group = document.createElementNS(ns,'g');
    group.setAttribute('opacity','0');
    const lines = def.links.map(pathData => {
      const p = document.createElementNS(ns,'path');
      p.classList.add('m6-net-link');
      p.setAttribute('d',pathData);
      p.setAttribute('pathLength','1');
      group.append(p);
      return p;
    });
    def.nodes.forEach(([x,y],i) => {
      const c=document.createElementNS(ns,'circle');
      c.classList.add(i%3===0?'m6-net-soft':'m6-net-node');
      c.setAttribute('cx',String(x));c.setAttribute('cy',String(y));
      c.setAttribute('r',i%3===0?'2':'3.6');
      group.append(c);
    });
    const title = document.createElementNS(ns,'text');
    title.classList.add('m6-net-text');
    title.setAttribute('x',String(def.label[0]));
    title.setAttribute('y',String(def.label[1]));
    title.textContent=def.label[2];
    group.append(title);
    networkLayer.append(group);
    return {group,lines};
  });
  svg.append(networkLayer);
  const caption = document.createElement('span');
  caption.className='m6-network-caption';
  caption.setAttribute('aria-hidden','true');
  network.append(caption);

  const statuses = [
    ['Destination · sample address', 'Select asset · XLM', 'Check amount · 25.00 XLM', 'Review before signing · demo'],
    ['Select supported asset', 'Explore a possible pair', 'Preview details · not live', 'Review the route · demo']
  ];
  const pathStatus = pathCards.map(card => {
    const node = document.createElement('div');
    node.className='m6-path-status';
    node.setAttribute('aria-hidden','true');
    card.append(node);
    return node;
  });
  const pathChips = pathCards.map(card=>[...card.querySelectorAll('.path-steps span')]);

  function progressFor(id) {
    const section=byId(id);
    const runway=section?.closest('.m5-runway');
    if (!runway) return 0;
    const top=runway.getBoundingClientRect().top;
    return clamp(-top/Math.max(1,runway.offsetHeight-window.innerHeight));
  }
  // Each chapter is reversible: one scroll position always produces the same frame.
  function weights(progress) {
    const first=1-smooth(.42,.53,progress);
    const third=smooth(.64,.76,progress);
    const second=smooth(.41,.54,progress)*(1-smooth(.64,.77,progress));
    return [first,second,third];
  }
  let enabled=false;
  let pending=false;
  function paint() {
    pending=false;
    if(!enabled) return;
    const assetProgress=progressFor('v3-assets');
    const assetWeights=weights(assetProgress);
    const index=assetProgress<.49?0:assetProgress<.71?1:2;
    assetStages.forEach((stage,i)=>{
      const weight=assetWeights[i];
      stage.style.opacity=weight.toFixed(3);
      stage.style.transform=`translate3d(${((i-index)*12*(1-weight)).toFixed(1)}px,${((1-weight)*10).toFixed(1)}px,0)`;
      stage.style.visibility=weight>.02?'visible':'hidden';
      stage.setAttribute('aria-hidden',String(i!==index));
    });
    assetLabels.forEach((label,i)=>label.classList.toggle('m6-active',i===index));
    // Keep the pre-existing bottom navigation synchronized with the displayed preview.
    assetNavigation.forEach((label,i)=>label.classList.toggle('m5-focus',i===index));
    assetBoard.dataset.m6Step=String(index+1);

    const wp=progressFor('v3-workspace');
    const stageIndex=wp<.46?0:wp<.68?1:2;
    const netWeights=weights(wp);
    networkGroups.forEach(({group,lines},i)=>{
      const alpha=netWeights[i];
      group.setAttribute('opacity',alpha.toFixed(3));
      const draw=smooth(i===0?.21:i===1?.45:.67,i===0?.43:i===1?.67:.86,wp);
      lines.forEach((path,j)=>path.style.strokeDashoffset=(1-clamp(draw*lines.length-j*.14)).toFixed(3));
    });
    caption.textContent=`0${stageIndex+1} / ${networks[stageIndex].title} · ILLUSTRATIVE`;
    sidebar.forEach((item,i)=>item.classList.toggle('m6-current',i===([1,2,4][stageIndex])));
    workspace.dataset.m6NetworkStep=String(stageIndex+1);

    const pp=progressFor('v3-paths');
    const step=Math.min(3,Math.max(0,Math.floor(clamp((pp-.19)/.69)*4)));
    pathChips.forEach((chips,k)=>chips.forEach((chip,j)=>{
      chip.classList.toggle('m6-step-current',j===step);
      chip.classList.toggle('m6-step-done',j<step);
    }));
    pathStatus.forEach((node,i)=>node.textContent=`0${step+1} / 04 · ${statuses[i][step]} · illustrative`);
    paths.dataset.m6Step=String(step+1);
  }
  function requestPaint(){if(enabled&&!pending){pending=true;requestAnimationFrame(paint);}}
  function mode() {
    enabled=!reduced.matches&&!compact.matches&&document.documentElement.classList.contains('m5-motion');
    document.documentElement.classList.toggle('m6-motion',enabled);
    assetBoard.classList.toggle('m6-enhanced',enabled);
    workspace.querySelector('.workspace-mini')?.classList.toggle('m6-enhanced',enabled);
    originalAssets.setAttribute('aria-hidden',String(enabled));
    walkthrough.setAttribute('aria-hidden',String(!enabled));
    if(!enabled){
      sidebar.forEach(item=>item.classList.remove('m6-current'));
      pathChips.flat().forEach(chip=>chip.classList.remove('m6-step-current','m6-step-done'));
      assetBoard.removeAttribute('data-m6-step');
      workspace.removeAttribute('data-m6-network-step');
      paths.removeAttribute('data-m6-step');
    } else requestPaint();
  }
  mode();
  window.addEventListener('scroll',requestPaint,{passive:true});
  window.addEventListener('resize',()=>{mode();requestPaint();},{passive:true});
  reduced.addEventListener('change',mode);
  compact.addEventListener('change',mode);
})();
