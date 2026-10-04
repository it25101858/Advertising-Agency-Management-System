/* AdFlow - Invoices API */
const InvoicesApi = {
    async getAll()      { return await SharedApiClient.safeGet(ApiConfig.ENDPOINTS.INVOICES); },
    async create(data)  { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.INVOICES, { action: 'CREATE', ...data }); },
    async update(data)  { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.INVOICES, { action: 'UPDATE', ...data }); },
    async delete(id)    { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.INVOICES, { action: 'DELETE', invoiceId: id }); },
    async markPaid(id)  { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.INVOICES, { action: 'MARK_PAID', invoiceId: id }); }
};
window.InvoicesApi = InvoicesApi;
