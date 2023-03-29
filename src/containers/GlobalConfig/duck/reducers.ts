import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  data: ISystemConfig;
  configCommission?: IGetConfigCommission;
  rate?: IExchangeRate;
}

const initialState: IInitialState = {
  loading: false,
  data: [],
  configCommission: undefined,
  rate: undefined,
};

export const SystemConfigReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_SYSTEM_CONFIG_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_SYSTEM_CONFIG_FAILED:
        draft.loading = false;
        draft.data = [];
        draft.rate = undefined;
        break;
      case types.GET_SYSTEM_CONFIG_SUCCESS:
        draft.loading = false;
        draft.data = action.payload;
        break;
      case types.GET_CONFIG_COMMISSION_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_CONFIG_COMMISSION_SUCCESS:
        draft.loading = false;
        draft.configCommission = action.payload;
        break;
      case types.GET_CONFIG_COMMISSION_FAILED:
        draft.loading = false;
        draft.configCommission = undefined;
        break;
      case types.GET_EXCHANGE_RATE_SUCCESS:
        draft.rate = action.payload;
        break;
      default:
        return state;
    }
  });
