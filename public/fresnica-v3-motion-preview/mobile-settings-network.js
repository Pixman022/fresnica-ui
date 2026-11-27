/* Local UI-only node list for Fresnica V3; never contacts Horizon or changes network. */
(() => {
  const phone=document.querySelector('[data-secondary-screen="network-nodes"]');
  if(!phone)return;
  const list=phone.querySelector('[data-settings-node-list]');
  const input=phone.querySelector('#secondary-node-url');
  const add=phone.querySelector('[data-settings-node-save]');
  if(!list||!input||!add)return;
  const key='fresnica-preview-horizon-nodes';
  const developerEnabled=()=>{
    try{return JSON.parse(localStorage.getItem('fresnica-settings-demo-v2')||'{}').developer===true;}
    catch(_){return false;}
  };
  const isZh=()=>{try{return localStorage.getItem('fresnica-gallery-language')==='zh';}catch{return false;}};
  const tr=(en,zh)=>isZh()?zh:en;
  let nodes=[];let selected=null;
  try {
    const saved=JSON.parse(sessionStorage.getItem(key)||'[]');
    if(Array.isArray(saved))nodes=saved.filter(x=>typeof x==='string'&&x.startsWith('https://')).slice(0,8);
    selected=sessionStorage.getItem(key+'-selected')||null;
  }catch(_){}
  const store=()=>{try{sessionStorage.setItem(key,JSON.stringify(nodes));if(selected)sessionStorage.setItem(key+'-selected',selected);else sessionStorage.removeItem(key+'-selected');}catch(_){}};
  const valid=value=>{
    try{
      const url=new URL(value.trim());
      return url.protocol==='https:'&&!url.username&&!url.password&&
        url.hostname.includes('.')&&!/(^|\.)localhost$/.test(url.hostname)?url.origin+url.pathname+url.search:null;
    }catch{return null;}
  };
  const toast=(en,zh)=>{
    let n=phone.querySelector('.secondary-toast');
    if(!n){n=document.createElement('p');n.className='secondary-toast';phone.appendChild(n);}
    n.textContent=tr(en,zh);n.hidden=false;
    clearTimeout(toast.timer);toast.timer=setTimeout(()=>n.hidden=true,2000);
  };
  const render=()=>{
    const canManage=developerEnabled();
    phone.querySelectorAll('[data-settings-developer-only]').forEach(el=>{el.hidden=!canManage;});
    const hint=phone.querySelector('[data-settings-node-gate]');
    if(hint)hint.hidden=canManage;
    list.replaceChildren();
    const current=document.createElement('div');
    current.className='secondary-pair';
    const caption=document.createElement('span');caption.textContent=tr('Default endpoint','默认节点');
    const status=document.createElement('strong');status.textContent=!canManage||!selected?tr('Selected (preview)','已选择（预览）'):tr('Available','可用');
    current.append(caption,status);list.appendChild(current);
    if(!canManage)return;
    nodes.forEach((node,i)=>{
      const wrap=document.createElement('div');wrap.className='secondary-pair';
      wrap.style.cssText='align-items:flex-start;flex-direction:column;gap:7px';
      const address=document.createElement('strong');address.textContent=node;address.style.cssText='font-weight:600;text-align:left;overflow-wrap:anywhere';
      const controls=document.createElement('div');controls.style.cssText='display:flex;align-items:center;gap:7px;flex-wrap:wrap';
      const chosen=document.createElement('button');chosen.type='button';chosen.className='secondary-secondary';chosen.style.minHeight='34px';chosen.textContent=selected===node?tr('Selected','已选择'):tr('Use preview','使用示例');
      chosen.setAttribute('aria-pressed',String(selected===node));
      chosen.addEventListener('click',()=>{selected=node;store();render();toast('Preview node selected','已选择示例节点');});
      const check=document.createElement('button');check.type='button';check.className='secondary-secondary';check.style.minHeight='34px';check.textContent=tr('Check format','检查格式');
      check.addEventListener('click',()=>toast('URL format valid; no live health check','地址格式有效；未执行网络检测'));
      const remove=document.createElement('button');remove.type='button';remove.className='secondary-secondary';remove.style.minHeight='34px';remove.textContent=tr('Remove','移除');
      remove.addEventListener('click',()=>{nodes.splice(i,1);if(selected===node)selected=null;store();render();toast('Preview node removed','已移除示例节点');});
      controls.append(chosen,check,remove);wrap.append(address,controls);list.appendChild(wrap);
    });
    const defaultRow=list.firstElementChild;
    if(selected){
      const reset=document.createElement('button');reset.type='button';reset.className='secondary-secondary';reset.style.minHeight='34px';reset.textContent=tr('Use default','使用默认');
      reset.addEventListener('click',()=>{selected=null;store();render();});
      defaultRow.appendChild(reset);
    }
  };
  add.addEventListener('click',()=>{
    if(!developerEnabled()){toast('Enable Developer mode first','请先启用开发者模式');render();return;}
    const url=valid(input.value);
    if(!url){input.focus();toast('Enter a valid HTTPS endpoint','请输入有效的 HTTPS 节点地址');return;}
    if(!nodes.includes(url)){
      if(nodes.length>=8){toast('Maximum of 8 preview nodes','最多添加 8 个示例节点');return;}
      nodes.push(url);
    }
    store();render();toast('Preview node added, not connected','示例节点已添加，尚未连接');
  });
  document.addEventListener('click',e=>{if(e.target.closest('[data-gallery-language]'))queueMicrotask(render);});
  window.addEventListener('storage',e=>{if(e.key==='fresnica-settings-demo-v2')render();});
  render();
})();
