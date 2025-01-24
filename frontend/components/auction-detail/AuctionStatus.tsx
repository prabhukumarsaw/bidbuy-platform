import { Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { AuctionItem } from '@/types/types';

interface AuctionStatusProps {
  auction: AuctionItem;
}

export function AuctionStatus({ auction }: AuctionStatusProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Bid</p>
            <p className="text-3xl font-bold">${auction.currentPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Starting Price</p>
            <p className="text-xl">${auction.startingPrice}</p>
          </div>
        </div>

        <Progress
          value={(auction.currentPrice / auction.startingPrice) * 100}
          className="h-2"
        />

        {/* <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-violet-600" />
          <span>{auction.endTime || new Date().toISOString()}</span>
        </div> */}
      </div>
    </Card>
  );
}
