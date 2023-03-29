import produce from 'immer';
import * as types from './types';

interface IInitialState {
  chickenFarmStat: {
    data?: IChickenFarmStatsResponse;
    loading: boolean;
  };
  chickenAdultStat: {
    data?: IChickenAdultStatsResponse;
    loading: boolean;
  };
}

const initialCategoryMasterState: IInitialState = {
  chickenFarmStat: {
    loading: false,
    data: undefined,
  },
  chickenAdultStat: {
    loading: false,
    data: undefined,
  },
};

export const BitfarmReducer = (state = initialCategoryMasterState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_CHICKEN_FARM_STATS_REQUESTED:
        draft.chickenFarmStat.loading = true;
        break;
      case types.GET_CHICKEN_FARM_STATS_FAILED:
        draft.chickenFarmStat.loading = false;
        draft.chickenFarmStat.data = undefined;
        break;
      case types.GET_CHICKEN_FARM_STATS_SUCCESS:
        draft.chickenFarmStat.loading = false;
        draft.chickenFarmStat.data = action.payload;
        break;
      case types.GET_ADULT_STATS_REQUESTED:
        draft.chickenAdultStat.loading = true;
        break;
      case types.GET_ADULT_STATS_FAILED:
        draft.chickenAdultStat.loading = false;
        draft.chickenAdultStat.data = undefined;
        break;
      case types.GET_ADULT_STATS_SUCCESS:
        draft.chickenAdultStat.loading = false;
        draft.chickenAdultStat.data = action.payload;
        break;
      default:
        return state;
    }
  });
