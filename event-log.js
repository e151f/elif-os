(()=>{
  const KEY='elif-os-v2-state';
  const TASK_ID='tennis-club-fair-2026-09-28';
  const EVENT_ID='tennis-club-fair-2026-09-28-29';
  try{
    const state=JSON.parse(localStorage.getItem(KEY)||'null');
    if(!state)return;
    state.tasks=Array.isArray(state.tasks)?state.tasks:[];
    state.calendarEvents=Array.isArray(state.calendarEvents)?state.calendarEvents:[];
    if(!state.tasks.some(t=>t.id===TASK_ID)){
      state.tasks.push({id:TASK_ID,title:'Tenis kulübü okul kulüp sergisine git',priority:'medium',date:'2026-09-28',done:false,projectId:null,goalId:null});
    }
    const eventDates=['2026-09-28','2026-09-29'];
    eventDates.forEach(date=>{
      const id=`${EVENT_ID}-${date}`;
      if(!state.calendarEvents.some(e=>e.id===id)){
        state.calendarEvents.push({id,title:'Tenis kulübü okul kulüp sergisi',date,start:'',end:'',allDay:true});
      }
    });
    localStorage.setItem(KEY,JSON.stringify(state));
  }catch(e){console.warn('ELIF OS event log migration failed',e)}
})();
