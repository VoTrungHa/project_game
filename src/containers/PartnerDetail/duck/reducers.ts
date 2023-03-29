import produce from 'immer';
import * as types from './types';

interface IInitialState {
  loading: boolean;
  partnerInformation?: IMobileUserDetailResponse;
  commission?: IGetCommissionPartnerResponse;
  cashbackWallet?: ICashbackWalletResponse;
  cashbackTransaction?: ICashbackTransactionResponse;
  notifications?: INotificationResponse;
  accountReferred?: IAccountReferredByAccount;
  dailySpin?: IDailySpinInformationResponse;
  walletInfo?: IWalletInfoResponse;
}

const initialState: IInitialState = {
  loading: false,
  partnerInformation: undefined,
  commission: undefined,
  cashbackWallet: undefined,
  cashbackTransaction: undefined,
  notifications: undefined,
  accountReferred: undefined,
  dailySpin: undefined,
  walletInfo: undefined,
};

export const PartnerDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_PARTNER_DETAIL_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_PARTNER_DETAIL_FAILED:
        draft.loading = false;
        draft.partnerInformation = undefined;
        break;
      case types.GET_PARTNER_DETAIL_SUCCESS:
        draft.loading = false;
        draft.partnerInformation = action.payload;
        return draft;
      case types.GET_COMMISSION_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_COMMISSION_FAILED:
        draft.loading = false;
        draft.commission = undefined;
        break;
      case types.GET_COMMISSION_SUCCESS:
        draft.loading = false;
        draft.commission = action.payload;
        return draft;
      case types.GET_CASHBACK_WALLET_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_CASHBACK_WALLET_FAILED:
        draft.loading = false;
        draft.cashbackWallet = undefined;
        break;
      case types.GET_CASHBACK_WALLET_SUCCESS:
        draft.loading = false;
        draft.cashbackWallet = action.payload;
        return draft;
      case types.GET_CASHBACK_TRANSACTION_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_CASHBACK_TRANSACTION_SUCCESS:
        draft.loading = false;
        draft.cashbackTransaction = action.payload;
        return draft;
      case types.GET_CASHBACK_TRANSACTION_FAILED:
        draft.loading = false;
        draft.cashbackTransaction = undefined;
        break;
      case types.GET_NOTIFICATIONS_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_NOTIFICATIONS_SUCCESS:
        draft.loading = false;
        draft.notifications = action.payload;
        return draft;
      case types.GET_NOTIFICATIONS_FAILED:
        draft.loading = false;
        draft.notifications = undefined;
        break;
      case types.GET_ACCOUNT_REFERRED_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_ACCOUNT_REFERRED_SUCCESS:
        draft.loading = false;
        draft.accountReferred = action.payload;
        return draft;
      case types.GET_ACCOUNT_REFERRED_FAILED:
        draft.loading = false;
        draft.accountReferred = undefined;
        break;
      case types.GET_DAILY_SPIN_REQUESTED:
        draft.loading = true;
        break;
      case types.GET_DAILY_SPIN_SUCCESS:
        draft.loading = false;
        draft.dailySpin = action.payload;
        return draft;
      case types.GET_DAILY_SPIN_FAILED:
        draft.loading = false;
        draft.dailySpin = undefined;
        break;
      case types.GET_WALLET_INFO_SUCCESS:
        draft.walletInfo = action.payload;
        break;
      case types.GET_WALLET_INFO_FAILED:
        draft.walletInfo = undefined;
        break;
      default:
        return state;
    }
  });
