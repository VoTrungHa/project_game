import * as types from './types';

export const getCategoryMasterRequested = () => ({
  type: types.GET_CATEGORY_MASTER_REQUESTED,
});

export const getCategoryMasterSuccess = (payload: ICategoryMasterResponse) => ({
  type: types.GET_CATEGORY_MASTER_SUCCESS,
  payload,
});

export const getCategoryMasterFailed = () => ({
  type: types.GET_CATEGORY_MASTER_FAILED,
});

export const getListCampaignRequested = () => ({
  type: types.GET_LIST_CAMPAIGN_REQUESTED,
});

export const getListCampaignSuccess = (payload: IListCampaignResponse) => ({
  type: types.GET_LIST_CAMPAIGN_SUCCESS,
  payload,
});

export const getListCampaignFailed = () => ({
  type: types.GET_LIST_CAMPAIGN_FAILED,
});
