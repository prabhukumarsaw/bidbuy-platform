import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerApi } from '@/lib/api/seller';

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
}

export function useAuctions(filters: AuctionFilters = {}) {
  return useQuery({
    queryKey: ['auctions', filters], // Unique key for caching
    queryFn: () => sellerApi.getAllAuctions(filters), // Fetch function
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useAuctionMutations() {
  const queryClient = useQueryClient();

  const createAuction = useMutation({
    mutationFn: (formData: FormData) => sellerApi.createAuction(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });

  const updateAuction = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      sellerApi.updateAuction(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });

  const deleteAuction = useMutation({
    mutationFn: (id: string) => sellerApi.deleteAuction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      sellerApi.updateAuctionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });

  return {
    createAuction,
    updateAuction,
    deleteAuction,
    updateStatus,
  };
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: sellerApi.getAllCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useAuctionStats() {
  return useQuery({
    queryKey: ['auctionStats'],
    queryFn: sellerApi.getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAuctionAnalytics(period: 'day' | 'week' | 'month' = 'week') {
  return useQuery({
    queryKey: ['auctionAnalytics', period],
    queryFn: () => sellerApi.getAnalytics(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}