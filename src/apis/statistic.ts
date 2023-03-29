import axiosClient from 'helpers/axiosClient';

export const StatisticAPI = {
  GET_LIST_STATISTIC: async (params: IListReferralCounterRequest): Promise<IListReferralCounterResponse> => {
    const res = await axiosClient.get('/statistics/referral-counter', {
      params,
    });
    return res;
  },
  GET_LIST_STATISTIC_WITH_AMOUNT: async (
    params: Pick<IListReferralCounterRequest, 'page' | 'size'>,
  ): Promise<IListReferralCounterResponse> => {
    const res = await axiosClient.get('/statistics/amount-counter', {
      params,
    });
    return res;
  },
  DOWNLOAD_REFERRAL_CSV: async (params: IListReferralCounterRequest): Promise<string> => {
    return await axiosClient.get('/statistics/referral-counter/export', {
      params,
    });
  },
  BONUS_ACCOUNT: async (params: IBonusPartnerRequest): Promise<{ status: boolean }> => {
    return await axiosClient.post('/bonus/account', { ...params });
  },
  DOWNLOAD_AMOUNT_CSV: async (params): Promise<string> => {
    return await axiosClient.get('/statistics/amount-counter/export', { params });
  },
};
