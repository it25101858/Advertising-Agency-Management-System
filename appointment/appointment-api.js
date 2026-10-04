window.AppointmentApi = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await ApiClient.request(`/appointments${query ? '?' + query : ''}`);
    },
    async getById(id) {
        return await ApiClient.request(`/appointments/${id}`);
    },
    async create(data) {
        return await ApiClient.request('/appointments', { method: 'POST', body: data });
    },
    async update(id, data) {
        return await ApiClient.request(`/appointments/${id}`, { method: 'PUT', body: data });
    },
    async delete(id) {
        return await ApiClient.request(`/appointments/${id}`, { method: 'DELETE' });
    }
};
