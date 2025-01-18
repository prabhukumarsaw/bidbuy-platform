'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginCredentials, RegisterData } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, logout: logoutStore } = useAuthStore();
  const { data: session } = useSession();

    // Update auth store when session changes
    useEffect(() => {
      if (session?.user) {
        setAuth({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.name!,
          role: session.user.role,
          image: session.user.image,
        }, session.accessToken, session.refreshToken || undefined); // Pass undefined if refreshToken is not available
      }
    }, [session, setAuth]);
    

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      console.log('Login response:', data); // Add a log to check response
      setAuth(data.data.user, data.data.token, data.data.refreshToken);
      
      toast.success('Successfully logged in');
      router.push('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to login');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
    onSuccess: () => {
      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/verify-email-sent');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register');
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset instructions sent to your email');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset instructions');
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
    onSuccess: () => {
      toast.success('Verification email resent successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resend verification email');
    },
  });

  const logout = async () => {
    await signOut({ redirect: false });
    logoutStore();
    queryClient.clear();
    router.push('/login');
    toast.success('Successfully logged out');
  };

  

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resendVerification: resendVerificationMutation.mutate,
    logout,
    isLoading: 
      loginMutation.isPending || 
      registerMutation.isPending || 
      forgotPasswordMutation.isPending ||
      resendVerificationMutation.isPending,
  };
};