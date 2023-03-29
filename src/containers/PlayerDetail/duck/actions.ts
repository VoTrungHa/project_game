import * as types from './types';

export const getBrokerTransactionRequested = () => ({
  type: types.GET_BROKER_TRANSACTION_REQUESTED,
});

export const getBrokerTransactionFailed = () => ({
  type: types.GET_BROKER_TRANSACTION_FAILED,
});

export const getBrokerTransactionSuccess = (payload: IGetBrokerTransaction) => ({
  type: types.GET_BROKER_TRANSACTION_SUCCESS,
  payload,
});

export const getListEggRequested = () => ({
  type: types.GET_LIST_EGG_REQUESTED,
});

export const getListEggFailed = () => ({
  type: types.GET_LIST_EGG_FAILED,
});

export const getListEggSuccess = (payload: IListEggByAccountResponse) => ({
  type: types.GET_LIST_EGG_SUCCESS,
  payload,
});

export const getListChickenRequested = () => ({
  type: types.GET_LIST_CHICKEN_REQUESTED,
});

export const getListChickenFailed = () => ({
  type: types.GET_LIST_CHICKEN_FAILED,
});

export const getListChickenSuccess = (payload: IListChickenByAccountResponse) => ({
  type: types.GET_LIST_CHICKEN_SUCCESS,
  payload,
});

export const getAccountTransactionRequested = () => ({
  type: types.GET_ACCOUNT_TRANSACTION_REQUESTED,
});

export const getAccountTransactionFailed = () => ({
  type: types.GET_ACCOUNT_TRANSACTION_FAILED,
});

export const getAccountTransactionSuccess = (payload: IAccountTransactionResponse) => ({
  type: types.GET_ACCOUNT_TRANSACTION_SUCCESS,
  payload,
});
