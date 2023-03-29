import { SystemConfigAPI } from 'apis/systemconfig';
import * as actions from 'containers/SettingStacking/duck/actions';
import { AppDispatch } from 'store';

export const getStackingConfig = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getInterestRateConfigRequested());
  try {
    const res = await SystemConfigAPI.GET_STACKING();
    dispatch(actions.getInterestRateConfigSuccess(res));
  } catch (error) {
    dispatch(actions.getInterestRateConfigFailed());
  }
};
