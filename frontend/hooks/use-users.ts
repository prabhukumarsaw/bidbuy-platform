import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => adminApi.getUsers(),
  });
};