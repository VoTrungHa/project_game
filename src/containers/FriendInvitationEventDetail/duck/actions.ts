import * as types from './types';

export const getFriendInvitationDetailRequested = () => ({
  type: types.GET_LIST_FRIEND_INVITATION_DETAIL_REQUESTED,
});

export const getFriendInvitationDetailSuccess = (payload: IEventRankingListResponse) => ({
  type: types.GET_LIST_FRIEND_INVITATION_DETAIL_SUCCESS,
  payload,
});

export const getFriendInvitationDetailFailed = () => ({
  type: types.GET_LIST_FRIEND_INVITATION_DETAIL_FAILED,
});

export const getEventByIdRequested = () => ({
  type: types.GET_EVENT_BY_ID_REQUESTED,
});

export const getEventByIdSuccess = (payload: IEventItem) => ({
  type: types.GET_EVENT_BY_ID_SUCCESS,
  payload,
});

export const getEventByIdFailed = () => ({
  type: types.GET_EVENT_BY_ID_FAILED,
});
