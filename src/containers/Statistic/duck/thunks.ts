import { MobileUserAPI } from 'apis/mobileuser';
import { StatisticAPI } from 'apis/statistic';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/Statistic/duck/actions';
import { AppDispatch } from 'store';

export const getListReferralCounter = (params: IListReferralCounterRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListStatisticRequested());
  try {
    const res = await StatisticAPI.GET_LIST_STATISTIC({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getListStatisticSuccess(res));
  } catch (error) {
    dispatch(actions.getListStatisticFailed());
  }
};

export const getListReward = (params: IMobileUserAccountRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListStatisticRequested());
  try {
    const res = await MobileUserAPI.GET_LIST_MOBILE_USER({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getListStatisticSuccess(res));
  } catch (error) {
    dispatch(actions.getListStatisticFailed());
  }
};

export const getListAmountCounter = (params: Pick<IListReferralCounterRequest, 'page' | 'size'>) => async (
  dispatch: AppDispatch,
) => {
  dispatch(actions.getListStatisticWithAmountRequested());
  try {
    const res = await StatisticAPI.GET_LIST_STATISTIC_WITH_AMOUNT({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getListStatisticWithAmountSuccess(res));
  } catch (error) {
    dispatch(actions.getListStatisticWithAmountFailed());
  }
};
