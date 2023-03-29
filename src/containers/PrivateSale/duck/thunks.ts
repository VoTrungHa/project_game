import { MobileUserAPI } from 'apis/mobileuser';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/PrivateSale/duck/actions';
import { AppDispatch } from 'store';

export const getList = (params) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListRequested());
  try {
    const res = await MobileUserAPI.GET_LIST_MOBILE_USER({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getListSuccess(res));
  } catch (error) {
    dispatch(actions.getListFailed());
  }
};
