import { BitfarmAPI } from 'apis/bitfarm';
import * as actions from 'containers/BitFarm/duck/actions';
import { AppDispatch } from 'store';

export const getChickenFarmStats = (params: IChickenFarmStatsResquest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getChickenFarmStatsRequested);
  try {
    const res = await BitfarmAPI.GET_CHICKEN_FARM_STATS(params);
    dispatch(actions.getChickenFarmStatsSuccess(res));
  } catch (error) {
    dispatch(actions.getChickenFarmStatsFailed());
  }
};

export const getAdultStats = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getAdultStatsRequested);
  try {
    const res = await BitfarmAPI.GET_CHICKEN_ADULTS_STATS();
    dispatch(actions.getAdultStatsSuccess(res));
  } catch (error) {
    dispatch(actions.getAdultStatsFailed());
  }
};
