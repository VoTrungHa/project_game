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

export const PartnerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_PARTNER_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_PARTNER_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_PARTNER_SUCCESS:
        return { ...action.payload, loading: false };
      default:
        return state;
    }
  });
