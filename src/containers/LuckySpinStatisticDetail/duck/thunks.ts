import { LuckySpinAPI } from 'apis/luckyspin';
import * as actions from 'containers/LuckySpinStatisticDetail/duck/actions';
import { AppDispatch } from 'store';

export const getLuckySpinDetail = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(actions.getLuckySpinDetailRequested());
  try {
    dispatch(actions.getLuckySpinDetailSuccess([]));
  } catch (error) {
    dispatch(actions.getLuckySpinDetailFailed());
  }
};

export const getListUser = (params: ILuckyWheelStatisticByDateRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListUserRequested());
  try {
    const res = await LuckySpinAPI.GET_STATISTIC_LUCKY_SPIN_BY_DATE(params);
    dispatch(actions.getListUserSuccess(res));
  } catch (error) {
    dispatch(actions.getListUserFailed());
  }
};
