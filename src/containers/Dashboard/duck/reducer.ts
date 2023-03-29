import produce from 'immer';
import * as types from './types';

interface IInitialState {
  totalAccounts: {
    loading: boolean;
    data?: ITotalAccounts;
  };
  accounts: {
    loading: boolean;
    data: IAccountDashboardChart;
  };
  totalCashback: {
    loading: boolean;
    data?: ITotalCashback;
  };
  cashback: {
    loading: boolean;
    data: ICashbackDashboardResponse;
  };
  accountKyc: {
    loading: boolean;
    data?: number;
  };
  accountNonKyc: {
    loading: boolean;
    data?: number;
  };
  totalAmountReferralKyc: {
    loading: boolean;
    data?: number;
  };
  totalAmountReferralNonKyc: {
    loading: boolean;
    data?: number;
  };
  totalAccountVNDC: {
    loading: boolean;
    data?: number;
  };
  totalAccountHavePhone: {
    loading: boolean;
    data?: number;
  };
  cashbackSummary: {
    loading: boolean;
    data?: ICashbackSummary;
  };
  buySatoshiTotal: {
    loading: boolean;
    data?: number;
  };
  buySatoshi: {
    loading: boolean;
    data: IBuySatoshi;
  };
  withdrawSatoshi: {
    loading: boolean;
    data: IBuySatoshi;
  };
  cashbackAvailablePeriod: {
    loading: boolean;
    fromCashbackAvailable: number | null;
    toCashbackAvailable: number | null;
  }
}

const initialState: IInitialState = {
  totalAccounts: {
    loading: false,
    data: undefined,
  },
  accounts: {
    loading: false,
    data: [],
  },
  totalCashback: {
    loading: false,
    data: undefined,
  },
  cashback: {
    loading: false,
    data: [],
  },
  accountKyc: {
    loading: false,
    data: undefined,
  },
  accountNonKyc: {
    loading: false,
    data: undefined,
  },
  totalAmountReferralKyc: {
    loading: false,
    data: undefined,
  },
  totalAmountReferralNonKyc: {
    loading: false,
    data: undefined,
  },
  totalAccountVNDC: {
    loading: false,
    data: undefined,
  },
  totalAccountHavePhone: {
    loading: false,
    data: undefined,
  },
  cashbackSummary: {
    loading: false,
    data: undefined,
  },
  buySatoshiTotal: {
    loading: false,
    data: undefined,
  },
  buySatoshi: {
    loading: false,
    data: [],
  },
  withdrawSatoshi: {
    loading: false,
    data: [],
  },
  cashbackAvailablePeriod: {
    loading: false,
    fromCashbackAvailable: 0,
    toCashbackAvailable: 0
  }
};

export const DashboardReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_DASHBOARD_ACCOUNT_TOTAL_REQUESTED:
        draft.totalAccounts.loading = true;
        break;
      case types.GET_DASHBOARD_ACCOUNT_TOTAL_FAILED:
        draft.totalAccounts.loading = false;
        draft.totalAccounts.data = undefined;
        break;
      case types.GET_DASHBOARD_ACCOUNT_TOTAL_SUCCESS:
        draft.totalAccounts.loading = false;
        draft.totalAccounts.data = action.payload;
        break;
      case types.GET_CASHBACK_TOTAL_REQUESTED:
        draft.totalCashback.loading = true;
        break;
      case types.GET_CASHBACK_TOTAL_FAILED:
        draft.totalCashback.loading = false;
        draft.totalCashback.data = undefined;
        break;
      case types.GET_CASHBACK_TOTAL_SUCCESS:
        draft.totalCashback.loading = false;
        draft.totalCashback.data = action.payload;
        break;
      case types.GET_DASHBOARD_ACCOUNT_REQUESTED:
        draft.accounts.loading = true;
        break;
      case types.GET_DASHBOARD_ACCOUNT_FAILED:
        draft.accounts.loading = false;
        draft.accounts.data = [];
        break;
      case types.GET_DASHBOARD_ACCOUNT_SUCCESS:
        draft.accounts.loading = false;
        draft.accounts.data = action.payload;
        break;
      case types.GET_CASHBACK_REQUESTED:
        draft.cashback.loading = true;
        break;
      case types.GET_CASHBACK_FAILED:
        draft.cashback.loading = false;
        draft.cashback.data = [];
        break;
      case types.GET_CASHBACK_SUCCESS:
        draft.cashback.loading = false;
        draft.cashback.data = [];
        // TODO: update later
        // draft.cashback.data = action.payload;
        break;
      case types.GET_ACCOUNT_KYC_REQUESTED:
        draft.accountKyc.loading = true;
        break;
      case types.GET_ACCOUNT_KYC_FAILED:
        draft.accountKyc.loading = false;
        draft.accountKyc.data = undefined;
        break;
      case types.GET_ACCOUNT_KYC_SUCCESS:
        draft.accountKyc.loading = false;
        draft.accountKyc.data = action.payload;
        break;
      case types.GET_ACCOUNT_NON_KYC_REQUESTED:
        draft.accountNonKyc.loading = true;
        break;
      case types.GET_ACCOUNT_NON_KYC_FAILED:
        draft.accountNonKyc.loading = false;
        draft.accountNonKyc.data = undefined;
        break;
      case types.GET_ACCOUNT_NON_KYC_SUCCESS:
        draft.accountNonKyc.loading = false;
        draft.accountNonKyc.data = action.payload;
        break;
      case types.GET_TOTAL_REFERRAL_AMOUNT_KYC_REQUESTED:
        draft.totalAmountReferralKyc.loading = true;
        break;
      case types.GET_TOTAL_REFERRAL_AMOUNT_KYC_FAILED:
        draft.totalAmountReferralKyc.loading = false;
        draft.totalAmountReferralKyc.data = undefined;
        break;
      case types.GET_TOTAL_REFERRAL_AMOUNT_KYC_SUCCESS:
        draft.totalAmountReferralKyc.loading = false;
        draft.totalAmountReferralKyc.data = action.payload;
        break;
      case types.GET_TOTAL_REFERRAL_AMOUNT_NON_KYC_REQUESTED:
        draft.totalAmountReferralNonKyc.loading = true;
        break;
      case types.GET_TOTAL_REFERRAL_AMOUNT_NON_KYC_FAILED:
        draft.totalAmountReferralNonKyc.loading = false;
        draft.totalAmountReferralNonKyc.data = undefined;
        break;
      case types.GET_TOTAL_REFERRAL_AMOUNT_NON_KYC_SUCCESS:
        draft.totalAmountReferralNonKyc.loading = false;
        draft.totalAmountReferralNonKyc.data = action.payload;
        break;
      case types.GET_TOTAL_ACCOUNT_VNDC_REQUESTED:
        draft.totalAccountVNDC.loading = true;
        break;
      case types.GET_TOTAL_ACCOUNT_VNDC_FAILED:
        draft.totalAccountVNDC.loading = false;
        draft.totalAccountVNDC.data = undefined;
        break;
      case types.GET_TOTAL_ACCOUNT_VNDC_SUCCESS:
        draft.totalAccountVNDC.loading = false;
        draft.totalAccountVNDC.data = action.payload;
        break;
      case types.GET_ACCOUNT_HAVE_PHONE_REQUESTED:
        draft.totalAccountHavePhone.loading = true;
        break;
      case types.GET_ACCOUNT_HAVE_PHONE_FAILED:
        draft.totalAccountHavePhone.loading = false;
        draft.totalAccountHavePhone.data = undefined;
        break;
      case types.GET_ACCOUNT_HAVE_PHONE_SUCCESS:
        draft.totalAccountHavePhone.loading = false;
        draft.totalAccountHavePhone.data = action.payload;
        break;
      case types.GET_CASHBACK_SUMMARY_REQUESTED:
        draft.cashbackSummary.loading = true;
        break;
      case types.GET_CASHBACK_SUMMARY_FAILED:
        draft.cashbackSummary.loading = false;
        draft.cashbackSummary.data = undefined;
        break;
      case types.GET_CASHBACK_SUMMARY_SUCCESS:
        draft.cashbackSummary.loading = false;
        draft.cashbackSummary.data = action.payload;
        break;
      case types.GET_BUY_SATOSHI_TOTAL_REQUESTED:
        draft.buySatoshiTotal.loading = true;
        break;
      case types.GET_BUY_SATOSHI_TOTAL_FAILED:
        draft.buySatoshiTotal.loading = false;
        draft.buySatoshiTotal.data = undefined;
        break;
      case types.GET_BUY_SATOSHI_TOTAL_SUCCESS:
        draft.buySatoshiTotal.loading = false;
        draft.buySatoshiTotal.data = action.payload;
        break;
      case types.GET_BUY_SATOSHI_REQUESTED:
        draft.buySatoshi.loading = true;
        break;
      case types.GET_BUY_SATOSHI_FAILED:
        draft.buySatoshi.loading = false;
        draft.buySatoshi.data = [];
        break;
      case types.GET_BUY_SATOSHI_SUCCESS:
        draft.buySatoshi.loading = false;
        draft.buySatoshi.data = action.payload;
        break;
      case types.GET_WITHDRAW_SATOSHI_REQUESTED:
        draft.withdrawSatoshi.loading = true;
        break;
      case types.GET_WITHDRAW_SATOSHI_FAILED:
        draft.withdrawSatoshi.loading = false;
        draft.withdrawSatoshi.data = [];
        break;
      case types.GET_WITHDRAW_SATOSHI_SUCCESS:
        draft.withdrawSatoshi.loading = false;
        draft.withdrawSatoshi.data = action.payload;
        break;
      case types.GET_CASHBACK_AVAILABLE_PERIOD_REQUESTED:
        draft.cashbackAvailablePeriod.loading = true;
        break;
      case types.GET_CASHBACK_AVAILABLE_PERIOD_FAILED:
        draft.cashbackAvailablePeriod.loading = false;
        draft.cashbackAvailablePeriod.fromCashbackAvailable = null;
        draft.cashbackAvailablePeriod.toCashbackAvailable = null;
        break;
      case types.GET_CASHBACK_AVAILABLE_PERIOD_SUCCESS:
        draft.cashbackAvailablePeriod.loading = false;
        draft.cashbackAvailablePeriod.fromCashbackAvailable = action.payload.fromCashbackAvailable;
        draft.cashbackAvailablePeriod.toCashbackAvailable = action.payload.toCashbackAvailable;
        break;
      default:
        return state;
    }
  });
