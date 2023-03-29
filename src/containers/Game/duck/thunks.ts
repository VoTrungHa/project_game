import { GameAPI } from 'apis/game';
import * as actions from 'containers/Game/duck/actions';
import { AppDispatch } from 'store';

export const getListGame = (params?) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListGameRequested());
  try {
    const res = await GameAPI.GET_LIST_GAME(params);
    dispatch(actions.getListGameSuccess(res));
  } catch (error) {
    dispatch(actions.getListGameFailed());
  }
};
