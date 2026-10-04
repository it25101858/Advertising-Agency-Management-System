/* AdFlow - Appointment Form Module */
const AppointmentForm = {
    _editId: null,

    open(appointment = null) {
        this._editId = appointment?.id || null;
        const title = appointment ? 'Edit Appointment' : 'Book New Appointment';
        Modal.setTitle('apptModal', title);

        const tomorrow = DateUtils.tomorrow();
        const a = appointment || {};

        document.getElementById('apptModalBody').innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Client Name <span class="required">*</span></label>
                <input type="text" id="apptClient" class="form-control" value="${a.client || ''}" placeholder="Kasun Perera" required>
            </div>
            <div class="form-group">
                <label class="form-label">Campaign</label>
                <input type="text" id="apptCampaign" class="form-control" value="${a.campaign || ''}" placeholder="5G Mega Launch 2026">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Meeting Date <span class="required">*</span></label>
                <input type="date" id="apptDate" class="form-control" value="${a.date || tomorrow}" min="${DateUtils.today()}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Time (08:00–17:00) <span class="required">*</span></label>
                <input type="time" id="apptTime" class="form-control" value="${a.time || '10:00'}" min="08:00" max="17:00" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Meeting Type <span class="required">*</span></label>
                <select id="apptType" class="form-control" required>
                    <option value="">Select type...</option>
                    <option value="VIRTUAL_CALL" ${a.type === 'VIRTUAL_CALL' ? 'selected' : ''}>🖥️ Virtual Call</option>
                    <option value="IN_PERSON"    ${a.type === 'IN_PERSON'    ? 'selected' : ''}>🤝 In Person</option>
                    <option value="PHONE_CALL"   ${a.type === 'PHONE_CALL'   ? 'selected' : ''}>📞 Phone Call</option>
                </select>
            </div>
            <div class="form-group" id="statusGroup" ${!appointment ? 'style="display:none"' : ''}>
                <label class="form-label">Status</label>
                <select id="apptStatus" class="form-control">
                    <option value="SCHEDULED"    ${a.status === 'SCHEDULED'    ? 'selected' : ''}>Scheduled</option>
                    <option value="RESCHEDULED"  ${a.status === 'RESCHEDULED'  ? 'selected' : ''}>Rescheduled</option>
                    <option value="COMPLETED"    ${a.status === 'COMPLETED'    ? 'selected' : ''}>Completed</option>
                    <option value="CANCELLED"    ${a.status === 'CANCELLED'    ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Purpose / Agenda <span class="required">*</span></label>
            <input type="text" id="apptPurpose" class="form-control" value="${a.purpose || ''}" placeholder="Initial 5G Campaign Briefing" required>
        </div>
        <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea id="apptNotes" class="form-control" rows="3" placeholder="Additional notes...">${a.notes || ''}</textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" type="button" onclick="Modal.close('apptModal')">Cancel</button>
            <button class="btn btn-primary" type="button" onclick="AppointmentForm.save()">
                ${appointment ? 'Save Changes' : 'Book Appointment'}
            </button>
        </div>`;

        Modal.open('apptModal');
    },

    getData() {
        return {
            id:       this._editId,
            client:   document.getElementById('apptClient')?.value?.trim(),
            campaign: document.getElementById('apptCampaign')?.value?.trim(),
            date:     document.getElementById('apptDate')?.value,
            time:     document.getElementById('apptTime')?.value,
            type:     document.getElementById('apptType')?.value,
            status:   document.getElementById('apptStatus')?.value || 'SCHEDULED',
            purpose:  document.getElementById('apptPurpose')?.value?.trim(),
            notes:    document.getElementById('apptNotes')?.value?.trim()
        };
    },

    async save() {
        const data = this.getData();
        const errors = AppointmentValidation.validate(data);
        if (errors.length) { Toast.error(errors[0]); return; }

        const btn = document.querySelector('#apptModal .btn-primary');
        await Loader.withButton(btn, async () => {
            try {
                const action = this._editId ? 'update' : 'create';
                const result = await AppointmentsApi[action](data);
                if (result !== null) {
                    Toast.success(this._editId ? 'Appointment updated.' : 'Appointment booked successfully!');
                    Modal.close('apptModal');
                    if (typeof loadAppointments === 'function') loadAppointments();
                } else {
                    Toast.error('Operation failed. Please try again.');
                }
            } catch (err) {
                Toast.error(err.message || 'Failed to save appointment.');
            }
        });
    }
};
window.AppointmentForm = AppointmentForm;
