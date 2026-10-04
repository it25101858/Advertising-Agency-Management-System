/* ============================================================================
   AdFlow - Shared API Client
   JWT-authenticated fetch wrapper with error handling and fallbacks
   ============================================================================ */

const SharedApiClient = {
    /* ── Token / Auth ──────────────────────────────────────────────────── */
    getToken()            { return localStorage.getItem(ApiConfig.TOKEN_KEY); },
    setToken(t)           { localStorage.setItem(ApiConfig.TOKEN_KEY, t); },
    removeToken()         { localStorage.removeItem(ApiConfig.TOKEN_KEY); },
    getCurrentUser()      { try { return JSON.parse(localStorage.getItem(ApiConfig.USER_KEY)); } catch { return null; } },
    setCurrentUser(u)     { localStorage.setItem(ApiConfig.USER_KEY, JSON.stringify(u)); },
    removeCurrentUser()   { localStorage.removeItem(ApiConfig.USER_KEY); },
    isAuthenticated()     { return !!this.getToken() && !!this.getCurrentUser(); },
    hasRole(role)         {
        const u = this.getCurrentUser();
        return u && (u.role === role || u.authorities?.some(a => a.authority === role));
    },
    clearSession() {
        this.removeToken();
        this.removeCurrentUser();
    },

    /* ── Core HTTP Request ─────────────────────────────────────────────── */
    async request(endpoint, options = {}) {
        const url = `${ApiConfig.BASE_URL}${endpoint}`;
        const headers = { ...ApiConfig.HEADERS, ...(options.headers || {}) };

        const token = this.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Remove Content-Type for FormData (let browser set boundary)
        if (options.body instanceof FormData) delete headers['Content-Type'];

        const config = {
            method:  options.method || 'GET',
            headers,
            signal:  AbortSignal.timeout ? AbortSignal.timeout(ApiConfig.TIMEOUT_MS) : undefined
        };

        if (options.body !== undefined) {
            config.body = (options.body instanceof FormData || typeof options.body === 'string')
                ? options.body
                : JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);

            if (response.status === 401) {
                this.clearSession();
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/login') && !currentPath.includes('/auth')) {
                    window.location.href = '/static/pages/auth/login.html';
                }
                return null;
            }

            // Handle empty 204 responses
            if (response.status === 204) return { success: true };

            const text = await response.text();
            let data;
            try { data = JSON.parse(text); }
            catch { data = { message: text || `HTTP ${response.status}` }; }

            if (!response.ok) {
                throw new Error(data.message || data.error || `HTTP ${response.status}`);
            }

            // Unwrap { data: ... } envelope if present
            return (data && data.data !== undefined) ? data.data : data;

        } catch (err) {
            if (err.name === 'TimeoutError') throw new Error('Request timed out. Check server connection.');
            console.error(`[AdFlow API] ${config.method} ${endpoint} →`, err.message);
            throw err;
        }
    },

    /* ── Convenience Methods ───────────────────────────────────────────── */
    get(endpoint, headers = {})           { return this.request(endpoint, { method: 'GET', headers }); },
    post(endpoint, body, headers = {})    { return this.request(endpoint, { method: 'POST', body, headers }); },
    put(endpoint, body, headers = {})     { return this.request(endpoint, { method: 'PUT', body, headers }); },
    patch(endpoint, body, headers = {})   { return this.request(endpoint, { method: 'PATCH', body, headers }); },
    delete(endpoint, headers = {})        { return this.request(endpoint, { method: 'DELETE', headers }); },
    upload(endpoint, formData)            { return this.request(endpoint, { method: 'POST', body: formData }); },

    /* ── Safe Request (returns null on error instead of throwing) ──────── */
    async safeRequest(endpoint, options = {}) {
        try { return await this.request(endpoint, options); }
        catch { return null; }
    },

    safeGet(endpoint)          { return this.safeRequest(endpoint, { method: 'GET' }); },
    safePost(endpoint, body)   { return this.safeRequest(endpoint, { method: 'POST', body }); },
    safePut(endpoint, body)    { return this.safeRequest(endpoint, { method: 'PUT', body }); },
    safeDelete(endpoint)       { return this.safeRequest(endpoint, { method: 'DELETE' }); }
};

window.SharedApiClient = SharedApiClient;

// Backward-compat alias
window.ApiClient = SharedApiClient;
