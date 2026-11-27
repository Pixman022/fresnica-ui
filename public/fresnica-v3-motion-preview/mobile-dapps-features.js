/* D01-D04: dApps preview directory, recent previews, search, and reviewed URL entry. */
(() => {
  const phone = document.querySelector(".home11-phone.gallery-dapps-enhanced");
  if (!phone) return;
  const grid = phone.querySelector("[data-gallery-demo-apps]");
  const dialog = phone.querySelector(".gallery-dialog-overlay");
  const cards = [...(grid?.querySelectorAll("[data-gallery-dialog-app]") || [])];
  if (!grid || !dialog || !cards.length) return;

  const samples = {
    Nova: { url: "https://nova.example/", description: "Sample Stellar dApp entry" },
    Orbit: { url: "https://orbit.example/", description: "Sample Stellar dApp entry" },
    Atlas: { url: "https://atlas.example/", description: "Sample Stellar dApp entry" },
  };
  const translations = {
    "Recent":"最近",
    "Search dApps":"搜索应用", "Clear search":"清除搜索",
    "No matching apps":"没有匹配的应用", "No recent apps":"暂无最近访问",
    "Recent examples are not real visits or connections.":"最近示例不代表真实访问或已连接。",
    "Open a dApp URL":"打开 dApp 网址", "Close":"关闭",
    "Sample Stellar dApp entry":"Stellar 应用示例",
    "Developer":"开发者", "Demo catalog":"演示目录",
    "Website":"网站", "Connection review":"连接请求审阅",
    "Network":"网络", "Permissions":"权限",
    "Wallet address (preview)":"钱包地址（预览）",
    "Not selected":"未选择",
    "Preview only — no live connection.":"仅为界面预览，不会真实连接。",
    "Review site":"核对网站", "Review request":"审阅请求",
    "Open preview":"预览打开",
    "Unreviewed website — verify the full address before continuing.":"未经审核的网站，请在继续前核对完整地址。",
    "Sample directory entry — not verified by Fresnica.":"目录示例，未经 Fresnica 认证。",
    "I have checked the website address":"我已核对网站地址",
    "Enter a valid HTTPS URL.":"请输入有效的 HTTPS 网址。",
    "HTTPS is required.":"仅支持 HTTPS 网址。",
    "URLs with credentials are not allowed.":"网址不能包含用户名或密码。",
    "Local and private addresses are not allowed.":"不允许本地或私有网络地址。",
    "Sample preview only":"仅为示例预览",
  };
  const zh = () => document.documentElement.lang.startsWith("zh");
  const locale = en => zh() ? (translations[en] || en) : en;
  const select = s => phone.querySelector(s);
  const search = select("[data-dapps-search]");
  const clear = select("[data-dapps-clear]");
  const noResults = select("[data-dapps-no-results]");
  const recentList = select("[data-dapps-recent-list]");
  const recentEmpty = select("[data-dapps-recent-empty]");
  const manualOpener = select("[data-gallery-dialog-open='connect']");
  const closeButton = dialog.querySelector("[data-gallery-dialog-close]");
  const title = dialog.querySelector("#gallery-connect-title");
  const info = dialog.querySelector("[data-dapps-app-info]");
  const infoIcon = dialog.querySelector("[data-dapps-app-icon]");
  const infoName = dialog.querySelector("[data-dapps-app-name]");
  const infoDescription = dialog.querySelector("[data-dapps-app-description]");
  const infoUrl = dialog.querySelector("[data-dapps-app-url]");
  const manual = dialog.querySelector("[data-dapps-manual]");
  const website = dialog.querySelector("[data-gallery-website-input]");
  const error = dialog.querySelector("[data-dapps-url-error]");
  const review = dialog.querySelector("[data-dapps-review]");
  const reviewOrigin = dialog.querySelector("[data-gallery-review-website]");
  const warning = dialog.querySelector("[data-dapps-review-warning]");
  const acknowledge = dialog.querySelector("[data-dapps-ack]");
  const next = dialog.querySelector("[data-dapps-next]");
  const confirm = dialog.querySelector("[data-dapps-confirm]");
  if (!search || !clear || !recentList || !manualOpener || !closeButton ||
      !website || !review || !next || !confirm) return;

  const recentKey = "fresnica-gallery-recent-previews";
  let recent = [];  // Session-only prototype state; never wallet authorization data.
  const recentExamples = ["Orbit","Atlas","Nova"].map(name => ({name,url:samples[name].url,kind:"sample"}));
  try {
    const stored = JSON.parse(sessionStorage.getItem(recentKey) || "[]");
    if (Array.isArray(stored)) recent = stored.filter(item =>
      item && (item.kind === "sample" || item.kind === "manual") &&
      typeof item.name === "string" && typeof item.url === "string" &&
      item.url.startsWith("https://")).slice(0,4);
  } catch (_) { /* Browsers may disable session storage. */ }
  let active = null;
  let stage = "entry";
  let lastOpener = null;
  const appFor = name => samples[name] ? ({ name, url:samples[name].url, kind:"sample" }) : null;

  const setText = (selector, english) => {
    const target = select(selector);
    if (target) target.textContent = locale(english);
  };
  const displayNotice = () => {
    let toast = phone.querySelector(".gallery-preview-notice");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "gallery-preview-notice";
      toast.setAttribute("role", "status");
      phone.appendChild(toast);
    }
    toast.textContent = locale("Sample preview only");
    toast.classList.add("is-visible");
    clearTimeout(displayNotice.timer);
    displayNotice.timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  const validate = value => {
    const raw = value.trim();
    if (!raw) return { valid:false, reason:"" };
    let url;
    try { url = new URL(raw); }
    catch { return { valid:false, reason:"Enter a valid HTTPS URL." }; }
    if (url.protocol !== "https:") return {valid:false,reason:"HTTPS is required."};
    if (url.username || url.password) return {valid:false,reason:"URLs with credentials are not allowed."};
    const host = url.hostname.toLowerCase();
    const isIp = host.startsWith("[") || /^\d+\.\d+\.\d+\.\d+$/.test(host);
    const isLocal = !host.includes(".") || host.endsWith(".") ||
      /(?:^|\.)localhost$|(?:^|\.)local$|(?:^|\.)(?:internal|lan|home|test|invalid|example)$/.test(host);
    if (isIp || isLocal) return {valid:false,reason:"Local and private addresses are not allowed."};
    return {valid:true,url:url.href,origin:url.origin};
  };

  const updateSearch = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const name = card.dataset.galleryDialogApp || "";
      const app = samples[name];
      const blob = [name, app?.description || "", app?.url || ""].join(" ").toLocaleLowerCase();
      card.hidden = query !== "" && !blob.includes(query);
      if (!card.hidden) shown++;
    });
    noResults.hidden = shown !== 0;
    clear.hidden = search.value === "";
  };
  const renderRecent = () => {
    recentList.replaceChildren();
    // Fill unused slots with visual samples without writing fake visits to session history.
    const visibleRecent = [...recent,
      ...recentExamples.filter(example => !recent.some(item => item.url === example.url))].slice(0,4);
    visibleRecent.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-app-card gallery-dapps-recent-item";
      button.title = item.url;
      const sample = item.kind === "sample" ?
        cards.find(card => card.dataset.galleryDialogApp === item.name) : null;
      const mark = sample?.querySelector(".gallery-app-mark")?.cloneNode(true) ||
        document.createElement("span");
      if (!sample) {
        mark.className = "gallery-app-mark";
        mark.textContent = "↗";
      }
      mark.setAttribute("aria-hidden","true");
      button.appendChild(mark);
      const label = document.createElement("span");
      label.className = "gallery-dapps-recent-name";
      label.textContent = item.name;
      button.appendChild(label);
      button.addEventListener("click", () => openDialog(item,button));
      recentList.appendChild(button);
    });
    recentList.hidden = visibleRecent.length === 0;
    recentEmpty.hidden = visibleRecent.length !== 0;
  };
  const recordPreview = item => {
    recent = [item,...recent.filter(entry => entry.url !== item.url)].slice(0,4);
    try { sessionStorage.setItem(recentKey,JSON.stringify(recent)); }
    catch (_) { /* Keep the in-memory list if storage is disabled. */ }
    renderRecent();
  };
  const closeDialog = () => {
    if (dialog.hidden) return;
    dialog.hidden = true;
    lastOpener?.focus();
  };

  const updateManual = () => {
    const parsed = validate(website.value);
    next.disabled = !parsed.valid;
    error.hidden = !parsed.reason;
    error.textContent = parsed.reason ? locale(parsed.reason) : "";
    website.setAttribute("aria-invalid", String(!!parsed.reason));
    return parsed;
  };
  const updateConfirm = () => { confirm.disabled = !acknowledge.checked; };
  const localize = () => {
    search.placeholder = locale("Search dApps");
    search.setAttribute("aria-label",locale("Search dApps"));
    clear.setAttribute("aria-label",locale("Clear search"));
    setText("[data-dapps-recent-title]","Recent");
    recentList.setAttribute("aria-label",locale("Recent"));
    setText("[data-dapps-no-results]","No matching apps");
    setText("[data-dapps-recent-empty]","No recent apps");
    setText(".gallery-dapps-recent-note","Recent examples are not real visits or connections.");
    manualOpener.setAttribute("aria-label",locale("Open a dApp URL"));
    manualOpener.title = locale("Open a dApp URL");
    closeButton.setAttribute("aria-label",locale("Close"));
    title.textContent = stage === "review" ? locale("Connection review") :
      active?.kind === "sample" ? active.name : locale("Open a dApp URL");
    infoDescription.textContent = locale("Sample Stellar dApp entry");
    const appMeta = info.querySelectorAll(".gallery-dapps-app-meta > *");
    if (appMeta.length === 4) {
      appMeta[0].textContent = locale("Developer");
      appMeta[1].textContent = locale("Demo catalog");
      appMeta[2].textContent = locale("Website");
    }
    setText('label[for="gallery-website"]',"Website");
    setText(".gallery-dialog-subtitle","Connection review");
    const rows = review.querySelectorAll(".gallery-connection-review > div");
    [["Website",null],["Network",null],["Permissions","Wallet address (preview)"]].forEach(([caption,value],i) => {
      rows[i]?.querySelector("span")?.replaceChildren(document.createTextNode(locale(caption)));
      if (value) rows[i]?.querySelector("strong")?.replaceChildren(document.createTextNode(locale(value)));
    });
    warning.textContent = locale(active?.kind === "sample" ?
      "Sample directory entry — not verified by Fresnica." :
      "Unreviewed website — verify the full address before continuing.");
    acknowledge.nextElementSibling.textContent = locale("I have checked the website address");
    setText(".gallery-preview-copy","Preview only — no live connection.");
    next.textContent = locale(active?.kind === "sample" ? "Review request" : "Review site");
    confirm.textContent = locale("Open preview");
    const parsed = validate(website.value);
    if (!manual.hidden) {
      error.textContent = parsed.reason ? locale(parsed.reason) : "";
      error.hidden = !parsed.reason;
    }
  };

  const openDialog = (item,opener) => {
    active = item;
    stage = "entry";
    lastOpener = opener;
    acknowledge.checked = false;
    review.hidden = true;
    next.hidden = false;
    confirm.hidden = true;
    info.hidden = item.kind !== "sample";
    manual.hidden = item.kind === "sample";
    if (item.kind === "sample") {
      const card = cards.find(card => card.dataset.galleryDialogApp === item.name);
      infoIcon.replaceChildren();
      const icon = card?.querySelector(".gallery-app-mark")?.cloneNode(true);
      if (icon) infoIcon.appendChild(icon);
      infoName.textContent = item.name;
      infoUrl.textContent = item.url;
      next.disabled = false;
    } else {
      website.value = item.url || "";
      updateManual();
    }
    dialog.hidden = false;
    localize();
    (item.kind === "sample" ? next : website).focus();
  };

  const doReview = () => {
    if (!active) return;
    let site;
    if (active.kind === "sample") {
      site = {valid:true,url:active.url,origin:new URL(active.url).origin};
    } else {
      site = updateManual();
      if (!site.valid) return;
      active = {kind:"manual",name:new URL(site.url).hostname,url:site.url};
    }
    stage = "review";
    info.hidden = true;
    manual.hidden = true;
    review.hidden = false;
    reviewOrigin.textContent = site.origin;
    reviewOrigin.title = site.origin;
    acknowledge.checked = false;
    next.hidden = true;
    confirm.hidden = false;
    updateConfirm();
    localize();
    acknowledge.focus();
  };

  search.addEventListener("input",updateSearch);
  clear.addEventListener("click", () => {search.value="";updateSearch();search.focus();});
  cards.forEach(card => card.addEventListener("click", () => {
    const item = appFor(card.dataset.galleryDialogApp);
    if (item) openDialog(item,card);
  }));
  manualOpener.addEventListener("click", () => openDialog({kind:"manual",url:"",name:""},manualOpener));
  website.addEventListener("input",updateManual);
  next.addEventListener("click",doReview);
  acknowledge.addEventListener("change",updateConfirm);
  confirm.addEventListener("click", () => {
    if (confirm.disabled || !active) return;
    recordPreview(active);
    closeDialog();
    displayNotice();
  });
  closeButton.addEventListener("click",closeDialog);
  dialog.addEventListener("click",event => {if(event.target===dialog)closeDialog();});
  phone.addEventListener("keydown",event => {
    if (dialog.hidden) return;
    if (event.key === "Escape") {event.preventDefault();event.stopPropagation();closeDialog();return;}
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll("input:not(:disabled),button:not(:disabled)")]
      .filter(node => node.getClientRects().length && !node.closest("[hidden]"));
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault();focusable[focusable.length-1].focus();
    } else if (!event.shiftKey && document.activeElement === focusable[focusable.length-1]) {
      event.preventDefault();focusable[0].focus();
    }
  });
  document.querySelectorAll("[data-gallery-language]").forEach(button =>
    button.addEventListener("click",localize));

  localize();
  renderRecent();
  updateSearch();
})();