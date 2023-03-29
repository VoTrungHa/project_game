import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  eventGame: ISatoshiGameResponse;
  list?: IStatisticSatoshiGameReponse;
}

const initialState: IInitialState = {
  loading: false,
  eventGame: [],
  list: undefined,
};

export const SatoshiGameReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_EVENT_REQUESTED:
      case types.GET_LIST_STATISTIC_GAME_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_EVENT_FAILED:
        draft.loading = false;
        draft.eventGame = [];
        break;
      case types.GET_EVENT_SUCCESS:
        draft.loading = false;
        draft.eventGame = action.payload;
        break;
      case types.GET_LIST_STATISTIC_GAME_FAILED:
        draft.loading = false;
        draft.list = undefined;
        break;
      case types.GET_LIST_STATISTIC_GAME_SUCCESS:
        draft.loading = false;
        draft.list = action.payload;
        break;
      default:
        return state;
    }
  });
