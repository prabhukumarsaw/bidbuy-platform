import { Crown, Medal, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const topBidders = [
  { rank: 1, name: 'Alex Thompson', bid: 2898, time: '2 hours ago' },
  { rank: 2, name: 'Sarah Chen', bid: 2875, time: '3 hours ago' },
  { rank: 3, name: 'Michael Brown', bid: 2850, time: '5 hours ago' },
  { rank: 4, name: 'Emma Davis', bid: 2825, time: '6 hours ago' },
  { rank: 5, name: 'James Wilson', bid: 2800, time: '7 hours ago' },
];

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

export function BidderRanking() {
  return (
    <Card className="h-full p-1">
      <h3 className="mb-4 text-lg font-semibold">Top Bidders</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-0">
          {topBidders.map((bidder) => (
            <div
              key={bidder.rank}
              className="flex items-center justify-between rounded-lg border p-2 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getRankIcon(bidder.rank)}
                </div>
                <div>
                  <p className="font-medium">{bidder.name}</p>
                  <p className="text-sm text-muted-foreground">{bidder.time}</p>
                </div>
              </div>
              <p className="font-semibold">${bidder.bid}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
