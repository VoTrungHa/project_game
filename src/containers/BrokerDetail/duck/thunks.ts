import { BrokerAPI } from 'apis/broker';
import * as actions from 'containers/BrokerDetail/duck/actions';
import { AppDispatch } from 'store';

export const getBrokerDetail = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(actions.getBrokerDetailRequested());
  try {
    const res = await BrokerAPI.GET_DETAIL_BROKER(id);
    dispatch(actions.getBrokerDetailSuccess(res));
  } catch (error) {
    dispatch(actions.getBrokerDetailFailed());
  }
};

export const getBrokerTransaction = (param: IBrokerTransactionRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getBrokerTransactionRequested());
  try {
    const res = await BrokerAPI.GET_BROKER_TRANSACTION(param);
    dispatch(actions.getBrokerTransactionSuccess(res));
  } catch (error) {
    dispatch(actions.getBrokerTransactionFailed());
  }
};

export const getBrokerTransactionStat = (id: string, params: IBrokerTransactionRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getBrokerTransactionStatRequested());
  try {
    const res = await BrokerAPI.GET_BROKER_TRANSACTION_STAT(id, params);
    dispatch(actions.getBrokerTransactionStatSuccess(res));
  } catch (error) {
    dispatch(actions.getBrokerTransactionStatFailed());
  }
};
