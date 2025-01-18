import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backgroundApi } from '@/lib/api/background';

export interface AuctionFilters {
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

// Fetch all auctions with filters
export function useAuctions(filters: AuctionFilters = {}) {
  return useQuery({
    queryKey: ['auctions', filters], // Unique key for caching
    queryFn: () => backgroundApi.getAllAuctions(filters), // Fetch function
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Fetch active auctions
export function useActiveAuctions() {
  return useQuery({
    queryKey: ['auctions', 'active'],
    queryFn: backgroundApi.getActiveAuctions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch a single auction by ID
export function useAuctionById(id: string) {
  return useQuery({
    queryKey: ['auction', id],
    queryFn: () => backgroundApi.getAuctionById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch bids for an auction
export function useAuctionBids(auctionId: string) {
  return useQuery({
    queryKey: ['auction-bids', auctionId],
    queryFn: () => backgroundApi.getAuctionBids(auctionId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSellers() {
  return useQuery({
    queryKey: ['sellers'],
    queryFn: backgroundApi.getAllSellers,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: backgroundApi.getAllCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}