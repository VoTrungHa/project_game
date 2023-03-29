import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  stacking?: IInterestRateConfig;
}

const initialState: IInitialState = {
  loading: false,
  stacking: undefined,
};

export const SettingStackingReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_INTEREST_RATE_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_INTEREST_RATE_FAILED:
        draft.loading = false;
        draft.stacking = undefined;
        break;
      case types.GET_INTEREST_RATE_SUCCESS:
        draft.loading = false;
        draft.stacking = action.payload;
        break;
      default:
        return state;
    }
  });
