import * as types from './types';

export const getProfileRequested = () => ({
  type: types.GET_PROFILE_REQUESTED,
});

export const getProfleSuccess = (payload: IFullProfile) => ({
  type: types.GET_PROFILE_SUCCESS,
  payload,
});

export const getProfleFailed = () => ({
  type: types.GET_PROFILE_FAILED,
});
