import produce from 'immer';
import * as types from './types';

interface IInitialSaleScheduleState extends IListSchedule {
  loading: boolean;
}

const initialSaleScheduleState: IInitialSaleScheduleState = {
  loading: false,
  data: [],
  page: 0,
  totalRecords: 0,
};

export const SaleScheduleReducer = (state = initialSaleScheduleState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_SCHEDULE_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_SCHEDULE_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = 0;
        draft.totalRecords = 0;
        break;
      case types.GET_SCHEDULE_SUCCESS:
        return { ...action.payload, loading: false };
      default:
        return state;
    }
  });
