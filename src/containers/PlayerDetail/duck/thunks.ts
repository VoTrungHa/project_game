import { BitfarmAPI } from 'apis/bitfarm';
import * as actions from 'containers/PlayerDetail/duck/actions';
import { AppDispatch } from 'store';

export const getBrokerTransaction = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(actions.getBrokerTransactionRequested());
  try {
    const res = await BitfarmAPI.GET_BROKER_TRANSACTION_BY_ID(id);
    if (res) {
      dispatch(actions.getBrokerTransactionSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getBrokerTransactionFailed());
  }
};

export const getListEgg = (params: IListEggByAccountResquest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListEggRequested());
  try {
    const res = await BitfarmAPI.GET_LIST_EGG_BY_ID(params);
    if (res) {
      dispatch(actions.getListEggSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getListEggFailed());
  }
};

export const getListChicken = (params: IListChickenByAccountRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListChickenRequested());
  try {
    const res = await BitfarmAPI.GET_LIST_CHICKEN_BY_ID(params);
    if (res) {
      dispatch(actions.getListChickenSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getListChickenFailed());
  }
};

export const getAccountTransaction = (params: IAccountTransactionRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getAccountTransactionRequested());
  try {
    const res = await BitfarmAPI.GET_ACCOUNT_TRANSACTION_DATA(params);
    if (res) {
      dispatch(actions.getAccountTransactionSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getAccountTransactionFailed());
  }
};
