import * as types from './types';

export const getScheduleRequested = () => ({
  type: types.GET_SCHEDULE_REQUESTED,
});

export const getScheduleSuccess = (payload: IListSchedule) => ({
  type: types.GET_SCHEDULE_SUCCESS,
  payload,
});

export const getScheduleFailed = () => ({
  type: types.GET_SCHEDULE_FAILED,
});
