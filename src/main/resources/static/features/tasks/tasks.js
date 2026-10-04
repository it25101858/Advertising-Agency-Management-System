/* AdFlow - Tasks Controller */
let taskState = [
    { id:101, title:'3D Lotus Tower Anamorphic Billboard Design', campaign:'5G Mega Launch 2026', assignee:'Navodi V.G.C', priority:'HIGH', status:'IN_PROGRESS', deadline:'2026-03-10', description:'Render 4K 3D anamorphic LED billboard video.', createdAt:'2026-03-01' },
    { id:102, title:'Radio Commercial Copywriting (Sinhala & English)', campaign:'5G Mega Launch 2026', assignee:'Yashika J.', priority:'MEDIUM', status:'IN_REVIEW', deadline:'2026-03-08', description:'Write 30-second radio script.', createdAt:'2026-03-01' },
    { id:103, title:'Avurudu Festive Promo Banner Set', campaign:'Avurudu Festive Promo', assignee:'Navodi V.G.C', priority:'HIGH', status:'NEEDS_REVISION', deadline:'2026-03-12', description:'Design 6 digital banner sizes.', createdAt:'2026-03-02' },
    { id:104, title:'Social Media Video Teaser 15s', campaign:'5G Mega Launch 2026', assignee:'Yashika J.', priority:'MEDIUM', status:'TODO', deadline:'2026-03-14', description:'Produce 15-second teaser clip.', createdAt:'2026-03-02' }
];

let viewMode = 'kanban';

document.addEventListener('DOMContentLoaded', async () => {
    if (!PermissionUtils.requireModule('tasks')) return;
    Navbar.render(); Navbar.init();
    Sidebar.render('tasks');
    Modal.init();

    const live = await TasksApi.getAll();
    if (Array.isArray(live) && live.length) taskState = live;

    loadTasks();
});

function loadTasks() {
    const filterPriority = document.getElementById('filterPriority')?.value;
    const filterStatus   = document.getElementById('filterStatus')?.value;
    const search         = document.getElementById('searchInput')?.value?.toLowerCase();

    let filtered = taskState.filter(t => {
        if (filterPriority && filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
        if (filterStatus   && filterStatus   !== 'ALL' && t.status   !== filterStatus)   return false;
        if (search && !`${t.title} ${t.assignee} ${t.campaign}`.toLowerCase().includes(search)) return false;
        return true;
    });

    if (viewMode === 'kanban') {
        document.getElementById('kanbanView')?.classList.remove('d-none');
        document.getElementById('listView')?.classList.add('d-none');
        Kanban.render(filtered);
    } else {
        document.getElementById('listView')?.classList.remove('d-none');
        document.getElementById('kanbanView')?.classList.add('d-none');
        renderTaskList(filtered);
    }
}

function renderTaskList(tasks) {
    const tbody = document.getElementById('taskTableBody');
    if (!tbody) return;
    if (!tasks.length) {
        tbody.innerHTML = `<tr><td colspan="7"><div class="table-empty"><div class="empty-icon">📋</div><div class="empty-title">No tasks found</div></div></td></tr>`;
        return;
    }
    tbody.innerHTML = tasks.map(t => {
        const days = DateUtils.daysUntil(t.deadline);
        const dlStyle = days !== null && days < 0 ? 'color:var(--accent-red);font-weight:700' : days !== null && days <= 2 ? 'color:var(--accent-amber);font-weight:700' : '';
        return `<tr>
            <td><strong>#${t.id}</strong></td>
            <td style="max-width:240px;font-weight:600">${FormatUtils.truncate(t.title, 55)}</td>
            <td>${t.campaign || '—'}</td>
            <td>${t.assignee || '—'}</td>
            <td>${Table.statusBadge(t.priority)}</td>
            <td>${Table.statusBadge(t.status)}</td>
            <td><span style="${dlStyle}">${DateUtils.format(t.deadline)}</span></td>
            <td><div class="table-actions">
                <button class="btn-icon" onclick="TaskForm.openDetail(${t.id})" title="View">👁️</button>
                <button class="btn-icon" onclick="TaskForm.open(taskState.find(x=>x.id===${t.id}))" title="Edit">✏️</button>
                <button class="btn-icon" style="color:var(--accent-red)" onclick="deleteTask(${t.id})" title="Delete">🗑️</button>
            </div></td>
        </tr>`;
    }).join('');
}

function switchView(mode) {
    viewMode = mode;
    document.getElementById('btnKanban')?.classList.toggle('active', mode === 'kanban');
    document.getElementById('btnList')?.classList.toggle('active', mode === 'list');
    loadTasks();
}

async function deleteTask(id) {
    const confirmed = await Confirmation.delete(`Task #${id}`);
    if (!confirmed) return;
    const result = await TasksApi.delete(id);
    if (result !== null) {
        taskState = taskState.filter(t => t.id !== id);
        loadTasks();
        Toast.success('Task deleted.');
    } else Toast.error('Failed to delete task.');
}
