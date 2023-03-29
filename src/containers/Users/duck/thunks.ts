import { UserAPI } from 'apis/user';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/Users/duck/actions';
import { AppDispatch } from 'store';

export const getListUser = (params: IListUserRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListUserRequested());
  try {
    const res = await UserAPI.GET_LIST_USER({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getListUserSuccess(res));
  } catch (error) {
    dispatch(actions.getListUserFailed());
  }
};
