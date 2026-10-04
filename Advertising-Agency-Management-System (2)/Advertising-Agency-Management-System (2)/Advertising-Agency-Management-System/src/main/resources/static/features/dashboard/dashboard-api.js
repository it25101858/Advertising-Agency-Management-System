/* ============================================================================
   AdFlow - Dashboard API Module
   ============================================================================ */

const DashboardApi = {
    async getSummary() {
        return await SharedApiClient.safeGet('/dashboard/summary');
    },
    async getRecentActivity() {
        return await SharedApiClient.safeGet('/dashboard/activity');
    },
    async getStats() {
        const [appts, campaigns, tasks, assets, feedback, invoices] = await Promise.allSettled([
            SharedApiClient.safeGet(ApiConfig.ENDPOINTS.APPOINTMENTS),
            SharedApiClient.safeGet(ApiConfig.ENDPOINTS.CAMPAIGNS),
            SharedApiClient.safeGet(ApiConfig.ENDPOINTS.TASKS),
            SharedApiClient.safeGet(ApiConfig.ENDPOINTS.ASSETS),
            SharedApiClient.safeGet(ApiConfig.ENDPOINTS.FEEDBACK),
            SharedApiClient.safeGet(ApiConfig.ENDPOINTS.INVOICES)
        ]);

        const len = (r) => (r.status === 'fulfilled' && Array.isArray(r.value)) ? r.value.length : null;

        return {
            appointments: len(appts),
            campaigns:    len(campaigns),
            tasks:        len(tasks),
            assets:       len(assets),
            feedback:     len(feedback),
            invoices:     len(invoices)
        };
    }
};

window.DashboardApi = DashboardApi;
