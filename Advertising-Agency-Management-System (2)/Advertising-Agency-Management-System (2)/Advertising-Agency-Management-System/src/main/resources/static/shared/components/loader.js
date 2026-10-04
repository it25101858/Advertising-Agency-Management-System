/* ============================================================================
   AdFlow - Loader Component
   ============================================================================ */

const Loader = {
    _overlay: null,

    /**
     * Show full-page loading overlay
     */
    show(text = 'Loading…') {
        this.hide();
        const overlay = document.createElement('div');
        overlay.className = 'loader-overlay';
        overlay.id = 'adflow-loader';
        overlay.innerHTML = `
            <div class="spinner"></div>
            <p class="loader-text">${text}</p>`;
        document.body.appendChild(overlay);
        this._overlay = overlay;
    },

    /**
     * Hide full-page loading overlay
     */
    hide() {
        document.getElementById('adflow-loader')?.remove();
        this._overlay = null;
    },

    /**
     * Replace element content with a skeleton placeholder
     */
    skeleton(el, rows = 3) {
        if (typeof el === 'string') el = document.querySelector(el);
        if (!el) return;
        el.innerHTML = Array.from({ length: rows }, () => `
            <div style="margin-bottom:12px">
                <div class="skeleton" style="height:14px;width:60%;margin-bottom:8px"></div>
                <div class="skeleton" style="height:10px;width:90%"></div>
            </div>`).join('');
    },

    /**
     * Show spinner inside a button while an async action runs
     */
    async withButton(btn, asyncFn) {
        if (!btn) return asyncFn();
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner spinner-sm" style="border-color:rgba(255,255,255,0.3);border-top-color:white;display:inline-block"></span>`;
        try { return await asyncFn(); }
        finally { btn.disabled = false; btn.innerHTML = orig; }
    }
};

window.Loader = Loader;
