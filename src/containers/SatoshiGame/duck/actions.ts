import * as types from './types';

export const getEventRequested = () => ({
  type: types.GET_EVENT_REQUESTED,
});

export const getEventSuccess = (payload: ISatoshiGameResponse) => ({
  type: types.GET_EVENT_SUCCESS,
  payload,
});

export const getEventFailed = () => ({
  type: types.GET_EVENT_FAILED,
});

export const getStatisticGameRequested = () => ({
  type: types.GET_LIST_STATISTIC_GAME_REQUESTED,
});

export const getStatisticGameSuccess = (payload: IStatisticSatoshiGameRequest) => ({
  type: types.GET_LIST_STATISTIC_GAME_SUCCESS,
  payload,
});

export const getStatisticGameFailed = () => ({
  type: types.GET_LIST_STATISTIC_GAME_FAILED,
});