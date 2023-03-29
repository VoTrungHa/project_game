import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  user: IInformationAfterLogin | null;
  token: string;
  isLoggedIn: boolean;
  expiresIn: number | null;
}

const initialState: IInitialState = {
  loading: false,
  user: null,
  token: '',
  isLoggedIn: false,
  expiresIn: null,
};

export const AuthReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.LOGIN_REQUESTED:
        draft.loading = true;
        break;
      case types.LOGIN_SUCCESS:
        const { token, expiresIn, role, email, fullName, id, phone, userName, avatar } = action.payload;
        draft.loading = false;
        draft.token = token;
        draft.user = {
          id,
          email,
          fullName,
          phone,
          role,
          userName,
          avatar,
        };
        draft.isLoggedIn = true;
        draft.expiresIn = expiresIn;
        break;
      case types.LOGIN_FAILED:
        draft.loading = false;
        break;
      case types.LOGOUT_REQUESTED:
        draft.loading = true;
        break;
      case types.LOGOUT_SUCCESS:
        return { ...initialState };
      default:
        return state;
    }
  });
