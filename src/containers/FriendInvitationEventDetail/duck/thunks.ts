import { FriendInvitationEventAPI } from 'apis/friendInvitation';
import * as actions from 'containers/FriendInvitationEventDetail/duck/actions';
import { AppDispatch } from 'store';

export const getRanking = (params: IEventRankingListRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getFriendInvitationDetailRequested());
  try {
    const res = await FriendInvitationEventAPI.GET_RANKING_BY_ID(params);
    dispatch(actions.getFriendInvitationDetailSuccess(res));
  } catch (error) {
    dispatch(actions.getFriendInvitationDetailFailed());
  }
};

export const getEventById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(actions.getEventByIdRequested());
  try {
    const res = await FriendInvitationEventAPI.GET_EVENT_BY_ID(id);
    dispatch(actions.getEventByIdSuccess(res));
  } catch (error) {
    dispatch(actions.getEventByIdFailed());
  }
};
