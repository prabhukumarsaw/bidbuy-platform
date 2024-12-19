import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface SocialLoginData {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  image?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  socialLogin: async (socialData: SocialLoginData) => {
    const { data } = await api.post('/auth/social-login', socialData);
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async ({ token, password }: ResetPasswordData) => {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    return data;
  },

  verifyEmail: async (token: string) => {
    const { data } = await api.get(`/auth/verify-email/${token}`);
    return data;
  },

  resendVerification: async (email: string) => {
    const { data } = await api.post('/auth/resend-verification', { email });
    return data;
  },
};