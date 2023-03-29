import { AuthAPI } from 'apis/auth';
import * as actions from 'containers/Auth/duck/actions';
import storage from 'helpers/localStorage';
import { AppDispatch, AppThunk } from 'store';
import { FormValue } from '../Login';

export const loginUser =
  (payload: FormValue): AppThunk<Promise<ILoginResponse | ILoginErrorReponse>> =>
  async (dispatch: AppDispatch) => {
    dispatch(actions.loginRequested());
    try {
      const res = await AuthAPI.LOGIN(payload);
      const { token } = res;
      storage.setAccessToken(token);
      dispatch(actions.loginSuccess(res));
    } catch (error) {
      dispatch(actions.loginFailed());
      return error.response;
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  storage.removeAccessToken();
  dispatch(actions.logoutSuccess());
};
