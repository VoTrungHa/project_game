import * as types from './types';

export const getListTransactionP2PRequested = () => ({
  type: types.GET_LIST_TRANSACTION_P2P_REQUESTED,
});

export const getListTransactionP2PSuccess = (payload: ITransactionP2PResponse) => ({
  type: types.GET_LIST_TRANSACTION_P2P_SUCCESS,
  payload,
});

export const getListTransactionP2PFailed = () => ({
  type: types.GET_LIST_TRANSACTION_P2P_FAILED,
});

export const getStatTransactionP2PRequested = () => ({
  type: types.GET_STAT_TRANSACTION_P2P_REQUESTED,
});

export const getStatTransactionP2PSuccess = (payload: ITransactionP2PStatResponse) => ({
  type: types.GET_STAT_TRANSACTION_P2P_SUCCESS,
  payload,
});

export const getStatTransactionP2PFailed = () => ({
  type: types.GET_STAT_TRANSACTION_P2P_FAILED,
});
