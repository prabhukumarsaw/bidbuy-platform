import { useEffect, useState } from 'react';
import { Crown, Medal, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuctionBids } from '@/hooks/useBackground';
import { formatTime } from '@/utils/formatTime';
import { socketService } from '@/lib/socketService';
import { Bid } from '@/types/types';

interface BidderRankingProps {
  auctionId: string;
}

const getRankIcon = (rank: number) => {
  if (rank < 1) return null;
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Crown className="h-5 w-5 text-amber-700" />;
    default:
      return <span className="text-sm font-semibold">{rank}</span>;
  }
};

export function BidderRanking({ auctionId }: BidderRankingProps) {
  const {
    data: initialBids,
    isLoading,
    isError,
    error,
  } = useAuctionBids(auctionId);

  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    if (initialBids) {
      console.log('Initial bids received:', initialBids);
      setBids(initialBids);
    }
  }, [initialBids]);

  useEffect(() => {
    if (!auctionId) return;

    const handleNewBid = (newBid: Bid) => {
      try {
        if (newBid.auctionId === auctionId) {
          setBids((prevBids) => [newBid, ...prevBids]);
        }
      } catch (error) {
        console.error('Error handling new bid:', error);
      }
    };

    socketService.onNewBid(handleNewBid);

    return () => {
      socketService.offNewBid(handleNewBid);
    };
  }, [auctionId]);

  if (isLoading) {
    return (
      <Card className="h-full p-1">
        <Skeleton className="h-6 w-24 mb-2" />
        <ScrollArea className="h-[400px] p-0">
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-1 h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="h-full p-1">
        <h3 className="p-2 text-lg font-semibold">Top Bidders</h3>
        <div className="p-2 text-red-500">Error: {error?.message}</div>
      </Card>
    );
  }

  if (!Array.isArray(bids) || bids.length === 0) {
    return (
      <Card className="h-full p-1">
        <h3 className="p-2 text-lg font-semibold">Top Bidders</h3>
        <div className="p-2 text-muted-foreground">No bids yet.</div>
      </Card>
    );
  }

  return (
    <Card className="h-full p-1">
      <h3 className="p-2 text-lg font-semibold">All Bids</h3>
      <ScrollArea className="h-[400px] p-0">
        <div className="space-y-1">
          {bids.map((bid, index) => {
            const rank = index + 1;
            const formattedTime = formatTime(bid.createdAt);
            const isTop5 = rank <= 5;
            return (
              <div
                key={bid.id}
                className={`flex items-center justify-between rounded-lg border p-2 transition-colors hover:bg-muted/50 ${
                  isTop5 ? 'bg-muted/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isTop5 ? 'bg-primary/10' : 'bg-muted'
                    }`}
                  >
                    {getRankIcon(rank)}
                  </div>
                  <div>
                    <p className="text-base font-medium">{bid.bidder.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formattedTime}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">₹{bid.amount.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
