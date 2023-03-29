import axiosClient from 'helpers/axiosClient';

export const MobileUserDetailAPI = {
  GET_CASHBACK_TRANSACTION_BY_ID: async ({
    id,
    ...params
  }: ICashbackTransactionRequest): Promise<ICashbackTransactionResponse> => {
    return await axiosClient.get(`/account/${id}/cashback-transaction`, { params });
  },
  GET_NOTIFICATION_BY_ID: async ({ id, ...params }: ICashbackTransactionRequest): Promise<INotificationResponse> => {
    return await axiosClient.get(`/account/${id}/notification`, { params });
  },
  GET_KYC_BY_ID: async (id: number): Promise<IKycResponse> => {
    return await axiosClient.get(`/account/${id}/kyc`);
  },
  GET_ACCOUNTS_REFERRED_BY_ID: async ({
    id,
    ...params
  }: IAccountReferralRequest): Promise<IAccountReferredByAccount> => {
    return await axiosClient.get(`/account/${id}/referral`, { params });
  },
  RESET_PASSCODE: async ({ id, passcode }: IResetPasscodeRequest): Promise<IResetPasscodeResponse> => {
    return await axiosClient.post(`/account/${id}/reset-passcode`, { passcode });
  },
  GET_CASHBACK_WALLET: async ({ id, ...params }: ICashbackTransactionRequest): Promise<ICashbackWalletResponse> => {
    return await axiosClient.get(`/account/${id}/cashback-wallet`, { params });
  },
  GET_DAILY_LUCKY_SPIN_BY_ID: async (params: ILuckySpinRequest): Promise<IDailySpinInformationResponse> => {
    return await axiosClient.get(`/reward/daily-lucky-wheel`, { params });
  },
  UPGRADE_PARTNER: async (id: string): Promise<{ status: boolean }> => {
    return await axiosClient.patch(`/account/${id}/upgrade-partner`);
  },
  APPROVE_KYC: async (id: string): Promise<{ status: boolean }> => {
    return await axiosClient.patch(`/account/${id}/kyc`);
  },
  GET_WALLET_INFO: async ({ id, ...params }: { id: string; currency: string }): Promise<IWalletInfoResponse> => {
    return await axiosClient.get(`/account/${id}/wallet-info`, { params });
  },
};
