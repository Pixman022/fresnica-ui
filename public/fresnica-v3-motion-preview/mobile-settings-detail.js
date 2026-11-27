/* Fresnica V3 Settings detail catalogue. No signer, permissions, or network writes. */
(() => {
  const phone = document.querySelector(".settings-detail-phone");
  if (!phone) return;
  const state = window.FresnicaPreviewState;
  if (!state) return;
  const content = phone.querySelector("#settings-detail-content");
  const heading = phone.querySelector("#settings-detail-title");
  const back = phone.querySelector(".secondary-back");
  const overlay = phone.querySelector(".settings-detail-sheet-overlay");
  const sheet = overlay.querySelector(".settings-detail-sheet");
  const sheetTitle = sheet.querySelector("#settings-detail-dialog-title");
  const sheetBody = sheet.querySelector("#settings-detail-dialog-body");
  const closeButton = sheet.querySelector(".settings-detail-sheet-close");
  const toast = phone.querySelector(".settings-detail-toast");
  const params = new URLSearchParams(location.search);
  const views = ["accounts","contacts","general","language","appearance","advanced","logs",
    "security","recovery","passphrase","privacy","connected","lock","support","terms","about"];
  const view = views.includes(params.get("view")) ? params.get("view") : "general";
  const parents = {language:"general",appearance:"general",logs:"advanced",recovery:"security",passphrase:"security"};
  const titles = {
    accounts:["Accounts","账户"],contacts:["Address book","通讯录"],
    general:["General","通用"],language:["Language","语言"],appearance:["Appearance","外观"],
    advanced:["Advanced","高级"],logs:["Session logs","会话日志"],
    security:["Security","安全"],recovery:["Recovery material","恢复材料"],
    passphrase:["Change passphrase","修改应用口令"],privacy:["Privacy","隐私"],
    connected:["Connected dApps","已连接的应用"],lock:["Lock wallet","锁定钱包"],
    support:["Support","问题与支持"],terms:["Terms & Conditions","条款与条件"],
    about:["About Fresnica","关于 Fresnica"]
  };
  const icons = {
    wallet:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 10h18M16 15h2"/>',
    book:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18M11 9h6"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c6 6 6 12 0 18M12 3c-6 6-6 12 0 18"/>',
    palette:'<circle cx="12" cy="12" r="9"/><circle cx="8" cy="9" r="1"/><circle cx="15" cy="8" r="1"/><circle cx="7" cy="15" r="1"/><path d="M16 18c-2 0-3-3-1-4"/>',
    sliders:'<path d="M4 7h9m4 0h3M4 17h3m4 0h9M13 4v6M7 14v6"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    link:'<path d="M10 13a5 5 0 0 0 7.5.4l3-3a5 5 0 0 0-7-7l-2.2 2.2"/><path d="M14 11a5 5 0 0 0-7.5-.4l-3 3a5 5 0 0 0 7 7l2.2-2.2"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    document:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h6"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1.5 1-1.5 2-1.5 3M12 17h.01"/>',
    network:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c6 6 6 12 0 18M12 3c-6 6-6 12 0 18"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    finger:'<path d="M8 13V9a4 4 0 0 1 8 0v5M5 11V9a7 7 0 0 1 14 0v3M12 9v8M9 16c0 2 1 4 3 5m3-5c0 2-1 4-3 5"/>'
  };
  const key = "fresnica-settings-demo-v2";
  const init = {currency:"USD",haptics:true,separators:true,reserve:true,
    lockTimeout:"1 minute",tokenImages:true,avatars:false,developer:false,themeMode:null,palette:"#0f7954"};
  const contactKey = "fresnica-settings-demo-contacts";
  const logKey = "fresnica-settings-demo-events";
  const read = (k, defaultValue) => {
    try { const value = JSON.parse(sessionStorage.getItem(k) || "null"); return value ?? defaultValue; }
    catch { return defaultValue; }
  };
  const store = (k, value) => { try { sessionStorage.setItem(k,JSON.stringify(value)); } catch (_) {} };
  const readPreference = () => {
    try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; }
  };
  const settings = {...init,...readPreference()};
  delete settings.activityShortcut;
  const saveSettings = () => {
    try { localStorage.setItem(key,JSON.stringify(settings)); } catch (_) {}
  };
  const lang = () => {
    try { return localStorage.getItem("fresnica-gallery-language")==="zh" ? "zh" : "en"; }
    catch { return "en"; }
  };
  const zh = () => lang()==="zh";
  const tr = (en,cn) => zh() ? cn : en;
  const escape = value => String(value).replace(/[&<>"']/g,ch =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const address = value => value && value!=="—" ? value : tr("No on-chain address","无链上地址");
  const mark = name => '<svg viewBox="0 0 24 24" aria-hidden="true">' + (icons[name] || icons.info) + '</svg>';
  const to = target => "./mobile-settings-detail.html?view=" + encodeURIComponent(target);
  const section = (en,cn,body) => '<h2 class="settings-detail-section-title">' +
    escape(tr(en,cn)) + '</h2><section class="settings-detail-card">' + body + '</section>';
  const note = (en,cn) => '<p class="settings-detail-note">' + escape(tr(en,cn)) + '</p>';
  const action = (en,cn,id,muted=false) => '<button type="button" class="settings-detail-cta' +
    (muted?' is-muted':'') + '" data-action="' + escape(id) + '">' + escape(tr(en,cn)) + '</button>';
  const row = (en,cn,icon,where,opt={}) => {
    const href = where ? ' href="' + escape(to(where)) + '"' : '';
    const actionId = opt.action ? ' data-action="' + escape(opt.action) + '"' : '';
    const tag = href ? 'a' : 'button';
    const value = opt.value ? '<span class="settings-detail-row-value">' + escape(opt.value) + '</span>' : '';
    const desc = opt.desc ? '<small>' + escape(tr(opt.desc[0],opt.desc[1])) + '</small>' : '';
    return '<'+tag+' class="settings-detail-row"'+href+(href?'':' type="button"')+actionId+'>' +
      '<span class="settings-detail-row-icon">'+mark(icon)+'</span>' +
      '<span class="settings-detail-row-copy"><b>'+escape(tr(en,cn))+'</b>'+desc+'</span>' +value+
      '<svg class="settings-detail-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></'+tag+'>';
  };
  const toggleRow = (en,cn,keyName,desc) => {
    return '<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>' + escape(tr(en,cn)) +
      '</b>' + (desc ? '<small>'+escape(tr(desc[0],desc[1]))+'</small>' : '') + '</span>' +
      '<button type="button" class="settings-detail-switch" role="switch" data-toggle="'+escape(keyName)+
      '" aria-label="'+escape(tr(en,cn))+'" aria-checked="'+String(!!settings[keyName])+'"></button></div>';
  };
  const option = (en,cn,kind,value,selected) =>
    '<button type="button" class="settings-detail-row" data-pick="'+escape(kind)+'" data-value="'+escape(value)+
    '" aria-pressed="'+String(selected===value)+'"><span class="settings-detail-row-copy"><b>'+
    escape(tr(en,cn))+'</b></span><span class="settings-detail-check">'+
    (selected===value?'✓':'')+'</span></button>';
  let accounts = state.accounts();
  const saveAccounts = () => {
    if (!state.saveAccounts(accounts)) return false;
    accounts = state.accounts();
    return true;
  };
  let contacts = read(contactKey,[]);
  let events = read(logKey,[]);
  let dialog = null;
  let trigger = null;
  let toastTimer;
  const displayToast = (en,cn) => {
    toast.textContent = tr(en,cn);
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{toast.hidden=true;},2200);
  };
  const logEvent = (eventName) => {
    events = [{time:new Date().toLocaleTimeString(),event:eventName},...events].slice(0,30);
    store(logKey,events);
  };
  const currentTheme = () => {
    try { return localStorage.getItem("fresnica-gallery-theme") || "light"; }
    catch { return "light"; }
  };
  if(!settings.themeMode)settings.themeMode=currentTheme();
  const chooseTheme = mode => {
    settings.themeMode=mode;
    saveSettings();
    window.dispatchEvent(new Event("fresnica-preview-theme-change"));
  };
  const openSheet = (mode,titleEn,titleZh,html,source) => {
    dialog=mode;trigger=source || document.activeElement;
    sheetTitle.textContent=tr(titleEn,titleZh);
    sheetBody.innerHTML=html;
    overlay.hidden=false;
    (sheetBody.querySelector("input") || sheetBody.querySelector("button") || closeButton).focus();
  };
  const closeSheet = (restore=true) => {
    overlay.hidden=true;dialog=null;sheetBody.replaceChildren();
    if(restore&&trigger?.isConnected)trigger.focus();
    trigger=null;
  };
  const sheetActions = (confirmEn,confirmZh,mode) =>
    '<div class="settings-detail-dialog-actions"><button type="button" class="secondary" data-dismiss>'+
    escape(tr("Cancel","取消"))+'</button><button type="button" data-confirm="'+escape(mode)+'">'+
    escape(tr(confirmEn,confirmZh))+'</button></div>';
  const textField = (name,labelEn,labelZh,value="",type="text") =>
    '<div class="settings-detail-field"><label for="settings-field-'+escape(name)+'">'+
    escape(tr(labelEn,labelZh))+'</label><input id="settings-field-'+escape(name)+'" name="'+escape(name)+
    '" type="'+escape(type)+'" autocomplete="off" maxlength="120" value="'+escape(value)+'"></div>';
  const accountList = () => {
    const visible = accounts.filter(a => !a.hidden);
    const hidden = accounts.filter(a => a.hidden);
    const format = (a,i,canMove) => '<div class="settings-detail-account">' +
      '<div class="settings-detail-account-title"><b>'+escape(a.name)+'</b>'+
      (state.activeAccount()?.id===a.id ? '<span class="settings-detail-chip">'+escape(tr("Current","当前"))+'</span>' : '')+
      (a.type==="watch-only" ? '<span class="settings-detail-chip">'+escape(tr("Watch-only","只读"))+'</span>':'')+'</div>'+
      '<small class="settings-detail-address">'+escape(address(a.address))+'</small>'+
      '<div class="settings-detail-inline">'+
      (a.hidden ? '<button class="settings-detail-mini" data-action="restore-account" data-id="'+escape(a.id)+'">'+escape(tr("Restore","恢复"))+'</button>' :
      '<button class="settings-detail-mini" data-action="select-account" data-id="'+escape(a.id)+'">'+escape(tr("Select","切换"))+'</button>'+
      (canMove ? '<button class="settings-detail-mini" data-account-move="up" data-id="'+escape(a.id)+'" '+(i===0?'disabled':'')+' aria-label="'+escape(tr("Move up","上移"))+'">↑</button>'+
      '<button class="settings-detail-mini" data-account-move="down" data-id="'+escape(a.id)+'" '+(i===visible.length-1?'disabled':'')+' aria-label="'+escape(tr("Move down","下移"))+'">↓</button>' : '')+
      '<button class="settings-detail-mini" data-action="hide-account" data-id="'+escape(a.id)+'" '+(visible.length===1?'disabled':'')+'>'+escape(tr("Hide","隐藏"))+'</button>')+
      '<button class="settings-detail-mini" data-action="account-detail" data-id="'+escape(a.id)+'">'+escape(tr("Details","详情"))+'</button>'+
      '<button class="settings-detail-mini" data-action="edit-account" data-id="'+escape(a.id)+'">'+escape(tr("Rename","重命名"))+'</button>'+
      '<button class="settings-detail-mini danger" data-action="delete-account" data-id="'+escape(a.id)+'" '+(!a.hidden&&visible.length===1?'disabled':'')+'>'+escape(tr("Remove","移除本地记录"))+'</button></div></div>';
    return visible.map((a,i)=>format(a,i,true)).join("")+
      (hidden.length ? '<div class="settings-detail-account"><strong>'+escape(tr("Hidden accounts","已隐藏账户"))+'</strong></div>'+
        hidden.map((a,i)=>format(a,i,false)).join("") : "");
  };
  const contactList = (query="") => {
    const q=query.trim().toLowerCase();
    const matches=contacts.filter(c=>[c.name,c.address,c.memo].some(v=>String(v||"").toLowerCase().includes(q)));
    if(!matches.length)return '<div class="settings-detail-empty"><b>'+
      escape(tr(q?"No matching contacts":"No contacts yet",q?"没有匹配的联系人":"暂无联系人"))+'</b>'+
      escape(tr("Contact names are local labels, not verified identities.","联系人名称只是本地标签，并非已验证的身份。"))+'</div>';
    return matches.map(c=>'<div class="settings-detail-account"><div class="settings-detail-account-title"><b>'+
      escape(c.name)+'</b></div><small class="settings-detail-address">'+escape(c.address)+'</small>'+
      (c.memo?'<small class="settings-detail-address">Memo: '+escape(c.memo)+'</small>':"")+
      '<div class="settings-detail-inline"><button class="settings-detail-mini" data-action="edit-contact" data-id="'+escape(c.id)+'">'+
      escape(tr("Edit","编辑"))+'</button><button class="settings-detail-mini danger" data-action="delete-contact" data-id="'+escape(c.id)+'">'+
      escape(tr("Delete","删除"))+'</button></div></div>').join("");
  };
  const connectedList = () => {
    const items=state.connections();
    if(!items.length)return '<div class="settings-detail-empty"><b>'+
      escape(tr("No preview connections","暂无示例连接"))+'</b>'+
      escape(tr("Connections saved in the dApps preview will appear here.","在 dApps 预览中保存的连接将显示在此。"))+'</div>';
    return items.map(c=>'<div class="settings-detail-account"><div class="settings-detail-account-title"><b>'+
      escape(c.name)+'</b><span class="settings-detail-chip">'+escape(tr("Preview only","仅示例"))+'</span></div>'+
      '<small class="settings-detail-address">'+escape(c.origin)+'</small>'+
      '<div class="settings-detail-inline"><button type="button" class="settings-detail-mini danger" data-action="disconnect-app" data-origin="'+escape(c.origin)+'">'+
      escape(tr("Disconnect preview","断开示例连接"))+'</button></div></div>').join("");
  };
  const protectedField = (en,cn) => '<div class="settings-detail-field"><label>' + escape(tr(en,cn)) +
    '</label><input type="password" placeholder="' + escape(tr("Native app only","仅原生应用")) +
    '" autocomplete="off" disabled aria-disabled="true"></div>';
  const render = () => {
    const title=titles[view];heading.textContent=tr(title[0],title[1]);
    back.href=parents[view]?to(parents[view]):"./mobile-settings.html";
    back.setAttribute("aria-label",tr("Back","返回"));
    document.title="Fresnica — "+heading.textContent;
    let html="";
    switch(view){
      case "accounts":
        html=section("ACCOUNTS","账户",accountList())+
          action("Add account","添加账户","add-account")+
          note("Shared sample accounts with the Home wallet switch. Hiding or removing a local preview record never changes an on-chain account.",
            "与首页的钱包切换使用同一示例账户列表。隐藏或移除本地记录不会改变链上账户。");
        break;
      case "contacts":
        html='<div class="settings-detail-field"><label for="settings-contacts-search">'+
          escape(tr("Search contacts","搜索联系人"))+'</label><input id="settings-contacts-search" type="search" autocomplete="off" placeholder="'+
          escape(tr("Name, G address or Memo","名称、G 地址或 Memo"))+'"></div>'+
          section("ADDRESS BOOK","通讯录",'<div data-contacts-results>'+contactList()+'</div>')+
          action("Add contact","添加联系人","add-contact")+
          note("Ordinary payment contacts use Stellar G addresses and optional Memo. C addresses are handled only in supported contract scenarios. Local labels are not identity verification.",
            "普通收款联系人使用 Stellar G 地址和可选 Memo；C 地址仅用于支持的合约场景。本地标签并非身份验证。");
        break;
      case "general":
        html=section("DISPLAY","显示",
          row("Language","语言","globe","language",{value:zh()?"中文":"English"})+
          row("Appearance","外观","palette","appearance",{value:tr(
            {light:"Light",dark:"Dark",system:"System",image:"Image"}[settings.themeMode]||"Light",
            {light:"浅色",dark:"深色",system:"跟随系统",image:"图片主题"}[settings.themeMode]||"浅色")})+
          row("Display currency","显示法币","wallet",null,{action:"currency",value:settings.currency}))+
          section("PREFERENCES","偏好",
          toggleRow("Haptic feedback","触感反馈","haptics")+
          toggleRow("Number separators","数字分隔符","separators")+
          toggleRow("Show reserve","显示储备金","reserve"))+
          note("Preview preferences only. Currency estimates in the native product currently apply to XLM.",
            "仅更改界面示例偏好。原生产品中的法币参考估值目前仅覆盖 XLM。");
        break;
      case "language":
        html=section("LANGUAGE","语言",option("English","英语","language","en",lang())+
          option("简体中文","简体中文","language","zh",lang()))+
          note("The gallery supports English and Chinese. Some native-app translations may fall back to English.",
            "界面示例支持中英文。原生应用的部分翻译可能回退到英文。");
        break;
      case "appearance":
        html=section("THEME","主题",
          option("Light","浅色","theme","light",settings.themeMode)+
          option("Dark","深色","theme","dark",settings.themeMode)+
          option("System","跟随系统","theme","system",settings.themeMode)+
          option("Image theme","图片主题","theme","image",settings.themeMode))+
          (settings.themeMode==="image" ?
           section("LOCAL IMAGE COLOR","本地图片颜色",
             '<div style="padding:12px 13px"><span class="settings-detail-swatch" aria-hidden="true"></span>'+
             '<span class="settings-detail-row-value" style="margin-left:8px">'+escape(settings.palette)+'</span>'+
             '<div class="settings-detail-field"><label for="settings-image">'+escape(tr("Choose an image","选择图片"))+
             '</label><input id="settings-image" type="file" accept="image/*"></div></div>')+
           note("Images are processed locally (up to 10 MB); only a sampled preview color is saved. The source image is not uploaded or stored.",
             "图片仅在本地处理（最多 10 MB），只保存示例颜色；不上传或保存原始图片。") : "");
        break;
      case "advanced":
        html=section("NETWORK","网络",
          '<a class="settings-detail-row" href="./mobile-network-nodes.html">'+
          '<span class="settings-detail-row-icon">'+mark("network")+'</span>'+
          '<span class="settings-detail-row-copy"><b>'+escape(tr("Network & Nodes","网络与节点"))+
          '</b></span><span class="settings-detail-row-value">Stellar</span>'+
          '<svg class="settings-detail-chevron" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></a>')+
          section("DIAGNOSTICS","诊断",toggleRow("Developer mode","开发者模式","developer",
          ["Preview-only diagnostic controls","仅控制示例诊断工具"])+
          row("Session logs","会话日志","list","logs",{desc:["Redacted demo events","脱敏示例事件"]}))+
          section("VERSION","版本",'<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>'+
            escape(tr("UI preview","界面预览"))+'</b></span><span class="settings-detail-row-value">1.1</span></div>')+
          note("Developer controls do not change the Stellar network or enable signing.",
            "开发者选项不会切换真实 Stellar 网络，也不会启用签名。");
        break;
      case "logs":
        html=section("SESSION EVENTS","会话事件",!settings.developer ?
          '<div class="settings-detail-empty">'+escape(tr("Enable Developer mode in Advanced to view demo events.",
            "请先在高级设置中启用开发者模式，才能查看示例日志。"))+'</div>' :
          events.length ? events.map(e=>'<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>'+
            escape(e.event)+'</b></span><span class="settings-detail-row-value">'+escape(e.time)+'</span></div>').join("") :
          '<div class="settings-detail-empty">'+escape(tr("No demo events recorded","暂无示例事件"))+'</div>')+
          (settings.developer?action("Export demo events","导出示例事件","export-log")+
          action("Clear demo events","清空示例事件","clear-log",true):"")+
          note("These events are UI-only and do not include real wallet, network, or credential logs.",
            "这些仅是界面事件，不包含真实钱包、网络或凭据日志。");
        break;
      case "security":
        html=section("APP ACCESS","应用访问",
          '<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>'+
          escape(tr("Use biometrics","生物识别解锁"))+'</b><small>'+
          escape(tr("Native device authentication only","仅原生设备认证可用"))+
          '</small></span><span class="settings-detail-row-value">'+escape(tr("Unavailable","不可用"))+'</span></div>'+
          row("Lock after inactivity","离开后锁定","clock",null,{action:"lock-timeout",value:settings.lockTimeout})+
          '<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>'+
          escape(tr("Screen capture protection","截屏保护"))+'</b><small>'+
          escape(tr("Android native setting","Android 原生设置"))+
          '</small></span><span class="settings-detail-row-value">'+escape(tr("Native only","仅原生"))+'</span></div>')+
          section("RECOVERY","恢复管理",
          row("Change passphrase","修改应用口令","lock","passphrase")+
          row("Recovery material","恢复材料","shield","recovery"))+
          note("Biometrics unlock the app only; sensitive signer operations require the native app passphrase. This preview never collects credentials.",
            "生物识别只用于应用解锁；敏感签名操作需要原生应用口令。本预览不会收集凭据。");
        break;
      case "recovery":
        html=section("PROTECTED RECOVERY","受保护的恢复流程",
          '<div style="padding:12px 13px"><p class="settings-detail-safe-copy">'+escape(tr(
            "The native app requires fresh authentication before a time-limited reveal. Anyone holding the recovery material may control the funds.",
            "原生应用要求重新认证后才能限时查看恢复材料。持有恢复材料的人可能控制账户资金。"))+'</p>'+
          protectedField("Current app passphrase","当前应用口令")+
          '<button type="button" class="settings-detail-cta" disabled>'+escape(tr("Reveal recovery material","显示恢复材料"))+'</button>'+
          '<div class="settings-detail-inline"><button type="button" class="settings-detail-mini" disabled>'+
          escape(tr("Copy","复制"))+'</button><button type="button" class="settings-detail-mini" disabled>'+
          escape(tr("Hide and clear","隐藏并清除"))+'</button></div></div>')+
          note("No sensitive material is loaded in this web preview. Never enter a seed phrase or private key here.",
            "此网页预览不会载入任何敏感材料。请勿在此输入助记词或私钥。");
        break;
      case "passphrase":
        html=section("CHANGE PASSPHRASE","修改应用口令",
          '<div style="padding:12px 13px"><p class="settings-detail-safe-copy">'+escape(tr(
            "The native app verifies the current passphrase and re-protects all supported local signers. Use a new passphrase of at least 15 characters.",
            "原生应用会验证当前口令并重新保护所有支持的本地签名者。新口令建议不少于 15 个字符。"))+'</p>'+
          protectedField("Current app passphrase","当前应用口令")+
          protectedField("New passphrase","新口令")+
          protectedField("Confirm new passphrase","确认新口令")+
          '<button type="button" class="settings-detail-cta" disabled>'+
          escape(tr("Change passphrase","修改口令"))+'</button></div>')+
          note("All inputs are disabled. This preview does not accept, store, or process real wallet credentials.",
            "所有输入框均已禁用。本预览不会接收、保存或处理真实钱包凭据。");
        break;
      case "privacy":
        html=section("EXTERNAL MEDIA","外部媒体",
          toggleRow("Public token icons","公共代币图标","tokenImages",
            ["May request images from external providers","可能向外部服务请求图片"])+
          toggleRow("Address avatars","地址头像","avatars",
            ["May share a public address with a third party","可能向第三方发送公开地址"]))+
          note("Turning on address avatars requires confirmation. No third-party requests occur in this preview.",
            "启用地址头像需要单独确认。此预览不会发出第三方请求。");
        break;
      case "connected":
        html=section("PREVIEW CONNECTIONS","示例连接",connectedList())+
          '<a class="settings-detail-cta is-muted" href="./mobile-dapps.html">'+escape(tr("Explore dApps","浏览应用"))+'</a>'+
          note("This list shares the dApps preview state. Disconnecting a preview record never revokes real wallet permissions. Entries are Stellar Mainnet demos.",
            "此列表与 dApps 预览共用数据；断开示例记录不会撤销真实钱包授权，仅针对 Stellar 主网演示。");
        break;
      case "lock":
        html=section("LOCK WALLET","锁定钱包",
          '<div class="settings-detail-empty"><b>'+escape(tr("Wallet lock preview","钱包锁定示例"))+'</b>'+
          escape(tr("Lock now closes access to the wallet in the native app. This web sample has no unlocked vault.",
            "原生应用的立即锁定会关闭钱包访问。本网页示例没有已解锁的密钥库。"))+'</div>')+
          action("Preview lock screen","预览锁定状态","show-lock");
        break;
      case "support":
        html=section("HELP","帮助",
          '<a class="settings-detail-row" href="./index.html#v3-clarity" target="_blank" rel="noopener noreferrer"><span class="settings-detail-row-icon">'+mark("help")+
          '</span><span class="settings-detail-row-copy"><b>'+escape(tr("Frequently asked questions","常见问题"))+
          '</b></span><svg class="settings-detail-chevron" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></a>')+
          note("A dedicated support service is not configured in this prototype. The FAQ is available on the project site.",
            "本原型尚未接入专属客服服务，可通过项目网站查看常见问题。");
        break;
      case "terms":
        html=section("TERMS & CONDITIONS","条款与条件",
          '<div style="padding:15px 13px"><b style="font-size:12px">'+
          escape(tr("Document pending final approval","文档尚待最终批准"))+
          '</b><p class="settings-detail-safe-copy">'+
          escape(tr("This preview does not include approved legal terms. The native app provides a read-only document viewer when the relevant text is available. Viewing a document is not acceptance.",
          "本预览不提供尚未批准的正式法律条款。原生应用在正文可用时提供只读阅读页面。阅读不代表接受协议。"))+
          '</p></div>')+
          note("No consent or acceptance state is changed by opening this page.",
            "打开本页面不会改变任何协议同意或接受状态。");
        break;
      case "about":
        html=section("FRESNICA","FRESNICA",
          '<div class="settings-detail-row"><span class="settings-detail-row-icon">'+mark("wallet")+
          '</span><span class="settings-detail-row-copy"><b>Fresnica</b><small>'+
          escape(tr("A wallet designed for Stellar","专为 Stellar 生态设计的钱包"))+
          '</small></span></div>'+
          '<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>'+
          escape(tr("UI preview version","界面预览版本"))+
          '</b></span><span class="settings-detail-row-value">1.1</span></div>'+
          '<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>'+
          escape(tr("Network ecosystem","网络生态"))+
          '</b></span><span class="settings-detail-row-value">Stellar</span></div>')+
          section("RESOURCES","相关信息",'<a class="settings-detail-row" href="./index.html#v3-clarity" target="_blank" rel="noopener noreferrer"><span class="settings-detail-row-copy"><b>'+
          escape(tr("Help & FAQ","帮助与常见问题"))+
          '</b></span><svg class="settings-detail-chevron" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></a>')+
          note("Version 1.1 identifies this UI preview, not a released wallet binary.",
            "版本 1.1 指此界面预览，不代表正式钱包安装包版本。");
        break;
    }
    content.innerHTML=html;
  };
  const openRecordDialog = (type,id,source) => {
    const isAccount=type.includes("account");
    const editing=type.startsWith("edit");
    const deleting=type.startsWith("delete");
    const record=editing||deleting ? (isAccount?accounts:contacts).find(x=>String(x.id)===String(id)):null;
    if((editing||deleting)&&!record)return;
    let html;
    if(deleting){
      html='<p class="settings-detail-sheet-copy">'+escape(tr(
        "Remove this sample entry from the preview? This does not affect Stellar or an installed wallet.",
        "从示例中移除此条记录？不会影响 Stellar 网络或真实钱包。"))+'</p>'+
        sheetActions("Remove","移除",type);
    }else{
      html=textField("name","Name","名称",record?.name||"")+
        (isAccount && !editing ?
          '<div class="settings-detail-field"><label for="settings-account-type">'+escape(tr("Account type","账户类型"))+'</label>'+
          '<select id="settings-account-type" name="accountType"><option value="sample">'+escape(tr("Create sample account","创建示例账户"))+'</option>'+
          '<option value="watch-only">'+escape(tr("Watch-only (G or C address)","只读账户（G 或 C 地址）"))+'</option>'+
          '<option value="native" disabled>'+escape(tr("Import phrase / secret / HD — native only","导入助记词、私钥或 HD — 仅原生应用"))+'</option></select></div>'+
          textField("address","Watch-only public address (optional for sample)","只读公开地址（示例账户可留空）")+
          '<p class="settings-detail-sheet-copy">'+escape(tr("This preview does not create keys. Use the native app for imports and HD derivation.",
            "此预览不会生成密钥；助记词、私钥导入和 HD 派生仅在原生应用中完成。"))+'</p>' :
          isAccount ? "" : textField("address","Stellar G address","Stellar G 地址",record?.address||"")+
            textField("memo","Optional memo (text or ID)","可选 Memo（文本或数字）",record?.memo||""))+
        sheetActions("Save","保存",type);
    }
    openSheet(type,isAccount?"Account":"Contact",isAccount?"账户":"联系人",html,source);
    overlay.dataset.record=id||"";
  };
  const applyPick = (kind,value,source) => {
    if(kind==="language"){
      const sidebar=document.querySelector('[data-gallery-language="'+value+'"]');
      sidebar?.click();
      logEvent("language-changed");
      render();return;
    }
    if(kind==="theme"){chooseTheme(value);logEvent("theme-changed");render();return;}
    if(kind==="currency"){settings.currency=value;}
    if(kind==="lockTimeout"){settings.lockTimeout=value;}
    saveSettings();logEvent(kind+"-updated");render();displayToast("Preview preference saved","示例设置已保存");
  };
  const showChoiceSheet = (kind,source) => {
    const isCurrency=kind==="currency";
    const choices=isCurrency?[["USD","USD","USD"],["EUR","EUR","EUR"],["CNY","CNY","CNY"]]:
      [["Immediately","立即","Immediately"],["1 minute","1 分钟","1 minute"],["5 minutes","5 分钟","5 minutes"],["15 minutes","15 分钟","15 minutes"]];
    const current=isCurrency?settings.currency:settings.lockTimeout;
    const html=choices.map(([en,cn,value])=>option(en,cn,kind,value,current)).join("");
    openSheet(kind,isCurrency?"Display currency":"Auto-lock timeout",
      isCurrency?"显示法币":"自动锁定时间",html,source);
  };
  content.addEventListener("input",event=>{
    if(event.target.id!=="settings-contacts-search")return;
    const results=content.querySelector("[data-contacts-results]");
    if(results)results.innerHTML=contactList(event.target.value);
  });
  content.addEventListener("click",event => {
    const button=event.target.closest("button");
    if(!button)return;
    const move=button.dataset.accountMove;
    if(move){
      const active=accounts.filter(a=>!a.hidden);
      const entry=active.findIndex(a=>a.id===button.dataset.id),next=entry+(move==="up"?-1:1);
      if(entry<0||next<0||next>=active.length)return;
      const from=accounts.findIndex(a=>a.id===active[entry].id),to=accounts.findIndex(a=>a.id===active[next].id);
      [accounts[from],accounts[to]]=[accounts[to],accounts[from]];
      if(saveAccounts()){render();displayToast("Sample order updated","示例顺序已更新");}
      return;
    }
    if(button.dataset.pick){applyPick(button.dataset.pick,button.dataset.value,button);return;}
    if(button.dataset.action==="select-account"){
      if(state.setActiveAccount(button.dataset.id)){render();displayToast("Current sample account changed","已切换示例账户");}
      return;
    }
    if(button.dataset.action==="hide-account"||button.dataset.action==="restore-account"){
      const item=accounts.find(a=>a.id===button.dataset.id);
      if(!item)return;
      if(!item.hidden&&accounts.filter(a=>!a.hidden).length<=1)return;
      item.hidden=button.dataset.action==="hide-account";
      if(saveAccounts()){render();displayToast("Sample account list updated","示例账户列表已更新");}
      return;
    }
    if(button.dataset.toggle){
      const name=button.dataset.toggle;
      if(name==="avatars"&&!settings.avatars){
        openSheet("avatars","External avatar consent","外部头像授权",
          '<p class="settings-detail-sheet-copy">'+escape(tr(
            "Enabling address avatars may send public account addresses and network metadata to an external service. Continue with this UI-only preview?",
            "启用地址头像可能向第三方发送公开账户地址及网络元数据。是否仅在界面示例中开启？"))+
          '</p>'+sheetActions("I understand","我已了解","avatars"),button);
        return;
      }
      if(name==="developer"&&!settings.developer){
        openSheet("developer","Developer mode","开发者模式",
          '<p class="settings-detail-sheet-copy">'+escape(tr(
            "Developer mode exposes diagnostic previews; it does not enable a real testnet or access to private keys.",
            "开发者模式仅显示诊断原型，不会启用真实测试网或访问私钥。"))+
          '</p>'+sheetActions("Enable preview","开启示例","developer"),button);
        return;
      }
      settings[name]=!settings[name];saveSettings();logEvent(name+"-updated");render();
      displayToast("Preview preference saved","示例设置已保存");return;
    }
    const id=button.dataset.id;
    const a=button.dataset.action;
    if(!a)return;
    if(a==="disconnect-app"){
      const connection=state.connections().find(c=>c.origin===button.dataset.origin);
      if(!connection)return;
      openSheet("disconnect-app","Disconnect preview","断开示例连接",
        '<p class="settings-detail-sheet-copy">'+escape(tr(
          "Remove this preview connection? Real wallet permissions will not change.",
          "移除这条示例连接？真实钱包授权不会改变。"))+'</p>'+
        sheetActions("Disconnect","断开","disconnect-app"),button);
      overlay.dataset.origin=connection.origin;
      return;
    }
    if(a==="account-detail"){
      const account=accounts.find(x=>String(x.id)===button.dataset.id);
      if(!account)return;
      openSheet("account-detail","Account details","账户详情",
        '<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>' + escape(account.name) +
        '</b><small>' + escape(address(account.address)) + '</small></span></div>' +
        '<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>'+escape(tr("Account type","账户类型"))+
        '</b></span><span class="settings-detail-row-value">'+escape(account.type==="watch-only"?
          tr("Watch-only","只读"):tr("Sample","示例"))+'</span></div>' +
        '<div class="settings-detail-row"><span class="settings-detail-row-copy"><b>'+escape(tr("Network","网络"))+
        '</b></span><span class="settings-detail-row-value">Stellar Mainnet</span></div>' +
        (/^[GC][A-Z2-7]{55}$/.test(account.address) ?
          '<button type="button" class="settings-detail-cta is-muted" data-copy-public-address="'+escape(account.address)+'">'+
          escape(tr("Copy public address","复制公开地址"))+'</button>' : '')+
        '<p class="settings-detail-sheet-copy">'+escape(tr("This is a sample identity without signer material. Recovery and key management are native-app operations.",
        "这只是没有签名材料的示例身份。恢复与密钥管理只能在原生应用中完成。"))+'</p>',button);
      return;
    }
    if(["add-account","edit-account","delete-account","add-contact","edit-contact","delete-contact"].includes(a)){
      openRecordDialog(a,id,button);return;
    }
    if(a==="currency"){showChoiceSheet("currency",button);return;}
    if(a==="lock-timeout"){showChoiceSheet("lockTimeout",button);return;}
    if(a==="show-lock"){
      openSheet("lock","Lock preview","锁定预览",
        '<p class="settings-detail-sheet-copy">'+escape(tr(
          "A real wallet would require authentication to unlock. This preview has no wallet vault.",
          "真实钱包需要身份验证才能解锁。本预览没有密钥库。"))+
        '</p><div class="settings-detail-dialog-actions"><button type="button" data-dismiss>'+
        escape(tr("Unlock preview","退出锁定预览"))+'</button></div>',button);
      return;
    }
    if(a==="export-log"){
      const payload=JSON.stringify({preview:true,events},null,2);
      const url=URL.createObjectURL(new Blob([payload],{type:"application/json"}));
      const link=document.createElement("a");link.href=url;link.download="fresnica-ui-preview-events.json";
      link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
    }
    if(a==="clear-log"){
      events=[];store(logKey,events);render();displayToast("Demo events cleared","示例事件已清空");
    }
  });
  const modalInput=name=>sheetBody.querySelector('[name="'+name+'"]')?.value.trim()||"";
  sheetBody.addEventListener("click",event => {
    const button=event.target.closest("button");if(!button)return;
    if(button.hasAttribute("data-dismiss")){closeSheet();return;}
    if(button.dataset.copyPublicAddress){
      navigator.clipboard?.writeText(button.dataset.copyPublicAddress)
        .then(()=>displayToast("Public address copied","公开地址已复制"))
        .catch(()=>displayToast("Copy not available","无法复制"));
      return;
    }
    if(button.dataset.pick){
      const kind=button.dataset.pick,value=button.dataset.value;
      closeSheet();applyPick(kind,value,button);return;
    }
    const kind=button.dataset.confirm;if(!kind)return;
    if(kind==="disconnect-app"){
      const success=state.disconnect(overlay.dataset.origin);
      closeSheet();render();
      if(success)displayToast("Preview connection removed","示例连接已移除");
      return;
    }
    if(kind==="avatars"||kind==="developer"){
      settings[kind]=true;saveSettings();logEvent(kind+"-enabled");closeSheet();render();
      displayToast("Preview preference saved","示例设置已保存");return;
    }
    if(kind.includes("account")||kind.includes("contact")){
      const isAccount=kind.includes("account"),items=isAccount?accounts:contacts;
      const id=overlay.dataset.record;
      const found=items.findIndex(x=>String(x.id)===id);
      if(kind.startsWith("delete")){
        if(found<0)return;
        if(isAccount&&!items[found].hidden&&accounts.filter(a=>!a.hidden).length===1){
          displayToast("Keep at least one visible sample account","至少保留一个可见的示例账户");return;
        }
        items.splice(found,1);
      }else{
        const name=modalInput("name"),publicAddress=modalInput("address");
        const accountType=sheetBody.querySelector('[name="accountType"]')?.value||"sample";
        if(!name){displayToast("Enter a name","请输入名称");return;}
        if(!isAccount&&!/^G[A-Z2-7]{55}$/.test(publicAddress)){
          displayToast("Use a 56-character Stellar G address","请输入完整的 56 位 Stellar G 地址");return;
        }
        const memo=modalInput("memo").slice(0,64);
        if(isAccount&&!kind.startsWith("edit")&&accountType==="watch-only"&&!/^[GC][A-Z2-7]{55}$/.test(publicAddress)){
          displayToast("Enter a full G/C public address for watch-only","只读账户需填写完整 G/C 公开地址");return;
        }
        if(kind.startsWith("edit")){
          if(found<0)return;
          items[found].name=name;
          if(!isAccount){items[found].address=publicAddress;items[found].memo=memo;}
        }else{
          items.push({id:String(Date.now()),name,
            address:isAccount?(accountType==="watch-only"?publicAddress:"—"):publicAddress,
            ...(isAccount?{type:accountType,hidden:false}:{memo})});
        }
      }
      if(isAccount){if(!saveAccounts())return;}
      else store(contactKey,items);
      logEvent(isAccount?"sample-accounts-updated":"sample-contacts-updated");
      closeSheet();render();displayToast("Sample list updated","示例列表已更新");
    }
  });
  closeButton.addEventListener("click",()=>closeSheet());
  overlay.addEventListener("click",event=>{if(event.target===overlay)closeSheet();});
  overlay.addEventListener("keydown",event=>{
    if(overlay.hidden)return;
    if(event.key==="Escape"){event.preventDefault();event.stopPropagation();closeSheet();return;}
    if(event.key!=="Tab")return;
    const focus=[...sheet.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href]')];
    if(!focus.length)return;
    if(event.shiftKey&&document.activeElement===focus[0]){event.preventDefault();focus[focus.length-1].focus();}
    else if(!event.shiftKey&&document.activeElement===focus[focus.length-1]){event.preventDefault();focus[0].focus();}
  });
  content.addEventListener("change",event => {
    const input=event.target.closest("#settings-image");
    if(!input?.files?.length)return;
    const file=input.files[0];
    if(!file.type.startsWith("image/")||file.size>10*1024*1024){
      displayToast("Choose an image under 10 MB","请选择小于 10 MB 的图片");return;
    }
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{
      try {
        const canvas=document.createElement("canvas");canvas.width=24;canvas.height=24;
        const ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,24,24);
        const data=ctx.getImageData(0,0,24,24).data;let r=0,g=0,b=0,c=0;
        for(let i=0;i<data.length;i+=16){if(data[i+3]<200)continue;r+=data[i];g+=data[i+1];b+=data[i+2];c++;}
        if(c){
          const hex=x=>Math.max(0,Math.min(255,Math.round(x/c))).toString(16).padStart(2,"0");
          settings.palette="#"+hex(r)+hex(g)+hex(b);settings.themeMode="image";saveSettings();
          window.dispatchEvent(new Event("fresnica-preview-theme-change"));
          render();displayToast("Local color sampled","已提取本地颜色");
        }
      }catch(_){displayToast("Unable to read this image","无法读取图片");}
      URL.revokeObjectURL(url);
    };
    img.onerror=()=>{URL.revokeObjectURL(url);displayToast("Unable to read this image","无法读取图片");};
    img.src=url;
  });
  // Gallery selectors and this detail page share one persisted theme mode.
  document.addEventListener("click",event=>{
    const chosen=event.target.closest("[data-gallery-language],[data-gallery-theme]");
    if(!chosen || chosen.closest(".settings-detail-phone"))return;
    queueMicrotask(()=>{
      const current=readPreference();
      if(current.themeMode)settings.themeMode=current.themeMode;
      if(current.palette)settings.palette=current.palette;
      render();
    });
  });
  window.addEventListener("fresnica-preview-state",event=>{
    if(event.detail?.type==="accounts"){accounts=state.accounts();if(view==="accounts")render();}
    if(event.detail?.type==="connections"&&view==="connected")render();
  });
  render();
  window.addEventListener("load",()=>{document.title="Fresnica — "+heading.textContent;});
})();
