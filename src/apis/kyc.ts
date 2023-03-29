import axiosClient from 'helpers/axiosClient';

export const KycAPI = {
  GET_LIST_KYC: async (params: IListKycRequest): Promise<IListKycResponse> => {
    const res: IListKycResponse = await axiosClient.get('/kyc', {
      params,
    });
    return res;
  },
  UPDATE_KYC: async ({ id, ...payload }: IUpdateKYCRequest): Promise<IUpdateKYCResponse> => {
    return await axiosClient.patch(`/kyc/${id}`, payload);
  },
  GET_KYC_DETAIL_BY_ID: async (id: number): Promise<IKycDetailResponse> => {
    return await axiosClient.get(`/kyc/${id}`);
  },
};
