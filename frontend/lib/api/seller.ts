import api from './axios-config';
import { AuctionItem, Seller, AuctionStats, Category, AuctionAnalytics, Pagination } from '@/types/types';



export const sellerApi = {
  submitApplication: async (data: FormData) => {
    const response = await api.post('/seller/apply', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // -------------------auction dashboard-------------------//

  // Fetch auction dashboard statistics
  getDashboardStats: async () => {
    const { data } = await api.get<{ data: AuctionStats }>('/seller-auctions/dashboard');
    console.log(data)
    return data;
  },

  // Fetch auction analytics
  getAnalytics: async (period: 'day' | 'week' | 'month' = 'week') => {
    const { data } = await api.get<{ data: AuctionAnalytics }>(`/seller-auctions/analytics?period=${period}`);
    return data;
  },

  // Create a new auction
  createAuction: async (formData: FormData) => {
    const { data } = await api.post<{ data: AuctionItem }>('/seller-auctions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Update auction details
  updateAuction: async (id: string, formData: FormData) => {
    const { data } = await api.put<{ data: AuctionItem }>(`/seller-auctions/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Delete an auction
  deleteAuction: async (id: string) => {
    await api.delete(`/seller-auctions/${id}`);
  },

  // Update auction status
  updateAuctionStatus: async (id: string, status: string) => {
    const { data } = await api.patch<{ data: AuctionItem }>(`/seller-auctions/${id}/status`, { status });
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
      '/seller-auctions',
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