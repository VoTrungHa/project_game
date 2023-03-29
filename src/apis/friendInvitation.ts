import axiosClient from 'helpers/axiosClient';

export const FriendInvitationEventAPI = {
  GET_LIST_EVENT: async (params: IEventListRequest): Promise<IEventListResponse> => {
    return await axiosClient.get('/event', {
      params,
    });
  },
  ADD_EVENT: async (params: IAddEventRequest): Promise<IEventItem> => {
    return await axiosClient.post('/event', { ...params });
  },
  EDIT_EVENT: async ({ id, ...payload }: IEventItem): Promise<IEventItem> => {
    return await axiosClient.patch(`/event/${id}`, payload);
  },
  GET_RANKING_BY_ID: async ({ id, ...params }: IEventRankingListRequest): Promise<IEventRankingListResponse> => {
    return await axiosClient.get(`/event/${id}/ranking`, { params });
  },
  GET_EVENT_BY_ID: async (id: string): Promise<IEventItem> => {
    return await axiosClient.get(`/event/${id}`);
  },
};
