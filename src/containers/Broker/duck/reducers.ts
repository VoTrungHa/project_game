import produce from 'immer';
import * as types from './types';

interface IInitialState extends IBrokerListResponse {
  loading: boolean;
  currencyList: ICurrencyList;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
  currencyList: [],
};

export const BrokerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_BROKER_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_BROKER_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_BROKER_SUCCESS:
        draft.loading = false;
        draft.data = action.payload.data;
        draft.page = action.payload.page;
        draft.totalRecords = action.payload.totalRecords;
        break;
      case types.GET_LIST_CURRENCY_FAILED:
        draft.currencyList = [];
        break;
      case types.GET_LIST_CURRENCY_SUCCESS:
        draft.currencyList = action.payload;
        break;
      default:
        return state;
    }
  });
