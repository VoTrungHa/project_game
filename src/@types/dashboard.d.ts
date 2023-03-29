interface ITotalAccounts {
  sum: {
    value: number;
  };
}

interface ITotalCashback {
  sum: {
    value: number;
    amount: number;
  };
}

interface ICashbackDashboardParam {
  status: number;
  dateFrom: string;
  dateTo: string;
}

interface ICashbackDashboardItem {
  type: number;
  status: number;
  amount: number;
  createdAt: string;
  receiver: {
    id: number;
    fullName: string;
    phone: string;
  };
}

type ICashbackDashboardResponse = Array<ICashbackDashboardItem>;

interface ICashbackSummary {
  totalAvailable: number;
  totalPending: number;
  totalCashback: number;
}

interface IBuySatoshiItem {
  day: string;
  amount: number;
}

type IBuySatoshi = Array<IBuySatoshiItem>;

interface IBuyAndWithdrawItem {
  day: string;
  amount: number;
  category: string;
}

interface IBuyAndWithdrawRequest {
  type?: number;
  from?: number;
  to?: number;
}

interface ICashbackAvailablePeriodRequest {
  currency?: string;
  from: number;
  to: number;
}

interface ICashbackAvailablePeriod {
  fromCashbackAvailable: number;
  toCashbackAvailable: number;
}

interface IDashboardAccountRequest {
  type: number;
  from: number;
  to: number;
}

interface IAccountDasboardChartItem {
  count: number;
  date: string;
}

type IAccountDashboardChart = Array<IAccountDasboardChartItem>;
