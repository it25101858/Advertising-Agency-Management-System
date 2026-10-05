/* AdFlow - Task Form Module */
const TaskForm = {
    _editId: null,

    open(task = null) {
        this._editId = task?.id || null;
        Modal.setTitle('taskModal', task ? 'Edit Task' : 'Create New Task');
        const t = task || {};

        document.getElementById('taskModalBody').innerHTML = `
        <div class="form-group">
            <label class="form-label">Task Title <span class="required">*</span></label>
            <input type="text" id="tTitle" class="form-control" value="${t.title || ''}" placeholder="3D Lotus Tower Anamorphic Billboard Design" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Campaign</label>
                <input type="text" id="tCampaign" class="form-control" value="${t.campaign || ''}" placeholder="5G Mega Launch 2026">
            </div>
            <div class="form-group">
                <label class="form-label">Assignee</label>
                <input type="text" id="tAssignee" class="form-control" value="${t.assignee || ''}" placeholder="Navodi V.G.C">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Priority</label>
                <select id="tPriority" class="form-control">
                    ${['CRITICAL','HIGH','MEDIUM','LOW'].map(p => `<option value="${p}" ${t.priority===p?'selected':''}>${p}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select id="tStatus" class="form-control">
                    ${['TODO','IN_PROGRESS','IN_REVIEW','NEEDS_REVISION','COMPLETED'].map(s => `<option value="${s}" ${t.status===s?'selected':''}>${FormatUtils.humanize(s)}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Deadline</label>
            <input type="date" id="tDeadline" class="form-control" value="${t.deadline || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="tDesc" class="form-control" rows="3" placeholder="Detailed task description...">${t.description || ''}</textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="Modal.close('taskModal')">Cancel</button>
            <button class="btn btn-primary" onclick="TaskForm.save()">${task ? 'Save Changes' : 'Create Task'}</button>
        </div>`;

        Modal.open('taskModal');
    },

    openDetail(taskId) {
        if (typeof taskState === 'undefined') return;
        const t = taskState.find(x => x.id === taskId);
        if (!t) return;

        Modal.setTitle('detailModal', t.title);
        document.getElementById('detailModalBody').innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div><strong>Status:</strong> ${Table.statusBadge(t.status)}</div>
            <div><strong>Priority:</strong> ${Table.statusBadge(t.priority, t.priority?.toLowerCase())}</div>
            <div><strong>Assignee:</strong> ${t.assignee || '—'}</div>
            <div><strong>Campaign:</strong> ${t.campaign || '—'}</div>
            <div><strong>Deadline:</strong> ${DateUtils.format(t.deadline)}</div>
            <div><strong>Created:</strong> ${DateUtils.format(t.createdAt)}</div>
        </div>
        <p><strong>Description:</strong></p>
        <p style="margin-top:8px;color:var(--text-secondary);line-height:1.6">${t.description || '—'}</p>
        <div style="margin-top:16px;display:flex;gap:8px">
            <button class="btn btn-sm btn-secondary" onclick="Modal.close('detailModal');TaskForm.open(taskState.find(x=>x.id===${t.id}))">✏️ Edit</button>
            <button class="btn btn-sm btn-danger" onclick="Modal.close('detailModal');deleteTask(${t.id})">🗑️ Delete</button>
        </div>`;
        Modal.open('detailModal');
    },

    getData() {
        return {
            id:          this._editId,
            title:       document.getElementById('tTitle')?.value?.trim(),
            campaign:    document.getElementById('tCampaign')?.value?.trim(),
            assignee:    document.getElementById('tAssignee')?.value?.trim(),
            priority:    document.getElementById('tPriority')?.value,
            status:      document.getElementById('tStatus')?.value || 'TODO',
            deadline:    document.getElementById('tDeadline')?.value,
            description: document.getElementById('tDesc')?.value?.trim()
        };
    },

    async save() {
        const data = this.getData();
        if (!data.title) { Toast.error('Task title is required.'); return; }

        const btn = document.querySelector('#taskModal .btn-primary');
        await Loader.withButton(btn, async () => {
            try {
                const action = this._editId ? 'update' : 'create';
                await TasksApi[action](data);
                Toast.success(this._editId ? 'Task updated.' : 'Task created!');
                Modal.close('taskModal');
                if (typeof loadTasks === 'function') loadTasks();
            } catch (err) {
                Toast.error(err.message || 'Failed to save task.');
            }
        });
    }
};
window.TaskForm = TaskForm;
