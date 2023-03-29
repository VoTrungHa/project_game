interface IRankItem {
  id: string;
  title: string;
  description: string;
  timeEnd?: number | string;
  totalPrize: string;
  timeStart?: number | string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  currency: {
    id: string;
    code: string;
  };
  status: number;
}

interface IAddRank {
  title: string;
  description: string;
  timeStart: number;
  timeEnd: number;
  totalPrize: number;
  currencyCode: string;
  isPublic: boolean;
}
interface IRankResponse {
  data: Array<IRankItem>;
  totalRecords: number;
  page: number;
}
interface IReferralRankingAccount {
  rank: number;
  referralCount: number;
  account: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
}

interface IAward {
  status: boolean;
}

interface IRankRouter {
  hasRank: number;
  id: string
}