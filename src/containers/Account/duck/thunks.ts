import { AcccountAPI } from 'apis/account';
import * as actions from 'containers/Account/duck/actions';
import { AppDispatch } from 'store';

export const getAccount = (params: IAccountRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getAccountRequested());
  try {
    const res = await AcccountAPI.GET_LIST_ACCOUNT(params);
    dispatch(actions.getAccountSuccess(res));
  } catch (error) {
    dispatch(actions.getAccountFailed());
  }
};

export const getAccountStat = (params: IAccountRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getAccountStatRequested());
  try {
    const res = await AcccountAPI.GET_ACCOUNT_STAT(params);
    dispatch(actions.getAccountStatSuccess(res));
  } catch (error) {
    dispatch(actions.getAccountStatFailed());
  }
};
