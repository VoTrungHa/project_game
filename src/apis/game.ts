import axiosClient from 'helpers/axiosClient';

export const GameAPI = {
  ADD_GAME: async (params: IAddGameItem): Promise<{ id: string }> => {
    return await axiosClient.post('/bit-play/add-game', { ...params });
  },
  GET_LIST_GAME: async (params: { page: number; size: number }): Promise<IGameListResponse> => {
    return await axiosClient.get('/bit-play/get-games', {
      params,
    });
  },
  EDIT_GAME: async ({ id, ...payload }: IEditGameItem): Promise<{ updatedAt: string }> => {
    return await axiosClient.patch(`/bit-play/edit-game/${id}`, payload);
  },
  ADD_CHALLENGE: async (params: IAddChallengeItem): Promise<{ id: string }> => {
    return await axiosClient.post('/bit-play/add-challenge', { ...params });
  },
  GET_LIST_CHALLENGE: async (params: {
    page: number;
    size: number;
    keyword: string;
  }): Promise<IChallengeListResponse> => {
    return await axiosClient.get('/bit-play/get-challenges', {
      params,
    });
  },
  EDIT_CHALLENGE: async ({ id, ...payload }: IEditChallengeItem): Promise<{ id: string }> => {
    return await axiosClient.patch(`/bit-play/edit-challenge/${id}`, payload);
  },
};
