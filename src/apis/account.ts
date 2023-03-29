import axiosClient from 'helpers/axiosClient';

export const AcccountAPI = {
  GET_LIST_ACCOUNT: async (params: IAccountRequest): Promise<IAccountResponse> => {
    return await axiosClient.get('/account', {
      params,
    });
  },

  GET_ACCOUNT_STAT: async (params: IAccountRequest): Promise<IAccountStat> => {
    return await axiosClient.get('/statistics/account/stats', {
      params,
    });
  },
};
