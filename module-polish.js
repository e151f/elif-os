(()=>{
  const heroes={
    study:['study.jpeg','STUDY','Build your mind.','Focus deeply and make learning compound.'],
    body:['body.jpeg','BODY','Build your body.','Strength, recovery and the physical foundation.'],
    wallet:['money.jpeg','WALLET','Build financial intelligence.','Record decisions, outcomes and patterns.'],
    meal:['IMG_0954.jpeg','MEAL','Fuel the system.','Plan ahead, use what you have, and eat well.'],
    journal:['IMG_0955.jpeg','JOURNAL','Know yourself.','Keep a durable record of your thoughts and decisions.'],
    goals:['IMG_0956.jpeg','GOALS','Choose the direction.','Keep the long-term picture visible.'],
    projects:['IMG_0957.jpeg','PROJECTS','Turn ideas into reality.','Move important things from intention to execution.'],
    sleep:['IMG_0958.jpeg','SLEEP','Protect the foundation.','Recovery is part of performance.']
  };
  function style(){if(document.getElementById('elif-module-polish-css'))return;const s=document.createElement('style');s.id='elif-module-polish-css';s.textContent=`
    .module-visual-row{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:14px;margin:16px 0 14px;align-items:stretch}
    .module-hero{position:relative;border:1px solid #493440;border-radius:13px;overflow:hidden;background:#100d12}
    .module-hero img{display:block;width:100%;height:260px;object-fit:cover;filter:saturate(.82)}
    .module-hero-copy{padding:18px 20px 20px}
    .module-hero-copy h2{font:25px Georgia,serif;margin:6px 0 5px}.module-hero-copy p{margin:0;color:#d6c8cf;font:italic 14px Georgia,serif}.module-hero-copy small{display:block;margin-top:8px;color:#a99aa3;font-size:10px;max-width:500px}
    .module-hero-side{border:1px solid #493440;border-radius:13px;background:#100d12;padding:20px;display:flex;flex-direction:column;justify-content:center}.module-hero-side .metric-big{margin:8px 0;font-size:28px}.module-hero-side p{color:var(--muted);line-height:1.6;margin:0}.module-hero-side .side-line{margin-top:16px;padding-top:13px;border-top:1px solid #292029;color:#cfc1c8;font-size:11px}
    .memory-hero{display:flex;justify-content:space-between;align-items:center;gap:20px;margin:18px 0 12px;padding:22px 24px;border:1px solid #493440;border-radius:13px;background:linear-gradient(120deg,#171017,#100d11)}
    .memory-hero h1{font:30px Georgia,serif;margin:7px 0 3px}.memory-hero p{margin:0;color:var(--muted);font-size:12px}.memory-count{min-width:120px;text-align:right}.memory-count b{display:block;font:30px 'DM Mono',monospace;color:var(--pink2)}.memory-count small{color:var(--muted);font-size:10px}
    .memory-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}.memory-stats .panel{padding:14px 16px}.memory-stats b{display:block;font:21px 'DM Mono',monospace;color:var(--pink2)}.memory-stats small{color:var(--muted);font-size:10px}
    .memory-analysis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.memory-pattern{padding:16px 18px}.memory-pattern h3{font:18px Georgia,serif;margin:7px 0}.memory-pattern p{margin:0;color:#d6c9cf;line-height:1.65}.memory-pattern small{display:block;color:var(--muted);font-size:10px;margin-top:9px}
    .memory-report{padding:20px;margin-top:12px}.memory-report h2{font:22px Georgia,serif;margin:7px 0}.memory-report p{color:#d6c9cf;line-height:1.7;margin:7px 0}.memory-report .report-item{padding:12px 0;border-top:1px solid #292029}.memory-report .report-item b{display:block;margin-bottom:4px}.memory-report .report-item span{color:#cfc1c8;line-height:1.6}
    @media(max-width:850px){.module-visual-row{grid-template-columns:1fr}.module-hero img{height:230px}.module-hero-side{min-height:150px}}
    @media(max-width:700px){.module-hero img{height:200px}.module-hero-copy{padding:15px 16px 17px}.module-hero-copy h2{font-size:23px}.memory-hero{padding:18px;align-items:flex-start}.memory-count{text-align:left}.memory-stats{grid-template-columns:repeat(2,1fr)}.memory-analysis{grid-template-columns:1fr}}
  `;document.head.appendChild(s)}
  function addMemoryNav(){const nav=document.querySelector('.nav');if(!nav||nav.querySelector('[data-page="memory"]'))return;const journal=nav.querySelector('button[data-page="journal"]');if(!journal)return;const b=document.createElement('button');b.dataset.page='memory';b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6l1 2h4v14H4V6h4z"/><path d="M8 10h8M8 14h6"/></svg><span>Memory</span>';journal.insertAdjacentElement('afterend',b)}
  function addHero(){const v=document.querySelector('#view'),page=v?.dataset.page;if(!v||!heroes[page]||page==='glow'||v.querySelector('.module-visual-row'))return;const [img,title,sub,desc]=heroes[page],section=v.querySelector('section')||v.firstElementChild;if(!section)return;const row=document.createElement('div');row.className='module-visual-row';row.innerHTML=`<div class="module-hero"><img src="${img}" alt="${title}"><div class="module-hero-copy"><span class="eyebrow">ELIF OS MODULE</span><h2>${title}</h2><p>${sub}</p><small>${desc}</small></div></div><div class="module-hero-side"><span class="eyebrow">${title}</span><div class="metric-big">Your ${title.toLowerCase()} system</div><p>${desc}</p><div class="side-line">Use this space as part of the bigger picture — the goal is consistency, not a perfect day.</div></div>`;section.insertBefore(row,section.firstChild)}
  function tick(){style();addMemoryNav();addHero()}
  tick();
  const root=document.getElementById('view');if(root)new MutationObserver(()=>requestAnimationFrame(tick)).observe(root,{childList:true,subtree:true});
  window.addEventListener('click',e=>{if(e.target.closest?.('button[data-page]'))setTimeout(tick,0)});
})();