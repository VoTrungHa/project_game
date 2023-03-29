import produce from 'immer';
import * as types from './types';

interface IInitialState {
  rankDetailInformation?: IRankItem;
  accounts: Array<IReferralRankingAccount>;
  loading: boolean;
}

const initialState: IInitialState = {
  rankDetailInformation: undefined,
  loading: false,
  accounts: [],
};

export const RankDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_RANK_DETAIL_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_RANK_DETAIL_FAILED:
        draft.loading = false;
        draft.rankDetailInformation = undefined;
        break;
      case types.GET_RANK_DETAIL_SUCCESS:
        draft.loading = false;
        draft.rankDetailInformation = action.payload;
        break;
      case types.GET_RANK_TABLE_FAILED:
        draft.loading = false;
        draft.accounts = [];
        break;
      case types.GET_RANK_TABLE_SUCCESS:
        draft.loading = false;
        draft.accounts = action.payload;
        break;
      default:
        return state;
    }
  });
