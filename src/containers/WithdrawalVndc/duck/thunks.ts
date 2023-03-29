import { BitfarmAPI } from 'apis/bitfarm';
import * as actions from 'containers/WithdrawalVndc/duck/actions';
import { AppDispatch } from 'store';

export const getListWithdrawalVndc = (params: IWithdrawalVndcRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListWithdrawalVndcRequested());
  try {
    const res = await BitfarmAPI.GET_LIST_WITHDRAWAL_VNDC(params);
    dispatch(actions.getListWithdrawalVndcSuccess(res));
  } catch (error) {
    dispatch(actions.getListWithdrawalVndcFailed());
  }
};

export const getStatWithdrawalVndc = (params) => async (dispatch: AppDispatch) => {
  dispatch(actions.getStatWithdrawalVndcRequested());
  try {
    const res = await BitfarmAPI.GET_STAT_WITHDRAWAL_VNDC(params);
    dispatch(actions.getStatWithdrawalVndcSuccess(res));
  } catch (error) {
    dispatch(actions.getStatWithdrawalVndcFailed());
  }
};
