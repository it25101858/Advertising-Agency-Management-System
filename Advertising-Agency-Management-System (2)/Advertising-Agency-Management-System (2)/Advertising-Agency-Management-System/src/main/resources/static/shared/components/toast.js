/* ============================================================================
   AdFlow - Toast Notification Component
   ============================================================================ */

const Toast = {
    _container: null,

    _getContainer() {
        if (!this._container) {
            this._container = document.getElementById('toast-container');
            if (!this._container) {
                this._container = document.createElement('div');
                this._container.id = 'toast-container';
                document.body.appendChild(this._container);
            }
        }
        return this._container;
    },

    /**
     * Show a toast notification
     * @param {string} message  Main message
     * @param {'success'|'error'|'warning'|'info'} type
     * @param {string} [title]  Optional title
     * @param {number} [duration]  Duration in ms (default 3000)
     */
    show(message, type = 'info', title = '', duration = 3000) {
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        const container = this._getContainer();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <div class="toast-body">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-msg">${message}</div>
            </div>
            <button onclick="this.parentElement.remove()"
                    style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:1.1rem;padding:0 4px;line-height:1;align-self:flex-start;">×</button>`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(msg, title = 'Success')  { this.show(msg, 'success', title); },
    error(msg, title = 'Error')      { this.show(msg, 'error', title, 5000); },
    warning(msg, title = 'Warning')  { this.show(msg, 'warning', title); },
    info(msg, title = '')            { this.show(msg, 'info', title); }
};

// Backward compat
window.Toast = Toast;
window.Utils = window.Utils || {};
window.Utils.showToast = (msg, type = 'success') => Toast.show(msg, type);
