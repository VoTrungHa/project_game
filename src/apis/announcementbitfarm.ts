import axiosClient from 'helpers/axiosClient';

export const AnnouncementBitfarmAPI = {
  GET_LIST: async (params: IAnnouncementBitfarmRequest): Promise<IAnnouncementBitfarmResponse> => {
    return await axiosClient.get('/chicken-farm-event', {
      params,
    });
  },
  ADD_ANNOUNCEMENT: async (params: IAnnouncementBitfarmPost): Promise<IAnnouncementBitfarmItem> => {
    return await axiosClient.post('/chicken-farm-event', { ...params });
  },
  DELETE_ANNOUNCEMENT: async (id: string): Promise<{ status: boolean }> => {
    return await axiosClient.delete(`/chicken-farm-event/${id}`);
  },
  UPDATE_ANNOUNCEMENT: async ({
    id,
    ...payload
  }: Partial<IAnnouncementBitfarmPost> & { id: string }): Promise<{ status: boolean }> => {
    return await axiosClient.patch(`/chicken-farm-event/${id}`, payload);
  },
};
