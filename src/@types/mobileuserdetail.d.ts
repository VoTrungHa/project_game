interface ICashbackTransactionRequest {
  id: string;
  size?: number;
  page?: number;
  received?: boolean;
  currency?: string;
}

interface IAccountReferralRequest {
  id?: string;
  size?: number;
  page?: number;
  keyword?: string;
  from?: number;
  to?: number;
  kycStatus?: number;
}

interface ICashbackTransactionResponse {
  page?: number;
  totalRecords?: number;
  data: Array<{
    type: number;
    status: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    amount: {
      value: number;
      currency: string;
    };
    fee: {
      value: number;
      currency: string;
    };
    currency: {
      id: number;
      code: string;
      name: string;
    };
  }>;
}

interface INotificationResponse {
  page?: number;
  totalRecords?: number;
  data: Array<{
    id: number;
    type: number;
    cashbackRef: number;
    icon: string;
    seen: boolean;
    title: string;
    description: string;
    createdAt: string;
  }>;
}

interface IKycResponse
  extends Array<{
    accId: number;
    approvedBy: number;
    createdAt: string;
    docType: number;
    id: number;
    photoBack: string;
    photoFront: string;
    photoStatus: number;
    reason: string;
    selfieVideo: string;
    updatedAt: string;
    videoStatus: number;
  }> {}

interface IAccountReferredInfo {
  id: number;
  phone: string;
  avatar: string;
  fullName: string;
  email: string;
  createdAt: string;
  amount: number;
  isPartner: boolean;
}

interface IAccountReferredByAccount {
  page: number;
  totalRecords: number;
  totalKyc: number;
  data: Array<IAccountReferredInfo>;
}

interface IResetPasscodeRequest {
  id: string;
  passcode: string;
}

interface IResetPasscodeResponse {
  status: boolean;
}

interface ICashbackWalletRequest {
  id: number;
  page: number;
  size: number;
}

interface ICashbackWalletITem {
  type: number;
  status: number;
  amount: number;
  createdAt: string;
  description: string;
  title: string;
  currency: {
    id: number;
    code: string;
  };
  sender: null | {
    id: number;
    phone: string;
    fullName: string;
  };
}

interface ICashbackWalletResponse {
  page: number;
  size: number;
  totalRecords: number;
  data: Array<ICashbackWalletITem>;
}

interface IDailySpinInformationRequest {
  id: string;
  page?: number;
  size?: number;
  needApproval?: boolean;
  accountId?: string;
}
interface IDailySpinInformationItem {
  fullName: string;
  id: string;
  createdAt: string;
  isApproved: boolean;
  note: string;
  reward: number;
  rewardStatus: number;
  rewardTitle: string;
  status: number;
  transactionId: string;
  type: number;
  updatedAt: string;
  account: { id: string; fullName: string };
}

interface IDailySpinInformationResponse {
  page: number;
  totalRecords: number;
  data: Array<IDailySpinInformationItem>;
}

interface IWalletInfoResponse {
  [key: string]: {
    amountAvailable: string;
    amountPending: string;
  };
}
