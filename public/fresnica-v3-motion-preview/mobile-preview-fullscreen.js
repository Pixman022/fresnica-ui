/* Shared fullscreen preview controller for all six mobile gallery pages. */
(() => {
  const root = document.documentElement;
  const shell = document.querySelector(".preview-shell");
  const button = document.querySelector(".preview-fullscreen-toggle");
  if (!shell || !button) return;

  const storageKey = "fresnica-gallery-immersive";
  const remember = (active) => {
    try { sessionStorage.setItem(storageKey, active ? "1" : "0"); } catch (_) {}
  };
  const setImmersive = (active) => {
    root.classList.toggle("preview-immersive", active);
    button.setAttribute("aria-pressed", String(active));
    const zh = document.documentElement.lang.startsWith("zh");
    const label = active ? (zh ? "退出全屏预览" : "Exit fullscreen preview")
      : (zh ? "全屏展示界面" : "Fullscreen preview");
    button.setAttribute("aria-label", label);
    button.title = label;
    remember(active);
  };
  const leave = () => {
    setImmersive(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  try {
    if (sessionStorage.getItem(storageKey) === "1") setImmersive(true);
  } catch (_) { /* The current page still works without session storage. */ }

  button.addEventListener("click", () => {
    if (root.classList.contains("preview-immersive")) {
      leave();
      return;
    }
    setImmersive(true);
    // Native fullscreen is optional; CSS immersive mode survives page navigation.
    if (typeof shell.requestFullscreen === "function") {
      try {
        const request = shell.requestFullscreen({ navigationUI: "hide" });
        if (request && typeof request.catch === "function") request.catch(() => {});
      } catch (_) { /* CSS immersive mode remains active. */ }
    }
  });
  // The browser can end native fullscreen when an in-preview link is followed.
  // Do not treat this as a request to leave the gallery's immersive layout.
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) setImmersive(true);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.classList.contains("preview-immersive")) leave();
  });
})();
