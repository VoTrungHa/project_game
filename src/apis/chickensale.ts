import axiosClient from 'helpers/axiosClient';

export const ChickenSaleAPI = {
  ADD_SCHEDULE: async (params: IAddSchedule): Promise<IScheduleItem> => {
    return await axiosClient.post('/chicken-farm/chicken-farm', { ...params });
  },
  GET_LIST_SCHEDULE: async (params: IListScheduleRequest): Promise<IListSchedule> => {
    return await axiosClient.get('/chicken-farm/chicken-farm', {
      params,
    });
  },
  UPDATE_STATUS: async (params: IUpdateStatusSchedule): Promise<{ status: boolean; message: string }> => {
    return await axiosClient.patch(`/chicken-farm/chicken-farm/${params.id}/status`, { status: params.status });
  },
  GET_DETAIL_BY_ID: async (id: string): Promise<IScheduleItem> => {
    return await axiosClient.get(`/chicken-farm/chicken-farm/${id}`);
  },
  DELETE_BY_ID: async (id: string): Promise<{ status: boolean }> => {
    return await axiosClient.delete(`/chicken-farm/chicken-farm/${id}`);
  },
  UPDATE_SCHEDULE: async ({ id, ...payload }: IAddSchedule & { id: string }): Promise<IScheduleItem> => {
    return await axiosClient.patch(`/chicken-farm/chicken-farm/${id}`, payload);
  },
  BONUS_GOLDEN: async (params: BonusGoldenEggRequest): Promise<{ status: boolean }> => {
    return await axiosClient.post('/chicken-farm/chicken-farm/bonus', { ...params });
  },
  CHECK_REMAINING_SLOT: async (id: string): Promise<{ accountId: string; totalRemainingSlots: number }> => {
    return await axiosClient.get(`/chicken-farm/accounts/${id}/remaining-slots`);
  },
};
