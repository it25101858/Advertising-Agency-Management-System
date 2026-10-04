/* AdFlow - Users Controller */
let userState = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!PermissionUtils.requireModule('users')) return;
    Navbar.render(); Navbar.init();
    Sidebar.render('users');
    Modal.init();

    const live = await UsersApi.getAll();
    if (Array.isArray(live)) userState = live;

    loadUsers();
});

function loadUsers() {
    const search     = document.getElementById('searchInput')?.value?.toLowerCase();
    const filterRole = document.getElementById('filterRole')?.value;
    const tbody      = document.getElementById('userTableBody');
    if (!tbody) return;

    let filtered = userState.filter(u => {
        if (filterRole && filterRole !== 'ALL' && u.role !== filterRole) return false;
        if (search && !`${u.fullName || u.name} ${u.email}`.toLowerCase().includes(search)) return false;
        return true;
    });

    if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="5"><div class="table-empty">
            <div class="empty-icon">🛡️</div><div class="empty-title">No users found</div></div></td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(u => {
        const name    = u.fullName || u.name || '?';
        const initials = FormatUtils.initials(name);
        const color   = FormatUtils.colorFromString(name);
        const role    = FormatUtils.humanize(u.role || 'User');
        return `<tr>
            <td><div style="display:flex;align-items:center;gap:10px">
                <div style="width:36px;height:36px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:white;font-size:0.82rem;font-weight:800">${initials}</div>
                <div><div style="font-weight:700">${name}</div>
                <div style="font-size:0.75rem;color:var(--text-secondary)">${u.email}</div></div>
            </div></td>
            <td>${Table.statusBadge(u.role || 'STAFF')}</td>
            <td>${u.phone || '—'}</td>
            <td>${DateUtils.format(u.createdAt || u.joinedAt)}</td>
            <td><div class="table-actions">
                <button class="btn-icon" onclick="window.location.href='user-profile.html?id=${u.id}'" title="Profile">👤</button>
                <button class="btn-icon" style="color:var(--accent-red)" onclick="deleteUser(${u.id})" title="Delete">🗑️</button>
            </div></td>
        </tr>`;
    }).join('');
}

function openAddUserModal() {
    document.getElementById('addUserModalBody').innerHTML = `
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">Full Name <span class="required">*</span></label>
            <input type="text" id="newName" class="form-control" placeholder="Kavindu Perera" required>
        </div>
        <div class="form-group">
            <label class="form-label">Email <span class="required">*</span></label>
            <input type="email" id="newEmail" class="form-control" placeholder="kavindu@brightwave.lk" required>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label class="form-label">Password <span class="required">*</span></label>
            <input type="password" id="newPassword" class="form-control" placeholder="Min. 6 characters" required>
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="tel" id="newPhone" class="form-control" placeholder="+94 77 123 4567">
        </div>
    </div>
    <div class="form-group">
        <label class="form-label">Role <span class="required">*</span></label>
        <select id="newRole" class="form-control" required>
            <option value="">Select role...</option>
            ${Object.values(PermissionUtils.ROLES).filter(r => r !== 'CLIENT').map(r =>
                `<option value="${r}">${FormatUtils.humanize(r)}</option>`
            ).join('')}
        </select>
    </div>
    <div class="form-actions">
        <button class="btn btn-ghost" onclick="Modal.close('addUserModal')">Cancel</button>
        <button class="btn btn-primary" onclick="saveNewUser()">Add User</button>
    </div>`;
    Modal.open('addUserModal');
}

async function saveNewUser() {
    const data = {
        fullName: document.getElementById('newName')?.value?.trim(),
        email:    document.getElementById('newEmail')?.value?.trim(),
        password: document.getElementById('newPassword')?.value,
        phone:    document.getElementById('newPhone')?.value?.trim(),
        role:     document.getElementById('newRole')?.value
    };

    if (!data.fullName) { Toast.error('Full name is required.'); return; }
    const emailErr = ValidationUtils.email(data.email);
    if (emailErr)    { Toast.error(emailErr); return; }
    const passErr  = ValidationUtils.password(data.password);
    if (passErr)     { Toast.error(passErr); return; }
    if (!data.role)  { Toast.error('Please select a role.'); return; }

    const btn = document.querySelector('#addUserModal .btn-primary');
    await Loader.withButton(btn, async () => {
        try {
            await UsersApi.create(data);
            Toast.success('Staff account created!');
            Modal.close('addUserModal');
            const live = await UsersApi.getAll();
            if (Array.isArray(live)) { userState = live; loadUsers(); }
        } catch (err) {
            Toast.error(err.message || 'Failed to create user.');
        }
    });
}

async function deleteUser(id) {
    const confirmed = await Confirmation.delete('this staff account');
    if (!confirmed) return;
    const result = await UsersApi.delete(id);
    if (result !== null) {
        userState = userState.filter(u => u.id !== id);
        loadUsers();
        Toast.success('User deleted.');
    } else Toast.error('Failed to delete user.');
}
