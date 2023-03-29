import { ChickenSaleAPI } from 'apis/chickensale';
import * as actions from 'containers/SaleSchedule/duck/actions';
import { AppDispatch } from 'store';

export const getListSchedule = (params: IListScheduleRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getScheduleRequested());
  try {
    const res = await ChickenSaleAPI.GET_LIST_SCHEDULE(params);
    dispatch(actions.getScheduleSuccess(res));
  } catch (error) {
    dispatch(actions.getScheduleFailed());
  }
};
