/* ============================================================================
   AdFlow - Storage Utilities
   Session-scoped auth helpers — all persistent data lives in MySQL via REST API.
   localStorage has been intentionally removed; sessionStorage is used for the
   JWT token and current-user object so the session clears when the tab closes.
   ============================================================================ */

const StorageUtils = {
    PREFIX: 'adflow_',

    key(name) { return this.PREFIX + name; },

    /* ── Session Storage (replaces localStorage for all data) ─────────── */
    set(name, value) {
        try { sessionStorage.setItem(this.key(name), JSON.stringify(value)); return true; }
        catch { return false; }
    },

    get(name, fallback = null) {
        try {
            const raw = sessionStorage.getItem(this.key(name));
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
    },

    remove(name) { sessionStorage.removeItem(this.key(name)); },

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

    /* ── Auth Helpers (sessionStorage — cleared on tab close) ────────── */
    getToken()     { return sessionStorage.getItem('adflow_jwt_token'); },
    setToken(t)    { sessionStorage.setItem('adflow_jwt_token', t); },
    removeToken()  { sessionStorage.removeItem('adflow_jwt_token'); },

    getUser()      {
        try { return JSON.parse(sessionStorage.getItem('adflow_user')); }
        catch { return null; }
    },
    setUser(u)     { sessionStorage.setItem('adflow_user', JSON.stringify(u)); },
    removeUser()   { sessionStorage.removeItem('adflow_user'); },

    clearAuth() { this.removeToken(); this.removeUser(); },

    /* ── Preferences (session-scoped) ────────────────────────────────── */
    getPref(key, fallback = null)      { return this.get('pref_' + key, fallback); },
    setPref(key, value)                { return this.set('pref_' + key, value); },

    /* ── Clear All Session Keys ──────────────────────────────────────── */
    clearAll() {
        Object.keys(sessionStorage)
            .filter(k => k.startsWith(this.PREFIX))
            .forEach(k => sessionStorage.removeItem(k));
    }
};

window.StorageUtils = StorageUtils;
