import api from './axios-config';
import { AuctionItem, Seller, AuctionStats, Category, AuctionAnalytics, Pagination, User } from '@/types/types';

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
  getAdminDashboardStats: async () => {
    const { data } = await api.get<{ data: AdminStats }>('/admin/stats/dashboard');
    return data;
  },

  getUserStats: async () => {
    const { data } = await api.get<{ data: AdminStats }>('/admin/stats/users');
    return data;
  },

    // -------------------auction dashboard-------------------//

     // Fetch auction dashboard statistics
  getDashboardStats: async () => {
    const { data } = await api.get<{ data: AuctionStats }>('/admin-auctions/dashboard');
    console.log(data)
    return data;
  },

   // Fetch auction analytics
   getAnalytics: async (period: 'day' | 'week' | 'month' = 'week') => {
    const { data } = await api.get<{ data: AuctionAnalytics }>(`/admin-auctions/analytics?period=${period}`);
    return data;
  },
  
    // Create a new auction
    createAuction: async (formData: FormData) => {
      const { data } = await api.post<{ data: AuctionItem }>('/admin-auctions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },

     // Update auction details
  updateAuction: async (id: string, formData: FormData) => {
    const { data } = await api.put<{ data: AuctionItem }>(`/admin-auctions/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Delete an auction
  deleteAuction: async (id: string) => {
    await api.delete(`/admin-auctions/${id}`);
  },

   // Update auction status
   updateAuctionStatus: async (id: string, status: string) => {
    const { data } = await api.patch<{ data: AuctionItem }>(`/admin-auctions/${id}/status`, { status });
    return data;
  },

  // Fetch all auctions
  getAllAuctions: async (
    filters?: {
      status?: string | string[];
      categoryId?: string;
      sortBy?: string;
      sortOrder?: string;
      page?: number;
      limit?: number;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      startTime?: string;
      endTime?: string;
    }
  ) => {
    const { data } = await api.get<{ data: AuctionItem[]; pagination: Pagination }>(
      '/admin-auctions',
      {
        params: filters, // Pass query parameters
      }
    );
    return data.data;
  },

   // Fetch active auctions
   getActiveAuctions: async () => {
    const { data } = await api.get<{ data: AuctionItem[] }>('/seller/auction/active');
    return data;
  },

  // Fetch auction by ID
  getAuctionById: async (id: string) => {
    const { data } = await api.get<{ data: AuctionItem }>(`/seller/auction/${id}`);
    return data;
  },

  //Get Category
  getAllCategories: async () => {
    const { data } = await api.get<{ data: Category[] }>('/categories');
    return data;
  },

  getProfile: async () => {
    const response = await api.get<Seller>('/seller/profile');
    return response.data;
  },


  updateProfile: async (data: Partial<Seller>) => {
    const response = await api.patch('/seller/profile', data);
    return response.data;
  },
  
};