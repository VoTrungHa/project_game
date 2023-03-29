import produce from 'immer';
import * as types from './types';

interface IInitialState extends IGameListResponse {
  loading: boolean;
}

const initialState: IInitialState = {
  loading: false,
  data: [],
  page: undefined,
  totalRecords: undefined,
};

export const GameReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_GAME_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_GAME_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_GAME_SUCCESS:
        draft.loading = false;
        draft.data = action.payload.data;
        draft.page = action.payload.page;
        draft.totalRecords = action.payload.totalRecords;
        break;
      default:
        return state;
    }
  });
