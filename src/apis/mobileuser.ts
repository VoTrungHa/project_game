import axiosClient from 'helpers/axiosClient';

export const MobileUserAPI = {
  GET_ACCOUNT_REFERRAL: async ({
    id,
    type,
  }: IMobileUserAccountReferralRequest): Promise<IMobileUserAccountReferralResponse> => {
    return await axiosClient.get(`/account/${id}/referral`, {
      params: {
        type,
      },
    });
  },
  GET_LIST_MOBILE_USER: async (params: IMobileUserAccountRequest): Promise<IMobileUserAccountResponse> => {
    return await axiosClient.get('/account', {
      params,
    });
  },
  UPDATE_STATUS: async ({ id, ...payload }: IMobileUserAccountUpdateStatusRequest): Promise<{ status: boolean }> => {
    return await axiosClient.patch(`/account/${id}`, payload);
  },
  GET_DETAIL_MOBILE_USER: async (id: string): Promise<IMobileUserDetailResponse> => {
    return await axiosClient.get(`/account/${id}`);
  },
  ADD_MOBILE_USER: async (params: ICreateMobileUserRequest): Promise<ICreateMobileUserResponse> => {
    return await axiosClient.post('/account', { ...params });
  },
};
