import produce from 'immer';
import * as types from './types';

const initialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
};

export const RankReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_RANK_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_RANK_FAILED:
        draft.loading = false;
        draft.data = [];
        break;
      case types.GET_LIST_RANK_SUCCESS:
        draft.loading = false;
        draft.data = action.payload.data;
        draft.page = action.payload.page;
        draft.totalRecords = action.payload.totalRecords
        break;
      default:
        return state;
    }
  });
