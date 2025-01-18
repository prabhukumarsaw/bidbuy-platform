import api from './axios-config';
import { Seller, User } from '@/types/types';

export interface AdminStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    verified: number;
    byRole: { role: string; _count: number }[];
    newToday: number;
  };
  sellers: {
    total: number;
    verified: number;
    pending: number;
    suspended: number;
    newToday: number;
  };
}

export const adminApi = {
  // Seller management
  getSellerApplications: async (search?: string, status?: string, page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const { data } = await api.get<{ data: Seller[] }>(`/admin/seller-applications?${params.toString()}`);
    return data;
  },

  getAllSellers: async (search?: string, status?: string, page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const { data } = await api.get<{ data: Seller[] }>(`/admin/sellers?${params.toString()}`);
    return data;
  },

  verifySeller: async (sellerId: string) => {
    const { data } = await api.patch<{ data: Seller }>(`/admin/sellers/${sellerId}/verify`, { verified: true });
    return data;
  },

  rejectSeller: async (sellerId: string, reason: string) => {
    const { data } = await api.patch<{ data: Seller }>(`/admin/sellers/${sellerId}/verify`, { 
      verified: false,
      rejectionReason: reason 
    });
    return data;
  },

  suspendSeller: async (sellerId: string, reason: string) => {
    const { data } = await api.patch<{ data: Seller }>(`/admin/sellers/${sellerId}/suspend`, { reason });
    return data;
  },

  reactivateSeller: async (sellerId: string) => {
    const { data } = await api.patch<{ data: Seller }>(`/admin/sellers/${sellerId}/reactivate`);
    return data;
  },

  // User management
  getUsers: async () => {
    const { data } = await api.get<{ data: User[] }>('/admin/users');
    return data;
  },

  updateUserRole: async (userId: string, role: 'USER' | 'ADMIN') => {
    const { data } = await api.patch<{ data: User }>(`/admin/users/${userId}/role`, { role });
    return data;
  },

  deactivateUser: async (userId: string) => {
    const { data } = await api.patch<{ data: User }>(`/admin/users/${userId}/deactivate`);
    return data;
  },

  reactivateUser: async (userId: string) => {
    const { data } = await api.patch<{ data: User }>(`/admin/users/${userId}/reactivate`);
    return data;
  },

  deleteUser: async (userId: string) => {
    const { data } = await api.delete(`/admin/users/${userId}`);
    return data;
  },

  // Statistics
  getDashboardStats: async () => {
    const { data } = await api.get<{ data: AdminStats }>('/admin/stats/dashboard');
    return data;
  },

  getUserStats: async () => {
    const { data } = await api.get<{ data: AdminStats }>('/admin/stats/users');
    return data;
  }
};