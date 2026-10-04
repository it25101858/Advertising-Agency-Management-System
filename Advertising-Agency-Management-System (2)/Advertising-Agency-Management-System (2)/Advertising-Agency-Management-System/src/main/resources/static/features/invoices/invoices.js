/* AdFlow - Invoices Controller */
let invoiceState = [
    { id:1, number:'INV-2026-001', client:'Dialog Axiata PLC', campaignTitle:'5G Mega Launch 2026', total:540000, issueDate:'2026-03-01', dueDate:'2026-03-31', status:'SENT', taxRate:8 },
    { id:2, number:'INV-2026-002', client:'Dialog Axiata PLC', campaignTitle:'Avurudu Festive Promo', total:325000, issueDate:'2026-03-08', dueDate:'2026-04-08', status:'DRAFT', taxRate:8 }
];

document.addEventListener('DOMContentLoaded', async () => {
    if (!PermissionUtils.requireModule('invoices')) return;
    Navbar.render(); Navbar.init();
    Sidebar.render('invoices');
    Modal.init();

    const live = await InvoicesApi.getAll();
    if (Array.isArray(live) && live.length) invoiceState = live;

    loadInvoices();
});

function loadInvoices() {
    const filterStatus = document.getElementById('filterStatus')?.value;
    const search       = document.getElementById('searchInput')?.value?.toLowerCase();
    const tbody        = document.getElementById('invoiceTableBody');
    if (!tbody) return;

    const isClient = PermissionUtils.isClient();

    let filtered = invoiceState.filter(inv => {
        if (filterStatus && filterStatus !== 'ALL' && inv.status !== filterStatus) return false;
        if (search && !`${inv.client} ${inv.number} ${inv.campaignTitle}`.toLowerCase().includes(search)) return false;
        return true;
    });

    // Summary stats
    const totalRevenue = filtered.reduce((s, i) => s + (i.status === 'PAID' ? (i.total || 0) : 0), 0);
    const outstanding  = filtered.reduce((s, i) => s + (['SENT','OVERDUE'].includes(i.status) ? (i.total || 0) : 0), 0);
    const el = id => document.getElementById(id);
    if (el('statRevenue'))     el('statRevenue').textContent     = FormatUtils.currencyCompact(totalRevenue);
    if (el('statOutstanding')) el('statOutstanding').textContent = FormatUtils.currencyCompact(outstanding);
    if (el('statCount'))       el('statCount').textContent       = filtered.length;

    if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="8"><div class="table-empty">
            <div class="empty-icon">💳</div><div class="empty-title">No invoices found</div></div></td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(inv => {
        const days = DateUtils.daysUntil(inv.dueDate);
        const overdue = inv.status !== 'PAID' && days !== null && days < 0;
        return `<tr>
            <td><a href="#" style="font-weight:800;color:var(--blue-electric);font-family:var(--font-mono)" onclick="showInvoiceDetail(${inv.id});return false">${inv.number || `INV-2026-00${inv.id}`}</a></td>
            <td><strong>${inv.client}</strong></td>
            <td>${inv.campaignTitle || '—'}</td>
            <td><strong>${FormatUtils.currency(inv.total)}</strong></td>
            <td>${DateUtils.format(inv.issueDate)}</td>
            <td style="${overdue ? 'color:var(--accent-red);font-weight:700' : ''}">${DateUtils.format(inv.dueDate)}${overdue ? ' ⚠' : ''}</td>
            <td>${Table.statusBadge(inv.status)}</td>
            <td><div class="table-actions">
                ${!isClient ? `<button class="btn-icon" onclick="InvoiceForm.open(invoiceState.find(x=>x.id===${inv.id}))" title="Edit">✏️</button>` : ''}
                ${!isClient && inv.status !== 'PAID' ? `<button class="btn btn-sm btn-success" onclick="markPaid(${inv.id})">✓ Paid</button>` : ''}
                ${!isClient ? `<button class="btn-icon" style="color:var(--accent-red)" onclick="deleteInvoice(${inv.id})" title="Delete">🗑️</button>` : ''}
                <button class="btn btn-sm btn-ghost" onclick="showInvoiceDetail(${inv.id})" title="Preview">👁️</button>
            </div></td>
        </tr>`;
    }).join('');
}

function showInvoiceDetail(id) {
    const inv = invoiceState.find(x => x.id === id);
    if (!inv) return;
    Modal.setTitle('detailModal', inv.number || `INV-2026-00${inv.id}`);
    document.getElementById('detailModalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div><strong>Client:</strong> ${inv.client}</div>
        <div><strong>Campaign:</strong> ${inv.campaignTitle || '—'}</div>
        <div><strong>Status:</strong> ${Table.statusBadge(inv.status)}</div>
        <div><strong>Tax Rate:</strong> ${inv.taxRate || 8}%</div>
        <div><strong>Issue Date:</strong> ${DateUtils.format(inv.issueDate)}</div>
        <div><strong>Due Date:</strong> ${DateUtils.format(inv.dueDate)}</div>
        <div><strong>Total:</strong> <span style="font-size:1.3rem;font-weight:800;color:var(--blue-electric)">${FormatUtils.currency(inv.total)}</span></div>
    </div>
    ${inv.notes ? `<p style="margin-top:12px"><strong>Notes:</strong> ${inv.notes}</p>` : ''}
    <div style="margin-top:16px;display:flex;gap:8px">
        <button class="btn btn-sm btn-secondary" onclick="window.print()">🖨️ Print</button>
        ${inv.status !== 'PAID' ? `<button class="btn btn-sm btn-success" onclick="Modal.close('detailModal');markPaid(${inv.id})">✓ Mark as Paid</button>` : ''}
    </div>`;
    Modal.open('detailModal');
}

async function markPaid(id) {
    const result = await InvoicesApi.markPaid(id);
    if (result !== null) {
        const inv = invoiceState.find(x => x.id === id);
        if (inv) inv.status = 'PAID';
        loadInvoices();
        Toast.success('Invoice marked as paid!');
    } else Toast.error('Failed to update status.');
}

async function deleteInvoice(id) {
    const confirmed = await Confirmation.delete('this invoice');
    if (!confirmed) return;
    const result = await InvoicesApi.delete(id);
    if (result !== null) {
        invoiceState = invoiceState.filter(i => i.id !== id);
        loadInvoices();
        Toast.success('Invoice deleted.');
    } else Toast.error('Failed to delete invoice.');
}
