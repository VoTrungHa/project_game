import axiosClient from 'helpers/axiosClient';

export const rewardApi = {
  GET_LIST_ACCOUNT: async (params: IParameterRequest): Promise<IAccountResponse> => {
    return await axiosClient.get('/account', {
      params,
    });
  },

  CREATE_EVENT_REWARD: async (params: IEventReward): Promise<IEventRewardResponseError> => {
    return await axiosClient.post('/bonus/new-bonus-event', { ...params });
  },

  GET_EVENTS_REWARD: async (params: IEventRewardRequest): Promise<IEventsRewar> => {
    return await axiosClient.get('/bonus/bonus-events', {
      params,
    });
  },

  IMPORT_EVENTS_REWARD: async (params: IUserGiveEvent): Promise<any> => {
    console.log(params);
    return await axiosClient.post('/bonus/bonus-account', {
      ...params,
    });
  },

  GET_USER_BY_KEYWORD: async (params: any): Promise<IUserGiveEventResponse> => {
    return await axiosClient.get('/bonus/accounts', {
      params,
    });
  },

  GET_BROKERS: async (): Promise<IBorker[]> => {
    return await axiosClient.get('/bonus/brokers');
  },

  // reward to the user.
  REWARD_TO_USER: async (params: IReward): Promise<any> => {
    return await axiosClient.post('/bonus/bonus-account', {
      ...params,
    });
  },

  // get user rewareded
  GET_USER_REWAREDED: async (params: IParameterRequest, id: string): Promise<any> => {
    return await axiosClient.get(`/bonus/bonus-event/${id}/accounts`, { params });
  },
};
