window.UI = {
    openModal(modalId) {
        const el = document.getElementById(modalId);
        if (el) el.classList.add('active');
    },
    closeModal(modalId) {
        const el = document.getElementById(modalId);
        if (el) el.classList.remove('active');
    },
    setupLogout() {
        const btn = document.getElementById('btnLogout');
        if (btn) {
            btn.addEventListener('click', () => {
                ApiClient.removeToken();
                sessionStorage.removeItem('adflow_user');
                window.location.href = '/';
            });
        }
    }
};
document.addEventListener('DOMContentLoaded', () => {
    UI.setupLogout();
});
