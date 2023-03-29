import * as types from './types';

export const getAnnouncementBitfarmRequested = () => ({
  type: types.GET_ANNOUNCEMENT_BITFARM_REQUESTED,
});

export const getAnnouncementBitfarmSuccess = (payload: IAnnouncementBitfarmResponse) => ({
  type: types.GET_ANNOUNCEMENT_BITFARM_SUCCESS,
  payload,
});

export const getAnnouncementBitfarmFailed = () => ({
  type: types.GET_ANNOUNCEMENT_BITFARM_FAILED,
});
