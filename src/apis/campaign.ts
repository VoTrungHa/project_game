import axiosClient from 'helpers/axiosClient';

export const CampaignAPI = {
  GET_CATEGORY_MASTER: async (): Promise<ICategoryMasterResponse> => {
    return await axiosClient.get('/campaign/category-master');
  },
  GET_LIST_CAMPAIGN: async (params: IListCampaignRequest): Promise<IListCampaignResponse> => {
    return await axiosClient.get('/campaign', {
      params,
    });
  },
  GET_CAMPAIGN_DETAIL_BY_ID: async (id: string): Promise<ICampaignDetail> => {
    return await axiosClient.get(`/campaign/${id}`);
  },
  ADD_CAMPAIGN: async (params: IAddCampaignRequest): Promise<IAddCampaignResponse> => {
    return await axiosClient.post('/campaign', { ...params });
  },
  UPDATE_CAMPAIGN: async ({ id, ...payload }: IUpdateCampaignRequest): Promise<IUpdateCampaignResponse> => {
    return await axiosClient.patch(`/campaign/${id}`, payload);
  },
  ADD_CAMPAIGN_CATEGORY: async (params: IAddCampaignCategoryRequest): Promise<IAddCampaignCategoryResponse> => {
    return await axiosClient.post('/campaign/category', { ...params });
  },
  UPDATE_CAMPAIGN_CATEGORY: async ({
    id,
    ...payload
  }: IUpdateCampaignCategoryRequest): Promise<IAddCampaignCategoryResponse> => {
    return await axiosClient.patch(`/campaign/category/${id}`, payload);
  },
  DELETE_CAMPAIGN_BY_ID: async (id: string): Promise<IDeleteUserResonse> => {
    return await axiosClient.delete(`/campaign/${id}`);
  },
};
