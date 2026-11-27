/* Illustrative secondary wallet flows. No Stellar SDK, signing, or network calls. */
(() => {
  const phone = document.querySelector(".secondary-phone");
  if (!phone) return;
  const isZh = () => document.documentElement.lang.startsWith("zh");
  const say = (en, zh) => isZh() ? zh : en;

  const toast = (en, zh) => {
    let element = phone.querySelector(".secondary-toast");
    if (!element) {
      element = document.createElement("div");
      element.className = "secondary-toast";
      element.setAttribute("role", "status");
      phone.appendChild(element);
    }
    element.textContent = say(en, zh);
    element.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { element.hidden = true; }, 2300);
  };
  const overlay = phone.querySelector(".secondary-review-overlay");
  const dialog = overlay?.querySelector(".secondary-sheet");
  const body = overlay?.querySelector("[data-secondary-sheet-body]");
  const title = overlay?.querySelector("[data-secondary-sheet-title]");
  let opener = null;

  const closeSheet = () => {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    opener?.focus();
  };
  const openSheet = (headingEn, headingZh, pairs, noteEn, noteZh) => {
    if (!overlay || !body || !title) return;
    opener = document.activeElement;
    title.textContent = say(headingEn, headingZh);
    const card = document.createElement("div");
    card.className = "secondary-card";
    for (const [labelEn, labelZh, value] of pairs) {
      const row = document.createElement("div");
      row.className = "secondary-pair";
      const label = document.createElement("span");
      label.textContent = say(labelEn, labelZh);
      const strong = document.createElement("strong");
      strong.textContent = value;
      row.append(label, strong);
      card.append(row);
    }
    const notice = document.createElement("p");
    notice.textContent = say(noteEn, noteZh);
    body.replaceChildren(card, notice);
    overlay.hidden = false;
    dialog.querySelector(".secondary-sheet-close")?.focus();
  };
  overlay?.addEventListener("click", (event) => {
    if (event.target.closest("[data-secondary-sheet-dismiss]")) closeSheet();
  });
  phone.addEventListener("keydown", (event) => {
    if (overlay?.hidden !== false) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeSheet();
    } else if (event.key === "Tab") {
      const targets = [...dialog.querySelectorAll("button:not([disabled]),input:not([disabled])")];
      const first = targets[0], last = targets[targets.length - 1];
      if (first && event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (last && !event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  const assetInfo = {
    xlm: { symbol: "XLM", balance: "546,213.0231432", label: "Stellar native asset", reserve: "12 XLM" },
    usdc: { symbol: "USDC", balance: "250.00", issuer: "GCPQ...R7KM" },
    aqua: { symbol: "AQUA", balance: "860.00", issuer: "GBZA...T4WN" },
  };
  if (phone.dataset.secondaryScreen === "asset-details") {
    const asset = new URLSearchParams(location.search).get("asset")?.toLowerCase() || "xlm";
    const chosen = assetInfo[asset] || assetInfo.xlm;
    const native = chosen.symbol === "XLM";
    const set = (selector, value) => { const element = phone.querySelector(selector); if (element) element.textContent = value; };
    const mark = phone.querySelector("[data-asset-mark]");
    if (mark) {
      mark.classList.remove("is-usdc", "is-aqua");
      if (native) mark.textContent = "✦";
      else {
        mark.classList.add(chosen.symbol === "USDC" ? "is-usdc" : "is-aqua");
        mark.innerHTML = chosen.symbol === "USDC" ?
          '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5c-1.1-1-2.2-1.5-3.5-1.5-2.1 0-3.5 1.1-3.5 2.6 0 3.7 7 1.5 7 5.1 0 1.6-1.5 2.7-3.5 2.7-1.4 0-2.8-.6-4-1.7M12 5.5v13"/></svg>' :
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8c2.3-2 4.4-2 6.7 0s4.4 2 6.7 0 4.4-2 4.6-2M3 14c2.3-2 4.4-2 6.7 0s4.4 2 6.7 0 4.4-2 4.6-2M3 20c2.3-2 4.4-2 6.7 0s4.4 2 6.7 0 4.4-2 4.6-2"/></svg>';
      }
    }
    set("[data-asset-label]", chosen.symbol);
    set("[data-asset-balance]", chosen.balance);
    set("[data-asset-symbol]", chosen.symbol);
    const reserveSection = phone.querySelector("[data-asset-reserve-section]");
    if (reserveSection) reserveSection.hidden = !native;
    if (native) {
      set("[data-asset-reserve]", chosen.reserve);
      const toggle = phone.querySelector("[data-asset-reserve-toggle]");
      const details = phone.querySelector("[data-asset-reserve-details]");
      toggle?.addEventListener("click", () => {
        if (!details) return;
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        details.hidden = expanded;
        toggle.setAttribute("aria-expanded", String(!expanded));
      });
    }
    // For issued Stellar assets, the identity subtitle is the abbreviated
    // G-address of the issuer shown elsewhere in this illustrative gallery.
    const note = phone.querySelector("[data-asset-note]");
    if (note) {
      note.dataset.galleryEn = native ? chosen.label : chosen.issuer;
      note.dataset.galleryZh = native ? "Stellar 原生资产" : chosen.issuer;
      note.textContent = say(note.dataset.galleryEn, note.dataset.galleryZh);
    }
    const activityTitle = phone.querySelector("[data-asset-activity-title]");
    const activityList = phone.querySelector("[data-asset-activity-list]");
    if (chosen.symbol === "USDC" && activityList) {
      activityList.innerHTML =
        '<a class="secondary-history-row" href="./mobile-transaction-details.html?tx=received-usdc">' +
        '<span class="secondary-history-icon"><svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M17 17H7V7M17 7 7 17"/></svg></span>' +
        '<span class="secondary-history-copy"><b><span data-gallery-en="Received USDC" data-gallery-zh="收到 USDC">Received USDC</span></b>' +
        '<small>Nov 26</small></span><strong class="secondary-history-value secondary-positive">+250.00 USDC</strong></a>';
    }
    const hasActivity = native || chosen.symbol === "USDC";
    if (activityTitle) activityTitle.hidden = !hasActivity;
    if (activityList) activityList.hidden = !hasActivity;
    phone.querySelectorAll('.secondary-action[href*="mobile-send.html"],.secondary-action[href*="mobile-swap.html"]').forEach((link) => {
      const url = new URL(link.href);
      url.searchParams.set("asset", chosen.symbol.toLowerCase());
      link.href = url.href;
    });
  }
  if (phone.dataset.secondaryScreen === "send") {
    const token = new URLSearchParams(location.search).get("asset")?.toUpperCase();
    const asset = phone.querySelector("#secondary-send-asset");
    if (asset && ["XLM", "USDC", "AQUA"].includes(token)) asset.value = token;
  }
  if (phone.dataset.secondaryScreen === "swap") {
    const token = new URLSearchParams(location.search).get("asset")?.toUpperCase();
    const from = phone.querySelector("#secondary-swap-from");
    const to = phone.querySelector("#secondary-swap-to");
    if (from && to && ["XLM", "USDC", "AQUA"].includes(token)) {
      from.value = token;
      if (to.value === token) to.value = token === "XLM" ? "USDC" : "XLM";
    }
  }
  const transactions = {
    "received-usdc": { amount: "+250.00", asset: "USDC", description: "Received USDC", zh: "收到 USDC", kind: "Receive", date: "Nov 26, 2026" },
    "sent-xlm": { amount: "-45.00", asset: "XLM", description: "Sent XLM", zh: "发送 XLM", kind: "Send", date: "Nov 26, 2026" },
    "swapped-xlm": { amount: "+120.00", asset: "USDC", description: "Swapped XLM to USDC", zh: "XLM 兑换为 USDC", kind: "Swap", date: "Nov 25, 2026" },
    "received-xlm": { amount: "+900.00", asset: "XLM", description: "Received XLM", zh: "收到 XLM", kind: "Receive", date: "Nov 25, 2026" },
  };
  if (phone.dataset.secondaryScreen === "transaction-details") {
    const tx = new URLSearchParams(location.search).get("tx");
    const chosen = transactions[tx] || transactions["received-usdc"];
    const data = {
      "[data-tx-amount]": chosen.amount, "[data-tx-asset]": chosen.asset, "[data-tx-asset-row]": chosen.asset,
      "[data-tx-kind]": chosen.kind, "[data-tx-date]": chosen.date
    };
    for (const [selector, value] of Object.entries(data)) {
      const node = phone.querySelector(selector);
      if (node) node.textContent = value;
    }
    const desc = phone.querySelector("[data-tx-description]");
    if (desc) {
      desc.dataset.galleryEn = chosen.description;
      desc.dataset.galleryZh = chosen.zh;
      desc.textContent = say(chosen.description, chosen.zh);
    }
  }
  phone.querySelector(".secondary-back")?.addEventListener("click", (event) => {
    // Prefer actual entry route when navigating between gallery pages, not unrelated sites.
    try {
      const previous = new URL(document.referrer);
      if (previous.origin === location.origin && previous.pathname.includes("/fresnica-v3-motion-preview/") &&
          previous.pathname !== location.pathname) {
        event.preventDefault();
        history.back();
      }
    } catch (_) { /* Direct-entry fallback is the link's href. */ }
  });
  phone.querySelector("[data-secondary-switch-pair]")?.addEventListener("click", () => {
    const from = phone.querySelector("#secondary-swap-from");
    const to = phone.querySelector("#secondary-swap-to");
    if (!from || !to) return;
    const prior = from.value;
    from.value = to.value;
    to.value = prior;
  });
  phone.querySelectorAll("[data-secondary-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.secondaryAction;
      if (action === "preview-address") {
        toast("Example address cannot be copied or used.", "示例地址不可复制，也不能用于转账。");
        return;
      }
      if (action === "review-endpoint") {
        const input = phone.querySelector("#secondary-node-url");
        const value = input?.value.trim();
        if (!value) { input?.focus(); toast("Enter a Horizon URL first.", "请先输入 Horizon 节点地址。"); return; }
        openSheet("Endpoint preview", "端点预览", [["Endpoint", "端点", value], ["Network", "网络", "Stellar Mainnet"]],
          "No endpoint was contacted, verified or saved.", "不会连接、验证或保存此端点。");
        return;
      }
      if (action === "review-send") {
        const address = phone.querySelector("#secondary-send-recipient");
        const amount = phone.querySelector("#secondary-send-amount");
        const asset = phone.querySelector("#secondary-send-asset");
        if (!address.value.trim()) { address.focus(); toast("Enter a recipient address.", "请输入收款地址。"); return; }
        if (!(Number(amount.value) > 0)) { amount.focus(); toast("Enter an amount greater than zero.", "请输入大于零的数量。"); return; }
        openSheet("Transfer preview", "转账预览", [
          ["Asset", "资产", asset.value], ["Amount", "数量", amount.value],
          ["Recipient", "收款方", address.value], ["Memo", "备注", phone.querySelector("#secondary-send-memo").value || "—"]
        ], "No signature, fee estimate or network request is generated.", "此示例不会签名、估算手续费或发送网络请求。");
        return;
      }
      if (action === "review-swap") {
        const amount = phone.querySelector("#secondary-swap-amount");
        const from = phone.querySelector("#secondary-swap-from");
        const to = phone.querySelector("#secondary-swap-to");
        if (from.value === to.value) { to.focus(); toast("Choose two different assets.", "请选择两种不同的资产。"); return; }
        if (!(Number(amount.value) > 0)) { amount.focus(); toast("Enter an amount greater than zero.", "请输入大于零的数量。"); return; }
        openSheet("Swap preview", "兑换预览", [
          ["From", "支付", phone.querySelector("#secondary-swap-from").value],
          ["To", "获得", phone.querySelector("#secondary-swap-to").value],
          ["Amount", "数量", amount.value]
        ], "No live quote or asset exchange is performed.", "不会获取实时报价或进行资产兑换。");
      }
    });
  });
})();
