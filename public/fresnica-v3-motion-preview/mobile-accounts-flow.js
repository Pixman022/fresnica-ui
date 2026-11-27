/* Fresnica Accounts UI routes: page information and transition previews only.
   Never create/import/delete accounts or process recovery phrases or private keys. */
(() => {
  const routes = new Set(["accounts","account-details","account-sort","add-account",
    "account-create","account-import-phrase","account-import-secret",
    "account-hd","account-watch-only","account-review","account-recovery"]);
  const query = new URLSearchParams(location.search);
  const page = query.get("view");
  if (!routes.has(page)) return;
  window.FresnicaAccountsFlowActive = true;
  const phone = document.querySelector(".settings-detail-phone");
  const state = window.FresnicaPreviewState;
  if (!phone || !state) return;
  phone.classList.add("accounts-flow-phone");
  const content = phone.querySelector("#settings-detail-content");
  const heading = phone.querySelector("#settings-detail-title");
  const back = phone.querySelector(".secondary-back");
  const headerActions = phone.querySelector(".secondary-header-end");
  const overlay = phone.querySelector(".settings-detail-sheet-overlay");
  const sheetTitle = phone.querySelector("#settings-detail-dialog-title");
  const sheetBody = phone.querySelector("#settings-detail-dialog-body");
  const closeButton = phone.querySelector(".settings-detail-sheet-close");
  const toast = phone.querySelector(".settings-detail-toast");
  const fromHome = query.get("from")==="home";
  const selectedId = query.get("account") || "";
  const rawMethod = query.get("method") || "create";
  const locale = () => {
    try {return localStorage.getItem("fresnica-gallery-language")==="zh" ? "zh" : "en";}
    catch(_){return "en";}
  };
  const tr = (en,cn) => locale()==="zh" ? cn : en;
  const esc = value => String(value).replace(/[&<>"']/g,ch=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));
  const icon = (path) => '<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';
  const marks = {
    wallet:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 10h18M16 15h2"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    phrase:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    secret:'<circle cx="9" cy="9" r="5"/><path d="m12.5 12.5 9 9M17 17l2-2"/>',
    hd:'<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M8 6.5 11 17M16 6.5 13 17M8 5h8"/>',
    eye:'<path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    pencil:'<path d="m4 20 4-.9L19 8a2 2 0 0 0-3-3L5 16Z"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
    hide:'<path d="M3 3l18 18M10 6.2A12 12 0 0 1 12 6c6 0 10 6 10 6a14 14 0 0 1-3.2 3.6M6.5 6.6C3.7 8.4 2 12 2 12s3.5 6 10 6a12 12 0 0 0 4-.7"/>',
    copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  const titles = {
    accounts:["Accounts","账户"],"account-details":["Account details","账户详情"],
    "account-sort":["Reorder accounts","排列账户"],"add-account":["Add account","添加账户"],
    "account-create":["Create account","创建账户"],
    "account-import-phrase":["Import recovery phrase","导入助记词"],
    "account-import-secret":["Import secret key","导入私钥"],
    "account-hd":["Derive HD account","HD 派生账户"],
    "account-watch-only":["Watch-only account","只读账户"],
    "account-review":["Review account","确认账户"],
    "account-recovery":["Recovery material","恢复材料"]
  };
  const methods = {
    create:{view:"account-create",name:["Create account","创建账户"],detail:["New Stellar identity","创建 Stellar 账户"],icon:"plus"},
    phrase:{view:"account-import-phrase",name:["Import recovery phrase","导入助记词"],detail:["Existing phrase","已有恢复短语"],icon:"phrase"},
    secret:{view:"account-import-secret",name:["Import secret key","导入私钥"],detail:["Existing Stellar secret","已有 Stellar 私钥"],icon:"secret"},
    hd:{view:"account-hd",name:["Derive HD account","HD 派生账户"],detail:["SEP-5 account index","SEP-5 账户索引"],icon:"hd"},
    watch:{view:"account-watch-only",name:["Watch-only account","只读账户"],detail:["G / C public address","G / C 公开地址"],icon:"eye"}
  };
  const accounts = state.accounts();
  const activeId = state.activeAccount()?.id;
  const account = accounts.find(a=>a.id===selectedId) || accounts.find(a=>!a.hidden) || accounts[0];
  let displayAccounts = accounts.map(a=>({...a})); // visual sort only
  let openedBy = null;
  let toastTimer;
  const linkFor = (view,options={}) => {
    const args = new URLSearchParams({view});
    if (fromHome) args.set("from","home");
    for (const [key,value] of Object.entries(options)) if (value!==undefined && value!==null) args.set(key,String(value));
    return "./mobile-settings-detail.html?"+args.toString();
  };
  const currentLink = linkFor("accounts");
  const section = (en,cn,body) =>
    '<h2 class="settings-detail-section-title">'+esc(tr(en,cn))+'</h2>'+
    '<section class="settings-detail-card">'+body+'</section>';
  const note = (en,cn) => '<p class="settings-detail-note">'+esc(tr(en,cn))+'</p>';
  const avatar = type => '<span class="accounts-avatar">'+icon(marks[type==="watch-only"?"eye":"wallet"])+'</span>';
  const chevron = '<svg class="accounts-row-chevron" viewBox="0 0 24 24" aria-hidden="true">'+marks.chevron+'</svg>';
  const tag = (en,cn,current=false) => '<span class="accounts-tag'+(current?" is-current":"")+'">'+esc(tr(en,cn))+'</span>';
  const pair = (en,cn,value) => '<div class="accounts-pair"><span class="accounts-pair-label">'+
    esc(tr(en,cn))+'</span><strong class="accounts-pair-value">'+esc(value)+'</strong></div>';
  const row = (en,cn,mark,url,detail) =>
    '<a class="accounts-choice" href="'+esc(url)+'"><span class="settings-detail-row-icon">'+
    icon(marks[mark]||marks.wallet)+'</span><span class="accounts-choice-info"><b>'+
    esc(tr(en,cn))+'</b>'+(detail?'<small>'+esc(tr(detail[0],detail[1]))+'</small>':"")+
    '</span>'+chevron+'</a>';
  const buttonRow = (en,cn,mark,actionName,description) =>
    '<button type="button" class="settings-detail-row" data-account-action="'+esc(actionName)+'">'+
    '<span class="settings-detail-row-icon">'+icon(marks[mark]||marks.wallet)+'</span>'+
    '<span class="settings-detail-row-copy"><b>'+esc(tr(en,cn))+'</b>'+
    (description?'<small>'+esc(tr(description[0],description[1]))+'</small>':"")+
    '</span><svg class="settings-detail-chevron" viewBox="0 0 24 24" aria-hidden="true">'+marks.chevron+'</svg></button>';
  const displayAddress = a => a.address==="—" ? tr("Example account","示例账户") : a.address;
  const accountType = a => a.type==="watch-only" ?
    tr("Watch-only","只读") : tr("Example","示例");
  const listRow = (a,sorting,index,total) => {
    const isCurrent=a.id===activeId;
    const currentTag=isCurrent?tag("Current","当前",true):"";
    const typeTag=a.type==="watch-only"?tag("Watch-only","只读"):tag("Example","示例");
    const hiddenTag=a.hidden?tag("Hidden","已隐藏"):"";
    const info='<span class="accounts-row-info"><span class="accounts-row-name">'+esc(a.name)+'</span>'+
      '<span class="accounts-row-subtitle">'+esc(displayAddress(a))+'</span>'+
      '<span class="accounts-row-tags">'+currentTag+typeTag+hiddenTag+'</span></span>';
    if (sorting) {
      return '<div class="accounts-row">'+avatar(a.type)+info+
        '<span class="accounts-sort-control"><button type="button" data-visual-move="up" data-id="'+esc(a.id)+
        '" aria-label="'+esc(tr("Move up","上移"))+'" '+(index===0?'disabled':'')+'>↑</button>'+
        '<button type="button" data-visual-move="down" data-id="'+esc(a.id)+
        '" aria-label="'+esc(tr("Move down","下移"))+'" '+(index===total-1?'disabled':'')+'>↓</button></span></div>';
    }
    return '<a class="accounts-row" href="'+esc(linkFor("account-details",{account:a.id}))+'">'+
      avatar(a.type)+info+chevron+'</a>';
  };
  const fields = (items) => '<div class="accounts-field-demo">'+items.map(item =>
    '<div class="settings-detail-field"><label>'+esc(tr(item.en,item.zh))+'</label>'+
    '<input type="text" disabled aria-disabled="true" autocomplete="off" placeholder="'+
    esc(tr(item.example,item.exampleZh || item.example))+'"></div>').join("")+'</div>';
  const actionLink = (en,cn,target,extra={}) =>
    '<a class="settings-detail-cta" href="'+esc(linkFor(target,extra))+'">'+esc(tr(en,cn))+'</a>';
  const backLink = (en,cn,target,extra={}) =>
    '<a class="settings-detail-cta is-muted" href="'+esc(linkFor(target,extra))+'">'+esc(tr(en,cn))+'</a>';
  const render = () => {
    const title=titles[page];
    heading.textContent=tr(title[0],title[1]);
    document.title="Fresnica — "+heading.textContent;
    if(page==="accounts") back.href="./mobile-settings.html";
    else if(page==="account-details"||page==="account-sort") back.href=currentLink;
    else if(page==="add-account") back.href=fromHome?"./mobile-demo-1-1.html":currentLink;
    else if(page==="account-review") {
      const prior=methods[rawMethod]?.view||"add-account";
      back.href=linkFor(prior);
    } else if(page==="account-recovery") back.href=linkFor("account-details",{account:account.id});
    else back.href=linkFor("add-account");
    back.setAttribute("aria-label",tr("Back","返回"));
    headerActions.replaceChildren();
    if(page==="accounts"){
      const edit=document.createElement("a");
      edit.className="accounts-top-action";
      edit.href=linkFor("account-sort");
      edit.textContent=tr("Reorder","排序");
      edit.setAttribute("aria-label",tr("Reorder account list","排列账户"));
      headerActions.appendChild(edit);
    }
    let html="";
    switch(page){
      case "accounts": {
        const visible=accounts.filter(a=>!a.hidden);
        const hidden=accounts.filter(a=>a.hidden);
        html=section("YOUR ACCOUNTS","我的账户",
          visible.length?visible.map((a,i)=>listRow(a,false,i,visible.length)).join(""):
          '<div class="settings-detail-empty">'+esc(tr("No accounts","暂无账户"))+'</div>')+
          (hidden.length?section("HIDDEN","已隐藏",hidden.map((a,i)=>listRow(a,false,i,hidden.length)).join("")):"")+
          actionLink("Add account","添加账户","add-account");
        break;
      }
      case "account-sort": {
        html=section("ACCOUNT ORDER","账户顺序",
          '<div data-accounts-sort-preview>'+displayAccounts.map((a,i)=>listRow(a,true,i,displayAccounts.length)).join("")+'</div>')+
          backLink("Done","完成","accounts")+
          note("Reorder preview only. No account order is saved.","仅预览排序效果，不会保存账户顺序。");
        break;
      }
      case "account-details": {
        if(!account){html=section("ACCOUNT","账户",'<div class="settings-detail-empty">'+esc(tr("Account not available","账户不可用"))+'</div>');break;}
        html='<div class="accounts-hero">'+avatar(account.type)+'<h2>'+esc(account.name)+'</h2>'+
          '<span class="accounts-row-subtitle">'+esc(displayAddress(account))+'</span>'+
          '<div class="accounts-row-tags">'+
          (account.id===activeId?tag("Current","当前",true):"")+
          (account.hidden?tag("Hidden","已隐藏"):"")+
          (account.type==="watch-only"?tag("Watch-only","只读"):tag("Example","示例"))+
          '</div></div>'+
          section("ACCOUNT INFORMATION","账户信息",
            pair("Address","地址",displayAddress(account))+
            pair("Type","类型",accountType(account))+
            pair("Network","网络","Stellar Mainnet"))+
          section("MANAGE","管理",
            buttonRow("Rename","重命名","pencil","rename")+
            buttonRow("Copy address","复制地址","copy","copy")+
            (account.type==="watch-only"?"":row("Recovery material","恢复材料","shield",
              linkFor("account-recovery",{account:account.id})))+
            buttonRow(account.hidden?"Show account":"Hide account",
              account.hidden?"显示账户":"隐藏账户","hide","toggle-visibility")+
            buttonRow("Remove local record","移除本地记录","trash","remove"))+
          note("Account actions here preview only; no on-chain or local records are changed.",
            "此页面仅演示账户操作，不会修改链上账户或本地记录。");
        break;
      }
      case "add-account": {
        html=section("ACCOUNT TYPE","账户类型",
          Object.entries(methods).map(([method,definition])=>
            row(definition.name[0],definition.name[1],definition.icon,
              linkFor(definition.view),definition.detail)).join(""))+
          note("Only the page flow is shown. No account data or keys are created or imported.",
            "仅展示页面流程，不会创建或导入真实账户和密钥。");
        break;
      }
      case "account-create": {
        html=section("NEW ACCOUNT","新账户",fields([
          {en:"Account name",zh:"账户名称",example:"My wallet",exampleZh:"我的钱包"}
        ])+pair("Network","网络","Stellar Mainnet"))+
          section("SECURITY","安全",
            '<div class="accounts-flow-alert"><b>'+esc(tr("Protected by an app passphrase","使用应用口令保护"))+'</b>'+
            esc(tr("Key creation and backup are performed only in the native app.",
              "账户密钥创建及备份仅在原生 App 内进行。"))+'</div>')+
          actionLink("Preview next step","预览下一步","account-review",{method:"create"});
        break;
      }
      case "account-import-phrase": {
        html=section("RECOVERY PHRASE","恢复短语",fields([
          {en:"Recovery phrase",zh:"助记词",example:"Protected entry — native app only",exampleZh:"受保护输入 — 仅原生 App"},
          {en:"Account name",zh:"账户名称",example:"Imported account",exampleZh:"导入账户"}
        ]))+
          note("Never enter a recovery phrase in this UI preview.","不要在网页预览中输入真实助记词。")+
          actionLink("Preview next step","预览下一步","account-review",{method:"phrase"});
        break;
      }
      case "account-import-secret": {
        html=section("SECRET KEY","私钥",fields([
          {en:"Secret key",zh:"私钥",example:"Protected entry — native app only",exampleZh:"受保护输入 — 仅原生 App"},
          {en:"Account name",zh:"账户名称",example:"Imported account",exampleZh:"导入账户"}
        ]))+
          note("Never enter a private key in this UI preview.","不要在网页预览中输入真实私钥。")+
          actionLink("Preview next step","预览下一步","account-review",{method:"secret"});
        break;
      }
      case "account-hd": {
        html=section("DERIVATION","派生信息",
          '<div class="accounts-field-demo">'+
          '<div class="settings-detail-field"><label>'+esc(tr("Recovery source","恢复来源"))+
          '</label><select disabled aria-disabled="true"><option>'+esc(tr("Native app signer","原生 App 签名者"))+'</option></select></div>'+
          '<div class="settings-detail-field"><label>'+esc(tr("Account index","账户索引"))+
          '</label><input type="text" disabled value="0"></div></div>'+
          pair("SEP-5 path","SEP-5 路径","m/44'/148'/0'"))+
          note("An eligible, backed-up recovery source is required in the native app.",
            "原生 App 中需具有符合条件且已备份的恢复来源。")+
          actionLink("Preview next step","预览下一步","account-review",{method:"hd"});
        break;
      }
      case "account-watch-only": {
        html=section("PUBLIC ACCOUNT","公开账户",fields([
          {en:"G / C public address",zh:"G / C 公开地址",example:"G… / C…"},
          {en:"Account name",zh:"账户名称",example:"Watch account",exampleZh:"只读账户"}
        ]))+
          note("A watch-only account can be viewed but cannot sign transactions.",
            "只读账户仅供查看，不能签名交易。")+
          actionLink("Preview next step","预览下一步","account-review",{method:"watch"});
        break;
      }
      case "account-review": {
        const method=methods[rawMethod]||methods.create;
        html=section("REVIEW","确认信息",
          pair("Method","方式",tr(method.name[0],method.name[1]))+
          pair("Network","网络","Stellar Mainnet")+
          pair("Status","状态",tr("UI preview only","仅界面预览")))+
          '<div class="accounts-flow-alert" style="margin-top:14px"><b>'+
          esc(tr("No account was added","未新增任何账户"))+'</b>'+
          esc(tr("This page demonstrates the final step of the account flow. Sensitive operations remain native-app only.",
            "本页展示账户流程的最终步骤；敏感操作仅能在原生 App 中执行。"))+'</div>'+
          backLink("Back to Accounts","返回账户","accounts");
        break;
      }
      case "account-recovery": {
        html=section("RECOVERY MATERIAL","恢复材料",
          '<div class="accounts-field-demo">'+
          '<div class="accounts-flow-alert"><b>'+
          esc(tr("Protected action","受保护操作"))+'</b>'+
          esc(tr("A native wallet requires re-authentication before displaying recovery material.",
            "原生钱包必须重新认证，才能展示恢复材料。"))+'</div>'+
          '<div class="settings-detail-field"><label>'+esc(tr("Current app passphrase","当前应用口令"))+
          '</label><input type="password" disabled aria-disabled="true" placeholder="'+
          esc(tr("Native app only","仅原生 App"))+'"></div></div>')+
          note("No phrase, key or passphrase is requested or displayed in this preview.",
            "网页预览不会请求或显示助记词、私钥和口令。");
        break;
      }
    }
    content.innerHTML=html;
  };
  const openSheet = (en,cn,body,source) => {
    openedBy=source||document.activeElement;
    sheetTitle.textContent=tr(en,cn);
    sheetBody.innerHTML=body;
    overlay.hidden=false;
    (sheetBody.querySelector("input:not([disabled])")||sheetBody.querySelector("button")||closeButton).focus();
  };
  const closeSheet = () => {
    overlay.hidden=true;
    sheetBody.replaceChildren();
    if(openedBy?.isConnected)openedBy.focus();
    openedBy=null;
  };
  const sheetButtons = () => '<div class="settings-detail-dialog-actions">'+
    '<button type="button" data-dialog-close class="secondary">'+esc(tr("Cancel","取消"))+'</button>'+
    '<button type="button" data-dialog-preview>'+esc(tr("Preview confirmation","预览确认"))+'</button></div>';
  const notice = (en,cn) => {
    toast.textContent=tr(en,cn);toast.hidden=false;
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.hidden=true;},2300);
  };
  content.addEventListener("click",event=>{
    const mover=event.target.closest("[data-visual-move]");
    if(mover){
      const i=displayAccounts.findIndex(a=>a.id===mover.dataset.id);
      const next=i+(mover.dataset.visualMove==="up"?-1:1);
      if(i<0||next<0||next>=displayAccounts.length)return;
      [displayAccounts[i],displayAccounts[next]]=[displayAccounts[next],displayAccounts[i]];
      const list=content.querySelector("[data-accounts-sort-preview]");
      if(list)list.innerHTML=displayAccounts.map((a,n)=>listRow(a,true,n,displayAccounts.length)).join("");
      return;
    }
    const control=event.target.closest("[data-account-action]");
    if(!control||page!=="account-details"||!account)return;
    const key=control.dataset.accountAction;
    if(key==="copy"){
      openSheet("Copy address","复制地址",
        '<p class="accounts-sheet-section">'+esc(tr("Public addresses can be copied in the native app. This UI preview does not access the clipboard.",
          "原生 App 可复制公开地址。本网页预览不会访问剪贴板。"))+'</p>'+
        '<button type="button" class="settings-detail-cta is-muted" data-dialog-close>'+
        esc(tr("Close","关闭"))+'</button>',control);return;
    }
    if(key==="rename"){
      openSheet("Rename account","重命名账户",
        '<div class="settings-detail-field"><label for="accounts-rename">'+esc(tr("Account name","账户名称"))+
        '</label><input id="accounts-rename" type="text" maxlength="36" value="'+esc(account.name)+'" autocomplete="off"></div>'+
        sheetButtons(),control);return;
    }
    if(key==="toggle-visibility"){
      openSheet(account.hidden?"Show account":"Hide account",account.hidden?"显示账户":"隐藏账户",
        '<p class="accounts-sheet-section">'+esc(tr(
          account.hidden?"The account will appear in the account list again.":"The account will be removed from the visible list without deleting it.",
          account.hidden?"此账户将重新出现在可见列表。":"此账户将从可见列表隐藏，但不会删除。"))+
        '</p>'+sheetButtons(),control);return;
    }
    if(key==="remove"){
      openSheet("Remove local record","移除本地记录",
        '<div class="accounts-flow-alert"><b>'+esc(tr("The on-chain account will not be deleted","链上账户不会被删除"))+'</b>'+
        esc(tr("The native app may require additional checks before removing a local account record.",
          "原生 App 移除本地账户记录前可能还需进行安全检查。"))+'</div>'+
        sheetButtons(),control);
    }
  });
  sheetBody.addEventListener("click",event=>{
    if(event.target.closest("[data-dialog-close]")){closeSheet();return;}
    if(event.target.closest("[data-dialog-preview]")){
      sheetBody.innerHTML='<div class="accounts-flow-alert"><b>'+
        esc(tr("Preview only","仅界面预览"))+'</b>'+
        esc(tr("No account information was changed. An actual operation would show a result or an error here.",
          "未修改任何账户信息。真实操作将在此展示结果或错误状态。"))+'</div>'+
        '<button type="button" class="settings-detail-cta is-muted" data-dialog-close>'+
        esc(tr("Close","关闭"))+'</button>';
      sheetBody.querySelector("button")?.focus();
    }
  });
  closeButton.addEventListener("click",closeSheet);
  overlay.addEventListener("click",event=>{if(event.target===overlay)closeSheet();});
  overlay.addEventListener("keydown",event=>{
    if(overlay.hidden)return;
    if(event.key==="Escape"){event.preventDefault();event.stopPropagation();closeSheet();return;}
    if(event.key!=="Tab")return;
    const focusable=[...overlay.querySelectorAll("button:not([disabled]),input:not([disabled])")];
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  });
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!overlay.hidden){closeSheet();}});
  document.addEventListener("click",event=>{
    if(!event.target.closest("[data-gallery-language]"))return;
    queueMicrotask(render);
  });
  window.addEventListener("load",()=>{document.title="Fresnica — "+heading.textContent;});
  render();
})();
