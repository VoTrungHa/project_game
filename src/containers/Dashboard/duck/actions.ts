import * as types from './types';

export const getDashboardAccountTotalRequested = () => ({
  type: types.GET_DASHBOARD_ACCOUNT_TOTAL_REQUESTED,
});

export const getDashboardAccountTotalSuccess = (payload: ITotalAccounts) => ({
  type: types.GET_DASHBOARD_ACCOUNT_TOTAL_SUCCESS,
  payload,
});

export const getDashboardAccountTotalFailed = () => ({
  type: types.GET_DASHBOARD_ACCOUNT_TOTAL_FAILED,
});

export const getDashboardAccountRequested = () => ({
  type: types.GET_DASHBOARD_ACCOUNT_REQUESTED,
});

export const getDashboardAccountSuccess = (payload: IAccountDashboardChart) => ({
  type: types.GET_DASHBOARD_ACCOUNT_SUCCESS,
  payload,
});

export const getDashboardAccountFailed = () => ({
  type: types.GET_DASHBOARD_ACCOUNT_FAILED,
});

export const getCashbackTotalRequested = () => ({
  type: types.GET_CASHBACK_TOTAL_REQUESTED,
});

export const getCashbackTotalSuccess = (payload: ITotalCashback) => ({
  type: types.GET_CASHBACK_TOTAL_SUCCESS,
  payload,
});

export const getCashbackTotalFailed = () => ({
  type: types.GET_CASHBACK_TOTAL_FAILED,
});

export const getCashbackRequested = () => ({
  type: types.GET_CASHBACK_REQUESTED,
});

export const getCashbackSuccess = (payload: ICashbackDashboardResponse) => ({
  type: types.GET_CASHBACK_SUCCESS,
  payload,
});

export const getCashbackFailed = () => ({
  type: types.GET_CASHBACK_FAILED,
});

export const getAccountKycRequested = () => ({
  type: types.GET_ACCOUNT_KYC_REQUESTED,
});

export const getAccountKycSuccess = (payload: number) => ({
  type: types.GET_ACCOUNT_KYC_SUCCESS,
  payload,
});

export const getAccountKycFailed = () => ({
  type: types.GET_ACCOUNT_NON_KYC_FAILED,
});

export const getAccountNonKycRequested = () => ({
  type: types.GET_ACCOUNT_NON_KYC_REQUESTED,
});

export const getAccountNonKycSuccess = (payload: number) => ({
  type: types.GET_ACCOUNT_NON_KYC_SUCCESS,
  payload,
});

export const getAccountNonKycFailed = () => ({
  type: types.GET_ACCOUNT_NON_KYC_FAILED,
});

export const getTotalReferralAmountKycRequested = () => ({
  type: types.GET_TOTAL_REFERRAL_AMOUNT_KYC_REQUESTED,
});

export const getTotalReferralAmountKycSuccess = (payload: number) => ({
  type: types.GET_TOTAL_REFERRAL_AMOUNT_KYC_SUCCESS,
  payload,
});

export const getTotalReferralAmountKycFailed = () => ({
  type: types.GET_TOTAL_REFERRAL_AMOUNT_KYC_FAILED,
});

export const getTotalReferralAmountNonKycRequested = () => ({
  type: types.GET_TOTAL_REFERRAL_AMOUNT_NON_KYC_REQUESTED,
});

export const getTotalReferralAmountNonKycSuccess = (payload: number) => ({
  type: types.GET_TOTAL_REFERRAL_AMOUNT_NON_KYC_SUCCESS,
  payload,
});

export const getTotalReferralAmountNonKycFailed = () => ({
  type: types.GET_TOTAL_REFERRAL_AMOUNT_NON_KYC_FAILED,
});

export const getTotalAccountVNDCRequested = () => ({
  type: types.GET_TOTAL_ACCOUNT_VNDC_REQUESTED,
});

export const getTotalAccountVNDCSuccess = (payload: number) => ({
  type: types.GET_TOTAL_ACCOUNT_VNDC_SUCCESS,
  payload,
});

export const getTotalAccountVNDCFailed = () => ({
  type: types.GET_TOTAL_ACCOUNT_VNDC_FAILED,
});

export const getAccountHavePhoneRequested = () => ({
  type: types.GET_ACCOUNT_HAVE_PHONE_REQUESTED,
});

export const getAccountHavePhoneSuccess = (payload: number) => ({
  type: types.GET_ACCOUNT_HAVE_PHONE_SUCCESS,
  payload,
});

export const getAccountHavePhoneFailed = () => ({
  type: types.GET_ACCOUNT_HAVE_PHONE_FAILED,
});

export const getCashbackSummaryRequested = () => ({
  type: types.GET_CASHBACK_SUMMARY_REQUESTED,
});

export const getCashbackSummarySuccess = (payload: ICashbackSummary) => ({
  type: types.GET_CASHBACK_SUMMARY_SUCCESS,
  payload,
});

export const getCashbackSummaryFailed = () => ({
  type: types.GET_CASHBACK_SUMMARY_FAILED,
});

export const getBuySatoshiTotalRequested = () => ({
  type: types.GET_BUY_SATOSHI_TOTAL_REQUESTED,
});

export const getBuySatoshiTotalSuccess = (payload: number) => ({
  type: types.GET_BUY_SATOSHI_TOTAL_SUCCESS,
  payload,
});

export const getBuySatoshiTotalFailed = () => ({
  type: types.GET_BUY_SATOSHI_TOTAL_FAILED,
});

export const getBuySatoshiRequested = () => ({
  type: types.GET_BUY_SATOSHI_REQUESTED,
});

export const getBuySatoshiSuccess = (payload) => ({
  type: types.GET_BUY_SATOSHI_SUCCESS,
  payload,
});

export const getBuySatoshiFailed = () => ({
  type: types.GET_BUY_SATOSHI_FAILED,
});

export const getWithdrawSatoshiRequested = () => ({
  type: types.GET_WITHDRAW_SATOSHI_REQUESTED,
});

export const getWithdrawSatoshiSuccess = (payload) => ({
  type: types.GET_WITHDRAW_SATOSHI_SUCCESS,
  payload,
});

export const getWithdrawSatoshiFailed = () => ({
  type: types.GET_WITHDRAW_SATOSHI_FAILED,
});

export const getCashbackAvailablePeriodRequested = () => ({
  type: types.GET_CASHBACK_AVAILABLE_PERIOD_REQUESTED,
});

export const getCashbackAvailablePeriodSuccess = (payload) => ({
  type: types.GET_CASHBACK_AVAILABLE_PERIOD_SUCCESS,
  payload,
});

export const getCashbackAvailablePeriodFailed = () => ({
  type: types.GET_CASHBACK_AVAILABLE_PERIOD_FAILED,
});
