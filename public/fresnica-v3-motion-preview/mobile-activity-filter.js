/* Activity preview: loaded-example search, filters, compact status and local date groups. */
(() => {
  const phone = document.querySelector(".home11-phone.gallery-activity-page");
  const trigger = phone?.querySelector(".gallery-activity-filter-trigger");
  const overlay = phone?.querySelector(".gallery-activity-filter-overlay");
  const searchToggle = phone?.querySelector(".gallery-activity-search-trigger");
  const searchPanel = phone?.querySelector(".gallery-activity-search");
  const searchInput = phone?.querySelector(".gallery-activity-search-input");
  const clearSearch = phone?.querySelector(".gallery-activity-search-clear");
  const noMatch = phone?.querySelector(".gallery-activity-no-match");
  const sections = [...(phone?.querySelectorAll(".home11-scroll .gallery-panel") || [])];
  const rows = sections.flatMap(section => [...section.querySelectorAll("[data-activity-kind]")]);
  if (!trigger || !overlay || !searchToggle || !searchPanel || !searchInput || !clearSearch || !noMatch ||
      !sections.length || !rows.length) return;

  const defaults = () => ({
    kind: "all", direction: "all", family: "all", asset: "all",
    amountMode: "any", amount: "", hideDust: false, showMarked: false,
    showFailed: false, hiddenAssets: [],
  });
  let applied = defaults();
  let draft = defaults();
  let currentTab = "basic";
  const zh = () => document.documentElement.lang.startsWith("zh");
  const labels = {
    "Search activity": "搜索交易", "Clear search": "清除搜索",
    "Searches loaded activity only": "仅搜索已加载的交易",
    "Filter options": "筛选选项", "Basic": "基础", "Advanced": "高级",
    "All activity": "全部记录", "Received": "已收款", "Sent": "已发送", "Swapped": "已兑换",
    "Direction": "方向", "All": "全部", "Incoming": "收入", "Outgoing": "支出",
    "Operation type": "操作类型", "Payments": "支付", "Swaps": "兑换", "Account": "账户",
    "Trustline": "信任线", "Other": "其他", "Asset": "资产", "Search asset": "搜索资产",
    "Search code or issuer": "搜索代码或发行方", "Amount": "金额",
    "Amount comparison": "金额比较", "Amount value": "金额数值",
    "Any": "不限", "Greater than": "大于", "Less than": "小于",
    "Hide dust": "隐藏小额收款", "Hide incoming amounts under 1": "隐藏小于 1 的收入",
    "Show marked": "显示已隐藏记录", "Include hidden sample records": "包括隐藏的示例记录",
    "Show failed": "显示失败交易", "Include failed sample operations": "包括失败的示例操作",
    "Manage hidden assets": "管理隐藏资产", "Hide assets from the list": "在列表中隐藏以下资产",
    "Filters apply to loaded sample records only.": "筛选仅作用于已加载的示例记录。",
    "Reset": "重置", "Apply": "应用", "No matching activity": "没有匹配的交易",
    "Try a different search or filter.": "尝试其他搜索内容或筛选条件。",
    "Completed": "已完成", "Failed": "失败", "Pending": "待处理",
    "Failed XLM payment": "XLM 支付失败", "Today": "今天", "Yesterday": "昨天",
    "Enter an amount of 0 or more.": "请输入大于或等于 0 的金额。",
  };
  const reverse = Object.fromEntries(Object.entries(labels).map(([en,cn]) => [cn,en]));
  const sources = new WeakMap();
  const localNodes = [];
  const walker = document.createTreeWalker(phone, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode, trimmed = node.nodeValue.trim();
    if (node.parentElement?.closest("style,script")) continue;
    const english = Object.hasOwn(labels,trimmed) ? trimmed : reverse[trimmed];
    if (!english) continue;
    sources.set(node, english);
    localNodes.push(node);
  }
  const locale = (en) => zh() ? (labels[en] || en) : en;
  const localize = () => {
    localNodes.forEach(node => {
      if (!node.isConnected) return;
      const en = sources.get(node);
      if (!en) return;
      const current = node.nodeValue.trim();
      node.nodeValue = node.nodeValue.replace(current, locale(en));
    });
    phone.querySelectorAll("[data-activity-day]").forEach(heading => {
      const day = Number(heading.dataset.activityDay);
      const date = new Date();
      date.setHours(12,0,0,0);
      date.setDate(date.getDate() - day);
      heading.querySelector("span").textContent = locale(day ? "Yesterday" : "Today");
      heading.querySelector("[data-activity-date]").textContent = new Intl.DateTimeFormat(
        zh() ? "zh-CN" : "en-US", {month:"short",day:"numeric"}
      ).format(date);
      heading.nextElementSibling?.setAttribute("aria-label", locale(day ? "Yesterday" : "Today"));
    });
    searchInput.placeholder = locale("Search activity");
    searchInput.setAttribute("aria-label", locale("Search activity"));
    searchToggle.setAttribute("aria-label", locale("Search activity"));
    searchToggle.title = locale("Search activity");
    clearSearch.setAttribute("aria-label", locale("Clear search"));
    clearSearch.title = locale("Clear search");
    overlay.querySelector("[data-activity-asset-search]").placeholder = locale("Search code or issuer");
    overlay.querySelector("[data-activity-asset-search]").setAttribute("aria-label", locale("Search asset"));
    overlay.querySelector("[data-activity-amount-mode]").setAttribute("aria-label", locale("Amount comparison"));
    overlay.querySelector("[data-activity-amount-value]").placeholder = locale("Amount");
    overlay.querySelector("[data-activity-amount-value]").setAttribute("aria-label", locale("Amount value"));
    noMatch.querySelector("strong").textContent = locale("No matching activity");
    noMatch.querySelector("small").textContent = locale("Try a different search or filter.");
    rows.forEach(row => {
      const status = row.querySelector(".gallery-activity-status");
      if (status) status.textContent = locale(row.dataset.activityStatus === "failed" ? "Failed" :
        row.dataset.activityStatus === "pending" ? "Pending" : "Completed");
    });
  };

  // These dates belong to illustrative records; use the viewer's local Today/Yesterday.
  // Today's two times are scaled within elapsed local time so neither appears in the future.
  const clock = new Date();
  const minutesSoFar = clock.getHours()*60 + clock.getMinutes();
  sections[0]?.querySelectorAll("time[data-activity-clock]").forEach((time,index) => {
    const minutes = Math.floor(minutesSoFar * (index === 0 ? .72 : .42));
    time.textContent = String(Math.floor(minutes/60)).padStart(2,"0") + ":" +
      String(minutes%60).padStart(2,"0");
  });

  const matches = row => {
    const type = row.dataset.activityKind || "";
    const asset = row.dataset.activityAsset || "";
    const family = row.dataset.activityFamily || "other";
    const direction = row.dataset.activityDirection || "";
    const amount = row.dataset.activityAmount === "" ? null : Number(row.dataset.activityAmount);
    if (applied.kind !== "all" && applied.kind !== type) return false;
    if (applied.direction !== "all" && applied.direction !== direction) return false;
    if (applied.family !== "all" && applied.family !== family) return false;
    if (applied.asset !== "all" && applied.asset !== asset) return false;
    if (applied.hiddenAssets.includes(asset)) return false;
    if (row.dataset.activityStatus === "failed" && !applied.showFailed) return false;
    if (row.dataset.activityMarked === "true" && !applied.showMarked) return false;
    if (applied.hideDust && direction === "incoming" && amount !== null && amount < 1) return false;
    if (applied.amountMode !== "any") {
      if (amount === null || !Number.isFinite(amount)) return false;
      const threshold = Number(applied.amount);
      if (applied.amountMode === "greater" ? amount <= threshold : amount >= threshold) return false;
    }
    const query = searchInput.value.trim().toLocaleLowerCase();
    if (!query) return true;
    const title = row.querySelector(".gallery-row-copy b")?.textContent || "";
    const clockTime = row.querySelector("time")?.textContent || "";
    const fields = [title,asset,type,family,direction,row.dataset.activityStatus,clockTime];
    return fields.join(" ").toLocaleLowerCase().includes(query);
  };
  const refreshRows = () => {
    let visibleCount = 0;
    sections.forEach(section => {
      const list = [...section.querySelectorAll("[data-activity-kind]")];
      list.forEach(row => {
        row.hidden = !matches(row);
        if (!row.hidden) visibleCount++;
      });
      const hasVisible = list.some(row => !row.hidden);
      section.hidden = !hasVisible;
      const heading = section.previousElementSibling;
      if (heading?.matches(".gallery-section-title")) heading.hidden = !hasVisible;
    });
    noMatch.hidden = visibleCount !== 0;
    const changed = Object.keys(applied).some(key => key === "hiddenAssets" ?
      applied.hiddenAssets.length > 0 : applied[key] !== defaults()[key]);
    trigger.classList.toggle("is-filtered", changed);
    searchToggle.classList.toggle("is-active", !searchPanel.hidden && searchInput.value.trim().length > 0);
  };

  searchToggle.addEventListener("click", () => {
    if (!searchPanel.hidden) {
      searchInput.value = "";
      searchPanel.hidden = true;
      searchToggle.setAttribute("aria-expanded","false");
      refreshRows();
      searchToggle.focus();
      return;
    }
    searchPanel.hidden = false;
    searchToggle.setAttribute("aria-expanded","true");
    searchInput.focus();
  });
  searchInput.addEventListener("input", refreshRows);
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    refreshRows();
    searchInput.focus();
  });

  const close = (restoreFocus=false) => {
    overlay.hidden = true;
    trigger.setAttribute("aria-expanded","false");
    if (restoreFocus) trigger.focus();
  };
  const tabButtons = [...overlay.querySelectorAll("[data-activity-tab]")];
  const panes = [...overlay.querySelectorAll("[data-activity-pane]")];
  const setTab = value => {
    currentTab = value;
    tabButtons.forEach(button => {
      const active = button.dataset.activityTab === value;
      button.classList.toggle("is-current",active);
      button.setAttribute("aria-selected",String(active));
    });
    panes.forEach(pane => pane.hidden = pane.dataset.activityPane !== value);
  };
  const syncChoices = () => {
    overlay.querySelectorAll("[data-activity-filter]").forEach(button => {
      button.setAttribute("aria-pressed",String(button.dataset.activityFilter === draft.kind));
    });
    overlay.querySelectorAll("[data-activity-choice-group]").forEach(group => {
      const value = draft[group.dataset.activityChoiceGroup];
      group.querySelectorAll("[data-activity-choice]").forEach(button => {
        button.setAttribute("aria-pressed",String(button.dataset.activityChoice === value));
      });
    });
    overlay.querySelectorAll("[data-activity-switch]").forEach(input => {
      input.checked = Boolean(draft[input.dataset.activitySwitch]);
    });
    overlay.querySelectorAll("[data-activity-hide-asset]").forEach(input => {
      input.checked = draft.hiddenAssets.includes(input.value);
    });
    const amountMode = overlay.querySelector("[data-activity-amount-mode]");
    const amountValue = overlay.querySelector("[data-activity-amount-value]");
    amountMode.value = draft.amountMode;
    amountValue.value = draft.amount;
    amountValue.disabled = draft.amountMode === "any";
    overlay.querySelector(".gallery-activity-filter-error").hidden = true;
  };
  trigger.addEventListener("click", () => {
    if (!overlay.hidden) { close(true); return; }
    draft = {...applied, hiddenAssets:[...applied.hiddenAssets]};
    setTab("basic");
    syncChoices();
    overlay.querySelector(".gallery-activity-hidden-assets").hidden = true;
    overlay.querySelector("[data-activity-asset-search]").value = "";
    overlay.querySelectorAll("[data-activity-choice-group='asset'] button").forEach(button => button.hidden = false);
    overlay.hidden = false;
    trigger.setAttribute("aria-expanded","true");
    tabButtons[0].focus();
  });
  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-activity-filter-dismiss]")) { close(true); return; }
    const tab = event.target.closest("[data-activity-tab]");
    if (tab) { setTab(tab.dataset.activityTab); tab.focus(); return; }
    const quick = event.target.closest("[data-activity-filter]");
    if (quick) { draft.kind = quick.dataset.activityFilter; syncChoices(); return; }
    const chip = event.target.closest("[data-activity-choice]");
    if (chip) {
      draft[chip.closest("[data-activity-choice-group]").dataset.activityChoiceGroup] = chip.dataset.activityChoice;
      syncChoices();
      return;
    }
    if (event.target.closest(".gallery-activity-manage-hidden")) {
      const area = overlay.querySelector(".gallery-activity-hidden-assets");
      area.hidden = !area.hidden;
      return;
    }
    if (event.target.closest(".gallery-activity-reset")) {
      draft = defaults();
      syncChoices();
      return;
    }
    if (event.target.closest(".gallery-activity-apply")) {
      if (draft.amountMode !== "any" &&
          (draft.amount === "" || !Number.isFinite(Number(draft.amount)) || Number(draft.amount) < 0)) {
        const error = overlay.querySelector(".gallery-activity-filter-error");
        error.textContent = locale("Enter an amount of 0 or more.");
        error.hidden = false;
        overlay.querySelector("[data-activity-amount-value]").focus();
        return;
      }
      applied = {...draft, hiddenAssets:[...draft.hiddenAssets]};
      refreshRows();
      close(true);
    }
  });
  overlay.querySelector("[data-activity-asset-search]").addEventListener("input", event => {
    const query = event.target.value.trim().toLowerCase();
    overlay.querySelectorAll("[data-activity-choice-group='asset'] button").forEach(button => {
      button.hidden = query !== "" &&
        !(button.dataset.activityChoice + " " + (button.dataset.activityAssetIssuer || "")).toLowerCase().includes(query);
    });
  });
  overlay.querySelector("[data-activity-amount-mode]").addEventListener("change", event => {
    draft.amountMode = event.target.value;
    syncChoices();
  });
  overlay.querySelector("[data-activity-amount-value]").addEventListener("input", event => {
    draft.amount = event.target.value;
    overlay.querySelector(".gallery-activity-filter-error").hidden = true;
  });
  overlay.querySelectorAll("[data-activity-switch]").forEach(input => input.addEventListener("change", () => {
    draft[input.dataset.activitySwitch] = input.checked;
  }));
  overlay.querySelectorAll("[data-activity-hide-asset]").forEach(input => input.addEventListener("change", () => {
    if (input.checked && !draft.hiddenAssets.includes(input.value)) draft.hiddenAssets.push(input.value);
    if (!input.checked) draft.hiddenAssets = draft.hiddenAssets.filter(asset => asset !== input.value);
  }));
  phone.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      close(true);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...overlay.querySelectorAll("button:not(:disabled),input:not(:disabled),select:not(:disabled)")]
      .filter(element => element.getClientRects().length && !element.closest("[hidden]"));
    if (!focusable.length) return;
    const first=focusable[0], last=focusable[focusable.length-1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  });
  document.querySelectorAll("[data-gallery-language]").forEach(button => button.addEventListener("click", localize));
  localize();
  refreshRows();
})();