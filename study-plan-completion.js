(()=>{
  function add(date,start,end,subject,title){const a=window.ELIFStudyPlan?.plans;if(!a)return;const id=`${date}-${start}-${subject}`;if(!a.some(x=>x.id===id))a.push({id,date,start,end,subject,title})}
  function patch(){
    add('2026-09-28','18:00','18:45','micro','Microbiology: Week 2 recall');add('2026-09-28','19:00','19:30','history','Atatürk: Week 2 recall');
    add('2026-10-05','18:00','18:45','micro','Microbiology: Week 2 cumulative recall');add('2026-10-05','19:00','19:30','history','Atatürk: Week 2 cumulative recall');
    add('2026-10-12','18:00','18:45','micro','Microbiology: Week 3 cumulative recall');add('2026-10-12','19:00','19:30','history','Atatürk: Week 3 cumulative recall');
    add('2026-10-19','18:00','18:45','micro','Microbiology: Week 4 cumulative recall');add('2026-10-19','19:00','19:30','history','Atatürk: Week 4 cumulative recall');
    add('2026-10-26','18:00','19:00','micro','Microbiology: Weeks 1–5 cumulative recall');add('2026-10-26','19:15','19:45','history','Atatürk: Week 5 cumulative recall');
    add('2026-11-02','18:00','19:00','micro','Microbiology: midterm cumulative recall');add('2026-11-02','19:15','19:45','history','Atatürk: final pre-midterm recall');
    const s=JSON.parse(localStorage.getItem('elif-os-v2-state')||'{}');s.studyPlan=window.ELIFStudyPlan.plans;s.studyPlanVersion='2026-midterm-v1';localStorage.setItem('elif-os-v2-state',JSON.stringify(s));
  }
  window.addEventListener('load',()=>setTimeout(patch,120));
})();