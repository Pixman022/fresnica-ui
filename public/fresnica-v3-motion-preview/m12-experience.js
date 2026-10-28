/* Fresnica V3 M12: wheel threshold snapping, bilingual copy, and centered feature reel.
 * Progressive enhancement: no changes to the approved Hero shader or M5-M10 internals. */
(() => {
  'use strict';
  const scroller = document.getElementById('v3-page-scroll');
  const frame = document.getElementById('v3-page-frame');
  const header = document.querySelector('.site-header');
  if (!scroller || !frame || !header) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 680px)');
  const clamp = (n,lo,hi) => Math.max(lo, Math.min(hi,n));
  const raf = window.requestAnimationFrame.bind(window);
  const map = {"· Stellar wallet":"· Stellar 钱包","NOW":"当前","Overview":"概览","IN DEVELOPMENT":"开发中","FRESNICA · BUILT FOR STELLAR":"FRESNICA · 专为 Stellar 打造","One wallet.":"一个钱包。","Your whole":"连接你的","Stellar world.":"Stellar 世界。","Explore XLM and Stellar-issued assets, send and receive, discover swaps, and connect with compatible apps — all through one thoughtfully designed wallet.":"探索 XLM 与 Stellar 发行资产，收发转账、体验兑换并连接兼容应用——所有体验汇聚于一款精心设计的钱包。","EXPLORE FRESNICA":"探索 FRESNICA","Replay the motion":"重播动画","STELLAR":"恒星网络","One connected ecosystem.":"连接整个生态。","WALLET":"钱包","Assets, in one place.":"资产，一目了然。","YOUR NEXT MOVE":"下一步行动","Explore with clarity.":"清晰探索。","XLM & STELLAR ASSETS":"XLM 与 STELLAR 资产","SEND & RECEIVE":"转账与收款","SWAPS":"资产兑换","COMPATIBLE APPS":"兼容应用","FRESNICA / THE STELLAR ECOSYSTEM":"FRESNICA / STELLAR 生态","Your Stellar world.":"你的 Stellar 世界。","ASSETS / APPS / EXCHANGE / PEOPLE":"资产 / 应用 / 兑换 / 用户","ONE CONNECTED EXPERIENCE":"连贯的完整体验","Your next move.":"开启下一步。","EXPLORE. UNDERSTAND. MOVE.":"探索 · 理解 · 行动","STELLAR · WALLET PREVIEW":"STELLAR · 钱包预览","FRAGMENTED VIEW":"分散的体验","WITH FRESNICA":"使用 FRESNICA","See what you hold.":"看清持有的资产。","Know where you're going.":"明确前进的方向。","Make the next move":"从容迈出下一步","with clarity.":"清晰而自信。","THE USUAL WAY":"传统方式","One asset. Too many places.":"查看一种资产，却要切换多个界面。","Switch between disconnected views and scattered information.":"在分散的页面与信息之间来回切换。","One wallet. A connected flow.":"一个钱包，连贯体验。","Discover assets, payments, swaps and compatible apps in one experience.":"在同一个体验中探索资产、收发、兑换与兼容应用。","CORE CAPABILITIES":"核心能力","Four essentials, one flow.":"四项核心能力，一体化体验。","WALLET OVERVIEW · ILLUSTRATIVE":"钱包概览 · 示意","TOTAL BALANCE":"总余额","Stellar native":"Stellar 原生资产","Stellar asset":"Stellar 资产","Issued asset":"发行资产","Manage assets":"管理资产","See XLM and supported Stellar-issued assets in one place.":"集中查看 XLM 和支持的 Stellar 发行资产。","PAYMENT PREVIEW · ILLUSTRATIVE":"收发预览 · 示意","Destination":"收款地址","Asset":"资产","Amount":"金额","Memo":"备注","Optional":"可选","Send & receive":"转账与收款","Keep important payment details visible from start to finish.":"从始至终清楚呈现重要的交易信息。","SWAP FLOW · ILLUSTRATIVE":"兑换流程 · 示意","From":"兑换来源","To":"兑换目标","Review":"核对","Before confirming":"确认前核对","Discover swaps":"探索兑换","Explore supported exchanges within the Stellar ecosystem.":"探索 Stellar 生态中支持的资产兑换。","ECOSYSTEM · ILLUSTRATIVE":"生态应用 · 示意","Discover apps":"探索应用","Connections":"连接","Permissions":"权限","Connect apps":"连接应用","Explore apps compatible with Stellar and supported by Fresnica.":"探索 Fresnica 支持的 Stellar 兼容应用。","ACTIVITY · ILLUSTRATIVE":"活动记录 · 示意","Your activity.":"你的活动记录。","Received XLM":"收到 XLM","Sent XLM":"发送 XLM","Trustline":"信任线","Updated":"已更新","Keep the details":"掌握每个细节","Review your activity and return to the information that matters.":"查看活动记录，随时回到重要信息。","SEE / UNDERSTAND / MOVE":"查看 / 理解 / 行动","See what's yours.":"看清你的资产。","Before your":"在开启","next move.":"下一步之前。","A clear overview with the details you need before deciding what comes next.":"以清晰概览掌握重要信息，再决定下一步行动。","YOUR WALLET / ASSETS":"你的钱包 / 资产","ILLUSTRATIVE INTERFACE · NOT LIVE DATA":"演示界面 · 非实时数据","YOUR ASSETS":"你的资产","Stellar":"Stellar","USDC":"USDC","AQUA":"AQUA","01 / ASSETS":"01 / 资产","02 / PAYMENTS":"02 / 收发","03 / SWAP":"03 / 兑换","04 / CONNECT":"04 / 连接","BUILT FOR DIFFERENT PATHS":"适合不同的探索旅程","Built for the way":"贴合你的","Stellar moves.":"Stellar 之旅。","01 / FIRST STEPS":"01 / 初次体验","New to XLM.":"初识 XLM。","A clearer start, without unnecessary complexity.":"更清晰地开启体验，减少不必要的复杂。","DISCOVER / STELLAR":"探索 / STELLAR","02 / EVERYDAY":"02 / 日常使用","Simple to use.":"简单易用。","Useful to keep.":"常用常新。","Your assets, together in one view.":"所有资产集中在一个界面。","WALLET / ASSETS":"钱包 / 资产","03 / SEND & RECEIVE":"03 / 收发","Everyday":"日常","transfers.":"转账。","Keep payment details in focus.":"始终清楚掌握支付细节。","MOVE / STELLAR":"收发 / STELLAR","04 / ASSET EXPLORERS":"04 / 资产探索者","Asset explorers.":"资产探索者。","Discover issued assets and more.":"了解 Stellar 发行资产及更多可能。","EXPLORE / EXCHANGE":"探索 / 兑换","05 / APPS":"05 / 应用","App explorers.":"生态探索者。","Connect with compatible apps.":"连接兼容应用。","APPS / ECOSYSTEM":"应用 / 生态","06 / YOUR NEXT MOVE":"06 / 下一步","Made to grow.":"为未来而设计。","One place for the experiences ahead.":"在一个地方承载未来的更多体验。","STELLAR / WALLET":"STELLAR / 钱包","THE VIEW / BEHIND EVERY DECISION":"清晰视图 / 每一步背后","The view":"每一个","behind every":"决定背后的","decision.":"清晰视图。","A thoughtful interface for understanding Stellar assets and the connections around them.":"通过精心设计的界面，理解 Stellar 资产与生态连接。","Assets":"资产","Swap":"兑换","Connect":"连接","Activity":"活动","STELLAR ECOSYSTEM / INTERACTION MAP":"STELLAR 生态 / 交互示意","Your Stellar, connected.":"连接你的 Stellar 世界。","01 / NETWORK":"01 / 网络","02 / CORE":"02 / 核心","03 / DISCOVER":"03 / 探索","Apps":"应用","ONE WALLET / SEVERAL PATHS":"一个钱包 / 多种体验","One wallet, several paths.":"一个钱包，多种可能。","Whether you're sending XLM, exploring issued assets or connecting to apps, keep each step clear.":"无论收发 XLM、探索发行资产还是连接应用，让每一步都清晰明确。","PATH 01 / SEND":"路径 01 / 发送","Send on Stellar.":"通过 Stellar 转账。","See the destination, asset, amount and memo before confirmation.":"确认前核对地址、资产、金额与备注。","DESTINATION":"收款地址","ASSET":"资产","AMOUNT":"金额","REVIEW":"核对","PATH 02 / EXCHANGE":"路径 02 / 兑换","Explore an exchange.":"探索资产兑换。","View supported asset pairs and understand the proposed route.":"查看支持的资产交易对和预期兑换路径。","PAIR":"交易对","PREVIEW":"预览","DESIGNED WITH CARE":"用心设计","Clarity is part of":"清晰贯穿于","every interaction.":"每一次交互。","Review what matters and understand what you're approving.":"核对重要信息，理解每一次确认的内容。","Check payment details.":"核对交易详情。","Make the destination, asset and amount easy to review.":"轻松核对地址、资产及金额。","Understand requests.":"理解连接请求。","Keep compatible app connections understandable.":"让兼容应用的连接请求易于理解。","Use verified links.":"使用可信链接。","Official download channels will be published once confirmed.":"确认官方渠道后才会公布下载链接。","FRESNICA / IN DEVELOPMENT":"FRESNICA / 开发中","Your Stellar journey":"你的 Stellar 之旅","starts here.":"从这里开始。","Fresnica is in development. Android and iOS are planned; verified official download links will appear here when available.":"Fresnica 正在开发中，计划支持 Android 和 iOS。官方渠道确认后将在这里公布下载链接。","PLATFORM 01":"平台 01","Android":"Android","PLANNED · NOT AVAILABLE YET":"计划支持 · 尚未开放","PLATFORM 02":"平台 02","iOS":"iOS","Which blockchain does Fresnica support?":"Fresnica 支持哪条区块链？","Fresnica is designed specifically for the Stellar ecosystem.":"Fresnica 专门面向 Stellar 区块链生态。","Can I download Fresnica today?":"现在可以下载 Fresnica 吗？","Not yet. Fresnica remains in development. Only verified release links will be provided here.":"暂时还不可以。Fresnica 仍在开发中，只会发布经过确认的正式下载链接。","Can I use this website as a wallet?":"可以直接在网站里使用钱包吗？","No. The website is an informational product preview. Wallet operations will take place in the mobile app.":"不可以。网站仅用于介绍产品，钱包操作将在移动应用中进行。","DARK MODE":"深色模式","LIGHT MODE":"浅色模式","FRESNICA / STELLAR WALLET":"FRESNICA / STELLAR 钱包","Your Stellar.":"你的 Stellar。","Your way.":"由你掌握。","An independent wallet project focused on a clearer experience for the Stellar ecosystem. In development.":"一个专注 Stellar 生态的钱包项目，致力于呈现更清晰的使用体验，目前正在开发中。","PRODUCT":"产品","Features":"功能特性","Availability":"上线计划","EXPLORE":"探索","Stellar ecosystem":"Stellar 生态","Experience":"产品体验","Several paths":"多种体验","Clarity":"清晰体验","ILLUSTRATIVE DESIGN / NOT A LIVE WALLET":"产品设计示意 / 非实时钱包","ASSETS · OVERVIEW / DEMO":"资产 · 概览演示","Everything in view.":"一切清晰可见。","Understand supported Stellar assets in one place.":"集中了解支持的 Stellar 资产。","XLM · sample balance":"XLM · 示例余额","Native asset":"原生资产","Issued assets":"发行资产","Explore":"探索","ILLUSTRATIVE · NOT LIVE DATA":"仅供演示 · 非实时数据","SEND / RECEIVE · DEMO":"收发 · 演示","Review every detail.":"核对每一个细节。","Payment details shown before any action.":"执行操作前显示支付详情。","MEMO: OPTIONAL · PREVIEW ONLY":"备注：可选 · 仅供预览","SWAP · DISCOVERY / DEMO":"兑换 · 探索演示","Explore a possible route.":"探索可能的兑换路径。","Preview supported assets before taking action.":"操作前预览支持的资产。","Stellar-issued asset":"Stellar 发行资产","PAIR / RATE NOT LIVE · PREVIEW ONLY":"交易对 / 汇率非实时 · 仅供预览","ASSETS":"资产","PAYMENTS":"收发","APPS":"应用","ASSETS IN VIEW":"资产概览","PAYMENT DETAIL PATH":"支付详情路径","Destination · sample address":"收款地址 · 示例地址","Select asset · XLM":"选择资产 · XLM","Check amount · 25.00 XLM":"核对金额 · 25.00 XLM","Review before signing · demo":"签名前核对 · 演示","Select supported asset":"选择支持的资产","Explore a possible pair":"探索可能的交易对","Preview details · not live":"预览详情 · 非实时","Review the route · demo":"核对路径 · 演示","illustrative":"示意","ILLUSTRATIVE":"示意","STELLAR WALLET":"STELLAR 钱包","Your Stellar world":"你的 Stellar 世界","The contrast":"对比","What it does":"核心功能","Your assets":"你的资产","Behind the experience":"体验背后","About Fresnica":"关于 Fresnica","Pause the animation":"暂停动画","Replay intro animation":"重播首屏动画","Pause or resume Hero orb":"暂停或恢复首屏球体","Previous feature":"上一项功能","Next feature":"下一项功能","Previous card":"上一张卡片","Next card":"下一张卡片","Wallet focus: XLM and Stellar assets, send and receive, swaps, compatible apps":"钱包功能：XLM、Stellar 资产、收发、兑换和兼容应用","Four wallet essentials, scroll to explore":"四项核心钱包功能，滚动探索","Four illustrated wallet capabilities":"四项钱包功能示意","Illustrative wallet balance and asset list":"钱包余额与资产清单示意","Wallet experience steps":"钱包体验步骤","Wallet experience cards":"钱包体验卡片","Illustrative product information dashboard":"产品信息看板示意","Frequently asked questions":"常见问题","Switch to dark theme":"切换为深色模式","Switch to light theme":"切换为浅色模式","Fresnica website":"Fresnica 网站","Fresnica V3 video-aligned hero":"Fresnica V3 首屏演示","Back to Fresnica preview top":"返回 Fresnica 首屏","Preview controls":"预览控制","Product status: In development":"产品状态：开发中","Animated translucent emerald liquid sphere, inspired by the uploaded website video":"参考视频的半透明绿色动态球体","Fine radial tick-ring and circulating green orbit markers":"精细刻度环与绿色轨道节点","Illustrative asset overview":"资产概览示意","Illustrative payment review":"交易核对示意","Illustrative swap preview":"兑换预览示意","Illustrative network points connected by a green line":"绿色连线连接的示意网络节点","A clearer start.":"更清晰的开始。","Website display options":"网站显示选项","Jump to a section":"跳转章节","Theme switch, coming soon":"整站主题切换功能即将开放","Theme switch coming soon":"主题切换即将开放","THEME":"主题","Switch website to Chinese":"切换网站为中文","Switch website to English":"切换网站为英文"};
  Object.assign(map,{"DOWNLOAD / MOBILE APP":"下载 / 移动应用","Get Fresnica on mobile.":"在移动设备上使用 Fresnica。","Android and iOS versions are planned. Official verified download links will appear here when available.":"Android 与 iOS 版本正在规划中。官方渠道确认后将在此提供下载链接。","DESKTOP EXPERIENCE / CONCEPT":"桌面客户端 / 概念预览","Your Stellar world, on desktop.":"你的 Stellar 世界，也在桌面。","Your Stellar world,":"你的 Stellar 世界，","on desktop.":"也在桌面。","Explore a focused desktop companion for Stellar assets and connected workflows. The desktop experience is a concept; availability has not been announced.":"探索专为 Stellar 资产与连接体验构想的桌面客户端。当前仍为概念预览，尚未公布上线计划。","DESKTOP INTERFACE · ILLUSTRATIVE":"桌面界面 · 示意","Q&A":"常见问题","A few things worth knowing.":"你可能想了解的事。","A few things":"你可能想了解的","worth knowing.":"事。","Clear answers before you explore.":"探索之前，先了解关键信息。","Is Fresnica available to download?":"Fresnica 现在可以下载吗？","Not yet. Android and iOS are planned. Only verified official links will be shown here.":"暂时还不能下载。Android 和 iOS 在规划中，官方渠道确认后才会展示下载链接。","Is the desktop client available?":"桌面客户端可以使用了吗？","No release date has been announced for a desktop client. The interface shown here is an illustrative concept.":"桌面客户端尚未公布上线日期。当前展示的界面仅为概念示意。","Is Fresnica a multi-chain wallet?":"Fresnica 是多链钱包吗？","No. Fresnica is designed specifically for the Stellar ecosystem.":"不是。Fresnica 专注 Stellar 生态。","Can I manage funds on this website?":"我能在这个网站管理资产吗？","No. This site is a product preview; wallet operations will be available in the app when released.":"不能。本网站仅展示产品概念；钱包操作需等待应用正式推出。","Download":"下载","Desktop":"桌面客户端","Questions":"常见问题","Mobile app":"移动应用"});
  Object.assign(map,{"FRESNICA · MADE FOR WHAT'S NEXT":"FRESNICA · 为下一步而生","A clearer":"更清晰的","way forward.":"前行之路。","Fresnica is designed to bring your Stellar assets, payments, swaps and compatible apps into one clear, considered experience.":"Fresnica 专为 Stellar 资产、收发、兑换及兼容应用打造清晰连贯的体验。","A more connected view.":"一种更连贯的视角。","Fresnica wallet focus: assets, transfers, swaps and connected apps":"Fresnica 钱包聚焦资产、转账、兑换与互联应用","Connected experience":"连贯体验","FRESNICA / CONNECTED BY DESIGN":"FRESNICA / 连接始于设计","Everything, connected.":"一切，自然连接。","FRESNICA · DESIGN PREVIEW":"FRESNICA · 设计预览","Keep the assets you follow together, clearly and simply.":"让你关注的资产清晰汇聚于一处。","Preview potential exchanges and review each step with clarity.":"预览可能的兑换方案，清楚核对每一步。","Explore compatible apps and keep connections easy to understand.":"探索兼容应用，让连接更易理解。","XLM / NATIVE ASSET":"XLM / 原生资产","you move.":"每一步。","DISCOVER / FRESNICA":"探索 / FRESNICA","MOVE / WITH EASE":"从容前行","FRESNICA / WALLET":"FRESNICA / 钱包","Your world,":"你的世界，","in a wider view.":"视野更开阔。","Explore how a focused desktop companion could bring assets and connected workflows into view. This remains a concept; availability has not been announced.":"探索聚焦资产与连接流程的桌面端体验构想。目前仅为概念预览，尚未公布可用时间。","A clearer, connected view.":"更清晰、更连贯的视图。","Send with clarity.":"清晰核对后再发送。","FRESNICA / YOUR WAY FORWARD":"FRESNICA / 你的前行方式","Your wallet.":"你的钱包。","Fresnica is an independent wallet designed for the Stellar ecosystem, with clarity and everyday control in mind. In development.":"Fresnica 是面向 Stellar 生态的独立钱包项目，以清晰体验和日常掌控为设计方向，目前仍在开发中。"});
  Object.assign(map,{"Back to top":"返回顶部"});
  let locale = 'en';
  const nodeOriginal = new WeakMap();
  const attrOriginal = new WeakMap();
  const chapters = [...frame.querySelectorAll('[data-chapter]')];
  const chapterTitles = new WeakMap();
  for (const section of chapters) chapterTitles.set(section,section.dataset.chapter);
  const toggle = document.getElementById('locale-toggle');
  const current = document.getElementById('locale-current');
  const localeTarget = document.getElementById('locale-target');

  function translateTextNode(node) {
    if (node.nodeType !== Node.TEXT_NODE || !node.parentElement ||
        node.parentElement.closest('script,style,template')) return;
    const value = node.nodeValue;
    // A script may replace a previously translated text node with a new English state.
    const before = nodeOriginal.has(node) ? nodeOriginal.get(node) : value;
    if (!nodeOriginal.has(node)) nodeOriginal.set(node,before);
    const token = before.trim().replace(/\s+/g,' ');
    const translated = locale==='zh-CN' ? (map[token] || token) : before.trim();
    // Keep indentation and whitespace around the original text node.
    const prefix = before.match(/^\s*/)?.[0] || '';
    const suffix = before.match(/\s*$/)?.[0] || '';
    const next = locale==='zh-CN' && map[token] ? prefix+translated+suffix : before;
    if (value!==next) node.nodeValue=next;
  }
  function walkText(root) {
    if (!root) return;
    if (root.nodeType===Node.TEXT_NODE) {translateTextNode(root); return;}
    if (root.nodeType!==Node.ELEMENT_NODE || root.closest('script,style,template')) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walker.nextNode())translateTextNode(walker.currentNode);
  }
  function translateAttrs(root) {
    const elements=[root,...root.querySelectorAll('[aria-label],[title],[placeholder]')];
    for(const el of elements){
      if(el.nodeType!==Node.ELEMENT_NODE)continue;
      for(const key of ['aria-label','title','placeholder']){
        if(!el.hasAttribute(key))continue;
        let saved=attrOriginal.get(el);
        if(!saved){saved={};attrOriginal.set(el,saved);}
        const old=saved[key] ?? el.getAttribute(key);
        if(!(key in saved))saved[key]=old;
        const live=(el.id==='footer-theme' && key==='aria-label') ?
          (el.getAttribute('aria-pressed')==='true'?'Switch to light theme':'Switch to dark theme') : old;
        let val=locale==='zh-CN' ? (map[live] || live) : live;
        if(el.id==='locale-toggle' && key==='aria-label')
          val=locale==='en'?'Switch website to Chinese':'切换网站为英文';
        if(el.getAttribute(key)!==val)el.setAttribute(key,val);
      }
    }
  }
  function syncLanguage(){
    document.documentElement.lang=locale;
    chapters.forEach(section=>{
      const english=chapterTitles.get(section);
      section.dataset.chapter=locale==='zh-CN' ? (map[english] || english) : english;
    });
    walkText(frame);
    translateAttrs(frame);
    if(current)current.textContent=locale==='en'?'EN':'中文';
    if(localeTarget)localeTarget.textContent=locale==='en'?'中文':'EN';
    toggle?.setAttribute('aria-label',locale==='en'?'Switch website to Chinese':'切换网站为英文');
    toggle?.setAttribute('aria-pressed',String(locale==='zh-CN'));
    window.dispatchEvent(new Event('scroll'));
  }
  toggle?.addEventListener('click',()=>{locale=locale==='en'?'zh-CN':'en';syncLanguage();});
  // Scroll-driven presentation steps update text content (nav, M6 network caption).
  // Translate only newly changed text instead of rebuilding the page or its widgets.
  let translatePending=false;
  const observer=new MutationObserver(records=>{
    if(locale==='en'||translatePending)return;
    translatePending=true;
    raf(()=>{
      translatePending=false;
      for(const item of records){
        if(item.type==='characterData')translateTextNode(item.target);
        else for(const node of item.addedNodes)walkText(node);
      }
      // Keep the dynamic footer caption and accessible labels in the chosen language.
      translateAttrs(frame);
    });
  });
  observer.observe(frame,{subtree:true,childList:true,characterData:true});
  syncLanguage();

  const featureWindow=document.getElementById('feature-window');
  const featureTrack=document.getElementById('feature-track');
  const firstCard=featureTrack?.querySelector('.feature-card');
  function centerFeatures(){
    if(!featureTrack || !featureWindow || !firstCard)return;
    if(compact.matches){
      const wasSet=featureTrack.style.marginLeft || featureTrack.style.paddingRight;
      featureTrack.style.removeProperty('margin-left');
      featureTrack.style.removeProperty('padding-right');
      if(wasSet) window.dispatchEvent(new Event('resize'));
      return;
    }
    const width=featureWindow.clientWidth;
    const cardWidth=firstCard.getBoundingClientRect().width;
    const gap=parseFloat(getComputedStyle(featureTrack).gap)||20;
    const count=Math.min(featureTrack.children.length,Math.max(1,Math.floor((width+gap)/(cardWidth+gap))));
    const visible=cardWidth*count + gap*(count-1);
    const inset=Math.max(0,(width-visible)/2);
    const left=inset.toFixed(2)+'px';
    const right=(inset*2).toFixed(2)+'px';
    if(featureTrack.style.marginLeft===left && featureTrack.style.paddingRight===right)return;
    featureTrack.style.marginLeft=left;
    featureTrack.style.paddingRight=right;
    // M1 measures the rail width on resize; this event settles after a single update.
    window.dispatchEvent(new Event('resize'));
  }
  centerFeatures();
  let resizePending=false;
  window.addEventListener('resize',()=>{
    if(!resizePending){resizePending=true;raf(()=>{resizePending=false;centerFeatures();});}
  },{passive:true});
  compact.addEventListener('change',centerFeatures);

  // Wheel gestures are accumulated to a threshold, then the view aligns to the
  // next entire scene. Internal pinned chapters still animate as scroll progresses.
  let accumulation=0, direction=0, lastWheel=0, lock=false, animation=0;
  const active=()=>!compact.matches&&!reduced.matches;
  function sceneStops(){
    const root=scroller.getBoundingClientRect();
    return [...scroller.children].filter(el=>el.matches('.stage,.chapter,.m5-runway,.feature-scroll,.v3-screen-runway'))
      .map(el=>({id:el.dataset.sceneId || el.querySelector('.stage,.chapter')?.id || el.id,
        top:clamp(scroller.scrollTop+el.getBoundingClientRect().top-root.top,0,scroller.scrollHeight-scroller.clientHeight)}))
      .sort((a,b)=>a.top-b.top);
  }
  function snapTo(target){
    if(lock)return;
    const from=scroller.scrollTop;
    const dist=target-from;
    if(Math.abs(dist)<2)return;
    const duration=clamp(720+Math.abs(dist)*.20,760,1500);
    const start=performance.now();
    const before=scroller.style.scrollBehavior;
    scroller.style.scrollBehavior='auto';
    lock=true;
    function tick(now){
      const t=clamp((now-start)/duration,0,1);
      const ease=t*t*(3-2*t);
      scroller.scrollTop=from+dist*ease;
      if(t<1)animation=raf(tick);
      else{
        animation=0;
        scroller.scrollTop=target;
        scroller.style.scrollBehavior=before;
        // Do not accept momentum events from the same wheel gesture as a second page.
        setTimeout(()=>{lock=false;accumulation=0;direction=0;lastWheel=0;},260);
      }
    }
    animation=raf(tick);
  }
  function stepScreen(sign){
    const stops=sceneStops();
    if(stops.length<2)return;
    const cursor=scroller.scrollTop;
    let index=0;
    for(let i=0;i<stops.length;i++)if(stops[i].top<=cursor+scroller.clientHeight*.28)index=i;
    const destination=clamp(index+sign,0,stops.length-1);
    snapTo(stops[destination].top);
  }
  frame.addEventListener('wheel',event=>{
    if(!active() || !event.cancelable || event.ctrlKey || event.metaKey || event.shiftKey)return;
    if(Math.abs(event.deltaX)>Math.abs(event.deltaY)*1.25)return;
    if(!event.deltaY)return;
    // Allow scrolling an independently overflowed list with its own scrollbar.
    if(event.target.closest('[data-native-wheel]'))return;
    event.preventDefault();
    if(lock)return;
    const now=performance.now();
    const normalized=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?scroller.clientHeight:1);
    const sign=Math.sign(normalized);
    if(now-lastWheel>500 || direction!==sign)accumulation=0;
    direction=sign;lastWheel=now;
    accumulation+=normalized;
    if(Math.abs(accumulation)<115)return;
    accumulation=0;
    stepScreen(sign);
  },{passive:false});
  // New context can invalidate a pending wheel transition; cancel gracefully.
  const cancel=()=>{
    if(animation){cancelAnimationFrame(animation);animation=0;scroller.style.scrollBehavior='';}
    lock=false;accumulation=0;direction=0;lastWheel=0;
  };
  document.addEventListener('keydown',event=>{if(event.key==='Escape')cancel();});
  frame.addEventListener('click',event=>{
    if(event.target.closest('a[href^="#"]'))cancel();
  });
  reduced.addEventListener('change',cancel);
  compact.addEventListener('change',cancel);
})();
