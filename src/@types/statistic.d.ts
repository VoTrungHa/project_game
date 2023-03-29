interface IReferralCounterItem {
  id: string;
  fullName: string;
  email: string;
  status: number;
  phone: string;
  isPartner: boolean;
  totalReferrals: number;
  createdAt?: string;
  isDisabled?: boolean;
  amount?: number;
}

interface IListReferralCounterResponse {
  page?: number;
  totalRecords?: number;
  totalAmount?: number;
  data: Array<IReferralCounterItem>;
}

interface IListReferralCounterRequest {
  isPartner?: number | boolean;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
  keyword?: string;
}

interface IBonusPartnerRequest {
  amount: number;
  title: string;
  reason: string;
  users: Array<string>;
}
