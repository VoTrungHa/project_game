import { LuckySpinAPI } from 'apis/luckyspin';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/LuckySpin/duck/actions';
import { AppDispatch } from 'store';

export const getLuckyPrizeSpin = (params: ILuckySpinRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListPrizeSpinRequested());
  try {
    const res = await LuckySpinAPI.GET_LUCKY_SPIN({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getListPrizeSpinSuccess(res));
  } catch (error) {
    dispatch(actions.getListPrizeSpinFailed());
  }
};
