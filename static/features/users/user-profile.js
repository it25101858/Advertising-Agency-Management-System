/* AdFlow - User Profile Controller */
document.addEventListener('DOMContentLoaded', async () => {
    if (!PermissionUtils.requireAuth()) return;
    Navbar.render(); Navbar.init();
    Sidebar.render('user-profile');
    Modal.init();

    const user = StorageUtils.getUser();
    if (!user) return;

    renderProfile(user);
    renderStats(user);
    setupForm(user);
});

function renderProfile(user) {
    const name     = user.fullName || user.name || 'User';
    const role     = FormatUtils.humanize(user.role || 'User');
    const color    = FormatUtils.colorFromString(name);
    const initials = FormatUtils.initials(name);

    const el = id => document.getElementById(id);
    if (el('profileAvatar'))     el('profileAvatar').style.background = color;
    if (el('profileInitials'))   el('profileInitials').textContent = initials;
    if (el('profileName'))       el('profileName').textContent = name;
    if (el('profileRole'))       el('profileRole').textContent = role;
    if (el('profileEmail'))      el('profileEmail').textContent = user.email || '—';
    if (el('profilePhone'))      el('profilePhone').textContent = user.phone || '—';
    if (el('profileCompany'))    el('profileCompany').textContent = user.company || 'BrightWave Advertising (Pvt) Ltd';
    if (el('profileJoined'))     el('profileJoined').textContent = DateUtils.format(user.createdAt || user.joinedAt) || '—';
}

function renderStats(user) {
    // Stats based on role (placeholders, would load from API in production)
    const el = id => document.getElementById(id);
    if (el('statModule')) el('statModule').textContent = FormatUtils.humanize(user.role || 'USER');
    if (el('statStatus')) el('statStatus').textContent = 'Active';
}

function setupForm(user) {
    const form = document.getElementById('profileForm');
    if (!form) return;

    // Pre-fill form
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('editName',    user.fullName || user.name);
    setVal('editEmail',   user.email);
    setVal('editPhone',   user.phone);
    setVal('editCompany', user.company);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updated = {
            ...user,
            fullName: document.getElementById('editName')?.value?.trim(),
            phone:    document.getElementById('editPhone')?.value?.trim(),
            company:  document.getElementById('editCompany')?.value?.trim()
        };

        const emailErr = ValidationUtils.email(document.getElementById('editEmail')?.value);
        if (emailErr) { Toast.error(emailErr); return; }

        const btn = form.querySelector('[type=submit]');
        await Loader.withButton(btn, async () => {
            try {
                await SharedApiClient.post(`${ApiConfig.ENDPOINTS.USERS}`, { action: 'UPDATE_PROFILE', ...updated });
                StorageUtils.setUser(updated);
                renderProfile(updated);
                Toast.success('Profile updated successfully!');
            } catch (err) {
                Toast.error(err.message || 'Failed to update profile.');
            }
        });
    });

    // Password form
    const pwForm = document.getElementById('passwordForm');
    if (pwForm) {
        pwForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const current = document.getElementById('currentPassword')?.value;
            const newPass = document.getElementById('newPassword')?.value;
            const confirm = document.getElementById('confirmPassword')?.value;

            const passErr  = ValidationUtils.password(newPass);
            const matchErr = ValidationUtils.passwordMatch(newPass, confirm);
            if (passErr)  { Toast.error(passErr);  return; }
            if (matchErr) { Toast.error(matchErr); return; }

            const btn = pwForm.querySelector('[type=submit]');
            await Loader.withButton(btn, async () => {
                try {
                    await SharedApiClient.post('/auth/change-password', { currentPassword: current, newPassword: newPass });
                    Toast.success('Password changed successfully!');
                    pwForm.reset();
                } catch (err) {
                    Toast.error(err.message || 'Failed to change password. Check current password.');
                }
            });
        });
    }
}
