import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backgroundApi } from '@/lib/api/background';
import { BidsResponse, TopBidder, Category, Pagination, Bid } from '@/types/types';


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
  return useQuery<{ bids: Bid[]; pagination: Pagination }, Error, Bid[]>({
    queryKey: ['auction-bids', auctionId],
    queryFn: () => backgroundApi.getAuctionBids(auctionId),
    // staleTime: 1000 * 60 * 5, // 5 minutes
    select: (response) => {
      // Ensure the response has the expected structure
      if (!response || !Array.isArray(response.bids)) {
        console.error('Invalid API response:', response);
        return [];
      }

      // Sort bids by amount in descending order
      return response.bids.sort((a, b) => b.amount - a.amount);
    },
  });
}

// Fetch all sellers
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

// Fetch auctions by category
export function useAuctionsByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['auctions-by-category', categoryId],
    queryFn: () => backgroundApi.getAuctionsByCategory(categoryId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch winning bid for an auction
export function useWinningBid(auctionId: string) {
  return useQuery({
    queryKey: ['winning-bid', auctionId],
    queryFn: () => backgroundApi.getWinningBid(auctionId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Place a bid on an auction
export function usePlaceBid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auctionId, bidAmount }: { auctionId: string; bidAmount: number }) =>
      backgroundApi.placeBid(auctionId, bidAmount),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['auction-bids', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['winning-bid', variables.auctionId] });
    },
  });
}

// Fetch active bids for the logged-in user
export function useUserActiveBids() {
  return useQuery({
    queryKey: ['user-active-bids'],
    queryFn: backgroundApi.getUserActiveBids,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch a specific bid by ID
export function useBidById(bidId: string) {
  return useQuery({
    queryKey: ['bid', bidId],
    queryFn: () => backgroundApi.getBidById(bidId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}