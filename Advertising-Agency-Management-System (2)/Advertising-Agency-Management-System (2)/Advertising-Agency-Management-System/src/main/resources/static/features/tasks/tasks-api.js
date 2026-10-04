/* AdFlow - Tasks API */
const TasksApi = {
    async getAll()     { return await SharedApiClient.safeGet(ApiConfig.ENDPOINTS.TASKS); },
    async create(data) { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.TASKS, { action: 'CREATE', ...data }); },
    async update(data) { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.TASKS, { action: 'UPDATE', ...data }); },
    async delete(id)   { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.TASKS, { action: 'DELETE', taskId: id }); },
    async move(id, status) { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.TASKS, { action: 'UPDATE', taskId: id, status }); }
};
window.TasksApi = TasksApi;
