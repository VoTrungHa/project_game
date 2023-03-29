interface ISatoshiGameItem {
  id: string;
  title: string;
  description: string;
  reward: number;
  time: number;
  status: string;
  totalAmount: number;
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
}

interface ISatoshiGameResponse extends Array<ISatoshiGameItem> {}

interface ISatoshiGameAddItemRequest {
  title: string;
  description: string;
  reward: number;
  time: number;
  totalAmount: number;
}

interface ISatoshiGameAddItemResponse {
  reward: number;
  time: number;
  title: string;
  totalAmount: number;
  currency: {
    id: string;
    code: string;
    name: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ISatoshiGameUpdateStatusRequest {
  id: string;
  status: string;
}

interface IStatisticSatoshiGameRequest {
  page?: number;
  size?: number;
  from?: number;
  to?: number;
  userId?: string;
  sortOrder?: string;
}

interface IStatisticStatoshiGame {
  id: string;
  receiver: {
    id: string;
    fullName: string;
    amuont: number;
    createdAt: string;
  };
}
interface IStatisticSatoshiGameReponse {
  page?: number;
  totalRecords?: number;
  data: Array<IStatisticStatoshiGame>;
  totalSAT: number;
  totalAccounts: number;
}
