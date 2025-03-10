// @ts-nocheck

'use client';
import { TrendingAuction } from '@/components/home/trending-bids';
import { UpcomingAuction } from '@/components/home/upcoming-auction';
import { BannerSection } from '@/components/home/banner';
import { LiveAuction } from '@/components/home/live-auction';
import { AuctionsCarousel } from '@/components/home/auctions-carousel';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { Suspense } from 'react';
import Loading from '../loading';

export default function Home() {
  const { auctionsResponse, isLoading } = useAdvancedFilters(1, 10);

  // Extract auctions from the response
  const auctions = auctionsResponse?.auctions || [];

  // Filter auctions based on status
  const activeAuctions = auctions.filter(
    (auction) => auction.status === 'ACTIVE'
  );

  const upcomingAuctions = auctions.filter(
    (auction) => new Date(auction.startTime).getTime() > new Date().getTime()
  );
  
  const trendingAuctions = auctions.filter((auction) => auction.totalBids > 0);

  if (isLoading) {
    return <Loading />; 
  }


  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* Auctions Carousel */}
        <section>
          <AuctionsCarousel
            auctions={activeAuctions}
            autoSlideInterval={3000}
            showNavigation={true}
            showPagination={true}
            className="my-custom-class"
          />
        </section>

        {/* Banner Section */}
        <section>
          <BannerSection />
        </section>

        {/* Trending Auctions */}
        <section>
          <TrendingAuction auctions={trendingAuctions} />
        </section>

        {/* Live Auctions */}
        <section>
          <LiveAuction auctions={activeAuctions} />
        </section>

        {/* Upcoming Auctions */}
        <section>
          <UpcomingAuction auctions={upcomingAuctions} />
        </section>
      </Suspense>
    </>
  );
}
