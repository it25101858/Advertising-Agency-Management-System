/* ============================================================================
   AdFlow - Dashboard Controller
   ============================================================================ */

(function () {
    const MOCK_STATS = {
        appointments: 12, campaigns: 5, tasks: 24, assets: 38, feedback: 9, invoices: 7
    };

    const MODULES = [
        { id: 'appointments', label: 'Appointments',     icon: '📅', href: '../appointments/appointments.html', role: 'appointments', color: 'blue' },
        { id: 'campaigns',    label: 'Campaigns',        icon: '📢', href: '../campaigns/campaigns.html',       role: 'campaigns', color: 'purple' },
        { id: 'tasks',        label: 'Tasks & Workflow', icon: '📋', href: '../tasks/tasks.html',               role: 'tasks', color: 'amber' },
        { id: 'assets',       label: 'Creative Assets',  icon: '🖼️', href: '../assets/assets.html',             role: 'assets', color: 'green' },
        { id: 'feedback',     label: 'Client Feedback',  icon: '💬', href: '../feedback/feedback.html',         role: 'feedback', color: 'cyan' },
        { id: 'invoices',     label: 'Invoices & Billing',icon: '💳',href: '../invoices/invoices.html',         role: 'invoices', color: 'red' }
    ];

    const ACTIVITY = [
        { dot: 'green',  title: 'Appointment #102 Confirmed',   desc: 'Kasun Perera — Avurudu Creative Review',          time: '2 min ago' },
        { dot: 'blue',   title: '5G Mega Launch campaign updated', desc: 'Budget increased to LKR 2,500,000',             time: '15 min ago' },
        { dot: 'amber',  title: 'Task: 3D Billboard Design',    desc: 'Status changed → IN REVIEW',                      time: '1 hr ago' },
        { dot: 'purple', title: 'Invoice INV-2026-002 sent',    desc: 'Dialog Axiata PLC — LKR 540,000',                  time: '3 hrs ago' },
        { dot: 'green',  title: 'New feedback submitted',       desc: 'Kasun Perera rated campaign 4/5 ⭐',               time: '5 hrs ago' },
        { dot: 'red',    title: 'Asset upload pending review',  desc: 'Navodi V.G.C — 5G_LotusTower_v1_Render.mp4',      time: 'Yesterday' }
    ];

    document.addEventListener('DOMContentLoaded', async () => {
        if (!PermissionUtils.requireAuth()) return;

        const user = StorageUtils.getUser();
        const role = user?.role || '';
        const name = user?.fullName || user?.name || 'User';

        // Render shared layout
        Navbar.render({ activePage: 'dashboard' });
        Navbar.init();
        Sidebar.render('dashboard');
        Modal.init();

        renderWelcome(name, role);
        renderQuickActions(role);
        renderStats(MOCK_STATS); // immediately show with mock data

        // Try to load real stats
        try {
            const realStats = await DashboardApi.getStats();
            renderStats({ ...MOCK_STATS, ...Object.fromEntries(Object.entries(realStats).filter(([,v]) => v !== null)) });
        } catch {}

        renderModuleGrid(role);
        renderActivity();
    });

    function renderWelcome(name, role) {
        const el = document.getElementById('welcomeSection');
        if (!el) return;
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
        const roleLabel = FormatUtils.humanize(role);
        const today = DateUtils.format(new Date().toISOString().split('T')[0]);

        el.innerHTML = `
        <div class="dashboard-welcome">
            <div class="welcome-content">
                <div class="welcome-greeting">🌟 ${greeting}</div>
                <div class="welcome-title">Welcome back, ${name}!</div>
                <div class="welcome-subtitle">Here's what's happening at BrightWave today.</div>
                <div class="welcome-meta">
                    <div class="welcome-meta-item">👤 ${roleLabel}</div>
                    <div class="welcome-meta-item">📅 ${today}</div>
                    <div class="welcome-meta-item">🟢 System Online</div>
                </div>
            </div>
        </div>`;
    }

    function renderStats(stats) {
        const el = document.getElementById('statsGrid');
        if (!el) return;
        const items = [
            { icon: '📅', label: 'Appointments', value: stats.appointments ?? '—', color: 'blue',   module: 'appointments' },
            { icon: '📢', label: 'Campaigns',    value: stats.campaigns    ?? '—', color: 'purple', module: 'campaigns' },
            { icon: '📋', label: 'Active Tasks',  value: stats.tasks       ?? '—', color: 'amber',  module: 'tasks' },
            { icon: '🖼️', label: 'Creative Assets', value: stats.assets    ?? '—', color: 'green',  module: 'assets' },
            { icon: '💬', label: 'Feedback',     value: stats.feedback     ?? '—', color: 'cyan',   module: 'feedback' },
            { icon: '💳', label: 'Invoices',     value: stats.invoices     ?? '—', color: 'red',    module: 'invoices' }
        ];

        el.innerHTML = items.filter(i => PermissionUtils.canAccess(i.module)).map(i => `
        <div class="stat-card ${i.color}" style="cursor:pointer"
             onclick="window.location.href='../${i.module}/${i.module}.html'">
            <div class="stat-icon">${i.icon}</div>
            <div class="stat-title">${i.label}</div>
            <div class="stat-value">${i.value}</div>
            <div class="stat-desc">Click to manage →</div>
        </div>`).join('');
    }

    function renderQuickActions(role) {
        const el = document.getElementById('quickActions');
        if (!el) return;
        const actions = MODULES.filter(m => PermissionUtils.canAccess(m.role)).slice(0, 5);

        el.innerHTML = `<div class="quick-actions">` +
            actions.map(a => `
            <a href="${a.href}" class="quick-action-btn">
                <div class="quick-action-icon">${a.icon}</div>
                <div>
                    <div style="font-weight:700">${a.label}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted)">Manage →</div>
                </div>
            </a>`).join('') +
        `</div>`;
    }

    function renderModuleGrid(role) {
        const el = document.getElementById('moduleGrid');
        if (!el) return;
        const visible = MODULES.filter(m => PermissionUtils.canAccess(m.role));

        el.innerHTML = visible.map(m => `
        <a href="${m.href}" class="module-card-link">
            <div class="module-card-icon">${m.icon}</div>
            <div class="module-card-info">
                <div class="module-card-title">${m.label}</div>
                <div class="module-card-desc">View & manage ${m.label.toLowerCase()}</div>
            </div>
            <span style="color:var(--text-muted);font-size:1.2rem">›</span>
        </a>`).join('');
    }

    function renderActivity() {
        const el = document.getElementById('activityFeed');
        if (!el) return;
        el.innerHTML = ACTIVITY.map(a => `
        <div class="activity-item">
            <div class="activity-dot ${a.dot}"></div>
            <div class="activity-content">
                <div class="activity-title">${a.title}</div>
                <div class="activity-desc">${a.desc}</div>
            </div>
            <div class="activity-time">${a.time}</div>
        </div>`).join('');
    }
})();
