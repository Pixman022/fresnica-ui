/* M25: clickable desktop preview tabs, including keyboard focus navigation. */
(() => {
  'use strict';
  const scene=document.getElementById('v3-workspace');
  if(!scene)return;
  const tabs=[...scene.querySelectorAll('.desktop-tabs [role="tab"]')];
  const panels=tabs.map(tab=>document.getElementById(tab.getAttribute('aria-controls')));
  const sidebar=[...scene.querySelectorAll('.ws-sidebar span')];
  if(tabs.length!==4||panels.some(panel=>!panel))return;
  const select=index=>{
    tabs.forEach((tab,i)=>{
      const selected=i===index;
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
      panels[i].hidden=!selected;
    });
    sidebar.forEach((item,i)=>item.classList.toggle('desktop-current',i===[1,2,3,4][index]));
    scene.dataset.desktopTab=tabs[index].id;
  };
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>select(i));
    tab.addEventListener('keydown',event=>{
      let next=i;
      if(event.key==='ArrowRight')next=(i+1)%tabs.length;
      else if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=tabs.length-1;
      else return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
  select(0);
})();