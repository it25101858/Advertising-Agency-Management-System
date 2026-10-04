/* ============================================================================
   AdFlow - Sidebar Component
   Renders role-aware navigation sidebar
   ============================================================================ */

const Sidebar = {
    _isOpen: false,

    /**
     * Render the sidebar into #app-sidebar
     */
    render(activeModule = '') {
        const sidebarEl = document.getElementById('app-sidebar');
        if (!sidebarEl) return;

        const navItems = PermissionUtils.getVisibleNavItems();
        const user = StorageUtils.getUser();
        const role = FormatUtils.humanize(user?.role || 'User');

        sidebarEl.innerHTML = `
        <div class="sidebar-portal-badge">
            <span>AdFlow Portal</span>
            <span class="portal-status-dot">LIVE</span>
        </div>

        <div class="sidebar-section-title">Navigation</div>

        ${navItems.map(item => `
            <a class="nav-item ${activeModule === item.id ? 'active' : ''}"
               href="${item.href}"
               id="nav-${item.id}"
               title="${item.label}">
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-text">${item.label}</span>
            </a>
        `).join('')}

        <div class="sidebar-divider"></div>
        <div class="sidebar-section-title">Account</div>
        <div class="nav-item" style="cursor:default; opacity:0.6; font-size:0.8rem;">
            <span class="nav-icon">👤</span>
            <span class="nav-text">${user?.fullName || user?.name || 'User'}<br>
                <small style="font-weight:500;opacity:0.8">${role}</small>
            </span>
        </div>
        <div class="nav-item" onclick="Sidebar.logout()">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">Sign Out</span>
        </div>`;
    },

    /**
     * Toggle sidebar open/closed on mobile
     */
    toggle() {
        const sidebar = document.getElementById('app-sidebar');
        if (!sidebar) return;
        this._isOpen = !this._isOpen;
        sidebar.classList.toggle('open', this._isOpen);
        this._updateOverlay();
    },

    open() {
        this._isOpen = true;
        document.getElementById('app-sidebar')?.classList.add('open');
        this._updateOverlay();
    },

    close() {
        this._isOpen = false;
        document.getElementById('app-sidebar')?.classList.remove('open');
        this._removeOverlay();
    },

    _updateOverlay() {
        this._removeOverlay();
        if (this._isOpen && window.innerWidth <= 768) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.id = 'sidebar-overlay';
            overlay.onclick = () => this.close();
            document.body.appendChild(overlay);
        }
    },

    _removeOverlay() {
        document.getElementById('sidebar-overlay')?.remove();
    },

    logout() {
        StorageUtils.clearAuth();
        window.location.href = '/static/pages/auth/login.html';
    },

    /**
     * Highlight active nav item by module ID
     */
    setActive(moduleId) {
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.toggle('active', el.id === `nav-${moduleId}`);
        });
    }
};

window.Sidebar = Sidebar;
