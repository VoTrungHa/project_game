interface IUser {
  id: number;
  userName: string;
  fullName: string;
  email: null | string;
  role: number;
  phone: null | string;
  status: number;
  createdBy: null | number;
  createdAt: string;
  avatar?: string;
}

interface IListUserResponse {
  page?: number;
  totalRecords?: number;
  data: Array<IUser>;
}

interface IListUserRequest {
  page?: number;
  userName?: string;
  fullName?: string;
  keyword?: string;
  role?: number | string;
  status?: number;
  createdBy?: number;
  size?: number;
}

interface IAddUserResponse extends IUser {
  avatar: string;
  updatedAt: string;
}

interface IAddUserRequest {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: keyof typeof import('./../constants/role').ROLE_TYPE;
  status: number;
  userName: string;
  password: string;
}

interface IDeleteUserResonse {
  status: boolean;
}

interface IUpdateUserResponse extends IUser {
  updatedAt: string;
}

interface IUpdateUserRequest {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: number;
  status: number;
}

interface IUserDetail extends IUser {
  avatar: string;
}
