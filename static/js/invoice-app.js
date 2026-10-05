/* ============================================================================
   AdFlow - Financial Management Logic (Gamage M.I.I.K)
   Full-Stack Math Validation & Ledger Audit Handler
   ============================================================================ */

let invoiceState = [
    { id: 1, number: 'INV-2026-001', campaignId: 1, campaignTitle: '5G Mega Launch 2026', client: 'Dialog Axiata PLC', issueDate: '2026-03-01', dueDate: '2026-03-31', taxRate: 8, subtotal: 1000000, taxAmount: 80000, total: 1080000, paid: 1080000, paymentStatus: 'VERIFIED', receipt: {file:'receipt_INV-2026-001.pdf', uploadedAt:'2026-03-05 10:15', reference:'TXN-889201'}, billingContact:'Kasun Perera', billingEmail:'accounts@dialog.lk', billingAddress:'Dialog Axiata PLC, Colombo 02', currency:'LKR', poReference:'PO-5G-001', paymentTerms:30, notes:'First production milestone', status: 'PAID', items: [{ desc: '3D Concept Design & Storyboarding', qty: 1, price: 400000, total: 400000 }, { desc: 'TV & Digital Media Production', qty: 1, price: 600000, total: 600000 }] },
    { id: 2, number: 'INV-2026-002', campaignId: 1, campaignTitle: '5G Mega Launch 2026', client: 'Dialog Axiata PLC', issueDate: '2026-03-10', dueDate: '2026-04-10', taxRate: 8, subtotal: 500000, taxAmount: 40000, total: 540000, paid: 0, paymentStatus: 'PENDING_REVIEW', receipt: {file:'bank_slip_INV-2026-002.jpg', uploadedAt:'2026-03-29 16:42', reference:'CEFT-450992'}, billingContact:'Kasun Perera', billingEmail:'accounts@dialog.lk', billingAddress:'Dialog Axiata PLC, Colombo 02', currency:'LKR', poReference:'PO-5G-002', paymentTerms:30, notes:'Billboard production milestone', status: 'SENT', items: [{ desc: 'Lotus Tower Billboard Slot & Printing', qty: 2, price: 250000, total: 500000 }] },
    { id: 3, number: 'INV-2026-003', campaignId: 2, campaignTitle: 'Avurudu Festive Promo', client: 'Dialog Axiata PLC', issueDate: '2026-03-15', dueDate: '2026-04-15', taxRate: 8, subtotal: 750000, taxAmount: 60000, total: 810000, paid: 0, paymentStatus: 'NO_RECEIPT', receipt:null, billingContact:'Kasun Perera', billingEmail:'accounts@dialog.lk', billingAddress:'Dialog Axiata PLC, Colombo 02', currency:'LKR', poReference:'', paymentTerms:30, notes:'Seasonal campaign draft',
        status: 'DRAFT', items: [{ desc: 'Avurudu Seasonal Promo Graphics & Media Kit', qty: 1, price: 750000, total: 750000 }] }
];

document.addEventListener('DOMContentLoaded', () => {
    loadInvoices();
});

async function loadInvoices() {
    const keyword = document.getElementById('searchKeyword').value.toLowerCase();
    const status = document.getElementById('filterStatus').value;

    if (window.AdFlowAPI) {
        const dbInvoices = await AdFlowAPI.getInvoices();
        if (Array.isArray(dbInvoices) && dbInvoices.length > 0) {
            invoiceState = dbInvoices.map(inv => ({
                id: inv.id || inv.invoiceId,
                number: inv.number || inv.invoiceNumber || 'INV-2026-001',
                campaignId: inv.campaignId || 1,
                campaignTitle: inv.campaignTitle || '5G Mega Launch 2026',
                client: inv.clientName || inv.client || 'Dialog Axiata PLC',
                issueDate: inv.issueDate || '2026-03-01',
                dueDate: inv.dueDate || '2026-03-31',
                taxRate: inv.taxRate || 8,
                subtotal: inv.subtotal || 1000000,
                taxAmount: inv.taxAmount || 80000,
                total: inv.totalAmount || inv.total || 1080000,
                paid: inv.paidAmount || inv.paid || 0,
                paymentStatus: 'VERIFIED',
                receipt: null,
                billingContact: 'Kasun Perera',
                billingEmail: 'accounts@dialog.lk',
                billingAddress: 'Colombo 02',
                currency: 'LKR',
                poReference: 'PO-5G-001',
                paymentTerms: 30,
                notes: 'Invoice Details',
                status: inv.status || 'DRAFT',
                items: inv.items || [{ desc: 'Service Fee', qty: 1, price: inv.subtotal || 1000000, total: inv.subtotal || 1000000 }]
            }));
        }
    }

    const tbody = document.getElementById('invoiceTableBody');
    tbody.innerHTML = '';

    let totalRev = 0, outstanding = 0, totalPaid = 0;

    let filtered = invoiceState.filter(i => {
        totalRev += i.total;
        totalPaid += i.paid;
        if (i.status === 'SENT' || i.status === 'OVERDUE') outstanding += (i.total - i.paid);

        if (status !== 'ALL' && i.status !== status) return false;
        if (keyword && !i.number.toLowerCase().includes(keyword) && !i.campaignTitle.toLowerCase().includes(keyword)) return false;
        return true;
    });

    document.getElementById('kpiTotalRev').innerText = `LKR ${totalRev.toLocaleString()}`;
    document.getElementById('kpiOutstanding').innerText = `LKR ${outstanding.toLocaleString()}`;
    document.getElementById('kpiPaid').innerText = `LKR ${totalPaid.toLocaleString()}`;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-secondary py-4">No invoice records found matching criteria.</td></tr>`;
        return;
    }

    filtered.forEach(i => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${i.number}</strong></td>
                <td>${i.client}</td>
                <td>${i.campaignTitle}</td>
                <td>${i.dueDate}</td>
                <td>LKR ${i.total.toLocaleString()}</td>
                <td>LKR ${i.paid.toLocaleString()}</td>
                <td><span class="badge badge-${i.status.toLowerCase()}">${i.status}</span></td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-breakdown-quick" onclick="openPdfModal(${i.id})">
                            📄 PDF Preview
                        </button>
                        <div class="action-dropdown-container">
                            <button class="btn-action-trigger" onclick="toggleInvoiceActionMenu(${i.id}, event)">
                                ⚙️ Actions ▾
                            </button>
                            <div class="action-dropdown-menu" id="invoiceActionMenu-${i.id}">
                                <button class="dropdown-item" onclick="openPdfModal(${i.id})">
                                    <span class="item-icon">📄</span> View PDF Preview
                                </button>
                                ${i.status !== 'VOID' ? `
                                    <button class="dropdown-item highlight-item" onclick="openPaymentModal(${i.id})">
                                        <span class="item-icon">🧾</span> Review Payment Receipt
                                    </button>
                                    <button class="dropdown-item" onclick="editPaymentStatus(${i.id})">
                                        <span class="item-icon">✏️</span> Edit Payment Status
                                    </button>
                                ` : ''}
                                ${i.status === 'DRAFT' ? `
                                    <div class="dropdown-divider"></div>
                                    <button class="dropdown-item item-danger" onclick="handleInvoiceDelete(${i.id}, true)">
                                        <span class="item-icon">🗑️</span> Delete Draft
                                    </button>
                                ` : ''}
                                ${i.status !== 'DRAFT' && i.status !== 'VOID' ? `
                                    <div class="dropdown-divider"></div>
                                    <button class="dropdown-item item-danger" onclick="handleInvoiceDelete(${i.id}, false)">
                                        <span class="item-icon">⛔</span> Void Invoice
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });
}

function addLineItemRow() {
    const container = document.getElementById('lineItemsContainer');
    const newRow = document.createElement('div');
    newRow.className = 'row g-2 mb-2 item-row';
    newRow.innerHTML = `
        <div class="col-md-6">
            <input type="text" class="form-control item-desc" placeholder="Service description..." required>
        </div>
        <div class="col-md-2">
            <input type="number" class="form-control item-qty" placeholder="Qty" value="1" min="1" oninput="calculateTotals()" required>
        </div>
        <div class="col-md-3">
            <input type="number" class="form-control item-price" placeholder="Price (LKR)" step="0.01" min="0.01" oninput="calculateTotals()" required>
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-outline-danger btn-sm w-100" onclick="removeRow(this)">×</button>
        </div>
    `;
    container.appendChild(newRow);
}

function removeRow(btn) {
    const row = btn.closest('.item-row');
    if (document.querySelectorAll('.item-row').length > 1) {
        row.remove();
        calculateTotals();
    }
}

function calculateTotals() {
    let subtotal = 0;
    const rows = document.querySelectorAll('.item-row');
    
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        subtotal += (qty * price);
    });

    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    document.getElementById('subtotalDisplay').innerText = `LKR ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    document.getElementById('taxDisplay').innerText = `LKR ${taxAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    document.getElementById('totalDisplay').innerText = `LKR ${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    document.getElementById('calculatedTotal').value = total.toFixed(2);
}

function openCreateInvoiceModal() {
    document.getElementById('invoiceForm').reset();
    const today = new Date().toISOString().split('T')[0];
    const monthLater = new Date();
    monthLater.setDate(monthLater.getDate() + 30);
    
    document.getElementById('issueDate').value = today;
    document.getElementById('dueDate').value = monthLater.toISOString().split('T')[0];
    calculateTotals();

    document.getElementById('invoiceModal').style.display = 'flex';
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').style.display = 'none';
}

function handleFormSubmit(e) {
    e.preventDefault();
    hideAlert();

    const invNum = document.getElementById('invoiceNumber').value.trim();
    const campaignId = parseInt(document.getElementById('campaignId').value);
    const clientId = parseInt(document.getElementById('clientId').value);
    const issueDate = document.getElementById('issueDate').value;
    const dueDate = document.getElementById('dueDate').value;
    const taxRate = parseFloat(document.getElementById('taxRate').value);
    const billingContact=document.getElementById('billingContact').value.trim();
    const billingEmail=document.getElementById('billingEmail').value.trim();
    const billingAddress=document.getElementById('billingAddress').value.trim();
    const currency=document.getElementById('currency').value;
    const poReference=document.getElementById('poReference').value.trim();
    const paymentTerms=parseInt(document.getElementById('paymentTerms').value);
    const notes=document.getElementById('invoiceNotes').value.trim();
    if(billingContact.length<3 || billingAddress.length<8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail)){showAlert('Validation Error: Enter a valid billing contact, email and billing address.');return;}

    // =========================================================================
    // CLIENT-SIDE VALIDATION CHECKS
    // =========================================================================

    // 1. Unique Invoice Number Check
    if (invoiceState.some(i => i.number.toLowerCase() === invNum.toLowerCase())) {
        showAlert(`Uniqueness Conflict Error: Invoice Number '${invNum}' already exists in database.`);
        return;
    }

    // 2. Non-Negative Checks
    if (taxRate < 0) {
        showAlert('Validation Error: Tax rate cannot be negative.');
        return;
    }

    let items = [];
    let computedSubtotal = 0;
    const rows = document.querySelectorAll('.item-row');
    
    for (let row of rows) {
        const desc = row.querySelector('.item-desc').value.trim();
        const qty = parseInt(row.querySelector('.item-qty').value);
        const price = parseFloat(row.querySelector('.item-price').value);

        if (!desc || isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) {
            showAlert('Non-Negative Check Error: All line items must have valid descriptions, positive quantities, and unit prices (> 0).');
            return;
        }

        const lineTotal = qty * price;
        computedSubtotal += lineTotal;
        items.push({ desc: desc, qty: qty, price: price, total: lineTotal });
    }

    // 3. Strict Math Verification (Total = Subtotal + Tax)
    const computedTax = computedSubtotal * (taxRate / 100);
    const computedTotal = computedSubtotal + computedTax;

    const campaignTitles = { 1: '5G Mega Launch 2026', 2: 'Avurudu Festive Promo' };

    invoiceState.unshift({
        id: Date.now(),
        number: invNum,
        campaignId: campaignId,
        campaignTitle: campaignTitles[campaignId],
        client: 'Dialog Axiata PLC',
        issueDate: issueDate,
        dueDate: dueDate,
        taxRate: taxRate,
        subtotal: computedSubtotal,
        taxAmount: computedTax,
        total: computedTotal,
        paid: 0,
        billingContact: billingContact, billingEmail: billingEmail, billingAddress: billingAddress, currency: currency,
        poReference: poReference, paymentTerms: paymentTerms, notes: notes, paymentStatus: 'NO_RECEIPT', receipt: null,
        status: 'DRAFT',
        items: items
    });

    closeInvoiceModal();
    loadInvoices();
}

function openPaymentModal(id) {
    const item = invoiceState.find(i => i.id === id);
    if (!item) return;

    if (item.status === 'VOID') {
        showAlert('Ledger Audit Error: Cannot record payment on a VOID invoice.');
        return;
    }

    const remaining = item.total - item.paid;
    document.getElementById('payInvId').value = item.id;
    document.getElementById('payInvNum').value = item.number;
    document.getElementById('payBalanceDue').value = `LKR ${remaining.toLocaleString()}`;
    document.getElementById('payAmount').value = remaining;
    document.getElementById('receiptFileName').innerText = item.receipt ? item.receipt.file : 'No receipt uploaded by client';
    document.getElementById('receiptMeta').innerText = item.receipt ? `Uploaded: ${item.receipt.uploadedAt} • Ref: ${item.receipt.reference}` : 'Waiting for client receipt';
    document.getElementById('receiptStatus').value = item.paymentStatus === 'VERIFIED' ? 'VERIFIED' : (item.paymentStatus === 'REJECTED' ? 'REJECTED' : 'PENDING_REVIEW');

    document.getElementById('paymentModal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    hideAlert();

    const id = parseInt(document.getElementById('payInvId').value);
    const payVal = parseFloat(document.getElementById('payAmount').value);
    const receiptStatus = document.getElementById('receiptStatus').value;

    const item = invoiceState.find(i => i.id === id);
    if (!item) return;

    const remaining = item.total - item.paid;
    item.paymentStatus = receiptStatus;
    if (receiptStatus === 'REJECTED') { closePaymentModal(); loadInvoices(); return; }
    if (receiptStatus !== 'VERIFIED') { showAlert('Payment is still pending verification. Select VERIFIED before recording the amount.'); return; }
    if (!item.receipt) { showAlert('Verification Error: No client payment receipt is attached to this invoice.'); return; }

    // Overpayment Guard Check
    if (payVal > remaining) {
        showAlert(`Overpayment Guard Error: Payment amount (LKR ${payVal.toLocaleString()}) exceeds the remaining balance due (LKR ${remaining.toLocaleString()}).`);
        return;
    }

    item.paid += payVal;
    if (item.paid >= item.total) {
        item.status = 'PAID';
    } else {
        item.status = 'SENT';
    }

    closePaymentModal();
    loadInvoices();
}

function handleInvoiceDelete(id, isHardDeleteRequest) {
    const item = invoiceState.find(i => i.id === id);
    if (!item) return;

    // Ledger Audit Rule Check: Only DRAFT invoices can be hard deleted
    if (isHardDeleteRequest) {
        if (item.status !== 'DRAFT') {
            showAlert(`Ledger Audit Restriction Error: Invoices with status '${item.status}' CANNOT be hard deleted. Accounting ledger history rules require formal VOIDING instead.`);
            return;
        }
        if (confirm(`Permanently delete Draft Invoice ${item.number}?`)) {
            invoiceState = invoiceState.filter(i => i.id !== id);
            loadInvoices();
        }
    } else {
        if (confirm(`Void Invoice ${item.number}? Status will transition to VOID to preserve clean accounting audit trail.`)) {
            item.status = 'VOID';
            loadInvoices();
        }
    }
}

function openPdfModal(id) {
    const item = invoiceState.find(i => i.id === id);
    if (!item) return;

    let itemsHtml = item.items.map(it => `
        <tr>
            <td>${it.desc}</td>
            <td class="text-center">${it.qty}</td>
            <td class="text-end">LKR ${it.price.toLocaleString()}</td>
            <td class="text-end">LKR ${it.total.toLocaleString()}</td>
        </tr>
    `).join('');

    document.getElementById('pdfContent').innerHTML = `
        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <div>
                <h2 class="fw-bold text-primary mb-0">AdFlow Billing</h2>
                <small class="text-secondary">BrightWave Advertising (Pvt) Ltd</small>
            </div>
            <div class="text-end">
                <h4 class="mb-0 fw-bold">${item.number}</h4>
                <small class="badge bg-secondary">${item.status}</small>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-6">
                <strong>Billed To:</strong><br>
                ${item.client}<br>
                Campaign: ${item.campaignTitle}
            </div>
            <div class="col-6 text-end">
                <strong>Issue Date:</strong> ${item.issueDate}<br>
                <strong>Due Date:</strong> ${item.dueDate}
            </div>
        </div>
        <table class="table table-bordered mb-4">
            <thead class="table-light">
                <tr>
                    <th>Description</th>
                    <th class="text-center">Qty</th>
                    <th class="text-end">Unit Price</th>
                    <th class="text-end">Line Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>
        <div class="row justify-content-end">
            <div class="col-6 text-end">
                <p class="mb-1">Subtotal: LKR ${item.subtotal.toLocaleString()}</p>
                <p class="mb-1">Tax (${item.taxRate}%): LKR ${item.taxAmount.toLocaleString()}</p>
                <h5 class="fw-bold text-success">Total Amount: LKR ${item.total.toLocaleString()}</h5>
                <p class="small text-muted mb-0">Amount Paid: LKR ${item.paid.toLocaleString()}</p>
            </div>
        </div>
    `;

    document.getElementById('pdfModal').style.display = 'flex';
}

function closePdfModal() {
    document.getElementById('pdfModal').style.display = 'none';
}

function resetFilters() {
    document.getElementById('searchKeyword').value = '';
    document.getElementById('filterStatus').value = 'ALL';
    loadInvoices();
}

function showAlert(msg) {
    document.getElementById('alertMessage').innerText = msg;
    document.getElementById('alertBanner').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    document.getElementById('alertBanner').style.display = 'none';
}

function editPaymentStatus(id){const item=invoiceState.find(i=>i.id===id);if(!item||item.status==='VOID')return;const next=prompt(`Current invoice status: ${item.status}\nEnter: DRAFT, SENT, OVERDUE, PAID`,item.status);if(!next)return;const v=next.trim().toUpperCase();if(!['DRAFT','SENT','OVERDUE','PAID'].includes(v)){showAlert('Validation Error: Invalid payment/invoice status.');return;}if(v==='PAID' && item.paid < item.total){if(!confirm('Paid amount is less than invoice total. Mark as PAID anyway?'))return;}item.status=v;loadInvoices();}

// Toggle Invoice Row Action Dropdown Menu
if (typeof toggleInvoiceActionMenu !== 'function') {
    function toggleInvoiceActionMenu(id, event) {
        if (event) event.stopPropagation();
        const menu = document.getElementById(`invoiceActionMenu-${id}`);
        if (!menu) return;

        const isVisible = menu.classList.contains('show');
        document.querySelectorAll('.action-dropdown-menu.show').forEach(m => {
            if (m !== menu) m.classList.remove('show');
        });

        if (isVisible) {
            menu.classList.remove('show');
        } else {
            menu.classList.add('show');
        }
    }
}
