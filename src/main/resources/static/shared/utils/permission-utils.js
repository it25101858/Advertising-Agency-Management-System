/* ============================================================================
   AdFlow - Permission Utilities
   Role-Based Access Control (RBAC) helpers
   ============================================================================ */

const PermissionUtils = {
    ROLES: {
        ADMIN:               'ADMIN',
        APPOINTMENT_MANAGER: 'APPOINTMENT_MANAGER',
        CAMPAIGN_MANAGER:    'CAMPAIGN_MANAGER',
        TASK_MANAGER:        'TASK_MANAGER',
        ASSET_MANAGER:       'ASSET_MANAGER',
        FINANCE_MANAGER:     'FINANCE_MANAGER',
        CLIENT:              'CLIENT',
        STAFF:               'STAFF',
        // Legacy role aliases
        CLIENT_RELATIONS_OFFICER: 'CLIENT_RELATIONS_OFFICER',
        MARKETING_MANAGER:        'MARKETING_MANAGER',
        CREATIVE_TEAM_LEAD:       'CREATIVE_TEAM_LEAD',
        CREATIVE_STAFF:           'CREATIVE_STAFF',
        FINANCE_EXECUTIVE:        'FINANCE_EXECUTIVE',
        MANAGING_DIRECTOR:        'MANAGING_DIRECTOR'
    },

    /* ── Module Access Map ───────────────────────────────────────────── */
    MODULE_ACCESS: {
        appointments: ['ADMIN', 'APPOINTMENT_MANAGER', 'CLIENT_RELATIONS_OFFICER', 'MANAGING_DIRECTOR', 'CLIENT'],
        campaigns:    ['ADMIN', 'CAMPAIGN_MANAGER', 'MARKETING_MANAGER', 'MANAGING_DIRECTOR', 'CLIENT'],
        tasks:        ['ADMIN', 'TASK_MANAGER', 'CREATIVE_TEAM_LEAD', 'CREATIVE_STAFF', 'MANAGING_DIRECTOR'],
        assets:       ['ADMIN', 'ASSET_MANAGER', 'CREATIVE_STAFF', 'CREATIVE_TEAM_LEAD', 'MANAGING_DIRECTOR'],
        feedback:     ['ADMIN', 'CLIENT', 'MANAGING_DIRECTOR', 'CREATIVE_STAFF', 'CREATIVE_TEAM_LEAD'],
        invoices:     ['ADMIN', 'FINANCE_MANAGER', 'FINANCE_EXECUTIVE', 'MANAGING_DIRECTOR', 'CLIENT'],
        users:        ['ADMIN', 'MANAGING_DIRECTOR'],
        dashboard:    ['ADMIN', 'APPOINTMENT_MANAGER', 'CAMPAIGN_MANAGER', 'TASK_MANAGER', 'ASSET_MANAGER',
                       'FINANCE_MANAGER', 'CLIENT_RELATIONS_OFFICER', 'MARKETING_MANAGER',
                       'CREATIVE_TEAM_LEAD', 'CREATIVE_STAFF', 'FINANCE_EXECUTIVE', 'MANAGING_DIRECTOR', 'CLIENT'],
        'user-profile': ['*'] // all authenticated users
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser() {
        try { return JSON.parse(localStorage.getItem('adflow_user')); }
        catch { return null; }
    },

    /**
     * Get current user's role string
     */
    getCurrentRole() {
        const u = this.getCurrentUser();
        return u?.role || u?.authorities?.[0]?.authority || null;
    },

    /**
     * Check if the current user has a specific role
     */
    hasRole(role) {
        const current = this.getCurrentRole();
        return current === role;
    },

    /**
     * Check if the current user is admin
     */
    isAdmin() {
        const role = this.getCurrentRole();
        return role === 'ADMIN' || role === 'MANAGING_DIRECTOR';
    },

    /**
     * Check if the current user is a client
     */
    isClient() {
        return this.getCurrentRole() === 'CLIENT';
    },

    /**
     * Check if the current user is a staff member (not client)
     */
    isStaff() {
        return !this.isClient() && !!this.getCurrentUser();
    },

    /**
     * Check if the current user can access a module
     */
    canAccess(module) {
        const allowed = this.MODULE_ACCESS[module];
        if (!allowed) return false;
        if (allowed.includes('*')) return true;
        const role = this.getCurrentRole();
        return role && (allowed.includes(role) || this.isAdmin());
    },

    /**
     * Guard: redirect to login if not authenticated
     */
    requireAuth() {
        const user = this.getCurrentUser();
        const token = localStorage.getItem('adflow_jwt_token');
        if (!user || !token) {
            window.location.href = '/static/pages/auth/login.html';
            return false;
        }
        return true;
    },

    /**
     * Guard: redirect to dashboard if not authorized for module
     */
    requireModule(module) {
        if (!this.requireAuth()) return false;
        if (!this.canAccess(module)) {
            window.location.href = '/static/pages/dashboard/dashboard.html';
            return false;
        }
        return true;
    },

    /**
     * Get visible sidebar nav items for current user's role
     */
    getVisibleNavItems() {
        const role = this.getCurrentRole();
        if (!role) return [];

        const all = [
            { id: 'dashboard',    label: 'Dashboard',        icon: '📊', href: '/static/pages/dashboard/dashboard.html',  module: 'dashboard' },
            { id: 'appointments', label: 'Appointments',     icon: '📅', href: '/static/pages/appointments/appointments.html', module: 'appointments' },
            { id: 'campaigns',    label: 'Campaigns',        icon: '📢', href: '/static/pages/campaigns/campaigns.html',   module: 'campaigns' },
            { id: 'tasks',        label: 'Tasks & Workflow', icon: '📋', href: '/static/pages/tasks/tasks.html',           module: 'tasks' },
            { id: 'assets',       label: 'Creative Assets',  icon: '🖼️', href: '/static/pages/assets/assets.html',         module: 'assets' },
            { id: 'feedback',     label: 'Client Feedback',  icon: '💬', href: '/static/pages/feedback/feedback.html',     module: 'feedback' },
            { id: 'invoices',     label: 'Invoices & Billing',icon: '💳',href: '/static/pages/invoices/invoices.html',     module: 'invoices' },
            { id: 'users',        label: 'Staff Accounts',   icon: '🛡️', href: '/static/pages/users/users.html',           module: 'users' },
            { id: 'user-profile', label: 'My Profile',       icon: '👤', href: '/static/pages/users/user-profile.html',   module: 'user-profile' }
        ];

        return all.filter(item => this.canAccess(item.module));
    }
};

window.PermissionUtils = PermissionUtils;
