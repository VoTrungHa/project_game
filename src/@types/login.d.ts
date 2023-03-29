interface LoginRequest {
  username: string;
  password: string;
}

interface ILoginResponse {
  token: string;
  expiresIn: number;
  role: number;
  email: string;
  fullName: string;
  id: number;
  phone: string;
}

interface ILoginErrorReponse {
  status: number;
}

interface IInformationAfterLogin {
  id: number;
  fullName: string;
  role: number;
  email: string;
  phone: string;
  userName: string;
  avatar: string;
}

interface IUpdateProfileRequest {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
}

interface IFullProfile {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}
