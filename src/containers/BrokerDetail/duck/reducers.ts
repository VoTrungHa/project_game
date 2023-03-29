import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  brokerDetailInformation?: IBrokerItem;
  brokerTransaction?: IBrokerTransactionResponse;
  brokerTransactionStat?: IBrokerDetailTransactionStat;
}

const initialState: IInitialState = {
  loading: false,
  brokerDetailInformation: undefined,
  brokerTransaction: undefined,
  brokerTransactionStat: undefined,
};

export const BrokerDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_BROKER_DETAIL_REQUESTED:
      case types.GET_BROKER_TRANSACTION_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_BROKER_DETAIL_FAILED:
        draft.loading = false;
        draft.brokerDetailInformation = undefined;
        break;
      case types.GET_BROKER_DETAIL_SUCCESS:
        draft.loading = false;
        draft.brokerDetailInformation = action.payload;
        break;
      case types.GET_BROKER_TRANSACTION_FAILED:
        draft.loading = false;
        draft.brokerTransaction = undefined;
        break;
      case types.GET_BROKER_TRANSACTION_SUCCESS:
        draft.loading = false;
        draft.brokerTransaction = action.payload;
        break;
      case types.GET_BROKER_TRANSACTION_STAT_FAILED:
        draft.brokerTransactionStat = undefined;
        break;
      case types.GET_BROKER_TRANSACTION_STAT_SUCCESS:
        draft.brokerTransactionStat = action.payload;
        break;
      default:
        return state;
    }
  });
