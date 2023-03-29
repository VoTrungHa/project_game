import * as types from './types';

export const getListDepositSatoshiRequested = () => ({
  type: types.GET_LIST_DEPOSIT_SATOSHI_REQUESTED,
});

export const getListDepositSatoshiSuccess = (payload) => ({
  type: types.GET_LIST_DEPOSIT_SATOSHI_SUCCESS,
  payload,
});

export const getListDepositSatoshiFailed = () => ({
  type: types.GET_LIST_DEPOSIT_SATOSHI_FAILED,
});

export const getStatDepositSatoshiRequested = () => ({
  type: types.GET_STAT_DEPOSIT_SATOSHI_REQUESTED,
});

export const getStatDepositSatoshiSuccess = (payload: IDepositSatoshiDetailStats) => ({
  type: types.GET_STAT_DEPOSIT_SATOSHI_SUCCESS,
  payload,
});

export const getStatDepositSatoshiFailed = () => ({
  type: types.GET_STAT_DEPOSIT_SATOSHI_FAILED,
});
