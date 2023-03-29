import * as types from './types';

export const getListMobileUserRequested = () => ({
  type: types.GET_LIST_MOBILE_USER_REQUESTED,
});

export const getListMobileUserSuccess = (payload: IMobileUserAccountResponse) => ({
  type: types.GET_LIST_MOBILE_USER_SUCCESS,
  payload,
});

export const getListMobileUserFailed = () => ({
  type: types.GET_LIST_MOBILE_USER_FAILED,
});
