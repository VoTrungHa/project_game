import { StatisticStackingAPI } from 'apis/interest-payment';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/StatisticStacking/duck/actions';
import { AppDispatch } from 'store';

export const getStatisticStackingAction = (params: IStatisticStackingRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getStatisticStackingRequested());
  try {
    const res = await StatisticStackingAPI.GET_LIST_STATISTIC_STACKING({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getStatisticStackingSuccess(res));
  } catch (error) {
    dispatch(actions.getStatisticStackingFailed());
  }
};

export const getStatisticStackingStatAction = (params: IStatisticStackingRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getStatisticStackingStatRequested());
  try {
    const res = await StatisticStackingAPI.GET_STATISTIC_STACKING_STAT(params);
    dispatch(actions.getStatisticStackingStatSuccess(res));
  } catch (error) {
    dispatch(actions.getStatisticStackingStatFailed());
  }
};
