import axiosClient from 'helpers/axiosClient';

export const ForgotPasswordAPI = {
  SEARCHBYEMAIL: async (email: string): Promise<ForgotPasswordResonse> => {
    const res: ForgotPasswordResonse = await axiosClient.post('/auth/forgot-password', email);
    return res;
  },
  UPDATENEWPASSWORD: async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResonse> => {
    const res: ForgotPasswordResonse = await axiosClient.post('/auth/reset-password', payload);
    return res;
  },
};
