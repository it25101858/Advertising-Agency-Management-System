/* ============================================================================
   AdFlow - Appointments Controller
   ============================================================================ */

let apptState = [
    { id: 101, client: 'Kasun Perera', staff: 'Rathnayaka R.M.H.R', campaign: '5G Mega Launch 2026', date: '2026-03-10', time: '10:00', purpose: '5G Strategy & Briefing Session', type: 'VIRTUAL_CALL', status: 'SCHEDULED', notes: 'Client requested Zoom link beforehand.' },
    { id: 102, client: 'Kasun Perera', staff: 'Rathnayaka R.M.H.R', campaign: 'Avurudu Festive Promo', date: '2026-03-12', time: '14:00', purpose: 'Avurudu Creative Review', type: 'IN_PERSON', status: 'SCHEDULED', notes: 'Meeting in HQ Boardroom B.' },
    { id: 103, client: 'Kasun Perera', staff: 'Rathnayaka R.M.H.R', campaign: '5G Mega Launch 2026', date: '2026-03-01', time: '09:30', purpose: 'Initial Client Onboarding', type: 'VIRTUAL_CALL', status: 'COMPLETED', notes: 'Onboarded client successfully.' }
];

document.addEventListener('DOMContentLoaded', async () => {
    if (!PermissionUtils.requireModule('appointments')) return;
    Navbar.render(); Navbar.init();
    Sidebar.render('appointments');
    Modal.init();

    // Try to load from API
    const live = await AppointmentsApi.getAll();
    if (Array.isArray(live) && live.length) apptState = live;

    loadAppointments();
});

function loadAppointments() {
    const filterDate   = document.getElementById('filterDate')?.value;
    const filterStatus = document.getElementById('filterStatus')?.value;
    const search       = document.getElementById('searchInput')?.value?.toLowerCase();
    const tbody        = document.getElementById('apptTableBody');
    if (!tbody) return;

    const isClient = PermissionUtils.isClient();
    const user     = StorageUtils.getUser();

    let filtered = apptState.filter(a => {
        if (isClient && a.createdByEmail && a.createdByEmail !== user?.email) return false;
        if (filterDate && a.date !== filterDate) return false;
        if (filterStatus && filterStatus !== 'ALL' && a.status !== filterStatus) return false;
        if (search && !`${a.client} ${a.campaign} ${a.purpose}`.toLowerCase().includes(search)) return false;
        return true;
    });

    if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="8">
            <div class="table-empty"><div class="empty-icon">📅</div>
            <div class="empty-title">No appointments found</div></div></td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(a => {
        const typeIcon = { VIRTUAL_CALL: '🖥️', IN_PERSON: '🤝', PHONE_CALL: '📞' }[a.type] || '📋';
        return `<tr>
            <td><strong>#${a.id}</strong></td>
            <td><strong>${a.client}</strong></td>
            <td>${a.staff || '—'}</td>
            <td><span style="color:var(--text-secondary)">${a.campaign || 'General Consultation'}</span></td>
            <td>${DateUtils.format(a.date)} at <strong>${DateUtils.formatTime(a.time + ':00')}</strong></td>
            <td>${typeIcon} ${FormatUtils.humanize(a.type)}</td>
            <td>${Table.statusBadge(a.status)}</td>
            <td>
                <div class="table-actions">
                    ${!isClient ? `<button class="btn-icon" onclick="AppointmentForm.open(apptState.find(x=>x.id===${a.id}))" title="Edit">✏️</button>` : ''}
                    ${!isClient ? `<button class="btn-icon" style="color:var(--accent-red)" onclick="deleteAppointment(${a.id})" title="Delete">🗑️</button>` : ''}
                    <button class="btn btn-sm btn-secondary" onclick="openMessageModal(${a.id})">✉ Message</button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

async function deleteAppointment(id) {
    const confirmed = await Confirmation.delete(`Appointment #${id}`);
    if (!confirmed) return;
    const result = await AppointmentsApi.delete(id);
    if (result !== null) {
        apptState = apptState.filter(a => a.id !== id);
        loadAppointments();
        Toast.success('Appointment deleted.');
    } else {
        Toast.error('Failed to delete. Please try again.');
    }
}

function openMessageModal(id) {
    const a = apptState.find(x => x.id === id);
    if (!a) return;
    document.getElementById('msgClient')?.setAttribute('value', a.client);
    document.getElementById('msgAppt')?.setAttribute('value', `#${a.id} – ${a.purpose}`);
    document.getElementById('msgApptId').value = id;
    Modal.open('messageModal');
}

async function sendMessage(event) {
    event.preventDefault();
    const id      = document.getElementById('msgApptId')?.value;
    const reason  = document.getElementById('msgReason')?.value;
    const message = document.getElementById('msgText')?.value?.trim();
    if (!reason || !message || message.length < 10) { Toast.error('Please select a reason and write a message (min. 10 characters).'); return; }

    const result = await AppointmentsApi.message({ appointmentId: id, reason, message });
    Toast.success('Message sent to client successfully!');
    Modal.close('messageModal');
}

function resetFilters() {
    ['filterDate','filterStatus','searchInput'].forEach(id => { const el = document.getElementById(id); if (el) el.value = id === 'filterStatus' ? 'ALL' : ''; });
    loadAppointments();
}
