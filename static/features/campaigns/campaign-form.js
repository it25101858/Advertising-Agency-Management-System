/* AdFlow - Campaign Form Module */
const CampaignForm = {
    _editId: null,

    open(campaign = null) {
        this._editId = campaign?.id || null;
        Modal.setTitle('campaignModal', campaign ? 'Edit Campaign' : 'Create New Campaign');
        const c = campaign || {};

        document.getElementById('campaignModalBody').innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Campaign Name <span class="required">*</span></label>
                <input type="text" id="cName" class="form-control" value="${c.name || c.title || ''}" placeholder="5G Mega Launch 2026" required>
            </div>
            <div class="form-group">
                <label class="form-label">Client <span class="required">*</span></label>
                <input type="text" id="cClient" class="form-control" value="${c.client || ''}" placeholder="Dialog Axiata PLC" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Campaign Type</label>
                <select id="cType" class="form-control">
                    ${['INTEGRATED','DIGITAL','ATL','BTL','3D_OUTDOOR'].map(t => `<option value="${t}" ${c.campaignType===t?'selected':''}>${FormatUtils.humanize(t)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Priority</label>
                <select id="cPriority" class="form-control">
                    ${['HIGH','MEDIUM','LOW'].map(p => `<option value="${p}" ${c.priority===p?'selected':''}>${p}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Start Date <span class="required">*</span></label>
                <input type="date" id="cStart" class="form-control" value="${c.start || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">End Date <span class="required">*</span></label>
                <input type="date" id="cEnd" class="form-control" value="${c.end || ''}" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Budget (LKR) <span class="required">*</span></label>
                <input type="number" id="cBudget" class="form-control" value="${c.budget || ''}" placeholder="2500000" min="100" step="100" required>
            </div>
            <div class="form-group">
                <label class="form-label">Channels</label>
                <input type="text" id="cChannels" class="form-control" value="${c.channels || ''}" placeholder="Facebook, Instagram, TV">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Objectives</label>
            <textarea id="cObjectives" class="form-control" rows="2" placeholder="Drive 5G adoption among youth...">${c.objectives || ''}</textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Brief</label>
            <textarea id="cBrief" class="form-control" rows="3" placeholder="Detailed creative brief...">${c.brief || ''}</textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-ghost" onclick="Modal.close('campaignModal')">Cancel</button>
            <button class="btn btn-primary" onclick="CampaignForm.save()">${campaign ? 'Save Changes' : 'Create Campaign'}</button>
        </div>`;

        Modal.open('campaignModal');
    },

    getData() {
        return {
            id:           this._editId,
            name:         document.getElementById('cName')?.value?.trim(),
            client:       document.getElementById('cClient')?.value?.trim(),
            campaignType: document.getElementById('cType')?.value,
            priority:     document.getElementById('cPriority')?.value,
            start:        document.getElementById('cStart')?.value,
            end:          document.getElementById('cEnd')?.value,
            budget:       Number(document.getElementById('cBudget')?.value),
            channels:     document.getElementById('cChannels')?.value?.trim(),
            objectives:   document.getElementById('cObjectives')?.value?.trim(),
            brief:        document.getElementById('cBrief')?.value?.trim()
        };
    },

    async save() {
        const data = this.getData();
        const errors = CampaignValidation.validate(data);
        if (errors.length) { Toast.error(errors[0]); return; }

        const btn = document.querySelector('#campaignModal .btn-primary');
        await Loader.withButton(btn, async () => {
            try {
                const action = this._editId ? 'update' : 'create';
                await CampaignsApi[action](data);
                Toast.success(this._editId ? 'Campaign updated.' : 'Campaign created!');
                Modal.close('campaignModal');
                if (typeof loadCampaigns === 'function') loadCampaigns();
            } catch (err) {
                Toast.error(err.message || 'Failed to save campaign.');
            }
        });
    }
};
window.CampaignForm = CampaignForm;
