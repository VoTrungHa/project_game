interface ForgotPasswordResonse {
  status: boolean;
}

interface ForgotPasswordRequest {
  email: string;
  token: string;
  password: string;
}
