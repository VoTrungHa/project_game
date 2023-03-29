import axiosClient from 'helpers/axiosClient';

export const StatisticStackingAPI = {
  GET_LIST_STATISTIC_STACKING: async (params: IStatisticStackingRequest): Promise<IStatisticStackingResponse> => {
    return await axiosClient.get('/interest-payment', {
      params,
    });
  },

  GET_STATISTIC_STACKING_STAT: async (params: IStatisticStackingRequest): Promise<IStatisticStackingStat> => {
    return await axiosClient.get('/interest-payment/stats', {
      params,
    });
  },

  GET_DETAIL_BY_ID: async (id: string): Promise<IStatisticStackingItem> => {
    return await axiosClient.get(`/interest-payment/${id}`);
  },

  GET_ACCOUNTs: async (id: string, params: { page?: number; size?: number }): Promise<Array<IStackingItemTable>> => {
    return await axiosClient.get(`/interest-payment/${id}/accounts`, { params });
  },
};
