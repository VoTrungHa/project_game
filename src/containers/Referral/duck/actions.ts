import * as types from './types';

export const getListReferralRequested = () => ({
  type: types.GET_LIST_REFERRAL_REQUESTED,
});

export const getListReferralSuccess = (payload: IReferralResponse) => ({
  type: types.GET_LIST_REFERRAL_SUCCESS,
  payload,
});

export const getListReferralFailed = () => ({
  type: types.GET_LIST_REFERRAL_FAILED,
});
