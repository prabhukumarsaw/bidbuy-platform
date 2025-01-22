import { Crown, Medal, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuctionItem } from '@/types/types';
import { formatTime } from '@/utils/formatTime';
import { Skeleton } from '@/components/ui/skeleton'; // Add a skeleton component for loading state

interface ProductDetailsProps {
  auction: AuctionItem;
  isLoading?: boolean; // Add a loading state prop
}

const getRankIcon = (rank: number) => {
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

export function BidderRanking({ auction, isLoading }: ProductDetailsProps) {
  // Sort bids by amount in descending order
  const sortedBids = auction?.bids
    ? [...auction.bids].sort((a, b) => b.amount - a.amount)
    : [];

  return (
    <Card className="h-full p-1">
      <h3 className="p-2 text-lg font-semibold">Top Bidders</h3>
      <ScrollArea className="h-[400px] p-0">
        <div className="space-y-1">
          {isLoading
            ? // Show skeleton loading state
              Array.from({ length: 5 }).map((_, index) => (
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
              ))
            : // Display sorted bids
              sortedBids.map((bid, index) => {
                const rank = index + 1; // Calculate rank dynamically
                const formattedTime = formatTime(bid.createdAt); // Format the time

                return (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between rounded-lg border p-2 transition-colors hover:bg-muted/50 ${
                      rank <= 3 ? 'bg-muted/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          rank <= 3 ? 'bg-primary/10' : 'bg-muted'
                        }`}
                      >
                        {getRankIcon(rank)}
                      </div>
                      <div>
                        <p className=" text-sm font-medium">
                          {bid?.bidder.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formattedTime} {/* Display formatted time */}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{bid.amount.toLocaleString()}
                    </p>
                  </div>
                );
              })}
        </div>
      </ScrollArea>
    </Card>
  );
}
