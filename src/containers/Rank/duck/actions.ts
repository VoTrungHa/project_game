import * as types from './types';

export const getListRankRequested = () => ({
  type: types.GET_LIST_RANK_REQUESTED,
});

export const getListRankSuccess = ({ data, totalRecords, page }) => ({
  type: types.GET_LIST_RANK_SUCCESS,
  payload: { data, totalRecords, page },
});

export const getListRankFailed = () => ({
  type: types.GET_LIST_RANK_FAILED,
});
