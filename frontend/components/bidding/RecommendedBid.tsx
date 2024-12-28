import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendedBidProps {
  amount: number;
  onSelect: (amount: number) => void;
}

export function RecommendedBid({ amount, onSelect }: RecommendedBidProps) {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => onSelect(amount)}
    >
      <Sparkles className="w-4 h-4 mr-2 text-violet-600" />
      Use AI Recommended Bid: ${amount}
    </Button>
  );
}