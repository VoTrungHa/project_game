import axiosClient from 'helpers/axiosClient';

export const DashboardAPI = {
  GET_DASHBOARD_ACCOUNT_TOTAL: async (): Promise<ITotalAccounts> => {
    return await axiosClient.get('/dashboard/account/total');
  },
  GET_DASHBOARD_ACCOUNT: async (params: IDashboardAccountRequest): Promise<IAccountDashboardChart> => {
    return await axiosClient.get(`/dashboard/account`, { params });
  },
  GET_CASHBACK_TOTAL: async (): Promise<ITotalCashback> => {
    return await axiosClient.get('/dashboard/cashback/total');
  },
  GET_CASHBACK: async (params: ICashbackDashboardParam): Promise<ICashbackDashboardResponse> => {
    return await axiosClient.get('/dashboard/cashback', {
      params,
    });
  },
  GET_ACCOUNT: async (isApproved: boolean): Promise<{ totalAccounts: number }> => {
    return await axiosClient.get(`/dashboard/total-account?isApproved=${isApproved}`);
  },
  GET_TOTAL_REFERRAL_AMOUNT: async (isApproved: boolean): Promise<{ totalAmounts: number }> => {
    return await axiosClient.get(`/dashboard/total-referral-amount?isApproved=${isApproved}`);
  },
  GET_TOTAL_ACCOUNT_VNDC: async (timeUnit: number): Promise<{ totalAccounts: number }> => {
    return await axiosClient.get(`/dashboard/total-account-vndc?timeUnit=${timeUnit}`);
  },
  GET_ACCOUNT_HAVE_PHONE: async (): Promise<{ totalAccounts: number }> => {
    return await axiosClient.get('/dashboard/total-account-have-phone');
  },
  GET_CASHBACK_SUMMARY: async (): Promise<ICashbackSummary> => {
    return await axiosClient.get('/dashboard/cashback-summary');
  },
  GET_BUY_SATOSHI_TOTAL: async (timeUnit: number): Promise<{ totalAmount: number }> => {
    return await axiosClient.get(`/dashboard/buy-satoshi/total?timeUnit=${timeUnit}`);
  },
  GET_BUY_SATOSHI: async (params: IBuyAndWithdrawRequest): Promise<IBuySatoshi> => {
    return await axiosClient.get(`/dashboard/buy-satoshi`, { params });
  },
  GET_CASHBACK_AVAILABLE_PERIOD: async (params: ICashbackAvailablePeriodRequest): Promise<ICashbackAvailablePeriod> => {
    return await axiosClient.get(`/dashboard/cashback-available/period`, { params });
  },
};
