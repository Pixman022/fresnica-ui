import { coreGroups } from "./wallet-prototype-core.js";
import { extraGroups } from "./wallet-prototype-extra.js";

// Static Fresnica design prototype. No account secrets, transactions or APIs.
const groupOrder = ["home","activity","actions","dapps","settings","send","request","swap","assets","markets","accounts","book","onboard","scan","states","extensions"];
export const groups = [...coreGroups, ...extraGroups].sort((a,b) => groupOrder.indexOf(a.id) - groupOrder.indexOf(b.id));
export const pages = groups.flatMap(group => group.pages.map((page,index) => ({...page, section:group.id, sectionLabel:group.label, number:String(index+1).padStart(2,"0")})));
const pagesById = new Map(pages.map(page => [page.id, page]));
const esc = value => String(value ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");

const paths = {
  "home":'<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-7h6v7"/>',
  "activity":'<path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 3v6h6"/><path d="M12 7v5l4 2"/>',
  "actions":'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
  "dapps":'<circle cx="12" cy="12" r="9"/><path d="m15 9-2 5-4 2 2-5z"/>',
  "settings":'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.6 2.5 2 1.2 2.5-.5 2 3.5-1.8 1.8v2.4l1.8 1.8-2 3.5-2.5-.5-2 1.2L14 22h-4l-.6-2.5-2-1.2-2.5.5-2-3.5 1.8-1.8v-2.4L2.9 9l2-3.5 2.5.5 2-1.2z"/>',
  "swap":'<path d="M4 7h16l-4-4M20 7l-4 4M20 17H4l4-4M4 17l4 4"/>',
  "send":'<path d="M7 17 17 7M8 7h9v9"/>',
  "request":'<path d="m7 7 10 10M7 17h10V7"/>',
  "wallet":'<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M17 12h4M3 9h17"/>',
  "assets":'<path d="M12 2 3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5"/>',
  "markets":'<path d="M3 19h18M5 16l5-6 4 2 5-8"/><circle cx="5" cy="16" r="1"/>',
  "accounts":'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/>',
  "book":'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18M11 8h5M11 12h5"/>',
  "onboard":'<path d="m12 2 8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
  "scan":'<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3M7 12h10"/>',
  "states":'<circle cx="12" cy="12" r="9"/><path d="M12 7v5m0 4h.01"/>',
  "extensions":'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 7v10M7 12h10"/>',
  "plus":'<path d="M12 5v14M5 12h14"/>',
  "chevron":'<path d="m9 18 6-6-6-6"/>',
  "chevron-down":'<path d="m6 9 6 6 6-6"/>',
  "back":'<path d="m14 6-6 6 6 6M8 12h13"/>',
  "search":'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  "info":'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/>',
  "check":'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  "alert":'<path d="m12 3 10 18H2z"/><path d="M12 9v4M12 17h.01"/>',
  "lock":'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  "copy":'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/>',
  "network":'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/>',
  "star":'<path d="m12 3 3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L3 10l6-1z"/>',
  "external":'<path d="M14 4h6v6M20 4l-9 9"/><path d="M20 13v6H5V4h6"/>',
  "sun":'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  "send2":'<path d="m3 10 18-7-7 18-3-8zM11 13 21 3"/>',
  "refresh":'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 9a7 7 0 0 1 12-2l2 5M4 12l2 5a7 7 0 0 0 12-2"/>',
  "eye":'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  "qr":'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M21 14v7M14 21h3"/>',
  "arrow-up":'<path d="m12 5 7 7M12 5l-7 7M12 5v14"/>',
  "more":'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
};
function icon(name, extra="") {
  const key = paths[name] ? name : "wallet";
  return '<svg class="lab-icon '+esc(extra)+'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[key]+'</svg>';
}
const idFor = page => esc(page.id);
const link = (label,to,kind="primary") => '<button type="button" class="lab-action lab-action--'+esc(kind)+'" data-go="'+esc(to)+'">'+esc(label)+'</button>';
const actions = page => {
  const a=[];
  if(page.primary)a.push(link(page.primary.text,page.primary.to));
  if(page.secondary)a.push(link(page.secondary.text,page.secondary.to,"secondary"));
  return a.length?'<div class="lab-actions">'+a.join("")+'</div>':"";
};
function hero(page){
  const v=page.hero;if(!v)return "";
  return '<div class="lab-hero"><span class="lab-kicker">'+esc(v[0])+'</span><div class="lab-hero-value">'+esc(v[1])+'</div><span class="lab-hero-note">'+esc(v[2]||"")+'</span></div>';
}
const banner = page => page.banner?'<div class="lab-banner">'+icon("info")+'<span>'+esc(page.banner)+'</span></div>':"";
function facts(page){
  if(!page.facts||!page.facts.length)return "";
  return '<section class="lab-panel"><div class="lab-panel-title">Details</div>'+page.facts.map(pair=>'<div class="lab-fact"><span>'+esc(pair[0])+'</span><strong>'+esc(pair[1])+'</strong></div>').join("")+'</section>';
}
function rows(page){
  if(!page.rows||!page.rows.length)return "";
  return '<div class="lab-list">'+page.rows.map((row,i)=>{
    const [name,sub,right,to] = row;
    const dest=to&&pagesById.has(to)?to:page.id;
    const isAsset = ["XLM","USDC","AQUA"].includes(name);
    const labelIcon=isAsset?name.slice(0,1):name.slice(0,1).toUpperCase();
    return '<button type="button" class="lab-row" data-go="'+esc(dest)+'"><span class="lab-row-symbol'+(isAsset?' lab-row-symbol--asset':'')+'">'+esc(labelIcon)+'</span><span class="lab-row-text"><strong>'+esc(name)+'</strong><small>'+esc(sub||"")+'</small></span><span class="lab-row-right">'+esc(right||"")+(!right?icon("chevron"):"")+'</span></button>';
  }).join("")+'</div>';
}
function inputFields(page){
  if(!page.fields||!page.fields.length)return "";
  return '<section class="lab-form">'+page.fields.map(([label,value])=>{
    const secret=/passphrase|private key|recovery words/i.test(label);
    const isSelect=/asset$|type$|network$|currency$|side$|pair$|direction$|account$/i.test(label);
    return '<label class="lab-field"><span>'+esc(label)+'</span><input aria-label="'+esc(label)+'" autocomplete="off" spellcheck="false" type="'+(secret?'password':'text')+'" placeholder="'+esc(value||"Enter value")+'" /></label>';
  }).join("")+'</section>';
}
function tabs(page) {
  if(!page.tabs)return "";
  const destinations={"Tokens":"home-tokens","Claimable":"home-claimables","Liquidity Pools":"home-pools"};
  return '<div class="lab-tabs">'+page.tabs.map((t,i)=>'<button type="button" class="'+(i===0?'selected':'')+'" data-go="'+(destinations[t]||page.id)+'">'+esc(t)+'</button>').join("")+'</div>';
}
function searchField(page){
  return page.search?'<label class="lab-search">'+icon("search")+'<input type="search" aria-label="'+esc(page.search)+'" placeholder="'+esc(page.search)+'" autocomplete="off" /></label>':"";
}
function chips(page){
  return page.chips?'<div class="lab-chips">'+page.chips.map((t,i)=>'<span class="'+(i===0?'selected':'')+'">'+esc(t)+'</span>').join("")+'</div>':"";
}
function fakeQR() {
  let cells="";
  for(let y=0;y<21;y++)for(let x=0;x<21;x++){
    function finder(ax,ay){const dx=x-ax,dy=y-ay;if(dx<0||dy<0||dx>6||dy>6)return null;return dx===0||dx===6||dy===0||dy===6||(dx>=2&&dx<=4&&dy>=2&&dy<=4);}
    const a=finder(0,0),b=finder(14,0),c=finder(0,14);
    const filled=a!==null?a:b!==null?b:c!==null?c:(x*7+y*11+x*y)%13<5;
    cells+='<i class="'+(filled?'filled':'')+'"></i>';
  }
  return '<div class="lab-qr" aria-label="Decorative non-scannable sample QR">'+cells+'</div><div class="lab-qr-notice">Sample illustration · Not a scannable payment code</div>';
}
function accountHome(){
  return '<div class="lab-account-card"><div class="lab-account-avatar">F</div><div><strong>SuperWallet</strong><small>GB3URD...GTEIWH3W</small></div><button type="button" aria-label="Switch account" data-go="home-switch-account">'+icon("chevron-down")+'</button></div>'
  +'<div class="lab-balance"><span>Total balance</span><button type="button" class="lab-balance-value" data-toast="Tap to switch reference currency in the full app">546,213.02 <small>XLM</small></button><small>Available 546,201.0231432 XLM · Reserved 12 XLM</small></div>'
  +'<div class="lab-quick">'+[["Send","send","send-asset"],["Swap","swap","swap-main"],["Request","request","request-settings"]].map((x,i)=>'<button type="button" class="'+(i===1?'main':'')+'" data-go="'+x[2]+'">'+icon(x[1])+'<span>'+x[0]+'</span></button>').join("")+'</div>'
  +'<div class="lab-list-title"><strong>Your assets</strong><button type="button" data-go="home-add-asset">'+icon("plus")+' Add</button></div>'
  +rows({id:"home-overview",rows:[["XLM","Stellar native asset · Reserved 12 XLM","546,213.0231432","home-asset-detail"],["USDC","GCPQ...R7KM","250.00","home-asset-detail"],["AQUA","GBZA...T4WN","860.00","home-asset-detail"]]})
  +'<button type="button" class="lab-soft-link" data-go="home-categories">Tokens · Claimable · Liquidity Pools '+icon("chevron")+'</button>';
}
function statusView(page){
  const k=page.status||"info";const ic=k==="success"?"check":k==="error"||k==="warning"?"alert":k==="loading"?"refresh":k==="empty"?"wallet":"info";
  return '<div class="lab-status-view"><div class="lab-status-icon lab-status-icon--'+esc(k)+'">'+icon(ic)+'</div><strong>'+esc(page.title)+'</strong><p>'+esc(page.description||"")+'</p></div>';
}
function browser(){
  return '<div class="lab-browser-bar">'+icon("lock")+'<span>https://example.invalid</span>'+icon("refresh")+'</div>'
  +'<div class="lab-browser-site"><div class="lab-browser-emblem">'+icon("swap")+'</div><div class="lab-kicker">DEMO WEBSITE</div><h3>Example DEX</h3><p>Illustrative Stellar dApp browser content. No external site is loaded.</p><div class="lab-browser-stats"><span>Pay<br/><strong>120 XLM</strong></span><span>Receive<br/><strong>USDC</strong></span></div></div>';
}
function scanner(){
  return '<div class="lab-scanner"><div class="lab-scan-frame"><span></span><span></span><span></span><span></span><div class="lab-scan-line"></div></div><div>Position QR code inside the frame</div><small>Camera not connected in this preview</small></div>';
}
function welcome(page){
  return '<div class="lab-welcome-hero"><img src="./Fresnica-logo.svg" alt="Fresnica logo" /><h2>Your Stellar world.</h2><p>Securely manage accounts, assets and the apps you trust.</p></div>'+rows(page);
}
function actionsSheet(){
  const cards=[["Swap","swap","swap-main"],["Scan","scan","scan-camera"],["Send","send","send-asset"]];
  return '<div class="lab-dimmed"><span class="lab-dim-circle"></span></div><div class="lab-sheet"><div class="lab-grabber"></div><h2>Actions</h2><div class="lab-panel-title">QUICK ACTIONS</div><div class="lab-action-tiles">'+cards.map(([text,ic,to])=>'<button type="button" data-go="'+to+'">'+icon(ic)+'<span>'+text+'</span></button>').join("")+'</div><div class="lab-panel-title">RECENTLY USED</div>'+rows({id:"actions-sheet",rows:[["Example DEX","Third-party app","Open","dapps-browser"]]})+'<div class="lab-panel-title">OUR SUGGESTIONS</div>'+rows({id:"actions-sheet",rows:[["Stellar Expert","Blockchain explorer","Open","dapps-detail"]]})+'</div>';
}
function screenBody(page) {
  let body="";
  if(page.kind==="home")return accountHome();
  if(page.kind==="welcome")return welcome(page);
  if(page.kind==="actions")return actionsSheet();
  if(page.kind==="browser")body=browser();
  if(page.kind==="scan")body=scanner();
  if(page.kind==="qr")body=hero(page)+fakeQR()+facts(page);
  if(page.kind==="backup")body='<div class="lab-panel-title">RECOVERY PHRASE PREVIEW</div><div class="lab-backup">'+Array.from({length:12},(_,i)=>'<span><small>'+(i+1)+'.</small> •••••</span>').join("")+'</div>';
  if(page.kind==="unlock")body='<div class="lab-unlock-icon">'+icon("lock")+'</div>'+inputFields(page);
  if(page.kind==="swap")body='<div class="lab-swap-pair">'+inputFields(page)+'</div><button type="button" class="lab-swap-flip" data-toast="Example assets swapped visually only">'+icon("swap")+'</button>';
  if(page.kind==="result"||page.kind==="state")body=statusView(page)+hero(page)+facts(page);
  if(page.kind==="auth")body=hero(page)+facts(page)+inputFields(page)+'<div class="lab-slide-hint">'+icon("lock")+' Authorization preview · No signing</div>';
  if(page.kind==="review"||page.kind==="detail")body=hero(page)+facts(page);
  if(page.kind==="list"||page.kind==="choice"||page.kind==="settings"||page.kind==="activity")body=hero(page)+searchField(page)+tabs(page)+chips(page)+rows(page);
  if(page.kind==="form")body=hero(page)+inputFields(page)+rows(page);
  return body+banner(page)+actions(page);
}
const isIntro = page=>page.section==="onboard";
function bottomNav(page){
  if(isIntro(page))return "";
  const entries=[["Home","home","home-overview"],["Activity","activity","activity-list"],["Actions","actions","actions-sheet"],["dApps","dapps","dapps-discover"],["Settings","settings","settings-home"]];
  return '<nav class="lab-bottom" aria-label="Wallet bottom navigation">'+entries.map(([label,ic,id])=>'<button type="button" data-go="'+id+'"'+((page.section===ic)?' aria-current="page"':'')+' class="'+(ic==="actions"?'lab-nav-center':'')+'">'+icon(ic)+'<span>'+label+'</span></button>').join("")+'</nav>';
}
function devicePage(page) {
  const g=groups.find(x=>x.id===page.section);
  return '<div class="lab-device"><div class="lab-island"></div>'
    +'<div class="lab-phone-top"><button type="button" class="lab-back" aria-label="Back to gallery Home" data-go="home-overview">'+icon("back")+'</button><div class="lab-brand"><img src="./Fresnica-logo.svg" alt="" /><span>fresnica</span></div><span class="lab-network">'+(page.id==="home-testnet"?'TESTNET':'MAINNET')+'</span></div>'
    +'<div class="lab-scroll"><div class="lab-screen-top"><div class="lab-kicker">'+esc((g?g.label:"Fresnica").split(" · ")[0].toUpperCase())+' / '+esc(page.number)+'</div><h1>'+esc(page.title)+'</h1><p>'+esc(page.description||"Wallet interface preview")+'</p></div>'+screenBody(page)+'</div>'
    +bottomNav(page)+'</div>';
}
function sideEntries(active){
  return groups.map(group=>{
    const open=group.pages.some(x=>x.id===active);
    const entries=group.pages.map((page,index)=>{
      const selected=page.id===active;
      return '<a href="./wallet-prototype.html#'+idFor(page)+'" data-screen-id="'+idFor(page)+'" class="wallet-nav-entry'+(selected?' is-current':'')+'"'+(selected?' aria-current="page"':'')+'><span class="wallet-nav-number">'+String(index+1).padStart(2,"0")+'</span><span><strong>'+esc(page.cn)+'</strong><small>'+esc(page.title)+'</small></span></a>';
    }).join("");
    return '<details class="wallet-nav-group" data-section="'+esc(group.id)+'"'+(open?' open':'')+'><summary>'+icon(group.id)+'<span>'+esc(group.label)+'</span><em>'+group.pages.length+'</em>'+icon("chevron-down")+'</summary><div class="wallet-nav-children">'+entries+'</div></details>';
  }).join("");
}
function searchUI() {return '<label class="wallet-nav-find">'+icon("search")+'<input type="search" class="wallet-nav-query" aria-label="Search wallet pages" placeholder="搜索 / Search pages" autocomplete="off" /></label>';}
function pinned(active) {
  return '<div class="wallet-pinned"><span class="wallet-nav-caption">已有界面示例</span>'
  +'<a href="./mobile-demo.html">'+icon("home")+'<span>首页示例</span></a>'
  +'<a href="./wallet-home.html">'+icon("wallet")+'<span>钱包首页</span></a>'
  +'</div>';
}
function renderSidebar(active){
  const root=document.getElementById("wallet-lab-sidebar");if(!root)return;
  root.innerHTML='<div class="lab-sidebar-brand"><img src="./Fresnica-logo.svg" alt="" /><span><strong>FRESNICA / UI</strong><small>钱包产品界面 · 全部页面</small></span></div>'
    +'<div class="lab-sidebar-scroll">'+pinned(active)+searchUI()
    +'<div class="wallet-nav-caption">页面目录 · '+pages.length+' 个原型界面</div><nav aria-label="All Fresnica wallet screens" class="wallet-nav-groups">'+sideEntries(active)+'</nav></div>'
    +'<div class="lab-sidebar-foot"><span class="lab-prototype-dot"></span>UI Prototype · No live wallet</div>';
}
function renderOldSidebar(){
  const nav=document.querySelector(".preview-sidebar .preview-nav");if(!nav)return;
  const holder=document.createElement("div");holder.className="wallet-old-index";
  holder.innerHTML='<div class="wallet-nav-caption">全部产品页面 · '+pages.length+'</div>'+searchUI()+'<div class="wallet-nav-groups">'+sideEntries("")+'</div>';
  nav.appendChild(holder);
  document.querySelector(".preview-sidebar")?.classList.add("has-wallet-index");
}
let currentId="";
function selectPage(id){
  const page=pagesById.get(id)||pagesById.get("home-overview");
  if(!page)return;
  currentId=page.id;
  const host=document.getElementById("wallet-lab-stage");
  if(host){host.innerHTML='<div class="lab-stage-caption"><div><span>WALLET INTERFACE LIBRARY</span><strong>'+esc(page.cn)+' <small>/ '+esc(page.title)+'</small></strong></div><span class="lab-page-index">'+esc(page.sectionLabel)+' · '+esc(page.number)+'</span></div>'+devicePage(page)+'<div class="lab-under-phone">FRESNICA / STELLAR WALLET <span>DESIGN PREVIEW ONLY</span></div>';}
  renderSidebar(page.id);
  document.title=page.title+" · Fresnica UI Preview";
  document.querySelector(".lab-scroll")?.scrollTo({top:0});
  document.querySelector(".wallet-nav-entry.is-current")?.scrollIntoView({block:"nearest"});
}
function toast(text){
  const existing=document.querySelector(".lab-toast");if(existing)existing.remove();
  const node=document.createElement("div");node.className="lab-toast";node.setAttribute("role","status");node.textContent=text;
  document.body.appendChild(node);
  window.setTimeout(()=>node.remove(),2200);
}
function activate(to){
  if(document.getElementById("wallet-lab-stage")){
    if(to===currentId){toast("Sample action · No data changed");return;}
    window.location.hash=to;
  }else window.location.href="./wallet-prototype.html#"+encodeURIComponent(to);
}
function enableLegacyActions(){
  const pairs=[
    [".phone-quick > span",["send-asset","swap-main","request-settings"]],
    [".phone-asset-add",["home-add-asset"]],
    [".phone-asset",["home-asset-detail"]],
    [".wallet-action",["send-asset","swap-main","request-settings"]],
    [".wallet-add",["home-add-asset"]],
    [".wallet-asset",["home-asset-detail"]]
  ];
  for(const [selector,targets] of pairs){
    document.querySelectorAll(selector).forEach((node,i)=>{
      const target=targets[Math.min(i,targets.length-1)];node.setAttribute("role","link");node.setAttribute("tabindex","0");
      node.classList.add("wallet-linkable");
      node.addEventListener("click",()=>activate(target));
      node.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();activate(target);}});
    });
  }
}
document.addEventListener("click",event=>{
  const button=event.target.closest("[data-go]");
  if(button){event.preventDefault();activate(button.getAttribute("data-go"));return;}
  const hint=event.target.closest("[data-toast]");
  if(hint){toast(hint.dataset.toast);return;}
});
document.addEventListener("input",event=>{
  const field=event.target.closest(".wallet-nav-query");
  if(!field)return;
  const parent=field.closest(".lab-sidebar-scroll, .wallet-old-index");
  if(!parent)return;
  const q=field.value.trim().toLowerCase();
  parent.querySelectorAll(".wallet-nav-group").forEach(group=>{
    let visible=0;
    group.querySelectorAll(".wallet-nav-entry").forEach(link=>{
      const match=link.textContent.toLowerCase().includes(q);
      link.hidden=!match;if(match)visible++;
    });
    group.hidden=visible===0;if(q&&visible)group.open=true;
  });
});
if(document.getElementById("wallet-lab-stage")){
  window.addEventListener("hashchange",()=>selectPage(decodeURIComponent(location.hash.slice(1))));
  selectPage(decodeURIComponent(location.hash.slice(1)));
}else{
  renderOldSidebar();
  enableLegacyActions();
}
