import { AnnouncementBitfarmAPI } from 'apis/announcementbitfarm';
import * as actions from 'containers/AnnouncementBitfarm/duck/actions';
import { AppDispatch } from 'store';

export const getAnnouncementBitfarm = (params: IAnnouncementBitfarmRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getAnnouncementBitfarmRequested());
  try {
    const res = await AnnouncementBitfarmAPI.GET_LIST(params);
    dispatch(actions.getAnnouncementBitfarmSuccess(res));
  } catch (error) {
    dispatch(actions.getAnnouncementBitfarmFailed());
  }
};
