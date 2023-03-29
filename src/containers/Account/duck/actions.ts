import * as types from './types';

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

export const getAccountStatRequested = () => ({
  type: types.GET_STAT_REQUESTED,
});

export const getAccountStatSuccess = (payload: IAccountStat) => ({
  type: types.GET_STAT_SUCCESS,
  payload,
});

export const getAccountStatFailed = () => ({
  type: types.GET_STAT_FAILED,
});
