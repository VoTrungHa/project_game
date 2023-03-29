import { ReportAPI } from 'apis/report';
import * as actions from 'containers/Referral/duck/actions';
import { AppDispatch } from 'store';

export const getListReferral = (params) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListReferralRequested());
  try {
    const res = await ReportAPI.GET_LIST_REFERRAL(params);
    dispatch(actions.getListReferralSuccess(res));
  } catch (error) {
    dispatch(actions.getListReferralFailed());
  }
};
