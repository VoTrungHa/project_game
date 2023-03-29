interface ILuckySpinStatistic {
  id: string;
  date: string;
  totalUser: number;
  totalSpin: number;
  firstPrize: number;
  secondPrize: number;
  totalSat: number;
}

interface ILuckySpinStatisticResponse {
  page?: number;
  totalRecords?: number;
  data: Array<ILuckySpinStatistic>;
}

interface ILuckySpinStatisticRequest {
  page?: number;
  size?: number;
  from?: number | null;
  to?: number | null;
  sortKey?: string;
  sortOrder?: string;
}
