interface IGetCommissionPartnerRequest {
  id?: string;
  page?: string | number;
  size?: string | number;
  date?: string;
}

interface ICommissionItem {
  id: string;
  totalValue: number;
  commission: number;
  isApproved: boolean;
  transaction: {
    id: string;
    status: number;
    amount: number;
    createdAt: string;
    accessTradeId: string;
  };
}

interface IGetCommissionPartnerResponse {
  status: number;
  message: string;
  page: number;
  totalRecords: number;
  data: {
    totalCommission: number;
    totalReward: number;
    commissionHistories: Array<ICommissionItem>;
  };
}
