interface IAnnouncementBitfarmItem {
  id?: string;
  title?: string;
  banner?: string;
  status?: number;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
  buttonTitle?: string;
  interact?: boolean;
}

interface IAnnouncementBitfarmResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IAnnouncementBitfarmItem>;
}

interface IAnnouncementBitfarmRequest {
  page?: number;
  size?: number;
}

interface IAnnouncementBitfarmPost {
  title: string;
  banner: string;
  status: number;
  link: string;
  buttonTitle: string;
  interact?: boolean;
}
