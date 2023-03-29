import { SystemConfigAPI } from 'apis/systemconfig';
import * as actions from 'containers/HomeAdsConfig/duck/actions';
import { AppDispatch } from 'store';

export const getHomePageBannerConfig = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getHomePageBannerConfigRequested());
  try {
    const res = await SystemConfigAPI.GET_HOMEPAGE_BANNER_CONFIG();
    dispatch(actions.getHomePageBannerConfigSuccess(res));
  } catch (error) {
    dispatch(actions.getHomePageBannerConfigFailed());
  }
};
