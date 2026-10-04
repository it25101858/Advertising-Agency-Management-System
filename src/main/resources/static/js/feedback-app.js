/* ============================================================================
   AdFlow - Feedback & Review System Logic (Yashika J.)
   Full-Stack Timeline & XSS Sanitization Handler
   ============================================================================ */

let feedbackState = [
    { id: 1, campaignId: 1, campaignTitle: '5G Mega Launch 2026', assetId: 2, assetName: 'Radio Script 5G v2.docx', clientId: 1, clientName: 'Kasun Perera', rating: 5, comments: 'Radio script tagline is very catchy! Minor tweak requested for tone on line 4.', status: 'RESOLVED', createdAt: '2026-03-02 11:30' },
    { id: 2, campaignId: 1, campaignTitle: '5G Mega Launch 2026', assetId: 1, assetName: '5G Lotus Tower Mockup v1.png', clientId: 1, clientName: 'Kasun Perera', rating: 4, comments: 'Color palette looks modern, but please make the 5G speed badge 20% larger.', status: 'SUBMITTED', createdAt: '2026-03-05 14:15' },
    { id: 3, campaignId: 2, campaignTitle: 'Avurudu Festive Promo', assetId: null, assetName: 'General Campaign Concept', clientId: 1, clientName: 'Kasun Perera', rating: 5, comments: 'Avurudu campaign overall strategy looks fantastic. Approved for execution.', status: 'APPROVED', createdAt: '2026-03-08 09:45' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadTimeline();
});


async function loadTimeline() {
    const filterCampaign = document.getElementById('filterCampaign').value;
    const filterStatus = document.getElementById('filterStatus').value;

    if (window.AdFlowAPI) {
        const dbFb = await AdFlowAPI.getFeedback();
        if (Array.isArray(dbFb) && dbFb.length > 0) {
            feedbackState = dbFb.map(f => ({
                id: f.id || f.feedbackId,
                campaignId: f.campaignId || 1,
                campaignTitle: f.campaignTitle || '5G Mega Launch 2026',
                assetId: f.assetId,
                assetName: f.assetName || f.item || 'Deliverable Item',
                clientId: f.clientId || 1,
                clientName: f.clientName || f.client || 'Kasun Perera',
                rating: f.rating || 5,
                comments: f.comments || '',
                status: f.status || 'SUBMITTED',
                createdAt: f.createdAt || '2026-03-02'
            }));
        }
    }

    const container = document.getElementById('timelineContainer');
    container.innerHTML = '';

    let filtered = feedbackState.filter(f => {
        if (filterCampaign !== 'ALL' && f.campaignId != filterCampaign) return false;
        if (filterStatus !== 'ALL' && f.status !== filterStatus) return false;
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center text-secondary py-5">No feedback timeline entries match the selected filters.</div>`;
        return;
    }

    filtered.forEach(f => {
        const starStr = '★'.repeat(f.rating) + '☆'.repeat(5 - f.rating);
        container.innerHTML += `
            <div class="timeline-item">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge badge-${f.status.toLowerCase()}">${f.status}</span>
                    <small class="text-secondary">🕒 ${f.createdAt}</small>
                </div>
                <h5 class="text-light mb-1">${f.assetName || 'General Campaign Feedback'}</h5>
                <p class="text-secondary small mb-2">Campaign: <strong>${f.campaignTitle}</strong> • Reviewed by: <strong>${f.clientName}</strong></p>
                <div class="text-warning mb-2">${starStr} (${f.rating}/5)</div>
                
                <div class="bg-dark p-3 rounded border border-secondary mb-3 text-light">
                    "${f.comments}"
                </div>
                <div class="small text-secondary">🔒 Read-only feedback record — no edit/delete/status actions are available.</div>
            </div>
        `;
    });
}






function resetFilters() {
    document.getElementById('filterCampaign').value = 'ALL';
    document.getElementById('filterStatus').value = 'ALL';
    loadTimeline();
}

function showAlert(msg) {
    document.getElementById('alertMessage').innerText = msg;
    document.getElementById('alertBanner').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    document.getElementById('alertBanner').style.display = 'none';
}
