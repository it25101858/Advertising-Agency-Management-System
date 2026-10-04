/* ============================================================================
   AdFlow - Storage Utilities
   localStorage / sessionStorage helpers
   ============================================================================ */

const StorageUtils = {
    PREFIX: 'adflow_',

    key(name) { return this.PREFIX + name; },

    /* ── localStorage ────────────────────────────────────────────────── */
    set(name, value) {
        try { localStorage.setItem(this.key(name), JSON.stringify(value)); return true; }
        catch { return false; }
    },

    get(name, fallback = null) {
        try {
            const raw = localStorage.getItem(this.key(name));
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
    },

    remove(name) { localStorage.removeItem(this.key(name)); },

    /* ── Session Storage ─────────────────────────────────────────────── */
    sessionSet(name, value) {
        try { sessionStorage.setItem(this.key(name), JSON.stringify(value)); return true; }
        catch { return false; }
    },

    sessionGet(name, fallback = null) {
        try {
            const raw = sessionStorage.getItem(this.key(name));
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
    },

    sessionRemove(name) { sessionStorage.removeItem(this.key(name)); },

    /* ── Auth Helpers ────────────────────────────────────────────────── */
    getToken()     { return localStorage.getItem('adflow_jwt_token'); },
    setToken(t)    { localStorage.setItem('adflow_jwt_token', t); },
    removeToken()  { localStorage.removeItem('adflow_jwt_token'); },

    getUser()      {
        try { return JSON.parse(localStorage.getItem('adflow_user')); }
        catch { return null; }
    },
    setUser(u)     { localStorage.setItem('adflow_user', JSON.stringify(u)); },
    removeUser()   { localStorage.removeItem('adflow_user'); },

    clearAuth() { this.removeToken(); this.removeUser(); },

    /* ── Preferences ─────────────────────────────────────────────────── */
    getPref(key, fallback = null)      { return this.get('pref_' + key, fallback); },
    setPref(key, value)                { return this.set('pref_' + key, value); },

    /* ── Cache with TTL ──────────────────────────────────────────────── */
    cache(name, value, ttlSeconds = 300) {
        this.set(name + '_cache', { data: value, expires: Date.now() + ttlSeconds * 1000 });
    },

    getCache(name) {
        const obj = this.get(name + '_cache');
        if (!obj || Date.now() > obj.expires) { this.remove(name + '_cache'); return null; }
        return obj.data;
    },

    clearCache(name) { this.remove(name + '_cache'); },

    /* ── Clear All ───────────────────────────────────────────────────── */
    clearAll() {
        Object.keys(localStorage)
            .filter(k => k.startsWith(this.PREFIX))
            .forEach(k => localStorage.removeItem(k));
    }
};

window.StorageUtils = StorageUtils;
