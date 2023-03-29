import { BrokerAPI } from 'apis/broker';
import * as actions from 'containers/Broker/duck/actions';
import { AppDispatch } from 'store';

export const getListBroker = (params: IMobileUserAccountRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListBrokerRequested());
  try {
    const res = await BrokerAPI.GET_LIST_BROKER(params);
    dispatch(actions.getListBrokerSuccess(res));
  } catch (error) {
    dispatch(actions.getListBrokerFailed());
  }
};

export const getListCurrency = (payload: { status: number }) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListCurrencyRequested());
  try {
    const res = await BrokerAPI.GET_LIST_CURRENCY(payload);
    dispatch(actions.getListCurrencySuccess(res));
  } catch (error) {
    dispatch(actions.getListCurrencyFailed());
  }
};
