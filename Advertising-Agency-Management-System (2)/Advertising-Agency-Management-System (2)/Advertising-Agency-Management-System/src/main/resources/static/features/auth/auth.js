/* ============================================================================
   AdFlow - Auth Feature Controller
   Handles login/register form submission, tab switching, redirect
   ============================================================================ */

(function () {
    /* ── State ───────────────────────────────────────────────────────── */
    let activeTab = 'login';

    /* ── Init ────────────────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        // Redirect if already logged in
        if (StorageUtils.getToken() && StorageUtils.getUser()) {
            window.location.href = '/static/pages/dashboard/dashboard.html';
            return;
        }

        setupLoginForm();
        setupRegisterForm();
        Modal.init();

        // Check for URL tab param
        const params = new URLSearchParams(window.location.search);
        if (params.get('tab') === 'register') switchTab('register');
    });

    /* ── Tab Switching ───────────────────────────────────────────────── */
    window.switchTab = function (tab) {
        activeTab = tab;
        const loginForm  = document.getElementById('loginForm');
        const regForm    = document.getElementById('registerForm');
        const loginTab   = document.getElementById('tabLogin');
        const regTab     = document.getElementById('tabRegister');

        if (tab === 'login') {
            loginForm?.classList.remove('d-none');
            regForm?.classList.add('d-none');
            loginTab?.classList.add('active');
            regTab?.classList.remove('active');
        } else {
            loginForm?.classList.add('d-none');
            regForm?.classList.remove('d-none');
            regTab?.classList.add('active');
            loginTab?.classList.remove('active');
        }
        clearAlert();
    };

    /* ── Login ───────────────────────────────────────────────────────── */
    function setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email    = document.getElementById('loginEmail')?.value?.trim();
            const password = document.getElementById('loginPassword')?.value;
            const btn      = form.querySelector('[type=submit]');

            clearAlert();
            const errors = AuthValidation.validateLogin(email, password);
            if (errors.length) { showAlert(errors[0], 'error'); return; }

            await Loader.withButton(btn, async () => {
                try {
                    const res = await AuthApi.login(email, password);
                    if (res) {
                        // Handle both { token, ... } and { data: { token, ... } } shapes
                        const token = res.token || res.accessToken;
                        const user  = res.user || res;
                        if (token) {
                            StorageUtils.setToken(token);
                            StorageUtils.setUser(user);
                            window.location.href = '/static/pages/dashboard/dashboard.html';
                        } else {
                            showAlert('Login failed. Invalid credentials.', 'error');
                        }
                    } else {
                        showAlert('Login failed. Please check your credentials.', 'error');
                    }
                } catch (err) {
                    showAlert(err.message || 'Login failed. Please try again.', 'error');
                }
            });
        });
    }

    /* ── Register ────────────────────────────────────────────────────── */
    function setupRegisterForm() {
        const form = document.getElementById('registerForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                fullName:    document.getElementById('regName')?.value?.trim(),
                email:       document.getElementById('regEmail')?.value?.trim(),
                password:    document.getElementById('regPassword')?.value,
                phone:       document.getElementById('regPhone')?.value?.trim(),
                companyName: document.getElementById('regCompany')?.value?.trim()
            };
            const btn = form.querySelector('[type=submit]');

            clearAlert();
            const errors = AuthValidation.validateRegister(data);
            if (errors.length) { showAlert(errors[0], 'error'); return; }

            await Loader.withButton(btn, async () => {
                try {
                    const res = await AuthApi.register(data);
                    if (res) {
                        const token = res.token || res.accessToken;
                        const user  = res.user || res;
                        if (token) {
                            StorageUtils.setToken(token);
                            StorageUtils.setUser(user);
                            window.location.href = '/static/pages/dashboard/dashboard.html';
                        } else {
                            showAlert('Registration succeeded! You can now sign in.', 'success');
                            setTimeout(() => switchTab('login'), 1500);
                        }
                    } else {
                        showAlert('Registration failed. Email may already be in use.', 'error');
                    }
                } catch (err) {
                    showAlert(err.message || 'Registration failed. Please try again.', 'error');
                }
            });
        });
    }

    /* ── Alert helpers ───────────────────────────────────────────────── */
    function showAlert(msg, type = 'error') {
        const el = document.getElementById('authAlert');
        if (!el) return;
        el.className = `auth-alert show ${type}`;
        el.innerHTML = `${type === 'error' ? '❌' : '✅'} ${msg}`;
    }

    function clearAlert() {
        const el = document.getElementById('authAlert');
        if (el) { el.className = 'auth-alert'; el.innerHTML = ''; }
    }
})();
