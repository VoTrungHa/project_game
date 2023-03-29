interface IAccount {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  status: number;
  isPartner: boolean;
  createdAt: string;
  kycStatus: number;
  currencyId?: string;
  totalReferrals: number;
  totalKyc: numbers;
  referralBy: {
    id: string;
    fullName: string;
    isPartner: boolean;
  };
}

interface IAccountResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IAccount>;
}

interface IParameterRequest {
  page?: number;
  id?: string;
  keyword?: string;
  size?: number;
  keyword?: string;
  isPartner?: boolean;
  kycStatus?: number;
  status?: number | null;
  createdAt?: string;
  from?: number | Moment;
  to?: number | Moment;
  sortKey?: string;
  sortOrder?: string;
  isReferral?: boolean;
  token?: string;
  value?: string;
}

interface IAccountStat {
  totalAccounts: number;
  totalAmountSAT: number;
  totalAmountVNDC: number;
  totalKyc: number;
  totalPartners: number;
  tokens: {
    BBC: number;
    SAT: number;
    VNDC: number;
  };
}
