window.FeedbackApi = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await ApiClient.request(`/feedback${query ? '?' + query : ''}`);
    },
    async getById(id) {
        return await ApiClient.request(`/feedback/${id}`);
    },
    async submit(data) {
        return await ApiClient.request('/feedback', { method: 'POST', body: data });
    },
    async update(id, data) {
        return await ApiClient.request(`/feedback/${id}`, { method: 'PUT', body: data });
    },
    async delete(id) {
        return await ApiClient.request(`/feedback/${id}`, { method: 'DELETE' });
    }
};
