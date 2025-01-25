'use client';
import { TrendingAuction } from '@/components/home/trending-bids';
import { UpcomingAuction } from '@/components/home/upcoming-auction';
import { BannerSection } from '@/components/home/banner';
import { LiveAuction } from '@/components/home/live-auction';
import { AuctionsCarousel } from '@/components/home/auctions-carousel';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';

export default function Home() {
  const { auctionsResponse, isLoading } = useAdvancedFilters(1, 10); // Initial page and limit

  // Extract auctions from the response
  const auctions = auctionsResponse?.auctions || [];

  // Filter auctions based on status (if needed)
  const activeAuctions = auctions.filter(
    (auction) => auction.status === 'ACTIVE'
  );
  const upcomingAuctions = auctions.filter(
    (auction) => new Date(auction.startTime) > new Date()
  );
  const trendingAuctions = auctions.filter((auction) => auction.totalBids > 0); // Example logic for trending auctions

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log('activeAuctions', activeAuctions);

  return (
    <>
      {/* Auctions Carousel */}
      <section className="">
        <AuctionsCarousel
          auctions={activeAuctions}
          autoSlideInterval={3000} // 3 seconds per slide
          showNavigation={true} // Show next/prev buttons
          showPagination={true} // Show dots indicator
          className="my-custom-class" // Custom class for styling
        />
      </section>

      {/* Banner Section (if needed) */}
      <section className="">
        <BannerSection />
      </section>

      {/* Trending Auctions */}
      <section className="">
        <TrendingAuction auctions={trendingAuctions} />
      </section>

      {/* Live Auctions */}
      <section className="">
        <LiveAuction auctions={activeAuctions} />
      </section>

      {/* Upcoming Auctions */}
      <section className="">
        {/* <UpcomingAuction auctions={upcomingAuctions} /> */}
      </section>
    </>
  );
}
