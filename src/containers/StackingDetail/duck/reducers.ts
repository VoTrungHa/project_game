import produce from 'immer';
import * as types from './types';

interface IInitialState {
  stackingDetailInformation?: IStatisticStackingItem;
  accounts: IStatisticStackingAccountResponse | undefined;
  loading: boolean;
}

const initialState: IInitialState = {
  stackingDetailInformation: undefined,
  loading: false,
  accounts: undefined,
};

export const StatisticStackingDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_STACKING_DETAIL_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_STACKING_DETAIL_FAILED:
        draft.loading = false;
        draft.stackingDetailInformation = undefined;
        break;
      case types.GET_STACKING_DETAIL_SUCCESS:
        draft.loading = false;
        draft.stackingDetailInformation = action.payload;
        break;
      case types.GET_STACKING_TABLE_FAILED:
        draft.loading = false;
        draft.accounts = undefined;
        break;
      case types.GET_STACKING_TABLE_SUCCESS:
        draft.loading = false;
        draft.accounts = action.payload;
        break;
      default:
        return state;
    }
  });
