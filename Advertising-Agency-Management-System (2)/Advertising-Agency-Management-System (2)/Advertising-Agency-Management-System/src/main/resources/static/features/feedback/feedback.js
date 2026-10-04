/* AdFlow - Feedback Controller */
let feedbackState = [
    { id:1, clientName:'Kasun Perera', clientEmail:'client@dialog.lk', campaignTitle:'5G Mega Launch 2026', rating:5, comment:'Exceptional 3D billboard design! The anamorphic Lotus Tower animation blew our minds. BrightWave truly delivered world-class work.', submittedAt:'2026-03-05', status:'PUBLISHED' },
    { id:2, clientName:'Kasun Perera', clientEmail:'client@dialog.lk', campaignTitle:'Avurudu Festive Promo', rating:4, comment:'Great festive visuals and culturally authentic designs. Minor delay in delivery but overall quality was superb.', submittedAt:'2026-03-08', status:'PUBLISHED' }
];

document.addEventListener('DOMContentLoaded', async () => {
    if (!PermissionUtils.requireModule('feedback')) return;
    Navbar.render(); Navbar.init();
    Sidebar.render('feedback');
    Modal.init();

    const live = await FeedbackApi.getAll();
    if (Array.isArray(live) && live.length) feedbackState = live;

    loadFeedback();
});

function loadFeedback() {
    const search      = document.getElementById('searchInput')?.value?.toLowerCase();
    const filterRating= document.getElementById('filterRating')?.value;
    const grid        = document.getElementById('feedbackGrid');
    if (!grid) return;

    const isClient = PermissionUtils.isClient();
    const user     = StorageUtils.getUser();

    let filtered = feedbackState.filter(f => {
        if (filterRating && filterRating !== 'ALL' && f.rating != filterRating) return false;
        if (search && !`${f.clientName} ${f.campaignTitle} ${f.comment}`.toLowerCase().includes(search)) return false;
        return true;
    });

    // Stats
    const avgRating = filtered.length ? (filtered.reduce((s, f) => s + f.rating, 0) / filtered.length).toFixed(1) : 0;
    document.getElementById('statTotal')?.(el => el.textContent = filtered.length);
    document.getElementById('statAvg')?.(el => el.textContent = avgRating + '⭐');

    if (!filtered.length) {
        grid.innerHTML = `<div class="table-empty" style="grid-column:1/-1">
            <div class="empty-icon">💬</div><div class="empty-title">No feedback found</div></div>`;
        return;
    }

    const stars = (n) => '⭐'.repeat(Math.max(0, Math.min(5, n)));
    const initials = (name) => FormatUtils.initials(name);
    const color    = (name) => FormatUtils.colorFromString(name);

    grid.innerHTML = filtered.map(f => {
        const isOwner = isClient && f.clientEmail === user?.email;
        const canEdit = isOwner;
        const canDelete = isOwner || PermissionUtils.isAdmin();

        return `
        <div class="feedback-card">
            <div class="feedback-author">
                <div class="author-avatar" style="background:${color(f.clientName)}">${initials(f.clientName)}</div>
                <div>
                    <div style="font-weight:700;font-size:0.95rem">${f.clientName}</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">${f.clientEmail || '—'} • ${DateUtils.format(f.submittedAt)}</div>
                </div>
                <div style="margin-left:auto">${Table.statusBadge(f.status)}</div>
            </div>

            <div class="star-rating" style="margin-bottom:8px">
                <span style="font-size:1.2rem">${stars(f.rating)}</span>
                <span style="font-size:0.85rem;color:var(--text-secondary);margin-left:6px">${f.rating}/5</span>
            </div>

            <div style="font-size:0.78rem;color:var(--blue-electric);font-weight:700;margin-bottom:6px">📢 ${f.campaignTitle || '—'}</div>

            <div class="feedback-comment">${f.comment}</div>

            <div style="display:flex;gap:8px;margin-top:12px">
                ${canEdit   ? `<button class="btn btn-sm btn-secondary" onclick="FeedbackForm.open(feedbackState.find(x=>x.id===${f.id}))">✏️ Edit</button>` : ''}
                ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="deleteFeedback(${f.id})">🗑️ Delete</button>` : ''}
            </div>
        </div>`;
    }).join('');
}

async function deleteFeedback(id) {
    const confirmed = await Confirmation.delete('this feedback');
    if (!confirmed) return;
    const result = await FeedbackApi.delete(id);
    if (result !== null) {
        feedbackState = feedbackState.filter(f => f.id !== id);
        loadFeedback();
        Toast.success('Feedback deleted.');
    } else Toast.error('Failed to delete feedback.');
}
