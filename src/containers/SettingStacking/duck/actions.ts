import * as types from './types';

export const getInterestRateConfigRequested = () => ({
  type: types.GET_INTEREST_RATE_REQUESTED,
});

export const getInterestRateConfigSuccess = (payload: IInterestRateConfig) => ({
  type: types.GET_INTEREST_RATE_SUCCESS,
  payload,
});

export const getInterestRateConfigFailed = () => ({
  type: types.GET_INTEREST_RATE_FAILED,
});
