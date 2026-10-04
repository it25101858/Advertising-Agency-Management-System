/* ============================================================================
   AdFlow - Confirmation Dialog Component
   ============================================================================ */

const Confirmation = {
    _resolve: null,

    /**
     * Show a confirmation dialog
     * @returns {Promise<boolean>} true if confirmed, false if cancelled
     */
    show({ title = 'Confirm Action', message = 'Are you sure?', icon = '⚠️',
           confirmText = 'Confirm', cancelText = 'Cancel',
           confirmClass = 'btn-danger' } = {}) {
        return new Promise((resolve) => {
            this._resolve = resolve;
            let dialog = document.getElementById('confirmDialog');
            if (!dialog) {
                dialog = document.createElement('div');
                dialog.id = 'confirmDialog';
                dialog.className = 'modal-overlay confirm-dialog';
                document.body.appendChild(dialog);
            }

            dialog.innerHTML = `
                <div class="modal-content" style="max-width:420px;text-align:center;padding:40px 36px">
                    <div style="font-size:3rem;margin-bottom:16px">${icon}</div>
                    <h3 style="margin-bottom:12px;font-size:1.3rem">${title}</h3>
                    <p style="color:var(--text-secondary);margin-bottom:28px;line-height:1.6">${message}</p>
                    <div style="display:flex;gap:12px;justify-content:center">
                        <button class="btn btn-ghost" onclick="Confirmation._resolve(false);Confirmation.hide()">
                            ${cancelText}
                        </button>
                        <button class="btn ${confirmClass}" onclick="Confirmation._resolve(true);Confirmation.hide()">
                            ${confirmText}
                        </button>
                    </div>
                </div>`;

            dialog.style.display = 'flex';
            dialog.classList.add('active');
        });
    },

    hide() {
        const dialog = document.getElementById('confirmDialog');
        if (dialog) { dialog.style.display = 'none'; dialog.classList.remove('active'); }
    },

    /**
     * Shorthand for delete confirmations
     */
    delete(itemName = 'this record') {
        return this.show({
            title: 'Delete Record',
            message: `Are you sure you want to delete <strong>${itemName}</strong>? This action cannot be undone.`,
            icon: '🗑️',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            confirmClass: 'btn-danger'
        });
    }
};

window.Confirmation = Confirmation;
