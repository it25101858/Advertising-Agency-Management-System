window.InvoiceApi = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await ApiClient.request(`/invoices${query ? '?' + query : ''}`);
    },
    async getById(id) {
        return await ApiClient.request(`/invoices/${id}`);
    },
    async create(data) {
        return await ApiClient.request('/invoices', { method: 'POST', body: data });
    },
    async updateStatus(id, status) {
        return await ApiClient.request(`/invoices/${id}/status`, { method: 'PATCH', body: { status } });
    },
    async delete(id) {
        return await ApiClient.request(`/invoices/${id}`, { method: 'DELETE' });
    }
};
