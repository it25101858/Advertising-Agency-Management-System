/* ============================================================================
   AdFlow - Central REST API Client
   Enables Real-Time MySQL Database Synchronization & Operations
   ============================================================================ */

const API_BASE_URL = (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http'))
    ? `${window.location.origin}/api`
    : 'http://localhost:8080/api';

window.AdFlowAPI = {
    // Helper for fetch with form data or query parameters
    async request(endpoint, options = {}) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            const config = {
                method: options.method || 'GET',
                headers: options.headers || {},
            };

            if (options.body) {
                if (options.body instanceof FormData || typeof options.body === 'string') {
                    config.body = options.body;
                } else {
                    // Convert object to URLSearchParams for standard form POSTs
                    const params = new URLSearchParams();
                    for (const [key, val] of Object.entries(options.body)) {
                        if (val !== undefined && val !== null) {
                            params.append(key, val);
                        }
                    }
                    config.body = params;
                    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
                }
            }

            const response = await fetch(url, config);
            if (!response.ok) {
                const text = await response.text();
                let errObj;
                try { errObj = JSON.parse(text); } catch(e) { errObj = { message: text || `HTTP ${response.status}` }; }
                throw new Error(errObj.message || errObj.error || `HTTP ${response.status}`);
            }
            const resJson = await response.json();
            if (resJson && resJson.data !== undefined) {
                return resJson.data;
            }
            return resJson;
        } catch (err) {
            console.warn(`[AdFlow API] Request to ${endpoint} failed:`, err.message);
            return null; // Return null on network or server error to trigger graceful fallback
        }
    },

    // ------------------------------------------------------------------------
    // 1. USERS & AUTHENTICATION (Real-time DB Sync)
    // ------------------------------------------------------------------------
    async getUsers() {
        return await this.request('/users');
    },

    async registerUser(userData) {
        return await this.request('/users', {
            method: 'POST',
            body: { action: 'REGISTER', ...userData }
        });
    },

    async loginUser(email, password) {
        return await this.request('/users', {
            method: 'POST',
            body: { action: 'LOGIN', email, password }
        });
    },

    async saveStaff(staffData) {
        return await this.request('/users', {
            method: 'POST',
            body: { action: 'SAVE_STAFF', ...staffData }
        });
    },

    async deleteUser(userId) {
        return await this.request('/users', {
            method: 'POST',
            body: { action: 'DELETE', userId, id: userId }
        });
    },

    // ------------------------------------------------------------------------
    // 2. APPOINTMENTS (Real-time DB Sync)
    // ------------------------------------------------------------------------
    async getAppointments() {
        return await this.request('/appointments');
    },

    async createAppointment(data) {
        return await this.request('/appointments', {
            method: 'POST',
            body: { action: 'CREATE', ...data }
        });
    },

    async updateAppointment(data) {
        return await this.request('/appointments', {
            method: 'POST',
            body: { action: 'UPDATE', ...data }
        });
    },

    async deleteAppointment(appointmentId) {
        return await this.request('/appointments', {
            method: 'POST',
            body: { action: 'DELETE', appointmentId }
        });
    },

    // ------------------------------------------------------------------------
    // 3. CAMPAIGNS (Real-time DB Sync)
    // ------------------------------------------------------------------------
    async getCampaigns() {
        return await this.request('/campaigns');
    },

    async createCampaign(data) {
        return await this.request('/campaigns', {
            method: 'POST',
            body: { action: 'CREATE', ...data }
        });
    },

    async updateCampaign(data) {
        return await this.request('/campaigns', {
            method: 'POST',
            body: { action: 'UPDATE', ...data }
        });
    },

    async deleteCampaign(campaignId) {
        return await this.request('/campaigns', {
            method: 'POST',
            body: { action: 'DELETE_DRAFT', campaignId }
        });
    },

    // ------------------------------------------------------------------------
    // 4. TASKS (Real-time DB Sync)
    // ------------------------------------------------------------------------
    async getTasks() {
        return await this.request('/tasks');
    },

    async createTask(data) {
        return await this.request('/tasks', {
            method: 'POST',
            body: { action: 'CREATE', ...data }
        });
    },

    async updateTask(data) {
        return await this.request('/tasks', {
            method: 'POST',
            body: { action: 'UPDATE', ...data }
        });
    },

    async deleteTask(taskId) {
        return await this.request('/tasks', {
            method: 'POST',
            body: { action: 'DELETE', taskId }
        });
    },

    // ------------------------------------------------------------------------
    // 5. CREATIVE ASSETS (Real-time DB Sync)
    // ------------------------------------------------------------------------
    async getAssets() {
        return await this.request('/assets');
    },

    async createAsset(data) {
        return await this.request('/assets', {
            method: 'POST',
            body: { action: 'CREATE', ...data }
        });
    },

    async deleteAsset(assetId) {
        return await this.request('/assets', {
            method: 'POST',
            body: { action: 'DELETE', assetId }
        });
    },

    // ------------------------------------------------------------------------
    // 6. CLIENT FEEDBACK (Real-time DB Sync)
    // ------------------------------------------------------------------------
    async getFeedback() {
        return await this.request('/feedback');
    },

    async createFeedback(data) {
        return await this.request('/feedback', {
            method: 'POST',
            body: { action: 'CREATE', ...data }
        });
    },

    async updateFeedback(data) {
        return await this.request('/feedback', {
            method: 'POST',
            body: { action: 'UPDATE_STATUS', ...data }
        });
    },

    async deleteFeedback(feedbackId) {
        return await this.request('/feedback', {
            method: 'POST',
            body: { action: 'DELETE', feedbackId }
        });
    },

    // ------------------------------------------------------------------------
    // 7. INVOICES (Real-time DB Sync)
    // ------------------------------------------------------------------------
    async getInvoices() {
        return await this.request('/invoices');
    },

    async createInvoice(data) {
        return await this.request('/invoices', {
            method: 'POST',
            body: { action: 'CREATE', ...data }
        });
    },

    async updateInvoiceStatus(invoiceId, status) {
        return await this.request('/invoices', {
            method: 'POST',
            body: { action: 'UPDATE_STATUS', invoiceId, status }
        });
    },

    async updateInvoice(data) {
        return await this.request('/invoices', {
            method: 'POST',
            body: { action: 'UPDATE_STATUS', ...data }
        });
    },

    async deleteInvoice(invoiceId) {
        return await this.request('/invoices', {
            method: 'POST',
            body: { action: 'DELETE', invoiceId }
        });
    }
};


/* ============================================================================
   SHARED DASHBOARD UX SAFETY
   - Gives every standalone dashboard a working Home navigation action.
   - Lets users close any visible modal with Escape.
   - Lets users close a modal by clicking the shaded backdrop.
   ============================================================================ */
function goToHomePage() {
    window.location.href = 'index.html';
}

(function setupSharedDashboardModalSafety() {
    function hideOverlay(overlay) {
        if (!overlay || !overlay.classList || !overlay.classList.contains('modal-overlay')) return;
        overlay.style.display = 'none';
    }

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        const visibleOverlays = Array.from(document.querySelectorAll('.modal-overlay')).filter(function (overlay) {
            return window.getComputedStyle(overlay).display !== 'none';
        });
        if (visibleOverlays.length) {
            hideOverlay(visibleOverlays[visibleOverlays.length - 1]);
        }
    });

    document.addEventListener('click', function (event) {
        if (event.target && event.target.classList && event.target.classList.contains('modal-overlay')) {
            hideOverlay(event.target);
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
            const resetModalScroll = function () {
                if (window.getComputedStyle(overlay).display === 'none') return;
                overlay.scrollTop = 0;
                const content = overlay.querySelector('.modal-content');
                if (content) content.scrollTop = 0;
            };

            const observer = new MutationObserver(function () {
                resetModalScroll();
            });
            observer.observe(overlay, { attributes: true, attributeFilter: ['style', 'class'] });
        });
    });
})();
