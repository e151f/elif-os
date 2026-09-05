// ELIF OS relationship layer: Goal -> Project -> Task, with live progress propagation.
(() => {
  const KEY = 'elif-os-v2-state';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const today = () => new Date().toISOString().slice(0, 10);
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const write = s => localStorage.setItem(KEY, JSON.stringify(s));

  // Give every project a goal relation where a sensible area match exists.
  function normalizeRelations(s) {
    s.goals ||= [];
    s.projects ||= [];
    s.tasks ||= [];
    let changed = false;

    for (const p of s.projects) {
      if (p.goalId && s.goals.some(g => g.id === p.goalId)) continue;
      const match = s.goals.find(g => String(g.area || '').toLowerCase() === String(p.area || '').toLowerCase());
      if (match) { p.goalId = match.id; changed = true; }
    }

    // A task assigned to a project inherits that project's goal unless explicitly set.
    for (const t of s.tasks) {
      const p = s.projects.find(x => x.id === t.projectId);
      if (p?.goalId && t.goalId !== p.goalId) { t.goalId = p.goalId; changed = true; }
    }

    // Projects with linked tasks derive progress from those tasks.
    for (const p of s.projects) {
      const linked = s.tasks.filter(t => t.projectId === p.id);
      if (!linked.length) continue;
      const pct = Math.round(linked.filter(t => t.done).length / linked.length * 100);
      if (Number(p.progress || 0) !== pct) { p.progress = pct; changed = true; }
    }

    // Goals derive progress from their linked projects when there is execution data.
    for (const g of s.goals) {
      const ps = s.projects.filter(p => p.goalId === g.id);
      const withExecution = ps.filter(p => s.tasks.some(t => t.projectId === p.id));
      if (!withExecution.length) continue;
      const pct = Math.round(withExecution.reduce((a, p) => a + Number(p.progress || 0), 0) / withExecution.length);
      if (Number(g.progress || 0) !== pct) { g.progress = pct; changed = true; }
    }
    return changed;
  }

  function rerender() {
    const active = document.querySelector('nav button.active');
    if (active) active.click();
    else document.querySelector('nav button[data-page="home"]')?.click();
  }

  function syncRelations(forceRender = true) {
    const s = read();
    if (!s.tasks) return;
    const changed = normalizeRelations(s);
    if (changed) {
      write(s);
      if (forceRender) rerender();
    }
  }

  function closeModal() { $('#modal')?.classList.remove('open'); }

  function relationModal(kind, presetProjectId = '') {
    const s = read();
    const goals = s.goals || [];
    const projects = s.projects || [];
    const project = projects.find(p => p.id === presetProjectId);
    const projectOptions = projects.map(p => `<option value="${esc(p.id)}" ${p.id === presetProjectId ? 'selected' : ''}>${esc(p.name)}</option>`).join('');
    const goalOptions = goals.map(g => `<option value="${esc(g.id)}" ${project?.goalId === g.id ? 'selected' : ''}>${esc(g.title)}</option>`).join('');
    const title = kind === 'task' ? 'New task' : kind === 'project' ? 'New project' : 'New goal';
    let body = '';
    if (kind === 'task') body = `
      <form data-rel-form="task">
        <label>Task<input name="title" required placeholder="What needs to happen?"></label>
        <label>Date<input name="date" type="date" value="${today()}"></label>
        <label>Priority<select name="priority"><option>low</option><option selected>medium</option><option>high</option></select></label>
        <label>Project<select name="projectId"><option value="">No project</option>${projectOptions}</select></label>
        <label>Goal<select name="goalId"><option value="">No goal</option>${goalOptions}</select></label>
        <button class="primary">Create task</button>
      </form>`;
    if (kind === 'project') body = `
      <form data-rel-form="project">
        <label>Project<input name="name" required placeholder="Project name"></label>
        <label>Area<input name="area" placeholder="Korean / Academics / Body / Finance"></label>
        <label>Goal<select name="goalId"><option value="">No goal</option>${goalOptions}</select></label>
        <button class="primary">Create project</button>
      </form>`;
    if (kind === 'goal') body = `
      <form data-rel-form="goal">
        <label>Goal<input name="title" required placeholder="Outcome you want"></label>
        <label>Area<input name="area" placeholder="Korean / Academics / Body / Finance"></label>
        <button class="primary">Create goal</button>
      </form>`;
    const modal = $('#modal');
    if (!modal) return;
    modal.innerHTML = `<div class="modal-box"><button class="close" data-rel-close>×</button><span class="eyebrow">ELIF OS · LINKED DATA</span><h2>${title}</h2>${body}</div>`;
    modal.classList.add('open');
  }

  // Capture phase lets the relationship-aware forms replace the basic V2 forms.
  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.matches('[data-rel-close]')) { e.preventDefault(); closeModal(); return; }
    if (b.matches('[data-add-task]') || b.matches('[data-add]')) {
      e.preventDefault(); e.stopImmediatePropagation(); relationModal('task'); return;
    }
    if (b.matches('[data-add-task-project]')) {
      e.preventDefault(); e.stopImmediatePropagation(); relationModal('task', b.dataset.addTaskProject); return;
    }
    if (b.matches('[data-add-project]')) {
      e.preventDefault(); e.stopImmediatePropagation(); relationModal('project'); return;
    }
    if (b.matches('[data-add-goal]')) {
      e.preventDefault(); e.stopImmediatePropagation(); relationModal('goal'); return;
    }
  }, true);

  document.addEventListener('submit', e => {
    const form = e.target.closest('[data-rel-form]');
    if (!form) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const fd = new FormData(form);
    const s = read();
    s.tasks ||= []; s.projects ||= []; s.goals ||= [];
    const type = form.dataset.relForm;
    if (type === 'task') {
      const projectId = fd.get('projectId') || null;
      const project = s.projects.find(p => p.id === projectId);
      const goalId = fd.get('goalId') || project?.goalId || null;
      s.tasks.push({ id: crypto.randomUUID(), title: fd.get('title'), priority: fd.get('priority') || 'medium', date: fd.get('date') || today(), done: false, projectId, goalId });
    } else if (type === 'project') {
      const goalId = fd.get('goalId') || null;
      const goal = s.goals.find(g => g.id === goalId);
      s.projects.push({ id: crypto.randomUUID(), name: fd.get('name'), area: fd.get('area') || goal?.area || '', goalId, progress: 0 });
    } else if (type === 'goal') {
      s.goals.push({ id: crypto.randomUUID(), title: fd.get('title'), area: fd.get('area') || '', progress: 0 });
    }
    normalizeRelations(s);
    write(s);
    closeModal();
    rerender();
  }, true);

  // The core app handles completion first; this layer then recalculates the entire chain.
  document.addEventListener('change', () => setTimeout(() => syncRelations(true), 0));
  document.addEventListener('submit', () => setTimeout(() => syncRelations(true), 0));

  // Keep old/seed data relational as well as newly created data.
  setTimeout(() => syncRelations(false), 300);

  // Search remains lightweight but now includes goals and projects too.
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-search]');
    if (!b) return;
    const q = prompt('Search ELIF OS');
    if (!q) return;
    const s = read(), needle = q.toLowerCase();
    const hits = [
      ...(s.tasks || []).map(x => ['TASK', x.title, x.done ? '✓' : '○']),
      ...(s.goals || []).map(x => ['GOAL', x.title, `${x.progress || 0}%`]),
      ...(s.projects || []).map(x => ['PROJECT', x.name, `${x.progress || 0}%`])
    ].filter(x => String(x[1]).toLowerCase().includes(needle));
    alert(hits.length ? hits.map(x => `${x[2]} ${x[0]} · ${x[1]}`).join('\n') : 'No matching data.');
  });
})();
