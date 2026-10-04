/* AdFlow - Invoice Calculator Module */
const InvoiceCalculator = {
    TAX_RATE: 8, // VAT 8% as per project spec

    calculate(items = [], taxRate = this.TAX_RATE) {
        const subtotal  = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
        const taxAmount = subtotal * (taxRate / 100);
        const total     = subtotal + taxAmount;
        return { subtotal, taxAmount, total, taxRate };
    },

    updateTotals(items) {
        const { subtotal, taxAmount, total } = this.calculate(items);
        const el = (id) => document.getElementById(id);
        if (el('calcSubtotal')) el('calcSubtotal').textContent = FormatUtils.currency(subtotal);
        if (el('calcTax'))      el('calcTax').textContent      = FormatUtils.currency(taxAmount);
        if (el('calcTotal'))    el('calcTotal').textContent    = FormatUtils.currency(total);
        return { subtotal, taxAmount, total };
    },

    renderLineItems(items) {
        const tbody = document.getElementById('lineItemsBody');
        if (!tbody) return;
        tbody.innerHTML = items.map((item, i) => `
        <tr>
            <td><input type="text" class="form-control" value="${item.desc}" placeholder="Service description"
                       onchange="InvoiceCalculator.updateItem(${i}, 'desc', this.value)"></td>
            <td style="width:80px"><input type="number" class="form-control" value="${item.qty}" min="1"
                       onchange="InvoiceCalculator.updateItem(${i}, 'qty', +this.value)"></td>
            <td style="width:140px"><input type="number" class="form-control" value="${item.price}" min="0" step="1000"
                       onchange="InvoiceCalculator.updateItem(${i}, 'price', +this.value)"></td>
            <td style="width:140px;font-weight:700;color:var(--blue-electric)">${FormatUtils.currency(item.qty * item.price)}</td>
            <td style="width:40px"><button class="btn-icon" style="color:var(--accent-red)" onclick="InvoiceCalculator.removeItem(${i})">✕</button></td>
        </tr>`).join('');
        this.updateTotals(items);
    },

    _items: [],

    addItem() {
        this._items.push({ desc: '', qty: 1, price: 0, total: 0 });
        this.renderLineItems(this._items);
    },

    updateItem(index, field, value) {
        if (this._items[index]) {
            this._items[index][field] = value;
            this._items[index].total = this._items[index].qty * this._items[index].price;
            this.updateTotals(this._items);
        }
    },

    removeItem(index) {
        this._items.splice(index, 1);
        this.renderLineItems(this._items);
    },

    setItems(items) {
        this._items = JSON.parse(JSON.stringify(items));
        this.renderLineItems(this._items);
    },

    getItems() { return this._items; }
};
window.InvoiceCalculator = InvoiceCalculator;
