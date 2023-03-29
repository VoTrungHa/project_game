import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  list?: IPlayerListResponse;
  stat?: IPlayerListStat;
}

const initialState: IInitialState = {
  list: undefined,
  loading: false,
  stat: undefined,
};

export const PlayerListReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_PLAYER_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_PLAYER_FAILED:
        draft.loading = false;
        draft.list = undefined;
        break;
      case types.GET_LIST_PLAYER_SUCCESS:
        draft.loading = false;
        draft.list = action.payload;
        break;
      case types.GET_LIST_PLAYER_STAT_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_PLAYER_STAT_FAILED:
        draft.loading = false;
        draft.stat = undefined;
        break;
      case types.GET_LIST_PLAYER_STAT_SUCCESS:
        draft.loading = false;
        draft.stat = action.payload;
        break;
      default:
        return state;
    }
  });
