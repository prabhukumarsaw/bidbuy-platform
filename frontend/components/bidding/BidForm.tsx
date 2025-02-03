// @ts-nocheck

import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePlaceBid } from '@/hooks/useBackground';
import { socketService } from '@/lib/socketService'; // Adjust the import path
import { Bid, AuctionUpdate, OutbidNotification } from '@/types/types'; // Adjust the import path

interface BidFormProps {
  currentPrice: number;
  minIncrement: number;
  auctionId: string;
}

export function BidForm({
  currentPrice,
  minIncrement,
  auctionId,
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState(currentPrice + minIncrement);
  const maxBid = currentPrice * 2; // Example max bid limit

  const { mutate: placeBid, isPending, isError, error } = usePlaceBid();

  useEffect(() => {
    // Connect to the WebSocket server when the component mounts
    socketService.connect();

    // Join the auction room
    socketService.joinAuctionRoom(auctionId);

    // Listen for new bids
    socketService.onNewBid((bid: Bid) => {
      console.log('New bid received:', bid);
      // Update the current price if the new bid is higher
      if (bid.amount > currentPrice) {
        setBidAmount(bid.amount + minIncrement);
      }
    });

    // Listen for auction updates
    socketService.onAuctionUpdate((update: AuctionUpdate) => {
      console.log('Auction update received:', update);
      // Handle auction updates (e.g., auction ended, extended, etc.)
    });

    // Listen for outbid notifications
    socketService.onOutbid((notification: OutbidNotification) => {
      console.log('Outbid notification received:', notification);
      // Notify the user that they have been outbid
      alert(
        `You have been outbid! New bid: $${notification.newBidAmount.toLocaleString()}`
      );
    });

    // Cleanup on component unmount
    return () => {
      socketService.leaveAuctionRoom(auctionId);
      socketService.removeListeners();
      socketService.disconnect();
    };
  }, [auctionId, currentPrice, minIncrement]);

  const handleSliderChange = (value: number[]) => {
    setBidAmount(value[0]);
  };

  const quickBids = [
    { label: 'Next Bid', amount: currentPrice + minIncrement },
    { label: 'Jump Bid', amount: currentPrice + minIncrement * 2 },
    { label: 'Power Bid', amount: currentPrice + minIncrement * 5 },
  ];

  const handleBidSubmit = () => {
    const minBid = currentPrice + minIncrement;

    if (bidAmount < minBid) {
      alert(`Bid amount must be at least $${minBid.toLocaleString()}`);
      return;
    }

    // Emit the new bid to the WebSocket server
    const newBid: Bid = {
      auctionId,
      amount: bidAmount,
      bidderId: 'currentUserId', // Replace with the actual user ID
    };

    socketService.emitNewBid(newBid);

    // Call the placeBid mutation
    placeBid({ auctionId, bidAmount });
  };

  return (
    <div className="space-y-6">
      {/* Quick Bid Options */}
      <div className="grid grid-cols-3 gap-3">
        {quickBids.map((bid) => (
          <Button
            key={bid.label}
            variant="outline"
            className="flex flex-col py-3 h-auto hover:bg-violet-50"
            onClick={() => setBidAmount(bid.amount)}
          >
            <span className="text-sm font-medium">{bid.label}</span>
            <span className="text-lg font-bold">
              ${bid.amount.toLocaleString()}
            </span>
          </Button>
        ))}
      </div>

      {/* Custom Bid Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">
              Your Bid Amount
            </label>
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              className="text-lg font-medium"
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="mt-7">
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Minimum increment: ${minIncrement.toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Bid Slider */}
        <div className="space-y-2">
          <Slider
            value={[bidAmount]}
            min={currentPrice + minIncrement}
            max={maxBid}
            step={minIncrement}
            onValueChange={handleSliderChange}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Min: ${(currentPrice + minIncrement).toLocaleString()}</span>
            <span>Max: ${maxBid.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        className="w-full h-12 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        onClick={handleBidSubmit}
        disabled={isPending} // Use isPending instead of isLoading
      >
        <TrendingUp className="w-5 h-5 mr-2" />
        Place Bid: ${bidAmount.toLocaleString()}
      </Button>

      {isError && (
        <div className="text-red-500 text-sm mt-2">
          Error:{' '}
          {error instanceof Error ? error.message : 'Failed to place bid'}
        </div>
      )}

      {/* AI Recommendation */}
      <div className="bg-violet-50 rounded-lg p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-violet-600 mt-0.5" />
        <div>
          <p className="font-medium text-sm">AI Recommendation</p>
          <p className="text-sm text-muted-foreground">
            Based on market analysis, we recommend bidding $
            {(currentPrice + minIncrement * 3).toLocaleString()}
            to increase your chances of winning.
          </p>
        </div>
      </div>
    </div>
  );
}
