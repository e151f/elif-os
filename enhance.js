// Small V2 shell interactions kept separate from the core state engine.
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-menu]');
  if(b){document.querySelector('aside')?.classList.toggle('open');return;}
  const s=e.target.closest('[data-search]');
  if(s){
    const q=prompt('Search ELIF OS');
    if(!q)return;
    const state=JSON.parse(localStorage.getItem('elif-os-v2-state')||'{}');
    const tasks=(state.tasks||[]).filter(x=>String(x.title||'').toLowerCase().includes(q.toLowerCase()));
    alert(tasks.length?tasks.map(x=>`${x.done?'✓':'○'} ${x.title}`).join('\n'):'No matching tasks.');
  }
});
