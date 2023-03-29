import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  brokerTransactionData?: IGetBrokerTransaction;
  listEgg?: IListEggByAccountResponse;
  listChicken?: IListChickenByAccountResponse;
  accountTransaction?: IAccountTransactionResponse;
}

const initialState: IInitialState = {
  loading: false,
  brokerTransactionData: undefined,
  listEgg: undefined,
  listChicken: undefined,
  accountTransaction: undefined,
};

export const PlayerDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_BROKER_TRANSACTION_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_BROKER_TRANSACTION_FAILED:
        draft.loading = false;
        draft.brokerTransactionData = undefined;
        break;
      case types.GET_BROKER_TRANSACTION_SUCCESS:
        draft.loading = false;
        draft.brokerTransactionData = action.payload;
        return draft;
      case types.GET_LIST_EGG_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_EGG_SUCCESS:
        draft.loading = false;
        draft.listEgg = action.payload;
        return draft;
      case types.GET_LIST_EGG_FAILED:
        draft.loading = false;
        draft.listEgg = undefined;
        break;
      case types.GET_LIST_CHICKEN_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_LIST_CHICKEN_SUCCESS:
        draft.loading = false;
        draft.listChicken = action.payload;
        return draft;
      case types.GET_LIST_CHICKEN_FAILED:
        draft.loading = false;
        draft.listChicken = undefined;
        break;
      case types.GET_ACCOUNT_TRANSACTION_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_ACCOUNT_TRANSACTION_SUCCESS:
        draft.loading = false;
        draft.accountTransaction = action.payload;
        return draft;
      case types.GET_ACCOUNT_TRANSACTION_FAILED:
        draft.loading = false;
        draft.accountTransaction = undefined;
        break;
      default:
        return state;
    }
  });
