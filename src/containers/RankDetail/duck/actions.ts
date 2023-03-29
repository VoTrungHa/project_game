import * as types from './types';

export const getRankDetailRequested = () => ({
  type: types.GET_RANK_DETAIL_REQUESTED,
});

export const getRankDetailSuccess = (payload: IRankItem) => ({ type: types.GET_RANK_DETAIL_SUCCESS, payload });

export const getRankDetailFailed = () => ({
  type: types.GET_RANK_DETAIL_FAILED,
});

export const getRankTableRequested = () => ({
  type: types.GET_RANK_TABLE_REQUESTED,
});

export const getRankTableSuccess = (payload: Array<IReferralRankingAccount>) => ({
  type: types.GET_RANK_TABLE_SUCCESS,
  payload,
});

export const getRankTableFailed = () => ({
  type: types.GET_RANK_TABLE_FAILED,
});
