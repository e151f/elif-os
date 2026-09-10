(()=>{
  const APP='elif-os-v2-state';
  const root=()=>document.querySelector('#view');
  const read=()=>{try{return JSON.parse(localStorage.getItem(APP)||'{}')}catch{return {}}};
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const dayKey=d=>{const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
  const dateLabel=k=>new Date(`${k}T12:00:00`).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const time=d=>new Date(d).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  function render(){
    const v=root();
    if(!v||v.dataset.page!=='study')return;
    let box=v.querySelector('[data-study-history]');
    if(!box){
      box=document.createElement('div');box.className='panel';box.dataset.studyHistory='1';box.style.cssText='margin-top:14px;padding:20px';
      const panels=v.querySelectorAll('.panel');
      (panels[panels.length-1]||v.querySelector('.study-page'))?.insertAdjacentElement('afterend',box);
    }
    if(!box)return;
    const sessions=Array.isArray(read().studySessions)?read().studySessions:[];
    const groups={};
    sessions.forEach(s=>{if(!s?.date)return;(groups[s.date]??=[]).push(s)});
    const days=Object.keys(groups).sort((a,b)=>b.localeCompare(a));
    const total=sessions.reduce((n,s)=>n+Number(s.minutes||0),0);
    const recent=sessions.filter(s=>{const d=new Date(s.date+'T23:59:59');return Date.now()-d.getTime()<=30*86400000}).reduce((n,s)=>n+Number(s.minutes||0),0);
    box.innerHTML=`<div class="section-title"><span>Study history</span><small>${sessions.length} sessions · ${total} min total</small></div><div style="margin:8px 0 14px;color:var(--muted);font-size:12px">Last 30 days: <b style="color:var(--text)">${recent} min</b></div>${days.length?days.map(k=>{const ss=groups[k].sort((a,b)=>String(b.start).localeCompare(String(a.start)));const mins=ss.reduce((n,s)=>n+Number(s.minutes||0),0);return `<div style="border-top:1px solid var(--line,#262126);padding:14px 0"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><b>${esc(dateLabel(k))}</b><span style="color:var(--pink);font-family:DM Mono,monospace">${mins} min</span></div>${ss.map(s=>`<div style="display:grid;grid-template-columns:105px 1fr auto;gap:10px;align-items:center;margin-top:9px;font-size:12px"><time style="font-family:DM Mono,monospace;color:var(--muted)">${time(s.start)}–${time(s.end)}</time><span>${esc(s.title||'Study session')}</span><span>${Number(s.minutes||0)}m</span></div>`).join('')}</div>`}).join(''):'<div class="empty-state">No completed study sessions yet.</div>'}`;
  }
  function maybe(){if(document.querySelector('#view')?.dataset.page==='study')render()}
  document.addEventListener('click',e=>{if(e.target.closest?.('button[data-page="study"]'))setTimeout(render,30)});
  setInterval(maybe,1000);
  window.ELIFStudyHistory={render};
})();
