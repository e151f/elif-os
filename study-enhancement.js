(()=>{
  const APP='elif-os-v2-state';
  const root=()=>document.querySelector('#view');
  const day=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const read=()=>{try{return JSON.parse(localStorage.getItem(APP)||'{}')}catch{return {}}};
  const write=s=>localStorage.setItem(APP,JSON.stringify(s));
  const durations={focus:25*60,short:5*60,long:15*60};
  let mode='focus',seconds=durations.focus,running=false,timer=null,rendered=false;
  const fmt=n=>`${String(Math.floor(Math.max(0,n)/60)).padStart(2,'0')}:${String(Math.max(0,n)%60).padStart(2,'0')}`;
  function stop(){if(timer){clearInterval(timer);timer=null}running=false}
  function paint(){
    const t=document.querySelector('#elif-pomo-time'),m=document.querySelector('#elif-pomo-mode'),b=document.querySelector('[data-elif-pomo-toggle]');
    if(t)t.textContent=fmt(seconds);
    if(m)m.textContent=mode==='focus'?'FOCUS':mode==='short'?'SHORT BREAK':'LONG BREAK';
    if(b)b.textContent=running?'pause':'start';
  }
  function complete(){
    stop();
    if(mode==='focus'){
      const s=read(),d=day();
      s.studyLog=s.studyLog||{};
      s.studyLog[d]=Number(s.studyLog[d]||0)+25;
      write(s);
    }
    seconds=durations[mode];
    paint();
  }
  function tick(){
    if(!running)return;
    seconds=Math.max(0,seconds-1);
    if(seconds===0){complete();return}
    paint();
  }
  function start(){
    if(running)return;
    running=true;
    if(timer)clearInterval(timer);
    timer=setInterval(tick,1000);
    paint();
  }
  function setMode(next){
    if(!durations[next])return;
    stop();mode=next;seconds=durations[next];paint();
  }
  function reset(){stop();seconds=durations[mode];paint()}
  function render(){
    const v=root();if(!v||v.dataset.page!=='study')return;
    stop();rendered=true;
    const s=read(),done=Number(s.studyLog?.[day()]||0);
    v.innerHTML=`<section class="study-page"><div class="viewhead"><div><h1>Study</h1><p>Focus deeply, recover properly, and measure the work.</p></div></div>
      <div class="panel" style="padding:24px;text-align:center">
        <div class="eyebrow" id="elif-pomo-mode">FOCUS</div>
        <div id="elif-pomo-time" style="font:clamp(64px,12vw,104px) DM Mono,monospace;letter-spacing:-.06em;margin:12px 0">25:00</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button class="ghost" data-elif-pomo-mode="focus" type="button">25 min focus</button>
          <button class="ghost" data-elif-pomo-mode="short" type="button">5 min break</button>
          <button class="ghost" data-elif-pomo-mode="long" type="button">15 min break</button>
        </div>
        <div class="actions" style="justify-content:center;margin-top:18px">
          <button class="primary" data-elif-pomo-toggle type="button">start</button>
          <button class="ghost" data-elif-pomo-reset type="button">reset</button>
        </div>
        <p style="color:var(--muted)">${done} focus minutes completed today</p>
      </div></section>`;
    seconds=durations[mode];paint();
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-elif-pomo-mode],[data-elif-pomo-toggle],[data-elif-pomo-reset]');
    if(!b)return;
    if(!document.querySelector('.study-page'))return;
    e.preventDefault();e.stopImmediatePropagation();
    if(b.hasAttribute('data-elif-pomo-toggle')){running?stop():start();paint();return}
    if(b.hasAttribute('data-elif-pomo-reset')){reset();return}
    setMode(b.dataset.elifPomoMode);
  },true);
  window.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-page="study"]');
    if(b)setTimeout(render,0);
  });
  window.ELIFStudyEnhancement={render,start,stop,reset,setMode};
})();