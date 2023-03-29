interface ISystemConfigItem {
  id: number;
  type: number;
  value: number;
  unit: number;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    fullName: string;
  };
}

interface ISystemConfig extends Array<ISystemConfigItem> {}

interface IEditSystemConfigRequest {
  id: number;
  value: number | string;
  unit: number;
  displayName: string;
}

interface IEditSystemConfigResponse extends IEditSystemConfigRequest {
  updatedAt: string;
}

interface ICreateSystemConfigRequest {
  value: number;
  unit: number;
  displayName: string;
  type: number;
}

interface ICreateSystemConfigResponse extends Omit<ISystemConfigItem, 'updatedAt'> {}

interface IEditConfigCommissionRequest {
  id: number;
  referralBy: number;
  referralFrom: number;
  nonReferral: number;
  needKyc: boolean;
}

interface IEditConfigCommissionResponse {
  id: number;
  referralBy: number;
  referralFrom: number;
  createdAt: string;
}

interface IGetConfigCommission {
  id: number;
  referralBy: number;
  referralFrom: number;
  nonReferral: number;
  needKyc: boolean;
  createdAt: string;
}

interface IExchangeRate {
  [key: string]: {
    bid: string;
    ask: string;
    time: number;
    market: string;
  };
}

interface BannerConfig {
  urlContent?: string;
  position?: number;
  link?: string;
}

interface BannerConfigItem {
  id: string;
  urlContent: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  link?: string;
}

interface IGetBannerConfigResponse extends Array<BannerConfigItem> {}

interface IEditBannerConfigRequest extends BannerConfig {
  id: string;
}

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

interface IHomepageBannerItemEdit {
  title?: string;
  url?: string;
  startAt?: string;
  stopAt?: string;
  externalLink?: string;
  buttonTitle?: string;
  interact?: boolean;
  status?: number;
}
interface IHomepageBannerItem extends IHomepageBannerItemEdit {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: number;
}

interface IGetHomePageConfig extends Array<IHomepageBannerItem> {}

interface ISendNotification {
  isPartner?: boolean;
  kycStatus?: number;
  isWithdrawal?: boolean;
  title: string;
  description: string;
}

interface IInterestRateConfig {
  id: string;
  rate: number;
  fromWallet: {
    id: string;
    code: string;
  };
  walletReceive: {
    id: string;
    code: string;
  };
}

interface IInterestRateConfigUpdate {
  fromWalletCode: string;
  receivingWalletCode: string;
  interestRate: string;
}
