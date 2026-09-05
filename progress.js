// ELIF OS — active progress layer. No global score.
(() => {
  const KEY='elif-os-v2-state';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const active=x=>String(x?.status||'active').toLowerCase()!=='on hold'&&x?.active!==false;
  const sync=()=>{const s=read();if(!s.tasks)return;s.goals||=[];s.projects||=[];s.habits||=[];
    for(const h of s.habits)if(String(h.name||'').toLowerCase()==='korean')h.status='on hold';
    for(const g of s.goals)if(String(g.title||'').toLowerCase().includes('korean'))g.status='on hold';
    for(const p of s.projects)if(String(p.name||'').toLowerCase().includes('korean'))p.status='on hold';
    for(const p of s.projects.filter(active)){const ts=s.tasks.filter(t=>t.projectId===p.id&&active(t));if(ts.length)p.progress=Math.round(ts.filter(t=>t.done).length/ts.length*100)}
    for(const g of s.goals.filter(active)){const ps=s.projects.filter(p=>p.goalId===g.id&&active(p));const exec=ps.filter(p=>s.tasks.some(t=>t.projectId===p.id&&active(t)));if(exec.length)g.progress=Math.round(exec.reduce((a,p)=>a+Number(p.progress||0),0)/exec.length)}
    write(s);
  };
  const hideScore=()=>document.querySelectorAll('.metric').forEach(m=>{if(/ELIF SCORE/i.test(m.textContent||''))m.remove()});
  const refresh=()=>{sync();hideScore()};
  setTimeout(refresh,350);document.addEventListener('change',()=>setTimeout(refresh,80));document.addEventListener('click',()=>setTimeout(refresh,80));
  new MutationObserver(hideScore).observe(document.body,{childList:true,subtree:true});
})();
