import { GameAPI } from 'apis/game';
import * as actions from 'containers/Challenge/duck/actions';
import { AppDispatch } from 'store';

export const getListChallenge = (params) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListChallengeRequested());
  try {
    const res = await GameAPI.GET_LIST_CHALLENGE(params);
    dispatch(actions.getListChallengeSuccess(res));
  } catch (error) {
    dispatch(actions.getListChallengeRequested());
  }
};
