/* Fresnica UI preview: shared non-sensitive account and dApp demo metadata.
   This store never handles real signer keys, wallet sessions or dApp permissions. */
(() => {
  if (window.FresnicaPreviewState) return;
  const accountKey = "fresnica-preview-accounts-v1";
  const activeKey = "fresnica-preview-active-account-v1";
  const connectionKey = "fresnica-preview-dapp-connections-v1";
  const fallback = [
    {id:"demo-1",name:"SuperWallet",address:"GB3U…EH3W",type:"sample",hidden:false},
    {id:"demo-2",name:"Wallet 2",address:"GDEM…TEST",type:"sample",hidden:false},
  ];
  const safeRead = (storage,key) => {
    try { return JSON.parse(storage.getItem(key) || "null"); }
    catch (_) { return null; }
  };
  const safeWrite = (storage,key,value) => {
    try { storage.setItem(key,JSON.stringify(value)); return true; }
    catch (_) { return false; }
  };
  const emit = type => window.dispatchEvent(new CustomEvent("fresnica-preview-state", {detail:{type}}));
  const normalizeAccount = (item,index) => {
    if (!item || typeof item.name!=="string" || !item.name.trim()) return null;
    return {
      id: String(item.id ?? ("legacy-"+index)),
      name: item.name.trim().slice(0,36),
      address: typeof item.address==="string" ? item.address.slice(0,100) : "—",
      type: item.type==="watch-only" ? "watch-only" : "sample",
      hidden: !!item.hidden
    };
  };
  const accounts = () => {
    let result = safeRead(localStorage,accountKey);
    if (!Array.isArray(result)) {
      const previous = safeRead(sessionStorage,"fresnica-settings-demo-accounts");
      result = Array.isArray(previous) ? previous : fallback;
    }
    const clean = result.map(normalizeAccount).filter(Boolean).slice(0,50);
    return clean.length && clean.some(item=>!item.hidden) ? clean : fallback.map(x=>({...x}));
  };
  const activeId = () => {
    try { return localStorage.getItem(activeKey); }
    catch (_) { return null; }
  };
  const activeAccount = () => {
    const list = accounts();
    return list.find(item=>item.id===activeId()&&!item.hidden) || list.find(item=>!item.hidden);
  };
  const setActiveAccount = id => {
    const entry=accounts().find(item=>item.id===String(id)&&!item.hidden);
    if(!entry)return false;
    try {localStorage.setItem(activeKey,entry.id);}catch(_){}
    emit("accounts");return true;
  };
  const saveAccounts = items => {
    if(!Array.isArray(items))return false;
    const clean=items.map(normalizeAccount).filter(Boolean);
    if(!clean.length||!clean.some(item=>!item.hidden))return false;
    if(!safeWrite(localStorage,accountKey,clean))return false;
    const current=clean.find(item=>item.id===activeId()&&!item.hidden);
    if(!current){try{localStorage.setItem(activeKey,clean.find(item=>!item.hidden).id);}catch(_){}}
    emit("accounts");return true;
  };
  const connections = () => {
    const input=safeRead(localStorage,connectionKey);
    if(!Array.isArray(input))return [];
    return input.filter(x=>x && typeof x.origin==="string"&&/^https:\/\//.test(x.origin) &&
      typeof x.name==="string" && (x.kind==="sample"||x.kind==="manual"))
      .slice(0,30).map(x=>({name:x.name.slice(0,80),origin:x.origin.slice(0,256),kind:x.kind}));
  };
  const saveConnection = entry => {
    if(!entry || !["sample","manual"].includes(entry.kind))return false;
    let origin;
    try {const url=new URL(entry.url);if(url.protocol!=="https:")return false;origin=url.origin;}
    catch (_){return false;}
    const item={name:String(entry.name).slice(0,80),origin,kind:entry.kind};
    const list=[item,...connections().filter(x=>x.origin!==origin)].slice(0,30);
    const ok=safeWrite(localStorage,connectionKey,list);
    if(ok)emit("connections");
    return ok;
  };
  const disconnect = origin => {
    const list=connections(),filtered=list.filter(x=>x.origin!==origin);
    if(list.length===filtered.length)return false;
    const ok=safeWrite(localStorage,connectionKey,filtered);
    if(ok)emit("connections");
    return ok;
  };
  window.FresnicaPreviewState=Object.freeze({
    accounts,saveAccounts,activeAccount,setActiveAccount,connections,saveConnection,disconnect
  });
})();
