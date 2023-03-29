import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  data: ISpinDailyResponse;
}

const initialState: IInitialState = {
  loading: false,
  data: [],
};

export const SpinPrizeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_DAILY_SPIN_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_DAILY_SPIN_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        break;
      case types.GET_DAILY_SPIN_FAILED:
        draft.loading = false;
        draft.data = [];
        break;
      default:
        return state;
    }
  });
