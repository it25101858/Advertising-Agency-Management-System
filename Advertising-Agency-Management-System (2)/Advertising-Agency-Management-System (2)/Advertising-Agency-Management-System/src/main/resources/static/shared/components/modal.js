/* ============================================================================
   AdFlow - Modal Component
   Generic modal open/close with dynamic content injection
   ============================================================================ */

const Modal = {
    _stack: [],

    /**
     * Open a modal overlay by ID
     */
    open(id) {
        const overlay = document.getElementById(id);
        if (!overlay) return;
        overlay.classList.add('active');
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this._stack.push(id);
        // Scroll to top of modal content
        const content = overlay.querySelector('.modal-content');
        if (content) content.scrollTop = 0;
    },

    /**
     * Close a modal overlay by ID
     */
    close(id) {
        const overlay = document.getElementById(id);
        if (!overlay) return;
        overlay.classList.remove('active');
        overlay.style.display = 'none';
        this._stack = this._stack.filter(s => s !== id);
        if (this._stack.length === 0) document.body.style.overflow = '';
    },

    /**
     * Close the topmost modal
     */
    closeLast() {
        if (this._stack.length) this.close(this._stack[this._stack.length - 1]);
    },

    /**
     * Close all open modals
     */
    closeAll() {
        [...this._stack].forEach(id => this.close(id));
    },

    /**
     * Set modal title
     */
    setTitle(modalId, title) {
        const modal = document.getElementById(modalId);
        const titleEl = modal?.querySelector('.modal-title, #modalTitle, h3');
        if (titleEl) titleEl.textContent = title;
    },

    /**
     * Set modal body HTML
     */
    setBody(modalId, html) {
        const modal = document.getElementById(modalId);
        const body  = modal?.querySelector('.modal-body, #modalBody');
        if (body) body.innerHTML = html;
    },

    /**
     * Initialize Escape key + backdrop click close behavior
     */
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLast();
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) this.close(e.target.id);
        });
    }
};

// Convenience globals used by legacy code
window.Modal = Modal;
window.closeModal = (id) => id ? Modal.close(id) : Modal.closeLast();
window.openModal  = (id) => Modal.open(id);
