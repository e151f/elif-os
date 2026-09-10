(()=>{
  const heroes={
    study:['study.jpeg','Study','Build a focused study system and keep your academic progress visible.'],
    body:['body.jpeg','Body','Movement, training and daily habits that help you feel stronger and more energized.'],
    wallet:['money.jpeg','Wallet','Track spending, saving and the small money decisions that shape your month.'],
    meal:['IMG_0954.jpeg','Meal','Plan simple meals, keep your routine practical and make eating well easier.'],
    journal:['IMG_0955.jpeg','Journal','Capture what happened, what you felt and what you want to carry forward.'],
    goals:['IMG_0956.jpeg','Goals','Turn bigger ambitions into clear priorities and measurable next steps.'],
    projects:['IMG_0957.jpeg','Projects','Keep active projects organized with a clear view of what needs attention.'],
    sleep:['IMG_0958.jpeg','Sleep','Build a consistent sleep rhythm and make recovery part of the system.']
  };
  function style(){if(document.getElementById('module-polish-css'))return;const s=document.createElement('style');s.id='module-polish-css';s.textContent=`
    /* All ELIF modules now use the same compact two-column visual layout as Glow Up. */
    .module-hero{display:none!important}
    .module-visual{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:14px;width:100%;margin:14px 0;border:0;background:transparent;overflow:visible}
    .module-visual-media,.module-visual-info{border:1px solid #493440;border-radius:13px;overflow:hidden;background:#100d12;min-width:0}
    .module-visual-media img{display:block;width:100%;height:260px;object-fit:cover}
    .module-visual-info{padding:20px;display:flex;flex-direction:column;justify-content:center}
    .module-visual-info .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--pink);margin-bottom:4px}
    .module-visual-info h2{font:25px Georgia,serif;margin:6px 0 8px;color:#f1e5ea}
    .module-visual-info p{margin:0;color:var(--muted);line-height:1.65;font-size:12px}
    .module-visual-caption{display:none}
    .memory-hero{display:flex;justify-content:space-between;align-items:center;gap:20px;margin:18px 0 12px;padding:22px 24px;border:1px solid #493440;border-radius:13px;background:linear-gradient(120deg,#171017,#100d11)}
    .memory-hero h1{font:30px Georgia,serif;margin:7px 0 3px}.memory-hero p{margin:0;color:var(--muted);font-size:12px}.memory-count{min-width:120px;text-align:right}.memory-count b{display:block;font:30px 'DM Mono',monospace;color:var(--pink2)}.memory-count small{color:var(--muted);font-size:10px}
    .memory-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}.memory-stats .panel{padding:14px 16px}.memory-stats b{display:block;font:21px 'DM Mono',monospace;color:var(--pink2)}.memory-stats small{color:var(--muted);font-size:10px}
    .memory-analysis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.memory-pattern{padding:16px 18px}.memory-pattern h3{font:18px Georgia,serif;margin:7px 0}.memory-pattern p{margin:0;color:#d6c9cf;line-height:1.65}.memory-pattern small{display:block;color:var(--muted);font-size:10px;margin-top:9px}
    .memory-report{padding:20px;margin-top:12px}.memory-report h2{font:22px Georgia,serif;margin:7px 0}.memory-report p{color:#d6c9cf;line-height:1.7;margin:7px 0}.memory-report .report-item{padding:12px 0;border-top:1px solid #292029}.memory-report .report-item b{display:block;margin-bottom:4px}.memory-report .report-item span{color:#cfc1c8;line-height:1.6}
    @media(max-width:700px){.module-visual{grid-template-columns:1fr}.module-visual-media img{height:190px}.module-visual-info{padding:18px}.memory-hero{padding:18px;align-items:flex-start}.memory-count{text-align:left}.memory-stats{grid-template-columns:repeat(2,1fr)}.memory-analysis{grid-template-columns:1fr}}
  `;document.head.appendChild(s)}
  function cleanupLegacy(){document.querySelectorAll('.module-hero').forEach(x=>x.remove())}
  function addMemoryNav(){const nav=document.querySelector('.nav');if(!nav||nav.querySelector('[data-page="memory"]'))return;const journal=nav.querySelector('button[data-page="journal"]');if(!journal)return;const b=document.createElement('button');b.dataset.page='memory';b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6l1 2h4v14H4V6h4z"/><path d="M8 10h8M8 14h6"/></svg><span>Memory</span>';journal.insertAdjacentElement('afterend',b)}
  function addVisual(){const v=document.querySelector('#view'),page=v?.dataset.page;if(!v||!heroes[page])return;cleanupLegacy();if(v.querySelector('.module-visual'))return;const [img,title,desc]=heroes[page],section=v.querySelector('section')||v.firstElementChild;if(!section)return;const head=section.querySelector('.viewhead');const h=document.createElement('div');h.className='module-visual';h.innerHTML=`<div class="module-visual-media"><img src="${img}" alt="${title}"></div><div class="module-visual-info"><div class="eyebrow">${title} SYSTEM</div><h2>Make the routine work for you.</h2><p>${desc}</p></div>`;if(head)head.insertAdjacentElement('afterend',h);else section.insertBefore(h,section.firstChild)}
  function tick(){style();cleanupLegacy();addMemoryNav();addVisual()}
  tick();
  const root=document.getElementById('view');if(root)new MutationObserver(()=>requestAnimationFrame(tick)).observe(root,{childList:true,subtree:true});
  window.addEventListener('click',e=>{if(e.target.closest?.('button[data-page]'))setTimeout(tick,0)});
})();