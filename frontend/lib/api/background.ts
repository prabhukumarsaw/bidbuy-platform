import api from './axios-config';
import { AuctionItem, AuctionStats, Category, Pagination, Bid } from '@/types/types';

export const backgroundApi = {
  // Fetch all auctions with filters
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
      sellerName?: string;
      sellerId?: string;
    }
  ) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters || {}).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    const { data } = await api.get<{ data: AuctionItem[]; pagination: Pagination }>(
      '/auctions',
      {
        params: cleanedFilters, // Pass only cleaned filters
      }
    );

    console.log("real", data);
    return data.data;
  },

  // Fetch active auctions
  getActiveAuctions: async () => {
    const { data } = await api.get<{ data: AuctionItem[] }>('/auctions/active');
    return data.data;
  },

  // Fetch auction by ID
  getAuctionById: async (id: string) => {
    const { data } = await api.get<{ data: AuctionItem }>(`/auctions/${id}`);
    return data.data;
  },

  // Fetch bids for an auction
  getAuctionBids: async (id: string) => {
    const { data } = await api.get<{ data: Bid[] }>(`/auctions/${id}/bids`);
    return data.data;
  },

  getAllSellers: async () => {
    const { data } = await api.get<{ data: Category[] }>('/admin/sellers');
    return data.data;
  },
  // Fetch all categories
  getAllCategories: async () => {
    const { data } = await api.get<{ data: Category[] }>('/categories');
    return data;
  },
};