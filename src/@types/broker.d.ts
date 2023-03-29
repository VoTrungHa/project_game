interface IBrokerItem {
  email: string;
  phone: string;
  fullName: string;
  status: number;
  avatar: string;
  id: string;
  secretKey: string;
  cbAvailable: Array<{
    amount: string;
    currencyId: string;
    id: string;
  }>;
}

interface IBrokerListResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IBrokerItem>;
}

interface IGetListBrokerrequest {
  page?: number;
  size?: number;
  keyword?: string;
}

interface IAddBrokerRequest {
  email: string;
  phone: string;
  fullName: string;
  status: number;
  avatar: string;
}

interface IUpdateBrokerRequest {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  status: number;
  avatar: string;
}

interface ICurrencyItem {
  id: string;
  code: string;
  name: string;
  amount: string;
  icon: string
}

interface ICurrencyList extends Array<ICurrencyItem> { }

interface IBrokerManagerDepositRequest {
  id: string;
  amount: number;
  coin: string;
}

interface IBrokerTransactionItem {
  id: string;
  amount: string;
  fee: number;
  title: string;
  description: string;
  createdAt: string;
  status: number;
  actionType: number;
  currency: {
    code: string;
    name: string;
  };
}

interface IBrokerTransactionResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IBrokerTransactionItem>;
}

interface IBrokerTransactionRequest {
  id?: string;
  page?: number;
  size?: number;
  coin?: string | number;
  type?: number;
  keyword?: string;
  from?: number | null;
  to?: number | null;
}

interface IBrokerDetailTransactionStat {
  totalTransactionCount: string | number;
  totalDepositAmount: string | number;
  totalTransferAmount: string | number;
  totalTransferAccountCount: string | number;
}
