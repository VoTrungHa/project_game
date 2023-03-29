import * as types from './types';

export const getListChallengeRequested = () => ({
  type: types.GET_LIST_CHALLENGE_REQUESTED,
});

export const getListChallengeSuccess = (payload: IChallengeListResponse) => ({
  type: types.GET_LIST_CHALLENGE_SUCCESS,
  payload,
});

export const getListChallengeFailed = () => ({
  type: types.GET_LIST_CHALLENGE_FAILED,
});
