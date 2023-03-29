import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  profile?: IFullProfile;
}

const initialState: IInitialState = {
  loading: false,
  profile: undefined,
};

export const ProfileReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_PROFILE_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_PROFILE_FAILED:
        draft.loading = false;
        draft.profile = undefined;
        break;
      case types.GET_PROFILE_SUCCESS:
        draft.loading = false;
        draft.profile = action.payload;
        break;
      default:
        return state;
    }
  });
