const API_BASE_URL = '/api';

const ApiClient = {
    getToken() {
        return localStorage.getItem('adflow_jwt_token');
    },
    setToken(token) {
        localStorage.setItem('adflow_jwt_token', token);
    },
    removeToken() {
        localStorage.removeItem('adflow_jwt_token');
    },
    getCurrentUser() {
        const u = localStorage.getItem('adflow_user');
        return u ? JSON.parse(u) : null;
    },
    setCurrentUser(user) {
        localStorage.setItem('adflow_user', JSON.stringify(user));
    },

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Accept': 'application/json',
            ...(options.headers || {})
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, { ...options, headers });
            if (response.status === 401) {
                this.removeToken();
                localStorage.removeItem('adflow_user');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return null;
            }
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'API request error');
            }
            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error.message);
            throw error;
        }
    }
};
window.ApiClient = ApiClient;
