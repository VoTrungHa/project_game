import produce from 'immer';
import * as types from './types';

interface IInitialState extends IListReferralCounterResponse {
  loading: boolean;
  rewardData: Array<IReferralCounterItem>;
  dataWithAmount: Array<IReferralCounterItem>;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  rewardData: [],
  loading: false,
  dataWithAmount: [],
  totalAmount: 0,
};

export const ReferralCounterReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_STATISTIC_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_STATISTIC_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_STATISTIC_SUCCESS:
        draft.loading = false;
        draft.page = action.payload.page;
        draft.totalRecords = action.payload.totalRecords;
        draft.data = action.payload.data;
        break;
      case types.ADD_TO_REWARD:
        draft.rewardData.unshift(action.payload);
        const indexAdd = draft.data.findIndex((item) => item.id === action.payload.id);
        draft.data[indexAdd].isDisabled = true;
        break;
      case types.DELETE_TO_REWARD:
        const indexDelete = draft.rewardData.findIndex((item) => item.id === action.payload.id);
        draft.rewardData.splice(indexDelete, 1);
        const index = draft.data.findIndex((item) => item.id === action.payload.id);
        draft.data[index].isDisabled = false;
        break;
      case types.RESET_REWARD:
        draft.rewardData = [];
        break;
      case types.GET_LIST_STATISTIC_WITH_AMOUNT_REQUESTED:
        draft.loading = true;
        draft.totalAmount = 0;
        draft.totalRecords = 0;
        break;
      case types.GET_LIST_STATISTIC_WITH_AMOUNT_FAILED:
        draft.loading = false;
        draft.dataWithAmount = [];
        draft.page = undefined;
        break;
      case types.GET_LIST_STATISTIC_WITH_AMOUNT_SUCCESS:
        draft.loading = false;
        draft.page = action.payload.page;
        draft.totalRecords = action.payload.totalRecords;
        draft.totalAmount = action.payload.totalAmount;
        draft.dataWithAmount = action.payload.data;
        break;
      default:
        return state;
    }
  });
