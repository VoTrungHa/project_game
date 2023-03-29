import { AuthAPI } from 'apis/auth';
import * as actions from 'containers/Profile/duck/actions';
import { AppDispatch } from 'store';

export const getProfile = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getProfileRequested());
  try {
    const res = await AuthAPI.GET_PROFILE();
    if (res.id) {
      dispatch(actions.getProfleSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getProfleFailed());
  }
};
