(()=>{
  const APP='elif-os-v2-state', ACTIVE='elif-os-active-study-plan';
  const read=()=>{try{return JSON.parse(localStorage.getItem(APP)||'{}')}catch{return {}}};
  const write=s=>localStorage.setItem(APP,JSON.stringify(s));
  let before=0,watch=null;
  function begin(){const p=JSON.parse(localStorage.getItem(ACTIVE)||'null');if(!p)return;before=(read().studySessions||[]).length;clearInterval(watch);watch=setInterval(()=>{const s=read(),a=s.studySessions||[];if(a.length>before){const x=a[a.length-1];x.planId=p.id;x.subject=p.subject;x.title=p.title;x.plannedStart=p.start;x.plannedEnd=p.end;write(s);localStorage.removeItem(ACTIVE);clearInterval(watch);window.dispatchEvent(new Event('elif-study-linked'));}},1000)}
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-plan-start]'))setTimeout(begin,100)},true);
  window.addEventListener('elif-study-linked',()=>window.ELIFStudyPlan?.inject?.());
})();