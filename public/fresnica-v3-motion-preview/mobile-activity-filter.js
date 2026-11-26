/* Activity's illustrative transaction-type filter. */
(() => {
  const phone = document.querySelector(".home11-phone");
  const trigger = phone?.querySelector(".gallery-activity-filter-trigger");
  const overlay = phone?.querySelector(".gallery-activity-filter-overlay");
  const options = overlay?.querySelectorAll("[data-activity-filter]");
  const sections = phone?.querySelectorAll(".home11-scroll .gallery-panel");
  if (!trigger || !overlay || !options?.length || !sections?.length) return;

  const close = (restoreFocus = false) => {
    overlay.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) trigger.focus();
  };
  const applyFilter = (kind) => {
    sections.forEach((section) => {
      const rows = section.querySelectorAll("[data-activity-kind]");
      rows.forEach((row) => { row.hidden = kind !== "all" && row.dataset.activityKind !== kind; });
      const hasRows = [...rows].some((row) => !row.hidden);
      section.hidden = !hasRows;
      if (section.previousElementSibling?.matches(".gallery-section-title")) {
        section.previousElementSibling.hidden = !hasRows;
      }
    });
    options.forEach((option) => {
      option.setAttribute("aria-pressed", String(option.dataset.activityFilter === kind));
    });
    trigger.classList.toggle("is-filtered", kind !== "all");
    close(true);
  };

  trigger.addEventListener("click", () => {
    if (!overlay.hidden) { close(true); return; }
    overlay.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    overlay.querySelector('[aria-pressed="true"]')?.focus();
  });
  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-activity-filter-dismiss]")) { close(true); return; }
    const option = event.target.closest("[data-activity-filter]");
    if (option && overlay.contains(option)) applyFilter(option.dataset.activityFilter);
  });
  phone.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    } else if (event.key === "Tab") {
      const focusables = [...overlay.querySelectorAll("button:not([disabled])")];
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
