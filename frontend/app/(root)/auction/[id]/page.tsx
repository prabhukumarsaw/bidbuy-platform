'use client';
import { useAuctionById } from '@/hooks/useBackground';
import { ProductImageCarousel } from '@/components/product/ProductImageCarousel';
import { ProductDetails } from '@/components/product/ProductDetails';
import { AuctionStatus } from '@/components/auction-detail/AuctionStatus';
import { AuctionMetrics } from '@/components/auction-detail/AuctionMetrics';
import { PriceAnalytics } from '@/components/auction-detail/PriceAnalytics';
import { BidForm } from '@/components/bidding/BidForm';
import { BidderRanking } from '@/components/bidding/BidderRanking';
import { Separator } from '@/components/ui/separator';
import { CatalogButton } from '@/components/catalog/CatalogButton';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { CountdownTimer } from '@/components/countdown-timer';
import { useEffect, useState } from 'react';
import { Bid, Auction } from '@/types/types'; // Adjust the import path
import { socketService } from '@/lib/socketService';

export default function AuctionDetailsPage() {
  const { id } = useParams(); // Get the `id` from the URL
  const {
    data: initialAuction,
    isLoading,
    isError,
  } = useAuctionById(id as string);
  const [auction, setAuction] = useState<Auction | null>(
    initialAuction || null
  );
  const [latestBid, setLatestBid] = useState<Bid | null>(null);

  // Initialize WebSocket connection and join auction room
  useEffect(() => {
    if (id) {
      // Connect to the WebSocket server
      socketService.connect();

      // Join the auction room
      socketService.joinAuctionRoom(id as string);

      // Listen for new bids
      socketService.onNewBid((bid: Bid) => {
        if (bid.auctionId === id) {
          setLatestBid(bid);
          // Update the auction's current price
          setAuction((prevAuction) =>
            prevAuction
              ? { ...prevAuction, currentPrice: bid.amount }
              : prevAuction
          );
        }
      });

      // Listen for auction updates
      socketService.onAuctionUpdate((update: any) => {
        if (update.auctionId === id) {
          setAuction((prevAuction) =>
            prevAuction ? { ...prevAuction, ...update } : prevAuction
          );
        }
      });

      // Listen for outbid notifications
      socketService.onOutbid((notification) => {
        if (notification.auctionId === id) {
          alert(
            `You have been outbid! The new bid is $${notification.newBidAmount.toLocaleString()}`
          );
        }
      });
    }

    // Cleanup: Disconnect and remove listeners when the component unmounts
    return () => {
      socketService.disconnect();
      socketService.removeListeners();
    };
  }, [id]);

  // Update auction state when initial data is fetched
  useEffect(() => {
    if (initialAuction) {
      setAuction(initialAuction);
    }
  }, [initialAuction]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Loading Skeleton */}
            <div className="lg:col-span-4">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
            {/* Middle Column - Loading Skeleton */}
            <div className="lg:col-span-5 space-y-8">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-[150px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
            {/* Right Column - Loading Skeleton */}
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-[150px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-[150px] w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !auction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">Failed to load auction details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className=" px-4 sm:px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <ProductImageCarousel auction={auction} />
          </div>

          {/* Middle Column - Product Details & Bidding */}
          <div className="lg:col-span-5">
            <div className="space-y-8">
              {/* Product Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  {auction.title}
                </h1>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Product Details */}
              <ProductDetails auction={auction} />

              {/* Auction Status */}
              <AuctionStatus
                currentBid={auction.currentPrice}
                startingPrice={auction.startingPrice}
                timeRemaining={auction.endTime}
                progress={66}
              />

              {/* Display the latest bid */}
              {latestBid && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium">New Bid Placed:</p>
                  <p className="text-lg font-bold">
                    ${latestBid.amount.toLocaleString()} by{' '}
                    {latestBid.bidder.name}
                  </p>
                </div>
              )}

              {/* Bid Form */}
              <BidForm
                currentPrice={auction.currentPrice}
                minIncrement={auction.minBidIncrement}
                auctionId={id as string}
              />

              <Separator />

              {/* Catalog Button */}
              <CatalogButton />
            </div>
          </div>

          {/* Right Column - Analytics & Rankings */}
          <div className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-24">
              <CountdownTimer endTime={auction.endTime} />
              <AuctionMetrics auction={auction} />
              <BidderRanking auction={auction} />
              <PriceAnalytics auction={auction} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
