interface IKyc {
  id: number;
  docType: number;
  photoStatus: number;
  videoStatus: number;
  createdAt: string;
  accKyc: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    kycStatus: number;
  };
}

interface IListKycResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IKyc>;
}

interface IListKycRequest {
  page?: number;
  size?: number;
  docType?: string;
  status?: string | null;
  createdAt?: string;
  accountName?: string;
  keyword?: string;
}

interface IUpdateKYCRequest {
  id: number;
  reason: string;
  photoStatus: number;
  videoStatus: number;
  accountId: number;
}

interface IUpdateKYCResponse {
  id: number;
  updatedAt: string;
}

interface IKycDetailResponse {
  id: number;
  docType: number;
  photoBack: string;
  photoFront: string;
  photoStatus: number;
  selfieVideo: string;
  videoStatus: number;
  reason: string;
  accKyc: {
    id: number;
    fullName: string;
  };
  approvedKyc: {
    id: number;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}
