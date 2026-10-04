/* ============================================================================
   AdFlow - API Configuration
   Central API settings for all feature modules
   ============================================================================ */

const ApiConfig = {
    BASE_URL: 'http://localhost:8080/api',
    TIMEOUT_MS: 15000,
    TOKEN_KEY: 'adflow_jwt_token',
    USER_KEY: 'adflow_user',
    HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    ENDPOINTS: {
        AUTH:         '/auth',
        LOGIN:        '/auth/login',
        REGISTER:     '/auth/register',
        USERS:        '/users',
        APPOINTMENTS: '/appointments',
        CAMPAIGNS:    '/campaigns',
        TASKS:        '/tasks',
        ASSETS:       '/assets',
        FEEDBACK:     '/feedback',
        INVOICES:     '/invoices'
    }
};

window.ApiConfig = ApiConfig;
