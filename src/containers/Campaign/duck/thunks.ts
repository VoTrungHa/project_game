import { CampaignAPI } from 'apis/campaign';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/Campaign/duck/actions';
import { AppDispatch } from 'store';

export const getCategoryMasterList = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getCategoryMasterRequested());
  try {
    const res = await CampaignAPI.GET_CATEGORY_MASTER();
    dispatch(actions.getCategoryMasterSuccess(res));
  } catch (error) {
    dispatch(actions.getCategoryMasterFailed());
  }
};

export const getCampaignList = (params: IListCampaignRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListCampaignRequested());
  try {
    const res = await CampaignAPI.GET_LIST_CAMPAIGN({ ...params, size: DEFAULT_PAGE_SIZE });
    dispatch(actions.getListCampaignSuccess(res));
  } catch (error) {
    dispatch(actions.getListCampaignFailed());
  }
};
