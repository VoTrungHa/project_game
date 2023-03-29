import { SatoshiGameAPI } from 'apis/satoshigame';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/SatoshiGame/duck/actions';
import { AppDispatch } from 'store';


export const getAllEvent = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getEventRequested());
  try {
    const res = await SatoshiGameAPI.GET_ALL_EVENT();
    dispatch(actions.getEventSuccess(res));
  } catch (error) {
    dispatch(actions.getEventFailed());
  }
};

export const getStatisticGameAction = (params: IStatisticSatoshiGameRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getStatisticGameRequested());
  try {
    const res = await SatoshiGameAPI.GET_LIST_SATOSHI_GAME({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getStatisticGameSuccess(res));
  } catch (error) {
    dispatch(actions.getStatisticGameFailed());
  }
};
