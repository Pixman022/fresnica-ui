/* Home wallet switch: uses the same sample accounts as Settings.
   This UI never creates signer material or a funded wallet. */
(() => {
  const phone=document.querySelector(".home11-phone");
  const state=window.FresnicaPreviewState;
  const trigger=phone?.querySelector(".home11-wallet-switch");
  const popup=phone?.querySelector("#home11-wallet-selector");
  const sheet=popup?.querySelector(".home11-wallet-sheet");
  const listView=popup?.querySelector(".home11-wallet-list-view");
  const optionList=popup?.querySelector(".home11-wallet-options");
  const createEntry=popup?.querySelector(".home11-wallet-create-entry");
  const name=phone?.querySelector(".home11-wallet-name");
  const address=phone?.querySelector(".home11-wallet-address");
  if(!state || !trigger || !popup || !sheet || !listView || !optionList ||
     !createEntry || !name || !address)return;
  const isZh=()=>document.documentElement.lang.startsWith("zh");
  const close=(restore=true)=>{
    if(popup.hidden)return;
    popup.hidden=true;trigger.setAttribute("aria-expanded","false");
    if(restore)trigger.focus();
  };
  const render=()=>{
    const current=state.activeAccount();
    if(!current)return;
    name.textContent=current.name;
    address.textContent=current.address==="—" ? (isZh()?"示例账户":"Sample account"):current.address;
    optionList.replaceChildren();
    state.accounts().filter(a=>!a.hidden).forEach(account=>{
      const button=document.createElement("button");
      button.type="button";button.className="home11-wallet-option";
      button.dataset.walletId=account.id;
      const isCurrent=account.id===current.id;
      button.classList.toggle("is-selected",isCurrent);
      button.setAttribute("aria-pressed",String(isCurrent));
      const avatar=document.createElement("span");
      avatar.className="home11-wallet-option-avatar";
      avatar.textContent=account.name[0].toUpperCase();
      const details=document.createElement("span");
      details.className="home11-wallet-option-details";
      const title=document.createElement("strong");title.textContent=account.name;
      const subtitle=document.createElement("small");
      subtitle.textContent=account.address==="—"?(isZh()?"示例账户":"Sample account"):account.address;
      details.append(title,subtitle);
      button.append(avatar,details);
      button.insertAdjacentHTML("beforeend",'<svg class="home11-wallet-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>');
      optionList.appendChild(button);
    });
  };
  trigger.addEventListener("click",()=>{
    if(!popup.hidden){close();return;}
    render();popup.hidden=false;trigger.setAttribute("aria-expanded","true");
    optionList.querySelector(".is-selected")?.focus();
  });
  popup.addEventListener("click",event=>{
    if(event.target.closest("[data-wallet-dismiss]")){close();return;}
    const option=event.target.closest("[data-wallet-id]");
    if(option && optionList.contains(option)){
      if(state.setActiveAccount(option.dataset.walletId)){render();close();}
    }
  });
  createEntry.addEventListener("click",()=>{
    window.location.href="./mobile-settings-detail.html?view=add-account&from=home";
  });
  window.addEventListener("fresnica-preview-state",event=>{
    if(event.detail?.type==="accounts")render();
  });
  window.addEventListener("storage",event=>{
    if(event.key?.startsWith("fresnica-preview-"))render();
  });
  document.addEventListener("keydown",event=>{
    if(popup.hidden)return;
    if(event.key==="Escape"){
      event.preventDefault();event.stopImmediatePropagation();close();return;
    }
    if(event.key!=="Tab")return;
    const focusables=[...listView.querySelectorAll("button:not([disabled])")];
    if(!focusables.length)return;
    const first=focusables[0],last=focusables[focusables.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  },true);
  render();
})();
