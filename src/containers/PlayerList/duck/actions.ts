import * as types from './types';

export const getListPlayerRequested = () => ({
  type: types.GET_LIST_PLAYER_REQUESTED,
});

export const getListPlayerSuccess = (payload: IPlayerListResponse) => ({
  type: types.GET_LIST_PLAYER_SUCCESS,
  payload,
});

export const getListPlayerFailed = () => ({
  type: types.GET_LIST_PLAYER_FAILED,
});

export const getListPlayerStatRequested = () => ({
  type: types.GET_LIST_PLAYER_STAT_REQUESTED,
});

export const getListPlayerStatSuccess = (payload: IPlayerListStat) => ({
  type: types.GET_LIST_PLAYER_STAT_SUCCESS,
  payload,
});

export const getListPlayerStatFailed = () => ({
  type: types.GET_LIST_PLAYER_STAT_FAILED,
});
