import * as types from './types';

export const getPartnerDetailRequested = () => ({
  type: types.GET_PARTNER_DETAIL_REQUESTED,
});

export const getPartnerDetailSuccess = (payload: IMobileUserDetailResponse) => ({
  type: types.GET_PARTNER_DETAIL_SUCCESS,
  payload,
});

export const getPartnerDetailFailed = () => ({
  type: types.GET_PARTNER_DETAIL_FAILED,
});

export const getPartnerCommissionRequested = () => ({
  type: types.GET_COMMISSION_REQUESTED,
});

export const getPartnerCommissionSuccess = (payload: IGetCommissionPartnerResponse) => ({
  type: types.GET_COMMISSION_SUCCESS,
  payload,
});

export const getPartnerCommissionFailed = () => ({
  type: types.GET_COMMISSION_FAILED,
});

export const getCashbackWalletRequested = () => ({
  type: types.GET_CASHBACK_WALLET_REQUESTED,
});

export const getCashbackWalletSuccess = (payload: ICashbackWalletResponse) => ({
  type: types.GET_CASHBACK_WALLET_SUCCESS,
  payload,
});

export const getCashbackWalletFailed = () => ({
  type: types.GET_CASHBACK_WALLET_FAILED,
});

export const getCashbackTransactionRequested = () => ({
  type: types.GET_CASHBACK_TRANSACTION_REQUESTED,
});

export const getCashbackTransactionSuccess = (payload: ICashbackTransactionResponse) => ({
  type: types.GET_CASHBACK_TRANSACTION_SUCCESS,
  payload,
});

export const getCashbackTransactionFailed = () => ({
  type: types.GET_CASHBACK_TRANSACTION_FAILED,
});

export const getNotificationRequested = () => ({
  type: types.GET_NOTIFICATIONS_REQUESTED,
});

export const getNotificationSuccess = (payload: INotificationResponse) => ({
  type: types.GET_NOTIFICATIONS_SUCCESS,
  payload,
});

export const getNotificationFailed = () => ({
  type: types.GET_NOTIFICATIONS_FAILED,
});

export const getAccountReferredRequested = () => ({
  type: types.GET_ACCOUNT_REFERRED_REQUESTED,
});

export const getAccountReferredSuccess = (payload: IAccountReferredByAccount) => ({
  type: types.GET_ACCOUNT_REFERRED_SUCCESS,
  payload,
});

export const getAccountReferredFailed = () => ({
  type: types.GET_ACCOUNT_REFERRED_FAILED,
});

export const getDailySpinRequested = () => ({
  type: types.GET_DAILY_SPIN_REQUESTED,
});

export const getDailySpinSuccess = (payload: IDailySpinInformationResponse) => ({
  type: types.GET_DAILY_SPIN_SUCCESS,
  payload,
});

export const getDailySpinFailed = () => ({
  type: types.GET_DAILY_SPIN_FAILED,
});

export const getWalletInfoRequested = () => ({
  type: types.GET_WALLET_INFO_REQUESTED,
});

export const getWalletInfoSuccess = (payload: IWalletInfoResponse) => ({
  type: types.GET_WALLET_INFO_SUCCESS,
  payload,
});

export const getWalletInfoFailed = () => ({
  type: types.GET_WALLET_INFO_FAILED,
});
