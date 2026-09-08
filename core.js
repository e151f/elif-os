(()=>{
  const KEY='elif-os-v2-state';
  const VERSION=3;
  const pad=n=>String(n).padStart(2,'0');
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
  const uid=()=>crypto.randomUUID();
  const blank={
    tasks:[],habits:[],habitLog:{},studyLog:{},studySessions:[],water:{},sleep:{},movementLog:{},
    wallet:{balance:0,transactions:[]},goals:[],projects:[],journal:[],meals:{},notes:[],calendarEvents:[],automations:[]
  };
  const asArray=(v)=>Array.isArray(v)?v:[];
  const asObject=(v)=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
  const normalizeItem=(x)=>({...x,id:x?.id||uid()});
  function normalize(raw){
    const s={...blank,...asObject(raw)};
    ['tasks','habits','goals','projects','journal','studySessions','notes','calendarEvents','automations'].forEach(k=>s[k]=asArray(s[k]).map(normalizeItem));
    ['habitLog','studyLog','water','sleep','movementLog','meals'].forEach(k=>s[k]=asObject(s[k]));
    s.wallet={balance:Number(s.wallet?.balance)||0,transactions:asArray(s.wallet?.transactions).map(normalizeItem)};
    s.tasks=s.tasks.map(x=>({status:'active',done:false,priority:'medium',projectId:null,goalId:null,...x}));
    s.habits=s.habits.map(x=>({status:'active',...x}));
    s.goals=s.goals.map(x=>({status:'active',progress:0,...x,progress:Math.max(0,Math.min(100,Number(x.progress)||0))}));
    s.projects=s.projects.map(x=>({status:'active',...x}));
    s.automations=s.automations.map(x=>({enabled:true,...x}));
    s._meta={...(asObject(s._meta)),schemaVersion:VERSION,lastNormalizedAt:new Date().toISOString()};
    return s;
  }
  function read(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');return raw?normalize(raw):null}catch{return null}}
  function write(s){localStorage.setItem(KEY,JSON.stringify(normalize(s)));return read()}
  function health(s=read()){
    if(!s)return {ok:true,exists:false,issues:[]};
    const issues=[];
    if(!Array.isArray(s.tasks))issues.push('tasks');
    if(!Array.isArray(s.goals))issues.push('goals');
    if(!Array.isArray(s.projects))issues.push('projects');
    if(!Array.isArray(s.habits))issues.push('habits');
    if(!s.wallet||!Array.isArray(s.wallet.transactions))issues.push('wallet');
    return {ok:issues.length===0,exists:true,issues,schemaVersion:s._meta?.schemaVersion||0,today:today()};
  }
  const api={KEY,VERSION,today,read,write,normalize,health};
  window.ELIFCore=Object.freeze(api);
  const existing=read();
  if(existing)localStorage.setItem(KEY,JSON.stringify(existing));
})();
