interface IStatisticStackingRequest {
  page?: number;
  size?: number;
  from?: number | Moment;
  to?: number | Moment;
}

interface IStatisticStackingResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IStatisticStackingItem>;
}

interface IStatisticStackingStat {
  totalAccounts: number;
  averageInterestAmount: number;
  totalInterestAmount: {
    VNDC: number;
    SAT: number;
  };
}

interface IStatisticStackingItem {
  averageInterestAmount: number;
  createdAt: string;
  dateTime: string;
  fromWallet: { id: string; code: string };
  highestInterestAmount: string;
  id: string;
  interestRate: string;
  lowestInterestAmount: string;
  toWallet: { id: string; code: string };
  totalAccounts: number;
  totalInterestAmount: string;
}

interface IStatisticStackingAccountResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IStackingItemTable>;
}

interface IStackingItemTable {
  account: { fullName: string; email: string; phone: string };
  email: string;
  fullName: string;
  phone: string;
  accountId: string;
  cashbackTransactionId: string;
  fromWalletAmount: number;
  toInterestAmount: number;
  toWalletAmount: number;
}

interface IStatisticStackingRouter {
  hasStatisticStacking: number;
  id: string;
}

interface IStatisticGameRouter {
  hasStatisticGame: number;
}
