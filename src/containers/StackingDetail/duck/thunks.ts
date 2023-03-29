import { StatisticStackingAPI } from 'apis/interest-payment';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/StackingDetail/duck/actions';
import { AppDispatch } from 'store';

export const getStackingDetailAction = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(actions.getStackingDetailRequested());
  try {
    const res = await StatisticStackingAPI.GET_DETAIL_BY_ID(id);
    dispatch(actions.getStackingDetailSuccess(res));
  } catch (error) {
    dispatch(actions.getStackingDetailFailed());
  }
};

export const getStackingTableAction = (id: string, params: { page?: number; size?: number }) => async (dispatch: AppDispatch) => {
  dispatch(actions.getStackingTableRequested());
  try {
    const res = await StatisticStackingAPI.GET_ACCOUNTs(id, {
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getStackingTableSuccess(res));
  } catch (error) {
    dispatch(actions.getStackingTableFailed());
  }
};