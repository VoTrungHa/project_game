import produce from 'immer';
import * as types from './types';

interface IInitialState extends IWithdrawalVndcReponse {
  loading: boolean;
  stat?: IWithdrawalVndcStats;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
  stat: undefined,
};

export const withdrawalVndcReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_WITHDRAWAL_VNDC_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_WITHDRAWAL_VNDC_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_WITHDRAWAL_VNDC_SUCCESS:
        draft.loading = false;
        draft.data = action.payload.data;
        draft.page = action.payload.page;
        draft.totalRecords = action.payload.totalRecords;
        break;
      case types.GET_STAT_WITHDRAWAL_VNDC_FAILED:
        draft.stat = undefined;
        break;
      case types.GET_STAT_WITHDRAWAL_VNDC_SUCCESS:
        draft.stat = action.payload;
        break;
      default:
        return state;
    }
  });
