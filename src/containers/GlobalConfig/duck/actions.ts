import * as types from './types';

export const getSystemConfigRequested = () => ({
  type: types.GET_SYSTEM_CONFIG_REQUESTED,
});

export const getSystemConfigSuccess = (payload: ISystemConfig) => ({
  type: types.GET_SYSTEM_CONFIG_SUCCESS,
  payload,
});

export const getSystemConfigFailed = () => ({
  type: types.GET_SYSTEM_CONFIG_FAILED,
});

export const getConfigCommissionRequested = () => ({
  type: types.GET_CONFIG_COMMISSION_REQUESTED,
});

export const getConfigCommissionFailed = () => ({
  type: types.GET_CONFIG_COMMISSION_FAILED,
});

export const getConfigCommissionSuccess = (payload: IGetConfigCommission) => ({
  type: types.GET_CONFIG_COMMISSION_SUCCESS,
  payload,
});

export const getExchangeRateRequested = () => ({
  type: types.GET_EXCHANGE_RATE_REQUESTED,
});

export const getExchangeRateSuccess = (payload: IExchangeRate) => ({
  type: types.GET_EXCHANGE_RATE_SUCCESS,
  payload,
});

export const getExchangeRateFailed = () => ({
  type: types.GET_EXCHANGE_RATE_FAILED,
});
