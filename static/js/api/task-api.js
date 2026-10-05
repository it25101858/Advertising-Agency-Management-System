window.TaskApi = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await ApiClient.request(`/tasks${query ? '?' + query : ''}`);
    },
    async getById(id) {
        return await ApiClient.request(`/tasks/${id}`);
    },
    async create(data) {
        return await ApiClient.request('/tasks', { method: 'POST', body: data });
    },
    async update(id, data) {
        return await ApiClient.request(`/tasks/${id}`, { method: 'PUT', body: data });
    },
    async updateStatus(id, status) {
        return await ApiClient.request(`/tasks/${id}/status`, { method: 'PATCH', body: { status } });
    },
    async delete(id) {
        return await ApiClient.request(`/tasks/${id}`, { method: 'DELETE' });
    }
};
