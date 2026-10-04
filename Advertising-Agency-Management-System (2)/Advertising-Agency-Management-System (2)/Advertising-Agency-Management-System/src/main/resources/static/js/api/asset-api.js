window.AssetApi = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await ApiClient.request(`/assets${query ? '?' + query : ''}`);
    },
    async getById(id) {
        return await ApiClient.request(`/assets/${id}`);
    },
    async create(data) {
        return await ApiClient.request('/assets', { method: 'POST', body: data });
    },
    async upload(formData) {
        return await ApiClient.request('/assets/upload', { method: 'POST', body: formData });
    },
    async delete(id) {
        return await ApiClient.request(`/assets/${id}`, { method: 'DELETE' });
    }
};
