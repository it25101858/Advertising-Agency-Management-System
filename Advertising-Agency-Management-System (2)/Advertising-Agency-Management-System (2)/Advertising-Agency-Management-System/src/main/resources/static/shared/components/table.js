/* ============================================================================
   AdFlow - Table Component
   Dynamic data table renderer with sorting and empty state
   ============================================================================ */

const Table = {
    /**
     * Render a data table into a container element
     * @param {HTMLElement|string} container  - element or CSS selector
     * @param {Array} columns  - [{ key, label, render?, sortable? }]
     * @param {Array} data     - array of row objects
     * @param {object} options - { tableId, showHeader, emptyText }
     */
    render(container, columns, data, options = {}) {
        const el = typeof container === 'string' ? document.querySelector(container) : container;
        if (!el) return;

        const { tableId = 'data-table', emptyText = 'No records found.', emptyIcon = '📭' } = options;

        if (!data || data.length === 0) {
            el.innerHTML = `
                <div class="table-empty">
                    <div class="empty-icon">${emptyIcon}</div>
                    <div class="empty-title">${emptyText}</div>
                    <p style="margin-top:8px;font-size:0.85rem;color:var(--text-muted)">No records match your current filters.</p>
                </div>`;
            return;
        }

        const thead = columns.map(c => `<th>${c.label}</th>`).join('');
        const tbody = data.map(row => {
            const cells = columns.map(col => {
                const value = col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—');
                return `<td>${value}</td>`;
            }).join('');
            return `<tr data-id="${row.id || ''}">${cells}</tr>`;
        }).join('');

        el.innerHTML = `
            <div class="table-wrapper">
                <table class="data-table" id="${tableId}">
                    <thead><tr>${thead}</tr></thead>
                    <tbody>${tbody}</tbody>
                </table>
            </div>`;
    },

    /**
     * Render a badge HTML string
     */
    badge(value, type = 'blue') {
        return `<span class="badge badge-${type}">${value}</span>`;
    },

    /**
     * Render status badge auto-detecting type from value
     */
    statusBadge(status) {
        if (!status) return '—';
        const s = status.toLowerCase();
        const map = {
            active: 'active', approved: 'approved', paid: 'paid', completed: 'completed', verified: 'verified',
            scheduled: 'scheduled', in_progress: 'in_progress', sent: 'sent', upcoming: 'upcoming', pending_review: 'pending_review',
            draft: 'draft', needs_review: 'needs_review', submitted: 'submitted',
            urgent: 'urgent', overdue: 'overdue', rejected: 'rejected', cancelled: 'cancelled', needs_revision: 'needs_revision',
            in_review: 'in_review',
            archived: 'archived', inactive: 'inactive'
        };
        const cls = map[s] || 'gray';
        return `<span class="badge badge-${cls}">${FormatUtils.humanize(status)}</span>`;
    },

    /**
     * Render action buttons for a row
     */
    actions(buttons) {
        return `<div class="table-actions">${buttons.map(b => `
            <button class="btn-icon" onclick="${b.action}" title="${b.label}"
                    style="${b.color ? `color:${b.color}` : ''}">
                ${b.icon}
            </button>`).join('')}</div>`;
    }
};

window.Table = Table;
