import axiosClient from 'helpers/axiosClient';

export const ReportAPI = {
  GET_LIST_REFERRAL: async (params: IReferralRequest): Promise<IReferralResponse> => {
    return await axiosClient.get('/statistics/referral/stats', {
      params,
    });
  },
  DOWNLOAD_CSV: async (params): Promise<string> => {
    return await axiosClient.get('/statistics/referral/stats/export', { params });
  },
};
