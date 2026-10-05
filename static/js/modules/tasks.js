/* ============================================================================
   AdFlow - Task Management Logic (Wickramanayaka A.W.H.D)
   Full-Stack Kanban Engine & Safeguard Validation Handler
   ============================================================================ */

let taskState = [
    { id: 1, campaignId: 1, campaignTitle: '5G Mega Launch 2026', campaignEndDate: '2026-06-30', assignedToId: 5, assignee: 'Navodi V.G.C', title: '3D Billboard Animation Design', desc: 'Create high-res 3D video loop for Lotus Tower LED display.', priority: 'URGENT', status: 'IN_PROGRESS', deadline: '2026-03-18', link: 'https://drive.google.com/file/d/3d_lotus_tower_v1', comments: 'Draft render 50% complete.' },
    { id: 2, campaignId: 1, campaignTitle: '5G Mega Launch 2026', campaignEndDate: '2026-06-30', assignedToId: 6, assignee: 'Yashika J.', title: 'Radio Jingle Copywriting', desc: 'Draft 30-second energetic Sinhala and English radio ad scripts.', priority: 'HIGH', status: 'NEEDS_REVIEW', deadline: '2026-03-14', link: 'https://docs.google.com/document/d/radio_script_v2', comments: 'Script uploaded for creative lead review.' },
    { id: 3, campaignId: 2, campaignTitle: 'Avurudu Festive Promo', campaignEndDate: '2026-04-20', assignedToId: 5, assignee: 'Navodi V.G.C', title: 'Social Media Banner Sets', desc: 'Design Instagram and Facebook carousel templates for cashback promo.', priority: 'MEDIUM', status: 'TODO', deadline: '2026-03-25', link: '', comments: 'Awaiting final asset guidelines.' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

async function loadTasks() {
    const filterStaff = document.getElementById('filterStaff').value;
    const filterPriority = document.getElementById('filterPriority').value;
    const filterCampaign = document.getElementById('filterCampaign').value;

    if (window.AdFlowAPI) {
        const dbTasks = await AdFlowAPI.getTasks();
        if (Array.isArray(dbTasks) && dbTasks.length > 0) {
            taskState = dbTasks.map(t => ({
                id: t.id || t.taskId,
                campaignId: t.campaignId || 1,
                campaignTitle: t.campaignTitle || '5G Mega Launch 2026',
                campaignEndDate: '2026-06-30',
                assignedToId: t.assignedToId || 5,
                assignee: t.assignee || 'Navodi V.G.C',
                title: t.title || t.taskTitle,
                desc: t.description || t.desc,
                priority: t.priority || 'MEDIUM',
                status: t.status || 'TODO',
                deadline: t.deadline || '2026-03-30',
                link: t.submissionLink || t.link || '',
                comments: t.comments || ''
            }));
        }
    }

    const colTodo = document.getElementById('colTodo');
    const colProgress = document.getElementById('colProgress');
    const colReview = document.getElementById('colReview');
    const colCompleted = document.getElementById('colCompleted');

    colTodo.innerHTML = '';
    colProgress.innerHTML = '';
    colReview.innerHTML = '';
    colCompleted.innerHTML = '';

    let todoCount = 0, progressCount = 0, reviewCount = 0, completedCount = 0;

    let filtered = taskState.filter(t => {
        if (filterStaff !== 'ALL' && t.assignedToId != filterStaff) return false;
        if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
        if (filterCampaign !== 'ALL' && t.campaignId != filterCampaign) return false;
        return true;
    });

    filtered.forEach(t => {
        const cardHtml = `
            <div class="task-card">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge badge-${t.priority ? t.priority.toLowerCase() : 'medium'}">${t.priority}</span>
                    <small class="text-secondary">#TSK-${t.id}</small>
                </div>
                <h6 class="mb-1 text-light">${t.title}</h6>
                <small class="text-secondary d-block mb-2">👤 ${t.assignee} • 🎯 ${t.campaignTitle}</small>
                <small class="text-muted d-block mb-2">📅 Deadline: ${t.deadline}</small>
                ${t.link ? `<small class="d-block text-truncate text-info mb-2">🔗 <a href="${t.link}" target="_blank" class="text-info">Submission Link</a></small>` : ''}
                
                <div class="d-flex gap-1 mt-2">
                    <button class="btn btn-sm btn-outline-info w-100" onclick="openEditTaskModal(${t.id})">Update Status / Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${t.id})">×</button>
                </div>
            </div>
        `;

        if (t.status === 'TODO') { colTodo.innerHTML += cardHtml; todoCount++; }
        else if (t.status === 'IN_PROGRESS') { colProgress.innerHTML += cardHtml; progressCount++; }
        else if (t.status === 'NEEDS_REVIEW' || t.status === 'NEEDS_REVISION') { colReview.innerHTML += cardHtml; reviewCount++; }
        else if (t.status === 'COMPLETED') { colCompleted.innerHTML += cardHtml; completedCount++; }
    });

    document.getElementById('countTodo').innerText = todoCount;
    document.getElementById('countProgress').innerText = progressCount;
    document.getElementById('countReview').innerText = reviewCount;
    document.getElementById('countCompleted').innerText = completedCount;
}

function openCreateTaskModal() {
    document.getElementById('modalHeading').innerText = 'Assign New Task';
    document.getElementById('formAction').value = 'CREATE';
    document.getElementById('taskId').value = '0';
    document.getElementById('taskForm').reset();
    document.getElementById('statusGroup').style.display = 'none';

    // Set default deadline tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('deadline').value = tomorrow.toISOString().split('T')[0];

    document.getElementById('taskModal').style.display = 'flex';
}

function openEditTaskModal(id) {
    const item = taskState.find(t => t.id === id);
    if (!item) return;

    document.getElementById('modalHeading').innerText = 'Update Task #' + id;
    document.getElementById('formAction').value = 'UPDATE';
    document.getElementById('taskId').value = item.id;
    
    document.getElementById('campaignId').value = item.campaignId;
    document.getElementById('assignedToId').value = item.assignedToId;
    document.getElementById('taskTitle').value = item.title;
    document.getElementById('description').value = item.desc || '';
    document.getElementById('priority').value = item.priority;
    document.getElementById('deadline').value = item.deadline;
    document.getElementById('submissionLink').value = item.link || '';
    document.getElementById('comments').value = item.comments || '';

    document.getElementById('statusGroup').style.display = 'block';
    document.getElementById('statusSelect').value = item.status;

    document.getElementById('taskModal').style.display = 'flex';
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    hideAlert();

    const action = document.getElementById('formAction').value;
    const taskId = parseInt(document.getElementById('taskId').value);
    const campaignId = parseInt(document.getElementById('campaignId').value);
    const assignedToId = parseInt(document.getElementById('assignedToId').value);
    const title = document.getElementById('taskTitle').value.trim();
    const desc = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const deadline = document.getElementById('deadline').value;
    const link = document.getElementById('submissionLink').value.trim();
    const comments = document.getElementById('comments').value;
    const status = action === 'UPDATE' ? document.getElementById('statusSelect').value : 'TODO';

    // =========================================================================
    // CLIENT-SIDE VALIDATION CHECKS
    // =========================================================================

    // 1. User Verification Check (Role must be Creative)
    if (assignedToId === 7) {
        showAlert('Role Verification Error: Tasks can only be assigned to Creative Staff or Creative Team Lead.');
        return;
    }

    // 2. Deadline Constraint Check (<= Parent Campaign End Date)
    const campaignSelect = document.getElementById('campaignId');
    const selectedOption = campaignSelect.options[campaignSelect.selectedIndex];
    const campEndDateStr = selectedOption.getAttribute('data-end') || '2026-06-30';

    const deadlineDate = new Date(deadline);
    const campEndDate = new Date(campEndDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
        showAlert('Validation Error: Task deadline cannot be set in the past.');
        return;
    }

    if (deadlineDate > campEndDate) {
        showAlert(`Deadline Constraint Error: Task deadline (${deadline}) cannot exceed parent campaign's end date (${campEndDateStr}).`);
        return;
    }

    // 3. Completion Safeguard Check
    if (status === 'COMPLETED' && !link) {
        showAlert('Completion Safeguard Error: Cannot set status to COMPLETED without providing a submission link or deliverable asset reference.');
        return;
    }

    // Assignee name mapping
    const assigneeNames = { 5: 'Navodi V.G.C', 6: 'Yashika J.', 4: 'Wickramanayaka A.W.H.D' };
    const campaignTitles = { 1: '5G Mega Launch 2026', 2: 'Avurudu Festive Promo' };

    // Save/Update in DB and Memory State
    if (window.AdFlowAPI) {
        if (action === 'CREATE') {
            await AdFlowAPI.createTask({ campaignId, assignedToId, createdById: 4, taskTitle: title, description: desc, priority, status: 'TODO', deadline });
        } else {
            await AdFlowAPI.updateTask({ taskId, campaignId, assignedToId, createdById: 4, taskTitle: title, description: desc, priority, status, deadline });
        }
    }

    if (action === 'CREATE') {
        taskState.push({
            id: Date.now(),
            campaignId: campaignId,
            campaignTitle: campaignTitles[campaignId],
            campaignEndDate: campEndDateStr,
            assignedToId: assignedToId,
            assignee: assigneeNames[assignedToId] || 'Creative Staff',
            title: title,
            desc: desc,
            priority: priority,
            status: 'TODO',
            deadline: deadline,
            link: link,
            comments: comments
        });
    } else {
        const idx = taskState.findIndex(t => t.id === taskId);
        if (idx !== -1) {
            taskState[idx].campaignId = campaignId;
            taskState[idx].campaignTitle = campaignTitles[campaignId];
            taskState[idx].assignedToId = assignedToId;
            taskState[idx].assignee = assigneeNames[assignedToId] || 'Creative Staff';
            taskState[idx].title = title;
            taskState[idx].desc = desc;
            taskState[idx].priority = priority;
            taskState[idx].status = status;
            taskState[idx].deadline = deadline;
            taskState[idx].link = link;
            taskState[idx].comments = comments;
        }
    }

    closeTaskModal();
    await loadTasks();
}

async function deleteTask(id) {
    if (confirm(`Remove Task #${id} from workflow?`)) {
        if (window.AdFlowAPI) {
            await AdFlowAPI.deleteTask(id);
        }
        taskState = taskState.filter(t => t.id !== id);
        await loadTasks();
    }
}

function resetFilters() {
    document.getElementById('filterStaff').value = 'ALL';
    document.getElementById('filterPriority').value = 'ALL';
    document.getElementById('filterCampaign').value = 'ALL';
    loadTasks();
}

function showAlert(msg) {
    document.getElementById('alertMessage').innerText = msg;
    document.getElementById('alertBanner').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    document.getElementById('alertBanner').style.display = 'none';
}
