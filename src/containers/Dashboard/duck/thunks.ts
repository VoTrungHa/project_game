import { DashboardAPI } from 'apis/dashboard';
import * as actions from 'containers/Dashboard/duck/actions';
import { AppDispatch } from 'store';

export const getDashboardAccountTotal = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getDashboardAccountTotalRequested());
  try {
    const res = await DashboardAPI.GET_DASHBOARD_ACCOUNT_TOTAL();
    dispatch(actions.getDashboardAccountTotalSuccess(res));
  } catch (error) {
    dispatch(actions.getDashboardAccountTotalFailed());
  }
};

export const getDashboardCashbackTotal = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getCashbackTotalRequested());
  try {
    const res = await DashboardAPI.GET_CASHBACK_TOTAL();
    dispatch(actions.getCashbackTotalSuccess(res));
  } catch (error) {
    dispatch(actions.getCashbackTotalFailed());
  }
};

export const getDashboardAccount = (params: IDashboardAccountRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getDashboardAccountRequested());
  try {
    const res = await DashboardAPI.GET_DASHBOARD_ACCOUNT(params);
    dispatch(actions.getDashboardAccountSuccess(res));
  } catch (error) {
    dispatch(actions.getDashboardAccountFailed());
  }
};

export const getDashboardCashback = (params: ICashbackDashboardParam) => async (dispatch: AppDispatch) => {
  dispatch(actions.getCashbackRequested());
  try {
    const res = await DashboardAPI.GET_CASHBACK(params);
    dispatch(actions.getCashbackSuccess(res));
  } catch (error) {
    dispatch(actions.getCashbackFailed());
  }
};

export const getAccountKyc = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getAccountKycRequested());
  try {
    const res = await DashboardAPI.GET_ACCOUNT(true);
    dispatch(actions.getAccountKycSuccess(res.totalAccounts));
  } catch (error) {
    dispatch(actions.getAccountKycFailed());
  }
};

export const getAccountNonKyc = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getAccountNonKycRequested());
  try {
    const res = await DashboardAPI.GET_ACCOUNT(false);
    dispatch(actions.getAccountNonKycSuccess(res.totalAccounts));
  } catch (error) {
    dispatch(actions.getAccountNonKycFailed());
  }
};

export const getTotalReferralAmountKyc = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getTotalReferralAmountKycRequested());
  try {
    const res = await DashboardAPI.GET_TOTAL_REFERRAL_AMOUNT(true);
    dispatch(actions.getTotalReferralAmountKycSuccess(res.totalAmounts));
  } catch (error) {
    dispatch(actions.getTotalReferralAmountKycFailed());
  }
};

export const getTotalReferralAmountNonKyc = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getTotalReferralAmountNonKycRequested());
  try {
    const res = await DashboardAPI.GET_TOTAL_REFERRAL_AMOUNT(false);
    dispatch(actions.getTotalReferralAmountNonKycSuccess(res.totalAmounts));
  } catch (error) {
    dispatch(actions.getTotalReferralAmountNonKycFailed());
  }
};

export const getTotalAccountVNDC = (param: number) => async (dispatch: AppDispatch) => {
  dispatch(actions.getTotalAccountVNDCRequested());
  try {
    const res = await DashboardAPI.GET_TOTAL_ACCOUNT_VNDC(param);
    dispatch(actions.getTotalAccountVNDCSuccess(res.totalAccounts));
  } catch (error) {
    dispatch(actions.getTotalAccountVNDCFailed());
  }
};

export const getTotalAccountHavePhone = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getAccountHavePhoneRequested());
  try {
    const res = await DashboardAPI.GET_ACCOUNT_HAVE_PHONE();
    dispatch(actions.getAccountHavePhoneSuccess(res.totalAccounts));
  } catch (error) {
    dispatch(actions.getAccountHavePhoneFailed());
  }
};

export const getCashbackSummary = () => async (dispatch: AppDispatch) => {
  dispatch(actions.getCashbackSummaryRequested());
  try {
    const res = await DashboardAPI.GET_CASHBACK_SUMMARY();
    dispatch(actions.getCashbackSummarySuccess(res));
  } catch (error) {
    dispatch(actions.getCashbackSummaryFailed());
  }
};

export const getBuySatoshiTotal = (timeUnit: number) => async (dispatch: AppDispatch) => {
  dispatch(actions.getBuySatoshiTotalRequested());
  try {
    const res = await DashboardAPI.GET_BUY_SATOSHI_TOTAL(timeUnit);
    dispatch(actions.getBuySatoshiTotalSuccess(res.totalAmount));
  } catch (error) {
    dispatch(actions.getBuySatoshiTotalFailed());
  }
};

// TODO: Temporary dummy data
const dummyBuySatoshiResponse = [
  {
    amount: 93200,
    day: '01/11/2021',
  },
  {
    amount: 257284,
    day: '02/11/2021',
  },
  {
    amount: 90000,
    day: '03/11/2021',
  },
  {
    amount: 4064466,
    day: '04/11/2021',
  },
  {
    amount: 461761,
    day: '07/11/2021',
  },
  {
    amount: 73200,
    day: '08/11/2021',
  },
  {
    amount: 57284,
    day: '09/11/2021',
  },
  {
    amount: 70000,
    day: '10/11/2021',
  },
  {
    amount: 4064466,
    day: '11/11/2021',
  },
  {
    amount: 461761,
    day: '12/11/2021',
  },
  {
    amount: 60000,
    day: '15/11/2021',
  },
  {
    amount: 500000,
    day: '16/11/2021',
  },

  {
    amount: 77829,
    day: '17/11/2021',
  },
  {
    amount: 382407,
    day: '18/11/2021',
  },
  {
    amount: 70000,
    day: '19/11/2021',
  },
  {
    amount: 64466,
    day: '20/11/2021',
  },
  {
    amount: 461761,
    day: '21/11/2021',
  },
];

export const getBuySatoshi = (params: IBuyAndWithdrawRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getBuySatoshiRequested());
  try {
    const res = await DashboardAPI.GET_BUY_SATOSHI(params);
    dispatch(
      // TODO: Uncomment later
      // actions.getBuySatoshiSuccess(
      //   res.map((item) => ({
      //     ...item,
      //     day: moment(item.day).format('DD/MM/YYYY'),
      //   })),
      // ),
      actions.getBuySatoshiSuccess(dummyBuySatoshiResponse),
    );
  } catch (error) {
    dispatch(actions.getBuySatoshiFailed());
  }
};

// TODO: Temporary dummy data
const dummyWithdrawSatoshiResponse = [
  {
    amount: 300000,
    day: '02/11/2021',
  },
  {
    amount: 100000,
    day: '03/11/2021',
  },

  {
    amount: 1077829,
    day: '05/11/2021',
  },
  {
    amount: 282407,
    day: '06/11/2021',
  },
  {
    amount: 300000,
    day: '07/11/2021',
  },
  {
    amount: 100000,
    day: '08/11/2021',
  },

  {
    amount: 77829,
    day: '09/11/2021',
  },
  {
    amount: 282407,
    day: '10/11/2021',
  },
  {
    amount: 300000,
    day: '11/11/2021',
  },
  {
    amount: 10000,
    day: '12/11/2021',
  },

  {
    amount: 7829,
    day: '13/11/2021',
  },
  {
    amount: 2824,
    day: '14/11/2021',
  },
  {
    amount: 60000,
    day: '15/11/2021',
  },
  {
    amount: 700000,
    day: '16/11/2021',
  },

  {
    amount: 77829,
    day: '17/11/2021',
  },
  {
    amount: 282407,
    day: '18/11/2021',
  },
  {
    amount: 300000,
    day: '19/11/2021',
  },
  {
    amount: 10000,
    day: '20/11/2021',
  },

  {
    amount: 7829,
    day: '21/11/2021',
  },
];

export const getWithdrawSatoshi = (params: IBuyAndWithdrawRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getWithdrawSatoshiRequested());
  try {
    const res = await DashboardAPI.GET_BUY_SATOSHI(params);
    dispatch(
      // TODO: Uncomment later
      // actions.getWithdrawSatoshiSuccess(
      //   res.map((item) => ({
      //     ...item,
      //     day: moment(item.day).format('DD/MM/YYYY'),
      //   })),
      // ),
      actions.getWithdrawSatoshiSuccess(dummyWithdrawSatoshiResponse),
    );
  } catch (error) {
    dispatch(actions.getWithdrawSatoshiFailed());
  }
};

export const getCashbackAvailablePeriod = (payload: ICashbackAvailablePeriodRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.getCashbackAvailablePeriodRequested());
  try {
    const res = await DashboardAPI.GET_CASHBACK_AVAILABLE_PERIOD(payload);
    dispatch(actions.getCashbackAvailablePeriodSuccess(res));
  } catch (error: any) {
    dispatch(actions.getCashbackAvailablePeriodFailed());
  }
};