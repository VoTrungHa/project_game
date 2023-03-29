import axiosClient from 'helpers/axiosClient';

export const LuckySpinAPI = {
  GET_LUCKY_SPIN: (params: ILuckySpinRequest): Promise<ILuckySpinResponse> => {
    return axiosClient.get('/reward/daily-lucky-wheel', { params });
  },
  APPROVE_LUCKY_SPIN_BY_ID: async ({ id, ...payload }: ILuckySpinApproveRequest): Promise<{ status: boolean }> => {
    return await axiosClient.patch(`/reward/daily-lucky-wheel/${id}`, payload);
  },
  GET_STATISTIC_LUCKY_SPIN: (params: ILuckyWheelStatisticRequest): Promise<ILuckyWheelStatisticResponse> => {
    return axiosClient.get('/statistics/lucky-wheel', { params });
  },
  DOWNLOAD_CSV: async (params: ILuckyWheelStatisticRequest): Promise<string> => {
    return await axiosClient.get('/statistics/lucky-wheel/export', { params });
  },
  GET_STATISTIC_LUCKY_SPIN_BY_DATE: (
    params: ILuckyWheelStatisticByDateRequest,
  ): Promise<ILuckyWheelStatisticByDateResponse> => {
    return axiosClient.get('/statistics/lucky-wheel-by-date', { params });
  },
  DOWNLOAD_LUCKY_SPIN_BY_DATE_CSV: async (params: ILuckyWheelStatisticByDateRequest): Promise<string> => {
    return await axiosClient.get('/statistics/lucky-wheel-by-date/export', { params });
  },
};
