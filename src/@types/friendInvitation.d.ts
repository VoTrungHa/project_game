interface IEventItem {
  id: string;
  name: string;
  information: string;
  status: number;
  timeStart: number;
  timeEnd: number;
}

interface IEventListRequest {
  page?: number;
  size?: number;
  status?: number;
}

interface IEventListResponse {
  totalRecords?: number;
  page?: number;
  data?: Array<IFriendInvitationItem>;
}

interface IAddEventRequest {
  name: string;
  status: number;
  information: string;
  timeStart: number;
  timeEnd: number;
}

interface IEventRankingItem {
  id: string;
  avatar: string;
  fullName: string;
  value: number;
}

interface IEventRankingListResponse {
  totalRecords?: number;
  page?: number;
  data?: Array<IEventRankingItem>;
}

interface IEventRankingListRequest {
  id: string;
  page?: number;
  size?: number;
}
