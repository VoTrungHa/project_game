import { BitfarmAPI } from 'apis/bitfarm';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/PlayerList/duck/actions';
import { AppDispatch } from 'store';

export const getListPlayer = (params: IPlayerListRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListPlayerRequested());
  try {
    const res = await BitfarmAPI.GET_LIST_PLAYER({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getListPlayerSuccess(res));
  } catch (error) {
    dispatch(actions.getListPlayerFailed());
  }
};

export const getListPlayerStat = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getListPlayerStatRequested());
  try {
    const res = await BitfarmAPI.GET_LIST_PLAYER_STAT();
    dispatch(actions.getListPlayerStatSuccess(res));
  } catch (error) {
    dispatch(actions.getListPlayerStatFailed());
  }
};
