import * as types from './types';

export const getListKycRequested = () => ({
  type: types.GET_LIST_KYC_REQUESTED,
});

export const getListKycSuccess = (payload: IListKycResponse) => ({
  type: types.GET_LIST_KYC_SUCCESS,
  payload,
});

export const getListUserFailed = () => ({
  type: types.GET_LIST_KYC_FAILED,
});
