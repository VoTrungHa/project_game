import * as types from './types';

export const getListPartnerRequested = () => ({
  type: types.GET_LIST_PARTNER_REQUESTED,
});

export const getListPartnerSuccess = (payload: any) => ({
  type: types.GET_LIST_PARTNER_SUCCESS,
  payload,
});

export const getListPartnerFailed = () => ({
  type: types.GET_LIST_PARTNER_FAILED,
});
