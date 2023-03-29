import produce from 'immer';
import * as types from './types';

interface IInitialState extends ILuckyWheelStatisticByDateResponse {
  loading: boolean;
  summary: {
    totalAllPrizes: number
    totalPrize50: number
    totalPrize100: number
    totalPrize200: number
    totalPrize300: number
    totalPrize400: number
    totalPrize500: number
    totalPrize1000: number
    totalPrizeSpecial: number
  }
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
  summary: {
    totalAllPrizes: 0,
    totalPrize50: 0,
    totalPrize100: 0,
    totalPrize200: 0,
    totalPrize300: 0,
    totalPrize400: 0,
    totalPrize500: 0,
    totalPrize1000: 0,
    totalPrizeSpecial: 0,
  }
};

export const LuckySpinDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_USER_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_USER_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_USER_SUCCESS:
        draft.loading = false;
        draft.page = action.payload.page;
        draft.totalRecords = action.payload.totalRecords;
        draft.data = action.payload.data;
        draft.summary = action.payload.summary
        break;
      default:
        return state;
    }
  });
