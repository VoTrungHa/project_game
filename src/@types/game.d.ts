interface IGameItem {
  id: string;
  name: string;
  description: string;
  banner: string;
  status: number;
  source: string;
  createdAt: string;
}

interface IGameListResponse {
  totalRecords?: number;
  page?: number;
  data?: Array<IGameItem>;
}

interface IAddGameItem {
  name: string;
  description: string;
  banner: string;
  source: string;
  status: number;
}

interface IEditGameItem extends IAddGameItem {
  id: string;
}

interface IChallengeItem {
  id: string;
  title: string;
  banner: string;
  status: number;
  timeStart: number;
  timeEnd: number;
  prizeRanking: { [key: string]: number };
  prizePool: number;
  createdAt: string;
  information: string;
  free: boolean;
  game: {
    id: string;
    name: string;
  };
}

interface IChallengeListResponse {
  totalRecords?: number;
  page?: number;
  data?: Array<IChallengeItem>;
}

interface IAddChallengeItem {
  title: string;
  information: string;
  banner: string;
  timeStart: number;
  timeEnd: number;
  prizeRanking: { [key: string]: number };
  gameId: string;
  free: boolean;
}

interface IEditChallengeItem extends IAddChallengeItem {
  id: string;
}
