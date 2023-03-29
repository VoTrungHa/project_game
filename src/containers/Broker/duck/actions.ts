import * as types from './types';

export const getListBrokerRequested = () => ({
  type: types.GET_LIST_BROKER_REQUESTED,
});

export const getListBrokerSuccess = (payload: IBrokerListResponse) => ({
  type: types.GET_LIST_BROKER_SUCCESS,
  payload,
});

export const getListBrokerFailed = () => ({
  type: types.GET_LIST_BROKER_FAILED,
});

export const getListCurrencyRequested = () => ({
  type: types.GET_LIST_CURRENCY_REQUESTED,
});

export const getListCurrencySuccess = (payload: ICurrencyList) => ({
  type: types.GET_LIST_CURRENCY_SUCCESS,
  payload,
});

export const getListCurrencyFailed = () => ({
  type: types.GET_LIST_CURRENCY_FAILED,
});
