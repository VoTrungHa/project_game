import * as types from './types';

export const getBrokerDetailRequested = () => ({
  type: types.GET_BROKER_DETAIL_REQUESTED,
});

export const getBrokerDetailSuccess = (payload: IBrokerItem) => ({
  type: types.GET_BROKER_DETAIL_SUCCESS,
  payload,
});

export const getBrokerDetailFailed = () => ({
  type: types.GET_BROKER_DETAIL_FAILED,
});

export const getBrokerTransactionRequested = () => ({
  type: types.GET_BROKER_TRANSACTION_REQUESTED,
});

export const getBrokerTransactionSuccess = (payload: IBrokerTransactionResponse) => ({
  type: types.GET_BROKER_TRANSACTION_SUCCESS,
  payload,
});

export const getBrokerTransactionFailed = () => ({
  type: types.GET_BROKER_TRANSACTION_FAILED,
});

export const getBrokerTransactionStatRequested = () => ({
  type: types.GET_BROKER_TRANSACTION_STAT_REQUESTED,
});

export const getBrokerTransactionStatSuccess = (payload: IBrokerDetailTransactionStat) => ({
  type: types.GET_BROKER_TRANSACTION_STAT_SUCCESS,
  payload,
});

export const getBrokerTransactionStatFailed = () => ({
  type: types.GET_BROKER_TRANSACTION_STAT_FAILED,
});
