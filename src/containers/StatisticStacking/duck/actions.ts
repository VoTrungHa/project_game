import * as types from './types';

export const getStatisticStackingRequested = () => ({
  type: types.GET_LIST_STATISTIC_STACKING_REQUESTED,
});

export const getStatisticStackingSuccess = (payload: IStatisticStackingResponse) => ({
  type: types.GET_LIST_STATISTIC_STACKING_SUCCESS,
  payload,
});

export const getStatisticStackingFailed = () => ({
  type: types.GET_LIST_STATISTIC_STACKING_FAILED,
});

export const getStatisticStackingStatRequested = () => ({
  type: types.GET_STAT_REQUESTED,
});

export const getStatisticStackingStatSuccess = (payload: any) => ({
  type: types.GET_STAT_SUCCESS,
  payload,
});

export const getStatisticStackingStatFailed = () => ({
  type: types.GET_STAT_FAILED,
});
