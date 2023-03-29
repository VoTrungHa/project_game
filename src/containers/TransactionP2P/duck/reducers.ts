import produce from 'immer';
import * as types from './types';

interface IInitialState extends ITransactionP2PResponse {
  loading: boolean;
  stat?: ITransactionP2PStatResponse;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
  stat: undefined,
};

export const P2PListReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_TRANSACTION_P2P_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_TRANSACTION_P2P_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_TRANSACTION_P2P_SUCCESS:
        return { ...draft, ...action.payload, loading: false };
      case types.GET_STAT_TRANSACTION_P2P_FAILED:
        draft.stat = undefined;
        break;
      case types.GET_STAT_TRANSACTION_P2P_SUCCESS:
        draft.stat = action.payload;
        break;
      default:
        return state;
    }
  });
