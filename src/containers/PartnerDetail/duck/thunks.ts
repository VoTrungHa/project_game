import { MobileUserAPI } from 'apis/mobileuser';
import { MobileUserDetailAPI } from 'apis/mobileuserdetail';
import { PartnerAPI } from 'apis/partner';
import * as actions from 'containers/PartnerDetail/duck/actions';
import { AppDispatch } from 'store';

export const getPartnerDetail = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await MobileUserAPI.GET_DETAIL_MOBILE_USER(id);
    if (res) {
      dispatch(actions.getPartnerDetailSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getPartnerDetailFailed());
  }
};

export const getCommissionPartner = (params: IGetCommissionPartnerRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getPartnerCommissionRequested());
  try {
    const res = await PartnerAPI.GET_COMMISSION_PARTNER(params);
    if (res) {
      dispatch(actions.getPartnerCommissionSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getPartnerCommissionFailed());
  }
};

export const getCashbackWallet = (params: ICashbackTransactionRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getCashbackWalletRequested());
  try {
    const res = await MobileUserDetailAPI.GET_CASHBACK_WALLET(params);
    if (res) {
      dispatch(actions.getCashbackWalletSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getCashbackWalletFailed());
  }
};

export const getCashbackTransaction = (params: ICashbackTransactionRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getCashbackTransactionRequested());
  try {
    const res = await MobileUserDetailAPI.GET_CASHBACK_TRANSACTION_BY_ID(params);
    if (res) {
      dispatch(actions.getCashbackTransactionSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getCashbackTransactionFailed());
  }
};

export const getNotification = (params: ICashbackTransactionRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getNotificationRequested());
  try {
    const res = await MobileUserDetailAPI.GET_NOTIFICATION_BY_ID(params);
    if (res) {
      dispatch(actions.getNotificationSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getNotificationFailed());
  }
};

export const getAccountReferred = (params: IAccountReferralRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getAccountReferredRequested());
  try {
    const res = await MobileUserDetailAPI.GET_ACCOUNTS_REFERRED_BY_ID(params);
    if (res) {
      dispatch(actions.getAccountReferredSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getAccountReferredFailed());
  }
};

export const getDailySpin = (params: ILuckySpinRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getDailySpinRequested());
  try {
    const res = await MobileUserDetailAPI.GET_DAILY_LUCKY_SPIN_BY_ID(params);
    if (res) {
      dispatch(actions.getDailySpinSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getDailySpinFailed());
  }
};

export const getWalletInfo = (params) => async (dispatch: AppDispatch) => {
  try {
    const res = await MobileUserDetailAPI.GET_WALLET_INFO(params);
    if (res) {
      dispatch(actions.getWalletInfoSuccess(res));
    }
  } catch (error) {
    dispatch(actions.getWalletInfoFailed());
  }
};
