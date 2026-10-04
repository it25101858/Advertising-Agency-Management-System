/* AdFlow - Invoice Form Module */
const InvoiceForm = {
    _editId: null,

    open(invoice = null) {
        this._editId = invoice?.id || null;
        Modal.setTitle('invoiceModal', invoice ? 'Edit Invoice' : 'Create New Invoice');
        const inv = invoice || {};
        const items = inv.items || [{ desc: 'Service Fee', qty: 1, price: 0, total: 0 }];

        document.getElementById('invoiceModalBody').innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Invoice Number</label>
                <input type="text" id="invNumber" class="form-control" value="${inv.number || ''}" placeholder="INV-2026-001" readonly style="background:var(--bg-page)">
            </div>
            <div class="form-group">
                <label class="form-label">Campaign</label>
                <input type="text" id="invCampaign" class="form-control" value="${inv.campaignTitle || ''}" placeholder="5G Mega Launch 2026">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Client <span class="required">*</span></label>
                <input type="text" id="invClient" class="form-control" value="${inv.client || ''}" placeholder="Dialog Axiata PLC" required>
            </div>
            <div class="form-group">
                <label class="form-label">Tax Rate (%)</label>
                <input type="number" id="invTax" class="form-control" value="${inv.taxRate || 8}" min="0" max="100">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Issue Date <span class="required">*</span></label>
                <input type="date" id="invIssueDate" class="form-control" value="${inv.issueDate || DateUtils.today()}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Due Date <span class="required">*</span></label>
                <input type="date" id="invDueDate" class="form-control" value="${inv.dueDate || ''}" required>
            </div>
        </div>

        <div style="margin:16px 0">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <strong>Line Items</strong>
                <button class="btn btn-sm btn-secondary" onclick="InvoiceCalculator.addItem()">+ Add Line</button>
            </div>
            <div class="table-wrapper">
            <table style="width:100%;border-collapse:collapse">
                <thead><tr>
                    <th style="padding:8px;background:var(--blue-soft);color:var(--blue-electric);font-size:0.8rem;font-weight:800;border-bottom:2px solid var(--border-blue)">Description</th>
                    <th style="padding:8px;background:var(--blue-soft);color:var(--blue-electric);font-size:0.8rem;font-weight:800;border-bottom:2px solid var(--border-blue)">Qty</th>
                    <th style="padding:8px;background:var(--blue-soft);color:var(--blue-electric);font-size:0.8rem;font-weight:800;border-bottom:2px solid var(--border-blue)">Unit Price</th>
                    <th style="padding:8px;background:var(--blue-soft);color:var(--blue-electric);font-size:0.8rem;font-weight:800;border-bottom:2px solid var(--border-blue)">Total</th>
                    <th style="padding:8px;background:var(--blue-soft);border-bottom:2px solid var(--border-blue)"></th>
                </tr></thead>
                <tbody id="lineItemsBody"></tbody>
            </table>
            </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:4px;width:260px;margin-left:auto;margin-top:12px;padding:12px;background:var(--blue-soft);border-radius:8px;border:1px solid var(--border-blue)">
            <div class="calc-row"><span>Subtotal:</span><span id="calcSubtotal" style="font-weight:700">LKR 0.00</span></div>
            <div class="calc-row"><span>VAT (8%):</span><span id="calcTax" style="font-weight:700">LKR 0.00</span></div>
            <div class="calc-row" style="font-size:1.05rem;font-weight:800;color:var(--blue-electric);border-top:2px solid var(--border-blue);padding-top:8px;margin-top:4px">
                <span>Total:</span><span id="calcTotal">LKR 0.00</span>
            </div>
        </div>

        <div class="form-group" style="margin-top:12px">
            <label class="form-label">Notes</label>
            <textarea id="invNotes" class="form-control" rows="2" placeholder="Payment terms or additional notes...">${inv.notes || ''}</textarea>
        </div>

        <div class="form-actions">
            <button class="btn btn-ghost" onclick="Modal.close('invoiceModal')">Cancel</button>
            <button class="btn btn-primary" onclick="InvoiceForm.save()">${invoice ? 'Save Changes' : 'Create Invoice'}</button>
        </div>`;

        InvoiceCalculator.setItems(items);
        Modal.open('invoiceModal');
    },

    getData() {
        const items  = InvoiceCalculator.getItems();
        const totals = InvoiceCalculator.calculate(items);
        return {
            id:           this._editId,
            campaignTitle:document.getElementById('invCampaign')?.value?.trim(),
            client:       document.getElementById('invClient')?.value?.trim(),
            taxRate:      Number(document.getElementById('invTax')?.value || 8),
            issueDate:    document.getElementById('invIssueDate')?.value,
            dueDate:      document.getElementById('invDueDate')?.value,
            notes:        document.getElementById('invNotes')?.value?.trim(),
            items, ...totals, status: 'DRAFT'
        };
    },

    async save() {
        const data = this.getData();
        if (!data.client)    { Toast.error('Client name is required.');  return; }
        if (!data.issueDate) { Toast.error('Issue date is required.');   return; }
        if (!data.dueDate)   { Toast.error('Due date is required.');     return; }
        if (!data.items.length || data.items.every(i => !i.desc)) {
            Toast.error('Add at least one line item.'); return;
        }

        const btn = document.querySelector('#invoiceModal .btn-primary');
        await Loader.withButton(btn, async () => {
            try {
                const action = this._editId ? 'update' : 'create';
                await InvoicesApi[action](data);
                Toast.success(this._editId ? 'Invoice updated.' : 'Invoice created!');
                Modal.close('invoiceModal');
                if (typeof loadInvoices === 'function') loadInvoices();
            } catch (err) {
                Toast.error(err.message || 'Failed to save invoice.');
            }
        });
    }
};
window.InvoiceForm = InvoiceForm;
