import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';

export const useVerifyEmail = () => {
  const mutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });

  return {
    verifyEmail: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};