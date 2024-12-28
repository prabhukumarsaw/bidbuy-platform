import { Input } from '@/components/ui/input';

interface BidAmountProps {
  value: number;
  onChange: (value: number) => void;
  minBid: number;
}

export function BidAmount({ value, onChange, minBid }: BidAmountProps) {
  return (
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium">Your Bid</label>
        <span className="text-sm text-muted-foreground">
          Min: ${minBid}
        </span>
      </div>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-lg"
      />
    </div>
  );
}