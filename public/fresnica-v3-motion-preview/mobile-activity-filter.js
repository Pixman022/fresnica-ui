/* Activity preview: loaded-example search, filters, compact status and local date groups. */
(() => {
  const phone = document.querySelector(".home11-phone.gallery-activity-page");
  const trigger = phone?.querySelector(".gallery-activity-filter-trigger");
  const overlay = phone?.querySelector(".gallery-activity-filter-overlay");
  const searchInput = phone?.querySelector(".gallery-activity-search-input");
  const clearSearch = phone?.querySelector(".gallery-activity-search-clear");
  const noMatch = phone?.querySelector(".gallery-activity-no-match");
  const sections = [...(phone?.querySelectorAll(".home11-scroll .gallery-panel") || [])];
  const rows = sections.flatMap(section => [...section.querySelectorAll("[data-activity-kind]")]);
  if (!trigger || !overlay || !searchInput || !clearSearch || !noMatch ||
      !sections.length || !rows.length) return;

  const defaults = () => ({type: "all", asset: "all", status: "all"});
  let applied = defaults();
  let draft = defaults();
  const zh = () => document.documentElement.lang.startsWith("zh");
  const labels = {
    "Search activity": "搜索交易", "Clear search": "清除搜索",
    "Filter activity": "筛选交易", "Type": "类型", "Asset": "资产", "Status": "状态",
    "All": "全部", "Payments": "支付", "Account": "账户", "Trustline": "信任线", "Other": "其他",
    "Received": "已收款", "Sent": "已发送", "Swapped": "已兑换",
    "Completed": "已完成", "Failed": "失败", "Pending": "待处理",
    "Reset": "重置", "Apply": "应用", "No matching activity": "没有匹配的交易",
    "Try a different search or filter.": "尝试其他搜索内容或筛选条件。",
    "Failed XLM payment": "XLM 支付失败", "Today": "今天", "Yesterday": "昨天",
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
    clearSearch.setAttribute("aria-label", locale("Clear search"));
    clearSearch.title = locale("Clear search");
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
    const family = row.dataset.activityFamily || "other";
    const type = ["payment", "account", "trustline"].includes(family) ? family : "other";
    const asset = row.dataset.activityAsset || "";
    const status = row.dataset.activityStatus || "";
    if (applied.type !== "all" && applied.type !== type) return false;
    if (applied.asset !== "all" && applied.asset !== asset) return false;
    if (applied.status !== "all" && applied.status !== status) return false;
    const query = searchInput.value.trim().toLocaleLowerCase();
    if (!query) return true;
    const title = row.querySelector(".gallery-row-copy b")?.textContent || "";
    const clockTime = row.querySelector("time")?.textContent || "";
    return [title,asset,type,row.dataset.activityFamily,row.dataset.activityDirection,
      status,clockTime].join(" ").toLocaleLowerCase().includes(query);
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
    const changed = Object.keys(applied).some(key => applied[key] !== defaults()[key]);
    trigger.classList.toggle("is-filtered", changed);
    const isSearching = searchInput.value.trim().length > 0;
    clearSearch.hidden = !isSearching;
  };

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
  const syncChoices = () => {
    overlay.querySelectorAll("[data-activity-choice-group]").forEach(group => {
      const selected = draft[group.dataset.activityChoiceGroup];
      group.querySelectorAll("[data-activity-choice]").forEach(button => {
        button.setAttribute("aria-pressed",String(button.dataset.activityChoice === selected));
      });
    });
  };
  trigger.addEventListener("click", () => {
    if (!overlay.hidden) { close(true); return; }
    draft = {...applied};
    syncChoices();
    overlay.hidden = false;
    trigger.setAttribute("aria-expanded","true");
    overlay.querySelector('[data-activity-choice-group="type"] [aria-pressed="true"]')?.focus();
  });
  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-activity-filter-dismiss]")) { close(true); return; }
    const choice = event.target.closest("[data-activity-choice]");
    if (choice) {
      draft[choice.closest("[data-activity-choice-group]").dataset.activityChoiceGroup] =
        choice.dataset.activityChoice;
      syncChoices();
      return;
    }
    if (event.target.closest(".gallery-activity-reset")) {
      draft = defaults();
      syncChoices();
      return;
    }
    if (event.target.closest(".gallery-activity-apply")) {
      applied = {...draft};
      refreshRows();
      close(true);
    }
  });
  phone.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      close(true);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...overlay.querySelectorAll("button:not(:disabled)")]
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