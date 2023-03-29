import * as types from './types';

export const loginRequested = () => ({
  type: types.LOGIN_REQUESTED,
});

export const loginSuccess = (payload) => ({
  type: types.LOGIN_SUCCESS,
  payload,
});

export const loginFailed = () => ({
  type: types.LOGIN_FAILED,
});

export const logoutRequested = () => ({
  type: types.LOGOUT_REQUESTED,
});

export const logoutSuccess = () => ({
  type: types.LOGOUT_SUCCESS,
});
