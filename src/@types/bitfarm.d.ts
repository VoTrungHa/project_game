interface IChickenFarmStatsResquest {
  from?: number;
  to?: number;
}

interface IChickenFarmStatsResponse {
  totalEggSold: number;
  totalPaidAmount: number;
}

interface IChickenAdultStatsResponse {
  totalHatchingEgg: number;
  totalChickenType1: number;
  totalChickenType2: number;
  totalChickenType3: number;
  totalChickenType4: number;
  totalChickenType5: number;
}

interface IListBuySatoshiRequest {
  page?: number;
  size?: number;
  from?: number | null;
  to?: number | null;
  status?: number;
  keyword?: string;
}

interface IListBuySatoshiItem {
  transactionId: string;
  title: string;
  description: string;
  amount: number;
  amountExchange: number;
  status: number;
  createdAt: string;
  account: {
    id: string;
    fullName: string;
    kycStatus: number;
  };
}

interface IListBuySatoshiResponse {
  totalRecords?: number;
  page?: number;
  data: Array<IListBuySatoshiItem>;
}

interface IPlayerDataItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalAmount: number;
  totalChicken: number;
  totalEgg: number;
}

interface IPlayerListResponse {
  totalRecords?: number;
  page?: number;
  data: Array<IPlayerDataItem>;
}

interface IPlayerListRequest {
  page?: number;
  size?: number;
  keyword?: string;
  order?: number;
}

interface IGetBrokerTransaction {
  totalEgg: number;
  totalChicken: number;
  totalGoldenEgg: number;
  totalSlot: number;
  avatar: string;
  phone: string;
  email: string;
  fullName: string;
}

interface IAccountTransactionItem {
  id: string;
  amount: number;
  status: number;
  createdAt: string;
  sellerDescription: string;
  seller: {
    id: string;
    fullName: string;
  };
  buyerDescription: string;
  buyer: {
    id: string;
    fullName: string;
  };
}

interface IAccountTransactionResponse {
  page?: number;
  totalRecords?: number;
  totalAmount?: number;
  data: Array<IAccountTransactionItem>;
}

interface IAccountTransactionRequest {
  id: string;
  page?: number;
  size?: number;
  type?: number;
  status?: number;
}

interface IDepositSatoshiDetailStats {
  totalRecords: number;
  totalSuccess: number;
  totalFailed: number;
  totalUsers: number;
  totalDepositAmount: { [key: string]: number };
}

interface IStatRequest {
  from?: number;
  to?: number;
  status?: number;
  walletType?: string;
  coinType?: string;
}

interface IPlayerListStat {
  totalRecords: number;
  totalHenEggs: number;
  totalRoosterEggs: number;
  totalHenChickens: number;
  totalRoosterChickens: number;
  totalAmount: number;
  totalGoldenEggs: number;
}

interface IUpdateTransactionStatus {
  id: string;
  status: number;
  transactionNumber?: string;
  reason?: string;
}
