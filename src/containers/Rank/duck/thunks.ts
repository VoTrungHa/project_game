import { RankAPI } from 'apis/rank';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/Rank/duck/actions';
import { AppDispatch } from 'store';

export const getListRank = (params) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListRankRequested());
  try {
    const res = await RankAPI.GET_LIST_RANK({
      ...params,
      size: DEFAULT_PAGE_SIZE,
    });
    dispatch(actions.getListRankSuccess({ data: res?.data, totalRecords: res?.totalRecords, page: res?.page }));
  } catch (error) {
    dispatch(actions.getListRankFailed());
  }
};
