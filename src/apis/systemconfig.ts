import axiosClient from 'helpers/axiosClient';

export const SystemConfigAPI = {
  GET_SYSTEM_CONFIG: async (): Promise<ISystemConfig> => {
    return await axiosClient.get('/config');
  },
  DELETE_CONFIG_BY_ID: async (id: number): Promise<{ status: boolean }> => {
    return await axiosClient.delete(`/config/${id}`);
  },
  EDIT_CONFIG: async ({ id, ...payload }: IEditSystemConfigRequest): Promise<IEditSystemConfigResponse> => {
    return await axiosClient.patch(`/config/${id}`, payload);
  },
  ADD_CONFIG: async (params: ICreateSystemConfigRequest): Promise<ICreateSystemConfigResponse> => {
    return await axiosClient.post('/config', { ...params });
  },
  EDIT_COMMISSION: async ({ id, ...payload }: IEditConfigCommissionRequest): Promise<IEditConfigCommissionResponse> => {
    return await axiosClient.patch(`/config/commission/${id}`, payload);
  },
  GET_CONFIG_COMMISSION: async (): Promise<IGetConfigCommission> => {
    return await axiosClient.get('/config/commission');
  },
  GET_EXCHANGE_RATE: async (): Promise<IExchangeRate> => {
    return await axiosClient.get('/currency/exchange-rate');
  },
  GET_BANNER_CONFIG: async (): Promise<IGetBannerConfigResponse> => {
    return await axiosClient.get('/config/homepage/banners');
  },
  ADD_BANNER_CONFIG: async (params: BannerConfig): Promise<BannerConfigItem> => {
    return axiosClient.post('/config/homepage/banners', { ...params });
  },
  EDIT_BANNER_CONFIG: async ({ id, ...payload }: IEditBannerConfigRequest): Promise<BannerConfigItem> => {
    return await axiosClient.patch(`/config/homepage/banners/${id}`, payload);
  },
  DELETE_BANNER_CONFIG: async (id: string): Promise<{ status: boolean }> => {
    return await axiosClient.delete(`/config/homepage/banners/${id}`);
  },
  GET_DAILY_SPIN: async (): Promise<ISpinDailyResponse> => {
    return await axiosClient.get('/config/daily-lucky-wheel');
  },
  UPDATE_DAILY_SPIN: async (payload: ISpinDailyUpdate): Promise<ISpinDailyResponse> => {
    return await axiosClient.patch('/config/daily-lucky-wheel', payload);
  },
  GET_HOMEPAGE_BANNER_CONFIG: async (): Promise<IGetHomePageConfig> => {
    return await axiosClient.get('/config/ads');
  },
  ADD_HOMEPAGE_BANNER_CONFIG: async (params: IHomepageBannerItemEdit): Promise<{ id: string }> => {
    return await axiosClient.post('/config/ads', { ...params });
  },
  DELETE_HOMEPAGE_BANNER_CONFIG: async (id: string): Promise<{ id: string }> => {
    return await axiosClient.delete(`/config/ads/${id}`);
  },
  GET_HOMEPAGE_BANNER_BY_ID: async (id: string): Promise<IHomepageBannerItem> => {
    return await axiosClient.get(`/config/ads/${id}`);
  },
  UPDATE_HOMEPAGE_BANNER_BY_ID: async ({
    id,
    ...payload
  }: IHomepageBannerItemEdit & { id: string }): Promise<{ updatedAt: string }> => {
    return await axiosClient.patch(`/config/ads/${id}`, payload);
  },
  SEND_NOTIFICATION: async (params: ISendNotification): Promise<{ totalAccounts: number }> => {
    const { isPartner, isWithdrawal, kycStatus, ...payload } = params;
    return axiosClient.post(
      '/account/send-notification',
      { ...payload },
      { params: { isPartner, isWithdrawal, kycStatus } },
    );
  },
  GET_STACKING: async (): Promise<IInterestRateConfig> => {
    return await axiosClient.get(`/config/interest-rate`);
  },
  UPDATE_STACKING: async (payload: IInterestRateConfigUpdate): Promise<IInterestRateConfig> => {
    return await axiosClient.patch('/config/interest-rate', payload);
  },
};
