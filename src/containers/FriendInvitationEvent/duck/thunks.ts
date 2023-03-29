import { FriendInvitationEventAPI } from 'apis/friendInvitation';
import * as actions from 'containers/FriendInvitationEvent/duck/actions';
import { AppDispatch } from 'store';

export const getListEvent = (params: IEventListRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getFriendInvitationRequested());
  try {
    const res = await FriendInvitationEventAPI.GET_LIST_EVENT(params);
    dispatch(actions.getFriendInvitationSuccess(res));
  } catch (error) {
    dispatch(actions.getFriendInvitationFailed());
  }
};
