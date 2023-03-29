interface IMobileUserAccountReferral {
  id: number;
  phone: string;
  avatar: string;
  fullName: string;
  email: string;
  createdAt: string;
}

interface IMobileUserAccountReferralRequest {
  type: 1 | 2;
  id: number;
}

interface IMobileUserAccountReferralResponse extends Array<IMobileUserAccountReferral> {}

interface IMobileUserAccount {
  id: string;
  avatar?: string;
  fullName: string;
  email?: string;
  phone: string;
  status: number;
  createdAt: string;
  kycStatus: number;
}

interface IMobileUserAccountUpdateStatusRequest {
  id: string;
  status?: number;
  reason?: string;
  phone?: string;
}

interface IMobileUserAccountResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IMobileUserAccount>;
}

interface IMobileUserAccountRequest {
  page?: number;
  size?: number;
  fullName?: string;
  email?: string;
  status?: string;
  createdAt?: string;
  keyword?: string;
  isPartner?: boolean;
}

interface IMobileUserDetailResponse {
  id: string;
  avatar: string;
  fullName: string;
  status: number;
  phone?: string;
  email: string;
  kycStatus: number;
  deviceToken?: string;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
  isPartner: boolean;
  googleId?: string;
  facebookId?: string;
  appleId?: string;
  referralLink?: string;
  parent?: {
    fullName: string;
    id: string;
    isPartner: boolean;
  };
}

interface ICreateMobileUserRequest {
  passcode: string;
  phone: string;
  fullName: string;
  email: string;
  avatar: string;
  referralBy: string;
  sendEmail: boolean;
}

interface ICreateMobileUserResponse {
  id: number;
  phone: string;
  fullName: string;
  status: number;
  email: string;
  referralCode: string;
}
