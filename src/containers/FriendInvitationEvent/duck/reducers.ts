import produce from 'immer';
import * as types from './types';

interface IInitialState extends IEventListResponse {
  loading: boolean;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
};

export const FriendInvitationEventReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_FRIEND_INVITATION_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_FRIEND_INVITATION_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_FRIEND_INVITATION_SUCCESS:
        draft.loading = false;
        draft.data = action.payload.data;
        draft.page = action.payload.page;
        draft.totalRecords = action.payload.totalRecords;
        break;
      default:
        return state;
    }
  });
