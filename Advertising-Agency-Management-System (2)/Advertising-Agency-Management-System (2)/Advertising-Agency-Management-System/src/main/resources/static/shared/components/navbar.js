/* ============================================================================
   AdFlow - Navbar Component
   Renders the top application header with branding, user info, notifications
   ============================================================================ */

const Navbar = {
    /**
     * Render the navbar into #app-header (or create one if missing)
     */
    render(options = {}) {
        const user = StorageUtils.getUser();
        const { activePage = '' } = options;

        const headerEl = document.getElementById('app-header') || this._createHeaderEl();

        headerEl.innerHTML = `
        <div class="brand" onclick="window.location.href='/static/index.html'" title="Go to Home">
            <div class="logo-badge">AdFlow</div>
            <div class="brand-text">
                <h1>BrightWave Advertising</h1>
                <p>Premier 3D & Digital Advertising Agency</p>
            </div>
        </div>

        <div class="navbar-center" id="publicNavLinks" style="${user ? 'display:none' : ''}">
            <a href="javascript:void(0)" onclick="Navbar._scrollTo('heroSection', this)"
               class="nav-link-public ${activePage === 'home' ? 'active' : ''}">Home</a>
            <a href="javascript:void(0)" onclick="Navbar._scrollTo('capabilitiesSection', this)"
               class="nav-link-public">Capabilities</a>
            <a href="javascript:void(0)" onclick="Navbar._scrollTo('portfolioSection', this)"
               class="nav-link-public">Portfolio</a>
            <a href="javascript:void(0)" onclick="Navbar._scrollTo('contactSection', this)"
               class="nav-link-public">Contact</a>
        </div>

        <div class="navbar-right">
            ${user ? this._renderUserControls(user) : this._renderPublicControls()}
        </div>`;
    },

    _renderPublicControls() {
        return `<button class="btn-portal-login" onclick="window.location.href='/static/pages/auth/login.html'">
                    🔑 Sign In
                </button>`;
    },

    _renderUserControls(user) {
        const initials = FormatUtils.initials(user.fullName || user.name || user.email);
        const color    = FormatUtils.colorFromString(user.fullName || user.email);
        const role     = FormatUtils.humanize(user.role || 'User');

        return `
        <div class="notif-bell-wrap" id="notifWrap">
            <button class="btn-notif" onclick="Navbar.toggleNotifications()" title="Notifications">
                🔔
                <span class="notif-badge" id="notifCount" style="display:none">3</span>
            </button>
            <div class="dropdown-menu" id="notifDropdown">
                <div class="dropdown-item font-bold" style="cursor:default; color:var(--text-primary)">
                    🔔 Notifications
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item">📅 New appointment scheduled</div>
                <div class="dropdown-item">📢 Campaign approved</div>
                <div class="dropdown-item">💬 New client feedback</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item text-blue text-center font-bold">Mark all as read</div>
            </div>
        </div>

        <div class="user-chip dropdown" id="userChipWrap">
            <div style="width:32px;height:32px;border-radius:50%;background:${color};
                        display:flex;align-items:center;justify-content:center;
                        color:white;font-size:0.8rem;font-weight:800;cursor:pointer;flex-shrink:0;"
                 onclick="Navbar.toggleUserMenu()">
                ${initials}
            </div>
            <div style="cursor:pointer" onclick="Navbar.toggleUserMenu()">
                <div class="user-name">${user.fullName || user.name || 'User'}</div>
                <div class="user-role">${role}</div>
            </div>
            <div class="dropdown-menu" id="userDropdown">
                <a class="dropdown-item" href="/static/pages/users/user-profile.html">👤 My Profile</a>
                <a class="dropdown-item" href="/static/pages/dashboard/dashboard.html">📊 Dashboard</a>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item danger" onclick="Navbar.logout()">🚪 Sign Out</div>
            </div>
        </div>

        <button class="btn-hamburger" id="sidebarToggle" onclick="Sidebar.toggle()" title="Menu">
            ☰
        </button>`;
    },

    toggleNotifications() {
        const menu = document.getElementById('notifDropdown');
        const userMenu = document.getElementById('userDropdown');
        if (userMenu) userMenu.classList.remove('open');
        menu?.classList.toggle('open');
    },

    toggleUserMenu() {
        const menu = document.getElementById('userDropdown');
        const notifMenu = document.getElementById('notifDropdown');
        if (notifMenu) notifMenu.classList.remove('open');
        menu?.classList.toggle('open');
    },

    logout() {
        StorageUtils.clearAuth();
        window.location.href = '/static/pages/auth/login.html';
    },

    _scrollTo(sectionId, el) {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-link-public').forEach(a => a.classList.remove('active'));
        if (el) el.classList.add('active');
    },

    _createHeaderEl() {
        const header = document.createElement('header');
        header.id = 'app-header';
        header.className = 'app-header';
        document.body.prepend(header);
        return header;
    },

    /**
     * Close all dropdowns when clicking outside
     */
    init() {
        document.addEventListener('click', (e) => {
            const notifWrap = document.getElementById('notifWrap');
            const userWrap  = document.getElementById('userChipWrap');
            if (notifWrap && !notifWrap.contains(e.target)) {
                document.getElementById('notifDropdown')?.classList.remove('open');
            }
            if (userWrap && !userWrap.contains(e.target)) {
                document.getElementById('userDropdown')?.classList.remove('open');
            }
        });
    }
};

window.Navbar = Navbar;
