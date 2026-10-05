document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await AuthApi.login(email, password);
                if (res && res.data) {
                    ApiClient.setToken(res.data.token);
                    ApiClient.setCurrentUser(res.data);
                    window.location.href = '/dashboard';
                }
            } catch (err) {
                Utils.showToast(err.message, 'error');
            }
        });
    }

    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                phone: document.getElementById('phone')?.value,
                companyName: document.getElementById('companyName')?.value
            };
            try {
                const res = await AuthApi.register(data);
                if (res && res.data) {
                    ApiClient.setToken(res.data.token);
                    ApiClient.setCurrentUser(res.data);
                    window.location.href = '/dashboard';
                }
            } catch (err) {
                Utils.showToast(err.message, 'error');
            }
        });
    }
});
