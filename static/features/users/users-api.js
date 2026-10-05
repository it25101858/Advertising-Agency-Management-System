/* AdFlow - Users API */
const UsersApi = {
    async getAll()      { return await SharedApiClient.safeGet(ApiConfig.ENDPOINTS.USERS); },
    async create(data)  { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.USERS, { action: 'SAVE_STAFF', ...data }); },
    async delete(id)    { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.USERS, { action: 'DELETE', userId: id, id }); }
};
window.UsersApi = UsersApi;
