import { KycAPI } from 'apis/kyc';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/Kyc/duck/actions';
import { AppDispatch } from 'store';

export const getListKyc = (params: IListKycRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListKycRequested());
  try {
    const res = await KycAPI.GET_LIST_KYC({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getListKycSuccess(res));
  } catch (error) {
    dispatch(actions.getListUserFailed());
  }
};
