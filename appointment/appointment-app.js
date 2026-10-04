/* ============================================================================
   AdFlow - Appointment Management Logic (Rathnayaka R.M.H.R)
   Full-Stack Validation Engine & AJAX Handler
   ============================================================================ */

// Live Memory Fallback State for Client Evaluation Demos
let appointmentState = [
    { id: 101, client: 'Kasun Perera', staff: 'Rathnayaka R.M.H.R', campaign: '5G Mega Launch 2026', date: '2026-03-10', time: '10:00:00', purpose: '5G Strategy & Briefing Session', type: 'VIRTUAL_CALL', status: 'SCHEDULED', notes: 'Client requested Zoom link beforehand.' },
    { id: 102, client: 'Kasun Perera', staff: 'Rathnayaka R.M.H.R', campaign: 'Avurudu Festive Promo', date: '2026-03-12', time: '14:00:00', purpose: 'Avurudu Creative Review', type: 'IN_PERSON', status: 'SCHEDULED', notes: 'Meeting in HQ Boardroom B.' },
    { id: 103, client: 'Kasun Perera', staff: 'Rathnayaka R.M.H.R', campaign: '5G Mega Launch 2026', date: '2026-03-01', time: '09:30:00', purpose: 'Initial Client Onboarding', type: 'VIRTUAL_CALL', status: 'COMPLETED', notes: 'Onboarded client successfully.' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Set default date input min constraint to today (Future Date Check)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('meetingDate').min = today;
    
    loadAppointments();
});

async function loadAppointments() {
    const filterDate = document.getElementById('filterDate').value;
    const filterStaff = document.getElementById('filterStaff').value;
    const filterStatus = document.getElementById('filterStatus').value;

    if (window.AdFlowAPI) {
        const dbAppts = await AdFlowAPI.getAppointments();
        if (Array.isArray(dbAppts) && dbAppts.length > 0) {
            appointmentState = dbAppts;
        }
    }

    const tbody = document.getElementById('appointmentTableBody');
    tbody.innerHTML = '';

    let filtered = appointmentState.filter(a => {
        if (filterDate && a.date !== filterDate) return false;
        if (filterStaff && a.staffId && a.staffId != filterStaff) return false;
        if (filterStatus && filterStatus !== 'ALL' && a.status !== filterStatus) return false;
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-secondary py-4">No appointments found matching search criteria.</td></tr>`;
        return;
    }

    filtered.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>#${a.id}</td>
                <td><strong>${a.client}</strong></td>
                <td>${a.staff}</td>
                <td><span class="text-secondary">${a.campaign || 'General Consultation'}</span></td>
                <td>${a.date} at <strong>${a.time}</strong></td>
                <td><span class="badge badge-scheduled">${a.type}</span></td>
                <td><span class="badge badge-${a.status ? a.status.toLowerCase() : 'scheduled'}">${a.status}</span></td>
                <td><button class="btn btn-sm btn-outline-info" onclick="openMessageModal(${a.id})">✉ Message Client</button></td>
            </tr>
        `;
    });
}

function openBookModal() {
    document.getElementById('modalHeading').innerText = 'Book New Appointment';
    document.getElementById('formAction').value = 'CREATE';
    document.getElementById('apptId').value = '0';
    document.getElementById('appointmentForm').reset();
    document.getElementById('statusGroup').style.display = 'none';

    // Set default future date & time (10:00 AM tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('meetingDate').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('meetingTime').value = '10:00';

    document.getElementById('bookModal').style.display = 'flex';
}

function openEditModal(id) {
    const item = appointmentState.find(a => a.id === id);
    if (!item) return;

    document.getElementById('modalHeading').innerText = 'Reschedule / Edit Appointment #' + id;
    document.getElementById('formAction').value = 'UPDATE';
    document.getElementById('apptId').value = item.id;
    
    document.getElementById('meetingDate').value = item.date;
    document.getElementById('meetingTime').value = item.time.substring(0, 5);
    document.getElementById('purpose').value = item.purpose;
    document.getElementById('meetingType').value = item.type;
    document.getElementById('notes').value = item.notes || '';
    
    document.getElementById('statusGroup').style.display = 'block';
    document.getElementById('statusSelect').value = item.status;

    document.getElementById('bookModal').style.display = 'flex';
}

function closeBookModal() {
    document.getElementById('bookModal').style.display = 'none';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    hideAlert();

    const action = document.getElementById('formAction').value;
    const apptId = parseInt(document.getElementById('apptId').value);
    const date = document.getElementById('meetingDate').value;
    const time = document.getElementById('meetingTime').value;
    const purpose = document.getElementById('purpose').value.trim();
    const meetingType = document.getElementById('meetingType').value;
    const notes = document.getElementById('notes').value;
    const status = action === 'UPDATE' ? document.getElementById('statusSelect').value : 'SCHEDULED';

    // =========================================================================
    // CLIENT-SIDE VALIDATION CHECKS
    // =========================================================================

    // 1. Required Fields Validation
    if (!date || !time || !purpose || !meetingType) {
        showAlert('Validation Error: Please fill in all required fields (Date, Time, Purpose, Meeting Type).');
        return;
    }

    // 2. Future Date/Time Check
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    if (selectedDateTime < now) {
        showAlert('Validation Error: Appointments cannot be booked for a past date or time.');
        return;
    }

    // 3. Working Hours Guard Check (08:00 - 17:00)
    const hours = parseInt(time.split(':')[0]);
    if (hours < 8 || hours >= 17) {
        showAlert('Validation Error: Appointment time must be within working hours (08:00 AM to 05:00 PM).');
        return;
    }

    // 4. Overlap / Double-Booking Guard Check
    const conflict = appointmentState.find(a => 
        a.id !== apptId && 
        a.date === date && 
        a.time.substring(0, 5) === time && 
        a.status !== 'CANCELLED'
    );
    if (conflict) {
        showAlert(`Double-Booking Conflict Error: Staff member or client already has an active appointment at ${date} ${time}.`);
        return;
    }

    // 5. Status Workflow Check: Completed appointments cannot revert to Scheduled
    if (action === 'UPDATE') {
        const existing = appointmentState.find(a => a.id === apptId);
        if (existing && existing.status === 'COMPLETED' && status !== 'COMPLETED') {
            showAlert('Workflow Restriction Error: A completed appointment cannot be reverted back to ' + status + '.');
            return;
        }
    }

    // Save/Update in DB and Memory State
    if (window.AdFlowAPI) {
        if (action === 'CREATE') {
            await AdFlowAPI.createAppointment({ clientId: 1, staffId: 2, campaignId: 1, meetingDate: date, meetingTime: time, purpose, meetingType, notes });
        } else {
            await AdFlowAPI.updateAppointment({ appointmentId: apptId, clientId: 1, staffId: 2, campaignId: 1, meetingDate: date, meetingTime: time, purpose, meetingType, status, notes });
        }
    }

    if (action === 'CREATE') {
        const newAppt = {
            id: Date.now(),
            client: 'Kasun Perera',
            staff: 'Rathnayaka R.M.H.R',
            campaign: '5G Mega Launch 2026',
            date: date,
            time: time + ':00',
            purpose: purpose,
            type: meetingType,
            status: 'SCHEDULED',
            notes: notes
        };
        appointmentState.push(newAppt);
    } else {
        const idx = appointmentState.findIndex(a => a.id === apptId);
        if (idx !== -1) {
            appointmentState[idx].date = date;
            appointmentState[idx].time = time + ':00';
            appointmentState[idx].purpose = purpose;
            appointmentState[idx].type = meetingType;
            appointmentState[idx].status = status;
            appointmentState[idx].notes = notes;
        }
    }

    closeBookModal();
    await loadAppointments();
}

async function cancelAppointment(id) {
    if (confirm(`Are you sure you want to cancel Appointment #${id}? (It will be marked CANCELLED for history)`)) {
        if (window.AdFlowAPI) {
            await AdFlowAPI.deleteAppointment(id);
        }
        const item = appointmentState.find(a => a.id === id);
        if (item) {
            item.status = 'CANCELLED';
            await loadAppointments();
        }
    }
}

function resetFilters() {
    document.getElementById('filterDate').value = '';
    document.getElementById('filterStaff').value = '';
    document.getElementById('filterStatus').value = 'ALL';
    loadAppointments();
}

function showAlert(msg) {
    document.getElementById('alertMessage').innerText = msg;
    document.getElementById('alertBanner').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    document.getElementById('alertBanner').style.display = 'none';
}


// Manager workflow: client-created appointments are not directly changed here.
let appointmentMessages = [];
function openMessageModal(id) {
    const item = appointmentState.find(a => a.id === id);
    if (!item) return;
    document.getElementById('messageApptId').value = item.id;
    document.getElementById('messageClient').value = item.client;
    document.getElementById('messageAppointment').value = `${item.date} ${item.time.substring(0,5)} - ${item.purpose}`;
    document.getElementById('messageReason').value = '';
    document.getElementById('clientMessage').value = '';
    document.getElementById('messageModal').style.display = 'flex';
}
function closeMessageModal() { document.getElementById('messageModal').style.display = 'none'; }
function sendAppointmentMessage(e) {
    e.preventDefault(); hideAlert();
    const id = parseInt(document.getElementById('messageApptId').value);
    const reason = document.getElementById('messageReason').value;
    const message = document.getElementById('clientMessage').value.trim();
    if (!reason) { showAlert('Validation Error: Please select a reason for contacting the client.'); return; }
    if (message.length < 10 || message.length > 500) { showAlert('Validation Error: Message must be between 10 and 500 characters.'); return; }
    const item = appointmentState.find(a => a.id === id);
    appointmentMessages.unshift({id: Date.now(), appointmentId:id, client:item.client, reason, message, sentAt:new Date().toLocaleString(), status:'SENT'});
    closeMessageModal();
    alert(`Message sent to ${item.client}. The appointment was not changed.`);
}
