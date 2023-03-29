import { RankAPI } from 'apis/rank';
import * as actions from 'containers/RankDetail/duck/actions';
import { AppDispatch } from 'store';

export const getRankDetail = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(actions.getRankDetailRequested());
  try {
    const res = await RankAPI.GET_DETAIL_BY_ID(id);
    dispatch(actions.getRankDetailSuccess(res));
  } catch (error) {
    dispatch(actions.getRankDetailFailed());
  }
};

export const getRankTable = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(actions.getRankTableRequested());
  try {
    const res = await RankAPI.GET_ACCOUNTs(id);
    dispatch(actions.getRankTableSuccess(res));
  } catch (error) {
    dispatch(actions.getRankTableFailed());
  }
};
