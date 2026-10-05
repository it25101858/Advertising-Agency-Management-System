/* AdFlow - Campaigns Controller */
let campaignState = [
    { id:1, name:'5G Mega Launch 2026', client:'Dialog Axiata PLC', manager:'Mendiya J.L.P.S', campaignType:'INTEGRATED', priority:'HIGH', budget:2500000, spent:1200000, start:'2026-03-01', end:'2026-06-30', status:'ACTIVE', clientAccess:'AVAILABLE', channels:'Facebook, Instagram, TV, Outdoor', objectives:'Drive islandwide 5G adoption.' },
    { id:2, name:'Avurudu Festive Promo', client:'Dialog Axiata PLC', manager:'Mendiya J.L.P.S', campaignType:'DIGITAL', priority:'MEDIUM', budget:1500000, spent:300000, start:'2026-03-15', end:'2026-04-20', status:'UPCOMING', clientAccess:'NOT_AVAILABLE', channels:'Facebook, Instagram, Display', objectives:'Promote seasonal reload cashbacks.' }
];

document.addEventListener('DOMContentLoaded', async () => {
    if (!PermissionUtils.requireModule('campaigns')) return;
    Navbar.render(); Navbar.init();
    Sidebar.render('campaigns');
    Modal.init();

    const live = await CampaignsApi.getAll();
    if (Array.isArray(live) && live.length) campaignState = live;

    loadCampaigns();
});

function loadCampaigns() {
    const status  = document.getElementById('filterStatus')?.value;
    const search  = document.getElementById('searchInput')?.value?.toLowerCase();
    const grid    = document.getElementById('campaignGrid');
    if (!grid) return;

    const isClient = PermissionUtils.isClient();

    let filtered = campaignState.filter(c => {
        if (isClient && c.clientAccess !== 'AVAILABLE') return false;
        if (status && status !== 'ALL' && c.status !== status) return false;
        if (search && !c.name.toLowerCase().includes(search) && !(c.client||'').toLowerCase().includes(search)) return false;
        return true;
    });

    if (!filtered.length) {
        grid.innerHTML = `<div class="table-empty" style="grid-column:1/-1">
            <div class="empty-icon">📢</div><div class="empty-title">No campaigns found</div></div>`;
        return;
    }

    grid.innerHTML = filtered.map(c => {
        const pct   = FormatUtils.budgetPercent(c.spent, c.budget);
        const color = FormatUtils.progressColor(pct);
        return `
        <div class="campaign-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                ${Table.statusBadge(c.status)}
                <span class="campaign-type-tag">${FormatUtils.humanize(c.campaignType)}</span>
            </div>
            <h3 style="font-size:1.05rem;font-weight:800;color:var(--black-obsidian);margin-bottom:4px">${c.name}</h3>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:12px">${c.client} • ${c.priority} Priority</p>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px">📅 ${DateUtils.format(c.start)} → ${DateUtils.format(c.end)}</div>

            <div class="budget-bar-wrap">
                <div class="budget-label">
                    <span>Budget: ${FormatUtils.currencyCompact(c.spent)} / ${FormatUtils.currencyCompact(c.budget)}</span>
                    <strong>${pct}%</strong>
                </div>
                <div class="progress-bar"><div class="progress-fill ${color}" style="width:${pct}%"></div></div>
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
                <button class="btn btn-sm btn-secondary" onclick="showCampaignDetail(${c.id})">👁 Details</button>
                ${!isClient ? `<button class="btn btn-sm btn-secondary" onclick="CampaignForm.open(campaignState.find(x=>x.id===${c.id}))">✏️ Edit</button>` : ''}
                ${!isClient ? `<button class="btn btn-sm btn-ghost" onclick="deleteCampaign(${c.id})">🗑️</button>` : ''}
            </div>
        </div>`;
    }).join('');
}

function showCampaignDetail(id) {
    const c = campaignState.find(x => x.id === id);
    if (!c) return;
    Modal.setTitle('detailModal', `📢 ${c.name}`);
    document.getElementById('detailModalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div><strong>Client:</strong> ${c.client}</div>
        <div><strong>Manager:</strong> ${c.manager || '—'}</div>
        <div><strong>Status:</strong> ${Table.statusBadge(c.status)}</div>
        <div><strong>Priority:</strong> ${c.priority}</div>
        <div><strong>Budget:</strong> ${FormatUtils.currency(c.budget)}</div>
        <div><strong>Spent:</strong> ${FormatUtils.currency(c.spent)}</div>
        <div><strong>Start:</strong> ${DateUtils.format(c.start)}</div>
        <div><strong>End:</strong> ${DateUtils.format(c.end)}</div>
    </div>
    <p><strong>Channels:</strong> ${c.channels || '—'}</p>
    <p style="margin-top:8px"><strong>Objectives:</strong> ${c.objectives || '—'}</p>
    <p style="margin-top:8px"><strong>Brief:</strong> ${c.brief || '—'}</p>`;
    Modal.open('detailModal');
}

async function deleteCampaign(id) {
    const confirmed = await Confirmation.delete('this campaign');
    if (!confirmed) return;
    const result = await CampaignsApi.delete(id);
    if (result !== null) {
        campaignState = campaignState.filter(c => c.id !== id);
        loadCampaigns();
        Toast.success('Campaign deleted.');
    } else Toast.error('Delete failed. Only draft campaigns can be deleted.');
}
