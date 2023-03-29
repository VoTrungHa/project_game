import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  data: Array<IMobileUserAccount>;
  dataWithAmount: Array<IMobileUserAccount & { amount: string }>;
  page?: number;
  totalRecords?: number;
  totalAmount?: number;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  totalAmount: 0,
  data: [],
  dataWithAmount: [],
  loading: false,
};

export const PrivateSaleReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_SUCCESS:
        draft.loading = false;
        draft.page = action.payload.page;
        draft.totalRecords = action.payload.totalRecords;
        draft.data = action.payload.data;
        break;
      case types.ADD_TO_GOLDEN_EGG:
        draft.dataWithAmount.push(action.payload);
        break;
      case types.DELETE_TO_GOLDEN_EGG:
        const indexDelete = draft.dataWithAmount.findIndex((item) => item.id === action.payload.id);
        draft.dataWithAmount.splice(indexDelete, 1);
        break;
      case types.RESET_TO_GOLDEN_EGG:
        draft.dataWithAmount = [];
        break;
      case types.UPDATE_TO_GOLDEN_EGG:
        const indexUpdate = draft.dataWithAmount.findIndex((item) => item.id === action.payload.id);
        draft.dataWithAmount[indexUpdate].amount = action.payload.value;
        break;
      default:
        return state;
    }
  });
