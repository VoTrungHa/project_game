import produce from 'immer';
import * as types from './types';

interface IInitialState extends IMobileUserAccountResponse {
  loading: boolean;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
};

export const MobileUserReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_MOBILE_USER_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_MOBILE_USER_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_MOBILE_USER_SUCCESS:
        return { ...action.payload, loading: false };
      default:
        return state;
    }
  });
