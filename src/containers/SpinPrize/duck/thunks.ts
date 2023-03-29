import { SystemConfigAPI } from 'apis/systemconfig';
import * as actions from 'containers/SpinPrize/duck/actions';
import { AppDispatch } from 'store';

export const getDailySpin = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getDailySpinRequested());
  try {
    const res = await SystemConfigAPI.GET_DAILY_SPIN();
    dispatch(actions.getDailySpinSuccess(res));
  } catch (error) {
    dispatch(actions.getDailySpinFailed());
  }
};
