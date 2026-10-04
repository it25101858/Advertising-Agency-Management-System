/* ============================================================================
   AdFlow - Pagination Component
   ============================================================================ */

const Pagination = {
    _state: {},

    /**
     * Initialize pagination for a dataset
     * @param {string} id        - unique pagination ID
     * @param {Array}  data      - full data array
     * @param {number} pageSize  - items per page
     * @param {function} onPage  - callback(pageData) called on each page change
     */
    init(id, data, pageSize = 10, onPage) {
        this._state[id] = { data, pageSize, currentPage: 1, onPage };
        this._render(id);
        onPage(this.getPage(id));
    },

    /**
     * Get current page data
     */
    getPage(id) {
        const s = this._state[id];
        if (!s) return [];
        const start = (s.currentPage - 1) * s.pageSize;
        return s.data.slice(start, start + s.pageSize);
    },

    /**
     * Go to a specific page
     */
    goTo(id, page) {
        const s = this._state[id];
        if (!s) return;
        const maxPage = Math.ceil(s.data.length / s.pageSize);
        s.currentPage = Math.max(1, Math.min(page, maxPage));
        this._render(id);
        s.onPage(this.getPage(id));
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    /**
     * Update data and reset to page 1
     */
    update(id, data) {
        const s = this._state[id];
        if (!s) return;
        s.data = data;
        s.currentPage = 1;
        this._render(id);
        s.onPage(this.getPage(id));
    },

    _render(id) {
        const s = this._state[id];
        const container = document.getElementById(id + '-pagination');
        if (!container || !s) return;

        const total    = s.data.length;
        const maxPage  = Math.ceil(total / s.pageSize);
        const cur      = s.currentPage;
        const start    = (cur - 1) * s.pageSize + 1;
        const end      = Math.min(cur * s.pageSize, total);

        if (total === 0) { container.innerHTML = ''; return; }

        const pages = this._pageNumbers(cur, maxPage);

        container.innerHTML = `
        <div class="pagination">
            <span class="page-info">Showing ${start}–${end} of ${total} records</span>
            <button class="page-btn" onclick="Pagination.goTo('${id}', ${cur - 1})"
                    ${cur === 1 ? 'disabled' : ''}>‹ Prev</button>
            ${pages.map(p => p === '...'
                ? `<span class="page-btn" style="cursor:default">…</span>`
                : `<button class="page-btn ${p === cur ? 'active' : ''}"
                           onclick="Pagination.goTo('${id}', ${p})">${p}</button>`
            ).join('')}
            <button class="page-btn" onclick="Pagination.goTo('${id}', ${cur + 1})"
                    ${cur === maxPage ? 'disabled' : ''}>Next ›</button>
        </div>`;
    },

    _pageNumbers(cur, max) {
        if (max <= 7) return Array.from({ length: max }, (_, i) => i + 1);
        const pages = [1];
        if (cur > 3)  pages.push('...');
        for (let i = Math.max(2, cur - 1); i <= Math.min(max - 1, cur + 1); i++) pages.push(i);
        if (cur < max - 2) pages.push('...');
        pages.push(max);
        return pages;
    }
};

window.Pagination = Pagination;
