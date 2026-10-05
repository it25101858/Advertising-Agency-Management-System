/* AdFlow - Kanban Board Component */
const Kanban = {
    COLUMNS: [
        { id: 'TODO',          label: 'To Do',       icon: '📋', colorClass: 'todo' },
        { id: 'IN_PROGRESS',   label: 'In Progress', icon: '⚡', colorClass: 'progress' },
        { id: 'IN_REVIEW',     label: 'In Review',   icon: '👁', colorClass: 'review' },
        { id: 'COMPLETED',     label: 'Done',        icon: '✅', colorClass: 'done' }
    ],

    render(tasks, containerId = 'kanbanBoard') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id || t.status === col.id.replace('_', ' '));
            return `
            <div class="kanban-column" data-status="${col.id}">
                <div class="kanban-column-header ${col.colorClass}">
                    <span class="kanban-col-title">${col.icon} ${col.label}</span>
                    <span class="kanban-col-count">${colTasks.length}</span>
                </div>
                <div class="kanban-cards" id="col-${col.id}">
                    ${colTasks.length ? colTasks.map(t => this._taskCard(t)).join('') : `<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.82rem">No tasks</div>`}
                </div>
            </div>`;
        }).join('');
    },

    _taskCard(t) {
        const days   = DateUtils.daysUntil(t.deadline);
        const dlClass = days !== null && days < 0 ? 'overdue' : days !== null && days <= 2 ? 'due-soon' : '';
        const dlText  = days !== null && days < 0 ? `⚠ ${Math.abs(days)}d overdue` : days !== null ? `${days}d left` : '';
        const initials = FormatUtils.initials(t.assignee);
        const color    = FormatUtils.colorFromString(t.assignee);
        const prioMap  = { HIGH: 'priority-high', MEDIUM: 'priority-medium', LOW: 'priority-low', CRITICAL: 'priority-critical' };

        return `
        <div class="task-card" onclick="TaskForm.openDetail(${t.id})">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                <span class="priority-dot ${prioMap[t.priority] || 'priority-medium'}"></span>
                <span style="font-size:0.72rem;color:var(--text-muted);font-weight:700;text-transform:uppercase">${t.priority || 'MEDIUM'}</span>
                <span style="margin-left:auto;font-size:0.7rem;color:var(--text-muted)">#${t.id}</span>
            </div>
            <div class="task-card-title">${FormatUtils.truncate(t.title, 70)}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:8px">${t.campaign || '—'}</div>
            <div class="task-card-meta">
                <div class="task-assignee">
                    <div class="assignee-avatar" style="background:${color}">${initials}</div>
                    <span>${FormatUtils.truncate(t.assignee || '—', 20)}</span>
                </div>
                ${dlText ? `<span class="task-deadline ${dlClass}">${dlText}</span>` : ''}
            </div>
        <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;align-items:center">
                ${this.COLUMNS.filter(c => c.id !== t.status).map(c =>
                    `<button class="btn btn-sm" style="font-size:0.7rem;padding:3px 8px;background:var(--bg-page);border:1px solid var(--border-color);border-radius:20px;cursor:pointer"
                             onclick="event.stopPropagation();moveTask(${t.id},'${c.id}')">${c.icon} ${c.label}</button>`
                ).join('')}
                <button class="btn btn-sm" style="font-size:0.7rem;padding:3px 8px;background:rgba(220,53,69,0.12);border:1px solid rgba(220,53,69,0.4);border-radius:20px;cursor:pointer;color:#dc3545;margin-left:auto"
                        onclick="event.stopPropagation();deleteTask(${t.id})" title="Delete Task">🗑️ Delete</button>
            </div>
        </div>`;
    }
};

window.Kanban = Kanban;

async function moveTask(taskId, newStatus) {
    const result = await TasksApi.move(taskId, newStatus);
    if (result !== null) {
        if (typeof taskState !== 'undefined') {
            const t = taskState.find(x => x.id === taskId);
            if (t) { t.status = newStatus; }
            if (typeof loadTasks === 'function') loadTasks();
        }
        Toast.success(`Task moved to ${FormatUtils.humanize(newStatus)}`);
    } else Toast.error('Failed to move task.');
}
