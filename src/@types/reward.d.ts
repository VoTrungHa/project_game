interface IRewardState {
  tab: string;
  event: boolean;
}

interface IEventReward {
  // create
  name: string;
  link: string;
  prizePool: number;
  currency: string;
  timeStart: number | Moment;
  timeEnd: number | Moment;
  brokerId: string;
}

interface IDetailEventReward {
  // detail
  id?: string;
  name?: string;
  prizePool?: number;
  timeStart?: number | Moment;
  timeEnd?: number | Moment;
  status?: string;
  link?: string;
  broker?: string;
  paidOut?: string;
}

interface IEventsRewar {
  // response success
  page?: number;
  totalRecords?: number;
  data: Array<IDetailEventReward>;
}

interface IEventRewardRequest {
  // request magager
  page?: number;
  size?: number;
  name?: string;
  from?: number | Moment;
  to?: number | Moment;
}

interface Messages {
  field: string;
  message: string;
}

interface IReward {
  title?: string;
  amount?: number;
  ranking?: number;
  eventId?: string;
  userId?: string;
}

interface IEventRewardResponseError {
  // response error
  status: boolean;
  statusCode: number;
  message: Messages[];
  error: string;
}

interface IWallet {
  code: string;
  name: string;
}

interface IBorker {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: number;
  type: string;
  wallet: IWallet[];
}

interface ISubAccount {
  id: string;
  phone: string;
  avatar: string;
  fullName: string;
  email: number;
  amount: string;
}

interface IUserGiveEventRes {
  // response success
  page?: number;
  totalRecords?: number;
  data: Array<IUserGiveEvent>;
}

interface IUserGiveEvent {
  account?: string;
  eventId?: string;
  amount?: number;
  rank?: number;
  note?: string;
  phone?: string;
  email?: string;
  id?: string;
  fullName?: string;
  status?: number;
  reward?: string;
}
interface IUserGiveEventResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IUserGiveEvent>;
}
