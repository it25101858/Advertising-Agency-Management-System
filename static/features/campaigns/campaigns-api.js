/* AdFlow - Campaigns API */
const CampaignsApi = {
    async getAll()     { return await SharedApiClient.safeGet(ApiConfig.ENDPOINTS.CAMPAIGNS); },
    async create(data) { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.CAMPAIGNS, { action: 'CREATE', ...data }); },
    async update(data) { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.CAMPAIGNS, { action: 'UPDATE', ...data }); },
    async delete(id)   { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.CAMPAIGNS, { action: 'DELETE_DRAFT', campaignId: id }); },
    async toggleAccess(id, access) { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.CAMPAIGNS, { action: 'TOGGLE_ACCESS', campaignId: id, clientAccess: access }); }
};
window.CampaignsApi = CampaignsApi;
