import * as types from './types';

export const getListUserRequested = () => ({
  type: types.GET_LIST_USER_REQUESTED,
});

export const getListUserSuccess = (payload: IListUserResponse) => ({
  type: types.GET_LIST_USER_SUCCESS,
  payload,
});

export const getListUserFailed = () => ({
  type: types.GET_LIST_USER_FAILED,
});
