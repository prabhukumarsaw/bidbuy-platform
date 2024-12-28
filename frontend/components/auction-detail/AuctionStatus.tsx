import { Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface AuctionStatusProps {
  currentBid: number;
  startingPrice: number;
  timeRemaining: string;
  progress: number;
}

export function AuctionStatus({
  currentBid,
  startingPrice,
  timeRemaining,
  progress,
}: AuctionStatusProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Bid</p>
            <p className="text-3xl font-bold">${currentBid}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Starting Price</p>
            <p className="text-xl">${startingPrice}</p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-violet-600" />
          <span>{timeRemaining}</span>
        </div>
      </div>
    </Card>
  );
}
