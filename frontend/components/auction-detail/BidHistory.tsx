import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface BidEvent {
  id: string;
  amount: number;
  bidder: string;
  time: string;
  type: 'manual' | 'auto';
}

const bidHistory: BidEvent[] = [
  { id: '1', amount: 125, bidder: 'Alex T.', time: '2 min ago', type: 'manual' },
  { id: '2', amount: 120, bidder: 'Sarah C.', time: '5 min ago', type: 'auto' },
  // Add more bid history...
];

export function BidHistory() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Bid History</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {bidHistory.map((bid) => (
            <div
              key={bid.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{bid.bidder}</p>
                <p className="text-sm text-muted-foreground">{bid.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${bid.amount}</p>
                <p className="text-xs text-muted-foreground capitalize">{bid.type}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}