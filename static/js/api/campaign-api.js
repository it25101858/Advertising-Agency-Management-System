window.CampaignApi = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await ApiClient.request(`/campaigns${query ? '?' + query : ''}`);
    },
    async getById(id) {
        return await ApiClient.request(`/campaigns/${id}`);
    },
    async create(data) {
        return await ApiClient.request('/campaigns', { method: 'POST', body: data });
    },
    async update(id, data) {
        return await ApiClient.request(`/campaigns/${id}`, { method: 'PUT', body: data });
    },
    async delete(id) {
        return await ApiClient.request(`/campaigns/${id}`, { method: 'DELETE' });
    }
};
