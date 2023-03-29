import * as types from './types';

export const getListGameRequested = () => ({
  type: types.GET_LIST_GAME_REQUESTED,
});

export const getListGameSuccess = (payload: IGameListResponse) => ({
  type: types.GET_LIST_GAME_SUCCESS,
  payload,
});

export const getListGameFailed = () => ({
  type: types.GET_LIST_GAME_FAILED,
});
