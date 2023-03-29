import produce from 'immer';
import * as types from './types';

interface IInitialState extends ILuckySpinResponse {
  loading: boolean;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
};

export const LuckySpinReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_PRIZE_SPIN_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_PRIZE_SPIN_FAILED:
        draft.loading = false;
        draft.data = [];
        break;
      case types.GET_LIST_PRIZE_SPIN_SUCCESS:
        return { ...action.payload, loading: false };
      default:
        return state;
    }
  });
