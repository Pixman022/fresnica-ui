/* Shared controls for Fresnica's static mobile screen gallery (no wallet operations). */
(() => {
  const pages = [
    { file: "mobile-demo-1-1.html", en: "Home 1.1", zh: "首页示例 1.1", subtitle: "Wallet overview", subtitleZh: "资产总览", kind: "home" },
    { file: "mobile-activity.html", en: "Activity", zh: "交易活动", subtitle: "Transaction history", subtitleZh: "交易历史", kind: "activity" },
    { file: "mobile-dapps.html", en: "dApps", zh: "生态应用", subtitle: "App connections", subtitleZh: "应用连接", kind: "dapps" },
    { file: "mobile-settings.html", en: "Settings", zh: "设置", subtitle: "Wallet preferences", subtitleZh: "钱包偏好设置", kind: "settings" },
    { file: "mobile-demo.html", en: "Original Home", zh: "首页示例", subtitle: "Original sample", subtitleZh: "原始示例", kind: "reference" },
    { file: "wallet-home.html", en: "Wallet Home", zh: "钱包首页", subtitle: "Wallet reference", subtitleZh: "钱包参考页", kind: "reference" },
  ];
  const file = location.pathname.split("/").pop() || "mobile-demo-1-1.html";
  const current = pages.find((item) => item.file === file) || pages[0];
  const t = {
    "Home": "首页", "Activity": "活动", "Actions": "操作", "dApps": "应用", "Settings": "设置",
    "Stellar Mainnet": "Stellar 主网", "STELLAR / WALLET": "STELLAR / 钱包",
    "WALLET / OVERVIEW": "钱包 / 总览", "Stellar assets, all in view.": "一览 Stellar 资产。",
    "Your assets": "我的资产", "Add": "添加", "Stellar native asset": "Stellar 原生资产",
    "Reserved": "储备金额", "Send": "发送", "Swap": "兑换", "Receive": "接收",
    "Quick Actions": "快捷操作", "Close actions": "关闭操作面板",
    "Tokens": "代币", "Available": "可用", "Balance": "余额",
    "Wallet Overview": "钱包总览", "SuperWallet": "SuperWallet",
    "My wallet": "我的钱包", "Wallets": "钱包列表", "Total balance": "总余额",
    "Create wallet": "新建钱包", "Wallet name": "钱包名称", "Create demo wallet": "创建演示钱包",
    "Preview only — no wallet keys are created.": "仅为界面预览，不会生成真实钱包密钥。",
    "Wallet main navigation": "钱包主导航",
    "FULLSCREEN": "全屏", "Fullscreen": "全屏", "Exit fullscreen": "退出全屏",
    "Activity history": "交易记录", "Transaction history": "交易记录",
    "Your wallet activity": "钱包活动记录", "Recent activity": "最近活动",
    "Today": "今天", "Yesterday": "昨天", "Earlier": "更早",
    "Received USDC": "收到 USDC", "Sent XLM": "发送 XLM", "Swapped XLM to USDC": "XLM 兑换 USDC",
    "Received XLM": "收到 XLM", "Sent USDC": "发送 USDC",
    "Received": "已收款", "Sent": "已发送", "Swapped": "已兑换",
    "Wallet transactions on Stellar.": "Stellar 网络上的钱包交易。",
    "dApp connections": "应用连接", "Connect to Stellar apps": "连接 Stellar 应用",
    "Connected apps": "已连接的应用", "No connected apps": "暂无已连接应用",
    "Connect a dApp": "连接应用", "Review before connecting": "连接前查看请求",
    "Website": "网站", "Network": "网络", "Permissions": "权限",
    "Connection review": "连接请求审阅", "Close": "关闭",
    "Open a compatible Stellar app and review its request before connecting.": "打开兼容的 Stellar 应用，并在连接前审阅请求。",
    "Check the site, network and requested permissions before you approve.": "批准前确认网站、网络和请求的权限。",
    "This is an interface preview. No live app connection is made.": "这是界面预览，不会真实连接应用。",
    "Wallet preferences": "钱包偏好设置", "Manage your wallet": "管理你的钱包",
    "GENERAL": "通用", "PREFERENCES": "偏好", "SECURITY": "安全",
    "Network status": "网络状态", "Language": "语言", "Appearance": "外观",
    "Light": "浅色", "Dark": "深色", "English": "英文", "Chinese": "中文",
    "Review before signing": "签名前确认", "Confirm transaction details": "核对交易详情",
    "About Fresnica": "关于 Fresnica", "About": "关于", "Stellar wallet": "Stellar 钱包",
    "Preview only — no live connection.": "仅作界面预览，不会真实连接。",
    "View preferences from the gallery menu.": "可在左侧示例菜单中调整语言与主题。",
    "Illustrative transactions": "示例交易记录",
    "Preview only": "仅界面预览",
    "Recently used dApps": "最近使用的应用", "Official shortcuts": "官方快捷功能", "History": "交易记录",
    "Scan QR Code": "扫描二维码", "Example apps": "应用示例", "Not selected": "未选择",
    "Wallet address": "钱包地址", "Connect": "连接", "Connect a dApp": "连接应用",
    "WALLET / ACTIVITY": "钱包 / 活动", "STELLAR / APPS": "STELLAR / 应用", "WALLET / SETTINGS": "钱包 / 设置",
    "Mainnet": "主网", "Nov 26": "11月26日", "Nov 25": "11月25日",
    "Received · USDC": "收到 · USDC", "Sent · XLM": "发送 · XLM",
    "Swapped · XLM / USDC": "兑换 · XLM / USDC", "Received · XLM": "收到 · XLM",
    "Illustrative transactions": "示例交易记录",
    "Network status": "网络状态", "Wallet actions": "钱包操作", "Balance": "余额",
    "My assets": "我的资产", "Recent transactions": "最近交易", "No transactions yet": "暂无交易",
    "Assets": "资产", "Explore": "探索", "xApps": "应用", "Setting": "设置",
    "FRESNICA / STELLAR WALLET": "FRESNICA / STELLAR 钱包",
    "FRESNICA / WALLET HOME": "FRESNICA / 钱包首页",
    "Fresnica home screen preview": "Fresnica 首页示例",
  };
  const ico = {
    home: '<path d="M3 10 12 3l9 7v11h-7v-8h-4v8H3z"/>',
    activity: '<path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>',
    dapps: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    settings: '<path d="M4 7h9m4 0h3M4 17h3m4 0h9M13 4v6M7 14v6"/>',
    reference: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  };
  const icon = (name) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ico[name] + '</svg>';
  const readSetting = (name, allowed, fallback) => {
    try { const value = localStorage.getItem(name); return allowed.includes(value) ? value : fallback; }
    catch (_) { return fallback; }
  };
  const storeSetting = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  let lang = readSetting("fresnica-gallery-language", ["en", "zh"], "en");
  let theme = readSetting("fresnica-gallery-theme", ["light", "dark"], "light");
  // Shared placeholder apps across the Actions sheet and the dApps catalogue.
  const demoApps = [
    { name: "Nova", kind: "nova", symbol: '<path d="m12 2 2.9 6.9L22 12l-7.1 3.1L12 22l-3.1-6.9L2 12l6.9-3.1z"/>' },
    { name: "Orbit", kind: "orbit", symbol: '<circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-30 12 12)"/>' },
    { name: "Atlas", kind: "atlas", symbol: '<path d="M12 3 3.5 19h17L12 3zM8.5 13h7"/>' },
  ];
  const appMark = (app) => '<span class="gallery-app-mark gallery-app-' + app.kind + '" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + app.symbol + '</svg></span>';
  const recentApps = demoApps.map((app) =>
    '<a class="gallery-app-card" href="./mobile-dapps.html" aria-label="' + app.name + ' dApp">' +
    appMark(app) + '<span>' + app.name + '</span></a>').join("");
  const actionPanel = document.querySelector(".home11-phone .home11-action-sheet");
  const actionChoices = actionPanel?.querySelector(".home11-action-choices");
  if (actionChoices) {
    actionPanel.querySelector(".home11-action-heading h2").textContent = "Actions";
    actionChoices.outerHTML =
      '<div class="gallery-action-group"><h3>Recently used dApps</h3>' +
      '<div class="gallery-app-grid">' + recentApps + '</div></div>' +
      '<div class="gallery-action-group"><h3>Official shortcuts</h3><div class="gallery-shortcut-grid">' +
      '<button type="button" data-gallery-preview-action="Swap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3 4 7l4 4M4 7h16m-4 14 4-4-4-4m4 4H4"/></svg><span>Swap</span></button>' +
      '<a href="./mobile-activity.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/></svg><span>History</span></a>' +
      '<button type="button" data-gallery-preview-action="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg><span>Send</span></button>' +
      '<button type="button" data-gallery-preview-action="Receive"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 7 7 17M17 17H7V7"/></svg><span>Receive</span></button>' +
      '</div></div>' +
      '<button type="button" class="gallery-scan-button" data-gallery-preview-action="Scan QR Code">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3M7 12h10"/></svg>' +
      '<span>Scan QR Code</span></button>';
  }
  const sampleList = document.querySelector("[data-gallery-demo-apps]");
  if (sampleList) {
    sampleList.innerHTML = demoApps.map((app) =>
      '<button type="button" class="gallery-app-card" data-gallery-dialog-app="' + app.name + '" aria-label="' + app.name + ' dApp">' +
      appMark(app) + '<span>' + app.name + '</span></button>').join("");
  }
  const showPreviewNotice = () => {
    const phone = document.querySelector(".home11-phone");
    if (!phone) return;
    let notice = phone.querySelector(".gallery-preview-notice");
    if (!notice) {
      notice = document.createElement("div");
      notice.className = "gallery-preview-notice";
      notice.setAttribute("role", "status");
      phone.appendChild(notice);
    }
    notice.textContent = lang === "zh" ? "仅界面预览" : "Preview only";
    notice.classList.add("is-visible");
    clearTimeout(showPreviewNotice.timeout);
    showPreviewNotice.timeout = setTimeout(() => notice.classList.remove("is-visible"), 2200);
  };
  document.querySelectorAll("[data-gallery-preview-action]").forEach((button) =>
    button.addEventListener("click", showPreviewNotice));

  const originalText = new WeakMap();
  const aside = document.querySelector(".preview-sidebar");
  if (aside) {
    const heading = aside.querySelector(".preview-sidebar-title strong");
    const description = aside.querySelector(".preview-sidebar-title p");
    if (heading) { heading.dataset.galleryEn = "Screen Gallery"; heading.dataset.galleryZh = "界面示例"; }
    if (description) { description.dataset.galleryEn = "Mobile interface gallery"; description.dataset.galleryZh = "移动端界面预览"; }
    const nav = aside.querySelector(".preview-nav");
    if (nav) {
      nav.innerHTML = pages.map((item, index) =>
        (index === 0 ? '<span class="gallery-nav-group-label" data-gallery-en="Main pages" data-gallery-zh="主要页面">Main pages</span>' :
        index === 4 ? '<span class="gallery-nav-group-label is-reference" data-gallery-en="Reference pages" data-gallery-zh="参考页面">Reference pages</span>' : '') +
        '<a href="./' + item.file + '"' + (item.file === current.file ? ' class="is-current" aria-current="page"' : '') + '>' +
        '<span class="preview-nav-icon">' + icon(item.kind) + '</span>' +
        '<span class="preview-nav-copy"><strong data-gallery-en="' + item.en + '" data-gallery-zh="' + item.zh + '">' + item.en + '</strong>' +
        '<small data-gallery-en="' + item.subtitle + '" data-gallery-zh="' + item.subtitleZh + '">' + item.subtitle + '</small></span></a>'
      ).join("");
    }
    const preferences = document.createElement("section");
    preferences.className = "gallery-preferences";
    preferences.setAttribute("aria-label", "Preview preferences");
    preferences.innerHTML =
      '<div class="gallery-preference"><span class="gallery-pref-title" data-gallery-en="Language" data-gallery-zh="语言">Language</span>' +
      '<div class="gallery-switches" role="group" aria-label="Language">' +
      '<button type="button" class="gallery-switch" data-gallery-language="en" aria-pressed="true">EN</button>' +
      '<button type="button" class="gallery-switch" data-gallery-language="zh" aria-pressed="false">中文</button></div></div>' +
      '<div class="gallery-preference"><span class="gallery-pref-title" data-gallery-en="Theme" data-gallery-zh="主题">Theme</span>' +
      '<div class="gallery-switches" role="group" aria-label="Theme">' +
      '<button type="button" class="gallery-switch" data-gallery-theme="light" aria-pressed="true" data-gallery-en="Light" data-gallery-zh="浅色">Light</button>' +
      '<button type="button" class="gallery-switch" data-gallery-theme="dark" aria-pressed="false" data-gallery-en="Dark" data-gallery-zh="深色">Dark</button>' +
      '</div></div>';
    const foot = aside.querySelector(".preview-sidebar-foot");
    if (foot) aside.insertBefore(preferences, foot);
    else aside.appendChild(preferences);
  }
  // On narrow screens the gallery navigation becomes an accessible drawer.
  if (aside) {
    const shell = document.querySelector(".preview-shell");
    if (shell) {
      aside.id = "gallery-screen-menu";
      const menuButton = document.createElement("button");
      menuButton.type = "button";
      menuButton.className = "gallery-menu-toggle";
      menuButton.setAttribute("aria-controls", aside.id);
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open screen menu");
      menuButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
      const backdrop = document.createElement("div");
      backdrop.className = "gallery-menu-backdrop";
      backdrop.hidden = true;
      backdrop.setAttribute("aria-hidden", "true");
      shell.insertBefore(menuButton, aside);
      shell.insertBefore(backdrop, aside);
      const isMobile = () => window.matchMedia("(max-width: 760px)").matches;
      const setMenuOpen = (open, restoreFocus = false) => {
        const active = open && isMobile();
        document.documentElement.classList.toggle("gallery-menu-open", active);
        menuButton.setAttribute("aria-expanded", String(active));
        menuButton.setAttribute("aria-label", active ? "Close screen menu" : "Open screen menu");
        menuButton.querySelector("path").setAttribute("d", active ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16");
        backdrop.hidden = !active;
        if (active) {
          aside.setAttribute("role", "dialog");
          aside.setAttribute("aria-modal", "true");
          aside.querySelector(".preview-nav a")?.focus();
        } else {
          aside.removeAttribute("role");
          aside.removeAttribute("aria-modal");
          if (restoreFocus && isMobile()) menuButton.focus();
        }
      };
      menuButton.addEventListener("click", () => setMenuOpen(!document.documentElement.classList.contains("gallery-menu-open")));
      backdrop.addEventListener("click", () => setMenuOpen(false, true));
      aside.querySelectorAll(".preview-nav a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
      document.addEventListener("keydown", (event) => {
        if (!document.documentElement.classList.contains("gallery-menu-open")) return;
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopImmediatePropagation();
          setMenuOpen(false, true);
        }
        if (event.key === "Tab") {
          const controls = [menuButton, ...aside.querySelectorAll('a[href],button:not([disabled])')];
          const first = controls[0], last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }, true);
      window.addEventListener("resize", () => {
        if (!isMobile() && document.documentElement.classList.contains("gallery-menu-open")) setMenuOpen(false);
      });
    }
  }
  // Keep Actions a bottom sheet; only the four destination tabs are pages.
  const tabs = document.querySelector(".home11-phone .phone-tabs");
  if (tabs) {
    const targets = [
      { label: "Home", href: "mobile-demo-1-1.html" },
      { label: "Activity", href: "mobile-activity.html" },
      { label: "dApps", href: "mobile-dapps.html" },
      { label: "Settings", href: "mobile-settings.html" },
    ];
    tabs.querySelectorAll(".home11-nav-item").forEach((span) => {
      const name = span.textContent.trim();
      const target = targets.find((entry) => entry.label === name);
      if (!target) return;
      const a = document.createElement("a");
      a.className = "home11-nav-item" + (file === target.href ? " is-current" : "");
      a.href = "./" + target.href;
      a.innerHTML = span.innerHTML;
      if (file === target.href) a.setAttribute("aria-current", "page");
      span.replaceWith(a);
    });
  }
  const translatePage = () => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = "Fresnica — " + (lang === "zh" ? current.zh : current.en);
    document.querySelectorAll("[data-gallery-en][data-gallery-zh]").forEach((el) => {
      el.textContent = el.getAttribute("data-gallery-" + lang);
    });
    const walker = document.createTreeWalker(document.querySelector(".preview-stage") || document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest("style,script")) continue;
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const source = originalText.get(node);
      const trimmed = source.trim();
      if (!trimmed || !Object.hasOwn(t, trimmed)) continue;
      node.nodeValue = source.replace(trimmed, lang === "zh" ? t[trimmed] : trimmed);
    }
    document.querySelectorAll('[data-gallery-value="language"]').forEach((el) => {
      el.textContent = lang === "zh" ? "中文" : "English";
    });
    document.querySelectorAll('[data-gallery-value="appearance"]').forEach((el) => {
      el.textContent = theme === "dark" ? (lang === "zh" ? "深色" : "Dark") : (lang === "zh" ? "浅色" : "Light");
    });
    document.querySelectorAll("[data-gallery-language]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.galleryLanguage === lang)));
    document.querySelectorAll("[data-gallery-theme]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.galleryTheme === theme)));
  };
  const applyTheme = () => {
    document.documentElement.dataset.demoTheme = theme;
    document.documentElement.style.colorScheme = theme;
    translatePage();
  };
  document.querySelectorAll("[data-gallery-language]").forEach((button) => button.addEventListener("click", () => {
    lang = button.dataset.galleryLanguage;
    storeSetting("fresnica-gallery-language", lang);
    translatePage();
  }));
  document.querySelectorAll("[data-gallery-theme]").forEach((button) => button.addEventListener("click", () => {
    theme = button.dataset.galleryTheme;
    storeSetting("fresnica-gallery-theme", theme);
    applyTheme();
  }));
  const overlay = document.querySelector(".gallery-dialog-overlay");
  const openerButtons = document.querySelectorAll("[data-gallery-dialog-open], [data-gallery-dialog-app]");
  const closer = overlay?.querySelector("[data-gallery-dialog-close]");
  if (overlay && openerButtons.length && closer) {
    const websiteInput = overlay.querySelector("[data-gallery-website-input]");
    const reviewWebsite = overlay.querySelector("[data-gallery-review-website]");
    let focusedOpener;
    const updateReview = () => {
      if (!reviewWebsite || !websiteInput) return;
      const value = websiteInput.value.trim();
      const site = value.replace(/^https?:\/\//i, "").split("/")[0].slice(0, 36);
      reviewWebsite.textContent = site || (lang === "zh" ? "未选择" : "Not selected");
    };
    const close = () => {
      overlay.hidden = true;
      focusedOpener?.focus();
    };
    openerButtons.forEach((button) => button.addEventListener("click", () => {
      focusedOpener = button;
      overlay.hidden = false;
      if (websiteInput) {
        websiteInput.value = button.dataset.galleryDialogApp ? "https://" + button.dataset.galleryDialogApp.toLowerCase() + ".example" : "";
        updateReview();
        websiteInput.focus();
      } else closer.focus();
    }));
    websiteInput?.addEventListener("input", updateReview);
    closer.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    overlay.querySelector("[data-gallery-confirm-connect]")?.addEventListener("click", showPreviewNotice);
    document.addEventListener("keydown", (event) => {
      if (overlay.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "Tab") {
        const controls = [...overlay.querySelectorAll("input, button:not([disabled])")];
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
  applyTheme();
})();
