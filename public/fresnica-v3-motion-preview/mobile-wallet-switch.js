/* Home 1.1 wallet-switch UI is illustrative and does not change real wallet state. */
(() => {
  const phone = document.querySelector(".home11-phone");
  const trigger = phone?.querySelector(".home11-wallet-switch");
  const popup = phone?.querySelector("#home11-wallet-selector");
  const name = phone?.querySelector(".home11-wallet-name");
  const address = phone?.querySelector(".home11-wallet-address");
  if (!trigger || !popup || !name || !address) return;

  const examples = [
    { name: "SuperWallet", address: "GB3U…EH3W" },
    { name: "Wallet 2", address: "GDEM…TEST" },
  ];
  const close = (focusTrigger = false) => {
    popup.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (focusTrigger) trigger.focus();
  };

  trigger.addEventListener("click", () => {
    popup.hidden = !popup.hidden;
    trigger.setAttribute("aria-expanded", String(!popup.hidden));
    if (!popup.hidden) popup.querySelector(".home11-wallet-option.is-selected")?.focus();
  });
  popup.querySelectorAll("[data-wallet-index]").forEach((option) => {
    option.addEventListener("click", () => {
      const selected = examples[Number(option.dataset.walletIndex)];
      if (!selected) return;
      name.textContent = selected.name;
      address.textContent = selected.address;
      popup.querySelectorAll("[data-wallet-index]").forEach((item) => {
        const active = item === option;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-pressed", String(active));
      });
      close(true);
    });
  });
  document.addEventListener("click", (event) => {
    if (!popup.hidden && !popup.contains(event.target) && !trigger.contains(event.target)) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popup.hidden) {
      event.preventDefault();
      event.stopImmediatePropagation();
      close(true);
    }
  }, true);
})();
