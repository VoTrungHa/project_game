import * as types from './types';

export const getListStatisticRequested = () => ({
  type: types.GET_LIST_STATISTIC_REQUESTED,
});

export const getListStatisticFailed = () => ({
  type: types.GET_LIST_STATISTIC_FAILED,
});

export const getListStatisticSuccess = (payload: IListReferralCounterResponse | IMobileUserAccountResponse) => ({
  type: types.GET_LIST_STATISTIC_SUCCESS,
  payload,
});

export const addToReward = (payload: IReferralCounterItem) => ({
  type: types.ADD_TO_REWARD,
  payload,
});

export const deleteToReward = (payload: IReferralCounterItem) => ({
  type: types.DELETE_TO_REWARD,
  payload,
});

export const resetReward = () => ({
  type: types.RESET_REWARD,
});

export const getListStatisticWithAmountRequested = () => ({
  type: types.GET_LIST_STATISTIC_WITH_AMOUNT_REQUESTED,
});

export const getListStatisticWithAmountFailed = () => ({
  type: types.GET_LIST_STATISTIC_WITH_AMOUNT_FAILED,
});

export const getListStatisticWithAmountSuccess = (payload: IListReferralCounterResponse) => ({
  type: types.GET_LIST_STATISTIC_WITH_AMOUNT_SUCCESS,
  payload,
});
