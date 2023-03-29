import { rewardApi } from 'apis/reward';
import * as actions from 'containers/Reward_v2/duck/actions';
import { AppDispatch } from 'store';

export const getAccount = (params: IParameterRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getAccountRequested());
  try {
    const res = await rewardApi.GET_LIST_ACCOUNT(params);
    dispatch(actions.getAccountSuccess(res));
  } catch (error) {
    dispatch(actions.getAccountFailed());
  }
};

export const getEventsReward = (params: IEventRewardRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getEventsRewardRequested());
  try {
    const res = await rewardApi.GET_EVENTS_REWARD(params);
    dispatch(actions.getEventsRewardSuccess(res));
  } catch (error) {
    dispatch(actions.getEventsRewardFailed());
  }
};

export const getUserByKeyword = (params: any) => async (dispatch: AppDispatch) => {
  dispatch(actions.getUserByKeyworkRequested());
  try {
    const res = await rewardApi.GET_USER_BY_KEYWORD(params);
    dispatch(actions.getUserByKeyworkSuccess(res));
  } catch (error) {
    dispatch(actions.getUserByKeyworkFailed());
  }
};

export const getBrokers = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getBrokerRequested());
  try {
    const res = await rewardApi.GET_BROKERS();
    dispatch(actions.getBrokerdSuccess(res));
  } catch (error) {
    dispatch(actions.getBrokerdFailed());
  }
};

export const getUserRewarded = (params, id) => async (dispatch: AppDispatch) => {
  dispatch(actions.getUserRewardedRequested());
  try {
    const res = await rewardApi.GET_USER_REWAREDED(params, id);
    dispatch(actions.getUserRewardedSuccess(res));
  } catch (error) {
    dispatch(actions.getUserRewardedFailed());
  }
};
