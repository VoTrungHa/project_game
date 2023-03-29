import { BitfarmAPI } from 'apis/bitfarm';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/DepositSatoshiDetail/duck/actions';
import { AppDispatch } from 'store';

export const getListDepositSatoshiDetail = (params: IListBuySatoshiRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListDepositSatoshiRequested());
  try {
    const res = await BitfarmAPI.GET_LIST_BUY_SATOSHI({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });

    dispatch(actions.getListDepositSatoshiSuccess(res));
  } catch (error) {
    dispatch(actions.getListDepositSatoshiRequested());
  }
};

export const getStatDepositSatoshiDetail = (params) => async (dispatch: AppDispatch) => {
  dispatch(actions.getStatDepositSatoshiRequested());
  try {
    const res = await BitfarmAPI.GET_STAT_DEPOSIT_SATOSHI(params);
    dispatch(actions.getStatDepositSatoshiSuccess(res));
  } catch (error) {
    dispatch(actions.getStatDepositSatoshiFailed());
  }
};
