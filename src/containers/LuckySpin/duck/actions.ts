import * as types from './types';

export const getListPrizeSpinRequested = () => ({
  type: types.GET_LIST_PRIZE_SPIN_REQUESTED,
});

export const getListPrizeSpinSuccess = (payload: ILuckySpinResponse) => ({
  type: types.GET_LIST_PRIZE_SPIN_SUCCESS,
  payload,
});

export const getListPrizeSpinFailed = () => ({
  type: types.GET_LIST_PRIZE_SPIN_FAILED,
});
