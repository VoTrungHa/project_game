import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  listRanking: IEventRankingListResponse;
  event?: IEventItem;
}

const initialState: IInitialState = {
  loading: false,
  event: undefined,
  listRanking: {
    page: 0,
    totalRecords: 0,
    data: [],
  },
};

export const FriendInvitationEventDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_FRIEND_INVITATION_DETAIL_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_FRIEND_INVITATION_DETAIL_FAILED:
        draft.loading = false;
        draft.listRanking.data = [];
        draft.listRanking.page = 0;
        draft.listRanking.totalRecords = 0;
        break;
      case types.GET_LIST_FRIEND_INVITATION_DETAIL_SUCCESS:
        draft.loading = false;
        draft.listRanking.data = action.payload.data;
        draft.listRanking.page = action.payload.page;
        draft.listRanking.totalRecords = action.payload.totalRecords;
        break;
      case types.GET_EVENT_BY_ID_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_EVENT_BY_ID_FAILED:
        draft.loading = false;
        draft.event = undefined;
        break;
      case types.GET_EVENT_BY_ID_SUCCESS:
        draft.loading = false;
        draft.event = action.payload;
        break;
      default:
        return state;
    }
  });
