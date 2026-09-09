(()=>{try{
const APP='elif-os-v2-state';
const root=()=>document.querySelector('#view');
const day=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const read=()=>{try{return JSON.parse(localStorage.getItem(APP)||'{}')}catch{return {}}};
const write=s=>localStorage.setItem(APP,JSON.stringify(s));
let mode='focus',seconds=1500,running=false,timer=null;
const length={focus:25,short:5,long:15};
const fmt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
function paint(){const t=document.querySelector('#elif-pomo-time'),m=document.querySelector('#elif-pomo-mode'),b=document.querySelector('[data-elif-pomo="toggle"]');if(t)t.textContent=fmt(seconds);if(m)m.textContent=mode==='focus'?'FOCUS':mode==='short'?'SHORT BREAK':'LONG BREAK';if(b)b.textContent=running?'pause':'start'}
function finish(){if(mode==='focus'){const s=read(),d=day();s.studyLog=s.studyLog||{};s.studyLog[d]=Number(s.studyLog[d]||0)+25;write(s)}running=false;clearInterval(timer);paint()}
function render(){const v=root();if(!v)return;const s=read(),d=day(),done=Number(s.studyLog?.[d]||0);v.dataset.page='study';v.innerHTML='<section><div class="viewhead"><div><h1>Study</h1><p>Focus deeply, recover properly, and measure the work.</p></div></div><div class="panel" style="padding:24px;text-align:center"><div class="eyebrow" id="elif-pomo-mode">FOCUS</div><div id="elif-pomo-time" style="font:clamp(64px,12vw,104px) DM Mono,monospace;letter-spacing:-.06em;margin:12px 0">25:00</div><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="ghost" data-elif-pomo="focus" type="button">25 min focus</button><button class="ghost" data-elif-pomo="short" type="button">5 min break</button><button class="ghost" data-elif-pomo="long" type="button">15 min break</button></div><div class="actions" style="justify-content:center;margin-top:18px"><button class="primary" data-elif-pomo="toggle" type="button">start</button><button class="ghost" data-elif-pomo="reset" type="button">reset</button></div><p style="color:var(--muted)">${done} focus minutes completed today</p></div></section>';paint()}
function click(e){const b=e.target.closest('[data-elif-pomo]');if(!b)return;const x=b.dataset.elifPomo;if(['focus','short','long'].includes(x)){mode=x;seconds=length[x]*60;running=false;clearInterval(timer);paint()}else if(x==='reset'){running=false;clearInterval(timer);seconds=length[mode]*60;paint()}else if(x==='toggle'){if(running){running=false;clearInterval(timer);paint()}else{running=true;clearInterval(timer);timer=setInterval(()=>{seconds--;if(seconds<=0)finish();paint()},1000);paint()}}}
window.addEventListener('click',click,true);window.ELIFStudyEnhancement={render};
}catch(e){console.warn('ELIF Study enhancement disabled',e)}})();
