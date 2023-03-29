import axiosClient from 'helpers/axiosClient';

export const SatoshiGameAPI = {
  GET_ALL_EVENT: async (): Promise<ISatoshiGameResponse> => {
    return await axiosClient.get('/config/event');
  },
  ADD_EVENT: async (params: ISatoshiGameAddItemRequest): Promise<ISatoshiGameAddItemResponse> => {
    return await axiosClient.post('/config/event', { ...params });
  },
  GET_DETAIL_BY_ID: async (id: string): Promise<ISatoshiGameItem> => {
    return await axiosClient.get(`/config/event/${id}`);
  },
  DELETE_BY_ID: async (id: string): Promise<{ status: boolean }> => {
    return await axiosClient.delete(`/config/event/${id}`);
  },
  UPDATE_EVENT: async ({ id, ...payload }: ISatoshiGameAddItemRequest & { id: string }): Promise<ISatoshiGameItem> => {
    return await axiosClient.patch(`/config/event/${id}`, payload);
  },
  UPDATE_EVENT_STATUS: async (payload: ISatoshiGameUpdateStatusRequest): Promise<{ status: boolean }> => {
    return await axiosClient.patch(`/config/event/${payload.id}/status`, { status: payload.status });
  },
  GET_LIST_SATOSHI_GAME: async (params: IStatisticSatoshiGameRequest): Promise<IStatisticSatoshiGameReponse> => {
    return await axiosClient.get('/statistics/satoshi-game', { params });
  },
};
