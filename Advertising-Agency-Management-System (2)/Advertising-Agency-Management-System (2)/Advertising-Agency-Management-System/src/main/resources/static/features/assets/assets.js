/* AdFlow - Assets Controller */
let assetState = [
    { id:1, name:'5G_LotusTower_v1_Render.mp4', type:'VIDEO', category:'3D_RENDER', campaign:'5G Mega Launch 2026', version:1, uploadedBy:'Navodi V.G.C', uploadedAt:'2026-03-02', size:524288000, status:'APPROVED' },
    { id:2, name:'Dialog_Brand_Guidelines_2026.pdf', type:'DOCUMENT', category:'BRAND_ASSET', campaign:'5G Mega Launch 2026', version:3, uploadedBy:'Mendiya J.L.P.S', uploadedAt:'2026-03-01', size:2097152, status:'APPROVED' },
    { id:3, name:'Avurudu_Banners_Draft1.zip', type:'ARCHIVE', category:'PRINT_DESIGN', campaign:'Avurudu Festive Promo', version:1, uploadedBy:'Navodi V.G.C', uploadedAt:'2026-03-04', size:15728640, status:'NEEDS_REVIEW' }
];

document.addEventListener('DOMContentLoaded', async () => {
    if (!PermissionUtils.requireModule('assets')) return;
    Navbar.render(); Navbar.init();
    Sidebar.render('assets');
    Modal.init();
    Upload.setupZone('uploadZone', 'assetFile');

    const live = await AssetsApi.getAll();
    if (Array.isArray(live) && live.length) assetState = live;

    loadAssets();
});

function loadAssets() {
    const search    = document.getElementById('searchInput')?.value?.toLowerCase();
    const filterCat = document.getElementById('filterCategory')?.value;
    const grid      = document.getElementById('assetGrid');
    if (!grid) return;

    let filtered = assetState.filter(a => {
        if (filterCat && filterCat !== 'ALL' && a.category !== filterCat) return false;
        if (search && !`${a.name} ${a.campaign}`.toLowerCase().includes(search)) return false;
        return true;
    });

    if (!filtered.length) {
        grid.innerHTML = `<div class="table-empty" style="grid-column:1/-1">
            <div class="empty-icon">🖼️</div><div class="empty-title">No assets found</div></div>`;
        return;
    }

    const typeIcon = { VIDEO:'🎬', IMAGE:'🖼️', DOCUMENT:'📄', ARCHIVE:'🗜️', AUDIO:'🎵' };

    grid.innerHTML = filtered.map(a => `
    <div class="asset-card" onclick="showAssetDetail(${a.id})">
        <div class="asset-preview">
            <span>${typeIcon[a.type] || '📄'}</span>
            <span class="asset-type-badge">${a.type}</span>
            <span class="asset-version">v${a.version || 1}</span>
        </div>
        <div class="asset-info">
            <div class="asset-name" title="${a.name}">${a.name}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">${a.campaign || '—'}</div>
            <div class="asset-meta">
                <span>${Table.statusBadge(a.status)}</span>
                <span>${FormatUtils.fileSize(a.size)}</span>
            </div>
            <div style="margin-top:8px;display:flex;gap:6px">
                <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();" title="Download">⬇️</button>
                <button class="btn btn-sm btn-danger" onclick="event.stopPropagation();deleteAsset(${a.id})" title="Delete">🗑️</button>
            </div>
        </div>
    </div>`).join('');
}

function showAssetDetail(id) {
    const a = assetState.find(x => x.id === id);
    if (!a) return;
    Modal.setTitle('detailModal', a.name);
    document.getElementById('detailModalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div><strong>Type:</strong> ${a.type}</div>
        <div><strong>Category:</strong> ${FormatUtils.humanize(a.category || '')}</div>
        <div><strong>Campaign:</strong> ${a.campaign || '—'}</div>
        <div><strong>Version:</strong> v${a.version || 1}</div>
        <div><strong>Uploaded by:</strong> ${a.uploadedBy || '—'}</div>
        <div><strong>Date:</strong> ${DateUtils.format(a.uploadedAt)}</div>
        <div><strong>Size:</strong> ${FormatUtils.fileSize(a.size)}</div>
        <div><strong>Status:</strong> ${Table.statusBadge(a.status)}</div>
    </div>`;
    Modal.open('detailModal');
}

async function uploadAsset() {
    const input   = document.getElementById('assetFile');
    const file    = input?.files?.[0];
    const campaign= document.getElementById('assetCampaign')?.value?.trim();
    const category= document.getElementById('assetCategory')?.value;

    if (!file) { Toast.error('Please select a file to upload.'); return; }

    const form = new FormData();
    form.append('file', file);
    form.append('campaign', campaign || '');
    form.append('category', category || 'GENERAL');
    form.append('action', 'UPLOAD');

    const btn = document.getElementById('uploadBtn');
    await Loader.withButton(btn, async () => {
        try {
            await AssetsApi.upload(form);
            Toast.success('Asset uploaded successfully!');
            Modal.close('uploadModal');
            clearUpload();
            const live = await AssetsApi.getAll();
            if (Array.isArray(live) && live.length) { assetState = live; loadAssets(); }
        } catch (err) {
            Toast.error(err.message || 'Upload failed. Please try again.');
        }
    });
}

async function deleteAsset(id) {
    const confirmed = await Confirmation.delete('this asset');
    if (!confirmed) return;
    const result = await AssetsApi.delete(id);
    if (result !== null) {
        assetState = assetState.filter(a => a.id !== id);
        loadAssets();
        Toast.success('Asset deleted.');
    } else Toast.error('Failed to delete asset.');
}
