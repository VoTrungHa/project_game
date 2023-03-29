import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  list?: IAccountResponse;
  stat?: IAccountStat;
}

const initialState: IInitialState = {
  loading: false,
  list: undefined,
  stat: undefined,
};

export const AccountReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_ACCOUNT_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_ACCOUNT_FAILED:
        draft.loading = false;
        draft.list = undefined;
        break;
      case types.GET_LIST_ACCOUNT_SUCCESS:
        draft.loading = false;
        draft.list = action.payload;
        break;
      case types.GET_STAT_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_STAT_FAILED:
        draft.loading = false;
        draft.stat = undefined;
        break;
      case types.GET_STAT_SUCCESS:
        draft.loading = false;
        draft.stat = action.payload;
        break;
      default:
        return state;
    }
  });
