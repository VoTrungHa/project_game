import * as types from './types';

export const getFriendInvitationRequested = () => ({
  type: types.GET_LIST_FRIEND_INVITATION_REQUESTED,
});

export const getFriendInvitationSuccess = (payload: IEventListResponse) => ({
  type: types.GET_LIST_FRIEND_INVITATION_SUCCESS,
  payload,
});

export const getFriendInvitationFailed = () => ({
  type: types.GET_LIST_FRIEND_INVITATION_FAILED,
});
