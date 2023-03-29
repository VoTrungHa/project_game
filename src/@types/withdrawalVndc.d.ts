interface IWithdrawalVndcStats {
  totalRecords: number;
  totalSuccess: number;
  totalFailed: number;
  totalUsers: number;
  totalWithdrawalAmount: number;
}

interface IWithdrawalVndcRequest {
  page?: number;
  size?: number;
  from?: number | null | Moment;
  to?: number | null | Moment;
  keyword?: string;
  status?: number;
  walletType?: string | number;
  coinType?: string | number;
}

interface IWithdrawalVndcItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: number;
  createdAt: string;
  senderId: string;
  senderName: string;
  coinType: string;
  email: string;
  phone: string;
  updatedAt?: string;
  accountONUS?: string;
  fullNameONUS?: string;
  transactionONUS?: string;
}

interface IWithdrawalVndcReponse {
  page?: number;
  totalRecords?: number;
  data: Array<IWithdrawalVndcItem>;
}
