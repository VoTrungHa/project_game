import axiosClient from 'helpers/axiosClient';

export const PartnerAPI = {
  GET_LIST_PARTNER: async (params: IMobileUserAccountRequest): Promise<IMobileUserAccountResponse> => {
    return await axiosClient.get('/account', {
      params,
    });
  },
  UPDATE_STATUS: async ({ id, ...payload }: IMobileUserAccountUpdateStatusRequest): Promise<{ status: boolean }> => {
    return await axiosClient.patch(`/account/${id}`, payload);
  },
  GET_DETAIL_PARTNER: async (id: string): Promise<IMobileUserDetailResponse> => {
    return await axiosClient.get(`/account/${id}`);
  },
  GET_COMMISSION_PARTNER: async ({
    id,
    ...params
  }: IGetCommissionPartnerRequest): Promise<IGetCommissionPartnerResponse> => {
    return await axiosClient.get(`/account/${id}/commission`, {
      params,
    });
  },
  APPROVE_COMMISSION: async (params: {
    accountId: string;
    idCommission: Array<string>;
  }): Promise<IGetCommissionPartnerResponse> => {
    return await axiosClient.post(`/account/${params.accountId}/commission`, { commissions: params.idCommission });
  },
};
