/* AdFlow - Assets API */
const AssetsApi = {
    async getAll()      { return await SharedApiClient.safeGet(ApiConfig.ENDPOINTS.ASSETS); },
    async upload(form)  { return await SharedApiClient.upload(ApiConfig.ENDPOINTS.ASSETS, form); },
    async delete(id)    { return await SharedApiClient.safePost(ApiConfig.ENDPOINTS.ASSETS, { action: 'DELETE', assetId: id }); }
};
window.AssetsApi = AssetsApi;
