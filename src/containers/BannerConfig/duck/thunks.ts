import { SystemConfigAPI } from 'apis/systemconfig';
import * as actions from 'containers/BannerConfig/duck/actions';
import { AppDispatch } from 'store';

export const getBannerConfig = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getBannerConfigRequested());
  try {
    const res = await SystemConfigAPI.GET_BANNER_CONFIG();
    dispatch(actions.getBannerConfigSuccess(res));
  } catch (error) {
    dispatch(actions.getBannerConfigFailed());
  }
};
