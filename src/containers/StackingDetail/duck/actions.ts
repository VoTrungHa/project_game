import * as types from './types';

export const getStackingDetailRequested = () => ({
  type: types.GET_STACKING_DETAIL_REQUESTED,
});

export const getStackingDetailSuccess = (payload: IStatisticStackingItem) => ({ type: types.GET_STACKING_DETAIL_SUCCESS, payload });

export const getStackingDetailFailed = () => ({
  type: types.GET_STACKING_DETAIL_FAILED,
});

export const getStackingTableRequested = () => ({
  type: types.GET_STACKING_TABLE_REQUESTED,
});

export const getStackingTableSuccess = (payload: Array<IStackingItemTable>) => ({
  type: types.GET_STACKING_TABLE_SUCCESS,
  payload,
});

export const getStackingTableFailed = () => ({
  type: types.GET_STACKING_TABLE_FAILED,
});
