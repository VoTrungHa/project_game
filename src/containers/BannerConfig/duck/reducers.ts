import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  data: IGetBannerConfigResponse;
}

const initialState: IInitialState = {
  loading: false,
  data: [],
};

export const BannerConfigReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_BANNER_CONFIG_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_BANNER_CONFIG_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        break;
      case types.GET_BANNER_CONFIG_FAILED:
        draft.loading = false;
        draft.data = [];
        break;
      default:
        return state;
    }
  });
