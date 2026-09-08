(()=>{
  const KEY='elif-os-v2-state';
  const pad=n=>String(n).padStart(2,'0');
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
  const read=()=>window.ELIFCore?.read?.()||JSON.parse(localStorage.getItem(KEY)||'{}');
  const write=s=>window.ELIFCore?.write?window.ELIFCore.write(s):localStorage.setItem(KEY,JSON.stringify(s));
  const uid=()=>crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  function open(){
    const m=document.querySelector('#modal');if(!m)return;
    m.innerHTML=`<div class="modalbox task-modal" style="position:relative;z-index:99999;pointer-events:auto"><button type="button" class="close" id="elif-hotfix-close">×</button><span class="eyebrow">TASK ENGINE</span><h2>New task</h2><form id="elif-hotfix-form"><label class="field">Task title<input name="title" required autofocus></label><div class="te-grid"><label class="field">Due date<input name="date" type="date" value="${today()}" required></label><label class="field">Priority<select name="priority"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></label></div><label class="field">Notes<textarea name="notes"></textarea></label><div class="actions"><button type="button" class="ghost" id="elif-hotfix-cancel">cancel</button><button type="submit" class="primary">create task</button></div></form></div>`;
    m.classList.add('open');
    document.querySelector('#elif-hotfix-form input[name="title"]')?.focus();
    document.querySelector('#elif-hotfix-close')?.addEventListener('click',()=>m.classList.remove('open'));
    document.querySelector('#elif-hotfix-cancel')?.addEventListener('click',()=>m.classList.remove('open'));
    document.querySelector('#elif-hotfix-form')?.addEventListener('submit',e=>{e.preventDefault();e.stopPropagation();const f=e.currentTarget,x=new FormData(f),title=String(x.get('title')||'').trim();if(!title){f.querySelector('[name="title"]')?.focus();return}const s=read();s.tasks??=[];const t={id:uid(),title,date:String(x.get('date')||today()),priority:String(x.get('priority')||'medium'),projectId:null,goalId:null,recurrence:'none',notes:String(x.get('notes')||'').trim(),done:false,status:'active',parentId:null,history:[{id:uid(),type:'created',at:new Date().toISOString(),details:''}],createdAt:new Date().toISOString()};s.tasks.push(t);write(s);m.classList.remove('open');if(window.toast)window.toast('Task saved ✓');setTimeout(()=>{if(typeof window.render==='function')window.render();else location.reload()},0)},true);
  }
  function bind(){document.querySelectorAll('[data-te-new]').forEach(b=>{if(b.dataset.hotfixBound==='1')return;b.dataset.hotfixBound='1';b.style.position='relative';b.style.zIndex='50';b.style.pointerEvents='auto';b.onclick=e=>{e.preventDefault();e.stopPropagation();open()}})}
  const observer=new MutationObserver(bind);observer.observe(document.body,{childList:true,subtree:true});setTimeout(bind,50);setTimeout(bind,300);setTimeout(bind,1000);
})();
