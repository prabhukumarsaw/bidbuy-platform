'use client';

import { ProductImageCarousel } from '@/components/product/ProductImageCarousel';
import { ProductDetails } from '@/components/product/ProductDetails';
import { AuctionStatus } from '@/components/auction-detail/AuctionStatus';
import { AuctionMetrics } from '@/components/auction-detail/AuctionMetrics';
import { PriceAnalytics } from '@/components/auction-detail/PriceAnalytics';
import { BidForm } from '@/components/bidding/BidForm';
import { BidderRanking } from '@/components/bidding/BidderRanking';
import { Separator } from '@/components/ui/separator';
import { CatalogButton } from '@/components/catalog/CatalogButton';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <main className="containe px-6 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <ProductImageCarousel />
          </div>

          {/* Middle Column - Product Details & Bidding */}
          <div className="lg:col-span-5">
            <div className="space-y-8">
              <ProductDetails />
              <AuctionStatus
                currentBid={125}
                startingPrice={100}
                timeRemaining="3 days, 4 hours remaining"
                progress={66}
              />
              <BidForm
                currentPrice={125}
                minIncrement={5}
                onBidSubmit={(amount) => console.log('Bid submitted:', amount)}
              />
              <Separator />
              <CatalogButton />
            </div>
          </div>

          {/* Right Column - Analytics & Rankings */}
          <div className="lg:col-span-3">
            <div className="space-y-6 lg:sticky lg:top-24">
              <AuctionMetrics />
              <BidderRanking />
              <PriceAnalytics />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
