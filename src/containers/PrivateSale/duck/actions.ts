import * as types from './types';

export const getListRequested = () => ({
  type: types.GET_LIST_REQUESTED,
});

export const getListFailed = () => ({
  type: types.GET_LIST_FAILED,
});

export const getListSuccess = (payload) => ({
  type: types.GET_LIST_SUCCESS,
  payload,
});

export const addToGoldenEgg = (payload) => ({
  type: types.ADD_TO_GOLDEN_EGG,
  payload,
});

export const deleteToGoldenEgg = (payload) => ({
  type: types.DELETE_TO_GOLDEN_EGG,
  payload,
});

export const resetToGoldenEgg = () => ({
  type: types.RESET_TO_GOLDEN_EGG,
});

export const updateToGoldenEgg = (payload) => ({
  type: types.UPDATE_TO_GOLDEN_EGG,
  payload,
});
