import produce from 'immer';
import * as types from './types';

interface IInitialCategoryMasterState {
  loading: boolean;
  data: ICategoryMasterResponse;
}

const initialCategoryMasterState: IInitialCategoryMasterState = {
  loading: false,
  data: [],
};

export const CategoryMasterReducer = (state = initialCategoryMasterState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_CATEGORY_MASTER_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_CATEGORY_MASTER_FAILED:
        draft.loading = false;
        draft.data = [];
        break;
      case types.GET_CATEGORY_MASTER_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        break;
      default:
        return state;
    }
  });

interface IInitialCampaignState extends IListCampaignResponse {
  loading: boolean;
}

const initialCampaignState: IInitialCampaignState = {
  page: undefined,
  totalRecords: undefined,
  data: [],
  loading: false,
};

export const CampaignReducer = (state = initialCampaignState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_CAMPAIGN_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_CAMPAIGN_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.page = undefined;
        draft.totalRecords = undefined;
        break;
      case types.GET_LIST_CAMPAIGN_SUCCESS:
        return { ...action.payload, loading: false };
      default:
        return state;
    }
  });
