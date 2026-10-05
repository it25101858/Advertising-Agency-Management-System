window.AuthApi = {
    async login(email, password) {
        return await ApiClient.request('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
    },
    async register(data) {
        return await ApiClient.request('/auth/register', {
            method: 'POST',
            body: data
        });
    }
};
