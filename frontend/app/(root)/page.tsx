import { TrendingAuction } from '@/components/home/trending-bids';
import { UpcomingAuction } from '@/components/home/upcoming-auction';
import { BannerSection } from '@/components/home/banner';
import { LiveAuction } from '@/components/home/live-auction';

export default function Home() {
  return (
    <>
      <section className="">
        <BannerSection />
      </section>

      <section className="">
        <TrendingAuction />
      </section>

      <section className="">
        <LiveAuction />
      </section>

      <section className="">
        <UpcomingAuction />
      </section>
    </>
  );
}
