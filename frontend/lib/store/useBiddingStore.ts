import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bid, BidStatus } from '@/types/types';
import { backgroundApi } from '@/lib/api/background';
import { socketService } from '@/lib/socketService';
import { useQueryClient } from '@tanstack/react-query';

interface BiddingState {
  auctionBids: Record<string, Bid[]>; // Key: auctionId, Value: Bid[]
  winningBid: Record<string, Bid | null>; // Key: auctionId, Value: Winning Bid
  isPlacingBid: boolean;
  bidError: string | null;

  // Actions
  fetchAuctionBids: (auctionId: string) => Promise<void>;
  fetchWinningBid: (auctionId: string) => Promise<void>;
  placeBid: (auctionId: string, bidAmount: number) => Promise<void>;
  clearBidError: () => void;
  subscribeToAuction: (auctionId: string) => void;
  unsubscribeFromAuction: (auctionId: string) => void;
}

export const useBiddingStore = create<BiddingState>()(
  persist(
    (set, get) => ({
      auctionBids: {},
      winningBid: {},
      isPlacingBid: false,
      bidError: null,

      // Fetch bids for an auction
      fetchAuctionBids: async (auctionId: string) => {
        try {
          const response = await backgroundApi.getAuctionBids(auctionId);
          const bids = response.bids || []; // Extract the `bids` array
          set((state) => ({
            auctionBids: { ...state.auctionBids, [auctionId]: bids }, // Store only the `bids` array
          }));
        } catch (error) {
          console.error('Failed to fetch auction bids:', error);
          set({ bidError: 'Failed to fetch bids. Please try again.' });
        }
      },

      // Fetch winning bid for an auction
      fetchWinningBid: async (auctionId: string) => {
        try {
          const winningBid = await backgroundApi.getWinningBid(auctionId);
          set((state) => ({
            winningBid: { ...state.winningBid, [auctionId]: winningBid || null }, // Ensure winningBid is valid
          }));
        } catch (error) {
          console.error('Failed to fetch winning bid:', error);
          set({ bidError: 'Failed to fetch winning bid. Please try again.' });
        }
      },

      // Place a bid on an auction
      placeBid: async (auctionId: string, bidAmount: number) => {
        set({ isPlacingBid: true, bidError: null });
      
        // Ensure auctionBids[auctionId] is an array
        const currentBids = get().auctionBids[auctionId] || [];
      
        // Optimistic update
        const optimisticBid: Bid = {
          id: 'temp-id',
          amount: bidAmount,
          auctionId,
          bidderId: 'current-user-id', // Replace with actual user ID
          status: BidStatus.PLACED,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          bidder: {
            id: 'current-user-id',
            name: 'Current User',
            email: 'user@example.com',
          },
          bidHistory: {
            bidTime: new Date().toISOString(),
            previousPrice: get().winningBid[auctionId]?.amount || 0,
          },
        };
      
        // Update state with optimistic bid
        set((state) => ({
          auctionBids: {
            ...state.auctionBids,
            [auctionId]: [...currentBids, optimisticBid],
          },
          winningBid: {
            ...state.winningBid,
            [auctionId]:
              bidAmount > (state.winningBid[auctionId]?.amount || 0)
                ? optimisticBid
                : state.winningBid[auctionId],
          },
        }));
      
        try {
          // Place the bid via the API
          const bid = await backgroundApi.placeBid(auctionId, bidAmount);
      
          // Replace optimistic bid with actual bid
          set((state) => ({
            auctionBids: {
              ...state.auctionBids,
              [auctionId]: [
                ...(state.auctionBids[auctionId]?.filter((b) => b.id !== 'temp-id') || []),
                bid,
              ],
            },
            winningBid: {
              ...state.winningBid,
              [auctionId]:
                bid.amount > (state.winningBid[auctionId]?.amount || 0)
                  ? bid
                  : state.winningBid[auctionId],
            },
            isPlacingBid: false,
          }));
      
          // Invalidate React Query cache
          const queryClient = useQueryClient();
          queryClient.invalidateQueries({ queryKey: ['auction-bids', auctionId] });
          queryClient.invalidateQueries({ queryKey: ['winning-bid', auctionId] });
        } catch (error: any) {
          // Rollback optimistic update on error
          set((state) => ({
            auctionBids: {
              ...state.auctionBids,
              [auctionId]: state.auctionBids[auctionId]?.filter((b) => b.id !== 'temp-id') || [],
            },
            winningBid: {
              ...state.winningBid,
              [auctionId]: state.winningBid[auctionId],
            },
            isPlacingBid: false,
            bidError: error.response?.data?.message || 'Failed to place bid. Please try again.',
          }));
        }
      },

      // Clear bid error
      clearBidError: () => set({ bidError: null }),

      // Subscribe to WebSocket events for an auction
      subscribeToAuction: (auctionId: string) => {
        socketService.joinAuctionRoom(auctionId);

        // Listen for new bids
        socketService.onNewBid((bid: Bid) => {
          if (bid.auctionId === auctionId) {
            set((state) => ({
              auctionBids: {
                ...state.auctionBids,
                [auctionId]: [...(state.auctionBids[auctionId] || []), bid],
              },
              winningBid: {
                ...state.winningBid,
                [auctionId]:
                  bid.amount > (state.winningBid[auctionId]?.amount || 0)
                    ? bid
                    : state.winningBid[auctionId],
              },
            }));
          }
        });

        // Listen for auction updates
        socketService.onAuctionUpdate((update: any) => {
          if (update.auctionId === auctionId) {
            set((state) => ({
              winningBid: {
                ...state.winningBid,
                [auctionId]: update.lastBid,
              },
            }));
          }
        });
      },

      // Unsubscribe from WebSocket events for an auction
      unsubscribeFromAuction: (auctionId: string) => {
        socketService.leaveAuctionRoom(auctionId);
        socketService.removeListeners();
      },
    }),
    {
      name: 'bidding-storage',
      partialize: (state) => ({
        auctionBids: state.auctionBids,
        winningBid: state.winningBid,
      }),
    }
  )
);