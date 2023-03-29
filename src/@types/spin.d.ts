interface ISpinItem {
  id: string;
  title: string;
  rate: number;
  updatedAt: string;
  type: number;
  reward: number;
  approval: boolean;
  updatedBy: {
    fullName: string;
    id: string;
  };
}

interface ISpinDailyResponse extends Array<ISpinItem> { }

interface ISpinDailyUpdate {
  configs: Array<{ id: string; rate: number }>;
}

interface ILuckySpinApproveRequest {
  id: string;
  approval: boolean;
  note?: string;
}

interface ILuckySpinItem {
  id: string;
  note: string;
  status: number;
  rewardStatus: number;
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
  rewardTitle: string;
  type: number;
  reward: number;
  account: {
    id: string;
    fullName: string;
  };
}

interface ILuckySpinResponse {
  page: number;
  totalRecords: number;
  data: Array<ILuckySpinItem>;
}

interface ILuckySpinRequest {
  page?: number;
  size?: number;
  needApproval?: boolean;
  accountId?: string;
}

interface ILuckyWheelStatisticRequest {
  page: number;
  size: number;
  from?: string;
  to?: string;
  sortKey?: string;
  sortOrder?: string;
}

interface ILuckyWheelStatisticItem {
  noPrize: number;
  prize50: number;
  prize100: number;
  prize200: number;
  prize300: number;
  prize400: number;
  prize500: number;
  prize1000: number;
  totalUsers: number;
  totalSAT: number;
  isoDate: string;
  date: string;
}

interface ILuckyWheelStatisticResponse {
  page?: number;
  totalRecords?: number;
  data: Array<ILuckyWheelStatisticItem>;
}

interface ILuckyWheelStatisticByDateRequest {
  page?: number;
  size?: number;
  date: string;
}

interface ILuckyWheelStatisticByDateItem {
  id: string;
  account: {
    id: string;
    fullName: string;
  };
  reward: number;
  rewardTitle: string;
  rewardAt: string;
  rewardStatus: number;
  createdAt: string;
  updatedAt: string;
}

interface ILuckyWheelStatisticByDateResponse {
  page?: number;
  totalRecords?: number;
  data: Array<ILuckyWheelStatisticByDateItem>;
}
