import axiosClient from 'helpers/axiosClient';

export const AuthAPI = {
  LOGIN: async (payload: LoginRequest): Promise<ILoginResponse> => {
    const res: ILoginResponse = await axiosClient.post('/auth/sign-in', payload);
    return res;
  },
  LOGOUT: async (): Promise<any> => {
    return await axiosClient.post('/api/user/logout');
  },
  GET_PROFILE: async (): Promise<IFullProfile> => {
    return await axiosClient.get('/auth/profile');
  },
  CHANGE_PASSWORD: async (payload: { password: string }): Promise<{ id: number; updatedAt: string }> => {
    return await axiosClient.patch('/auth/change-password', payload);
  },
  UPDATE_PROFILE: async (payload: IUpdateProfileRequest): Promise<{ id: number }> => {
    return await axiosClient.patch('/auth/profile', payload);
  },
};
