import * as types from './types';

export const getDailySpinRequested = () => ({
  type: types.GET_DAILY_SPIN_REQUESTED,
});

export const getDailySpinFailed = () => ({
  type: types.GET_DAILY_SPIN_FAILED,
});

export const getDailySpinSuccess = (payload: ISpinDailyResponse) => ({
  type: types.GET_DAILY_SPIN_SUCCESS,
  payload,
});
