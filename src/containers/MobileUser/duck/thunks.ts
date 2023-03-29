import { MobileUserAPI } from 'apis/mobileuser';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/MobileUser/duck/actions';
import { AppDispatch } from 'store';

export const getListMobileUser = (params: IMobileUserAccountRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListMobileUserRequested());
  try {
    const res = await MobileUserAPI.GET_LIST_MOBILE_USER({
      ...params,
      size: DEFAULT_PAGE_SIZE,
      isPartner: false,
    });
    dispatch(actions.getListMobileUserSuccess(res));
  } catch (error) {
    dispatch(actions.getListMobileUserFailed());
  }
};
