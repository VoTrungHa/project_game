import { SystemConfigAPI } from 'apis/systemconfig';
import * as actions from 'containers/GlobalConfig/duck/actions';
import { AppDispatch } from 'store';

export const getSystemConfig = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getSystemConfigRequested());
  try {
    const res = await SystemConfigAPI.GET_SYSTEM_CONFIG();
    dispatch(actions.getSystemConfigSuccess(res));
  } catch (error) {
    dispatch(actions.getSystemConfigFailed());
  }
};

export const getConfigCommission = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getConfigCommissionRequested());
  try {
    const res = await SystemConfigAPI.GET_CONFIG_COMMISSION();
    dispatch(actions.getConfigCommissionSuccess(res));
  } catch (error) {
    dispatch(actions.getSystemConfigFailed());
  }
};

export const getExchangeRate = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getExchangeRateRequested());
  try {
    const res = await SystemConfigAPI.GET_EXCHANGE_RATE();
    dispatch(actions.getExchangeRateSuccess(res));
  } catch (error) {
    dispatch(actions.getExchangeRateFailed());
  }
};
