/* AdFlow - Feedback API */
const FeedbackApi = {
    async getAll()     { return await SharedApiClient.safeGet(ApiConfig.ENDPOINTS.FEEDBACK); },
    async create(data) { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.FEEDBACK, { action: 'CREATE', ...data }); },
    async update(data) { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.FEEDBACK, { action: 'UPDATE_STATUS', ...data }); },
    async delete(id)   { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.FEEDBACK, { action: 'DELETE', feedbackId: id }); }
};
window.FeedbackApi = FeedbackApi;
