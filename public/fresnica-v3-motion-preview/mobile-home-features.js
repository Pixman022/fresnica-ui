/* Home-only UI flows. No network access, wallet secrets or ledger writes. */
(() => {
  const phone = document.querySelector(".home11-phone");
  const networkTrigger = phone?.querySelector(".home11-network-trigger");
  const categoryTrigger = phone?.querySelector(".home11-category-trigger");
  const addTrigger = phone?.querySelector(".phone-asset-add");
  const refreshTrigger = phone?.querySelector(".home11-refresh");
  const assetList = phone?.querySelector(".phone-list");
  const scroll = phone?.querySelector(".home11-scroll");
  if (!phone || !networkTrigger || !categoryTrigger || !addTrigger || !refreshTrigger || !assetList || !scroll) return;

  const walletPopup = phone.querySelector("#home11-wallet-selector");
  const walletSwitch = phone.querySelector(".home11-wallet-switch");
  const walletList = walletPopup?.querySelector(".home11-wallet-list-view");
  const rows = [...assetList.querySelectorAll(".phone-asset")];
  const zh = () => document.documentElement.lang.startsWith("zh");
  const t = (english, chinese) => zh() ? chinese : english;
  const catalog = [
    {code: "USDC", issuer: "Existing wallet asset", added: true},
    {code: "AQUA", issuer: "Existing wallet asset", added: true},
    {code: "DEMO", issuer: "Issuer not verified — example only", added: false},
  ];
  let category = "assets";
  let network = "mainnet";
  let status = "connected";
  let refreshTimer = 0;
  let modalView = "";
  let addMode = "catalog";
  let selectedAsset = null;
  let focusReturn = null;

  const empty = document.createElement("div");
  empty.className = "home-feature-empty";
  empty.hidden = true;
  const statePanel = document.createElement("div");
  statePanel.className = "home-feature-state";
  statePanel.setAttribute("role", "status");
  statePanel.hidden = true;
  assetList.append(empty, statePanel);

  const overlay = document.createElement("div");
  overlay.className = "home11-feature-overlay home11-action-overlay";
  overlay.id = "home11-feature-overlay";
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="home11-action-backdrop" data-feature-close="true"></div>' +
    '<section class="home-feature-sheet" role="dialog" aria-modal="true" aria-labelledby="home11-feature-title">' +
    '<div class="home-feature-heading"><h2 id="home11-feature-title"></h2>' +
    '<button type="button" class="home-feature-close" data-feature-close="true" aria-label="Close">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
    '<div class="home-feature-body"></div></section>';
  phone.append(overlay);
  const title = overlay.querySelector("#home11-feature-title");
  const body = overlay.querySelector(".home-feature-body");

  const option = (id, heading, subtitle, checked, attr) =>
    '<button type="button" class="home-feature-option' + (checked ? " is-selected" : "") +
    '" ' + attr + '="' + id + '" aria-pressed="' + (checked ? "true" : "false") + '">' +
    '<span><strong>' + heading + '</strong>' + (subtitle ? '<small>' + subtitle + '</small>' : '') +
    '</span><span class="home-feature-check" aria-hidden="true">' + (checked ? "✓" : "›") + '</span></button>';
  const close = () => {
    if (overlay.hidden) return;
    overlay.hidden = true;
    modalView = "";
    if (focusReturn?.isConnected && !focusReturn.closest("[hidden]")) focusReturn.focus();
    else walletSwitch?.focus();
    focusReturn = null;
  };
  const open = (view, trigger) => {
    if (!overlay.hidden) close();
    focusReturn = trigger;
    modalView = view;
    overlay.hidden = false;
    render();
    overlay.querySelector(".home-feature-close").focus();
  };
  const setView = (view) => {
    modalView = view;
    render();
    overlay.querySelector(".home-feature-close").focus();
  };
  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-feature-close]")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
    } else if (event.key === "Tab") {
      const elements = [...overlay.querySelectorAll("button:not([disabled]), input:not([disabled])")].filter(el => el.getClientRects().length);
      if (!elements.length) return;
      if (event.shiftKey && document.activeElement === elements[0]) { event.preventDefault(); elements[elements.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === elements[elements.length - 1]) { event.preventDefault(); elements[0].focus(); }
    }
  }, true);

  const categories = {
    assets: ["Your assets", "我的资产"],
    claimable: ["Claimable balances", "待领取资产"],
    pools: ["Liquidity pools", "流动性池"],
  };
  const updateHome = () => {
    const selected = categories[category];
    categoryTrigger.querySelector("span").textContent = t(selected[0], selected[1]);
    const networkLabel = network === "mainnet" ? t("Stellar Mainnet", "Stellar 主网") : t("Stellar Testnet", "Stellar 测试网");
    networkTrigger.querySelector("[data-home-network-label]").textContent = networkLabel;
    networkTrigger.dataset.status = status === "error" ? "unavailable" : status;
    networkTrigger.setAttribute("aria-label", networkLabel + ", " + ({
      connected: t("connected", "已连接"), offline: t("offline", "离线"),
      loading: t("loading", "加载中"), error: t("unavailable", "不可用")
    }[status]));
    refreshTrigger.classList.toggle("is-loading", status === "loading");
    refreshTrigger.disabled = status === "loading";
    addTrigger.hidden = category !== "assets" || status !== "connected" || network !== "mainnet";
    const canShow = status === "connected" && network === "mainnet";
    rows.forEach(row => { row.hidden = !canShow || category !== "assets"; });
    empty.hidden = !canShow || category === "assets";
    statePanel.hidden = canShow;
    if (canShow && category !== "assets") {
      empty.innerHTML = '<strong>' + t(category === "claimable" ? "No claimable balances" : "No liquidity pools",
        category === "claimable" ? "暂无待领取资产" : "暂无流动性池") + '</strong>' +
        '<p>' + t("No records in this example view.", "当前示例没有相关记录。") + '</p>';
    }
    if (!canShow) {
      const label = network === "testnet" ?
        t("Testnet data not loaded", "测试网数据尚未加载") :
        status === "loading" ? t("Loading balances", "正在加载余额") :
        status === "offline" ? t("No connection", "网络已断开") :
        status === "error" ? t("Balances unavailable", "余额暂不可用") : t("Wallet data unavailable", "钱包数据不可用");
      const detail = network === "testnet" ?
        t("Example Mainnet balances are hidden on Testnet.", "测试网不展示主网的示例余额。") :
        status === "loading" ? t("UI preview: loading state.", "界面预览：加载状态。") :
        t("This preview does not fetch live balances.", "此示例不读取真实链上余额。");
      statePanel.innerHTML = '<strong>' + label + '</strong><p>' + detail + '</p>' +
        '<button type="button" data-home-retry>' + t(network === "testnet" ? "Return to Mainnet" : "Retry",
          network === "testnet" ? "返回主网" : "重试") + '</button>';
      statePanel.querySelector("[data-home-retry]").addEventListener("click", () => {
        if (network === "testnet") network = "mainnet";
        refresh();
      });
    }
    if (walletPopup) {
      const note = walletPopup.querySelector(".home11-wallet-network-note");
      if (note) note.textContent = t("Accounts · ", "账户 · ") + networkLabel + t(" (sample only)", "（示例）");
    }
  };
  const changeStatus = (next) => {
    clearTimeout(refreshTimer);
    status = next;
    updateHome();
  };
  const refresh = () => {
    clearTimeout(refreshTimer);
    status = "loading";
    updateHome();
    refreshTimer = setTimeout(() => { status = "connected"; updateHome(); }, 750);
  };
  networkTrigger.addEventListener("click", () => open("network", networkTrigger));
  categoryTrigger.addEventListener("click", () => open("category", categoryTrigger));
  addTrigger.addEventListener("click", () => { addMode = "catalog"; selectedAsset = null; open("add", addTrigger); });
  refreshTrigger.addEventListener("click", refresh);

  // A pull gesture previews the loading and reloaded states; it never requests network data.
  let touchStart = null;
  scroll.addEventListener("touchstart", (event) => {
    touchStart = scroll.scrollTop < 2 && event.touches.length === 1 ? event.touches[0].clientY : null;
  }, {passive: true});
  scroll.addEventListener("touchend", (event) => {
    if (touchStart !== null && event.changedTouches.length &&
        event.changedTouches[0].clientY - touchStart > 68 && scroll.scrollTop < 2) refresh();
    touchStart = null;
  }, {passive: true});

  const showError = (message) => {
    let error = body.querySelector(".home-feature-error");
    if (!error) {
      error = document.createElement("p");
      error.className = "home-feature-error";
      error.setAttribute("role", "alert");
      body.append(error);
    }
    error.textContent = message;
  };
  const updateCatalog = () => {
    const box = body.querySelector("[data-home-catalog-results]");
    const input = body.querySelector("[data-home-search]");
    if (!box || !input) return;
    const query = input.value.trim().toLowerCase();
    const matches = catalog.filter(asset => asset.code.toLowerCase().includes(query));
    box.innerHTML = matches.length ? matches.map(asset =>
      '<button type="button" class="home-feature-option" data-home-catalog-asset="' + asset.code +
      '"' + (asset.added ? " disabled" : "") + '><span><strong>' + asset.code + '</strong><small>' +
      t(asset.added ? "Already added" : asset.issuer,
        asset.added ? "已添加" : "仅供示例，发行方未验证") +
      '</small></span><span class="home-feature-check">' +
      (asset.added ? "✓" : "›") + '</span></button>').join("") :
      '<p class="home-feature-description">' + t("No matching assets", "没有匹配的资产") + '</p>';
    box.querySelectorAll("[data-home-catalog-asset]").forEach(button => button.addEventListener("click", () => {
      selectedAsset = {code: button.dataset.homeCatalogAsset, issuer: t("Not verified (demo catalog)", "未验证（示例目录）")};
      setView("review");
    }));
  };

  function render() {
    const headings = {
      network: ["Network", "网络"],
      category: ["Asset categories", "资产分类"],
      add: ["Add asset", "添加资产"],
      review: ["Review asset change", "审阅资产变更"],
      account: ["Add account", "添加账户"],
      import: ["Import wallet", "导入钱包"],
      watch: ["Watch-only account", "只读账户"],
    };
    const heading = headings[modalView] || headings.network;
    title.textContent = t(heading[0], heading[1]);
    if (modalView === "category") {
      body.innerHTML =
        option("assets", t("Assets", "资产"), t("Issued and native assets", "原生及发行资产"), category === "assets", "data-home-category") +
        option("claimable", t("Claimable balances", "待领取资产"), t("Pending claims", "可领取记录"), category === "claimable", "data-home-category") +
        option("pools", t("Liquidity pools", "流动性池"), t("Pool positions", "流动性池持仓"), category === "pools", "data-home-category");
      body.querySelectorAll("[data-home-category]").forEach(button => button.addEventListener("click", () => {
        category = button.dataset.homeCategory;
        updateHome();
        close();
      }));
    } else if (modalView === "network") {
      body.innerHTML = '<span class="home-feature-subtitle">' + t("Select network", "选择网络") + '</span>' +
        option("mainnet", "Stellar Mainnet", "", network === "mainnet", "data-home-network") +
        option("testnet", "Stellar Testnet", t("Demo only", "仅供示例"), network === "testnet", "data-home-network") +
        '<span class="home-feature-subtitle">' + t("Connection preview", "连接状态预览") + '</span>' +
        '<div class="home-feature-modes">' +
        ["connected", "loading", "offline", "error"].map(key => '<button type="button" data-home-state="' +
          key + '" class="' + (status === key ? "is-selected" : "") + '">' +
          ({connected:t("Online","在线"),loading:t("Loading","加载"),
            offline:t("Offline","离线"),error:t("Error","异常")})[key] + '</button>').join("") + '</div>' +
        '<p class="home-feature-description">' +
        t("Preview only. Network selection never connects to a ledger.", "仅界面预览，切换网络不会连接真实账本。") + '</p>' +
        '<button type="button" class="home-feature-button is-primary" data-home-refresh>' +
        t("Refresh preview", "刷新预览") + '</button>';
      body.querySelectorAll("[data-home-network]").forEach(button => button.addEventListener("click", () => {
        network = button.dataset.homeNetwork;
        status = "connected";
        clearTimeout(refreshTimer);
        updateHome();
        render();
      }));
      body.querySelectorAll("[data-home-state]").forEach(button => button.addEventListener("click", () => {
        changeStatus(button.dataset.homeState);
        render();
      }));
      body.querySelector("[data-home-refresh]").addEventListener("click", () => { close(); refresh(); });
    } else if (modalView === "add") {
      body.innerHTML =
        '<div class="home-feature-modes">' +
        '<button type="button" data-home-add-mode="catalog" class="' + (addMode === "catalog" ? "is-selected" : "") + '">' +
          t("Catalog", "目录") + '</button>' +
        '<button type="button" data-home-add-mode="manual" class="' + (addMode === "manual" ? "is-selected" : "") + '">' +
          t("Manual", "手动") + '</button></div>' +
        (addMode === "catalog" ?
          '<label class="home-feature-label" for="home11-asset-search">' + t("Search assets", "搜索资产") + '</label>' +
          '<input id="home11-asset-search" class="home-feature-input" data-home-search autocomplete="off" placeholder="' +
          t("Code or name", "代码或名称") + '">' +
          '<p class="home-feature-description">' + t("Example catalog — not an endorsement.", "示例目录不代表对资产的背书。") + '</p>' +
          '<div data-home-catalog-results></div>' :
          '<label class="home-feature-label" for="home11-code">' + t("Asset code", "资产代码") + '</label>' +
          '<input id="home11-code" class="home-feature-input" maxlength="12" placeholder="CODE" autocomplete="off">' +
          '<label class="home-feature-label" for="home11-issuer">' + t("Issuer address", "发行方地址") + '</label>' +
          '<input id="home11-issuer" class="home-feature-input" maxlength="56" placeholder="G..." autocomplete="off">' +
          '<button type="button" class="home-feature-button is-primary" style="margin-top:12px;width:100%" data-home-review>' +
          t("Review asset", "审阅资产") + '</button>' +
          '<span class="home-feature-subtitle">' + t("Asset catalog URL", "资产目录地址") + '</span>' +
          '<input type="url" class="home-feature-input" id="home11-catalog-url" placeholder="https://example.com">' +
          '<button type="button" class="home-feature-button" style="margin-top:8px;width:100%" data-home-load>' +
          t("Load catalog", "加载目录") + '</button>');
      body.querySelectorAll("[data-home-add-mode]").forEach(button => button.addEventListener("click", () => {
        addMode = button.dataset.homeAddMode;
        render();
      }));
      if (addMode === "catalog") {
        body.querySelector("[data-home-search]").addEventListener("input", updateCatalog);
        updateCatalog();
      } else {
        body.querySelector("[data-home-review]").addEventListener("click", () => {
          const code = body.querySelector("#home11-code").value.trim().toUpperCase();
          const issuer = body.querySelector("#home11-issuer").value.trim().toUpperCase();
          if (!/^[A-Z0-9]{1,12}$/.test(code)) return showError(t("Enter a valid asset code (1–12 letters or digits).", "请输入有效资产代码（1–12 位字母或数字）。"));
          if (!/^G[A-Z2-7]{55}$/.test(issuer)) return showError(t("Enter a complete Stellar G-address (56 characters).", "请输入完整的 Stellar G 地址（56 位）。"));
          selectedAsset = {code, issuer};
          setView("review");
        });
        body.querySelector("[data-home-load]").addEventListener("click", () => {
          const url = body.querySelector("#home11-catalog-url");
          if (!url.value || !url.checkValidity() || !/^https:\/\//i.test(url.value))
            return showError(t("Enter a valid HTTPS catalog URL.", "请输入有效的 HTTPS 目录地址。"));
          showError(t("Preview only: external catalogs are not loaded.", "仅界面预览：不会实际加载外部目录。"));
        });
      }
    } else if (modalView === "review") {
      const accountName = phone.querySelector(".home11-wallet-name")?.textContent || "SuperWallet";
      body.innerHTML = '<dl class="home-feature-review">' +
        '<dt>' + t("Operation", "操作") + '</dt><dd>' + t("Add trustline", "添加信任线") + '</dd>' +
        '<dt>' + t("Source", "来源") + '</dt><dd data-review-source></dd>' +
        '<dt>' + t("Asset", "资产") + '</dt><dd data-review-asset></dd>' +
        '<dt>' + t("Issuer", "发行方") + '</dt><dd data-review-issuer></dd></dl>' +
        '<p class="home-feature-description">' +
        t("Verify the issuer before signing. Preview only — no XDR is built or signed.", "签名前必须核对发行方。此处仅为预览，不生成或签署交易。") +
        '</p><div class="home-feature-actions">' +
        '<button type="button" class="home-feature-button" data-home-back>' + t("Back", "返回") + '</button>' +
        '<button type="button" class="home-feature-button is-primary" data-home-done>' + t("Done", "完成") + '</button></div>';
      body.querySelector("[data-review-source]").textContent = accountName;
      body.querySelector("[data-review-asset]").textContent = selectedAsset?.code || "";
      body.querySelector("[data-review-issuer]").textContent = selectedAsset?.issuer || "";
      body.querySelector("[data-home-back]").addEventListener("click", () => setView("add"));
      body.querySelector("[data-home-done]").addEventListener("click", close);
    } else if (modalView === "account") {
      body.innerHTML = option("create", t("Create new wallet", "新建钱包"), t("Create a demo wallet", "新建示例钱包"), false, "data-home-account") +
        option("import", t("Import existing wallet", "导入已有钱包"), t("Recovery phrase or secret key", "助记词或私钥"), false, "data-home-account") +
        option("watch", t("Add watch-only account", "添加只读账户"), t("Public address only", "仅公开地址"), false, "data-home-account") +
        '<p class="home-feature-description">' + t("No real wallet is created or imported in this preview.", "此预览不会创建或导入真实钱包。") + '</p>';
      body.querySelectorAll("[data-home-account]").forEach(button => button.addEventListener("click", () => {
        if (button.dataset.homeAccount === "create") {
          close();
          walletSwitch?.click();
          walletPopup?.querySelector(".home11-wallet-create-entry")?.click();
        } else setView(button.dataset.homeAccount);
      }));
    } else if (modalView === "import" || modalView === "watch") {
      body.innerHTML = '<p class="home-feature-description">' +
        (modalView === "import" ?
        t("Recovery phrase and secret-key import are not active in this UI preview. Do not enter secret material here.", "当前界面预览不提供助记词或私钥导入。请勿在此输入秘密信息。") :
        t("A watch-only account can view its public address but cannot sign transactions. This preview does not add an actual account.", "只读账户可查看公开地址，但不能签名交易。此预览不实际添加账户。")) +
        '</p><button type="button" class="home-feature-button" data-home-back>' + t("Back", "返回") + '</button>';
      body.querySelector("[data-home-back]").addEventListener("click", () => setView("account"));
    }
  }

  // Extend the existing account selector without changing its source or the saved reference page.
  if (walletList && walletPopup) {
    const addAccount = document.createElement("button");
    addAccount.type = "button";
    addAccount.className = "home11-wallet-create-entry home11-wallet-add-entry";
    addAccount.innerHTML = '<span class="home11-wallet-create-icon" aria-hidden="true">+</span>' +
      '<span data-home-account-label>Add / import account</span>' +
      '<svg class="home11-wallet-create-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
    walletList.append(addAccount);
    const note = document.createElement("p");
    note.className = "home11-wallet-network-note";
    walletList.append(note);
    const simulator = document.createElement("label");
    simulator.className = "home11-wallet-simulate";
    simulator.innerHTML = '<input type="checkbox" data-home-switch-error><span data-home-error-label>Simulate save error</span>';
    walletList.append(simulator);
    const failure = document.createElement("div");
    failure.className = "home11-wallet-error";
    failure.setAttribute("role", "alert");
    failure.hidden = true;
    failure.innerHTML = '<span data-home-failure-message>Unable to save selected wallet. Current wallet unchanged.</span>' +
      '<button type="button" data-home-switch-retry>Retry</button>';
    walletList.append(failure);
    let failedChoice = null;
    const failToggle = simulator.querySelector("input");
    walletPopup.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-wallet-index]");
      if (!choice || !failToggle.checked) return;
      event.preventDefault();
      event.stopPropagation();
      failedChoice = choice;
      failure.hidden = false;
      failure.querySelector("[data-home-switch-retry]").focus();
    }, true);
    failure.querySelector("[data-home-switch-retry]").addEventListener("click", () => {
      failure.hidden = true;
      failToggle.checked = false;
      failedChoice?.click();
      failedChoice = null;
    });
    addAccount.addEventListener("click", () => {
      walletPopup.querySelector(".home11-wallet-sheet-close")?.click();
      open("account", walletSwitch);
    });
    const updateWalletCopy = () => {
      addAccount.querySelector("[data-home-account-label]").textContent = t("Add / import account", "添加／导入账户");
      simulator.querySelector("[data-home-error-label]").textContent = t("Simulate save error", "模拟保存失败");
      failure.querySelector("[data-home-failure-message]").textContent = t("Unable to save selected wallet. Current wallet unchanged.", "无法保存所选钱包，当前钱包保持不变。");
      failure.querySelector("[data-home-switch-retry]").textContent = t("Retry", "重试");
    };
    document.querySelectorAll("[data-gallery-language]").forEach(button => button.addEventListener("click", updateWalletCopy));
    updateWalletCopy();
  }
  document.querySelectorAll("[data-gallery-language]").forEach(button => button.addEventListener("click", () => {
    updateHome();
    if (!overlay.hidden) render();
  }));
  updateHome();
})();
