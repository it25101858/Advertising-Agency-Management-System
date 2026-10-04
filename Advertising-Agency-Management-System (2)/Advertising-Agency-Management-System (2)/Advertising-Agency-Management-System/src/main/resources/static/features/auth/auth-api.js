/* ============================================================================
   AdFlow - Auth API Module
   Handles login and registration API calls
   ============================================================================ */

const AuthApi = {
    async login(email, password) {
        return await SharedApiClient.post(ApiConfig.ENDPOINTS.LOGIN, { email, password });
    },

    async register(data) {
        return await SharedApiClient.post(ApiConfig.ENDPOINTS.REGISTER, data);
    },

    async logout() {
        try { await SharedApiClient.post('/auth/logout', {}); } catch {}
        SharedApiClient.clearSession();
    }
};

window.AuthApi = AuthApi;
