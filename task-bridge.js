(()=>{
  function goTasks(){
    try{
      if(typeof window.navigate==='function') window.navigate('tasks');
      else document.querySelector('[data-page="tasks"]')?.click();
      setTimeout(()=>document.querySelector('[data-te-new]')?.click(),80);
    }catch(err){console.error('ELIF OS task bridge',err)}
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(!b)return;
    if(b.matches('[data-page="tasks"]')){
      e.preventDefault();
      e.stopImmediatePropagation();
      try{
        if(typeof window.navigate==='function') window.navigate('tasks');
      }catch(err){console.error('ELIF OS tasks navigation',err)}
      setTimeout(()=>window.dispatchEvent(new Event('elif:tasks-ready')),40);
      return;
    }
    if(b.hasAttribute('data-add') && (document.querySelector('#view')?.dataset.page||'home')==='home'){
      e.preventDefault();
      e.stopImmediatePropagation();
      goTasks();
    }
  },true);
})();
