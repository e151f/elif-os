(()=>{
  const APP='elif-os-v2-state';
  const root=()=>document.querySelector('#view');
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const uid=()=>crypto.randomUUID();
  const app=()=>window.ELIFCore?.read?.()||(()=>{try{return JSON.parse(localStorage.getItem(APP)||'{}')}catch{return{}}})();
  const read=()=>{const s=app();return Array.isArray(s.memory)?s.memory:[]};
  const write=x=>{const s=app();s.memory=x;if(window.ELIFCore?.write)window.ELIFCore.write(s);else localStorage.setItem(APP,JSON.stringify(s))};
  let query='';
  let editing=null;
  const typeLabel={insight:'Insight',idea:'Idea',decision:'Decision',fact:'Fact',resource:'Resource',principle:'Principle'};
  const typeOptions=Object.entries(typeLabel).map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
  function allSources(){
    const s=app(),out=[];
    (s.notes||[]).forEach((x,i)=>out.push({id:'note-'+i,title:String(x),body:String(x),kind:'OS Note',date:''}));
    const journals=Array.isArray(s.journal)?s.journal:[];
    journals.forEach(x=>out.push({id:'journal-'+(x.id||x.date||uid()),title:x.title||'Journal entry',body:x.content||x.text||x.body||'',kind:'Journal',date:x.date||''}));
    return out;
  }
  function matches(m){if(!query)return true;const q=query.toLowerCase();return [m.title,m.body,m.type,(m.tags||[]).join(' '),m.source].join(' ').toLowerCase().includes(q)}
  function related(m,items){const tags=new Set((m.tags||[]).map(x=>x.toLowerCase()));return items.filter(x=>x.id!==m.id&&((x.tags||[]).some(t=>tags.has(t.toLowerCase()))||((m.links||[]).includes(x.id)))).slice(0,5)}
  function backlinks(m,items){return items.filter(x=>(x.links||[]).includes(m.id)).slice(0,5)}
  function render(){
    const v=root();if(!v||v.dataset.page!=='memory')return;
    const items=read().sort((a,b)=>new Date(b.updatedAt||b.createdAt)-new Date(a.updatedAt||a.createdAt));
    const visible=items.filter(matches),sources=allSources().filter(matches);
    const recall=items.filter(x=>Date.now()-new Date(x.createdAt).getTime()>7*86400000).sort(()=>Math.random()-.5)[0]||items[0];
    const tags=[...new Set(items.flatMap(x=>x.tags||[]))].slice(0,14);
    v.innerHTML=`<section class="memory-page">
      <div class="memory-hero"><div><span class="eyebrow">PERSONAL KNOWLEDGE BASE</span><h1>Memory</h1><p>Capture what matters. Connect it. Find it again.</p></div><div class="memory-count"><b>${items.length}</b><small>permanent memories</small></div></div>
      <div class="memory-stats"><div class="panel"><b>${items.filter(x=>x.type==='insight').length}</b><small>insights</small></div><div class="panel"><b>${items.filter(x=>x.type==='decision').length}</b><small>decisions</small></div><div class="panel"><b>${items.filter(x=>(x.links||[]).length).length}</b><small>connected notes</small></div><div class="panel"><b>${allSources().length}</b><small>existing OS notes</small></div></div>
      <div class="panel memory-editor"><div class="section-title"><span>${editing?'Edit memory':'Add permanent memory'}</span><small>one useful idea is enough</small></div>
        <form data-memory-form autocomplete="off">
          <div class="enh-grid"><div class="enh-field"><label>Title</label><input class="enh-input" name="title" required value="${editing?esc(editing.title):''}" placeholder="The idea in one sentence"></div><div class="enh-field"><label>Type</label><select class="enh-select" name="type">${typeOptions}</select></div></div>
          <div class="enh-field" style="margin-top:12px"><label>Memory</label><textarea class="enh-textarea memory-body" name="body" required placeholder="Write it in your own words so future-you understands it.">${editing?esc(editing.body):''}</textarea></div>
          <div class="enh-grid"><div class="enh-field"><label>Tags</label><input class="enh-input" name="tags" value="${editing?esc((editing.tags||[]).join(', ')):''}" placeholder="pharmacy, finance, self"></div><div class="enh-field"><label>Source / why it matters</label><input class="enh-input" name="source" value="${editing?esc(editing.source||''):''}" placeholder="book, lecture, experience, decision..."></div></div>
          <div class="enh-field" style="margin-top:12px"><label>Connect to memory IDs</label><input class="enh-input" name="links" value="${editing?esc((editing.links||[]).join(', ')):''}" placeholder="paste IDs separated by commas"></div>
          <div class="actions"><button class="ghost" type="button" data-memory-cancel ${editing?'':'style="display:none"'}>cancel</button><button class="primary" type="submit">${editing?'save changes':'store memory'}</button></div>
        </form>
      </div>
      ${recall?`<div class="panel memory-recall"><div class="section-title"><span>Recall</span><small>something worth resurfacing</small></div><h3>${esc(recall.title)}</h3><p>${esc(recall.body).slice(0,420)}${String(recall.body).length>420?'…':''}</p><div class="memory-meta"><span class="tag">${esc(typeLabel[recall.type]||recall.type)}</span>${(recall.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div>`:''}
      <div class="memory-search"><div class="panel"><form data-memory-search><input class="enh-input" name="q" value="${esc(query)}" placeholder="Search your memory..."></form><div class="memory-tags">${tags.map(t=>`<button type="button" class="tag" data-memory-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div></div></div>
      <div class="memory-grid"><div><div class="section-title" style="margin:18px 0 10px"><span>Permanent memories</span><small>${visible.length}</small></div>${visible.map(m=>card(m,items)).join('')||'<div class="empty-state">No memories yet.</div>'}</div><div><div class="section-title" style="margin:18px 0 10px"><span>Already in ELIF OS</span><small>${sources.length}</small></div>${sources.slice(0,12).map(x=>`<div class="panel memory-source"><span class="tag">${esc(x.kind)}</span><b>${esc(x.title)}</b>${x.date?`<small>${esc(x.date)}</small>`:''}</div>`).join('')||'<div class="empty-state">No existing notes or journal entries.</div>'}</div></div>
    </section>`;
    if(editing){const sel=v.querySelector('[name="type"]');if(sel)sel.value=editing.type||'insight'}
  }
  function card(m,items){const rel=related(m,items),back=backlinks(m,items);return `<article class="panel memory-card"><div class="memory-card-top"><span class="tag">${esc(typeLabel[m.type]||m.type)}</span><small>${new Date(m.updatedAt||m.createdAt).toLocaleDateString('en-GB')}</small></div><h3>${esc(m.title)}</h3><p>${esc(m.body)}</p><div class="memory-meta">${(m.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>${m.source?`<div class="memory-source-line">Source: ${esc(m.source)}</div>`:''}${rel.length||back.length?`<div class="memory-links"><b>Connections</b>${[...new Set([...rel,...back])].map(x=>`<span>${esc(x.title)}</span>`).join('')}</div>`:''}<div class="memory-actions"><button class="ghost" type="button" data-memory-edit="${m.id}">edit</button><button class="ghost" type="button" data-memory-delete="${m.id}">delete</button><small>ID · ${esc(m.id.slice(0,8))}</small></div></article>`}
  function submit(f){const fd=new FormData(f),now=new Date().toISOString();const data={title:String(fd.get('title')||'').trim(),type:String(fd.get('type')||'insight'),body:String(fd.get('body')||'').trim(),tags:String(fd.get('tags')||'').split(',').map(x=>x.trim()).filter(Boolean),source:String(fd.get('source')||'').trim(),links:String(fd.get('links')||'').split(',').map(x=>x.trim()).filter(Boolean)};if(!data.title||!data.body)return;let items=read();if(editing){items=items.map(x=>x.id===editing.id?{...x,...data,updatedAt:now}:x)}else{items.unshift({id:uid(),...data,createdAt:now,updatedAt:now})}write(items);editing=null;render()}
  document.addEventListener('submit',e=>{const f=e.target.closest?.('[data-memory-form]');if(f&&root()?.dataset.page==='memory'){e.preventDefault();e.stopImmediatePropagation();submit(f);return}const q=e.target.closest?.('[data-memory-search]');if(q&&root()?.dataset.page==='memory'){e.preventDefault();e.stopImmediatePropagation();query=String(new FormData(q).get('q')||'').trim();render()}},true);
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-memory-edit],[data-memory-delete],[data-memory-cancel],[data-memory-tag]');if(!b||root()?.dataset.page!=='memory')return;e.preventDefault();e.stopImmediatePropagation();if(b.dataset.memoryEdit){editing=read().find(x=>x.id===b.dataset.memoryEdit)||null;render()}else if(b.dataset.memoryDelete){if(confirm('Delete this memory?')){write(read().filter(x=>x.id!==b.dataset.memoryDelete));render()}}else if(b.hasAttribute('data-memory-cancel')){editing=null;render()}else if(b.dataset.memoryTag){query=b.dataset.memoryTag;render()}},true);
  window.addEventListener('click',e=>{if(e.target.closest?.('button[data-page="memory"]'))setTimeout(render,0)});
  window.ELIFMemory={render,read,write};
})();