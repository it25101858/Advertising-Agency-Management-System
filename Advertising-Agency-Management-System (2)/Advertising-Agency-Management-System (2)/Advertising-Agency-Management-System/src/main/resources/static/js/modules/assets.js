/* ============================================================================
   AdFlow - Creative Asset Management Logic (Navodi V.G.C)
   Full-Stack Media Library & Version Auto-Increment Handler
   ============================================================================ */

let assetState = [
    { id: 1, campaignId: 1, campaignTitle: '5G Mega Launch 2026', uploader: 'Navodi V.G.C', name: '5G_LotusTower_Mockup_v1.png', type: 'image/png', sizeKb: 4500, tags: '5G, Billboard, 3D, Mockup', category: 'IMAGE', version: 'v1.0', description: 'Creative deliverable prepared for campaign review.', usageChannel: 'SOCIAL_MEDIA', versionNotes: 'Initial version', status: 'PENDING', createdAt: '2026-03-04 10:20' },
    { id: 2, campaignId: 1, campaignTitle: '5G Mega Launch 2026', uploader: 'Yashika J.', name: 'Radio_Script_5G_v2.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', sizeKb: 320, tags: 'Radio, Jingle, Copy, Sinhala', category: 'COPYWRITING', version: 'v2.0', status: 'APPROVED', createdAt: '2026-03-05 15:40' },
    { id: 3, campaignId: 2, campaignTitle: 'Avurudu Festive Promo', uploader: 'Navodi V.G.C', name: 'Avurudu_Promo_Banner_v1.jpg', type: 'image/jpeg', sizeKb: 2100, tags: 'Festive, Banner, Avurudu', category: 'IMAGE', version: 'v1.0', status: 'NEEDS_REVISION', createdAt: '2026-03-07 11:10' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadAssets();
});

async function loadAssets() {
    const keyword = document.getElementById('searchKeyword').value.toLowerCase();
    const category = document.getElementById('filterCategory').value;
    const status = document.getElementById('filterStatus').value;

    if (window.AdFlowAPI) {
        const dbAssets = await AdFlowAPI.getAssets();
        if (Array.isArray(dbAssets) && dbAssets.length > 0) {
            assetState = dbAssets.map(a => ({
                id: a.id || a.assetId,
                campaignId: a.campaignId || 1,
                campaignTitle: a.campaignTitle || '5G Mega Launch 2026',
                uploader: a.uploader || 'Navodi V.G.C',
                name: a.fileName || a.name,
                type: a.fileType || a.type || 'image/png',
                sizeKb: a.fileSizeKb || a.sizeKb || 1024,
                tags: a.tags || '5G, Deliverable',
                category: a.category || 'IMAGE',
                version: a.version || 'v1.0',
                description: a.description || 'Creative Asset',
                usageChannel: a.usageChannel || 'SOCIAL_MEDIA',
                versionNotes: a.versionNotes || 'Version 1',
                status: a.approvalStatus || a.status || 'PENDING',
                createdAt: a.createdAt || '2026-03-04'
            }));
        }
    }

    const grid = document.getElementById('assetGrid');
    grid.innerHTML = '';

    let filtered = assetState.filter(a => {
        if (category !== 'ALL' && a.category !== category) return false;
        if (status !== 'ALL' && a.status !== status) return false;
        if (keyword && !a.name.toLowerCase().includes(keyword) && !a.tags.toLowerCase().includes(keyword)) return false;
        return true;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center text-secondary py-5">No creative assets match the search criteria.</div>`;
        return;
    }

    filtered.forEach(a => {
        let icon = '🖼️';
        if (a.category === 'VIDEO') icon = '🎬';
        else if (a.category === 'DOCUMENT') icon = '📄';
        else if (a.category === 'COPYWRITING') icon = '✍️';

        grid.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="asset-card">
                    <div class="asset-preview-box">
                        <span>${icon}</span>
                    </div>
                    <div class="p-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="badge badge-scheduled">${a.version}</span>
                            <span class="badge badge-${a.status.toLowerCase()}">${a.status}</span>
                        </div>
                        <h6 class="text-light text-truncate mb-1" title="${a.name}">${a.name}</h6>
                        <small class="text-secondary d-block mb-1">Campaign: <strong>${a.campaignTitle}</strong></small><small class="text-secondary d-block mb-2">${a.description || 'No description'} • ${a.usageChannel || 'N/A'}</small>
                        
                        <div class="small text-muted mb-2">
                            <span>📦 ${Math.round(a.sizeKb / 1024 * 10) / 10} MB</span> • 
                            <span>👤 ${a.uploader}</span>
                        </div>

                        <div class="mb-3">
                            <code class="small text-info">${a.tags}</code>
                        </div>

                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-info flex-grow-1" onclick="openEditModal(${a.id})">Edit Metadata</button><button class="btn btn-sm btn-outline-success" onclick="openApprovalModal(${a.id})">Approval Status</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="archiveAsset(${a.id})">Archive</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function openUploadModal() {
    document.getElementById('modalHeading').innerText = 'Upload Creative Deliverable';
    document.getElementById('formAction').value = 'UPLOAD';
    document.getElementById('assetId').value = '0';
    document.getElementById('uploadForm').reset();
    document.getElementById('statusGroup').style.display = 'none';
    document.getElementById('fileGroup').style.display = 'block';

    document.getElementById('uploadModal').style.display = 'flex';
}

function openEditModal(id) {
    const item = assetState.find(a => a.id === id);
    if (!item) return;

    document.getElementById('modalHeading').innerText = 'Edit Asset Metadata #' + id;
    document.getElementById('formAction').value = 'UPDATE_METADATA';
    document.getElementById('assetId').value = item.id;
    
    document.getElementById('campaignId').value = item.campaignId;
    document.getElementById('category').value = item.category;
    document.getElementById('tags').value = item.tags;
    document.getElementById('assetTitle').value = item.title || item.name;
    document.getElementById('description').value = item.description || 'Creative asset details';
    document.getElementById('usageChannel').value = item.usageChannel || 'SOCIAL_MEDIA';
    document.getElementById('versionNotes').value = item.versionNotes || 'Metadata update';
    
    document.getElementById('fileGroup').style.display = 'none';
    document.getElementById('statusGroup').style.display = 'block';
    document.getElementById('statusSelect').value = item.status;

    document.getElementById('uploadModal').style.display = 'flex';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

function handleFormSubmit(e) {
    e.preventDefault();
    hideAlert();

    const action = document.getElementById('formAction').value;
    const assetId = parseInt(document.getElementById('assetId').value);
    const campaignId = parseInt(document.getElementById('campaignId').value);
    const uploaderId = parseInt(document.getElementById('uploadedById').value);
    const category = document.getElementById('category').value;
    const tags = document.getElementById('tags').value.trim();
    const title = document.getElementById('assetTitle').value.trim();
    const description = document.getElementById('description').value.trim();
    const usageChannel = document.getElementById('usageChannel').value;
    const versionNotes = document.getElementById('versionNotes').value.trim();
    if (title.length < 3 || title.length > 120) { showAlert('Validation Error: Asset title must be 3-120 characters.'); return; }
    if (description.length < 10 || description.length > 500) { showAlert('Validation Error: Description must be 10-500 characters.'); return; }
    if (!usageChannel || versionNotes.length < 3) { showAlert('Validation Error: Usage/channel and version notes are required.'); return; }
    if (tags.length < 2) { showAlert('Validation Error: Add at least one meaningful tag.'); return; }
    const status = action === 'UPDATE_METADATA' ? document.getElementById('statusSelect').value : 'PENDING';

    if (action === 'UPLOAD') {
        const fileInput = document.getElementById('mediaFile');
        if (!fileInput.files || fileInput.files.length === 0) {
            showAlert('Non-Empty File Guard Error: Please select a file to upload.');
            return;
        }

        const file = fileInput.files[0];

        // 1. Non-Empty File Guard (0-byte payload check)
        if (file.size === 0) {
            showAlert('Non-Empty File Guard Error: Submitted file payload is 0-bytes.');
            return;
        }

        // 2. File Size Limit (Max 50 MB = 52,428,800 bytes)
        const maxBytes = 50 * 1024 * 1024;
        if (file.size > maxBytes) {
            showAlert(`File Size Limit Error: File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed limit of 50 MB.`);
            return;
        }

        // 3. MIME Type Checking
        const allowedTypes = [
            'image/jpeg', 'image/png', 'application/pdf', 'video/mp4',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'
        ];
        const ext = file.name.split('.').pop().toLowerCase();
        const allowedExts = ['jpg', 'jpeg', 'png', 'pdf', 'mp4', 'docx'];

        if (!allowedExts.includes(ext)) {
            showAlert(`MIME Type Validation Error: Unsafe or unsupported file format ('.${ext}'). Allowed formats: .jpg, .png, .pdf, .mp4, .docx.`);
            return;
        }

        // 4. Version Auto-Increment Calculation
        const existingVersions = assetState.filter(a => a.campaignId === campaignId && a.name.toLowerCase().startsWith(file.name.split('.')[0].toLowerCase()));
        const nextVersion = `v${existingVersions.length + 1}.0`;

        const campaignTitles = { 1: '5G Mega Launch 2026', 2: 'Avurudu Festive Promo' };
        const uploaders = { 5: 'Navodi V.G.C', 6: 'Yashika J.' };

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().substring(0, 5);

        assetState.unshift({
            id: Date.now(),
            campaignId: campaignId,
            campaignTitle: campaignTitles[campaignId],
            uploader: uploaders[uploaderId] || 'Creative Staff',
            title: title,
            name: `${file.name.split('.')[0]}_${nextVersion}.${ext}`,
            description: description,
            usageChannel: usageChannel,
            versionNotes: versionNotes,
            type: file.type || 'application/octet-stream',
            sizeKb: Math.round(file.size / 1024),
            tags: tags || 'Deliverable',
            category: category,
            version: nextVersion,
            status: 'PENDING',
            createdAt: dateStr
        });

    } else {
        const idx = assetState.findIndex(a => a.id === assetId);
        if (idx !== -1) {
            assetState[idx].title = title;
            assetState[idx].description = description;
            assetState[idx].usageChannel = usageChannel;
            assetState[idx].versionNotes = versionNotes;
            assetState[idx].category = category;
            assetState[idx].tags = tags;
            assetState[idx].status = status;
        }
    }

    closeUploadModal();
    loadAssets();
}

async function archiveAsset(id) {
    if (confirm(`Archive asset #${id}? Status will be updated to ARCHIVED.`)) {
        if (window.AdFlowAPI) {
            await AdFlowAPI.deleteAsset(id);
        }
        const item = assetState.find(a => a.id === id);
        if (item) {
            item.status = 'ARCHIVED';
            await loadAssets();
        }
    }
}

function resetFilters() {
    document.getElementById('searchKeyword').value = '';
    document.getElementById('filterCategory').value = 'ALL';
    document.getElementById('filterStatus').value = 'ALL';
    loadAssets();
}

function showAlert(msg) {
    document.getElementById('alertMessage').innerText = msg;
    document.getElementById('alertBanner').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    document.getElementById('alertBanner').style.display = 'none';
}

function openApprovalModal(id){const item=assetState.find(a=>a.id===id);if(!item)return;const next=prompt(`Current status: ${item.status}\nEnter new status: PENDING, NEEDS_REVISION, APPROVED, REJECTED`,item.status);if(!next)return;const value=next.trim().toUpperCase();if(!['PENDING','NEEDS_REVISION','APPROVED','REJECTED'].includes(value)){showAlert('Validation Error: Invalid approval status.');return;}item.status=value;loadAssets();}
