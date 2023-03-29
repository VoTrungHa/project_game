import { BitfarmAPI } from 'apis/bitfarm';
import * as actions from 'containers/TransactionP2P/duck/actions';
import { AppDispatch } from 'store';

export const getListTransactionP2P = (params: ITransactionP2PResquest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListTransactionP2PRequested());
  try {
    const res = await BitfarmAPI.GET_LIST_TRANSACTION_P2P(params);
    dispatch(actions.getListTransactionP2PSuccess(res));
  } catch (error) {
    dispatch(actions.getListTransactionP2PFailed());
  }
};

export const getStatTransactionP2P = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getStatTransactionP2PRequested());
  try {
    const res = await BitfarmAPI.GET_STAT_TRANSACTION_P2P();
    dispatch(actions.getStatTransactionP2PSuccess(res));
  } catch (error) {
    dispatch(actions.getStatTransactionP2PFailed());
  }
};
