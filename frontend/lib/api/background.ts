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

  // Fetch all sellers
  getAllSellers: async () => {
    const { data } = await api.get<{ data: Category[] }>('/admin/sellers');
    return data.data;
  },

  // Fetch all categories
  getAllCategories: async () => {
    const { data } = await api.get<{ data: Category[] }>('/categories');
    return data;
  },

  // Fetch bids for an auction
  getAuctionBids: async (id: string) => {
    const { data } = await api.get<{ data: Bid[] }>(`/auctions/${id}/bids`);
    console.log("getAuctionBids", data.data)
    return data.data;
  },

  // Fetch auctions by category
  getAuctionsByCategory: async (categoryId: string) => {
    const { data } = await api.get<{ data: AuctionItem[] }>(`/auctions/category/${categoryId}`);
    console.log("getAuctionsByCategory", data.data)
    return data.data;
  },

  // Fetch winning bid for an auction
  getWinningBid: async (auctionId: string) => {
    const { data } = await api.get<{ data: Bid }>(`/auctions/${auctionId}/winning-bid`);
    console.log("getWinningBid", data.data)
    return data.data;
  },

  // Place a bid on an auction
  placeBid: async (auctionId: string, amount: number) => {
    const { data } = await api.post<{ data: Bid }>(`/auctions/${auctionId}/bids`, { amount });
    return data.data;
  },

  // Fetch active bids for the logged-in user
  getUserActiveBids: async () => {
    const { data } = await api.get<{ data: Bid[] }>('/auctions/users/active-bids');
    console.log("getUserActiveBids", data.data)
    return data.data;
  },

  // Fetch a specific bid by ID
  getBidById: async (bidId: string) => {
    const { data } = await api.get<{ data: Bid }>(`/auctions/bids/${bidId}`);
    return data.data;
  },
};