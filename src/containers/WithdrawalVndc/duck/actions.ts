import * as types from './types';

export const getListWithdrawalVndcRequested = () => ({
  type: types.GET_LIST_WITHDRAWAL_VNDC_REQUESTED,
});

export const getListWithdrawalVndcSuccess = (payload: IWithdrawalVndcReponse) => ({
  type: types.GET_LIST_WITHDRAWAL_VNDC_SUCCESS,
  payload,
});

export const getListWithdrawalVndcFailed = () => ({
  type: types.GET_LIST_WITHDRAWAL_VNDC_FAILED,
});

export const getStatWithdrawalVndcRequested = () => ({
  type: types.GET_STAT_WITHDRAWAL_VNDC_REQUESTED,
});

export const getStatWithdrawalVndcSuccess = (payload: IWithdrawalVndcStats) => ({
  type: types.GET_STAT_WITHDRAWAL_VNDC_SUCCESS,
  payload,
});

export const getStatWithdrawalVndcFailed = () => ({
  type: types.GET_STAT_WITHDRAWAL_VNDC_FAILED,
});
