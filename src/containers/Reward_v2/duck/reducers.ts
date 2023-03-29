import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  list?: IEventsRewar;
  listEvent?: IEventsRewar;
  brokers?: IBorker[];
  listUsers?: IUserGiveEventResponse;
  listUserRewarded?: IUserGiveEventRes;
}

const initialState: IInitialState = {
  loading: false,
  list: undefined,
  brokers: undefined,
  listEvent: undefined,
  listUsers: undefined,
  listUserRewarded: undefined,
};

export const RewardReducer = (state = initialState, action) =>
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

      case types.GET_EVENTS_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_EVENTS_SUCCESS:
        draft.loading = false;
        draft.listEvent = action.payload;
        break;
      case types.GET_EVENTS_FAILED:
        draft.loading = false;
        draft.listEvent = undefined;
        break;

      case types.GET_BROKERS:
        draft.loading = true;
        break;
      case types.GET_BROKER_SUCCESS:
        draft.loading = false;

        draft.brokers = action.payload;
        break;
      case types.GET_BROKER_FAILED:
        draft.loading = false;
        draft.brokers = undefined;
        break;

      case types.GET_USERS_BY_KEYWORD:
        draft.loading = true;
        break;
      case types.GET_USERS_BY_KEYWORD_SUCCESS:
        draft.loading = false;
        draft.listUsers = action.payload;
        break;
      case types.GET_USERS_BY_KEYWORD_FAILED:
        draft.loading = false;
        draft.listUsers = undefined;
        break;

      case types.GET_USERS_REWARDED:
        draft.loading = true;
        break;
      case types.GET_USERS_REWARDED_SUCCESS:
        draft.loading = false;
        draft.listUserRewarded = action.payload;
        break;
      case types.GET_USERS_REWARDED_FAILED:
        draft.loading = false;
        draft.listUserRewarded = undefined;
        break;

      default:
        return state;
    }
  });
