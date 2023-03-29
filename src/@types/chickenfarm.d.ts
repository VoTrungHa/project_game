interface IAddSchedule {
  title: string;
  price: number;
  totalEgg: number;
  limitPerBuy: number;
  timeStart?: number;
  timeEnd?: number;
  type: number;
}

interface IScheduleItem {
  id: string;
  title: string;
  limitPerBuy: number;
  status: number;
  totalEgg: number;
  price: number;
  totalSold: number;
  timeEnd: number;
  timeStart: number;
  type: number;
  createdAt: string;
  updatedAt: string;
  currency: {
    id: string;
    code: string;
  };
}

interface IListSchedule {
  page?: number;
  totalRecords?: number;
  data: Array<IScheduleItem>;
}

interface IListScheduleRequest {
  page?: number;
  size?: number;
}

interface IUpdateStatusSchedule {
  id: string;
  status: number;
}

interface BonusGoldenEggRequest {
  reason: string;
  accounts: Array<{ accountId: string; quantity: number }>;
}

interface IEggItem {
  id: string;
  status: number;
  timeStart: number;
  timeEnd: number;
  eggEvent: {
    id: string;
    title: string;
  };
  // markets: [];
  histories: [
    {
      note: string;
      updatedAt: string;
    },
  ];
}

interface IListEggByAccountResquest {
  id?: string;
  page?: number;
  size?: number;
}

interface IListEggByAccountResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IEggItem>;
}

interface IChickenItem {
  id: string;
  chickenNo: number;
  type: number;
  level: number;
  status: number;
  createdAt: string;
}

interface IListChickenByAccountRequest {
  id?: string;
  page?: number;
  size?: number;
  type?: number;
}

interface IListChickenByAccountResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IChickenItem>;
}

interface IDetailEggResponse {
  id: string;
  status: number;
  timeStart: number;
  timeEnd: number;
  createdAt: string;
  updatedAt: string;
  histories: Array<{
    note: string;
    updatedAt: string;
  }>;
  eggEvent: {
    id: string;
    title: string;
  };
  markets: Array<{
    id: string;
    price: number;
    status: number;
  }>;
}

interface ITransactionP2PItem {
  id: string;
  type: number;
  status: number;
  amount: number;
  sellerDescription: string;
  seller: {
    id: string;
    fullName: string;
  };
  buyerDescription: any;
  buyer: any;
  createdAt: string;
  finishedAt: any;
}

interface ITransactionP2PResquest {
  page?: number;
  size?: number;
  from?: number | string;
  to?: number | string;
  type?: number;
  status?: number;
}

interface ITransactionP2PResponse {
  page?: number;
  totalRecords?: number;
  data: Array<ITransactionP2PItem>;
}

interface ITransactionP2PStatResponse {
  totalTransactionCount: number;
  totalTransactionAmount: number;
  totalRevenue: number;
}
