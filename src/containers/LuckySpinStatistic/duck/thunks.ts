import { LuckySpinAPI } from 'apis/luckyspin';
import * as actions from 'containers/LuckySpinStatistic/duck/actions';
import { AppDispatch } from 'store';

export const getListLuckySpinStatistic = (params: ILuckyWheelStatisticRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListStatisticRequested());
  try {
    const res = await LuckySpinAPI.GET_STATISTIC_LUCKY_SPIN(params);
    dispatch(actions.getListStatisticSuccess(res));
  } catch (error) {
    dispatch(actions.getListStatisticFailed());
  }
};
