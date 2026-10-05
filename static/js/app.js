/* ============================================================================
   AdFlow - Application Core Script
   Supports Live CRUD, Role Switching, and 6 Major Functions
   Group: Y2-S1-MLB-B4G1-03
   ============================================================================ */

// In-Memory Live State (Mirrors Database Schema)
const store = {
    isLoggedIn: false, // Default false: visitors see full public agency landing page
    currentRole: 'CLIENT_RELATIONS_OFFICER',
    activeModule: 'home',
    
    users: [
        { id: 1, name: 'Kasun Perera', role: 'CLIENT', company: 'Dialog Axiata PLC' },
        { id: 2, name: 'Rathnayaka R.M.H.R', role: 'CLIENT_RELATIONS_OFFICER', company: 'BrightWave' },
        { id: 3, name: 'Mendiya J.L.P.S', role: 'MARKETING_MANAGER', company: 'BrightWave' },
        { id: 4, name: 'Wickramanayaka A.W.H.D', role: 'CREATIVE_TEAM_LEAD', company: 'BrightWave' },
        { id: 5, name: 'Navodi V.G.C', role: 'CREATIVE_STAFF', company: 'BrightWave' },
        { id: 6, name: 'Yashika J.', role: 'CREATIVE_STAFF', company: 'BrightWave' },
        { id: 7, name: 'Gamage M.I.I.K', role: 'FINANCE_EXECUTIVE', company: 'BrightWave' },
        { id: 8, name: 'Dilshan Silva', role: 'MANAGING_DIRECTOR', company: 'BrightWave' }
    ],

    appointments: [
        { id: 1, client: 'Kasun Perera', createdByEmail: 'client@dialog.lk', staff: 'Rathnayaka R.M.H.R', campaign: '5G Mega Launch 2026', date: '2026-03-05', time: '10:00 AM', purpose: 'Initial 5G Campaign Briefing', type: 'VIRTUAL_CALL', status: 'COMPLETED', notes: 'Client agreed on commercial timeline.' },
        { id: 2, client: 'Kasun Perera', createdByEmail: 'client@dialog.lk', staff: 'Rathnayaka R.M.H.R', campaign: 'Avurudu Festive Promo', date: '2026-03-12', time: '02:30 PM', purpose: 'Artwork Approval Session', type: 'IN_PERSON', status: 'SCHEDULED', notes: 'Meeting at Boardroom HQ.' }
    ],

    campaigns: [
        { id: 1, title: '5G Mega Launch 2026', client: 'Dialog Axiata PLC', manager: 'Mendiya J.L.P.S', assignedCreativeStaff: 'Navodi V.G.C (Creative Staff - Lead Visual Designer)', creativeDeliverables: '3D Anamorphic Billboard LED Video (4K) & Key Visual Poster set', creativeDeadline: '2026-03-20', creativeNotes: 'Integrate glowing electric blue speed lines (#2563EB) and 4K Lotus Tower animations.', budget: 2500000, spent: 1200000, start: '2026-03-01', end: '2026-06-30', status: 'ACTIVE', approvalStatus: 'APPROVED', clientAccess: 'AVAILABLE', requestSource: 'AGENCY', brief: 'Focus on ultra-fast speeds and nationwide 3D billboards.' },
        { id: 2, title: 'Avurudu Festive Promo', client: 'Dialog Axiata PLC', manager: 'Mendiya J.L.P.S', assignedCreativeStaff: 'Navodi V.G.C (Creative Staff - Lead Visual Designer)', creativeDeliverables: 'Festive Social Media Carousel Banner sets & Promo Badges', creativeDeadline: '2026-04-05', creativeNotes: 'Use warm traditional festive colors with contemporary typography.', budget: 1500000, spent: 300000, start: '2026-03-15', end: '2026-04-20', status: 'UPCOMING', approvalStatus: 'APPROVED', clientAccess: 'AVAILABLE', requestSource: 'AGENCY', brief: 'Seasonal reload cashbacks and device discounts.' }
    ],

    taskViewMode: 'kanban', // 'kanban' or 'list'
    taskFilterStatus: 'ALL',
    taskFilterPriority: 'ALL',

    tasks: [
        {
            id: 101,
            title: '3D Lotus Tower Anamorphic Billboard Design',
            description: 'Render high-definition 4K 3D anamorphic LED billboard video for the Colombo Lotus Tower intersection. Integrate glowing 5G speed waves.',
            campaign: '5G Mega Launch 2026',
            campaignId: 1,
            assignee: 'Navodi V.G.C',
            assigneeEmail: 'navodi@brightwave.lk',
            creator: 'Wickramanayaka A.W.H.D',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            deadline: '2026-03-10',
            attachedFiles: ['5G_Campaign_Brief_v1.pdf', 'Dialog_Brand_Guidelines_2026.pdf'],
            uploadedWork: '5G_LotusTower_v1_Render.mp4',
            comments: [
                { author: 'Wickramanayaka A.W.H.D', text: 'Please ensure electric blue color matches Dialog Axiata HEX #2563EB.', time: '2026-03-01 09:30 AM' },
                { author: 'Navodi V.G.C', text: '3D viewport model drafted. Working on lighting textures now.', time: '2026-03-02 02:15 PM' }
            ],
            createdAt: '2026-03-01'
        },
        {
            id: 102,
            title: 'Radio Commercial Copywriting (Sinhala & English)',
            description: 'Write 30-second radio script jingle focusing on nationwide 5G coverage and instant activation promo code.',
            campaign: '5G Mega Launch 2026',
            campaignId: 1,
            assignee: 'Yashika J.',
            assigneeEmail: 'yashika@brightwave.lk',
            creator: 'Wickramanayaka A.W.H.D',
            priority: 'MEDIUM',
            status: 'IN_REVIEW',
            deadline: '2026-03-08',
            attachedFiles: ['Radio_Ad_Format_Specs.pdf'],
            uploadedWork: '5G_Radio_Script_v2.docx',
            comments: [
                { author: 'Yashika J.', text: 'Script submitted for Creative Lead approval. Audio reference attached.', time: '2026-03-03 11:00 AM' }
            ],
            createdAt: '2026-03-01'
        },
        {
            id: 103,
            title: 'Avurudu Festive Promo Banner Set',
            description: 'Design 6 digital banner sizes (Web Leaderboard, Instagram Square, Facebook Carousel) for seasonal festive discounts.',
            campaign: 'Avurudu Festive Promo',
            campaignId: 2,
            assignee: 'Navodi V.G.C',
            assigneeEmail: 'navodi@brightwave.lk',
            creator: 'Mendiya J.L.P.S',
            priority: 'HIGH',
            status: 'NEEDS_REVISION',
            deadline: '2026-03-12',
            attachedFiles: ['Festive_Key_Visuals.png'],
            uploadedWork: 'Avurudu_Banners_Draft1.zip',
            comments: [
                { author: 'Mendiya J.L.P.S', text: 'Please adjust font size on discount percentage (25% OFF) so it is bolder on mobile.', time: '2026-03-04 05:20 PM' }
            ],
            createdAt: '2026-03-02'
        },
        {
            id: 104,
            title: 'Social Media Video Teaser 15s',
            description: 'Produce 15-second teaser clip for TikTok and YouTube Shorts featuring celebrity brand ambassador.',
            campaign: '5G Mega Launch 2026',
            campaignId: 1,
            assignee: 'Yashika J.',
            assigneeEmail: 'yashika@brightwave.lk',
            creator: 'Wickramanayaka A.W.H.D',
            priority: 'LOW',
            status: 'COMPLETED',
            deadline: '2026-03-05',
            attachedFiles: ['Teaser_Storyboard.pdf'],
            uploadedWork: '5G_Teaser_Final_Approved.mp4',
            comments: [
                { author: 'Wickramanayaka A.W.H.D', text: 'Approved by Managing Director! Excellent pacing.', time: '2026-03-05 03:45 PM' }
            ],
            createdAt: '2026-02-28'
        }
    ],

    feedback: [
        { id: 1, campaign: '5G Mega Launch 2026', item: 'Radio Script 5G v2', client: 'Kasun Perera', rating: 5, comments: 'Radio script tagline is very catchy! Minor tweak requested for tone.', status: 'RESOLVED', createdByEmail: 'client@dialog.lk', createdAt: '2026-03-02 11:30' },
        { id: 2, campaign: '5G Mega Launch 2026', item: '5G Lotus Tower Mockup', client: 'Kasun Perera', rating: 4, comments: 'Color palette looks modern, please enlarge 5G speed badge.', status: 'SUBMITTED', createdByEmail: 'client@dialog.lk', createdAt: '2026-03-05 14:15' },
        { id: 3, campaign: 'Avurudu Festive Promo', item: 'Seasonal Key Visual', client: 'Nimal Fernando', rating: 5, comments: 'The revised key visual is clear, festive and on-brand. Happy with the direction.', status: 'APPROVED', createdByEmail: 'nimal@example.com', createdAt: '2026-03-08 09:45' }
    ],

    assets: [
        { id: 1, campaign: '5G Mega Launch 2026', uploader: 'Navodi V.G.C', name: '5G_LotusTower_Mockup_v1.png', title: 'Lotus Tower 5G Billboard Mockup', type: 'IMAGE', category: 'IMAGE', tags: '5G, Billboard, 3D', description: 'Primary 3D outdoor billboard concept for the 5G launch campaign.', usageChannel: 'OUTDOOR', rights: 'CAMPAIGN_USE', rightsExpiry: '2026-06-30', version: 'v1.0', versionNotes: 'Initial client-review render.', status: 'PENDING', createdAt: '2026-03-03', versions: [{version:'v1.0', date:'2026-03-03', by:'Navodi V.G.C', notes:'Initial client-review render.'}], audit: ['2026-03-03 — Uploaded by Navodi V.G.C'] },
        { id: 2, campaign: '5G Mega Launch 2026', uploader: 'Yashika J.', name: 'Radio_Script_5G_v2.docx', title: '5G Radio Commercial Script', type: 'DOCUMENT', category: 'COPYWRITING', tags: 'Radio, Jingle, Sinhala', description: 'Thirty-second Sinhala/English radio commercial script for nationwide 5G awareness.', usageChannel: 'RADIO', rights: 'ALL_APPROVED_CHANNELS', rightsExpiry: '', version: 'v2.0', versionNotes: 'Tone and CTA revised after client feedback.', status: 'APPROVED', createdAt: '2026-03-04', versions: [{version:'v1.0', date:'2026-03-02', by:'Yashika J.', notes:'First draft.'},{version:'v2.0', date:'2026-03-04', by:'Yashika J.', notes:'Tone and CTA revised after client feedback.'}], audit: ['2026-03-02 — v1.0 uploaded','2026-03-04 — v2.0 uploaded','2026-03-05 — Approved'] }
    ],

    invoices: [
        { id: 1, number: 'INV-2026-001', campaign: '5G Mega Launch 2026', client: 'Dialog Axiata PLC', issueDate: '2026-03-01', dueDate: '2026-03-31', subtotal: 1000000, tax: 80000, total: 1080000, status: 'PAID' },
        { id: 2, number: 'INV-2026-002', campaign: '5G Mega Launch 2026', client: 'Dialog Axiata PLC', issueDate: '2026-03-10', dueDate: '2026-04-10', subtotal: 500000, tax: 40000, total: 540000, status: 'SENT' }
    ],

    notifications: [
        { id: 1, title: 'Task Review Needed', message: 'Radio Script 5G v2 submitted for review by Yashika J.', time: '10 mins ago', icon: '🔍', read: false },
        { id: 2, title: 'Appointment Rescheduled', message: 'Client Consultation rescheduled to 2026-03-20 at 10:00 AM.', time: '1 hour ago', icon: '📅', read: false },
        { id: 3, title: 'Campaign Budget Approved', message: '5G Mega Launch 2026 budget approved by Finance Executive.', time: '2 hours ago', icon: '💳', read: false },
        { id: 4, title: 'Creative Brief Uploaded', message: 'New 3D Billboard brief uploaded to Media Center.', time: 'Yesterday', icon: '📁', read: true }
    ]
};

function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Notification Bell Header Controls
function toggleNotificationDropdown() {
    const popup = document.getElementById('notifDropdownPopup');
    if (!popup) return;
    const isHidden = popup.style.display === 'none' || !popup.style.display;
    popup.style.display = isHidden ? 'block' : 'none';
    if (isHidden) renderNotificationsDropdown();
}

function renderNotificationsDropdown() {
    const listEl = document.getElementById('notifDropdownList');
    const badgeEl = document.getElementById('notifBadgeCount');

    if (!store.notifications) return;
    const unreadCount = store.notifications.filter(n => !n.read).length;

    if (badgeEl) {
        badgeEl.innerText = unreadCount;
        badgeEl.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    if (listEl) {
        if (store.notifications.length === 0) {
            listEl.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-secondary); font-size:0.85rem;">No new notifications</div>`;
        } else {
            listEl.innerHTML = store.notifications.map(n => `
                <div class="notif-item-row ${!n.read ? 'unread' : ''}">
                    <div class="notif-icon">${n.icon || '🔔'}</div>
                    <div class="notif-content">
                        <h6>${n.title}</h6>
                        <p>${n.message}</p>
                        <div class="notif-time">${n.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }
}

function markAllNotificationsRead() {
    if (store.notifications) {
        store.notifications.forEach(n => n.read = true);
        renderNotificationsDropdown();
    }
}

function addNotification(title, message, icon = '🔔') {
    if (!store.notifications) store.notifications = [];
    store.notifications.unshift({
        id: Date.now(),
        title: title,
        message: message,
        time: 'Just now',
        icon: icon,
        read: false
    });
    renderNotificationsDropdown();
}

// Initialize Application & Browser Back/Forward History Support
function saveCurrentUserToStorage() {
    try {
        if (store.currentUser) {
            sessionStorage.setItem('adflow_current_user', JSON.stringify(store.currentUser));
        } else {
            sessionStorage.removeItem('adflow_current_user');
        }
    } catch (e) {
        console.error('Error saving current user to storage', e);
    }
}

function loadCurrentUserFromStorage() {
    try {
        const saved = sessionStorage.getItem('adflow_current_user');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.email) {
                store.currentUser = parsed;
                store.currentRole = parsed.role || 'CLIENT';
                store.isLoggedIn = true;
                return;
            }
        }
        store.currentUser = null;
        store.isLoggedIn = false;
    } catch (e) {
        console.error('Error loading current user from storage', e);
        store.currentUser = null;
        store.isLoggedIn = false;
    }
}

// Pre-registered Users Database & Persistent Storage Support
const defaultUsers = [
    { id: 1, name: 'Kasun Perera', email: 'client@dialog.lk', password: 'password123', role: 'CLIENT', company: 'Dialog Axiata PLC' },
    { id: 2, name: 'Rathnayaka R.M.H.R', email: 'appointments@brightwave.lk', password: 'Appoint@123', role: 'CLIENT_RELATIONS_OFFICER', company: 'BrightWave HQ' },
    { id: 3, name: 'Mendiya J.L.P.S', email: 'campaigns@brightwave.lk', password: 'Campaign@123', role: 'MARKETING_MANAGER', company: 'BrightWave HQ' },
    { id: 4, name: 'Wickramanayaka A.W.H.D', email: 'projects@brightwave.lk', password: 'Project@123', role: 'CREATIVE_TEAM_LEAD', company: 'BrightWave HQ' },
    { id: 5, name: 'Navodi V.G.C', email: 'assets@brightwave.lk', password: 'Assets@123', role: 'CREATIVE_STAFF', company: 'BrightWave HQ' },
    { id: 6, name: 'Yashika J.', email: 'feedback@brightwave.lk', password: 'password123', role: 'CREATIVE_STAFF', company: 'BrightWave HQ' },
    { id: 7, name: 'Gamage M.I.I.K', email: 'billing@brightwave.lk', password: 'Billing@123', role: 'FINANCE_EXECUTIVE', company: 'BrightWave HQ' },
    { id: 8, name: 'Dilshan Silva', email: 'md@brightwave.lk', password: 'password123', role: 'MANAGING_DIRECTOR', company: 'BrightWave HQ' },
    { id: 9, name: 'System Administrator', email: 'admin@brightwave.lk', password: 'Admin@123', role: 'SYSTEM_ADMIN', company: 'BrightWave HQ' },
    { id: 99, name: 'System Administrator', email: 'admin@gmail.com', password: 'Admin@123', role: 'SYSTEM_ADMIN', company: 'BrightWave HQ' },
    { id: 98, name: 'Kasun Perera', email: 'client@gmail.com', password: 'password123', role: 'CLIENT', company: 'Dialog Axiata PLC' }
];

// Initialize Application & Browser Back/Forward History Support
document.addEventListener('DOMContentLoaded', () => {
    loadUsersFromStorage();
    loadWorkflowDataFromStorage();
    loadCurrentUserFromStorage();

    const validModules = ['home', 'appointments', 'campaigns', 'tasks', 'feedback', 'assets', 'finance', 'admin-users', 'profile'];
    let targetModule = 'home';

    if (store.isLoggedIn && store.currentUser) {
        let candidate = '';
        if (window.location.hash) {
            const hModule = window.location.hash.replace('#', '');
            if (validModules.includes(hModule)) {
                candidate = hModule;
            }
        }
        if (!candidate || candidate === 'home') {
            try {
                const savedModule = sessionStorage.getItem('adflow_active_module');
                if (savedModule && validModules.includes(savedModule)) {
                    candidate = savedModule;
                }
            } catch (e) {}
        }
        if (!candidate || candidate === 'home') {
            candidate = getDefaultModuleForRole(store.currentRole);
        }

        // Verify role access permission
        if (canRoleAccessModule(store.currentRole, candidate)) {
            targetModule = candidate;
        } else {
            targetModule = getDefaultModuleForRole(store.currentRole);
        }
    } else {
        targetModule = 'home';
    }

    store.activeModule = targetModule;

    // Browser Back & Forward (Popstate) Event Listener
    window.addEventListener('popstate', (e) => {
        let popModule = 'home';
        if (e.state && e.state.module) {
            popModule = e.state.module;
        } else if (window.location.hash) {
            popModule = window.location.hash.replace('#', '');
        }
        showModule(popModule, false);
    });

    try {
        history.replaceState({ module: targetModule }, '', `#${targetModule}`);
    } catch (err) {
        // Fallback for isolated file:// environments if history API throws
    }

    showModule(targetModule, false);
    renderNotificationsDropdown();
});

function saveUsersToStorage() {
    try {
        sessionStorage.setItem('adflow_registered_users', JSON.stringify(store.users));
    } catch (e) {
        console.error('Error saving users to storage', e);
    }
}

function saveWorkflowDataToStorage() {
    try {
        const data = {
            appointments: store.appointments,
            campaigns: store.campaigns,
            tasks: store.tasks,
            feedback: store.feedback,
            assets: store.assets,
            invoices: store.invoices,
            notifications: store.notifications
        };
        sessionStorage.setItem('adflow_workflow_data', JSON.stringify(data));
    } catch (e) {
        console.error('Error saving workflow data to storage', e);
    }
}

function loadWorkflowDataFromStorage() {
    try {
        const saved = sessionStorage.getItem('adflow_workflow_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed) {
                if (Array.isArray(parsed.appointments) && parsed.appointments.length > 0) store.appointments = parsed.appointments;
                if (Array.isArray(parsed.campaigns) && parsed.campaigns.length > 0) store.campaigns = parsed.campaigns;
                if (Array.isArray(parsed.tasks) && parsed.tasks.length > 0) store.tasks = parsed.tasks;
                if (Array.isArray(parsed.feedback) && parsed.feedback.length > 0) store.feedback = parsed.feedback;
                if (Array.isArray(parsed.assets) && parsed.assets.length > 0) store.assets = parsed.assets;
                if (Array.isArray(parsed.invoices) && parsed.invoices.length > 0) store.invoices = parsed.invoices;
                if (Array.isArray(parsed.notifications) && parsed.notifications.length > 0) store.notifications = parsed.notifications;
            }
        }
    } catch (e) {
        console.error('Error loading workflow data from storage', e);
    }
}

async function syncWithBackendDatabase() {
    if (!window.AdFlowAPI) return;
    try {
        // 1. Synchronize Users from DB
        const dbUsers = await window.AdFlowAPI.getUsers();
        if (Array.isArray(dbUsers) && dbUsers.length > 0) {
            const userMap = new Map();
            const existingUsersByEmail = new Map();
            (store.users || []).forEach(existing => {
                if (existing && existing.email) {
                    existingUsersByEmail.set(existing.email.toLowerCase(), existing);
                }
            });

            dbUsers.forEach(u => {
                const existing = existingUsersByEmail.get(u.email.toLowerCase());
                userMap.set(u.email.toLowerCase(), {
                    id: u.id || u.userId,
                    name: u.fullName || u.name,
                    email: u.email,
                    password: (existing && existing.password) ? existing.password : (u.password || 'password123'),
                    role: u.role,
                    company: u.companyName || u.company || 'BrightWave HQ'
                });
            });
            defaultUsers.forEach(u => {
                if (u && u.email && !userMap.has(u.email.toLowerCase())) {
                    userMap.set(u.email.toLowerCase(), u);
                }
            });
            store.users = Array.from(userMap.values());
            saveUsersToStorage();
        }

        // 2. Synchronize Appointments from DB
        const dbAppts = await window.AdFlowAPI.getAppointments();
        if (Array.isArray(dbAppts) && dbAppts.length > 0) {
            const dbIds = new Set();
            const mappedAppts = dbAppts.map(a => {
                const dbId = a.id || a.appointmentId;
                dbIds.add(dbId);
                const existing = (store.appointments || []).find(x => x.id === dbId);
                // Format time: "09:30:00" or "09:30" → "09:30 AM" style
                let displayTime = a.meetingTime || a.time || (existing ? existing.time : '09:00 AM');
                if (typeof displayTime === 'string' && displayTime.match(/^\d{2}:\d{2}/)) {
                    const parts = displayTime.split(':');
                    const h = parseInt(parts[0], 10);
                    const m = parts[1];
                    const period = h >= 12 ? 'PM' : 'AM';
                    const h12 = h % 12 === 0 ? 12 : h % 12;
                    displayTime = `${String(h12).padStart(2,'0')}:${m} ${period}`;
                }
                return {
                    id: dbId,
                    client: a.clientName || a.client || (existing ? existing.client : 'Client'),
                    createdByEmail: a.clientEmail || (existing ? existing.createdByEmail : ''),
                    staff: a.staffName || a.staff || (existing ? existing.staff : 'Agency Staff'),
                    staffId: a.assignedStaffId || (existing ? existing.staffId : null),
                    campaign: a.campaignName || a.campaign || (existing ? existing.campaign : 'General Consultation'),
                    date: a.meetingDate || a.date || (existing ? existing.date : ''),
                    time: displayTime,
                    purpose: a.purpose || (existing ? existing.purpose : 'Client Meeting'),
                    type: a.meetingType || a.type || (existing ? existing.type : 'VIRTUAL_CALL'),
                    status: a.status || (existing ? existing.status : 'SCHEDULED'),
                    notes: a.notes || (existing ? existing.notes : '')
                };
            });
            // Keep any sessionStorage-only appointments (id not in DB yet — pending sync)
            const localOnly = (store.appointments || []).filter(x => !dbIds.has(x.id));
            store.appointments = [...mappedAppts, ...localOnly];
            saveWorkflowDataToStorage();
        }

        // 3. Synchronize Campaigns from DB
        const dbCamps = await window.AdFlowAPI.getCampaigns();
        if (Array.isArray(dbCamps) && dbCamps.length > 0) {
            const mappedCamps = dbCamps.map(c => {
                const existing = (store.campaigns || []).find(x => x.id === (c.id || c.campaignId) || (x.title && c.campaignName && x.title.toLowerCase() === c.campaignName.toLowerCase()));
                return {
                    id: c.id || c.campaignId,
                    title: c.campaignName || c.name || c.title,
                    client: c.clientName || c.client || (existing ? existing.client : 'Client'),
                    clientEmail: c.clientEmail || (existing ? existing.clientEmail : ''),
                    manager: c.managerName || c.manager || (existing ? existing.manager : 'Campaign Manager'),
                    assignedCreativeStaff: existing ? existing.assignedCreativeStaff : null,
                    creativeDeliverables: existing ? existing.creativeDeliverables : null,
                    creativeDeadline: existing ? existing.creativeDeadline : null,
                    creativeNotes: existing ? existing.creativeNotes : null,
                    creativeStatus: existing ? existing.creativeStatus : null,
                    deliveryNotes: existing ? existing.deliveryNotes : null,
                    budget: c.budget || (existing ? existing.budget : 100000),
                    spent: c.spent || (existing ? existing.spent : 0),
                    start: c.startDate || c.start,
                    end: c.endDate || c.end,
                    status: c.status || (existing ? existing.status : 'ACTIVE'),
                    approvalStatus: existing ? existing.approvalStatus : (c.status === 'PLANNING' || c.status === 'UPCOMING' || c.status === 'IN_PROGRESS' || c.status === 'ACTIVE' ? 'APPROVED' : 'PENDING'),
                    clientAccess: existing ? existing.clientAccess : 'AVAILABLE',
                    brief: c.creativeBrief || c.objective || (existing ? existing.brief : '')
                };
            });
            store.campaigns = mappedCamps;
            saveWorkflowDataToStorage();
        }

        // 4. Synchronize Tasks from DB
        const dbTasks = await window.AdFlowAPI.getTasks();
        if (Array.isArray(dbTasks) && dbTasks.length > 0) {
            const mappedTasks = dbTasks.map(t => {
                const existing = (store.tasks || []).find(x => x.id === (t.id || t.taskId));
                return {
                    id: t.id || t.taskId,
                    title: t.title || t.taskTitle,
                    description: t.description || t.desc || (existing ? existing.description : ''),
                    campaign: t.campaignName || t.campaign || (existing ? existing.campaign : 'Campaign Project'),
                    campaignId: t.campaignId || (existing ? existing.campaignId : 1),
                    assignee: t.assignedToName || t.assignee || (existing ? existing.assignee : 'Creative Staff'),
                    assigneeEmail: t.assignedToEmail || (existing ? existing.assigneeEmail : 'navodi@brightwave.lk'),
                    creator: t.createdByName || t.creator || (existing ? existing.creator : 'Task Lead'),
                    priority: t.priority || (existing ? existing.priority : 'MEDIUM'),
                    status: t.status === 'TODO' ? 'TO_DO' : (t.status || (existing ? existing.status : 'TO_DO')),
                    deadline: t.deadline || (existing ? existing.deadline : ''),
                    attachedFiles: existing ? existing.attachedFiles : ['Creative_Brief_Standard.pdf'],
                    uploadedWork: existing ? existing.uploadedWork : '',
                    comments: existing ? existing.comments : [],
                    createdAt: t.createdAt ? (typeof t.createdAt === 'string' ? t.createdAt.substring(0, 10) : t.createdAt) : new Date().toISOString().substring(0, 10)
                };
            });
            store.tasks = mappedTasks;
            saveWorkflowDataToStorage();
        }

        // 5. Synchronize Assets from DB
        const dbAssets = await window.AdFlowAPI.getAssets();
        if (Array.isArray(dbAssets) && dbAssets.length > 0) {
            const mappedAssets = dbAssets.map(a => {
                const existing = (store.assets || []).find(x => x.id === (a.id || a.assetId));
                return {
                    id: a.id || a.assetId,
                    campaign: a.campaignName || a.campaign || (existing ? existing.campaign : 'Agency Library'),
                    uploader: a.uploaderName || a.uploader || (existing ? existing.uploader : 'Creative Staff'),
                    name: a.fileName || a.name || 'Creative_Asset.png',
                    title: a.fileName || a.title || (existing ? existing.title : 'Creative Asset'),
                    type: a.fileType || a.type || 'IMAGE',
                    category: a.category || 'IMAGE',
                    tags: a.tags || 'Creative, Design',
                    description: existing ? existing.description : 'Creative campaign asset deliverable.',
                    usageChannel: existing ? existing.usageChannel : 'ALL_CHANNELS',
                    rights: existing ? existing.rights : 'CAMPAIGN_USE',
                    version: a.version || 'v1.0',
                    versionNotes: existing ? existing.versionNotes : 'Registered asset',
                    status: existing ? existing.status : 'APPROVED',
                    createdAt: a.createdAt ? (typeof a.createdAt === 'string' ? a.createdAt.substring(0, 10) : a.createdAt) : new Date().toISOString().substring(0, 10),
                    fileUrl: a.fileUrl || '/static/images/portfolio/portfolio-1.jpg',
                    versions: existing ? existing.versions : [{version: a.version || 'v1.0', date: a.createdAt || '', by: a.uploaderName || 'Staff', notes: 'Initial'}],
                    audit: existing ? existing.audit : [`${a.createdAt || '2026-03-01'} — Registered by ${a.uploaderName || 'Staff'}`]
                };
            });
            store.assets = mappedAssets;
            saveWorkflowDataToStorage();
        }

        // 6. Synchronize Feedback from DB
        const dbFeedback = await window.AdFlowAPI.getFeedback();
        if (Array.isArray(dbFeedback) && dbFeedback.length > 0) {
            const mappedFeedback = dbFeedback.map(f => {
                const existing = (store.feedback || []).find(x => x.id === (f.id || f.feedbackId));
                return {
                    id: f.id || f.feedbackId,
                    campaign: f.campaignName || f.campaign || (existing ? existing.campaign : '5G Mega Launch 2026'),
                    item: f.taskTitle || f.assetName || f.item || (existing ? existing.item : 'Campaign Deliverable'),
                    client: f.clientName || f.client || (existing ? existing.client : 'Kasun Perera'),
                    createdByEmail: f.clientEmail || (existing ? existing.createdByEmail : 'client@dialog.lk'),
                    rating: f.rating || 5,
                    comments: f.comments || '',
                    status: f.status || 'SUBMITTED',
                    agencyReply: existing ? existing.agencyReply : null,
                    repliedBy: existing ? existing.repliedBy : null,
                    repliedAt: existing ? existing.repliedAt : null,
                    createdAt: f.createdAt ? (typeof f.createdAt === 'string' ? f.createdAt.substring(0, 16).replace('T', ' ') : f.createdAt) : new Date().toLocaleString()
                };
            });
            store.feedback = mappedFeedback;
            saveWorkflowDataToStorage();
        }

        // 7. Synchronize Invoices from DB
        const dbInvoices = await window.AdFlowAPI.getInvoices();
        if (Array.isArray(dbInvoices) && dbInvoices.length > 0) {
            const mappedInvoices = dbInvoices.map(i => {
                const existing = (store.invoices || []).find(x => x.id === (i.id || i.invoiceId) || x.number === i.invoiceNumber);
                const sub = i.subtotal ? Number(i.subtotal) : (existing ? existing.subtotal : 1000000);
                const tax = i.taxAmount ? Number(i.taxAmount) : (existing ? existing.tax : sub * 0.08);
                const total = i.totalAmount ? Number(i.totalAmount) : (existing ? existing.total : sub + tax);
                return {
                    id: i.id || i.invoiceId,
                    number: i.invoiceNumber || i.number || `INV-2026-${String(i.id || 1).padStart(3, '0')}`,
                    campaign: i.campaignName || i.campaign || (existing ? existing.campaign : 'Campaign'),
                    campaignId: i.campaignId || (existing ? existing.campaignId : 1),
                    client: i.clientName || i.client || (existing ? existing.client : 'Client'),
                    clientEmail: i.clientEmail || (existing ? existing.clientEmail : 'client@dialog.lk'),
                    issueDate: i.issueDate || (existing ? existing.issueDate : '2026-03-01'),
                    dueDate: i.dueDate || (existing ? existing.dueDate : '2026-03-31'),
                    subtotal: sub,
                    tax: tax,
                    total: total,
                    status: i.status || (existing ? existing.status : 'SENT'),
                    paidDate: existing ? existing.paidDate : null,
                    receiptFile: existing ? existing.receiptFile : null
                };
            });
            store.invoices = mappedInvoices;
            saveWorkflowDataToStorage();
        }
    } catch(err) {
        console.warn('Real-time DB sync warning:', err);
    }
}

function loadUsersFromStorage() {
    try {
        const saved = sessionStorage.getItem('adflow_registered_users');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const userMap = new Map();
                defaultUsers.forEach(u => {
                    if (u && u.email) userMap.set(u.email.toLowerCase(), u);
                });
                parsed.forEach(u => {
                    if (u && u.email && u.role !== 'FEEDBACK_REVIEW_MANAGER') userMap.set(u.email.toLowerCase(), u);
                });
                store.users = Array.from(userMap.values());
                saveUsersToStorage();
                return;
            }
        }
    } catch (e) {
        console.error('Error loading users from storage', e);
    }
    store.users = [...defaultUsers];
}

loadUsersFromStorage();
syncWithBackendDatabase();
setInterval(syncWithBackendDatabase, 4000);

// Portal Login Modal Handlers & Input Field Sanitization
function clearAuthInputs() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    if (signInForm) signInForm.reset();
    if (signUpForm) signUpForm.reset();

    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const regName = document.getElementById('regFullName');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const loginAlert = document.getElementById('loginAlert');
    const regAlert = document.getElementById('regAlert');

    if (loginEmail) { loginEmail.value = ''; loginEmail.defaultValue = ''; loginEmail.removeAttribute('value'); }
    if (loginPassword) { loginPassword.value = ''; loginPassword.defaultValue = ''; loginPassword.removeAttribute('value'); }
    if (regName) { regName.value = ''; regName.defaultValue = ''; regName.removeAttribute('value'); }
    if (regEmail) { regEmail.value = ''; regEmail.defaultValue = ''; regEmail.removeAttribute('value'); }
    if (regPassword) { regPassword.value = ''; regPassword.defaultValue = ''; regPassword.removeAttribute('value'); }
    if (loginAlert) { loginAlert.style.display = 'none'; loginAlert.textContent = ''; }
    if (regAlert) { regAlert.style.display = 'none'; regAlert.textContent = ''; }
}

function openLoginModal() {
    clearAuthInputs();
    const modal = document.getElementById('loginModalOverlay');
    if (modal) modal.style.display = 'flex';
    switchAuthTab('signin');
    setTimeout(clearAuthInputs, 50);
}

function closeLoginModal() {
    clearAuthInputs();
    const modal = document.getElementById('loginModalOverlay');
    if (modal) modal.style.display = 'none';
}

function switchAuthTab(tab) {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const tabSignInBtn = document.getElementById('tabSignInBtn');
    const tabSignUpBtn = document.getElementById('tabSignUpBtn');
    const loginAlert = document.getElementById('loginAlert');
    const regAlert = document.getElementById('regAlert');

    if (loginAlert) loginAlert.style.display = 'none';
    if (regAlert) regAlert.style.display = 'none';

    if (tab === 'signin') {
        if (signInForm) signInForm.style.display = 'block';
        if (signUpForm) signUpForm.style.display = 'none';
        if (tabSignInBtn) tabSignInBtn.classList.add('active');
        if (tabSignUpBtn) tabSignUpBtn.classList.remove('active');
    } else {
        if (signInForm) signInForm.style.display = 'none';
        if (signUpForm) signUpForm.style.display = 'block';
        if (tabSignInBtn) tabSignInBtn.classList.remove('active');
        if (tabSignUpBtn) tabSignUpBtn.classList.add('active');
    }
}

// Role-based access for the six major functions in the project proposal.
const ROLE_MODULE_ACCESS = {
    APPOINTMENT_MANAGER: ['appointments', 'profile'],
    CAMPAIGN_MANAGER: ['campaigns', 'profile'],
    TASK_PROJECT_MANAGER: ['campaigns', 'tasks', 'feedback', 'profile'],
    CREATIVE_ASSET_MANAGER: ['assets', 'profile'],
    INVOICE_BILLING_MANAGER: ['finance', 'profile'],
    SYSTEM_ADMIN: ['appointments', 'campaigns', 'tasks', 'feedback', 'assets', 'finance', 'admin-users', 'profile'],
    CLIENT_RELATIONS_OFFICER: ['appointments', 'profile'],
    MARKETING_MANAGER: ['campaigns', 'profile'],
    CREATIVE_TEAM_LEAD: ['campaigns', 'tasks', 'feedback', 'profile'],
    CREATIVE_STAFF: ['assets', 'profile'],
    FINANCE_EXECUTIVE: ['finance', 'profile'],
    MANAGING_DIRECTOR: ['campaigns', 'tasks', 'feedback', 'assets', 'finance', 'profile'],
    CLIENT: ['appointments', 'campaigns', 'tasks', 'feedback', 'finance', 'profile']
};

const ROLE_DISPLAY_NAMES = {
    APPOINTMENT_MANAGER: 'Appointment Manager',
    CAMPAIGN_MANAGER: 'Campaign Manager',
    TASK_PROJECT_MANAGER: 'Task & Project Manager',
    CREATIVE_ASSET_MANAGER: 'Creative Asset Manager',
    INVOICE_BILLING_MANAGER: 'Invoice & Billing Manager',
    SYSTEM_ADMIN: 'System Administrator'
};

function canRoleAccessModule(role, moduleName) {
    if (moduleName === 'home' || moduleName === 'notifications') return true;
    const allowed = ROLE_MODULE_ACCESS[role] || ['profile'];
    return allowed.includes(moduleName);
}

// Automatic Module Routing Based on User Role
function getDefaultModuleForRole(role) {
    switch (role) {
        case 'APPOINTMENT_MANAGER': return 'appointments';
        case 'CAMPAIGN_MANAGER': return 'campaigns';
        case 'TASK_PROJECT_MANAGER': return 'tasks';
        case 'CREATIVE_ASSET_MANAGER': return 'assets';
        case 'INVOICE_BILLING_MANAGER': return 'finance';
        case 'MARKETING_MANAGER':
            return 'campaigns';       // Marketing Manager (Mendiya J.L.P.S) -> Campaign Management
        case 'CLIENT_RELATIONS_OFFICER':
            return 'appointments';    // Client Relations Officer (Rathnayaka R.M.H.R) -> Appointment Management
        case 'CREATIVE_TEAM_LEAD':
            return 'tasks';           // Creative Team Lead (Wickramanayaka A.W.H.D) -> Task & Project Management
        case 'CREATIVE_STAFF':
            return 'assets';          // Creative Staff (Navodi / Yashika) -> Creative Asset Management
        case 'FINANCE_EXECUTIVE':
            return 'finance';         // Finance Executive (Gamage M.I.I.K) -> Financial Management & Invoicing
        case 'CLIENT':
            return 'appointments';    // Client -> Appointment Management & Consultations
        case 'MANAGING_DIRECTOR':
            return 'campaigns';       // Managing Director -> Campaign Management Overview
        case 'SYSTEM_ADMIN':
            return 'admin-users';
        default:
            return 'appointments';
    }
}

// Perform Portal Login with Email & 6-Character Password Validation
async function performPortalLogin() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const alertBox = document.getElementById('loginAlert');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    // 1. Valid Email Format Check - Must contain @gmail.com (or existing portal accounts)
    const lowerEmail = email.toLowerCase();
    const isGmail = lowerEmail.endsWith('@gmail.com') || lowerEmail.includes('@gmail.com');
    const isAgencyAccount = lowerEmail.endsWith('@brightwave.lk') || lowerEmail.endsWith('@dialog.lk');

    if (!email || (!isGmail && !isAgencyAccount)) {
        showAuthAlert(alertBox, '⚠️ Email address must contain @gmail.com.');
        if (emailInput) emailInput.focus();
        return;
    }

    // 2. Minimum 6-Digit/Character Password Validation
    if (!password || password.length < 6) {
        showAuthAlert(alertBox, '⚠️ Password must be at least 6 characters.');
        if (passwordInput) passwordInput.focus();
        return;
    }

    loadUsersFromStorage();

    // 3. Authenticate with Real-Time Backend API first (checks BCrypt in MySQL)
    let authenticatedUser = null;
    if (window.AdFlowAPI) {
        try {
            const apiRes = await window.AdFlowAPI.loginUser(email, password);
            if (apiRes && (apiRes.token || apiRes.userId || apiRes.email)) {
                authenticatedUser = {
                    id: apiRes.userId || apiRes.id || Date.now(),
                    name: apiRes.fullName || apiRes.name || email.split('@')[0],
                    email: apiRes.email || email,
                    password: password,
                    role: apiRes.role || 'CLIENT',
                    company: apiRes.companyName || apiRes.company || 'Client Account'
                };
            }
        } catch (err) {
            console.warn('API login check failed, falling back to local auth:', err);
        }
    }

    // Fallback to local store
    if (!authenticatedUser) {
        const matchedUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!matchedUser) {
            showAuthAlert(alertBox, '⚠️ No account exists for this email. Please create an account using Sign Up first.');
            return;
        }

        // Check if password matches or if it was a freshly registered user
        if (matchedUser.password && matchedUser.password !== 'hashed_pwd_123' && matchedUser.password !== password) {
            showAuthAlert(alertBox, '⚠️ Incorrect password. Please check your password and try again.');
            return;
        }

        authenticatedUser = matchedUser;
    }

    // Ensure store.users has this user and correct password
    const userIdx = store.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIdx >= 0) {
        store.users[userIdx].password = password;
        if (authenticatedUser.name) store.users[userIdx].name = authenticatedUser.name;
        if (authenticatedUser.role) store.users[userIdx].role = authenticatedUser.role;
    } else {
        authenticatedUser.password = password;
        store.users.push(authenticatedUser);
    }
    saveUsersToStorage();

    // Success Login & Auto Role-Based Navigation Redirect
    store.currentRole = authenticatedUser.role;
    store.currentUser = authenticatedUser;
    saveCurrentUserToStorage();
    
    const mainRoleSelect = document.getElementById('roleSelect');
    if (mainRoleSelect) mainRoleSelect.value = authenticatedUser.role;

    store.isLoggedIn = true;
    closeLoginModal();
    clearAuthInputs();
    
    const targetModule = getDefaultModuleForRole(authenticatedUser.role);
    showModule(targetModule, true);
}

async function performUserRegistration() {
    const nameInput = document.getElementById('regFullName');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const alertBox = document.getElementById('regAlert');
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const role = 'CLIENT';

    if (!name || name.length < 2) {
        showAuthAlert(alertBox, '⚠️ Please enter your Full Name (at least 2 characters).');
        if (nameInput) nameInput.focus();
        return;
    }
    if (/\d/.test(name) || !/^[A-Za-z\s.'-]+$/.test(name)) {
        showAuthAlert(alertBox, '⚠️ Full Name must contain letters only. Numbers and special symbols are not allowed.');
        if (nameInput) nameInput.focus();
        return;
    }

    const lowerRegEmail = email.toLowerCase();
    const isRegGmail = lowerRegEmail.endsWith('@gmail.com') || lowerRegEmail.includes('@gmail.com');

    if (!email || !isRegGmail) {
        showAuthAlert(alertBox, '⚠️ Email address must contain @gmail.com.');
        if (emailInput) emailInput.focus();
        return;
    }

    if (!password || password.length < 6) {
        showAuthAlert(alertBox, '⚠️ Password must be at least 6 characters.');
        if (passwordInput) passwordInput.focus();
        return;
    }

    // Sign Up is only for a brand-new client account.
    loadUsersFromStorage();
    const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        showAuthAlert(alertBox, '⚠️ An account with this email already exists. Please use Sign In instead.');
        return;
    }

    // Call Real-Time Backend API to insert user in database
    if (window.AdFlowAPI) {
        const apiRes = await AdFlowAPI.registerUser({ fullName: name, email, password, role, companyName: 'AdFlow Client' });
        if (apiRes && apiRes.status === 'ERROR') {
            showAuthAlert(alertBox, `⚠️ ${apiRes.message || 'Registration failed.'}`);
            return;
        }
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: role,
        company: 'AdFlow Client / Staff'
    };

    store.users.push(newUser);
    saveUsersToStorage();
    if (window.AdFlowAPI) await syncWithBackendDatabase();

    // Account was created successfully. Do not auto-login.
    // Require the user to sign in using the account they just registered.
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';

    switchAuthTab('signin');
    const signInEmail = document.getElementById('loginEmail');
    const signInPassword = document.getElementById('loginPassword');
    const loginAlert = document.getElementById('loginAlert');
    if (signInEmail) signInEmail.value = email;
    if (signInPassword) signInPassword.value = '';
    if (loginAlert) {
        loginAlert.classList.remove('auth-alert-error');
        loginAlert.classList.add('auth-alert-success');
        loginAlert.textContent = '✅ Account created successfully. Please sign in with your new account.';
        loginAlert.style.display = 'block';
    }
}

function showAuthAlert(alertBox, message) {
    if (alertBox) {
        alertBox.innerHTML = message;
        alertBox.style.display = 'block';
    }
}

function viewPublicSite() {
    store.isLoggedIn = false;
    store.currentUser = null;
    saveCurrentUserToStorage();
    store.activeModule = 'home';
    updateHeaderAndSidebarVisibility();
}

function logoutPortal() {
    store.isLoggedIn = false;
    store.currentUser = null;
    saveCurrentUserToStorage();
    try { sessionStorage.removeItem('adflow_active_module'); } catch (e) {}
    store.activeModule = 'home';
    saveWorkflowDataToStorage();
    clearAuthInputs();
    switchAuthTab('signin');
    updateHeaderAndSidebarVisibility();
    showModule('home', true);
}

function updateHeaderAndSidebarVisibility() {
    const publicNav = document.getElementById('publicNavLinks');
    const publicActions = document.getElementById('publicHeaderActions');
    const mgmtControls = document.getElementById('managementHeaderControls');
    const sidebar = document.getElementById('appSidebar');

    const isHome = (store.activeModule === 'home');

    if (isHome) {
        // Full Home Screen View: Hide sidebar so home page spans full screen width
        if (sidebar) sidebar.style.display = 'none';
        if (publicNav) publicNav.style.display = 'flex';

        if (store.isLoggedIn && store.currentUser) {
            // Keep user logged in with header controls
            if (mgmtControls) mgmtControls.style.display = 'flex';
            if (publicActions) publicActions.style.display = 'none';
        } else {
            // Visitor Mode: Show public sign in button
            if (mgmtControls) mgmtControls.style.display = 'none';
            if (publicActions) publicActions.style.display = 'block';
        }
    } else {
        // Management Portal View (Module Pages)
        if (sidebar) sidebar.style.display = 'flex';
        if (publicNav) publicNav.style.display = 'none';

        if (store.isLoggedIn && store.currentUser) {
            if (mgmtControls) mgmtControls.style.display = 'flex';
            if (publicActions) publicActions.style.display = 'none';
        } else {
            if (mgmtControls) mgmtControls.style.display = 'none';
            if (publicActions) publicActions.style.display = 'block';
        }

        // Strict role-based sidebar visibility. Each functional manager sees only their own module.
        const currentRole = store.currentRole || (store.currentUser ? store.currentUser.role : 'CLIENT');
        const moduleNavMap = {
            appointments: 'nav-appointments', campaigns: 'nav-campaigns', tasks: 'nav-tasks',
            feedback: 'nav-feedback', assets: 'nav-assets', finance: 'nav-finance',
            'admin-users': 'nav-admin-users', profile: 'nav-profile'
        };
        Object.entries(moduleNavMap).forEach(([moduleName, navId]) => {
            const el = document.getElementById(navId);
            if (el) el.style.display = canRoleAccessModule(currentRole, moduleName) ? 'flex' : 'none';
        });

        if (!canRoleAccessModule(currentRole, store.activeModule)) {
            store.activeModule = getDefaultModuleForRole(currentRole);
        }
    }

    renderCurrentModule();
}

// Global Brand Header Navigation to Home Page
function goToHomePage() {
    if (typeof showModule === 'function' && document.getElementById('mainContent')) {
        showModule('home', true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.location.href = 'index.html#home';
    }
}

// Role Switcher Handler
function switchRole(newRole) {
    store.currentRole = newRole;
    showModule(getDefaultModuleForRole(newRole), true);
}

// Module Navigation Handler (Supports Browser Back/Forward PushState)
function showModule(moduleName, pushHistory = true) {
    if (!moduleName) moduleName = 'home';

    // If trying to access a portal module without being logged in, prompt login modal
    if (moduleName !== 'home' && (!store.isLoggedIn || !store.currentUser)) {
        openLoginModal();
        return;
    }

    const role = store.currentRole || (store.currentUser ? store.currentUser.role : 'CLIENT');
    if (store.isLoggedIn && moduleName !== 'home' && !canRoleAccessModule(role, moduleName)) {
        alert('Access denied: this module is not assigned to your login role.');
        moduleName = getDefaultModuleForRole(role);
    }
    store.activeModule = moduleName;
    
    if (moduleName !== 'home') {
        store.lastPortalModule = moduleName;
        try { sessionStorage.setItem('adflow_active_module', moduleName); } catch (e) {}
    } else {
        try { sessionStorage.setItem('adflow_active_module', 'home'); } catch (e) {}
    }

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${moduleName}`);
    if (activeNav) activeNav.classList.add('active');

    if (pushHistory) {
        const hash = `#${moduleName}`;
        try {
            if (window.location.hash !== hash) {
                history.pushState({ module: moduleName }, '', hash);
            }
        } catch (err) {
            // Fallback for file protocol limits
        }
    }

    updateHeaderAndSidebarVisibility();
}

// Smooth Scroll to Section on Home Page
function scrollToSection(sectionId, el) {
    if (store.activeModule !== 'home') {
        showModule('home');
    }

    if (el) {
        document.querySelectorAll('#publicNavLinks .nav-link').forEach(link => link.classList.remove('active'));
        el.classList.add('active');
    }

    setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 50);
}

function renderCurrentModule() {
    const main = document.getElementById('mainContent');
    main.innerHTML = '';

    switch (store.activeModule) {
        case 'home': renderHome(main); break;
        case 'appointments': renderAppointments(main); break;
        case 'campaigns': renderCampaigns(main); break;
        case 'tasks': renderTasks(main); break;
        case 'feedback': renderFeedback(main); break;
        case 'assets': renderAssets(main); break;
        case 'finance': renderFinance(main); break;
        case 'notifications': renderNotifications(main); break;
        case 'profile': renderProfile(main); break;
        case 'admin-users': renderAdminUsers(main); break;
    }
    if (store.activeModule !== 'home' && store.activeModule !== 'profile' && store.activeModule !== 'admin-users') {
        decorateRoleWorkspace(main);
    }
}

function decorateRoleWorkspace(container) {
    const role = store.currentRole || 'CLIENT';
    const dedicatedRoles = ['APPOINTMENT_MANAGER','CAMPAIGN_MANAGER','TASK_PROJECT_MANAGER','CREATIVE_ASSET_MANAGER','INVOICE_BILLING_MANAGER','SYSTEM_ADMIN'];
    if (!dedicatedRoles.includes(role) || !container) return;
    const roleName = ROLE_DISPLAY_NAMES[role] || role.replaceAll('_', ' ');
    const responsibilities = {
        appointments: 'Full appointment CRUD • scheduling • rescheduling • status/notes • cancellation • client/staff coordination',
        campaigns: 'Full campaign CRUD • briefs • budgets • timelines • status • archive • campaign linking',
        tasks: 'Full task CRUD • assignment • priority/deadlines • progress • comments • workflow tracking',
        feedback: 'Full feedback CRUD • revision requests • ratings • status workflow • approval/history tracking',
        assets: 'Full asset CRUD • upload • metadata/tags • versioning • approval status • archive/delete',
        finance: 'Full invoice CRUD • itemised billing • PDF • payment recording • reminders • voiding • financial summaries'
    };
    const banner = document.createElement('div');
    banner.className = 'card-box';
    banner.style.cssText = 'margin-bottom:18px;border-left:4px solid #2563EB;background:#F8FBFF;';
    banner.innerHTML = `<div style="display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap;">
        <div><div style="font-size:.75rem;font-weight:800;color:#2563EB;letter-spacing:.08em;">ROLE WORKSPACE</div>
        <h3 style="margin:4px 0 5px;font-size:1.05rem;">${roleName}</h3>
        <p style="margin:0;color:var(--text-secondary);font-size:.84rem;">${role === 'SYSTEM_ADMIN' ? 'Full access to all six major functions and staff account administration.' : (responsibilities[store.activeModule] || 'Access limited to the module assigned to this login.')}</p></div>
        <span class="badge badge-completed">🔐 ${role === 'SYSTEM_ADMIN' ? 'FULL ACCESS' : 'MODULE-ONLY ACCESS'}</span>
    </div>`;
    container.prepend(banner);
}

function renderAdminUsers(container) {
    if (store.currentRole !== 'SYSTEM_ADMIN') {
        container.innerHTML = '<div class="card-box"><h3>Access denied</h3><p>Only the System Administrator can manage staff credentials.</p></div>';
        return;
    }
    const staff = store.users.filter(u => u.role !== 'CLIENT');
    container.innerHTML = `
        <div class="page-header"><div class="page-title"><h2>🛡️ System Administration</h2><p>Create and manage staff login credentials and role assignments.</p></div>
        <button class="btn-primary" onclick="openStaffAccountModal()">+ Add Staff Login</button></div>
        <div class="stats-grid"><div class="stat-card"><div class="stat-title">Staff Accounts</div><div class="stat-value">${staff.length}</div><div class="stat-desc">Authorised portal users</div></div>
        <div class="stat-card green"><div class="stat-title">Major Function Managers</div><div class="stat-value">${staff.filter(u => ['APPOINTMENT_MANAGER','CAMPAIGN_MANAGER','TASK_PROJECT_MANAGER','CREATIVE_ASSET_MANAGER','INVOICE_BILLING_MANAGER'].includes(u.role)).length}</div><div class="stat-desc">Dedicated operational logins</div></div></div>
        <div class="table-container"><table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Access</th><th>Actions</th></tr></thead><tbody>
        ${staff.map(u => `<tr><td><strong>${u.name}</strong></td><td>${u.email}</td><td><span class="badge badge-scheduled">${ROLE_DISPLAY_NAMES[u.role] || u.role}</span></td><td>${u.role === 'SYSTEM_ADMIN' ? 'All 6 modules' : (ROLE_MODULE_ACCESS[u.role] || []).filter(x=>x!=='profile').join(', ') || 'Legacy role access'}</td><td><button class="btn-secondary" style="padding:4px 9px" onclick="openStaffAccountModal(${u.id})">✏️ Edit</button>${u.role !== 'SYSTEM_ADMIN' ? `<button class="btn-danger" style="padding:4px 9px;margin-left:5px" onclick="deleteStaffAccount(${u.id})">🗑️ Delete</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div>`;
}

function openStaffAccountModal(id = null) {
    if (store.currentRole !== 'SYSTEM_ADMIN') return;
    const u = id ? store.users.find(x => x.id === id) : null;
    const roles = [
        ['APPOINTMENT_MANAGER','Appointment Manager'],['CAMPAIGN_MANAGER','Campaign Manager'],['TASK_PROJECT_MANAGER','Task & Project Manager'],
        ['CREATIVE_ASSET_MANAGER','Creative Asset Manager'],['INVOICE_BILLING_MANAGER','Invoice & Billing Manager'],
        ['CLIENT_RELATIONS_OFFICER','Client Relations Officer'],['MARKETING_MANAGER','Marketing Manager'],
        ['CREATIVE_TEAM_LEAD','Creative Team Lead'],['CREATIVE_STAFF','Creative Staff'],['FINANCE_EXECUTIVE','Finance Executive'],['MANAGING_DIRECTOR','Managing Director']
    ];
    document.getElementById('modalTitle').innerText = u ? 'Edit Staff Login' : 'Create Staff Login';
    document.getElementById('modalBody').innerHTML = `<form onsubmit="saveStaffAccount(event, ${id === null ? 'null' : id})">
        <div class="form-group"><label>Staff Name</label><input id="staffName" class="form-control" value="${u ? u.name : ''}" required></div>
        <div class="form-group"><label>Email</label><input id="staffEmail" type="email" class="form-control" value="${u ? u.email : ''}" required></div>
        <div class="form-group"><label>Password</label><input id="staffPassword" type="text" minlength="6" class="form-control" value="${u ? u.password : ''}" required></div>
        <div class="form-group"><label>Assigned Function</label><select id="staffRole" class="form-control">${roles.map(r=>`<option value="${r[0]}" ${u && u.role===r[0]?'selected':''}>${r[1]}</option>`).join('')}</select></div>
        <button class="btn-primary" type="submit" style="width:100%;justify-content:center;">${u ? 'Save Changes' : 'Create Staff Login'}</button></form>`;
    showPortalModal();
}

async function saveStaffAccount(e, id) {
    e.preventDefault();
    if (store.currentRole !== 'SYSTEM_ADMIN') return;
    const email = document.getElementById('staffEmail').value.trim().toLowerCase();
    const name = document.getElementById('staffName').value.trim();
    const password = document.getElementById('staffPassword').value;
    const role = document.getElementById('staffRole').value;
    const allowedStaffRoles = ['APPOINTMENT_MANAGER','CAMPAIGN_MANAGER','TASK_PROJECT_MANAGER','CREATIVE_ASSET_MANAGER','INVOICE_BILLING_MANAGER','CLIENT_RELATIONS_OFFICER','MARKETING_MANAGER','CREATIVE_TEAM_LEAD','CREATIVE_STAFF','FINANCE_EXECUTIVE','MANAGING_DIRECTOR'];
    if (name.length < 3 || name.length > 80) { alert('Staff name must be 3-80 characters.'); return; }
    if (/\d/.test(name) || !/^[A-Za-z\s.'-]+$/.test(name)) { alert('Staff name must contain letters only (numbers and symbols are not allowed).'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Enter a valid staff email address.'); return; }
    if (password.length < 8) { alert('Staff password must be at least 8 characters.'); return; }
    if (!allowedStaffRoles.includes(role)) { alert('Invalid staff role.'); return; }
    const duplicate = store.users.find(u => u.email.toLowerCase() === email && u.id !== id);
    if (duplicate) { alert('That email address is already in use.'); return; }

    if (window.AdFlowAPI) {
        await AdFlowAPI.saveStaff({ id, userId: id, fullName: name, email, password, role, companyName: 'BrightWave HQ' });
    }

    const record = { id: id || Date.now(), name, email, password, role, company: 'BrightWave HQ' };
    if (id) { const i=store.users.findIndex(u=>u.id===id); if(i>=0) store.users[i]=record; } else store.users.push(record);
    saveUsersToStorage();
    if (window.AdFlowAPI) await syncWithBackendDatabase();
    closeModal();
    renderCurrentModule();
}

async function deleteStaffAccount(id) {
    if (store.currentRole !== 'SYSTEM_ADMIN') return;
    const u=store.users.find(x=>x.id===id); if(!u || u.role==='SYSTEM_ADMIN') return;
    if(confirm(`Delete login for ${u.name}?`)) {
        if (window.AdFlowAPI) {
            await AdFlowAPI.deleteUser(id);
        }
        store.users=store.users.filter(x=>x.id!==id);
        saveUsersToStorage();
        if (window.AdFlowAPI) await syncWithBackendDatabase();
        renderCurrentModule();
    }
}

// ----------------------------------------------------------------------------
// 0. AGENCY HOME PAGE (BrightWave Advertising HQ)
// ----------------------------------------------------------------------------
function renderHome(container) {
    container.innerHTML = `
        <!-- Hero Banner -->
        <div class="hero-section" id="heroSection">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="hero-badge-pill">✨ SRI LANKA'S PREMIER 3D & DIGITAL ADVERTISING AGENCY</div>
                <h1 class="hero-title">BrightWave Advertising</h1>
                <p class="hero-subtitle">Crafting Iconic Brands, High-Impact 3D Billboards & Result-Driven Campaigns. Connecting Sri Lankan Enterprises with Over 50 Million Audiences Worldwide.</p>
                <div class="hero-actions">
                    <button class="btn-hero-primary" onclick="openLoginModal()">📅 Book Consultation</button>
                    <button class="btn-hero-secondary" onclick="openLoginModal()">🔐 Enter Management Portal</button>
                </div>
            </div>
        </div>

        <!-- Agency Stats Bar -->
        <div class="agency-stats-bar">
            <div class="stat-card">
                <div class="stat-number">150+</div>
                <div class="stat-label">Successful Campaigns</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">99.4%</div>
                <div class="stat-label">Client Satisfaction Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">50M+</div>
                <div class="stat-label">Islandwide Reach</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">12+</div>
                <div class="stat-label">National Advertising Awards</div>
            </div>
        </div>

        <!-- Agency Core Capabilities & Services -->
        <div class="section-header-box" id="capabilitiesSection">
            <h3>🎨 Our Core Capabilities</h3>
            <p>Full-funnel advertising solutions tailored for leading brands and enterprise clients.</p>
        </div>
        <div class="services-grid">
            <div class="service-card">
                <div class="service-icon-wrapper">🏙️</div>
                <div class="service-title">3D Billboards & OOH Digital</div>
                <div class="service-desc">Hyper-realistic anamorphic 3D LED displays at high-traffic landmarks like Lotus Tower, Galle Face, and Kandy City Center.</div>
            </div>
            <div class="service-card">
                <div class="service-icon-wrapper">📺</div>
                <div class="service-title">TV & Video Production</div>
                <div class="service-desc">Cinematic 4K TV commercials, radio jingles, and digital video campaigns produced in our high-tech Colombo studios.</div>
            </div>
            <div class="service-card">
                <div class="service-icon-wrapper">📱</div>
                <div class="service-title">Performance Marketing</div>
                <div class="service-desc">Data-driven social media growth, search engine domination, and targeted influencer activations for retail & tech brands.</div>
            </div>
        </div>

        <!-- Featured Portfolio Showcase (Picture Gallery) -->
        <div class="section-header-box" id="portfolioSection">
            <h3>📸 Featured Visual Campaigns</h3>
            <p>Take a look at our award-winning advertising campaigns across Sri Lanka.</p>
        </div>
        <div class="portfolio-grid">
            <div class="portfolio-card">
                <div class="portfolio-img-box">
                    <img src="images/portfolio-1.jpg" onerror="this.src='images/portfolio/portfolio-1.jpg'" alt="5G Mega Launch 3D Billboard">
                    <span class="portfolio-category-badge">3D OOH BILLBOARD</span>
                </div>
                <div class="portfolio-body">
                    <div class="portfolio-title">5G Mega Launch 2026</div>
                    <div class="portfolio-client">Client: Dialog Axiata PLC</div>
                    <div class="portfolio-desc">Anamorphic 3D LED billboard visual campaign deployed across key metro intersections in Colombo.</div>
                </div>
            </div>
            <div class="portfolio-card">
                <div class="portfolio-img-box">
                    <img src="images/portfolio-2.jpg" onerror="this.src='images/portfolio/portfolio-2.jpg'" alt="TV Commercial Production Set">
                    <span class="portfolio-category-badge">TVC PRODUCTION</span>
                </div>
                <div class="portfolio-body">
                    <div class="portfolio-title">Cinematic TV Commercial Shoot</div>
                    <div class="portfolio-client">Client: Softlogic & Dialog</div>
                    <div class="portfolio-desc">High-definition 4K TV commercial and digital video campaign produced in our Colombo soundstages.</div>
                </div>
            </div>
            <div class="portfolio-card">
                <div class="portfolio-img-box">
                    <img src="images/portfolio-3.jpg" onerror="this.src='images/portfolio/portfolio-3.jpg'" alt="Digital Analytics Dashboard">
                    <span class="portfolio-category-badge">DIGITAL MARKETING</span>
                </div>
                <div class="portfolio-body">
                    <div class="portfolio-title">Performance Analytics Dashboard</div>
                    <div class="portfolio-client">BrightWave Digital Team</div>
                    <div class="portfolio-desc">Real-time social media tracking, ROI analytics, and multi-channel campaign growth optimization.</div>
                </div>
            </div>
        </div>

        <!-- Customer Feedback & Testimonials Section -->
        <div class="section-header-box" id="testimonialsSection">
            <h3>💬 Client Testimonials & Feedback</h3>
            <p>Read genuine feedback from Sri Lanka's top corporate leaders and brand managers.</p>
        </div>
        <div class="testimonials-grid">
            <div class="testimonial-card">
                <div>
                    <div class="rating-stars">⭐⭐⭐⭐⭐</div>
                    <p class="testimonial-text">"BrightWave transformed our 5G launch campaign into a national phenomenon. Their 3D Lotus Tower billboard concept was breathtaking!"</p>
                </div>
                <div class="client-profile-box">
                    <div class="client-avatar-circle">KP</div>
                    <div class="client-info">
                        <h5>Kasun Perera</h5>
                        <p>Brand Manager • Dialog Axiata PLC</p>
                    </div>
                </div>
            </div>
            <div class="testimonial-card">
                <div>
                    <div class="rating-stars">⭐⭐⭐⭐⭐</div>
                    <p class="testimonial-text">"The speed of campaign delivery and professionalism from Rathnayaka and Mendiya's team is unmatched. Highly recommended!"</p>
                </div>
                <div class="client-profile-box">
                    <div class="client-avatar-circle">NG</div>
                    <div class="client-info">
                        <h5>Nimali Gunawardena</h5>
                        <p>Head of Marketing • Softlogic Retail</p>
                    </div>
                </div>
            </div>
            <div class="testimonial-card">
                <div>
                    <div class="rating-stars">⭐⭐⭐⭐⭐</div>
                    <p class="testimonial-text">"Outstanding creative execution for our festive promos! The ROI and customer engagement surpassed all targets."</p>
                </div>
                <div class="client-profile-box">
                    <div class="client-avatar-circle">DS</div>
                    <div class="client-info">
                        <h5>Dhanushka Silva</h5>
                        <p>Senior VP • Elephant House Beverages</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Agency Location & Contact Numbers Section -->
        <div class="section-header-box" id="contactSection">
            <h3>📍 Agency Location & Contact Numbers</h3>
            <p>Visit our head office in Colombo 03 or contact our team for immediate campaign inquiries.</p>
        </div>

        <div class="location-contact-container">
            <!-- Location Details Card -->
            <div class="contact-card-box">
                <div class="location-img-box">
                    <img src="images/office-location.jpg" onerror="this.src='images/backgrounds/office-location.jpg'" alt="BrightWave Headquarters Location">
                </div>
                <h4>📍 Office Location & HQ</h4>
                <div class="contact-info-list">
                    <div class="contact-item-row">
                        <div class="contact-icon-badge">🏢</div>
                        <div class="contact-detail-text">
                            <h6>Headquarters Address</h6>
                            <p>BrightWave Tower, No. 42, Galle Road, Colombo 03, Sri Lanka.</p>
                        </div>
                    </div>
                    <div class="contact-item-row">
                        <div class="contact-icon-badge">⏰</div>
                        <div class="contact-detail-text">
                            <h6>Business Operating Hours</h6>
                            <p>Monday – Friday: 8:30 AM – 6:00 PM<br>Saturday: 9:00 AM – 1:30 PM (Sunday Closed)</p>
                            <span class="hours-badge">🟢 Office Open Today</span>
                        </div>
                    </div>
                    <div class="contact-item-row">
                        <div class="contact-icon-badge">🅿️</div>
                        <div class="contact-detail-text">
                            <h6>Visitor Parking</h6>
                            <p>Private Guest Parking Available on Basement Level B1.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contact Numbers & Communication Card -->
            <div class="contact-card-box">
                <h4>📞 Contact Hotlines & Support</h4>
                <div class="contact-info-list">
                    <div class="contact-item-row">
                        <div class="contact-icon-badge">☎️</div>
                        <div class="contact-detail-text">
                            <h6>General Agency Landline</h6>
                            <p>+94 11 234 5678 / +94 11 789 0123</p>
                        </div>
                    </div>
                    <div class="contact-item-row">
                        <div class="contact-icon-badge">📱</div>
                        <div class="contact-detail-text">
                            <h6>Client Relations Hotline</h6>
                            <p>+94 77 123 4567 (Rathnayaka R.M.H.R)</p>
                        </div>
                    </div>
                    <div class="contact-item-row">
                        <div class="contact-icon-badge">💬</div>
                        <div class="contact-detail-text">
                            <h6>WhatsApp Business Line</h6>
                            <p>+94 77 987 6543 (Instant Inquiry)</p>
                        </div>
                    </div>
                    <div class="contact-item-row">
                        <div class="contact-icon-badge">✉️</div>
                        <div class="contact-detail-text">
                            <h6>Email Addresses</h6>
                            <p>contact@brightwave.lk / info@adflow.lk</p>
                        </div>
                    </div>
                </div>

                <!-- Consultation Quick Link -->
                <div class="consultation-form-card">
                    <h5 style="font-size:1.1rem; font-weight:700; margin-bottom:8px; color:var(--blue-electric);">📅 Schedule an In-Person Consultation</h5>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Book a meeting with our Client Relations Officer to discuss your upcoming marketing campaign.</p>
                    <button class="btn-hero-primary" style="width:100%; justify-content:center;" onclick="openLoginModal()">
                        Book Appointment Now ➔
                    </button>
                </div>
            </div>
        </div>
    `;
}


// ----------------------------------------------------------------------------
// 1. APPOINTMENT MANAGEMENT (Rathnayaka R.M.H.R)
// ----------------------------------------------------------------------------
function renderAppointments(container) {
    let userAppointments = store.appointments;
    
    // Client Role Access Restriction: Strictly isolate user's own appointments
    if (store.currentRole === 'CLIENT') {
        if (store.currentUser && store.currentUser.email) {
            const userEmail = store.currentUser.email.toLowerCase();
            const userName = store.currentUser.name ? store.currentUser.name.toLowerCase() : '';
            userAppointments = store.appointments.filter(a => 
                (a.createdByEmail && a.createdByEmail.toLowerCase() === userEmail) ||
                (a.client && userName && a.client.toLowerCase() === userName)
            );
        } else {
            userAppointments = [];
        }
    }

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h2>📅 Appointment Management</h2>
                <p>Schedule, manage, and track client consultations & strategic agency meetings.</p>
            </div>
            <button class="btn-primary" onclick="openAppointmentModal()">+ Book Appointment</button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-title">Total Meetings</div>
                <div class="stat-value">${userAppointments.length}</div>
                <div class="stat-desc">Scheduled & Completed</div>
            </div>
            <div class="stat-card green">
                <div class="stat-title">Completed</div>
                <div class="stat-value">${userAppointments.filter(a => a.status === 'COMPLETED').length}</div>
                <div class="stat-desc">Successful consultations</div>
            </div>
            <div class="stat-card amber">
                <div class="stat-title">Upcoming</div>
                <div class="stat-value">${userAppointments.filter(a => a.status === 'SCHEDULED' || a.status === 'RESCHEDULED').length}</div>
                <div class="stat-desc">Scheduled sessions</div>
            </div>
        </div>

        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>Assigned Staff</th>
                        <th>Campaign</th>
                        <th>Date & Time</th>
                        <th>Meeting Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${userAppointments.length === 0 ? `
                        <tr>
                            <td colspan="7" style="text-align:center; padding:30px; color:var(--text-secondary);">
                                No appointments found. Click "+ Book Appointment" to schedule your first meeting!
                            </td>
                        </tr>
                    ` : userAppointments.map(a => `
                        <tr>
                            <td><strong>${a.client}</strong></td>
                            <td>${a.staff}</td>
                            <td>${a.campaign}</td>
                            <td>${a.date} at ${a.time}</td>
                            <td><span class="badge badge-scheduled">${a.type}</span></td>
                            <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
                            <td style="display:flex; gap:6px; align-items:center;">
                                <button class="btn-secondary" style="padding:4px 10px; font-size:0.8rem;" onclick="editAppointment(${a.id})">✏️ Edit</button>
                                <button class="btn-danger" style="padding:4px 10px; font-size:0.8rem;" onclick="deleteAppointment(${a.id})">🗑️ Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Validation Helper for Person / Client Names (Letters only, no numbers or pure symbols)
function validatePersonName(name, fieldName = 'Name') {
    if (!name || !name.trim()) return `${fieldName} is required.`;
    const trimmed = name.trim();
    if (trimmed.length < 2) return `${fieldName} must be at least 2 characters.`;
    if (/^\d+$/.test(trimmed)) {
        return `${fieldName} cannot be numbers only. Please enter a valid name with letters.`;
    }
    if (/\d/.test(trimmed)) {
        return `${fieldName} cannot contain numbers. Only letters are allowed.`;
    }
    if (!/^[A-Za-z\s.'-]+$/.test(trimmed)) {
        return `${fieldName} must contain letters only (numbers and symbols are not allowed).`;
    }
    if (!/[A-Za-z]{2,}/.test(trimmed)) {
        return `${fieldName} must contain at least 2 letters.`;
    }
    return null;
}

// Validation Helper for Meeting Time (No negative numbers, valid 12h/24h working hours)
function validateAndFormatMeetingTime(inputTime) {
    if (!inputTime || typeof inputTime !== 'string') {
        return { valid: false, error: 'Meeting time is required.' };
    }
    const raw = inputTime.trim();
    if (raw.includes('-')) {
        return { valid: false, error: 'Meeting time cannot contain negative numbers or negative signs (-). Please enter a valid time.' };
    }

    // 12-hour format e.g. "10:00 AM", "02:30 PM", "9:15 AM", "11:00 PM"
    const match12 = raw.match(/^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM|am|pm)$/i);
    // 24-hour format e.g. "09:00", "14:30", "11:00"
    const match24 = raw.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);

    if (!match12 && !match24) {
        return { 
            valid: false, 
            error: 'Invalid meeting time format. Please enter a valid time (e.g. 10:00 AM, 02:30 PM, or 14:00). Negative numbers are strictly disallowed.' 
        };
    }

    let h, m, period;
    if (match12) {
        h = parseInt(match12[1], 10);
        m = parseInt(match12[2], 10);
        period = match12[3].toUpperCase();
        let h24 = h;
        if (period === 'PM' && h < 12) h24 += 12;
        if (period === 'AM' && h === 12) h24 = 0;
        const totalMin = h24 * 60 + m;
        if (totalMin < 8 * 60 || totalMin > 19 * 60) {
            return { valid: false, error: 'Meeting time must be within working hours (08:00 AM – 07:00 PM).' };
        }
        const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
        return { valid: true, formatted };
    } else {
        const h24 = parseInt(match24[1], 10);
        m = parseInt(match24[2], 10);
        const totalMin = h24 * 60 + m;
        if (totalMin < 8 * 60 || totalMin > 19 * 60) {
            return { valid: false, error: 'Meeting time must be within working hours (08:00 AM – 07:00 PM).' };
        }
        period = h24 >= 12 ? 'PM' : 'AM';
        let h12 = h24 % 12;
        if (h12 === 0) h12 = 12;
        const formatted = `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
        return { valid: true, formatted };
    }
}

function openAppointmentModal() {
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('modalTitle').innerText = 'Book Client Appointment';
    document.getElementById('modalBody').innerHTML = `
        <form id="bookAppointmentForm" onsubmit="saveAppointment(event)" autocomplete="off">
            <div class="form-group">
                <label>Client Full Name:</label>
                <input type="text" id="appClient" class="form-control" value="" placeholder="Enter client full name (e.g. Kasun Perera)" autocomplete="off" required>
            </div>
            <div class="form-group">
                <label>Select Agency Staff Member to Meet:</label>
                <select id="appStaff" class="form-control" required>
                    <option value="" disabled selected>-- Select an Agency Staff Member --</option>
                    <option value="Client Relations Officer">👤 Client Relations Officer (Rathnayaka R.M.H.R)</option>
                    <option value="Marketing Manager">📢 Marketing Manager (Mendiya J.L.P.S)</option>
                    <option value="Creative Team Lead">🎨 Creative Team Lead (Wickramanayaka A.W.H.D)</option>
                    <option value="Creative Staff Member">🖼️ Creative Staff Member (Navodi / Yashika)</option>
                    <option value="Finance Executive">💳 Finance Executive (Gamage M.I.I.K)</option>
                    <option value="Managing Director">👑 Managing Director (Dilshan Silva)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Meeting Purpose</label>
                <input type="text" id="appPurpose" class="form-control" value="" placeholder="e.g. 5G Media Plan Strategy Review" autocomplete="off" required>
            </div>
            <div class="form-group">
                <label>Meeting Date</label>
                <input type="date" id="appDate" class="form-control" value="" min="${todayStr}" autocomplete="off" required>
            </div>
            <div class="form-group">
                <label>Meeting Time (08:00 AM – 07:00 PM)</label>
                <input type="text" id="appTime" list="meetingTimeSlots" class="form-control" value="" placeholder="e.g. 10:00 AM or 02:30 PM" onkeydown="if(event.key==='-') event.preventDefault();" autocomplete="off" required>
                <datalist id="meetingTimeSlots">
                    <option value="08:30 AM">
                    <option value="09:00 AM">
                    <option value="09:30 AM">
                    <option value="10:00 AM">
                    <option value="10:30 AM">
                    <option value="11:00 AM">
                    <option value="11:30 AM">
                    <option value="12:00 PM">
                    <option value="01:00 PM">
                    <option value="01:30 PM">
                    <option value="02:00 PM">
                    <option value="02:30 PM">
                    <option value="03:00 PM">
                    <option value="03:30 PM">
                    <option value="04:00 PM">
                    <option value="04:30 PM">
                    <option value="05:00 PM">
                    <option value="05:30 PM">
                    <option value="06:00 PM">
                </datalist>
            </div>
            <div class="form-group">
                <label>Meeting Type</label>
                <select id="appType" class="form-control">
                    <option value="VIRTUAL_CALL">Virtual Video Call (Zoom / Teams)</option>
                    <option value="IN_PERSON">In-Person at BrightWave HQ Boardroom</option>
                    <option value="PHONE_CALL">Direct Phone Call</option>
                </select>
            </div>
            <div class="form-group">
                <label>Notes / Discussion Agenda</label>
                <textarea id="appNotes" class="form-control" rows="2" placeholder="Add meeting notes or discussion points..."></textarea>
            </div>
            <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:12px;">Confirm & Schedule Appointment &rarr;</button>
        </form>
    `;
    showPortalModal();
}

// Helper to convert 12h formatted time (e.g. "09:30 AM") to 24h SQL LocalTime format ("09:30:00")
function convert12hTo24h(timeStr) {
    if (!timeStr) return '09:00:00';
    const trimmed = String(timeStr).trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
        let h = parseInt(match[1], 10);
        const m = match[2];
        const period = match[3].toUpperCase();
        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return `${String(h).padStart(2, '0')}:${m}:00`;
    }
    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/);
    if (match24) {
        return `${String(parseInt(match24[1], 10)).padStart(2, '0')}:${match24[2]}:00`;
    }
    return '09:00:00';
}

function resolveStaffId(staffStr) {
    if (!staffStr) return 2;
    if (typeof staffStr === 'number') return staffStr;
    const s = String(staffStr).toLowerCase();
    if (s.includes('marketing')) return 3;
    if (s.includes('creative team lead') || s.includes('creative lead') || s.includes('wickramanayaka')) return 4;
    if (s.includes('creative staff') || s.includes('navodi') || s.includes('yashika')) return 5;
    if (s.includes('finance') || s.includes('gamage') || s.includes('billing')) return 6;
    if (s.includes('managing') || s.includes('director')) return 7;
    if (s.includes('admin')) return 8;
    return 2; // Default to Client Relations Officer (ID: 2)
}

function resolveClientId() {
    if (store.currentUser) {
        if (store.currentUser.userId) return store.currentUser.userId;
        if (store.currentUser.id && typeof store.currentUser.id === 'number' && store.currentUser.id < 1000000000) return store.currentUser.id;
        if (store.currentUser.email && Array.isArray(store.users)) {
            const u = store.users.find(x => x.email && x.email.toLowerCase() === store.currentUser.email.toLowerCase());
            if (u && (u.userId || (u.id && u.id < 1000000000))) return u.userId || u.id;
        }
    }
    return 1; // Default seed client ID
}

async function saveAppointment(e) {
    e.preventDefault();
    const typedClientName = document.getElementById('appClient') ? document.getElementById('appClient').value.trim() : '';
    const staff = document.getElementById('appStaff').value;
    const purpose = document.getElementById('appPurpose').value.trim();
    const date = document.getElementById('appDate').value;
    const rawTime = document.getElementById('appTime').value.trim();
    const type = document.getElementById('appType').value;
    const notes = document.getElementById('appNotes').value.trim();
    const currentUser = store.currentUser || {};

    if (!typedClientName) {
        return alert('Please enter the Client Full Name.');
    }
    const nameErr = validatePersonName(typedClientName, 'Client Full Name');
    if (nameErr) {
        return alert(nameErr);
    }

    if (!staff) {
        return alert('Please select an agency staff member to meet.');
    }
    if (!purpose || purpose.length < 2) {
        return alert('Please enter a valid meeting purpose.');
    }
    if (!date) {
        return alert('Please select a meeting date.');
    }
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
        return alert('Meeting date cannot be in the past.');
    }

    const timeCheck = validateAndFormatMeetingTime(rawTime);
    if (!timeCheck.valid) {
        return alert(timeCheck.error);
    }

    if (store.currentUser && !store.currentUser.name) {
        store.currentUser.name = typedClientName;
    }

    const formatted24Time = convert12hTo24h(timeCheck.formatted);
    const assignedStaffId = resolveStaffId(staff);
    const clientId = resolveClientId();
    const validMeetingType = (type === 'IN_PERSON' || type === 'PHONE_CALL') ? type : 'VIRTUAL_CALL';

    const newApp = {
        id: Date.now(),
        client: typedClientName,
        createdByEmail: currentUser.email ? currentUser.email.toLowerCase() : '',
        staff: staff,
        staffId: assignedStaffId,
        campaign: 'Agency Project Consultation',
        date: date,
        time: timeCheck.formatted,
        purpose: purpose,
        type: validMeetingType,
        status: 'SCHEDULED',
        notes: notes || 'Scheduled consultation session.'
    };

    if (window.AdFlowAPI) {
        try {
            const apiRes = await AdFlowAPI.createAppointment({
                clientId: clientId,
                staffId: assignedStaffId,
                assignedStaffId: assignedStaffId,
                meetingDate: date,
                meetingTime: formatted24Time,
                purpose: purpose,
                meetingType: validMeetingType,
                status: 'SCHEDULED',
                notes: notes || 'Scheduled consultation session.'
            });
            if (apiRes && (apiRes.id || apiRes.appointmentId)) {
                newApp.id = apiRes.id || apiRes.appointmentId;
            }
        } catch (err) {
            console.error('Appointment DB create sync failed:', err);
        }
    }

    store.appointments.push(newApp);
    saveWorkflowDataToStorage();
    addNotification('New Appointment Scheduled', `Meeting booked with ${newApp.staff} on ${newApp.date} at ${newApp.time}`, '📅');

    closeModal();
    renderCurrentModule();
}

function editAppointment(id) {
    const app = store.appointments.find(a => a.id === id);
    if (!app) return;

    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('modalTitle').innerText = '✏️ Edit & Reschedule Appointment';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="updateAppointment(event, ${app.id})">
            <div class="form-group">
                <label>Client Name</label>
                <input type="text" class="form-control" value="${app.client}" disabled style="background:var(--ice-blue);">
            </div>
            <div class="form-group">
                <label>Select Agency Staff Member to Meet:</label>
                <select id="editAppStaff" class="form-control" required>
                    <option value="Client Relations Officer" ${app.staff.includes('Relations') ? 'selected' : ''}>👨‍💼 Client Relations Officer</option>
                    <option value="Marketing Manager" ${app.staff.includes('Marketing') ? 'selected' : ''}>🎯 Marketing Manager</option>
                    <option value="Creative Team Lead" ${app.staff.includes('Creative') ? 'selected' : ''}>🎨 Creative Team Lead</option>
                    <option value="Creative Staff Member" ${app.staff.includes('Staff') ? 'selected' : ''}>🖌️ Creative Staff Member</option>
                    <option value="Finance Executive" ${app.staff.includes('Finance') ? 'selected' : ''}>💳 Finance Executive</option>
                    <option value="Managing Director" ${app.staff.includes('Managing') ? 'selected' : ''}>👔 Managing Director</option>
                </select>
            </div>
            <div class="form-group">
                <label>Meeting Date</label>
                <input type="date" id="editAppDate" class="form-control" value="${app.date || todayStr}" min="${todayStr}" required>
            </div>
            <div class="form-group">
                <label>Meeting Time (08:00 AM – 07:00 PM)</label>
                <input type="text" id="editAppTime" list="meetingTimeSlots" class="form-control" value="${app.time || '10:00 AM'}" placeholder="e.g. 10:00 AM or 02:30 PM" onkeydown="if(event.key==='-') event.preventDefault();" required>
                <datalist id="meetingTimeSlots">
                    <option value="08:30 AM">
                    <option value="09:00 AM">
                    <option value="09:30 AM">
                    <option value="10:00 AM">
                    <option value="10:30 AM">
                    <option value="11:00 AM">
                    <option value="11:30 AM">
                    <option value="12:00 PM">
                    <option value="01:00 PM">
                    <option value="01:30 PM">
                    <option value="02:00 PM">
                    <option value="02:30 PM">
                    <option value="03:00 PM">
                    <option value="03:30 PM">
                    <option value="04:00 PM">
                    <option value="04:30 PM">
                    <option value="05:00 PM">
                    <option value="05:30 PM">
                    <option value="06:00 PM">
                </datalist>
            </div>
            <div class="form-group">
                <label>Meeting Purpose & Notes</label>
                <textarea id="editAppNotes" class="form-control" rows="3" placeholder="Add meeting notes or discussion points...">${app.notes || app.purpose || ''}</textarea>
            </div>
            <button type="submit" class="btn-primary" style="width:100%;">Save Changes & Reschedule ➔</button>
        </form>
    `;
    showPortalModal();
}

async function updateAppointment(e, id) {
    e.preventDefault();
    const app = store.appointments.find(a => a.id === id);
    if (!app) return;

    const staff = document.getElementById('editAppStaff').value;
    const date = document.getElementById('editAppDate').value;
    const rawTime = document.getElementById('editAppTime').value.trim();
    const notes = document.getElementById('editAppNotes').value.trim();

    if (!date) return alert('Please select a meeting date.');
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
        return alert('Meeting date cannot be in the past.');
    }

    const timeCheck = validateAndFormatMeetingTime(rawTime);
    if (!timeCheck.valid) {
        return alert(timeCheck.error);
    }

    const formatted24Time = convert12hTo24h(timeCheck.formatted);
    const assignedStaffId = resolveStaffId(staff);
    const clientId = resolveClientId();

    app.staff = staff;
    app.date = date;
    app.time = timeCheck.formatted;
    app.notes = notes;
    app.purpose = notes || app.purpose;
    app.status = 'RESCHEDULED';

    if (window.AdFlowAPI) {
        try {
            await AdFlowAPI.updateAppointment({
                appointmentId: id,
                id: id,
                clientId: clientId,
                staffId: assignedStaffId,
                assignedStaffId: assignedStaffId,
                meetingDate: date,
                meetingTime: formatted24Time,
                purpose: app.purpose,
                meetingType: app.type || 'VIRTUAL_CALL',
                status: 'RESCHEDULED',
                notes: notes
            });
        } catch (err) {
            console.error('Appointment DB update sync failed:', err);
        }
    }

    addNotification('Appointment Rescheduled', `Meeting with ${app.staff} moved to ${app.date} at ${app.time}`, '📅');
    saveWorkflowDataToStorage();

    closeModal();
    renderCurrentModule();
}

async function deleteAppointment(id) {
    const app = store.appointments.find(a => a.id === id);
    if (!app) return;

    if (confirm(`Are you sure you want to cancel and delete the appointment for ${app.client} on ${app.date}?`)) {
        store.appointments = store.appointments.filter(a => a.id !== id);
        saveWorkflowDataToStorage();

        if (window.AdFlowAPI) {
            try {
                await AdFlowAPI.deleteAppointment(id);
            } catch (err) {
                console.error('Appointment DB delete sync failed:', err);
            }
        }

        renderCurrentModule();
    }
}

// Available Agency Advertising Packages Catalog
const agencyPackages = [
    {
        id: 'pkg-3d',
        title: '3D Anamorphic LED Billboard Package',
        desc: 'High-impact 3D outdoor LED screen display broadcast at Lotus Tower Colombo & One Galle Face Mall.',
        channels: '3D LED, Outdoor Digital',
        targetAudience: 'Colombo Corporate Executives, Urban Consumers & Shoppers',
        impressions: '20+ Million Monthly Impressions',
        budget: 2500000,
        badge: 'POPULAR'
    },
    {
        id: 'pkg-tv',
        title: 'Islandwide TV & Digital Prime Blitz',
        desc: 'Multi-channel prime time TV spot commercials, YouTube Ads, and Meta sponsored video campaigns.',
        channels: 'TV Commercials, Meta, YouTube',
        targetAudience: 'Mass Consumer Households Across Sri Lanka',
        impressions: '35+ Million TV & Streaming Views',
        budget: 1500000,
        badge: 'HIGH ROI'
    },
    {
        id: 'pkg-influencer',
        title: 'Social Media & Influencer Brand Activation',
        desc: 'Top Sri Lankan celebrity & TikTok influencer endorsements with viral interactive challenges.',
        channels: 'TikTok, Instagram, Facebook',
        targetAudience: 'Gen-Z & Millennial Digital Native Audience',
        impressions: '12+ Million Social Engagements',
        budget: 850000,
        badge: 'TRENDING'
    },
    {
        id: 'pkg-transit',
        title: 'BIA Airport & Expressway Transit Takeover',
        desc: 'Digital LED screens at Bandaranaike International Airport arrivals & Southern Expressway canopy.',
        channels: 'Airport Media, Highway Transit LED',
        targetAudience: 'International Travelers, Tourists & Expressway Commuters',
        impressions: '10+ Million High-Income Transit Viewers',
        budget: 1200000,
        badge: 'ENTERPRISE'
    }
];

// ----------------------------------------------------------------------------
// 2. CAMPAIGN MANAGEMENT (Mendiya J.L.P.S)
// ----------------------------------------------------------------------------
function renderCampaigns(container) {
    const isClient = store.currentRole === 'CLIENT';
    const canCreateCampaign = !isClient;

    let userCampaigns = store.campaigns;
    if (isClient) {
        if (store.currentUser && store.currentUser.email) {
            const userEmail = store.currentUser.email.toLowerCase();
            const userName = store.currentUser.name ? store.currentUser.name.toLowerCase() : '';
            const userCompany = store.currentUser.company ? store.currentUser.company.toLowerCase() : '';
            userCampaigns = store.campaigns.filter(c => 
                (c.createdByEmail && c.createdByEmail.toLowerCase() === userEmail) ||
                (c.clientEmail && c.clientEmail.toLowerCase() === userEmail) ||
                (c.client && userName && c.client.toLowerCase() === userName) ||
                (c.client && userCompany && c.client.toLowerCase() === userCompany)
            );
        } else {
            userCampaigns = [];
        }
    }

    const totalBudget = userCampaigns.reduce((sum, c) => sum + c.budget, 0);
    const activeCount = userCampaigns.filter(c => c.status === 'ACTIVE').length;

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h2>📢 Campaign Management</h2>
                <p>${isClient ? 'Request an agency campaign package and track whether it is waiting for approval, approved, active, or completed.' : 'Plan, track, and optimize marketing campaigns, timelines & agency budgets.'}</p>
            </div>
            ${canCreateCampaign ? `<button class="btn-primary" onclick="openCampaignModal()">+ Create Campaign</button>` : ''}
        </div>

        <div class="stats-grid">
            <div class="stat-card purple">
                <div class="stat-title">Total Portfolio Budget</div>
                <div class="stat-value">LKR ${totalBudget.toLocaleString()}</div>
                <div class="stat-desc">Active & Upcoming Projects</div>
            </div>
            <div class="stat-card green">
                <div class="stat-title">Active Campaigns</div>
                <div class="stat-value">${activeCount}</div>
                <div class="stat-desc">In active execution</div>
            </div>
        </div>

        <!-- Section 1: Active Portfolio Table -->
        <div class="card-box" style="margin-bottom: 24px;">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--black-obsidian); margin-bottom:14px;">📋 ${isClient ? 'Your Campaign Requests & Campaigns' : 'Agency Master Campaigns List'}</h3>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Campaign Package / Title</th>
                            ${!isClient ? `<th>Client</th><th>Creative Staff</th>` : ''}
                            <th>Budget (LKR)</th>
                            <th>Spent (LKR)</th>
                            <th>Timeline</th>
                            <th>Status</th>
                            <th>Approval</th>
                            ${isClient ? `<th>Project Brief / Notes</th>` : '<th>Actions</th>'}
                        </tr>
                    </thead>
                    <tbody>
                        ${userCampaigns.length === 0 ? `
                            <tr>
                                <td colspan="${isClient ? 6 : 8}" style="text-align:center; padding:30px; color:var(--text-secondary);">
                                    No campaign requests yet. Choose a package below and submit it to the agency for approval.
                                </td>
                            </tr>
                        ` : userCampaigns.map(c => `
                            <tr>
                                <td><strong>${escapeHtml(c.title)}</strong></td>
                                ${!isClient ? `<td>${escapeHtml(c.client||'Client')}</td><td><span class="badge ${c.assignedCreativeStaff ? 'badge-active' : 'badge-scheduled'}" style="font-size:0.75rem; white-space:nowrap;">${escapeHtml(c.assignedCreativeStaff ? c.assignedCreativeStaff.split('(')[0].trim() : 'Unassigned')}</span></td>` : ''}
                                <td>Rs. ${(c.budget||0).toLocaleString()}</td>
                                <td>Rs. ${(c.spent||0).toLocaleString()}</td>
                                <td>${c.start||'-'} to ${c.end||'-'}</td>
                                <td><span class="badge badge-${(c.status||'UPCOMING').toLowerCase()}">${c.status}</span></td>
                                <td><span class="badge badge-${(c.approvalStatus||'APPROVED').toLowerCase()}">${c.approvalStatus||'APPROVED'}</span></td>
                                ${isClient ? `<td><span style="font-size:0.83rem; color:var(--text-secondary);">${escapeHtml(c.brief || 'Custom campaign ordered via portal.')}</span></td>` : `<td style="white-space:nowrap">${c.approvalStatus==='PENDING' ? `<button class="btn-primary" style="padding:4px 8px;background:#10B981;border-color:#10B981" onclick="openAssignCreativeModal(${c.id}, true)">✅ Approve & Assign</button> <button class="btn-danger" style="padding:4px 8px" onclick="approveCampaignRequest(${c.id},'REJECT')">❌ Reject</button> ` : `<button class="btn-secondary" style="padding:4px 8px;color:var(--blue-electric);font-weight:700" onclick="openAssignCreativeModal(${c.id}, false)">🎨 ${c.assignedCreativeStaff ? 'Reassign Creative' : 'Assign Creative'}</button> `}<button class="btn-secondary" style="padding:4px 8px" onclick="editCampaign(${c.id})">✏️ Edit</button> <button class="btn-secondary" style="padding:4px 8px" onclick="archiveCampaign(${c.id})">${c.status === 'ARCHIVED' ? '📦 Unarchive' : '📦 Archive'}</button> <button class="btn-danger" style="padding:4px 8px" onclick="deleteCampaign(${c.id})">🗑️ Delete</button></td>`}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        ${isClient ? `
        <!-- Section 2: Featured Agency Advertising Packages Catalog for Clients -->
        <div class="card-box" style="margin-top:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                <div>
                    <h3 style="font-size:1.2rem; font-weight:800; color:var(--black-obsidian);">🚀 BrightWave Agency Featured Campaigns & Media Packages</h3>
                    <p style="font-size:0.85rem; color:var(--text-secondary);">Available for all client customers. Click any package to inspect strategy or order directly with your custom project notes.</p>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
                ${agencyPackages.map(pkg => `
                    <div style="border:1px solid var(--border-blue); border-radius:12px; padding:18px; background:linear-gradient(135deg, #FFFFFF, var(--blue-soft)); display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <span class="badge badge-scheduled" style="font-size:0.75rem; padding:4px 8px;">${pkg.badge}</span>
                                <span style="font-size:0.8rem; color:var(--blue-electric); font-weight:700;">${pkg.channels}</span>
                            </div>
                            <h4 style="font-size:1.05rem; font-weight:800; color:var(--black-obsidian); margin-bottom:8px;">${pkg.title}</h4>
                            <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.4; margin-bottom:14px;">${pkg.desc}</p>
                        </div>
                        <div>
                            <div style="font-size:1.2rem; font-weight:900; color:var(--blue-electric); margin-bottom:12px;">LKR ${pkg.budget.toLocaleString()}</div>
                            <div style="display:flex; gap:8px;">
                                <button class="btn-secondary" style="flex:1; padding:8px; font-size:0.8rem; justify-content:center;" onclick="openPackageDetailsModal('${pkg.id}')">🔍 Details</button>
                                <button class="btn-primary" style="flex:1.4; padding:8px; font-size:0.8rem; justify-content:center; background:#10B981; border-color:#10B981;" onclick="openPurchaseModal('${pkg.id}')">📨 Request Package</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

function openPackageDetailsModal(packageId) {
    const pkg = agencyPackages.find(p => p.id === packageId);
    if (!pkg) return;

    document.getElementById('modalTitle').innerText = `🔍 ${pkg.title}`;
    document.getElementById('modalBody').innerHTML = `
        <div style="padding:4px 0;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                <span class="badge badge-scheduled" style="font-size:0.85rem; padding:6px 12px;">${pkg.badge}</span>
                <span style="font-size:1.3rem; font-weight:900; color:var(--blue-electric);">LKR ${pkg.budget.toLocaleString()}</span>
            </div>
            
            <p style="font-size:0.95rem; color:var(--black-obsidian); line-height:1.6; margin-bottom:16px;">${pkg.desc}</p>
            
            <div class="card-box" style="margin-bottom:16px; background:var(--blue-soft); border-color:var(--border-blue);">
                <h4 style="font-size:0.95rem; font-weight:800; color:var(--blue-electric); margin-bottom:8px;">📊 Estimated Campaign Reach & Media Specs</h4>
                <ul style="margin:0; padding-left:20px; font-size:0.88rem; color:var(--text-secondary); line-height:1.7;">
                    <li><strong>Target Audience:</strong> ${pkg.targetAudience}</li>
                    <li><strong>Media Distribution:</strong> ${pkg.channels}</li>
                    <li><strong>Estimated Impressions:</strong> ${pkg.impressions}</li>
                    <li><strong>Production Lead Time:</strong> 5-7 Business Days</li>
                </ul>
            </div>

            <div style="display:flex; gap:12px; margin-top:20px;">
                <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="closeModal()">Close</button>
                <button class="btn-primary" style="flex:2; justify-content:center; background:#10B981; border-color:#10B981;" onclick="closeModal(); openPurchaseModal('${pkg.id}');">📨 Request Package Now &rarr;</button>
            </div>
        </div>
    `;
    showPortalModal();
}

function openPurchaseModal(packageId) {
    const pkg = agencyPackages.find(p => p.id === packageId);
    if (!pkg) return;

    document.getElementById('modalTitle').innerText = '📨 Request Package & Add Project Notes';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="confirmCampaignPurchase(event, '${pkg.id}')">
            <div class="card-box" style="margin-bottom:16px; background:var(--blue-soft); border-color:var(--border-blue);">
                <h4 style="font-weight:800; color:var(--blue-electric); margin-bottom:4px;">${pkg.title}</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:8px;">${pkg.desc}</p>
                <div style="font-size:0.88rem; font-weight:700; color:var(--black-obsidian);">Package Price: <span style="font-weight:800; color:var(--blue-electric);">LKR ${pkg.budget.toLocaleString()}</span></div>
            </div>

            <div class="form-group">
                <label>Campaign / Project Title:</label>
                <input type="text" id="purTitle" class="form-control" value="${pkg.title}" required>
            </div>
            <div class="form-group">
                <label>Allocated Campaign Budget (LKR):</label>
                <input type="number" id="purBudget" class="form-control" min="100" step="100" value="${pkg.budget}" required>
            </div>
            <div class="form-group">
                <label>Campaign Target Launch Date:</label>
                <input type="date" id="purStart" class="form-control" value="2026-04-01" required>
            </div>
            <div class="form-group">
                <label>Client Special Project Notes / Brief Instructions:</label>
                <textarea id="purNotes" class="form-control" rows="3" placeholder="Enter custom project requirements, target audience notes, artwork guidelines or special instructions..."></textarea>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:16px; background:#FEF3C7; padding:10px 14px; border-radius:8px; border:1px solid #FCD34D;">
                ℹ️ Your request will be sent to the agency first. The Campaign Manager must approve it before production tasks begin.
            </div>
            <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:12px; background:#10B981; border-color:#10B981;">📨 Submit Campaign Request &rarr;</button>
        </form>
    `;
    showPortalModal();
}

function confirmCampaignPurchase(e, packageId) {
    e.preventDefault();
    const currentUser = store.currentUser || { name: 'Client User', email: '', company: '' };
    const title = document.getElementById('purTitle').value.trim();
    const budget = parseFloat(document.getElementById('purBudget').value);
    const startDate = document.getElementById('purStart').value;
    const notes = document.getElementById('purNotes') ? document.getElementById('purNotes').value.trim() : '';

    if (title.length < 3 || title.length > 120) { alert('Campaign title must be 3-120 characters.'); return; }
    if (!Number.isFinite(budget) || budget <= 0) { alert('Please enter a valid campaign budget greater than 0.'); return; }
    if (budget % 100 !== 0) { alert('Campaign budget must be in multiples of 100.'); return; }
    if (!startDate) { alert('Please select a target launch date.'); return; }

    const newCamp = {
        id: Date.now(),
        title,
        client: currentUser.company || currentUser.name || 'Client Enterprise',
        clientContact: currentUser.name || 'Client User',
        createdByEmail: currentUser.email ? currentUser.email.toLowerCase() : '',
        clientEmail: currentUser.email ? currentUser.email.toLowerCase() : '',
        manager: 'Campaign Manager',
        campaignType: 'PACKAGE_REQUEST',
        priority: 'MEDIUM',
        targetAudience: 'To be confirmed with client',
        channels: 'To be confirmed during planning',
        objectives: notes || 'Client requested campaign package.',
        deliverables: 'To be defined after agency approval',
        kpis: 'To be defined after agency approval',
        budget,
        spent: 0,
        start: startDate,
        end: '',
        status: 'REQUESTED',
        approvalStatus: 'PENDING',
        clientAccess: 'AVAILABLE',
        requestSource: 'CLIENT',
        requestedAt: new Date().toISOString(),
        brief: notes || 'Campaign requested by client through the portal.'
    };
    store.campaigns.push(newCamp);
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.createCampaign({
            campaignName: title,
            title: title,
            clientId: 1,
            managerId: 3,
            budget: budget,
            startDate: startDate,
            endDate: startDate,
            objective: notes || 'Client requested campaign package.',
            creativeBrief: notes || 'Client campaign brief',
            status: 'REQUESTED'
        }).catch(err => console.warn('Campaign DB create sync:', err));
    }

    addNotification('New Campaign Request', `Client submitted campaign request "${title}". Campaign Manager approval is required.`, '📨');
    closeModal();
    alert('Campaign request submitted successfully. The agency will review it before production begins.');
    renderCurrentModule();
}
function openCampaignModal() {
    document.getElementById('modalTitle').innerText = 'Create Advertising Campaign';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveCampaign(event)">
            <div class="form-group"><label>Campaign Title *</label><input type="text" id="campTitle" class="form-control" maxlength="120" placeholder="e.g. Summer Brand Awareness 2026" required></div>
            <div class="form-group"><label>Client / Company *</label><input type="text" id="campClient" class="form-control" maxlength="120" placeholder="Client company name" required></div>
            <div class="form-group"><label>Client Email *</label><input type="email" id="campClientEmail" class="form-control" placeholder="client@company.com" required></div>
            <div class="form-group"><label>Campaign Type *</label><select id="campType" class="form-control" required><option value="">Select type</option><option>DIGITAL</option><option>SOCIAL_MEDIA</option><option>TV_RADIO</option><option>OUTDOOR</option><option>INTEGRATED</option><option>BRAND_ACTIVATION</option></select></div>
            <div class="form-group"><label>Priority *</label><select id="campPriority" class="form-control"><option>LOW</option><option selected>MEDIUM</option><option>HIGH</option><option>URGENT</option></select></div>
            <div class="form-group"><label>Target Audience *</label><input type="text" id="campAudience" class="form-control" maxlength="200" placeholder="e.g. Urban adults aged 18-35" required></div>
            <div class="form-group"><label>Channels *</label><input type="text" id="campChannels" class="form-control" maxlength="200" placeholder="e.g. Facebook, Instagram, YouTube" required></div>
            <div class="form-group"><label>Allocated Budget (LKR) *</label><input type="number" id="campBudget" class="form-control" min="100" step="100" placeholder="e.g. 100000" onkeydown="if(event.key==='-') event.preventDefault();" required></div>
            <div class="form-group"><label>Start Date *</label><input type="date" id="campStart" class="form-control" required></div>
            <div class="form-group"><label>End Date *</label><input type="date" id="campEnd" class="form-control" required></div>
            <div class="form-group"><label>Objectives *</label><textarea id="campObjectives" class="form-control" rows="2" maxlength="500" placeholder="Main campaign goals" required></textarea></div>
            <div class="form-group"><label>Creative Brief *</label><textarea id="campBrief" class="form-control" rows="3" maxlength="1000" placeholder="Brand message, tone, visual direction and requirements" required></textarea></div>
            <div class="form-group"><label>Expected Deliverables *</label><textarea id="campDeliverables" class="form-control" rows="2" maxlength="500" placeholder="e.g. 6 social posts, 2 videos, 1 billboard artwork" required></textarea></div>
            <div class="form-group"><label>KPIs / Success Measures *</label><input type="text" id="campKpis" class="form-control" maxlength="300" placeholder="e.g. Reach, leads, engagement rate" required></div>
            <div class="form-group"><label>Campaign Status *</label><select id="campStatus" class="form-control"><option>UPCOMING</option><option>ACTIVE</option><option>ON_HOLD</option></select></div>
            <div class="form-group"><label>Client Portal Access *</label><select id="campClientAccess" class="form-control"><option value="AVAILABLE">AVAILABLE</option><option value="NOT_AVAILABLE">NOT AVAILABLE</option></select></div>
            <button type="submit" class="btn-primary" style="width:100%;">Create Campaign</button>
        </form>`;
    showPortalModal();
}

function saveCampaign(e) {
    e.preventDefault();
    const title = document.getElementById('campTitle').value.trim();
    const client = document.getElementById('campClient').value.trim();
    const clientEmail = document.getElementById('campClientEmail').value.trim().toLowerCase();
    const budget = parseFloat(document.getElementById('campBudget').value);
    const startDate = document.getElementById('campStart').value;
    const endDate = document.getElementById('campEnd').value;
    const brief = document.getElementById('campBrief').value.trim();
    const objectives = document.getElementById('campObjectives').value.trim();
    const deliverables = document.getElementById('campDeliverables').value.trim();
    const audience = document.getElementById('campAudience').value.trim();
    const channels = document.getElementById('campChannels').value.trim();
    const kpis = document.getElementById('campKpis').value.trim();
    const campStatus = document.getElementById('campStatus').value;

    if (title.length < 2 || title.length > 120) return alert('Campaign title must be 2-120 characters.');
    if (/^\d+$/.test(title) || !/[A-Za-z]/.test(title)) return alert('Campaign title must contain letters and cannot be purely numbers.');
    if (client.length < 1) return alert('Please enter a valid client/company name.');
    if (/^\d+$/.test(client) || !/[A-Za-z]/.test(client)) return alert('Client / Company name must contain letters and cannot be numbers only.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) return alert('Please enter a valid client email address.');
    if (!Number.isFinite(budget) || budget <= 0) return alert('Budget must be greater than 0. Negative values are not allowed.');
    if (budget % 100 !== 0) return alert('Allocated Budget must be in multiples of 100 (e.g. 500, 1000, 100000).');
    if (!startDate || !endDate || endDate < startDate) return alert('End date must be on or after the start date.');
    if (!audience) return alert('Please enter Target Audience.');
    if (!channels) return alert('Please enter Channels.');
    if (!objectives) return alert('Please enter Objectives.');
    if (!brief) return alert('Please enter Creative Brief.');
    if (!deliverables) return alert('Please enter Expected Deliverables.');
    if (!kpis) return alert('Please enter KPIs / Success Measures.');
    if (store.campaigns.some(c => c.title.toLowerCase() === title.toLowerCase())) return alert('A campaign with this title already exists.');

    const newCampObj = {
        id: Date.now(), title, client, clientEmail, createdByEmail: '', manager: store.currentUser?.name || 'Campaign Manager',
        campaignType: document.getElementById('campType').value, priority: document.getElementById('campPriority').value,
        targetAudience: audience, channels, objectives, deliverables, kpis, budget, spent: 0,
        start: startDate, end: endDate, status: campStatus,
        approvalStatus: 'APPROVED', clientAccess: document.getElementById('campClientAccess').value,
        requestSource: 'AGENCY', brief
    };

    store.campaigns.push(newCampObj);
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.createCampaign({
            campaignName: title,
            title: title,
            clientId: 1,
            managerId: 3,
            budget: budget,
            startDate: startDate,
            endDate: endDate,
            objective: objectives,
            creativeBrief: brief,
            status: campStatus === 'UPCOMING' ? 'PLANNING' : (campStatus === 'ACTIVE' ? 'IN_PROGRESS' : 'COMPLETED')
        }).catch(err => console.warn('Campaign DB create sync:', err));
    }

    closeModal(); renderCurrentModule();
}
function editCampaign(id) {
    const c = store.campaigns.find(x => x.id === id); if (!c) return;
    document.getElementById('modalTitle').innerText = 'Edit Campaign';
    document.getElementById('modalBody').innerHTML = `<form onsubmit="updateCampaign(event,${id})">
      <div class="form-group"><label>Campaign Title *</label><input id="campEditTitle" class="form-control" maxlength="120" value="${escapeHtml(c.title)}" required></div>
      <div class="form-group"><label>Client *</label><input id="campEditClient" class="form-control" value="${escapeHtml(c.client||'')}" required></div>
      <div class="form-group"><label>Client Email</label><input id="campEditClientEmail" type="email" class="form-control" value="${escapeHtml(c.clientEmail||'')}"></div>
      <div class="form-group"><label>Budget (LKR) *</label><input id="campEditBudget" type="number" min="100" step="100" class="form-control" value="${c.budget}" onkeydown="if(event.key==='-') event.preventDefault();" required></div>
      <div class="form-group"><label>Start Date *</label><input id="campEditStart" type="date" class="form-control" value="${c.start||''}" required></div>
      <div class="form-group"><label>End Date *</label><input id="campEditEnd" type="date" class="form-control" value="${c.end||''}" required></div>
      <div class="form-group"><label>Status *</label><select id="campEditStatus" class="form-control">${['REQUESTED','UPCOMING','ACTIVE','ON_HOLD','COMPLETED','ARCHIVED','REJECTED'].map(v=>`<option ${c.status===v?'selected':''}>${v}</option>`).join('')}</select></div>
      <div class="form-group"><label>Client Portal Access *</label><select id="campEditAccess" class="form-control"><option value="AVAILABLE" ${c.clientAccess!=='NOT_AVAILABLE'?'selected':''}>AVAILABLE</option><option value="NOT_AVAILABLE" ${c.clientAccess==='NOT_AVAILABLE'?'selected':''}>NOT AVAILABLE</option></select></div>
      <div class="form-group"><label>Target Audience</label><input id="campEditAudience" class="form-control" value="${escapeHtml(c.targetAudience||'')}"></div>
      <div class="form-group"><label>Channels</label><input id="campEditChannels" class="form-control" value="${escapeHtml(c.channels||'')}"></div>
      <div class="form-group"><label>Objectives</label><textarea id="campEditObjectives" class="form-control">${escapeHtml(c.objectives||'')}</textarea></div>
      <div class="form-group"><label>Expected Deliverables</label><textarea id="campEditDeliverables" class="form-control">${escapeHtml(c.deliverables||'')}</textarea></div>
      <div class="form-group"><label>KPIs</label><input id="campEditKpis" class="form-control" value="${escapeHtml(c.kpis||'')}"></div>
      <div class="form-group"><label>Creative Brief</label><textarea id="campEditBrief" class="form-control">${escapeHtml(c.brief||'')}</textarea></div>
      <button class="btn-primary" style="width:100%">Save Campaign</button></form>`;
    showPortalModal();
}
function updateCampaign(e,id){
    e.preventDefault(); const c=store.campaigns.find(x=>x.id===id); if(!c)return;
    const title=document.getElementById('campEditTitle').value.trim(); const budget=parseFloat(document.getElementById('campEditBudget').value);
    const start=document.getElementById('campEditStart').value; const end=document.getElementById('campEditEnd').value;
    const client = document.getElementById('campEditClient').value.trim();
    const statusVal = document.getElementById('campEditStatus').value;
    if(title.length<2||title.length>120)return alert('Campaign title must be 2-120 characters.');
    if (/^\d+$/.test(title) || !/[A-Za-z]/.test(title)) return alert('Campaign title must contain letters and cannot be purely numbers.');
    if (/^\d+$/.test(client) || !/[A-Za-z]/.test(client)) return alert('Client / Company name must contain letters and cannot be numbers only.');
    if(!Number.isFinite(budget)||budget<=0)return alert('Budget must be greater than 0. Negative values are not allowed.');
    if(budget % 100 !== 0)return alert('Budget must be in multiples of 100.');
    if(!start||!end||end<start)return alert('End date must be on or after start date.');
    if(store.campaigns.some(x=>x.id!==id&&x.title.toLowerCase()===title.toLowerCase()))return alert('Another campaign already uses this title.');
    Object.assign(c,{title,client,clientEmail:document.getElementById('campEditClientEmail').value.trim().toLowerCase(),budget,start,end,status:statusVal,clientAccess:document.getElementById('campEditAccess').value,targetAudience:document.getElementById('campEditAudience').value.trim(),channels:document.getElementById('campEditChannels').value.trim(),objectives:document.getElementById('campEditObjectives').value.trim(),deliverables:document.getElementById('campEditDeliverables').value.trim(),kpis:document.getElementById('campEditKpis').value.trim(),brief:document.getElementById('campEditBrief').value.trim()});
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateCampaign({
            campaignId: id,
            id: id,
            campaignName: title,
            title: title,
            clientId: 1,
            managerId: 3,
            budget: budget,
            startDate: start,
            endDate: end,
            status: statusVal === 'UPCOMING' ? 'PLANNING' : (statusVal === 'ACTIVE' ? 'IN_PROGRESS' : 'COMPLETED')
        }).catch(err => console.warn('Campaign DB update sync:', err));
    }

    closeModal();renderCurrentModule();
}
function approveCampaignRequest(id, decision){
    const c=store.campaigns.find(x=>x.id===id); if(!c)return;
    if(decision==='APPROVE'){
        c.approvalStatus='APPROVED'; c.status='UPCOMING'; c.approvedAt=new Date().toISOString(); c.approvedBy=store.currentUser?.name||'Campaign Manager';
        if(!c.end){ const d=new Date(c.start||Date.now()); d.setMonth(d.getMonth()+2); c.end=d.toISOString().split('T')[0]; }
        c.clientAccess='AVAILABLE';
        addNotification('Campaign Approved', `"${c.title}" was approved. The Task & Project team can now assign production work.`, '✅');
        alert('Campaign approved. It is now ready for task assignment.');
    } else {
        const reason=prompt('Reason for rejecting this campaign request:'); if(!reason||!reason.trim())return;
        c.approvalStatus='REJECTED'; c.status='REJECTED'; c.rejectionReason=reason.trim();
        addNotification('Campaign Request Rejected', `"${c.title}" was rejected: ${reason.trim()}`, '❌');
    }
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateCampaign({
            campaignId: id,
            id: id,
            status: c.status === 'UPCOMING' ? 'PLANNING' : 'COMPLETED'
        }).catch(err => console.warn('Campaign DB approval sync:', err));
    }

    renderCurrentModule();
}

function openAssignCreativeModal(id, isApproving = false) {
    const c = store.campaigns.find(x => x.id === id);
    if (!c) return;

    document.getElementById('modalTitle').innerText = isApproving ? `✅ Approve & Assign Creative — ${c.title}` : `🎨 Assign Creative Staff — ${c.title}`;
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveAssignCreative(event, ${id}, ${isApproving})">
            <div class="card-box" style="margin-bottom:14px; background:var(--blue-soft); border-color:var(--border-blue);">
                <div style="font-size:0.95rem; font-weight:800; color:var(--blue-electric); margin-bottom:4px;">${escapeHtml(c.title)}</div>
                <div style="font-size:0.85rem; color:var(--text-secondary);">Client: <strong>${escapeHtml(c.client||'Client')}</strong> | Budget: <strong>LKR ${(c.budget||0).toLocaleString()}</strong> | Timeline: <strong>${c.start||'-'} to ${c.end||'-'}</strong></div>
                ${c.brief ? `<div style="font-size:0.82rem; color:var(--text-secondary); margin-top:6px; font-style:italic;">Client Request Brief / Notes: "${escapeHtml(c.brief)}"</div>` : ''}
            </div>

            <div class="form-group">
                <label>Assign to Creative Asset Specialist / Staff *</label>
                <select id="assignCreativeStaff" class="form-control" required>
                    <option value="Navodi V.G.C (Creative Staff - Lead Visual Designer)" ${c.assignedCreativeStaff && c.assignedCreativeStaff.includes('Navodi') ? 'selected' : ''}>Navodi V.G.C (Creative Staff - Lead Visual Designer)</option>
                    <option value="Yashika J. (Creative Staff - Copywriter & Content)" ${c.assignedCreativeStaff && c.assignedCreativeStaff.includes('Yashika') ? 'selected' : ''}>Yashika J. (Creative Staff - Copywriter & Content)</option>
                    <option value="Creative Asset Manager (Agency Asset Desk)" ${c.assignedCreativeStaff && c.assignedCreativeStaff.includes('Manager') ? 'selected' : ''}>Creative Asset Manager (Agency Asset Desk)</option>
                </select>
            </div>

            <div class="form-group">
                <label>Creative Deliverables / Specifications *</label>
                <textarea id="assignCreativeDeliverables" class="form-control" rows="2" placeholder="e.g. 3D Billboard LED Video, 6 Social media promo carousels, 1 Key Visual poster" required>${escapeHtml(c.creativeDeliverables || c.deliverables || 'Produce complete campaign key visuals and digital assets.')}</textarea>
            </div>

            <div class="form-group">
                <label>Creative Instructions & Brand Guidelines *</label>
                <textarea id="assignCreativeNotes" class="form-control" rows="3" placeholder="Provide specific creative direction, color palette, tagline, and brand instructions for the creative specialist..." required>${escapeHtml(c.creativeNotes || c.brief || 'Follow brand guidelines and prepare high-res creative assets for review.')}</textarea>
            </div>

            <div class="form-group">
                <label>Target Creative Completion Deadline *</label>
                <input type="date" id="assignCreativeDeadline" class="form-control" value="${c.creativeDeadline || c.end || (c.start ? c.start : '2026-04-15')}" required>
            </div>

            <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:12px; background:#10B981; border-color:#10B981;">
                ${isApproving ? '✅ Approve Campaign & Dispatch to Creative Assets' : '💾 Update Creative Staff Assignment'}
            </button>
        </form>
    `;
    showPortalModal();
}

function saveAssignCreative(e, id, isApproving) {
    e.preventDefault();
    const c = store.campaigns.find(x => x.id === id);
    if (!c) return;

    const staff = document.getElementById('assignCreativeStaff').value;
    const deliverables = document.getElementById('assignCreativeDeliverables').value.trim();
    const notes = document.getElementById('assignCreativeNotes').value.trim();
    const deadline = document.getElementById('assignCreativeDeadline').value;

    if (!staff || !deliverables || !deadline) {
        alert('Please fill in all required creative assignment fields.');
        return;
    }

    c.assignedCreativeStaff = staff;
    c.creativeDeliverables = deliverables;
    c.creativeNotes = notes;
    c.creativeDeadline = deadline;

    if (isApproving || c.approvalStatus === 'PENDING') {
        c.approvalStatus = 'APPROVED';
        c.status = 'ACTIVE';
        c.approvedAt = new Date().toISOString();
        c.approvedBy = store.currentUser?.name || 'Project Manager';
        c.clientAccess = 'AVAILABLE';
        if (!c.end) c.end = deadline;
    }

    // Automatically create or update corresponding production task in Task & Project Management
    const existingTask = store.tasks.find(t => t.campaignId === c.id && t.title.includes('Creative Deliverables'));
    if (!existingTask) {
        store.tasks.unshift({
            id: Date.now(),
            title: `Creative Production: ${c.title}`,
            description: `${deliverables}. Instructions: ${notes}`,
            campaign: c.title,
            campaignId: c.id,
            assignee: staff.split('(')[0].trim(),
            assigneeEmail: staff.includes('Yashika') ? 'yashika@brightwave.lk' : 'navodi@brightwave.lk',
            creator: store.currentUser?.name || 'Project Manager',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            deadline: deadline,
            attachedFiles: ['Campaign_Creative_Brief.pdf'],
            comments: [
                { author: store.currentUser?.name || 'Project Manager', text: `Assigned project for creative asset production: ${notes}`, time: new Date().toLocaleString() }
            ],
            createdAt: new Date().toISOString().slice(0, 10)
        });
    }

    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateCampaign({
            campaignId: id,
            id: id,
            status: 'IN_PROGRESS'
        }).catch(err => console.warn('Campaign DB assign sync:', err));
    }

    addNotification('Creative Project Assigned', `Campaign "${c.title}" assigned to ${staff.split('(')[0].trim()} for creative assets.`, '🎨');
    closeModal();
    alert(`Campaign successfully assigned to ${staff.split('(')[0].trim()}! It is now visible in the Creative Asset Management bar.`);
    renderCurrentModule();
}

function archiveCampaign(id){
    const c = store.campaigns.find(x => x.id === id);
    if(c){
        if(c.status === 'ARCHIVED'){
            c.status = c.previousStatus || 'ACTIVE';
        } else {
            c.previousStatus = c.status || 'ACTIVE';
            c.status = 'ARCHIVED';
        }
        saveWorkflowDataToStorage();
        if (window.AdFlowAPI) {
            AdFlowAPI.updateCampaign({
                campaignId: id,
                id: id,
                status: c.status === 'ACTIVE' ? 'IN_PROGRESS' : 'COMPLETED'
            }).catch(err => console.warn('Campaign archive DB sync:', err));
        }
        renderCurrentModule();
    }
}

function deleteCampaign(id){
    if(confirm('Permanently delete this campaign?')){
        store.campaigns=store.campaigns.filter(x=>x.id!==id);
        saveWorkflowDataToStorage();
        if (window.AdFlowAPI) {
            AdFlowAPI.deleteCampaign(id).catch(err => console.warn('Campaign DB delete sync:', err));
        }
        renderCurrentModule();
    }
}

// ----------------------------------------------------------------------------
// 3. TASK & PROJECT MANAGEMENT (Wickramanayaka A.W.H.D)
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// 3. TASK & PROJECT MANAGEMENT (Wickramanayaka A.W.H.D)
// ----------------------------------------------------------------------------
function renderTasks(container) {
    const isClient = store.currentRole === 'CLIENT';
    const isCreativeStaff = store.currentRole === 'CREATIVE_STAFF';
    const isManager = !isClient && !isCreativeStaff;

    // Filter Tasks based on Role Permission
    let visibleTasks = store.tasks;

    if (isCreativeStaff) {
        // Creative Staff can ONLY see their own assigned tasks ("My Tasks")
        const loggedInEmail = store.currentUser ? store.currentUser.email.toLowerCase() : 'navodi@brightwave.lk';
        const loggedInName = store.currentUser ? store.currentUser.name.toLowerCase() : '';
        
        visibleTasks = store.tasks.filter(t => 
            (t.assigneeEmail && t.assigneeEmail.toLowerCase() === loggedInEmail) ||
            (t.assignee && loggedInName && t.assignee.toLowerCase().includes(loggedInName))
        );
    }

    // Apply Status Filter if set
    if (store.taskFilterStatus && store.taskFilterStatus !== 'ALL') {
        visibleTasks = visibleTasks.filter(t => t.status === store.taskFilterStatus);
    }

    // Apply Priority Filter if set
    if (store.taskFilterPriority && store.taskFilterPriority !== 'ALL') {
        visibleTasks = visibleTasks.filter(t => t.priority === store.taskFilterPriority);
    }

    // Overdue Tasks Alert Check (Deadlines before today 2026-03-09)
    const overdueTasks = visibleTasks.filter(t => t.deadline < '2026-03-09' && t.status !== 'COMPLETED');

    // CLIENT VIEW MODE: simple campaign-to-delivery workflow for campaigns belonging to this client.
    if (isClient) {
        let clientCampaigns = [];
        let clientTasks = [];
        if (store.currentUser && store.currentUser.email) {
            const userEmail = store.currentUser.email.toLowerCase();
            const userName = store.currentUser.name ? store.currentUser.name.toLowerCase() : '';
            const userCompany = store.currentUser.company ? store.currentUser.company.toLowerCase() : '';
            clientCampaigns = store.campaigns.filter(c =>
                (c.createdByEmail && c.createdByEmail.toLowerCase() === userEmail) ||
                (c.clientEmail && c.clientEmail.toLowerCase() === userEmail) ||
                (c.client && userName && c.client.toLowerCase() === userName) ||
                (c.client && userCompany && c.client.toLowerCase() === userCompany)
            ).filter(c => c.clientAccess !== 'NOT_AVAILABLE');
            const titles = clientCampaigns.map(c => (c.title||'').toLowerCase());
            clientTasks = store.tasks.filter(t => t.campaign && titles.includes(t.campaign.toLowerCase()));
        }

        const workflowFor = (campaign) => {
            const tasks = clientTasks.filter(t => t.campaign === campaign.title);
            let step = 1;
            if ((campaign.approvalStatus||'APPROVED') === 'APPROVED') step = 2;
            if (tasks.length) step = 3;
            if (tasks.some(t => ['IN_PROGRESS','NEEDS_REVISION'].includes(t.status))) step = 4;
            if (tasks.some(t => t.status === 'IN_REVIEW')) step = 5;
            if (tasks.length && tasks.every(t => t.status === 'COMPLETED')) step = 6;
            if (campaign.approvalStatus === 'REJECTED') step = 0;
            return {tasks, step};
        };
        const stages = ['Request Submitted','Agency Approved','Tasks Assigned','In Production','Review','Completed'];

        container.innerHTML = `
            <div class="page-header"><div class="page-title"><h2>📋 My Campaign Workflow</h2><p>See what happens after you request a campaign, from agency approval to final completion.</p></div></div>
            <div class="card-box" style="margin-bottom:20px;background:var(--blue-soft);border-color:var(--border-blue);">
                <strong>Simple process:</strong> Campaign Request → Agency Approval → Tasks Assigned → Creative Production → Review → Completed
            </div>
            ${clientCampaigns.length === 0 ? `<div class="card-box" style="text-align:center;padding:30px;color:var(--text-secondary);">You do not have any campaign requests yet. Request a campaign from the Campaigns page and its workflow will appear here.</div>` : clientCampaigns.map(c => {
                const wf=workflowFor(c); const completed=wf.tasks.filter(t=>t.status==='COMPLETED').length; const pct=wf.tasks.length?Math.round(completed/wf.tasks.length*100):0;
                return `<div class="card-box" style="margin-bottom:22px;">
                    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px;"><div><h3 style="margin:0 0 4px;">${escapeHtml(c.title)}</h3><span style="font-size:.85rem;color:var(--text-secondary);">Requested/managed for ${escapeHtml(c.client||'your account')}</span></div><div><span class="badge badge-${(c.approvalStatus||'APPROVED').toLowerCase()}">${escapeHtml(c.approvalStatus||'APPROVED')}</span> <span class="badge badge-${(c.status||'UPCOMING').toLowerCase()}">${escapeHtml(c.status||'UPCOMING')}</span></div></div>
                    ${c.approvalStatus==='REJECTED' ? `<div style="padding:12px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;color:#991B1B;">Request rejected${c.rejectionReason?`: ${escapeHtml(c.rejectionReason)}`:''}</div>` : `
                    <div style="display:grid;grid-template-columns:repeat(6,minmax(110px,1fr));gap:8px;margin-bottom:18px;overflow-x:auto;">
                        ${stages.map((label,i)=>`<div style="min-width:110px;padding:10px 8px;border-radius:9px;text-align:center;border:1px solid ${wf.step>=i+1?'#93C5FD':'var(--border-blue)'};background:${wf.step>=i+1?'#EFF6FF':'#fff'};"><div style="font-size:1.1rem;">${wf.step>=i+1?'✅':'○'}</div><div style="font-size:.74rem;font-weight:800;">${label}</div></div>`).join('')}
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>Campaign Deliverables</strong><span style="font-size:.82rem;color:var(--text-secondary);">${completed}/${wf.tasks.length} complete • ${pct}%</span></div>
                    <div style="height:10px;background:var(--blue-soft);border-radius:8px;overflow:hidden;margin-bottom:14px;"><div style="height:100%;width:${pct}%;background:#10B981;"></div></div>
                    ${wf.tasks.length===0 ? `<div style="padding:14px;text-align:center;color:var(--text-secondary);border:1px dashed var(--border-blue);border-radius:8px;">${c.approvalStatus==='PENDING'?'Waiting for agency approval.':'Campaign approved. Waiting for the Task & Project Manager to assign production tasks.'}</div>` : `<div class="table-container"><table class="data-table"><thead><tr><th>Deliverable</th><th>Deadline</th><th>Status</th></tr></thead><tbody>${wf.tasks.map(t=>`<tr><td><strong>${escapeHtml(t.title)}</strong></td><td>${escapeHtml(t.deadline||'-')}</td><td><span class="badge badge-${(t.status||'TO_DO').toLowerCase()}">${escapeHtml((t.status||'TO_DO').replaceAll('_',' '))}</span></td></tr>`).join('')}</tbody></table></div>`}
                    `}
                </div>`;
            }).join('')}`;
        return;
    }

    // MANAGER / CREATIVE STAFF FULL TASK KANBAN & LIST VIEW
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h2>📋 Task & Project Workflow</h2>
                <p>${isCreativeStaff ? '👨‍🎨 My Assigned Creative Tasks & Deliverables' : 'Assign, monitor, and execute creative tasks & project deliverables.'}</p>
            </div>
            <div style="display:flex; gap:12px; align-items:center;">
                ${isManager ? `<button class="btn-primary" onclick="openTaskModal()">+ Assign New Task</button>` : ''}
            </div>
        </div>

        ${overdueTasks.length > 0 && isManager ? `
            <div class="overdue-alert-widget">
                <span>⚠️ <strong>Overdue Task Alert:</strong> ${overdueTasks.length} task(s) have passed their scheduled deadline!</span>
                <span style="font-size:0.8rem; background:rgba(220,38,38,0.15); padding:4px 10px; border-radius:4px;">Action Required</span>
            </div>
        ` : ''}

        <!-- Header Controls & Filters -->
        <div class="task-header-controls">
            <div class="view-mode-toggle">
                <button class="view-btn ${store.taskViewMode === 'kanban' ? 'active' : ''}" onclick="switchTaskViewMode('kanban')">📋 Kanban Board</button>
                <button class="view-btn ${store.taskViewMode === 'list' ? 'active' : ''}" onclick="switchTaskViewMode('list')">📑 List View</button>
            </div>

            <div style="display:flex; gap:10px; align-items:center;">
                <label style="font-size:0.82rem; font-weight:700;">Filter Priority:</label>
                <select class="form-control" style="padding:6px 10px; font-size:0.82rem; width:auto;" onchange="filterTasksByPriority(this.value)">
                    <option value="ALL" ${store.taskFilterPriority === 'ALL' ? 'selected' : ''}>All Priorities</option>
                    <option value="HIGH" ${store.taskFilterPriority === 'HIGH' ? 'selected' : ''}>High</option>
                    <option value="MEDIUM" ${store.taskFilterPriority === 'MEDIUM' ? 'selected' : ''}>Medium</option>
                    <option value="LOW" ${store.taskFilterPriority === 'LOW' ? 'selected' : ''}>Low</option>
                </select>

                <label style="font-size:0.82rem; font-weight:700;">Status:</label>
                <select class="form-control" style="padding:6px 10px; font-size:0.82rem; width:auto;" onchange="filterTasksByStatus(this.value)">
                    <option value="ALL" ${store.taskFilterStatus === 'ALL' ? 'selected' : ''}>All Statuses</option>
                    <option value="TO_DO" ${store.taskFilterStatus === 'TO_DO' ? 'selected' : ''}>To Do</option>
                    <option value="IN_PROGRESS" ${store.taskFilterStatus === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
                    <option value="IN_REVIEW" ${store.taskFilterStatus === 'IN_REVIEW' ? 'selected' : ''}>In Review</option>
                    <option value="NEEDS_REVISION" ${store.taskFilterStatus === 'NEEDS_REVISION' ? 'selected' : ''}>Needs Revision</option>
                    <option value="COMPLETED" ${store.taskFilterStatus === 'COMPLETED' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
        </div>

        ${store.taskViewMode === 'kanban' ? renderKanbanBoard(visibleTasks) : renderTaskListView(visibleTasks)}
    `;
}

// Render Kanban Board View
function renderKanbanBoard(tasks) {
    const columns = [
        { key: 'TO_DO', title: '📌 To Do', border: '#64748B' },
        { key: 'IN_PROGRESS', title: '⚡ In Progress', border: '#2563EB' },
        { key: 'IN_REVIEW', title: '🔍 In Review', border: '#D97706' },
        { key: 'NEEDS_REVISION', title: '⚠️ Needs Revision', border: '#DC2626' },
        { key: 'COMPLETED', title: '✅ Completed', border: '#10B981' }
    ];

    return `
        <div class="kanban-board-container">
            ${columns.map(col => {
                const colTasks = tasks.filter(t => t.status === col.key);
                return `
                    <div class="kanban-column" style="border-top: 4px solid ${col.border};">
                        <div class="kanban-column-header">
                            <span>${col.title}</span>
                            <span class="column-count-badge">${colTasks.length}</span>
                        </div>
                        <div class="kanban-cards-wrapper">
                            ${colTasks.map(t => renderKanbanCard(t)).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Render Individual Kanban Card
function renderKanbanCard(t) {
    const isOverdue = t.deadline < '2026-03-09' && t.status !== 'COMPLETED';
    const avatarInitials = t.assignee ? t.assignee.split(' ').map(n => n[0]).join('') : 'CS';
    const isClient = store.currentRole === 'CLIENT';
    const isCreativeStaff = store.currentRole === 'CREATIVE_STAFF';
    const isManager = !isClient && !isCreativeStaff;

    return `
        <div class="kanban-card" onclick="openTaskDetailModal(${t.id})">
            <div class="kanban-card-header">
                <span class="priority-tag priority-${(t.priority || 'MEDIUM').toLowerCase()}">${escapeHtml(t.priority || 'MEDIUM')}</span>
                <span class="badge badge-${(t.status || 'TO_DO').toLowerCase()}" style="font-size:0.68rem;">${escapeHtml((t.status || 'TO_DO').replaceAll('_', ' '))}</span>
            </div>
            <div class="kanban-card-title">${escapeHtml(t.title || 'Untitled Task')}</div>
            <div class="kanban-card-campaign">📂 ${escapeHtml(t.campaign || 'General')}</div>
            <div class="kanban-card-footer">
                <div class="assignee-avatar">
                    <div class="avatar-circle">${avatarInitials}</div>
                    <span>${escapeHtml(t.assignee || 'Unassigned')}</span>
                </div>
                <div class="deadline-tag ${isOverdue ? 'deadline-overdue' : ''}">
                    📅 ${escapeHtml(t.deadline || '-')} ${isOverdue ? '⚠️ OVERDUE' : ''}
                </div>
            </div>
            ${isManager ? `
                <div class="kanban-card-actions" onclick="event.stopPropagation()">
                    <button type="button" class="btn-card-action btn-card-edit" onclick="openEditTaskModal(${t.id})" title="Edit Task">✏️ Edit</button>
                    <button type="button" class="btn-card-action btn-card-delete" onclick="deleteTask(${t.id})" title="Delete Task">🗑️ Delete</button>
                </div>
            ` : ''}
        </div>
    `;
}

// Render Task List Table View
function renderTaskListView(tasks) {
    const isClient = store.currentRole === 'CLIENT';
    const isCreativeStaff = store.currentRole === 'CREATIVE_STAFF';
    const isManager = !isClient && !isCreativeStaff;

    return `
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Task Title</th>
                        <th>Campaign</th>
                        <th>Assigned Staff</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tasks.length === 0 ? `
                        <tr>
                            <td colspan="7" style="text-align:center; padding:30px; color:var(--text-secondary);">No tasks match the selected filters.</td>
                        </tr>
                    ` : tasks.map(t => {
                        const isOverdue = t.deadline < '2026-03-09' && t.status !== 'COMPLETED';
                        return `
                            <tr>
                                <td><strong>${escapeHtml(t.title)}</strong></td>
                                <td>${escapeHtml(t.campaign || '-')}</td>
                                <td>${escapeHtml(t.assignee || '-')}</td>
                                <td><span class="priority-tag priority-${(t.priority || 'MEDIUM').toLowerCase()}">${escapeHtml(t.priority || 'MEDIUM')}</span></td>
                                <td><span class="badge badge-${(t.status || 'TO_DO').toLowerCase()}">${escapeHtml((t.status || 'TO_DO').replaceAll('_', ' '))}</span></td>
                                <td class="${isOverdue ? 'deadline-overdue' : ''}">${escapeHtml(t.deadline || '-')} ${isOverdue ? '⚠️' : ''}</td>
                                <td>
                                    <div style="display:flex; gap:6px; align-items:center;">
                                        <button class="btn-secondary" style="padding:5px 10px; font-size:0.8rem;" onclick="openTaskDetailModal(${t.id})">🔍 View</button>
                                        ${isManager ? `
                                            <button class="btn-secondary" style="padding:5px 10px; font-size:0.8rem; background:#EFF6FF; border-color:#BFDBFE; color:var(--blue-electric);" onclick="openEditTaskModal(${t.id})" title="Edit Task">✏️ Edit</button>
                                            <button class="btn-danger" style="padding:5px 10px; font-size:0.8rem;" onclick="deleteTask(${t.id})" title="Delete Task">🗑️ Delete</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Switch Task View Mode (Kanban vs List)
function switchTaskViewMode(mode) {
    store.taskViewMode = mode;
    renderCurrentModule();
}

function filterTasksByStatus(status) {
    store.taskFilterStatus = status;
    renderCurrentModule();
}

function filterTasksByPriority(priority) {
    store.taskFilterPriority = priority;
    renderCurrentModule();
}

// Open Detailed Task Panel & Workflow Modal
function openTaskDetailModal(id) {
    const task = store.tasks.find(t => t.id === id);
    if (!task) return;

    const isClient = store.currentRole === 'CLIENT';
    const isCreativeStaff = store.currentRole === 'CREATIVE_STAFF';
    const isManager = !isClient && !isCreativeStaff;

    document.getElementById('modalTitle').innerText = `📋 Task Details: ${task.title}`;
    document.getElementById('modalBody').innerHTML = `
        <div style="padding-bottom:12px; border-bottom:1px solid var(--border-blue); margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span class="priority-tag priority-${(task.priority || 'MEDIUM').toLowerCase()}">Priority: ${escapeHtml(task.priority || 'MEDIUM')}</span>
                <span class="badge badge-${(task.status || 'TO_DO').toLowerCase()}" style="font-size:0.85rem; padding:6px 12px;">Status: ${escapeHtml((task.status || 'TO_DO').replaceAll('_', ' '))}</span>
            </div>
            <p style="font-size:0.9rem; color:var(--text-secondary);"><strong>Campaign:</strong> ${escapeHtml(task.campaign || '-')} | <strong>Assigned To:</strong> ${escapeHtml(task.assignee || '-')} | <strong>Assigned By:</strong> ${escapeHtml(task.creator || 'Task Manager')}</p>
            <p style="font-size:0.88rem; color:var(--black-obsidian); margin-top:8px;"><strong>Description:</strong> ${escapeHtml(task.description || 'No description provided.')}</p>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;"><strong>Deadline:</strong> ${escapeHtml(task.deadline || 'Not set')}</p>
        </div>

        <!-- Attached Files Section -->
        <div style="margin-bottom:16px;">
            <h5 style="font-weight:800; font-size:0.9rem; margin-bottom:6px;">📎 Attached Briefs & Reference Docs:</h5>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${(task.attachedFiles || ['Creative_Brief_Standard.pdf']).map(f => `
                    <span style="background:var(--blue-soft); border:1px solid var(--border-blue); color:var(--blue-electric); padding:4px 10px; border-radius:6px; font-size:0.8rem; font-weight:700;">📄 ${escapeHtml(f)}</span>
                `).join('')}
            </div>
        </div>

        <!-- Submitted Work Zone -->
        <div style="background:#F0F9FF; border:1.5px solid #BAE6FD; border-radius:8px; padding:14px; margin-bottom:16px;">
            <h5 style="font-weight:800; font-size:0.9rem; color:#0369A1; margin-bottom:6px;">🎨 Submitted Creative Work / Deliverable:</h5>
            ${task.uploadedWork ? `
                <p style="font-size:0.88rem; font-weight:700; color:var(--black-obsidian); margin-bottom:8px;">📦 Work File / Link: <a href="${escapeHtml(task.uploadedWork)}" target="_blank" style="color:var(--blue-electric);">${escapeHtml(task.uploadedWork)}</a></p>
            ` : `<p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:8px;">No work file uploaded yet.</p>`}

            ${isCreativeStaff && task.status !== 'COMPLETED' ? `
                <form onsubmit="submitTaskWork(event, ${task.id})" style="display:flex; gap:8px;">
                    <input type="text" id="workFileInput" class="form-control" placeholder="Enter submission file link or file name (e.g. 5G_Banner_Final.zip)" required>
                    <button type="submit" class="btn-primary" style="padding:6px 14px; font-size:0.82rem; white-space:nowrap;">Upload Work ➔</button>
                </form>
            ` : ''}
        </div>

        <!-- Comment Thread -->
        <div style="margin-bottom:16px;">
            <h5 style="font-weight:800; font-size:0.9rem; margin-bottom:8px;">💬 Discussion & Feedback Thread:</h5>
            <div class="comment-thread-box">
                ${(!task.comments || task.comments.length === 0) ? `<p style="font-size:0.85rem; color:var(--text-secondary);">No comments yet.</p>` : task.comments.map(c => `
                    <div class="comment-bubble">
                        <div class="comment-author">
                            <span>${escapeHtml(c.author || 'Team Member')}</span>
                            <span class="comment-time">${escapeHtml(c.time || '')}</span>
                        </div>
                        <p style="color:var(--black-obsidian); font-weight:500;">${escapeHtml(c.text || '')}</p>
                    </div>
                `).join('')}
            </div>

            <form onsubmit="addTaskComment(event, ${task.id})" style="display:flex; gap:8px;">
                <input type="text" id="commentTextInput" class="form-control" placeholder="Write feedback or message..." required>
                <button type="submit" class="btn-secondary" style="padding:6px 14px; font-size:0.82rem; white-space:nowrap;">Post Comment</button>
            </form>
        </div>

        <!-- Workflow Status & Review Actions -->
        <div style="border-top:1.5px solid var(--border-blue); padding-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <!-- CREATIVE STAFF ACTIONS -->
            ${isCreativeStaff ? `
                <div style="display:flex; gap:10px; width:100%;">
                    ${task.status === 'TO_DO' ? `
                        <button class="btn-primary" style="width:100%;" onclick="updateTaskStatus(${task.id}, 'IN_PROGRESS')">⚡ Start Working (Move to In Progress)</button>
                    ` : ''}
                    ${task.status === 'IN_PROGRESS' || task.status === 'NEEDS_REVISION' ? `
                        <button class="btn-primary" style="width:100%; background:#D97706; border-color:#D97706;" onclick="updateTaskStatus(${task.id}, 'IN_REVIEW')">🔍 Submit for Team Lead Review (Move to In Review)</button>
                    ` : ''}
                </div>
            ` : ''}

            <!-- MANAGER / CREATIVE TEAM LEAD ACTIONS (EDIT, APPROVE, REVISION, DELETE) -->
            ${isManager ? `
                <div style="display:flex; gap:10px; width:100%; flex-wrap:wrap;">
                    <button class="btn-primary" style="flex:1; min-width:140px;" onclick="openEditTaskModal(${task.id})">✏️ Edit Task Details</button>
                    ${task.status === 'IN_REVIEW' ? `
                        <button class="btn-primary" style="background:#10B981; border-color:#10B981; flex:1; min-width:140px;" onclick="reviewTask(${task.id}, 'APPROVE')">✅ Approve Work</button>
                        <button class="btn-danger" style="flex:1; min-width:140px;" onclick="reviewTask(${task.id}, 'REVISION')">⚠️ Request Revision</button>
                    ` : ''}
                    <button class="btn-danger" onclick="deleteTask(${task.id})" style="padding:8px 16px;">🗑️ Delete Task</button>
                </div>
            ` : ''}
        </div>
    `;
    showPortalModal();
}

function updateTaskStatus(id, newStatus) {
    const task = store.tasks.find(t => t.id === id);
    if (task) {
        task.status = newStatus;
        saveWorkflowDataToStorage();

        if (window.AdFlowAPI) {
            AdFlowAPI.updateTask({
                taskId: id,
                id: id,
                status: newStatus === 'TO_DO' ? 'TODO' : newStatus
            }).catch(err => console.warn('Task status DB sync:', err));
        }

        alert(`Task status moved to "${newStatus.replaceAll('_', ' ')}"! Notification sent.`);
    }
    closeModal();
    renderCurrentModule();
}

function submitTaskWork(e, id) {
    e.preventDefault();
    const task = store.tasks.find(t => t.id === id);
    const workInput = document.getElementById('workFileInput');
    if (task && workInput) {
        task.uploadedWork = workInput.value.trim();
        task.status = 'IN_REVIEW';
        const authorName = store.currentUser ? store.currentUser.name : 'Creative Staff';
        task.comments = task.comments || [];
        task.comments.push({
            author: authorName,
            text: `Uploaded completed work file: ${task.uploadedWork}`,
            time: new Date().toLocaleString()
        });
        saveWorkflowDataToStorage();

        if (window.AdFlowAPI) {
            AdFlowAPI.updateTask({
                taskId: id,
                id: id,
                status: 'NEEDS_REVIEW'
            }).catch(err => console.warn('Task submission DB sync:', err));
        }

        alert(`Work uploaded successfully! Task submitted for Team Lead review.`);
    }
    closeModal();
    renderCurrentModule();
}

function addTaskComment(e, id) {
    e.preventDefault();
    const task = store.tasks.find(t => t.id === id);
    const commentInput = document.getElementById('commentTextInput');
    if (task && commentInput && commentInput.value.trim()) {
        const authorName = store.currentUser ? store.currentUser.name : 'Team Member';
        task.comments = task.comments || [];
        task.comments.push({
            author: authorName,
            text: commentInput.value.trim(),
            time: new Date().toLocaleString()
        });
        saveWorkflowDataToStorage();
        openTaskDetailModal(id);
    }
}

function reviewTask(id, decision) {
    const task = store.tasks.find(t => t.id === id);
    if (!task) return;

    const reviewerName = store.currentUser ? store.currentUser.name : 'Creative Team Lead';
    task.comments = task.comments || [];

    if (decision === 'APPROVE') {
        task.status = 'COMPLETED';
        task.comments.push({
            author: reviewerName,
            text: '✅ Creative work approved and marked as COMPLETED!',
            time: new Date().toLocaleString()
        });
        saveWorkflowDataToStorage();

        if (window.AdFlowAPI) {
            AdFlowAPI.updateTask({
                taskId: id,
                id: id,
                status: 'COMPLETED'
            }).catch(err => console.warn('Task approval DB sync:', err));
        }

        alert('Task approved successfully!');
        closeModal();
        renderCurrentModule();
    } else if (decision === 'REVISION') {
        const reason = prompt('Please enter the required revision feedback for the creative staff:');
        if (reason && reason.trim()) {
            task.status = 'NEEDS_REVISION';
            task.comments.push({
                author: reviewerName,
                text: `⚠️ REVISION REQUESTED: ${reason.trim()}`,
                time: new Date().toLocaleString()
            });
            saveWorkflowDataToStorage();

            if (window.AdFlowAPI) {
                AdFlowAPI.updateTask({
                    taskId: id,
                    id: id,
                    status: 'NEEDS_REVIEW'
                }).catch(err => console.warn('Task revision DB sync:', err));
            }

            alert('Task sent back for revision with feedback!');
            closeModal();
            renderCurrentModule();
        }
    }
}

// ----------------------------------------------------------------------------
// TASK CREATION MODAL
// ----------------------------------------------------------------------------
function openTaskModal() {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    document.getElementById('modalTitle').innerText = '📋 Assign New Creative Task';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveTask(event)">
            <div class="form-group">
                <label>Task Title <span style="color:#DC2626;">*</span></label>
                <input type="text" id="taskTitle" class="form-control" placeholder="e.g. 3D Billboard Animation Design" required>
            </div>
            <div class="form-group">
                <label>Parent Campaign <span style="color:#DC2626;">*</span></label>
                <select id="taskCampaign" class="form-control" required>
                    <option value="">Select campaign...</option>
                    ${store.campaigns.map(c => `
                        <option value="${escapeHtml(c.title)}">${escapeHtml(c.title)} — ${escapeHtml(c.client || 'Client')}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Assign To Creative Staff Member <span style="color:#DC2626;">*</span></label>
                <select id="taskAssignee" class="form-control" required>
                    <option value="Navodi V.G.C (navodi@brightwave.lk)">Navodi V.G.C (Creative Staff - Designer)</option>
                    <option value="Yashika J. (yashika@brightwave.lk)">Yashika J. (Creative Staff - Copywriter)</option>
                    <option value="Wickramanayaka A.W.H.D (projects@brightwave.lk)">Wickramanayaka A.W.H.D (Creative Team Lead)</option>
                    <option value="Mendiya J.L.P.S (campaigns@brightwave.lk)">Mendiya J.L.P.S (Marketing Manager)</option>
                </select>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div class="form-group">
                    <label>Priority Level</label>
                    <select id="taskPriority" class="form-control">
                        <option value="HIGH" selected>High Priority</option>
                        <option value="URGENT">Urgent</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Initial Status</label>
                    <select id="taskInitialStatus" class="form-control">
                        <option value="TO_DO" selected>📌 To Do</option>
                        <option value="IN_PROGRESS">⚡ In Progress</option>
                        <option value="IN_REVIEW">🔍 In Review</option>
                        <option value="NEEDS_REVISION">⚠️ Needs Revision</option>
                        <option value="COMPLETED">✅ Completed</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Deadline Date <span style="color:#DC2626;">*</span></label>
                <input type="date" id="taskDeadline" class="form-control" value="${nextWeek}" min="${today}" required>
            </div>
            <div class="form-group">
                <label>Deliverable Reference / Submission Link (Optional)</label>
                <input type="text" id="taskDeliverableLink" class="form-control" placeholder="e.g. https://drive.google.com/... or Figma link">
            </div>
            <div class="form-group">
                <label>Task Description & Creative Brief <span style="color:#DC2626;">*</span></label>
                <textarea id="taskDesc" class="form-control" rows="3" placeholder="Enter detailed creative brief and specifications..." required></textarea>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary" style="padding:10px 24px;">+ Create & Assign Task ➔</button>
            </div>
        </form>
    `;
    showPortalModal();
}

function saveTask(e) {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    const campaignTitle = document.getElementById('taskCampaign').value;
    const assigneeRaw = document.getElementById('taskAssignee').value;
    const priority = document.getElementById('taskPriority').value;
    const status = document.getElementById('taskInitialStatus').value;
    const deadline = document.getElementById('taskDeadline').value;
    const deliverableLink = document.getElementById('taskDeliverableLink').value.trim();
    const desc = document.getElementById('taskDesc').value.trim();

    let assigneeName = assigneeRaw;
    let assigneeEmail = 'navodi@brightwave.lk';
    if (assigneeRaw.includes('(')) {
        assigneeName = assigneeRaw.split(' (')[0].trim();
        const match = assigneeRaw.match(/\((.*?)\)/);
        if (match) assigneeEmail = match[1];
    }

    const creatorName = store.currentUser ? store.currentUser.name : 'Wickramanayaka A.W.H.D';
    const campaignObj = store.campaigns.find(c => c.title === campaignTitle) || {};
    const campaignIdVal = campaignObj.id || 1;
    const assignedIdVal = assigneeName.includes('Yashika') ? 6 : (assigneeName.includes('Wickramanayaka') ? 4 : (assigneeName.includes('Mendiya') ? 3 : 5));

    const newTask = {
        id: Date.now(),
        title: title,
        description: desc,
        campaign: campaignTitle,
        campaignId: campaignIdVal,
        assignee: assigneeName,
        assigneeEmail: assigneeEmail,
        creator: creatorName,
        priority: priority,
        status: status,
        deadline: deadline,
        attachedFiles: ['Creative_Brief_Standard.pdf'],
        uploadedWork: deliverableLink || '',
        comments: [
            { author: creatorName, text: `Task created and assigned to ${assigneeName}.`, time: new Date().toLocaleString() }
        ],
        createdAt: new Date().toISOString().split('T')[0]
    };

    store.tasks.push(newTask);
    addNotification('Task Assigned', `New task "${title}" assigned to ${assigneeName}.`, '📋');
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.createTask({
            campaignId: campaignIdVal,
            assignedToId: assignedIdVal,
            createdById: 4,
            title: title,
            taskTitle: title,
            description: desc,
            desc: desc,
            priority: priority,
            status: status === 'TO_DO' ? 'TODO' : status,
            deadline: deadline
        }).catch(err => console.warn('Task DB create sync:', err));
    }

    closeModal();
    renderCurrentModule();
    alert(`Task "${title}" created and assigned successfully!`);
}

// ----------------------------------------------------------------------------
// TASK EDIT / UPDATE MODAL
// ----------------------------------------------------------------------------
function openEditTaskModal(id) {
    const task = store.tasks.find(t => t.id === id);
    if (!task) return;

    const isClient = store.currentRole === 'CLIENT';
    const isCreativeStaff = store.currentRole === 'CREATIVE_STAFF';
    const isManager = !isClient && !isCreativeStaff;

    if (!isManager) {
        alert('Only Task & Project Managers or Administrators can edit task details.');
        return;
    }

    document.getElementById('modalTitle').innerText = `✏️ Edit Task: ${task.title}`;
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveEditedTask(event, ${task.id})">
            <div class="form-group">
                <label>Task Title <span style="color:#DC2626;">*</span></label>
                <input type="text" id="editTaskTitle" class="form-control" value="${escapeHtml(task.title)}" placeholder="e.g. Graphic Banner Design" required>
            </div>
            <div class="form-group">
                <label>Parent Campaign <span style="color:#DC2626;">*</span></label>
                <select id="editTaskCampaign" class="form-control" required>
                    ${store.campaigns.map(c => `
                        <option value="${escapeHtml(c.title)}" ${c.title === task.campaign ? 'selected' : ''}>${escapeHtml(c.title)} — ${escapeHtml(c.client || 'Client')}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Assign To Staff Member <span style="color:#DC2626;">*</span></label>
                <select id="editTaskAssignee" class="form-control" required>
                    <option value="Navodi V.G.C (navodi@brightwave.lk)" ${task.assignee && task.assignee.includes('Navodi') ? 'selected' : ''}>Navodi V.G.C (Creative Staff - Designer)</option>
                    <option value="Yashika J. (yashika@brightwave.lk)" ${task.assignee && task.assignee.includes('Yashika') ? 'selected' : ''}>Yashika J. (Creative Staff - Copywriter)</option>
                    <option value="Wickramanayaka A.W.H.D (projects@brightwave.lk)" ${task.assignee && task.assignee.includes('Wickramanayaka') ? 'selected' : ''}>Wickramanayaka A.W.H.D (Creative Team Lead)</option>
                    <option value="Mendiya J.L.P.S (campaigns@brightwave.lk)" ${task.assignee && task.assignee.includes('Mendiya') ? 'selected' : ''}>Mendiya J.L.P.S (Marketing Manager)</option>
                </select>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div class="form-group">
                    <label>Priority Level</label>
                    <select id="editTaskPriority" class="form-control">
                        <option value="LOW" ${task.priority === 'LOW' ? 'selected' : ''}>Low Priority</option>
                        <option value="MEDIUM" ${task.priority === 'MEDIUM' ? 'selected' : ''}>Medium Priority</option>
                        <option value="HIGH" ${task.priority === 'HIGH' ? 'selected' : ''}>High Priority</option>
                        <option value="URGENT" ${task.priority === 'URGENT' ? 'selected' : ''}>Urgent</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Workflow Status</label>
                    <select id="editTaskStatus" class="form-control">
                        <option value="TO_DO" ${task.status === 'TO_DO' ? 'selected' : ''}>📌 To Do</option>
                        <option value="IN_PROGRESS" ${task.status === 'IN_PROGRESS' ? 'selected' : ''}>⚡ In Progress</option>
                        <option value="IN_REVIEW" ${task.status === 'IN_REVIEW' ? 'selected' : ''}>🔍 In Review</option>
                        <option value="NEEDS_REVISION" ${task.status === 'NEEDS_REVISION' ? 'selected' : ''}>⚠️ Needs Revision</option>
                        <option value="COMPLETED" ${task.status === 'COMPLETED' ? 'selected' : ''}>✅ Completed</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Deadline Date <span style="color:#DC2626;">*</span></label>
                <input type="date" id="editTaskDeadline" class="form-control" value="${escapeHtml(task.deadline || '')}" required>
            </div>
            <div class="form-group">
                <label>Deliverable / Submission Link</label>
                <input type="text" id="editTaskLink" class="form-control" value="${escapeHtml(task.uploadedWork || '')}" placeholder="e.g. https://drive.google.com/... or 5G_Banner_Final.zip">
            </div>
            <div class="form-group">
                <label>Task Description & Creative Brief <span style="color:#DC2626;">*</span></label>
                <textarea id="editTaskDesc" class="form-control" rows="3" placeholder="Enter detailed task instructions..." required>${escapeHtml(task.description || '')}</textarea>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:18px; padding-top:12px; border-top:1px solid var(--border-blue);">
                <button type="button" class="btn-danger" onclick="deleteTask(${task.id})">🗑️ Delete Task</button>
                <div style="display:flex; gap:10px;">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn-primary" style="padding:10px 22px;">💾 Save Changes</button>
                </div>
            </div>
        </form>
    `;
    showPortalModal();
}

function saveEditedTask(e, id) {
    e.preventDefault();
    const task = store.tasks.find(t => t.id === id);
    if (!task) return;

    const title = document.getElementById('editTaskTitle').value.trim();
    const campaignTitle = document.getElementById('editTaskCampaign').value;
    const assigneeRaw = document.getElementById('editTaskAssignee').value;
    const priority = document.getElementById('editTaskPriority').value;
    const status = document.getElementById('editTaskStatus').value;
    const deadline = document.getElementById('editTaskDeadline').value;
    const link = document.getElementById('editTaskLink').value.trim();
    const desc = document.getElementById('editTaskDesc').value.trim();

    let assigneeName = assigneeRaw;
    let assigneeEmail = 'navodi@brightwave.lk';
    if (assigneeRaw.includes('(')) {
        assigneeName = assigneeRaw.split(' (')[0].trim();
        const match = assigneeRaw.match(/\((.*?)\)/);
        if (match) assigneeEmail = match[1];
    }

    const campaignObj = store.campaigns.find(c => c.title === campaignTitle) || {};
    const campaignIdVal = campaignObj.id || task.campaignId || 1;
    const assignedIdVal = assigneeName.includes('Yashika') ? 6 : (assigneeName.includes('Wickramanayaka') ? 4 : (assigneeName.includes('Mendiya') ? 3 : 5));

    task.title = title;
    task.campaign = campaignTitle;
    task.campaignId = campaignIdVal;
    task.assignee = assigneeName;
    task.assigneeEmail = assigneeEmail;
    task.priority = priority;
    task.status = status;
    task.deadline = deadline;
    task.description = desc;
    task.uploadedWork = link;

    const modifierName = store.currentUser ? store.currentUser.name : 'Task Manager';
    task.comments = task.comments || [];
    task.comments.push({
        author: modifierName,
        text: `Task details updated. Status set to "${status.replaceAll('_', ' ')}".`,
        time: new Date().toLocaleString()
    });

    addNotification('Task Updated', `Task "${title}" was updated by ${modifierName}.`, '✏️');
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateTask({
            taskId: id,
            id: id,
            campaignId: campaignIdVal,
            assignedToId: assignedIdVal,
            createdById: 4,
            title: title,
            taskTitle: title,
            description: desc,
            desc: desc,
            priority: priority,
            status: status === 'TO_DO' ? 'TODO' : status,
            deadline: deadline
        }).catch(err => console.warn('Task DB update sync:', err));
    }

    closeModal();
    renderCurrentModule();
    alert(`Task "${title}" updated successfully!`);
}

// ----------------------------------------------------------------------------
// TASK DELETION
// ----------------------------------------------------------------------------
function deleteTask(id) {
    const task = store.tasks.find(t => t.id === id);
    if (!task) return;

    if (confirm(`Are you sure you want to permanently delete task "${task.title}"?`)) {
        const title = task.title;
        store.tasks = store.tasks.filter(t => t.id !== id);
        addNotification('Task Deleted', `Task "${title}" was permanently deleted.`, '🗑️');
        saveWorkflowDataToStorage();

        if (window.AdFlowAPI) {
            AdFlowAPI.deleteTask(id).catch(err => console.warn('Task DB delete sync:', err));
        }

        closeModal();
        renderCurrentModule();
        alert(`Task "${title}" has been deleted.`);
    }
}



// ----------------------------------------------------------------------------
// 4. CLIENT FEEDBACK & REVIEW (Client-owned reviews + Agency official responses)
// ----------------------------------------------------------------------------
function renderFeedback(container) {
    const isClient = store.currentRole === 'CLIENT';
    const currentEmail = (store.currentUser && store.currentUser.email ? store.currentUser.email : '').toLowerCase();
    const ownCount = isClient ? store.feedback.filter(f => (f.createdByEmail || '').toLowerCase() === currentEmail).length : 0;
    const avg = store.feedback.length ? (store.feedback.reduce((sum,f)=>sum+(Number(f.rating)||0),0)/store.feedback.length).toFixed(1) : '0.0';

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h2>💬 Client Feedback & Reviews</h2>
                <p>${isClient ? 'Share feedback on completed campaign deliverables, track agency replies, and edit your reviews.' : 'View client feedback and post official agency replies to answer and resolve client reviews.'}</p>
            </div>
            ${isClient ? `<button class="btn-primary" onclick="openFeedbackModal()">+ Give Feedback</button>` : ''}
        </div>

        <div class="stats-grid">
            <div class="stat-card green"><div class="stat-title">Average Rating</div><div class="stat-value">${avg} / 5 ⭐</div><div class="stat-desc">Across all visible client reviews</div></div>
            <div class="stat-card purple"><div class="stat-title">Total Reviews</div><div class="stat-value">${store.feedback.length}</div><div class="stat-desc">Client feedback & revision comments</div></div>
            ${isClient ? `<div class="stat-card"><div class="stat-title">My Feedback</div><div class="stat-value">${ownCount}</div><div class="stat-desc">Reviews you submitted</div></div>` : ''}
        </div>

        <div class="card-box">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">
                <div><h3 style="font-size:1.1rem;font-weight:800;color:var(--black-obsidian);margin:0;">Client Reviews & Agency Dialog</h3><p style="margin:4px 0 0;color:var(--text-secondary);font-size:.82rem;">Agency team leads can answer reviews and mark resolutions in real time.</p></div>
                <input id="feedbackSearch" class="form-control" style="max-width:280px;" placeholder="Search feedback..." oninput="filterFeedbackRows()">
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>Deliverable / Campaign</th><th>Client</th><th>Rating</th><th>Client Feedback & Agency Response</th><th>Status</th><th style="min-width:140px; text-align:center;">Actions</th></tr></thead>
                    <tbody id="feedbackRows">
                        ${store.feedback.length === 0 ? `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-secondary);">No feedback has been submitted yet.</td></tr>` : store.feedback.map(f => {
                            const isOwner = isClient && currentEmail && (f.createdByEmail || '').toLowerCase() === currentEmail;
                            return `<tr data-feedback-search="${`${f.item||''} ${f.client||''} ${f.comments||''} ${f.status||''} ${f.agencyReply||''}`.toLowerCase().replace(/"/g,'&quot;')}">
                                <td><strong>${escapeHtml(f.item || 'General Feedback')}</strong>${f.createdAt ? `<div style="font-size:.75rem;color:var(--text-secondary);margin-top:3px;">${escapeHtml(f.createdAt)}</div>` : ''}</td>
                                <td><strong>${escapeHtml(f.client || 'Client')}</strong></td>
                                <td><span style="color:#F59E0B;font-weight:700;">${'★'.repeat(Number(f.rating)||0)}</span> <span style="font-size:.8rem;color:var(--text-secondary);">(${Number(f.rating)||0}/5)</span></td>
                                <td>
                                    <div style="font-weight:600; color:var(--black-obsidian); line-height:1.4;">“${escapeHtml(f.comments || '')}”</div>
                                    ${f.agencyReply ? `
                                        <div style="margin-top:8px; padding:10px 12px; background:var(--blue-soft); border-left:3px solid var(--blue-electric); border-radius:6px; font-size:0.83rem;">
                                            <div style="font-weight:700; color:var(--blue-electric); display:flex; justify-content:space-between; margin-bottom:2px;">
                                                <span>🏢 Agency Response (${escapeHtml(f.repliedBy || 'Team Lead')}):</span>
                                                <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:normal;">${escapeHtml(f.repliedAt || '')}</span>
                                            </div>
                                            <div style="color:var(--black-obsidian); line-height:1.4;">${escapeHtml(f.agencyReply)}</div>
                                        </div>
                                    ` : ''}
                                </td>
                                <td><span class="badge badge-${(f.status || 'SUBMITTED').toLowerCase()}">${escapeHtml(f.status || 'SUBMITTED')}</span></td>
                                <td style="white-space:nowrap; text-align:center;">
                                    ${isOwner ? `<button class="btn-secondary" style="padding:5px 9px;" onclick="editFeedback(${f.id})">✏️ Edit My Feedback</button>` : ''}
                                    ${!isClient ? `<button class="btn-primary" style="padding:5px 9px; font-size:0.78rem; background:#2563EB;" onclick="openReplyFeedbackModal(${f.id})">${f.agencyReply ? '✏️ Edit Reply' : '💬 Reply to Client'}</button>` : ''}
                                    ${!isOwner && isClient ? `<span style="font-size:.78rem;color:var(--text-secondary);">🔒 Verified review</span>` : ''}
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
}

function filterFeedbackRows() {
    const q = (document.getElementById('feedbackSearch')?.value || '').trim().toLowerCase();
    document.querySelectorAll('#feedbackRows tr[data-feedback-search]').forEach(row => {
        row.style.display = !q || (row.dataset.feedbackSearch || '').includes(q) ? '' : 'none';
    });
}

function openFeedbackModal(defaultItem = '', defaultCampaign = '') {
    if (store.currentRole !== 'CLIENT') { alert('Only clients can submit feedback.'); return; }
    const clientName = store.currentUser && store.currentUser.name ? store.currentUser.name : 'Client User';
    document.getElementById('modalTitle').innerText = '💬 Give Feedback & Review';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveFeedback(event)">
            <div class="form-group"><label>Your Name</label><input class="form-control" value="${escapeHtml(clientName)}" readonly></div>
            <div class="form-group"><label>Deliverable / Campaign Asset *</label><input type="text" id="fbItem" class="form-control" minlength="3" maxlength="120" value="${escapeHtml(defaultItem || defaultCampaign || '')}" placeholder="e.g. 5G Mega Launch - 3D Billboard Artwork" required></div>
            <div class="form-group"><label>Rating (1 to 5 Stars) *</label><select id="fbRating" class="form-control" required><option value="5" selected>⭐⭐⭐⭐⭐ (5/5 - Outstanding)</option><option value="4">⭐⭐⭐⭐ (4/5 - Very Good)</option><option value="3">⭐⭐⭐ (3/5 - Satisfactory)</option><option value="2">⭐⭐ (2/5 - Needs Work)</option><option value="1">⭐ (1/5 - Poor)</option></select></div>
            <div class="form-group"><label>Feedback / Review Comments *</label><textarea id="fbComments" class="form-control" rows="4" minlength="5" maxlength="1000" placeholder="Tell the agency what you liked about the completed work or any revision notes..." required></textarea></div>
            <button type="submit" class="btn-primary" style="width:100%;justify-content:center;padding:12px;background:#10B981;border-color:#10B981;">⭐ Submit Review & Feedback</button>
        </form>`;
    showPortalModal();
}

function saveFeedback(e) {
    e.preventDefault();
    if (store.currentRole !== 'CLIENT' || !store.currentUser) { alert('Only signed-in clients can submit feedback.'); return; }
    const item = document.getElementById('fbItem').value.trim();
    const comments = document.getElementById('fbComments').value.trim();
    const rating = parseInt(document.getElementById('fbRating').value, 10);
    if (item.length < 3 || comments.length < 5 || rating < 1 || rating > 5) { alert('Please enter a valid deliverable, rating and feedback comment.'); return; }
    const now = new Date();
    store.feedback.unshift({ id: Date.now(), item, client: store.currentUser.name || 'Client User', rating, comments, status: 'SUBMITTED', createdByEmail: (store.currentUser.email || '').toLowerCase(), createdAt: now.toLocaleString() });
    addNotification('Feedback Submitted', `Feedback for "${item}" was submitted by ${store.currentUser.name || 'a client'}.`, '💬');
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.createFeedback({
            campaignId: 1,
            item: item,
            comments: comments,
            rating: rating,
            status: 'SUBMITTED'
        }).catch(err => console.warn('Feedback DB create sync:', err));
    }

    closeModal(); renderCurrentModule();
}

function openReplyFeedbackModal(id) {
    const f = store.feedback.find(x => x.id === id);
    if (!f) return;

    const responder = store.currentUser?.name || 'Agency Team Lead';
    document.getElementById('modalTitle').innerText = `💬 Reply to Client Feedback — ${f.item || 'Review'}`;
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveFeedbackReply(event, ${f.id})">
            <div class="card-box" style="margin-bottom:14px; background:var(--blue-soft); border-color:var(--border-blue);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong>Client: ${escapeHtml(f.client || 'Client')}</strong>
                    <span style="color:#F59E0B; font-weight:700;">${'★'.repeat(Number(f.rating)||0)}</span>
                </div>
                <p style="font-size:0.88rem; color:var(--black-obsidian); margin:0; font-style:italic;">“${escapeHtml(f.comments || '')}”</p>
            </div>

            <div class="form-group">
                <label>Responding as *</label>
                <input class="form-control" value="${escapeHtml(responder)} (${store.currentRole.replaceAll('_', ' ')})" readonly>
            </div>

            <div class="form-group">
                <label>Agency Response / Resolution Message *</label>
                <textarea id="fbAgencyReply" class="form-control" rows="4" minlength="5" maxlength="1000" placeholder="Type official response, design explanation or next steps for the client..." required>${escapeHtml(f.agencyReply || '')}</textarea>
            </div>

            <div class="form-group">
                <label>Resolution Status</label>
                <select id="fbStatus" class="form-control">
                    <option value="RESOLVED" ${f.status === 'RESOLVED' ? 'selected' : ''}>RESOLVED - Feedback Addressed & Completed</option>
                    <option value="IN_REVISION" ${f.status === 'IN_REVISION' ? 'selected' : ''}>IN_REVISION - Creative Team Working on Changes</option>
                    <option value="ACKNOWLEDGED" ${f.status === 'ACKNOWLEDGED' ? 'selected' : ''}>ACKNOWLEDGED - Under Review</option>
                </select>
            </div>

            <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:12px; background:#2563EB;">
                💬 Post Agency Response to Client &rarr;
            </button>
        </form>
    `;
    showPortalModal();
}

function saveFeedbackReply(e, id) {
    e.preventDefault();
    const f = store.feedback.find(x => x.id === id);
    if (!f) return;

    const reply = document.getElementById('fbAgencyReply').value.trim();
    const status = document.getElementById('fbStatus').value;
    if (reply.length < 3) {
        alert('Please enter a meaningful response.');
        return;
    }

    f.agencyReply = reply;
    f.repliedBy = store.currentUser?.name || 'Agency Team';
    f.repliedAt = new Date().toLocaleString();
    f.status = status;

    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateFeedback({
            feedbackId: id,
            id: id,
            status: status,
            comments: `${f.comments || ''}\n[Agency Reply by ${f.repliedBy}]: ${reply}`
        }).catch(err => console.warn('Feedback reply DB sync:', err));
    }

    addNotification('Agency Replied to Feedback', `Official response posted for client feedback on "${f.item}".`, '💬');
    closeModal();
    alert('Agency response posted successfully! The client can now see your reply in the Feedback portal.');
    renderCurrentModule();
}

function editFeedback(id) {
    if (store.currentRole !== 'CLIENT' || !store.currentUser) { alert('Agency staff and administrators cannot edit client feedback.'); return; }
    const f = store.feedback.find(x => x.id === id); if (!f) return;
    const currentEmail = (store.currentUser.email || '').toLowerCase();
    if (!currentEmail || (f.createdByEmail || '').toLowerCase() !== currentEmail) { alert('You can edit only feedback that you submitted.'); return; }
    document.getElementById('modalTitle').innerText = '✏️ Edit My Feedback';
    document.getElementById('modalBody').innerHTML = `<form onsubmit="updateFeedback(event,${id})">
        <div class="form-group"><label>Deliverable / Asset</label><input id="fbEditItem" class="form-control" minlength="3" maxlength="120" value="${escapeHtml(f.item || '')}" required></div>
        <div class="form-group"><label>Rating</label><select id="fbEditRating" class="form-control">${[5,4,3,2,1].map(v=>`<option value="${v}" ${Number(f.rating)===v?'selected':''}>${v}/5</option>`).join('')}</select></div>
        <div class="form-group"><label>Your Feedback</label><textarea id="fbEditComments" class="form-control" minlength="5" maxlength="1000" rows="4" required>${escapeHtml(f.comments || '')}</textarea></div>
        <div style="padding:10px 12px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;margin-bottom:12px;font-size:.8rem;color:var(--text-secondary);">Workflow status is controlled by the agency and cannot be changed while editing your feedback.</div>
        <button class="btn-primary" style="width:100%;justify-content:center;">Save My Changes</button></form>`;
    showPortalModal();
}

function updateFeedback(e,id) {
    e.preventDefault();
    if (store.currentRole !== 'CLIENT' || !store.currentUser) { alert('Agency staff and administrators cannot edit client feedback.'); return; }
    const f=store.feedback.find(x=>x.id===id); if(!f)return;
    const currentEmail=(store.currentUser.email||'').toLowerCase();
    if(!currentEmail || (f.createdByEmail||'').toLowerCase()!==currentEmail){alert('You can edit only feedback that you submitted.');return;}
    const item=document.getElementById('fbEditItem').value.trim();
    const comments=document.getElementById('fbEditComments').value.trim();
    const rating=parseInt(document.getElementById('fbEditRating').value,10);
    if(item.length<3 || comments.length<5 || rating<1 || rating>5){alert('Please enter valid feedback details.');return;}
    f.item=item; f.comments=comments; f.rating=rating; f.updatedAt=new Date().toLocaleString();
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateFeedback({
            feedbackId: id,
            id: id,
            item: item,
            comments: comments,
            rating: rating,
            status: f.status || 'SUBMITTED'
        }).catch(err => console.warn('Feedback DB update sync:', err));
    }

    closeModal(); renderCurrentModule();
}

function deleteFeedback() { alert('Feedback records cannot be deleted from the portal.'); }

// ----------------------------------------------------------------------------
// 5. CREATIVE ASSET MANAGEMENT — library, metadata, versions, approvals & rights
// ----------------------------------------------------------------------------
function getFilteredAssets() {
    const q=(document.getElementById('assetSearch')?.value||'').trim().toLowerCase();
    const category=document.getElementById('assetCategoryFilter')?.value||'ALL';
    const status=document.getElementById('assetStatusFilter')?.value||'ALL';
    const campaign=document.getElementById('assetCampaignFilter')?.value||'ALL';
    return store.assets.filter(a=>{
        const hay=`${a.name||''} ${a.title||''} ${a.campaign||''} ${a.tags||''} ${a.uploader||''} ${a.description||''}`.toLowerCase();
        return (!q||hay.includes(q)) && (category==='ALL'||a.category===category) && (status==='ALL'||a.status===status) && (campaign==='ALL'||a.campaign===campaign);
    });
}

function renderAssets(container) {
    const canManage = store.currentRole !== 'CLIENT';
    const iconMap = { IMAGE: '🖼️', COPYWRITING: '✍️', VIDEO: '🎬', DOCUMENT: '📄', AUDIO: '🎵' };
    const total = store.assets.length;
    const pending = store.assets.filter(a => a.status === 'PENDING').length;
    const approved = store.assets.filter(a => a.status === 'APPROVED').length;
    const revision = store.assets.filter(a => a.status === 'NEEDS_REVISION').length;
    const campaigns = [...new Set(store.assets.map(a => a.campaign).filter(Boolean))];

    // Filter approved agency campaign projects assigned for creative production
    const assignedCampaigns = store.campaigns.filter(c => c.approvalStatus === 'APPROVED' || c.status === 'ACTIVE' || c.assignedCreativeStaff);

    container.innerHTML = `
      <div class="page-header asset-page-header">
        <div class="page-title">
          <h2>🖼️ Creative Asset Management</h2>
          <p>Central media library for creative asset intake, project brief tracking, version control, review/approval and multi-channel asset delivery.</p>
        </div>
        ${canManage ? `<button class="btn-primary" onclick="openAssetModal()">+ Upload Creative Asset</button>` : ''}
      </div>

      <div class="stats-grid asset-stats">
        <div class="stat-card"><div class="stat-title">Total Assets</div><div class="stat-value">${total}</div><div class="stat-desc">Across campaign libraries</div></div>
        <div class="stat-card amber"><div class="stat-title">Approval Queue</div><div class="stat-value">${pending}</div><div class="stat-desc">Waiting for review</div></div>
        <div class="stat-card green"><div class="stat-title">Approved</div><div class="stat-value">${approved}</div><div class="stat-desc">Ready for approved use</div></div>
        <div class="stat-card purple"><div class="stat-title">Needs Revision</div><div class="stat-value">${revision}</div><div class="stat-desc">Returned to creative team</div></div>
      </div>

      <!-- Section 1: Assigned Campaign Projects from Project Manager -->
      <div class="card-box asset-assigned-projects-card" style="width:100%; margin-top: 18px; border-left: 4px solid var(--blue-electric); background: linear-gradient(180deg, rgba(37,99,235,0.03) 0%, rgba(255,255,255,1) 100%);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 style="margin:0; font-size:1.15rem; font-weight:800; color:var(--black-obsidian); display:flex; align-items:center; gap:8px;">
              <span>🎯 Assigned Campaign Projects for Creative Production</span>
              <span class="badge badge-scheduled" style="font-size:0.75rem;">${assignedCampaigns.length} Projects</span>
            </h3>
            <div class="asset-helper" style="font-size:0.85rem; margin-top:2px;">Campaigns approved by Project Manager and assigned to Creative Staff for artwork & asset production.</div>
          </div>
        </div>

        ${assignedCampaigns.length === 0 ? `
          <div style="padding:22px; text-align:center; color:var(--text-secondary); background:var(--blue-soft); border-radius:8px;">
            No campaign projects currently assigned for creative production. When the Project Manager approves a client request, it will appear here.
          </div>
        ` : `
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
            ${assignedCampaigns.map(c => {
                const creativeAssignee = c.assignedCreativeStaff || 'Navodi V.G.C (Lead Visual Designer)';
                const deliverables = c.creativeDeliverables || c.brief || 'Produce key visual posters, digital banners and campaign collateral';
                const deadline = c.creativeDeadline || c.end || 'Within Campaign Schedule';
                const cStatus = c.creativeStatus || 'IN_PRODUCTION';
                return `
                <div style="border:1px solid var(--border-blue); border-radius:10px; padding:16px; background:#FFFFFF; box-shadow:0 2px 8px rgba(0,0,0,0.03); display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                      <h4 style="margin:0; font-size:1.05rem; font-weight:800; color:var(--black-obsidian);">${escapeHtml(c.title)}</h4>
                      <span class="badge ${cStatus === 'DELIVERED' ? 'badge-scheduled' : 'badge-active'}" style="${cStatus === 'DELIVERED' ? 'background:#D1FAE5; color:#065F46;' : ''} font-size:0.75rem; white-space:nowrap;">
                        ${cStatus === 'DELIVERED' ? '🎉 Delivered' : (cStatus === 'PENDING_ACCEPTANCE' ? '🔔 New Task' : '🎨 In Production')}
                      </span>
                    </div>
                    <div style="font-size:0.83rem; color:var(--text-secondary); margin-bottom:10px;">
                      <strong>Client:</strong> ${escapeHtml(c.client || 'Client')} • <strong>Budget:</strong> LKR ${(c.budget||0).toLocaleString()}
                    </div>
                    <div style="background:var(--blue-soft); border-radius:8px; padding:10px; font-size:0.82rem; margin-bottom:12px;">
                      <div style="margin-bottom:4px; color:var(--blue-electric); font-weight:700;">👤 Assigned Specialist: <span style="color:var(--black-obsidian); font-weight:600;">${escapeHtml(creativeAssignee.split('(')[0].trim())}</span></div>
                      <div style="color:var(--text-secondary);"><strong>📦 Deliverables:</strong> ${escapeHtml(deliverables)}</div>
                      <div style="margin-top:4px; font-size:0.8rem; color:var(--text-secondary);"><strong>📅 Target Completion:</strong> ${escapeHtml(deadline)}</div>
                      ${c.deliveryNotes ? `<div style="margin-top:6px; font-size:0.78rem; color:#065F46; font-style:italic;"><strong>Delivery Note:</strong> "${escapeHtml(c.deliveryNotes)}"</div>` : ''}
                    </div>
                  </div>
                  <div style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap;">
                    ${cStatus === 'PENDING_ACCEPTANCE' ? `
                      <button class="btn-primary" style="flex:1.4; padding:7px 10px; font-size:0.8rem; justify-content:center; background:#10B981; border-color:#10B981;" onclick="acceptCreativeProject(${c.id})">✅ Accept Project</button>
                      <button class="btn-secondary" style="flex:1; padding:7px 10px; font-size:0.8rem; justify-content:center;" onclick="viewCampaignCreativeBrief(${c.id})">👁️ Brief</button>
                    ` : cStatus === 'DELIVERED' ? `
                      <button class="btn-secondary" style="flex:1; padding:7px 10px; font-size:0.8rem; justify-content:center;" onclick="viewCampaignCreativeBrief(${c.id})">👁️ Brief & Notes</button>
                      <button class="btn-primary" style="flex:1.2; padding:7px 10px; font-size:0.8rem; justify-content:center; background:#2563EB;" onclick="openAssetModal('${escapeHtml(c.title)}')">📤 Add Assets</button>
                    ` : `
                      <button class="btn-primary" style="flex:1.1; padding:7px 8px; font-size:0.78rem; justify-content:center; background:#2563EB;" onclick="openAssetModal('${escapeHtml(c.title)}')">📤 Upload Asset</button>
                      <button class="btn-secondary" style="flex:0.7; padding:7px 8px; font-size:0.78rem; justify-content:center;" onclick="viewCampaignCreativeBrief(${c.id})">👁️ Brief</button>
                      <button class="btn-primary" style="flex:1.5; padding:7px 8px; font-size:0.78rem; justify-content:center; background:#10B981; border-color:#10B981;" onclick="openDeliverCreativeWorkModal(${c.id})">🚀 Deliver to Client</button>
                    `}
                  </div>
                </div>
                `;
            }).join('')}
          </div>
        `}
      </div>

      <!-- Section 2: Digital Asset Library Table -->
      <div class="card-box asset-library-card" style="width:100%; margin-top: 22px;">
        <div class="asset-toolbar">
          <div><h3 style="margin:0;font-size:1.05rem;">Digital Asset Library</h3><div class="asset-helper">Search by title, campaign, tag, creator or description.</div></div>
          <div class="asset-filter-row">
            <input id="assetSearch" class="form-control" placeholder="Search assets..." oninput="refreshAssetTable()">
            <select id="assetCategoryFilter" class="form-control" onchange="refreshAssetTable()"><option value="ALL">All categories</option><option>IMAGE</option><option>VIDEO</option><option>DOCUMENT</option><option>COPYWRITING</option><option>AUDIO</option></select>
            <select id="assetStatusFilter" class="form-control" onchange="refreshAssetTable()"><option value="ALL">All statuses</option><option>PENDING</option><option>APPROVED</option><option>NEEDS_REVISION</option><option>REJECTED</option><option>ARCHIVED</option></select>
            <select id="assetCampaignFilter" class="form-control" onchange="refreshAssetTable()"><option value="ALL">All campaigns</option>${campaigns.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}</select>
          </div>
        </div>
        <div id="assetTableHost"></div>
      </div>`;
    refreshAssetTable();
}

function refreshAssetTable(){
    const host=document.getElementById('assetTableHost'); if(!host)return;
    const rows=getFilteredAssets(); const canManage=store.currentRole!=='CLIENT';
    const iconMap={IMAGE:'🖼️',COPYWRITING:'✍️',VIDEO:'🎬',DOCUMENT:'📄',AUDIO:'🎵'};
    host.innerHTML=`<div class="table-container" style="width:100%;"><table class="data-table asset-table" style="width:100%;"><thead><tr><th>Asset</th><th>Campaign</th><th>Metadata</th><th>Version</th><th>Rights / Channel</th><th>Approval</th><th style="min-width:180px;text-align:center;">Actions</th></tr></thead><tbody>${rows.length?rows.map(a=>{const icon=iconMap[a.category]||'📁';const tags=(a.tags||'').split(',').filter(Boolean).slice(0,4).map(t=>`<span class="tag-pill">${escapeHtml(t.trim())}</span>`).join('');return `<tr><td><div class="asset-file-cell"><div class="asset-icon-box ${(a.category||'document').toLowerCase()}">${icon}</div><div><div class="asset-file-name">${escapeHtml(a.title||a.name)}</div><div class="asset-campaign-sub">${escapeHtml(a.name)} • ${escapeHtml(a.uploader||'Unknown')}</div></div></div></td><td><strong>${escapeHtml(a.campaign||'Agency Library')}</strong><div class="asset-campaign-sub">${escapeHtml(a.description||'No description')}</div></td><td><span class="category-badge ${(a.category||'document').toLowerCase()}">${icon} ${escapeHtml(a.category||'DOCUMENT')}</span><div style="margin-top:6px">${tags||'<span class="asset-helper">No tags</span>'}</div></td><td><span class="badge badge-scheduled">${escapeHtml(a.version||'v1.0')}</span><div class="asset-campaign-sub">${escapeHtml(a.versionNotes||'No version note')}</div></td><td><strong>${escapeHtml((a.usageChannel||'ALL_CHANNELS').replaceAll('_',' '))}</strong><div class="asset-campaign-sub">${escapeHtml((a.rights||'CAMPAIGN_USE').replaceAll('_',' '))}${a.rightsExpiry?` • until ${escapeHtml(a.rightsExpiry)}`:''}</div></td><td><span class="badge badge-${(a.status||'PENDING').toLowerCase()}">${escapeHtml(a.status||'PENDING')}</span></td><td><div class="asset-actions-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;min-width:170px;max-width:200px;margin:0 auto;"><button class="btn-breakdown-quick" style="padding:5px 8px;font-size:0.75rem;display:flex;align-items:center;justify-content:center;white-space:nowrap;" onclick="previewAssetModal(${a.id})">👁️ View</button>${canManage?`<button class="btn-secondary" style="padding:5px 8px;font-size:0.75rem;display:flex;align-items:center;justify-content:center;white-space:nowrap;" onclick="editAsset(${a.id})">✏️ Metadata</button><button class="btn-secondary" style="padding:5px 8px;font-size:0.75rem;display:flex;align-items:center;justify-content:center;white-space:nowrap;" onclick="newAssetVersion(${a.id})">🔁 Version</button><button class="btn-secondary" style="padding:5px 8px;font-size:0.75rem;display:flex;align-items:center;justify-content:center;white-space:nowrap;" onclick="openAssetApproval(${a.id})">✅ Approval</button><button class="btn-danger" style="padding:5px 8px;font-size:0.75rem;grid-column:span 2;display:flex;align-items:center;justify-content:center;white-space:nowrap;" onclick="archiveAsset(${a.id})">${a.status==='ARCHIVED'?'📦 Unarchive':'📦 Archive'}</button>`:''}</div></td></tr>`}).join(''):`<tr><td colspan="7" class="asset-empty">No assets match the selected filters.</td></tr>`}</tbody></table></div>`;
}

function acceptCreativeProject(id) {
    const c = store.campaigns.find(x => x.id === id);
    if (!c) return;
    c.creativeStatus = 'IN_PRODUCTION';
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateCampaign({
            campaignId: id,
            id: id,
            status: 'IN_PROGRESS'
        }).catch(err => console.warn('Campaign accept DB sync:', err));
    }

    addNotification('Project Accepted by Creative Staff', `Creative team accepted "${c.title}" and began asset production.`, '✅');
    alert(`Project "${c.title}" accepted! You can now upload creative assets.`);
    renderCurrentModule();
}

function openDeliverCreativeWorkModal(id) {
    const c = store.campaigns.find(x => x.id === id);
    if (!c) return;

    document.getElementById('modalTitle').innerText = `🚀 Complete & Deliver Creative Work — ${c.title}`;
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveDeliverCreativeWork(event, ${id})">
            <div class="card-box" style="margin-bottom:14px; background:var(--blue-soft); border-color:var(--border-blue);">
                <div style="font-weight:800; color:var(--blue-electric); margin-bottom:4px;">${escapeHtml(c.title)}</div>
                <div style="font-size:0.85rem; color:var(--text-secondary);">Client: <strong>${escapeHtml(c.client||'Client')}</strong> | Budget: <strong>LKR ${(c.budget||0).toLocaleString()}</strong></div>
            </div>

            <div class="form-group">
                <label>Creative Deliverables Summary *</label>
                <input id="delivSummary" class="form-control" value="${escapeHtml(c.creativeDeliverables || 'Complete key visual designs, 3D video loops and banners')}" required>
            </div>

            <div class="form-group">
                <label>Completion Message to Client *</label>
                <textarea id="delivMsg" class="form-control" rows="4" placeholder="Type message for the client notifying them that work is ready for their review and invoice settlement..." required>All creative assets, final 4K animations, and social media media collateral have been completed and uploaded to your media library. Please review the assets and proceed with invoice settlement.</textarea>
            </div>

            <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:16px; background:#FEF3C7; padding:10px 14px; border-radius:8px; border:1px solid #FCD34D;">
                ℹ️ When submitted, an in-app completion notification will be dispatched to the client, and the invoice for LKR ${(c.budget||0).toLocaleString()} will become ready for payment.
            </div>

            <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:12px; background:#10B981; border-color:#10B981;">
                🚀 Dispatch Delivery Message to Client &rarr;
            </button>
        </form>
    `;
    showPortalModal();
}

function saveDeliverCreativeWork(e, id) {
    e.preventDefault();
    const c = store.campaigns.find(x => x.id === id);
    if (!c) return;

    const summary = document.getElementById('delivSummary').value.trim();
    const msg = document.getElementById('delivMsg').value.trim();

    c.creativeStatus = 'DELIVERED';
    c.status = 'COMPLETED';
    c.deliveryNotes = msg;
    c.deliveredAt = new Date().toLocaleString();

    // Ensure an invoice exists for client to pay
    let inv = store.invoices.find(i => (i.campaign && i.campaign.toLowerCase() === c.title.toLowerCase()) || i.campaignId === c.id);
    if (!inv) {
        const invSub = c.budget || 500000;
        const invTax = invSub * 0.08;
        inv = {
            id: Date.now(),
            number: `INV-2026-${String(store.invoices.length + 1).padStart(3, '0')}`,
            campaign: c.title,
            campaignId: c.id,
            client: c.client || 'Client',
            clientEmail: c.clientEmail || c.createdByEmail || 'client@dialog.lk',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: c.end || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            subtotal: invSub,
            tax: invTax,
            total: invSub + invTax,
            status: 'SENT'
        };
        store.invoices.unshift(inv);
        if (window.AdFlowAPI) {
            AdFlowAPI.createInvoice({
                invoiceNumber: inv.number,
                campaignId: c.id || 1,
                clientId: 1,
                itemDescription: `Creative Deliverables for ${c.title}`,
                quantity: 1,
                unitPrice: invSub,
                taxRate: 0.08,
                status: 'SENT'
            }).catch(err => console.warn('Invoice create DB sync:', err));
        }
    } else if (inv.status === 'DRAFT') {
        inv.status = 'SENT';
        if (window.AdFlowAPI) {
            AdFlowAPI.updateInvoiceStatus(inv.id, 'SENT').catch(err => console.warn('Invoice status DB sync:', err));
        }
    }

    // Update related task to completed
    const task = store.tasks.find(t => t.campaignId === c.id || (t.campaign && t.campaign.toLowerCase() === c.title.toLowerCase()));
    if (task) {
        task.status = 'COMPLETED';
        if (window.AdFlowAPI) {
            AdFlowAPI.updateTask({
                taskId: task.id,
                id: task.id,
                status: 'COMPLETED'
            }).catch(err => console.warn('Task complete DB sync:', err));
        }
    }

    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateCampaign({
            campaignId: id,
            id: id,
            status: 'COMPLETED'
        }).catch(err => console.warn('Campaign deliver DB sync:', err));
    }

    addNotification('Creative Task Completed & Delivered', `Creative work for "${c.title}" has been delivered to client. Client notified for payment.`, '🎉');
    addNotification('🎉 Creative Assets Ready!', `The creative team finished all deliverables for "${c.title}". Please review and settle invoice.`, '📦');

    closeModal();
    alert(`Delivery message sent to client for "${c.title}"! The client has been notified to inspect deliverables and settle the invoice.`);
    renderCurrentModule();
}

function assetFormFields(a={}){
    const campaignOptions=store.campaigns.map(c=>`<option value="${escapeHtml(c.title)}" ${a.campaign===c.title?'selected':''}>${escapeHtml(c.title)}</option>`).join('');
    return `<div class="asset-form-grid">
      <div class="form-group"><label>Asset Title *</label><input id="assetTitle" class="form-control" minlength="3" maxlength="120" value="${escapeHtml(a.title||'')}" placeholder="e.g. 5G Launch Hero Billboard" required></div>
      <div class="form-group"><label>Campaign *</label><select id="assetCampaign" class="form-control" required><option value="">Select campaign</option>${campaignOptions}</select></div>
      <div class="form-group"><label>Category *</label><select id="assetCat" class="form-control"><option ${a.category==='IMAGE'?'selected':''}>IMAGE</option><option ${a.category==='VIDEO'?'selected':''}>VIDEO</option><option ${a.category==='DOCUMENT'?'selected':''}>DOCUMENT</option><option ${a.category==='COPYWRITING'?'selected':''}>COPYWRITING</option><option ${a.category==='AUDIO'?'selected':''}>AUDIO</option></select></div>
      <div class="form-group"><label>Usage Channel *</label><select id="assetChannel" class="form-control"><option value="SOCIAL_MEDIA" ${a.usageChannel==='SOCIAL_MEDIA'?'selected':''}>Social Media</option><option value="OUTDOOR" ${a.usageChannel==='OUTDOOR'?'selected':''}>Outdoor / Billboard</option><option value="WEB" ${a.usageChannel==='WEB'?'selected':''}>Web / Display</option><option value="TV" ${a.usageChannel==='TV'?'selected':''}>TV</option><option value="RADIO" ${a.usageChannel==='RADIO'?'selected':''}>Radio</option><option value="PRINT" ${a.usageChannel==='PRINT'?'selected':''}>Print</option><option value="ALL_CHANNELS" ${a.usageChannel==='ALL_CHANNELS'?'selected':''}>All Approved Channels</option></select></div>
      <div class="form-group asset-span-2"><label>Description *</label><textarea id="assetDescription" class="form-control" minlength="10" maxlength="500" rows="3" required>${escapeHtml(a.description||'')}</textarea></div>
      <div class="form-group asset-span-2"><label>Tags * <span class="asset-helper">comma separated</span></label><input id="assetTags" class="form-control" value="${escapeHtml(a.tags||'')}" placeholder="5G, Billboard, Product Launch" required></div>
      <div class="form-group"><label>Usage Rights *</label><select id="assetRights" class="form-control"><option value="INTERNAL_ONLY" ${a.rights==='INTERNAL_ONLY'?'selected':''}>Internal Only</option><option value="CLIENT_REVIEW" ${a.rights==='CLIENT_REVIEW'?'selected':''}>Client Review</option><option value="CAMPAIGN_USE" ${a.rights==='CAMPAIGN_USE'?'selected':''}>Campaign Use</option><option value="ALL_APPROVED_CHANNELS" ${a.rights==='ALL_APPROVED_CHANNELS'?'selected':''}>All Approved Channels</option></select></div>
      <div class="form-group"><label>Rights Expiry</label><input type="date" id="assetRightsExpiry" class="form-control" value="${escapeHtml(a.rightsExpiry||'')}"></div>
      <div class="form-group asset-span-2"><label>Version Notes *</label><input id="assetVersionNotes" class="form-control" minlength="3" maxlength="250" value="${escapeHtml(a.versionNotes||'')}" placeholder="What is new or changed in this version?" required></div>
    </div>`;
}

function openAssetModal(defaultCampaign = ''){
    const initialData = typeof defaultCampaign === 'string' && defaultCampaign ? { campaign: defaultCampaign } : (typeof defaultCampaign === 'object' ? defaultCampaign : {});
    document.getElementById('modalTitle').innerText='Upload Creative Asset';
    document.getElementById('modalBody').innerHTML=`<form onsubmit="saveAsset(event)">${assetFormFields(initialData)}<div class="form-group"><label>Creative File (Optional)</label><input id="assetFile" type="file" class="form-control" accept=".jpg,.jpeg,.png,.pdf,.mp4,.mov,.doc,.docx,.mp3,.wav"><div class="asset-helper">Allowed: JPG, PNG, PDF, MP4/MOV, DOC/DOCX, MP3/WAV. Max 50 MB (Optional).</div></div><button type="submit" class="btn-primary" style="width:100%;justify-content:center;">Upload & Register Asset</button></form>`;
    showPortalModal();
}

function viewCampaignCreativeBrief(id) {
    const c = store.campaigns.find(x => x.id === id);
    if (!c) return;

    document.getElementById('modalTitle').innerText = `🎨 Creative Brief — ${c.title}`;
    document.getElementById('modalBody').innerHTML = `
        <div style="padding:4px 0;">
            <div class="card-box" style="margin-bottom:14px; background:var(--blue-soft); border-color:var(--border-blue);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span class="badge badge-scheduled" style="font-size:0.8rem;">${escapeHtml(c.client||'Client')}</span>
                    <span style="font-weight:800; color:var(--blue-electric);">Budget: LKR ${(c.budget||0).toLocaleString()}</span>
                </div>
                <h4 style="margin:0 0 6px 0; font-size:1.1rem; color:var(--black-obsidian); font-weight:800;">${escapeHtml(c.title)}</h4>
                <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
                    <strong>Assigned Specialist:</strong> ${escapeHtml(c.assignedCreativeStaff || 'Navodi V.G.C (Lead Visual Designer)')}<br>
                    <strong>Target Completion Deadline:</strong> ${escapeHtml(c.creativeDeadline || c.end || '-')}<br>
                    <strong>Status:</strong> <span class="badge badge-active">${c.status || 'ACTIVE'}</span>
                </div>
            </div>

            <div class="card-box" style="margin-bottom:14px;">
                <h4 style="font-size:0.95rem; font-weight:800; color:var(--black-obsidian); margin-bottom:6px;">📦 Creative Deliverables</h4>
                <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5; margin:0;">${escapeHtml(c.creativeDeliverables || c.deliverables || 'Produce key visual graphics, 3D video loops, and campaign banners.')}</p>
            </div>

            <div class="card-box" style="margin-bottom:14px;">
                <h4 style="font-size:0.95rem; font-weight:800; color:var(--black-obsidian); margin-bottom:6px;">📝 Creative Direction & Brief Notes</h4>
                <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5; margin:0;">${escapeHtml(c.creativeNotes || c.brief || 'Follow brand color codes and high-definition export standards.')}</p>
            </div>

            <div style="display:flex; gap:10px; margin-top:16px;">
                <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="closeModal()">Close</button>
                <button class="btn-primary" style="flex:1.5; justify-content:center; background:#2563EB;" onclick="closeModal(); openAssetModal('${escapeHtml(c.title)}');">📤 Upload Asset for this Campaign</button>
            </div>
        </div>
    `;
    showPortalModal();
}

function readAssetForm(){return {title:document.getElementById('assetTitle').value.trim(),campaign:document.getElementById('assetCampaign').value,category:document.getElementById('assetCat').value,description:document.getElementById('assetDescription').value.trim(),tags:document.getElementById('assetTags').value.trim(),usageChannel:document.getElementById('assetChannel').value,rights:document.getElementById('assetRights').value,rightsExpiry:document.getElementById('assetRightsExpiry').value,versionNotes:document.getElementById('assetVersionNotes').value.trim()};}
function validateAssetMeta(v){if(v.title.length<3||v.title.length>120)return 'Asset title must be 3-120 characters.';if(!v.campaign)return 'Select a campaign.';if(v.description.length<10||v.description.length>500)return 'Description must be 10-500 characters.';if(v.tags.length<2)return 'Add at least one meaningful tag.';if(v.versionNotes.length<3)return 'Version notes are required.';return '';}

function saveAsset(e){
    e.preventDefault(); if(store.currentRole==='CLIENT')return;
    const meta=readAssetForm(), error=validateAssetMeta(meta); if(error){alert(error);return;}
    const input=document.getElementById('assetFile'), file=input.files&&input.files[0];
    let fileName = `${meta.title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_')}_Spec`;
    let fileType = meta.category || 'CREATIVE_ASSET';
    if(file){
        if(file.size<=0){alert('The selected file is empty.');return;}
        if(file.size>50*1024*1024){alert('File must be 50 MB or smaller.');return;}
        const ext=(file.name.split('.').pop()||'').toLowerCase(), allowed=['jpg','jpeg','png','pdf','mp4','mov','doc','docx','mp3','wav'];
        if(!allowed.includes(ext)){alert('Unsupported file type.');return;}
        fileName = file.name;
        fileType = file.type || 'FILE';
    } else {
        const extMap = { IMAGE: '.png', VIDEO: '.mp4', AUDIO: '.mp3', DOCUMENT: '.pdf', COPYWRITING: '.docx' };
        fileName += (extMap[meta.category] || '.asset');
    }
    const now=new Date(), who=store.currentUser?.name||'Creative Asset Manager';
    const newAssetObj = {id:Date.now(),...meta,uploader:who,name:fileName,type:fileType,version:'v1.0',status:'PENDING',createdAt:now.toISOString().slice(0,10),versions:[{version:'v1.0',date:now.toLocaleString(),by:who,notes:meta.versionNotes}],audit:[`${now.toLocaleString()} — Registered by ${who}${file ? ' with uploaded file' : ' as creative specification (file optional)'}`]};
    store.assets.unshift(newAssetObj);
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        const campObj = store.campaigns.find(c => c.title === meta.campaign) || {};
        AdFlowAPI.createAsset({
            campaignId: campObj.id || 1,
            uploadedById: 5,
            fileName: fileName,
            fileType: fileType,
            fileUrl: '/static/images/portfolio/portfolio-1.jpg',
            fileSizeKb: 2048,
            category: meta.category || 'IMAGE',
            tags: meta.tags || '',
            version: 'v1.0'
        }).catch(err => console.warn('Asset DB create sync:', err));
    }

    addNotification('Creative Asset Registered',`${meta.title} is waiting for review.`,'🖼️'); closeModal(); renderCurrentModule();
}

function editAsset(id){
    if(store.currentRole==='CLIENT')return; const a=store.assets.find(x=>x.id===id);if(!a)return;
    document.getElementById('modalTitle').innerText='Edit Asset Metadata'; document.getElementById('modalBody').innerHTML=`<form onsubmit="updateAsset(event,${id})">${assetFormFields(a)}<button class="btn-primary" style="width:100%;justify-content:center;">Save Metadata</button></form>`; showPortalModal();
}
function updateAsset(e,id){e.preventDefault();if(store.currentRole==='CLIENT')return;const a=store.assets.find(x=>x.id===id);if(!a)return;const meta=readAssetForm(),error=validateAssetMeta(meta);if(error){alert(error);return;}Object.assign(a,meta);a.audit=a.audit||[];a.audit.unshift(`${new Date().toLocaleString()} — Metadata updated by ${store.currentUser?.name||'Manager'}`);saveWorkflowDataToStorage();closeModal();renderCurrentModule();}

function newAssetVersion(id){
    if(store.currentRole==='CLIENT')return;const a=store.assets.find(x=>x.id===id);if(!a)return;
    document.getElementById('modalTitle').innerText=`Upload New Version — ${a.title||a.name}`;
    document.getElementById('modalBody').innerHTML=`<form onsubmit="saveAssetVersion(event,${id})"><div class="form-group"><label>New File *</label><input type="file" id="assetVersionFile" class="form-control" required></div><div class="form-group"><label>Version Notes *</label><textarea id="assetNewVersionNotes" class="form-control" minlength="3" maxlength="250" required></textarea></div><button class="btn-primary" style="width:100%;justify-content:center;">Add Version</button></form>`;
    showPortalModal();
}
function saveAssetVersion(e,id){e.preventDefault();const a=store.assets.find(x=>x.id===id);if(!a)return;const file=document.getElementById('assetVersionFile').files[0],notes=document.getElementById('assetNewVersionNotes').value.trim();if(!file||file.size<=0||file.size>50*1024*1024||notes.length<3){alert('Choose a valid file (max 50 MB) and add version notes.');return;}const old=parseFloat((a.version||'v1.0').replace('v',''))||1,newVersion='v'+(old+0.1).toFixed(1),who=store.currentUser?.name||'Creative Asset Manager',when=new Date().toLocaleString();a.name=file.name;a.version=newVersion;a.versionNotes=notes;a.status='PENDING';a.versions=a.versions||[];a.versions.unshift({version:newVersion,date:when,by:who,notes});a.audit=a.audit||[];a.audit.unshift(`${when} — ${newVersion} uploaded by ${who}`);saveWorkflowDataToStorage();addNotification('New Asset Version',`${a.title||a.name} updated to ${newVersion} and returned to the approval queue.`,'🖼️');closeModal();renderCurrentModule();}

function openAssetApproval(id){
    if(store.currentRole==='CLIENT')return;const a=store.assets.find(x=>x.id===id);if(!a)return;
    document.getElementById('modalTitle').innerText=`Approval Decision — ${a.title||a.name}`;
    document.getElementById('modalBody').innerHTML=`<form onsubmit="saveAssetApproval(event,${id})"><div class="form-group"><label>Approval Status *</label><select id="assetApprovalStatus" class="form-control">${['PENDING','APPROVED','NEEDS_REVISION','REJECTED'].map(v=>`<option ${a.status===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="form-group"><label>Review Note</label><textarea id="assetApprovalNote" class="form-control" maxlength="500" placeholder="Reason, revision instruction, or approval note..."></textarea></div><button class="btn-primary" style="width:100%;justify-content:center;">Save Approval Decision</button></form>`;showPortalModal();
}
function saveAssetApproval(e,id){e.preventDefault();const a=store.assets.find(x=>x.id===id);if(!a)return;const status=document.getElementById('assetApprovalStatus').value,note=document.getElementById('assetApprovalNote').value.trim(),who=store.currentUser?.name||'Creative Asset Manager',when=new Date().toLocaleString();a.status=status;a.approvalNote=note;a.audit=a.audit||[];a.audit.unshift(`${when} — ${status.replaceAll('_',' ')} by ${who}${note?`: ${note}`:''}`);saveWorkflowDataToStorage();addNotification('Asset Approval Updated',`${a.title||a.name} is now ${status.replaceAll('_',' ')}.`,'✅');closeModal();renderCurrentModule();}

function archiveAsset(id){
    if(store.currentRole==='CLIENT')return;
    const a=store.assets.find(x=>x.id===id);
    if(!a)return;
    const isArchived = a.status === 'ARCHIVED';
    if(confirm(isArchived ? `Unarchive "${a.title||a.name}"?` : `Archive "${a.title||a.name}"?`)){
        if(isArchived){
            a.status = a.previousStatus || 'APPROVED';
            a.audit = a.audit || [];
            a.audit.unshift(`${new Date().toLocaleString()} — Unarchived by ${store.currentUser?.name||'Manager'}`);
        } else {
            a.previousStatus = a.status || 'APPROVED';
            a.status = 'ARCHIVED';
            a.audit = a.audit || [];
            a.audit.unshift(`${new Date().toLocaleString()} — Archived by ${store.currentUser?.name||'Manager'}`);
        }
        saveWorkflowDataToStorage();
        renderCurrentModule();
    }
}
function deleteAsset(id){
    if(store.currentRole==='CLIENT')return;
    if(confirm('Permanently delete this creative asset record?')){
        store.assets=store.assets.filter(x=>x.id!==id);
        saveWorkflowDataToStorage();
        if (window.AdFlowAPI) {
            AdFlowAPI.deleteAsset(id).catch(err => console.warn('Asset DB delete sync:', err));
        }
        renderCurrentModule();
    }
}
function toggleAssetActionMenu(){}

function previewAssetModal(id){
    const a=store.assets.find(x=>x.id===id);if(!a)return;const iconMap={IMAGE:'🖼️',COPYWRITING:'✍️',VIDEO:'🎬',DOCUMENT:'📄',AUDIO:'🎵'},icon=iconMap[a.category]||'📁';
    const versions=(a.versions||[{version:a.version||'v1.0',date:a.createdAt||'',by:a.uploader||'',notes:a.versionNotes||''}]).map(v=>`<div class="asset-history-row"><strong>${escapeHtml(v.version)}</strong><span>${escapeHtml(v.date||'')}</span><span>${escapeHtml(v.by||'')}</span><span>${escapeHtml(v.notes||'')}</span></div>`).join('');
    const audit=(a.audit||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')||'<li>No audit activity recorded.</li>';
    document.getElementById('modalTitle').innerText=`${icon} Asset Details`;
    document.getElementById('modalBody').innerHTML=`<div class="asset-detail-hero"><div class="asset-detail-icon">${icon}</div><div><h3>${escapeHtml(a.title||a.name)}</h3><p>${escapeHtml(a.name)}</p><span class="badge badge-scheduled">${escapeHtml(a.version||'v1.0')}</span> <span class="badge badge-${(a.status||'PENDING').toLowerCase()}">${escapeHtml(a.status||'PENDING')}</span></div></div><div class="asset-detail-grid"><div><strong>Campaign</strong><span>${escapeHtml(a.campaign||'Agency Library')}</span></div><div><strong>Category</strong><span>${escapeHtml(a.category||'DOCUMENT')}</span></div><div><strong>Uploaded By</strong><span>${escapeHtml(a.uploader||'Unknown')}</span></div><div><strong>Channel</strong><span>${escapeHtml((a.usageChannel||'ALL_CHANNELS').replaceAll('_',' '))}</span></div><div><strong>Usage Rights</strong><span>${escapeHtml((a.rights||'CAMPAIGN_USE').replaceAll('_',' '))}</span></div><div><strong>Rights Expiry</strong><span>${escapeHtml(a.rightsExpiry||'No expiry set')}</span></div></div><div class="card-box" style="margin:14px 0 0;padding:14px;"><strong>Description</strong><p style="margin:6px 0 0;color:var(--text-secondary);">${escapeHtml(a.description||'No description')}</p></div><h4 class="asset-section-title">Version History</h4><div class="asset-history">${versions}</div><h4 class="asset-section-title">Audit Trail</h4><ul class="asset-audit-list">${audit}</ul><button class="btn-primary" style="width:100%;justify-content:center;" onclick="alert('Downloading asset file: ${escapeHtml(a.name)}')">📥 Download Current Version</button>`;
    showPortalModal();
}

// ----------------------------------------------------------------------------
// 6. FINANCIAL MANAGEMENT & INVOICES (Gamage M.I.I.K)
// ----------------------------------------------------------------------------
function renderFinance(container) {
    const isClient = store.currentRole === 'CLIENT';
    
    // Strict Client Data Isolation
    let userInvoices = store.invoices;
    if (isClient) {
        if (store.currentUser && store.currentUser.email) {
            const userEmail = store.currentUser.email.toLowerCase();
            const userName = store.currentUser.name ? store.currentUser.name.toLowerCase() : '';
            const userCompany = store.currentUser.company ? store.currentUser.company.toLowerCase() : '';
            userInvoices = store.invoices.filter(i => 
                (i.createdByEmail && i.createdByEmail.toLowerCase() === userEmail) ||
                (i.clientEmail && i.clientEmail.toLowerCase() === userEmail) ||
                (i.client && userName && i.client.toLowerCase() === userName) ||
                (i.client && userCompany && i.client.toLowerCase() === userCompany)
            );
        } else {
            userInvoices = [];
        }
    }

    const totalRev = userInvoices.reduce((acc, i) => acc + i.total, 0);
    const outstanding = userInvoices.filter(i => i.status !== 'PAID').reduce((acc, i) => acc + i.total, 0);
    const canGenerateInvoice = !isClient;

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h2>💳 Financial Management & Invoicing</h2>
                <p>${isClient ? 'View your campaign invoices, subtotal & tax breakdown, download PDF statements, and process online payments.' : 'Generate invoices, track line items, payments & agency revenue summaries.'}</p>
            </div>
            ${canGenerateInvoice ? `<button class="btn-primary" onclick="openInvoiceModal()">+ Generate Invoice</button>` : ''}
        </div>

        <div class="stats-grid">
            <div class="stat-card green">
                <div class="stat-title">Total Invoiced Amount</div>
                <div class="stat-value">LKR ${totalRev.toLocaleString()}</div>
                <div class="stat-desc">Taxes included (8% VAT)</div>
            </div>
            <div class="stat-card amber">
                <div class="stat-title">Outstanding / Due Balance</div>
                <div class="stat-value">LKR ${outstanding.toLocaleString()}</div>
                <div class="stat-desc">Pending clearance</div>
            </div>
        </div>

        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Campaign</th>
                        <th>Subtotal</th>
                        <th>8% VAT</th>
                        <th>Total (LKR)</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${userInvoices.length === 0 ? `
                        <tr>
                            <td colspan="8" style="text-align:center; padding:30px; color:var(--text-secondary);">
                                No invoices found for your account.
                            </td>
                        </tr>
                    ` : userInvoices.map(i => `
                        <tr>
                            <td><strong>${i.number}</strong></td>
                            <td>${i.campaign}</td>
                            <td>Rs. ${(i.subtotal || i.total * 0.92).toLocaleString()}</td>
                            <td>Rs. ${(i.tax || i.total * 0.08).toLocaleString()}</td>
                            <td><strong>Rs. ${i.total.toLocaleString()}</strong></td>
                            <td>${i.dueDate}</td>
                            <td><span class="badge badge-${i.status.toLowerCase()}">${i.status}</span></td>
                            <td>
                                <div class="action-btn-group">
                                    ${i.status !== 'PAID' ? `
                                        <button class="btn-pay-quick" onclick="payInvoiceModal(${i.id})">
                                            💳 Pay Online
                                        </button>
                                    ` : `
                                        <button class="btn-breakdown-quick" onclick="viewInvoiceDetails(${i.id})">
                                            🔍 Breakdown
                                        </button>
                                    `}
                                    
                                    <div class="action-dropdown-container">
                                        <button class="btn-action-trigger" onclick="toggleInvoiceActionMenu(${i.id}, event)">
                                            ⚙️ Actions ▾
                                        </button>
                                        <div class="action-dropdown-menu" id="invoiceActionMenu-${i.id}">
                                            <button class="dropdown-item" onclick="viewInvoiceDetails(${i.id})">
                                                <span class="item-icon">🔍</span> View Breakdown & Details
                                            </button>
                                            <button class="dropdown-item" onclick="downloadInvoicePDF(${i.id})">
                                                <span class="item-icon">📄</span> Download PDF Statement
                                            </button>
                                            ${i.status !== 'PAID' ? `
                                                <button class="dropdown-item highlight-item" onclick="payInvoiceModal(${i.id})">
                                                    <span class="item-icon">💳</span> Pay Online & Receipt
                                                </button>
                                            ` : `
                                                <div class="dropdown-item-info">
                                                    <span class="item-icon">✅</span> Paid & Cleared
                                                </div>
                                            `}
                                            ${!isClient ? `
                                                <div class="dropdown-divider"></div>
                                                <div class="dropdown-header">Staff Management</div>
                                                <button class="dropdown-item" onclick="editInvoice(${i.id})">
                                                    <span class="item-icon">✏️</span> Edit Invoice
                                                </button>
                                                <button class="dropdown-item" onclick="sendPaymentReminder(${i.id})">
                                                    <span class="item-icon">🔔</span> Send Payment Reminder
                                                </button>
                                                ${i.status !== 'PAID' ? `
                                                    <button class="dropdown-item" onclick="recordInvoicePayment(${i.id})">
                                                        <span class="item-icon">✅</span> Record Payment
                                                    </button>
                                                ` : ''}
                                                ${i.status === 'DRAFT' ? `
                                                    <button class="dropdown-item item-danger" onclick="deleteInvoice(${i.id})">
                                                        <span class="item-icon">🗑️</span> Delete Draft
                                                    </button>
                                                ` : `
                                                    <button class="dropdown-item item-danger" onclick="voidInvoice(${i.id})">
                                                        <span class="item-icon">⛔</span> Void Invoice
                                                    </button>
                                                `}
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Payment History Section -->
        <div class="card-box" style="margin-top: 24px;">
            <h4 style="font-size:1.1rem; font-weight:800; color:var(--black-obsidian); margin-bottom:12px;">📜 Payment & Settlement History</h4>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Transaction Ref</th>
                            <th>Invoice #</th>
                            <th>Amount Paid</th>
                            <th>Settlement Method</th>
                            <th>Payment Date</th>
                            <th>Receipt File</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userInvoices.filter(i => i.status === 'PAID').map(i => `
                            <tr>
                                <td><strong>TXN-${i.id}892</strong></td>
                                <td>${i.number}</td>
                                <td><strong>LKR ${i.total.toLocaleString()}</strong></td>
                                <td>Online Card / Direct Transfer</td>
                                <td>${i.paidDate || i.issueDate}</td>
                                <td><span style="color:var(--blue-electric); font-weight:700;">📄 ${i.receiptFile || 'Payment_Receipt_Official.pdf'}</span></td>
                            </tr>
                        `).join('')}
                        ${userInvoices.filter(i => i.status === 'PAID').length === 0 ? `
                            <tr><td colspan="6" style="text-align:center; padding:16px; color:var(--text-secondary);">No completed payment history yet.</td></tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Toggle Invoice Row Action Dropdown Menu
function toggleInvoiceActionMenu(id, event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById(`invoiceActionMenu-${id}`);
    if (!menu) return;

    const isVisible = menu.classList.contains('show');
    document.querySelectorAll('.action-dropdown-menu.show').forEach(m => {
        if (m !== menu) m.classList.remove('show');
    });

    if (isVisible) {
        menu.classList.remove('show');
    } else {
        menu.classList.add('show');
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-dropdown-container')) {
        document.querySelectorAll('.action-dropdown-menu.show').forEach(m => m.classList.remove('show'));
    }
});

// View Detailed Breakdown Modal
function viewInvoiceDetails(id) {
    const inv = store.invoices.find(i => i.id === id);
    if (!inv) return;

    const sub = inv.subtotal || inv.total * 0.92;
    const tax = inv.tax || inv.total * 0.08;

    document.getElementById('modalTitle').innerText = `📄 Invoice Details: ${inv.number}`;
    document.getElementById('modalBody').innerHTML = `
        <div style="padding-bottom:12px; border-bottom:1px solid var(--border-blue); margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="font-weight:800; color:var(--black-obsidian);">${inv.number}</h4>
                <span class="badge badge-${inv.status.toLowerCase()}">${inv.status}</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;"><strong>Campaign:</strong> ${inv.campaign} | <strong>Client:</strong> ${inv.client}</p>
        </div>

        <div class="table-container" style="margin-bottom:16px;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Item Description</th>
                        <th>Rate</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>3D Billboard Anamorphic Video Production & Media Slot</td>
                        <td>Rs. ${(sub * 0.7).toLocaleString()}</td>
                        <td>1</td>
                        <td>Rs. ${(sub * 0.7).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Digital Marketing Campaign Optimization & Copywriting</td>
                        <td>Rs. ${(sub * 0.3).toLocaleString()}</td>
                        <td>1</td>
                        <td>Rs. ${(sub * 0.3).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background:var(--blue-soft); border:1px solid var(--border-blue); border-radius:8px; padding:14px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.88rem;">
                <span>Subtotal Amount:</span>
                <strong>LKR ${sub.toLocaleString()}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.88rem;">
                <span>Government Tax (8% VAT):</span>
                <strong>LKR ${tax.toLocaleString()}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-blue); padding-top:6px; font-size:1.05rem; font-weight:800; color:var(--blue-electric);">
                <span>Grand Total Due:</span>
                <span>LKR ${inv.total.toLocaleString()}</span>
            </div>
        </div>

        <button class="btn-primary" style="width:100%;" onclick="downloadInvoicePDF(${inv.id})">📄 Download Printable PDF Statement ➔</button>
    `;
    showPortalModal();
}

// Bank Slip / Receipt Photo Upload Modal
function payInvoiceModal(id) {
    const inv = store.invoices.find(i => i.id === id);
    if (!inv) return;

    const userName = store.currentUser ? store.currentUser.name : 'Kasun Perera';

    document.getElementById('modalTitle').innerText = `🧾 Upload Payment Receipt Slip: ${inv.number}`;
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="processInvoicePayment(event, ${inv.id})">
            <div style="background:#F0F9FF; border:1px solid #BAE6FD; padding:14px; border-radius:8px; margin-bottom:16px;">
                <p style="font-size:0.92rem; color:#0369A1; font-weight:800; margin-bottom:4px;">Total Invoice Amount Due: LKR ${inv.total.toLocaleString()}</p>
                <p style="font-size:0.8rem; color:var(--text-secondary);">Campaign: ${inv.campaign} | Due Date: ${inv.dueDate}</p>
            </div>

            <!-- Bank Transfer Details Guide -->
            <div style="background:var(--blue-soft); border:1px solid var(--border-blue); padding:12px 14px; border-radius:8px; margin-bottom:16px; font-size:0.82rem;">
                <h6 style="font-weight:800; color:var(--blue-electric); margin-bottom:4px;">🏦 Agency Bank Account Details for Direct Deposit:</h6>
                <p style="margin-bottom:2px;"><strong>Bank Name:</strong> Commercial Bank of Ceylon PLC (Main Branch)</p>
                <p style="margin-bottom:2px;"><strong>Account Name:</strong> BrightWave Advertising (Pvt) Ltd</p>
                <p style="margin-bottom:0;"><strong>Account No:</strong> 800-459-1029 (Payment Ref: ${inv.number})</p>
            </div>

            <div class="form-group">
                <label>Payer / Client Name</label>
                <input type="text" id="payName" class="form-control" value="${userName}" required>
            </div>

            <div class="form-group">
                <label>Bank Reference / Slip Deposit No.</label>
                <input type="text" id="payTxn" class="form-control" placeholder="e.g. REF98124 or Slip No. 4029" required>
            </div>

            <!-- File Upload Zone for Mobile Gallery & PC File Explorer -->
            <div class="form-group">
                <label>📷 Select Payment Receipt Photo / Slip (Gallery or PC Desktop):</label>
                <input type="file" id="payReceiptFile" class="form-control" accept="image/*,application/pdf" onchange="previewReceiptFile(this)" required style="padding:8px;">
                <small style="color:var(--text-secondary); font-size:0.75rem; margin-top:4px; display:block;">
                    📱 Phone: Choose photo directly from Gallery / Camera.<br>
                    💻 PC: Select receipt image/PDF from Desktop or Folder.
                </small>
            </div>

            <!-- Live Image / Filename Preview Container -->
            <div id="receiptPreviewBox" style="display:none; margin-bottom:16px; background:#F8FAFC; border:1px dashed #CBD5E1; padding:10px; border-radius:8px; text-align:center;">
                <img id="receiptImagePreview" src="" alt="Receipt Preview" style="max-height:160px; max-width:100%; border-radius:6px; display:none; margin:0 auto 8px auto; border:1px solid #CBD5E1;">
                <p id="receiptFileName" style="font-size:0.82rem; font-weight:700; color:var(--blue-electric); margin:0;"></p>
            </div>

            <button type="submit" class="btn-primary" style="width:100%; background:#10B981; border-color:#10B981; padding:12px; font-size:0.95rem;">
                📤 Upload Receipt & Settle Payment ➔
            </button>
        </form>
    `;
    showPortalModal();
}

function previewReceiptFile(input) {
    const previewBox = document.getElementById('receiptPreviewBox');
    const imgPreview = document.getElementById('receiptImagePreview');
    const fileNameEl = document.getElementById('receiptFileName');

    if (input.files && input.files[0]) {
        const file = input.files[0];
        fileNameEl.innerText = `📄 Selected File: ${file.name}`;
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imgPreview.style.display = 'none';
        }
        previewBox.style.display = 'block';
    }
}

function processInvoicePayment(e, id) {
    e.preventDefault();
    const inv = store.invoices.find(i => i.id === id);
    const fileInput = document.getElementById('payReceiptFile');
    let receiptName = `Bank_Slip_${inv ? inv.number : 'Payment'}.jpg`;

    if (fileInput && fileInput.files && fileInput.files[0]) {
        receiptName = fileInput.files[0].name;
    }

    if (inv) {
        inv.status = 'PAID';
        inv.paidDate = new Date().toISOString().split('T')[0];
        inv.receiptFile = receiptName;

        // Update matching campaign payment status
        const camp = store.campaigns.find(c => (c.title && inv.campaign && c.title.toLowerCase() === inv.campaign.toLowerCase()) || c.id === inv.campaignId);
        if (camp) {
            camp.status = 'PAID';
            camp.paymentSettled = true;
        }

        saveWorkflowDataToStorage();

        if (window.AdFlowAPI) {
            AdFlowAPI.updateInvoiceStatus(id, 'PAID').catch(err => console.warn('Invoice payment DB sync:', err));
        }

        addNotification('Payment Settled', `Bank receipt uploaded for ${inv.number}. Payment cleared!`, '🧾');
        addNotification('💰 Payment Received!', `Client settled invoice of LKR ${inv.total.toLocaleString()} for "${inv.campaign}".`, '🎉');

        document.getElementById('modalTitle').innerText = '🎉 Payment Successful!';
        document.getElementById('modalBody').innerHTML = `
            <div style="text-align:center; padding:12px 0;">
                <div style="font-size:3.2rem; margin-bottom:8px;">✅</div>
                <h3 style="color:#065F46; font-weight:800; margin-bottom:6px;">Payment of LKR ${inv.total.toLocaleString()} Received!</h3>
                <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; margin-bottom:18px;">
                    Your payment receipt (<strong>${escapeHtml(receiptName)}</strong>) for <strong>${escapeHtml(inv.campaign)}</strong> has been verified. Invoice <strong>${inv.number}</strong> is now marked as <span class="badge badge-paid">PAID</span>!
                </p>
                <div style="background:var(--blue-soft); border:1px solid var(--border-blue); border-radius:8px; padding:12px; margin-bottom:18px; text-align:left; font-size:0.85rem;">
                    <strong>🌟 Help us improve!</strong> Please share your thoughts and review for the creative work delivered by the agency team.
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="closeModal(); renderCurrentModule();">Done</button>
                    <button class="btn-primary" style="flex:1.8; justify-content:center; background:#10B981; border-color:#10B981;" onclick="closeModal(); renderCurrentModule(); openFeedbackModal('${escapeHtml(inv.campaign)} Deliverables', '${escapeHtml(inv.campaign)}');">⭐ Give Feedback & Review &rarr;</button>
                </div>
            </div>
        `;
        return;
    }

    closeModal();
    renderCurrentModule();
}

// Download Printable PDF Statement
function downloadInvoicePDF(id) {
    const inv = store.invoices.find(i => i.id === id);
    if (!inv) return;

    const sub = inv.subtotal || inv.total * 0.92;
    const tax = inv.tax || inv.total * 0.08;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Official Invoice - ${inv.number}</title>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0B0F19; }
                .inv-header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563EB; padding-bottom: 20px; margin-bottom: 30px; }
                .inv-title { font-size: 28px; font-weight: 800; color: #2563EB; }
                .inv-details { margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { padding: 12px; border: 1px solid #E2E8F0; text-align: left; }
                th { background: #EFF6FF; color: #0B0F19; font-weight: bold; }
                .total-box { float: right; width: 300px; background: #F8FAFC; border: 1px solid #CBD5E1; padding: 15px; border-radius: 8px; }
                .stamp { color: #10B981; font-weight: 800; font-size: 18px; text-transform: uppercase; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="inv-header">
                <div>
                    <div class="inv-title">BrightWave Advertising</div>
                    <p>Premier 3D & Digital Advertising Agency • Colombo, Sri Lanka</p>
                </div>
                <div style="text-align: right;">
                    <h2>INVOICE</h2>
                    <p><strong>Invoice #:</strong> ${inv.number}</p>
                    <p><strong>Date:</strong> ${inv.issueDate}</p>
                    <p><strong>Due Date:</strong> ${inv.dueDate}</p>
                </div>
            </div>

            <div class="inv-details">
                <p><strong>Billed To:</strong> ${inv.client}</p>
                <p><strong>Campaign:</strong> ${inv.campaign}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Rate (LKR)</th>
                        <th>Total (LKR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>3D LED Billboard Production & Media Placement</td>
                        <td>${sub.toLocaleString()}</td>
                        <td>${sub.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            <div class="total-box">
                <p>Subtotal: <strong>LKR ${sub.toLocaleString()}</strong></p>
                <p>VAT (8%): <strong>LKR ${tax.toLocaleString()}</strong></p>
                <hr>
                <h3>Total: LKR ${inv.total.toLocaleString()}</h3>
                <div class="stamp">STATUS: ${inv.status}</div>
            </div>
            <script>window.print();</script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

function openInvoiceModal() {
    document.getElementById('modalTitle').innerText = 'Generate Client Invoice';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveInvoice(event)">
            <div class="form-group">
                <label>Invoice Number</label>
                <input type="text" id="invNum" class="form-control" value="INV-2026-003" required>
            </div>
            <div class="form-group">
                <label>Subtotal Amount (LKR)</label>
                <input type="number" id="invAmount" class="form-control" min="1" step="1" value="750000" onkeydown="if(event.key==='-') event.preventDefault();" required>
            </div>
            <button type="submit" class="btn-primary" style="width:100%;">Create Invoice</button>
        </form>
    `;
    showPortalModal();
}

function saveInvoice(e) {
    e.preventDefault();
    const sub = parseFloat(document.getElementById('invAmount').value);
    if (!Number.isFinite(sub) || sub <= 0) {
        return alert('Invoice amount must be greater than 0. Negative amounts are not allowed.');
    }
    const tax = sub * 0.08;
    const invNum = document.getElementById('invNum').value;
    const newInv = {
        id: Date.now(),
        number: invNum,
        campaign: '5G Mega Launch 2026',
        client: store.currentUser ? store.currentUser.name : 'Dialog Axiata PLC',
        createdByEmail: store.currentUser ? store.currentUser.email : 'client@dialog.lk',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '2026-04-15',
        subtotal: sub,
        tax: tax,
        total: sub + tax,
        status: 'SENT'
    };
    store.invoices.push(newInv);
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.createInvoice({
            invoiceNumber: invNum,
            campaignId: 1,
            clientId: 1,
            itemDescription: 'Advertising Campaign Production & Media Services',
            quantity: 1,
            unitPrice: sub,
            taxRate: 0.08,
            status: 'SENT'
        }).catch(err => console.warn('Invoice DB create sync:', err));
    }

    closeModal();
    renderCurrentModule();
}

function editInvoice(id){const i=store.invoices.find(x=>x.id===id);if(!i)return;document.getElementById('modalTitle').innerText='Edit Invoice';document.getElementById('modalBody').innerHTML=`<form onsubmit="updateInvoice(event,${id})"><div class="form-group"><label>Invoice Number</label><input id="invEditNum" class="form-control" value="${i.number}" required></div><div class="form-group"><label>Campaign</label><input id="invEditCampaign" class="form-control" value="${i.campaign}" required></div><div class="form-group"><label>Client</label><input id="invEditClient" class="form-control" value="${i.client}" required></div><div class="form-group"><label>Subtotal (LKR)</label><input id="invEditSubtotal" type="number" min="1" step="1" class="form-control" value="${i.subtotal||0}" onkeydown="if(event.key==='-') event.preventDefault();" required></div><div class="form-group"><label>Due Date</label><input id="invEditDue" type="date" class="form-control" value="${i.dueDate}" required></div><div class="form-group"><label>Status</label><select id="invEditStatus" class="form-control">${['DRAFT','SENT','OVERDUE','PAID','VOID'].map(v=>`<option ${i.status===v?'selected':''}>${v}</option>`).join('')}</select></div><button class="btn-primary" style="width:100%">Save Invoice</button></form>`;showPortalModal();}
function updateInvoice(e,id){
    e.preventDefault();
    const i=store.invoices.find(x=>x.id===id);
    if(!i)return;
    const client=document.getElementById('invEditClient').value.trim();
    const sub=parseFloat(document.getElementById('invEditSubtotal').value);
    if(!client||/^\d+$/.test(client)||!/[A-Za-z]/.test(client))return alert('Client name must contain letters and cannot be numbers only.');
    if(!Number.isFinite(sub)||sub<=0)return alert('Subtotal must be greater than 0. Negative amounts are not allowed.');
    i.number=document.getElementById('invEditNum').value;
    i.campaign=document.getElementById('invEditCampaign').value;
    i.client=client;
    i.subtotal=sub;
    i.tax=i.subtotal*.08;
    i.total=i.subtotal+i.tax;
    i.dueDate=document.getElementById('invEditDue').value;
    i.status=document.getElementById('invEditStatus').value;
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateInvoice({
            invoiceId: id,
            id: id,
            status: i.status
        }).catch(err => console.warn('Invoice update DB sync:', err));
    }

    closeModal();
    renderCurrentModule();
}
function recordInvoicePayment(id){
    const i=store.invoices.find(x=>x.id===id);
    if(!i)return;
    i.status='PAID';
    i.paidDate=new Date().toISOString().split('T')[0];
    i.receiptFile=i.receiptFile||'Manual_Payment_Receipt.pdf';
    saveWorkflowDataToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.updateInvoiceStatus(id, 'PAID').catch(err => console.warn('Invoice record payment DB sync:', err));
    }

    addNotification('Payment Recorded',`${i.number} marked PAID by finance.`,'💳');
    renderCurrentModule();
}
function sendPaymentReminder(id){const i=store.invoices.find(x=>x.id===id);if(!i)return;addNotification('Payment Reminder Sent',`Reminder sent for ${i.number} due ${i.dueDate}.`,'🔔');alert(`Payment reminder sent for ${i.number}.`);}
function voidInvoice(id){
    const i=store.invoices.find(x=>x.id===id);
    if(i&&confirm('Void this invoice while preserving the audit record?')){
        i.status='VOID';
        saveWorkflowDataToStorage();
        if (window.AdFlowAPI) {
            AdFlowAPI.updateInvoiceStatus(id, 'CANCELLED').catch(err => console.warn('Invoice void DB sync:', err));
        }
        renderCurrentModule();
    }
}
function deleteInvoice(id){
    const i=store.invoices.find(x=>x.id===id);
    if(!i)return;
    if(i.status!=='DRAFT'){
        alert('Only draft invoices can be deleted. Use Void for sent invoices.');
        return;
    }
    if(confirm('Delete this draft invoice?')){
        store.invoices=store.invoices.filter(x=>x.id!==id);
        saveWorkflowDataToStorage();
        if (window.AdFlowAPI) {
            AdFlowAPI.deleteInvoice(id).catch(err => console.warn('Invoice delete DB sync:', err));
        }
        renderCurrentModule();
    }
}

// Helper Functions
function renderNotifications(container) {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h2>🔔 System Notifications & Alerts</h2>
                <p>Minor Function • System-wide notification dispatch</p>
            </div>
        </div>
        <div class="table-container">
            <p><strong>Appointment Reminder:</strong> You have an upcoming consultation meeting on 2026-03-12 at 14:30.</p>
            <br>
            <p><strong>Feedback Notice:</strong> Client Kasun Perera submitted review on 5G Lotus Tower Mockup.</p>
        </div>
    `;
}

function renderProfile(container) {
    const user = store.currentUser || {
        name: 'Kasun Perera',
        email: 'client@dialog.lk',
        phone: '+94 77 123 4567',
        role: store.currentRole || 'CLIENT',
        company: 'Dialog Axiata PLC'
    };

    container.innerHTML = `
        <div class="page-header">
            <div class="page-title">
                <h2>👤 My Account & Profile Settings</h2>
                <p>Manage your account credentials, update full name, contact number, and security password.</p>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px;">
            <!-- Left Panel: User Avatar & Role Overview Card -->
            <div class="card-box" style="text-align:center;">
                <div style="width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg, var(--blue-electric), var(--blue-dark)); color:var(--pure-white); font-size:2.4rem; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto; box-shadow:0 6px 18px rgba(37,99,235,0.3);">
                    ${user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
                <h3 style="font-weight:800; color:var(--black-obsidian); margin-bottom:4px;" id="profileDisplayName">${user.name || 'User Account'}</h3>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">${user.email}</p>
                <span class="badge badge-completed" style="font-size:0.85rem; padding:6px 16px; margin-bottom:18px;">Role: ${user.role || store.currentRole}</span>

                <div style="border-top:1px solid var(--border-blue); padding-top:16px; text-align:left; font-size:0.85rem;">
                    <p style="margin-bottom:8px;"><strong>📞 Contact Phone:</strong> <span id="profileDisplayPhone">${user.phone || '+94 77 123 4567'}</span></p>
                    <p style="margin-bottom:0;"><strong>🛡️ System Access:</strong> Verified Active Account</p>
                </div>
            </div>

            <!-- Right Panel: Interactive Profile & Password Edit Form -->
            <div class="card-box">
                <h4 style="font-size:1.15rem; font-weight:800; color:var(--black-obsidian); margin-bottom:16px; display:flex; align-items:center; gap:8px;">
                    ✏️ Edit Profile Details & Password
                </h4>

                <div id="profileAlertBox" style="display:none;" class="auth-alert-box auth-alert-success">
                    ✅ Profile updated successfully!
                </div>

                <form onsubmit="updateUserProfile(event)">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="profName" class="form-control" value="${user.name || ''}" placeholder="Enter full name" required>
                    </div>

                    <div class="form-group">
                        <label>Email Address (Account Identifier)</label>
                        <input type="email" id="profEmail" class="form-control" value="${user.email || ''}" readonly style="background:var(--ice-blue);">
                        <small style="color:var(--text-secondary); font-size:0.75rem;">Email cannot be modified as it acts as your unique account ID.</small>
                    </div>

                    <div class="form-group">
                        <label>Contact Phone Number (10 Digits)</label>
                        <input type="tel" id="profPhone" class="form-control" maxlength="10" inputmode="numeric" pattern="[0-9]{10}" value="${(user.phone || '0771234567').replace(/[^0-9]/g, '').slice(-10)}" placeholder="e.g. 0771234567" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);" required>
                        <small style="color:var(--text-secondary); font-size:0.75rem;">Contact number must be exactly 10 digits (0-9 only).</small>
                    </div>

                    <div class="form-group">
                        <label>New Security Password (Leave blank to keep unchanged)</label>
                        <input type="password" id="profPassword" class="form-control" placeholder="Enter new password (min 6 characters)">
                    </div>

                    <button type="submit" class="btn-primary" style="width:100%; padding:12px;">💾 Save Profile Changes ➔</button>
                </form>
            </div>
        </div>
    `;
}

function updateUserProfile(e) {
    e.preventDefault();
    const newName = document.getElementById('profName').value.trim();
    const newPhone = document.getElementById('profPhone').value.trim().replace(/[^0-9]/g, '');
    const newPass = document.getElementById('profPassword').value.trim();

    if (!newPhone || newPhone.length !== 10) {
        alert('Contact Phone Number must be exactly 10 digits (e.g. 0771234567). You entered ' + newPhone.length + ' digits.');
        document.getElementById('profPhone').focus();
        return;
    }

    if (newPass && newPass.length < 6) {
        alert('Security Password must be at least 6 characters long!');
        return;
    }

    // Update active currentUser
    if (!store.currentUser) store.currentUser = {};
    store.currentUser.name = newName;
    store.currentUser.phone = newPhone;
    if (newPass) store.currentUser.password = newPass;

    // Update matching record in store.users database
    if (store.users && store.currentUser.email) {
        const uRec = store.users.find(u => u.email.toLowerCase() === store.currentUser.email.toLowerCase());
        if (uRec) {
            uRec.name = newName;
            uRec.phone = newPhone;
            if (newPass) uRec.password = newPass;
        }
        saveUsersToStorage();
    }

    saveCurrentUserToStorage();

    if (window.AdFlowAPI) {
        AdFlowAPI.saveStaff({
            id: (store.currentUser && store.currentUser.id) || 1,
            fullName: newName,
            phone: newPhone,
            password: newPass || undefined,
            email: store.currentUser ? store.currentUser.email : ''
        }).catch(err => console.warn('User Profile DB sync:', err));
    }

    addNotification('Profile Updated', 'Your profile name, contact number, and password have been saved successfully!', '👤');

    alert('Your profile details and password have been saved successfully!');
    renderCurrentModule();
}


function showPortalModal() {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.scrollTop = 0;
    const content = overlay.querySelector('.modal-content');
    if (content) content.scrollTop = 0;
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}
