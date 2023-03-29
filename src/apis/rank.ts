import axiosClient from 'helpers/axiosClient';

export const RankAPI = {
  GET_LIST_RANK: (params: { page: number; size: number }): Promise<IRankResponse> => {
    return axiosClient.get('/referral-ranking', { params });
  },
  GET_DETAIL_BY_ID: async (id: string): Promise<IRankItem> => {
    return await axiosClient.get(`/referral-ranking/${id}`);
  },
  ADD_RANK: async (params: IAddRank): Promise<IRankItem> => {
    return await axiosClient.post('/referral-ranking', { ...params });
  },
  UPDATE_RANK: async (id: string, params): Promise<IRankItem> => {
    return await axiosClient.patch(`/referral-ranking/${id}`, { ...params });
  },
  GET_ACCOUNTs: async (id: string): Promise<Array<IReferralRankingAccount>> => {
    return await axiosClient.get(`/referral-ranking/${id}/accounts`);
  },
  POST_AWARD: async (id: string): Promise<{ status: boolean }> => {
    return await axiosClient.post(`/referral-ranking/${id}/award`);
  },
};
