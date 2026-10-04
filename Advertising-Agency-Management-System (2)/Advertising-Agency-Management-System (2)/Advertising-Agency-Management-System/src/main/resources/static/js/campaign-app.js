/* AdFlow - Campaign Management Manager Dashboard */
let campaignState = [
  {id:1,clientId:1,client:'Dialog Axiata PLC',manager:'Mendiya J.L.P.S',name:'5G Mega Launch 2026',campaignType:'INTEGRATED',priority:'HIGH',targetAudience:'Sri Lankan mobile users aged 18-35',channels:'Facebook, Instagram, TV, Outdoor',budget:2500000,spent:1200000,start:'2026-03-01',end:'2026-06-30',objectives:'Drive islandwide 5G adoption among youth and corporate sectors.',brief:'Focus on 3D LED billboard animation on Lotus Tower, TV commercials, and social media push.',deliverables:'3D billboard video, TVC, social media content pack, radio copy',kpis:'Reach 2M users; 50,000 landing-page visits; 8% conversion uplift',status:'ACTIVE',clientAccess:'AVAILABLE'},
  {id:2,clientId:1,client:'Dialog Axiata PLC',manager:'Mendiya J.L.P.S',name:'Avurudu Festive Promo',campaignType:'DIGITAL',priority:'MEDIUM',targetAudience:'Prepaid and postpaid customers islandwide',channels:'Facebook, Instagram, Display, SMS',budget:1500000,spent:300000,start:'2026-03-15',end:'2026-04-20',objectives:'Promote seasonal reload cashbacks and discounted 5G router bundles.',brief:'Traditional Avurudu cultural elements blended with high-tech mobile graphics.',deliverables:'Banner set, short videos, landing-page creative',kpis:'1M reach; 5% CTR; 12,000 offer redemptions',status:'UPCOMING',clientAccess:'NOT_AVAILABLE'}
];
document.addEventListener('DOMContentLoaded', loadCampaigns);

async function loadCampaigns() {
    if (window.AdFlowAPI) {
        const dbCamps = await AdFlowAPI.getCampaigns();
        if (Array.isArray(dbCamps) && dbCamps.length > 0) {
            campaignState = dbCamps.map(c => ({
                id: c.id || c.campaignId,
                clientId: c.clientId || 1,
                client: c.clientName || c.client || 'Dialog Axiata PLC',
                manager: c.managerName || c.manager || 'Mendiya J.L.P.S',
                name: c.name || c.campaignName,
                campaignType: c.campaignType || 'INTEGRATED',
                priority: c.priority || 'HIGH',
                targetAudience: c.targetAudience || 'Sri Lankan mobile users',
                channels: c.channels || 'Digital, Billboards',
                budget: c.budget || 1000000,
                spent: c.spent || 0,
                start: c.startDate || c.start || '2026-03-01',
                end: c.endDate || c.end || '2026-06-30',
                objectives: c.objectives || '',
                brief: c.brief || c.briefText || '',
                deliverables: c.deliverables || 'Banners, Video',
                kpis: c.kpis || 'High Reach',
                status: c.status || 'ACTIVE',
                clientAccess: c.clientAccess || 'AVAILABLE'
            }));
        }
    }

    const keyword = document.getElementById('searchKeyword').value.toLowerCase();
    const status = document.getElementById('filterStatus').value;
    const grid = document.getElementById('campaignGrid');
    grid.innerHTML = '';
    
    const rows = campaignState.filter(c => (status === 'ALL' || c.status === status) && (!keyword || c.name.toLowerCase().includes(keyword) || (c.objectives && c.objectives.toLowerCase().includes(keyword))));
    if (!rows.length) {
        grid.innerHTML = '<div class="col-12 text-center text-secondary py-5">No campaigns match the specified criteria.</div>';
        return;
    }
    
    rows.forEach(c => {
        const pct = Math.min(100, Math.round(c.spent / c.budget * 100));
        grid.innerHTML += `<div class="col-md-6 col-lg-4"><div class="campaign-card"><div class="d-flex justify-content-between"><span class="badge badge-${c.status ? c.status.toLowerCase() : 'upcoming'}">${c.status}</span><span class="badge ${c.clientAccess==='AVAILABLE'?'bg-success':'bg-secondary'}">Client: ${c.clientAccess}</span></div><h4 class="mt-2 mb-1 text-light">${c.name}</h4><p class="text-secondary small">${c.client} • ${c.campaignType} • ${c.priority}</p><div class="small text-secondary mb-2">📅 ${c.start} to ${c.end}</div><div class="small text-secondary mb-3">Budget: LKR ${c.spent.toLocaleString()} / ${c.budget.toLocaleString()} (${pct}%)</div><div class="d-flex gap-2 flex-wrap"><button class="btn btn-sm btn-outline-light" onclick="openDetailModal(${c.id})">View Details</button><button class="btn btn-sm btn-outline-info" onclick="openEditModal(${c.id})">Edit</button><button class="btn btn-sm ${c.clientAccess==='AVAILABLE'?'btn-outline-secondary':'btn-outline-success'}" onclick="toggleClientAccess(${c.id})">${c.clientAccess==='AVAILABLE'?'Make Not Available':'Make Available'}</button><button class="btn btn-sm btn-outline-warning" onclick="archiveCampaign(${c.id})">${c.status==='ARCHIVED'?'Unarchive':'Archive'}</button></div></div></div>`;
    });
}

function openRegisterModal(){document.getElementById('modalHeading').innerText='Register New Campaign';document.getElementById('formAction').value='CREATE';document.getElementById('campId').value='0';document.getElementById('campaignForm').reset();document.getElementById('statusGroup').style.display='none';document.getElementById('clientAccess').value='AVAILABLE';const t=new Date().toISOString().split('T')[0],m=new Date();m.setDate(m.getDate()+30);document.getElementById('startDate').value=t;document.getElementById('endDate').value=m.toISOString().split('T')[0];const modal=document.getElementById('campaignModal');modal.style.display='flex';modal.scrollTop=0;const content=modal.querySelector('.modal-content');if(content)content.scrollTop=0;}
function openEditModal(id){const c=campaignState.find(x=>x.id===id);if(!c)return;document.getElementById('modalHeading').innerText='Edit Campaign #'+id;document.getElementById('formAction').value='UPDATE';document.getElementById('campId').value=c.id;['campaignName','budget','startDate','endDate','objectives','briefText','campaignType','priority','targetAudience','channels','deliverables','kpis','clientAccess'].forEach(k=>{const map={campaignName:'name',startDate:'start',endDate:'end',briefText:'brief'};document.getElementById(k).value=c[map[k]||k]??'';});document.getElementById('statusGroup').style.display='block';document.getElementById('statusSelect').value=c.status;const modal=document.getElementById('campaignModal');modal.style.display='flex';modal.scrollTop=0;const content=modal.querySelector('.modal-content');if(content)content.scrollTop=0;}
function closeCampaignModal(){document.getElementById('campaignModal').style.display='none';}
function openDetailModal(id){const c=campaignState.find(x=>x.id===id);if(!c)return;document.getElementById('detailBody').innerHTML=`<span class="badge badge-${c.status.toLowerCase()}">${c.status}</span> <span class="badge ${c.clientAccess==='AVAILABLE'?'bg-success':'bg-secondary'}">${c.clientAccess}</span><h4 class="mt-2 text-light">${c.name}</h4><p class="text-secondary">Client: <b>${c.client}</b> • Manager: <b>${c.manager}</b></p><div class="row small"><div class="col-6 mb-3"><b>Type</b><br>${c.campaignType}</div><div class="col-6 mb-3"><b>Priority</b><br>${c.priority}</div><div class="col-6 mb-3"><b>Budget</b><br>LKR ${c.budget.toLocaleString()}</div><div class="col-6 mb-3"><b>Timeline</b><br>${c.start} to ${c.end}</div></div><p><b>Target Audience</b><br>${c.targetAudience}</p><p><b>Channels</b><br>${c.channels}</p><p><b>Objectives</b><br>${c.objectives}</p><p><b>Creative Brief</b><br>${c.brief}</p><p><b>Deliverables</b><br>${c.deliverables}</p><p><b>Success KPIs</b><br>${c.kpis}</p>`;const modal=document.getElementById('detailModal');modal.style.display='flex';modal.scrollTop=0;const content=modal.querySelector('.modal-content');if(content)content.scrollTop=0;}
function closeDetailModal(){document.getElementById('detailModal').style.display='none';}

async function handleFormSubmit(e){
    e.preventDefault();hideAlert();
    const action=document.getElementById('formAction').value,id=parseInt(document.getElementById('campId').value),name=document.getElementById('campaignName').value.trim(),budget=parseFloat(document.getElementById('budget').value),start=document.getElementById('startDate').value,end=document.getElementById('endDate').value,objectives=document.getElementById('objectives').value.trim(),brief=document.getElementById('briefText').value.trim(),campaignType=document.getElementById('campaignType').value,priority=document.getElementById('priority').value,targetAudience=document.getElementById('targetAudience').value.trim(),channels=document.getElementById('channels').value.trim(),deliverables=document.getElementById('deliverables').value.trim(),kpis=document.getElementById('kpis').value.trim(),clientAccess=document.getElementById('clientAccess').value,status=action==='UPDATE'?document.getElementById('statusSelect').value:'UPCOMING';
    if(name.length<3||name.length>100)return showAlert('Validation Error: Campaign title must be 3-100 characters.');
    if(!campaignType||!priority)return showAlert('Validation Error: Campaign type and priority are required.');
    if(targetAudience.length<3||channels.length<3)return showAlert('Validation Error: Target audience and channels are required.');
    if(!Number.isFinite(budget)||budget<=0)return showAlert('Validation Error: Budget must be greater than LKR 0.');
    if(!start||!end||new Date(end)<=new Date(start))return showAlert('Validation Error: End date must be after start date.');
    if(objectives.length<10||brief.length<10||deliverables.length<5||kpis.length<5)return showAlert('Validation Error: Objectives, brief, deliverables and KPIs require meaningful details.');

    if (window.AdFlowAPI) {
        if (action === 'CREATE') {
            await AdFlowAPI.createCampaign({ clientId: 1, managerId: 3, campaignName: name, budget, startDate: start, endDate: end, objectives, briefText: brief, status });
        } else {
            await AdFlowAPI.updateCampaign({ campaignId: id, clientId: 1, managerId: 3, campaignName: name, budget, startDate: start, endDate: end, objectives, briefText: brief, status });
        }
    }

    const data={clientId:1,client:'Dialog Axiata PLC',manager:'Mendiya J.L.P.S',name,campaignType,priority,targetAudience,channels,budget,spent:action==='UPDATE'?(campaignState.find(c=>c.id===id)?.spent||0):0,start,end,objectives,brief,deliverables,kpis,status,clientAccess};
    if(action==='CREATE')campaignState.unshift({id:Date.now(),...data});
    else{const i=campaignState.findIndex(c=>c.id===id);if(i>=0)campaignState[i]={...campaignState[i],...data};}
    closeCampaignModal();
    await loadCampaigns();
}

function toggleClientAccess(id){const c=campaignState.find(x=>x.id===id);if(!c)return;c.clientAccess=c.clientAccess==='AVAILABLE'?'NOT_AVAILABLE':'AVAILABLE';loadCampaigns();}

async function archiveCampaign(id){
    const c=campaignState.find(x=>x.id===id);
    if(c){
        const isArchived = c.status === 'ARCHIVED';
        if(confirm(isArchived ? 'Unarchive this campaign?' : 'Archive this campaign?')){
            if (isArchived) {
                c.status = c.previousStatus || 'ACTIVE';
                c.clientAccess = 'AVAILABLE';
            } else {
                c.previousStatus = c.status || 'ACTIVE';
                c.status = 'ARCHIVED';
                c.clientAccess = 'NOT_AVAILABLE';
            }
            await loadCampaigns();
        }
    }
}

function resetFilters(){document.getElementById('searchKeyword').value='';document.getElementById('filterStatus').value='ALL';loadCampaigns();}
function showAlert(m){document.getElementById('alertMessage').innerText=m;document.getElementById('alertBanner').style.display='block';window.scrollTo({top:0,behavior:'smooth'});}
function hideAlert(){document.getElementById('alertBanner').style.display='none';}
