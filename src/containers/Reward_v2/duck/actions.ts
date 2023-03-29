import * as types from './types';

//Accout
export const getAccountRequested = () => ({
  type: types.GET_LIST_ACCOUNT_REQUESTED,
});

export const getAccountSuccess = (payload: IAccountResponse) => ({
  type: types.GET_LIST_ACCOUNT_SUCCESS,
  payload,
});

export const getAccountFailed = () => ({
  type: types.GET_LIST_ACCOUNT_FAILED,
});

//get envent reward
export const getEventsRewardRequested = () => ({
  type: types.GET_EVENTS_REQUESTED,
});

export const getEventsRewardSuccess = (payload: IEventsRewar) => ({
  type: types.GET_EVENTS_SUCCESS,
  payload,
});

export const getEventsRewardFailed = () => ({
  type: types.GET_EVENTS_FAILED,
});

//get broker
export const getBrokerRequested = () => ({
  type: types.GET_BROKERS,
});

export const getBrokerdSuccess = (payload: IBorker[]) => ({
  type: types.GET_BROKER_SUCCESS,
  payload,
});

export const getBrokerdFailed = () => ({
  type: types.GET_BROKER_FAILED,
});

// get user

//get envent reward
export const getUserByKeyworkRequested = () => ({
  type: types.GET_USERS_BY_KEYWORD,
});

export const getUserByKeyworkSuccess = (payload: IUserGiveEventResponse) => ({
  type: types.GET_USERS_BY_KEYWORD_SUCCESS,
  payload,
});

export const getUserByKeyworkFailed = () => ({
  type: types.GET_USERS_BY_KEYWORD_FAILED,
});

//get envent reward
export const getUserRewardedRequested = () => ({
  type: types.GET_USERS_REWARDED,
});

export const getUserRewardedSuccess = (payload: IParameterRequest) => ({
  type: types.GET_USERS_REWARDED_SUCCESS,
  payload,
});

export const getUserRewardedFailed = () => ({
  type: types.GET_USERS_REWARDED_FAILED,
});
