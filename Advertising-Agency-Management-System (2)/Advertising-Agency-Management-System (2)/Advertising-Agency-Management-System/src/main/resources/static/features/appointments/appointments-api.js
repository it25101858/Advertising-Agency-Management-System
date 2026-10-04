/* AdFlow - Appointments API Module */
const AppointmentsApi = {
    async getAll()         { return await SharedApiClient.safeGet(ApiConfig.ENDPOINTS.APPOINTMENTS); },
    async create(data)     { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.APPOINTMENTS, { action: 'CREATE', ...data }); },
    async update(data)     { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.APPOINTMENTS, { action: 'UPDATE', ...data }); },
    async delete(id)       { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.APPOINTMENTS, { action: 'DELETE', appointmentId: id }); },
    async message(data)    { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.APPOINTMENTS, { action: 'MESSAGE', ...data }); }
};
window.AppointmentsApi = AppointmentsApi;
