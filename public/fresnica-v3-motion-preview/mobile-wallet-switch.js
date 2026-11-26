/* Home 1.1 wallet-switch and create-wallet flow are illustrative only. */
(() => {
  const phone = document.querySelector(".home11-phone");
  const trigger = phone?.querySelector(".home11-wallet-switch");
  const popup = phone?.querySelector("#home11-wallet-selector");
  const sheet = popup?.querySelector(".home11-wallet-sheet");
  const listView = popup?.querySelector(".home11-wallet-list-view");
  const createView = popup?.querySelector(".home11-wallet-create-view");
  const optionList = popup?.querySelector(".home11-wallet-options");
  const createEntry = popup?.querySelector(".home11-wallet-create-entry");
  const newName = popup?.querySelector("#home11-new-wallet-name");
  const name = phone?.querySelector(".home11-wallet-name");
  const address = phone?.querySelector(".home11-wallet-address");
  if (!trigger || !popup || !sheet || !listView || !createView || !optionList ||
      !createEntry || !newName || !name || !address) return;

  const examples = [
    { name: "SuperWallet", address: "GB3U…EH3W" },
    { name: "Wallet 2", address: "GDEM…TEST" },
  ];
  let selectedIndex = 0;

  const showList = () => {
    createView.hidden = true;
    listView.hidden = false;
    sheet.setAttribute("aria-labelledby", "home11-wallet-sheet-title");
  };
  const close = (focusTrigger = false) => {
    if (popup.hidden) return;
    popup.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    showList();
    createView.reset();
    if (focusTrigger) trigger.focus();
  };
  const select = (index) => {
    const selected = examples[index];
    if (!selected) return;
    selectedIndex = index;
    name.textContent = selected.name;
    address.textContent = selected.address;
    optionList.querySelectorAll("[data-wallet-index]").forEach((button) => {
      const active = Number(button.dataset.walletIndex) === index;
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    close(true);
  };

  trigger.addEventListener("click", () => {
    if (!popup.hidden) {
      close(true);
      return;
    }
    showList();
    popup.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    optionList.querySelector(".home11-wallet-option.is-selected")?.focus();
  });
  popup.addEventListener("click", (event) => {
    if (event.target.closest("[data-wallet-dismiss]")) {
      close(true);
      return;
    }
    const option = event.target.closest("[data-wallet-index]");
    if (option && optionList.contains(option)) select(Number(option.dataset.walletIndex));
  });
  createEntry.addEventListener("click", () => {
    listView.hidden = true;
    createView.hidden = false;
    sheet.setAttribute("aria-labelledby", "home11-wallet-create-title");
    newName.focus();
  });
  popup.querySelector(".home11-wallet-back")?.addEventListener("click", () => {
    showList();
    createEntry.focus();
  });

  createView.addEventListener("submit", (event) => {
    event.preventDefault();
    const walletName = newName.value.trim();
    if (!walletName) return;
    const index = examples.push({ name: walletName, address: "GDEM…DEMO" }) - 1;
    const option = document.createElement("button");
    option.type = "button";
    option.className = "home11-wallet-option";
    option.dataset.walletIndex = String(index);
    option.setAttribute("aria-pressed", "false");
    option.innerHTML = '<span class="home11-wallet-option-avatar"></span>' +
      '<span class="home11-wallet-option-details"><strong></strong><small></small></span>' +
      '<svg class="home11-wallet-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
    option.querySelector(".home11-wallet-option-avatar").textContent = walletName[0].toUpperCase();
    option.querySelector("strong").textContent = walletName;
    option.querySelector("small").textContent = "GDEM…DEMO";
    optionList.append(option);
    select(index);
  });

  document.addEventListener("keydown", (event) => {
    if (popup.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      close(true);
      return;
    }
    if (event.key !== "Tab") return;
    const activeView = createView.hidden ? listView : createView;
    const focusables = [...activeView.querySelectorAll("button:not([disabled]), input:not([disabled])")];
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, true);
})();
