import produce from 'immer';
import * as types from './types';

interface IInitialState extends IAnnouncementBitfarmResponse {
  loading: boolean;
}

const initialState: IInitialState = {
  page: 0,
  totalRecords: 0,
  data: [],
  loading: false,
};

export const AnnouncementBitfarmReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_ANNOUNCEMENT_BITFARM_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_ANNOUNCEMENT_BITFARM_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_ANNOUNCEMENT_BITFARM_SUCCESS:
        return { ...action.payload, loading: false };
      default:
        return state;
    }
  });
