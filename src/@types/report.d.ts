interface IReferral {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  totalReferrals: number;
  totalKyc: number;
  pendingAmount: number;
  receivedAmount: number;
}

interface IReferralResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IReferral>;
}

interface IReferralRequest {
  page?: number;
  size?: number;
  from?: number | null;
  to?: number | null;
}
