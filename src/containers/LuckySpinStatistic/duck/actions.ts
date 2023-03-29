import * as types from './types';

export const getListStatisticRequested = () => ({
  type: types.GET_LIST_STATISTIC_REQUESTED,
});

export const getListStatisticSuccess = (payload: ILuckyWheelStatisticResponse) => ({
  type: types.GET_LIST_STATISTIC_SUCCESS,
  payload,
});

export const getListStatisticFailed = () => ({
  type: types.GET_LIST_STATISTIC_FAILED,
});
