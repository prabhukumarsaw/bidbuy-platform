import api from './axios-config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  createdAt: string;
}

export const adminApi = {
  getUsers: async () => {
    const { data } = await api.get<User[]>('/admin/users');
    return data;
  },

  updateUserRole: async (userId: string, role: 'USER' | 'ADMIN') => {
    const { data } = await api.patch(`/admin/users/${userId}/role`, { role });
    return data;
  },

  deleteUser: async (userId: string) => {
    const { data } = await api.delete(`/admin/users/${userId}`);
    return data;
  },
};