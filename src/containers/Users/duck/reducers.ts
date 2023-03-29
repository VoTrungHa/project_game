import produce from 'immer';
import * as types from './types';

interface IInitialState extends IListUserResponse {
  loading: boolean;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
};

export const UserReducer = (state = initialState, action) =>
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
        break;
      default:
        return state;
    }
  });
