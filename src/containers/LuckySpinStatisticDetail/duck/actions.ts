import * as types from './types';

export const getLuckySpinDetailRequested = () => ({
  type: types.GET_LUCKY_SPIN_DETAIL_REQUESTED,
});

export const getLuckySpinDetailSuccess = (payload: any) => ({ type: types.GET_LUCKY_SPIN_DETAIL_SUCCESS, payload });

export const getLuckySpinDetailFailed = () => ({
  type: types.GET_LUCKY_SPIN_DETAIL_FAILED,
});

export const getListUserRequested = () => ({
  type: types.GET_LIST_USER_REQUESTED,
});

export const getListUserSuccess = (payload: ILuckyWheelStatisticByDateResponse) => ({
  type: types.GET_LIST_USER_SUCCESS,
  payload,
});

export const getListUserFailed = () => ({
  type: types.GET_LIST_USER_FAILED,
});
