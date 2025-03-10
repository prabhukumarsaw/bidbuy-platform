// eslint-disable-next-line
// @ts-nocheck

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { CountdownTimer } from '../countdown-timer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  ArrowRight,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import { BidCard } from '../bid-card';
import { AuctionItem } from '@/types/types';

interface AuctionProps {
  auctions: AuctionItem;
}

const trendingImages = [
  {
    id: 1,
    title: 'Vintage Rolex Watch',
    subtitle: "Classic collector's item from the 1970s",
    imageSrc: '/feature/upcoming-auction-banner-img.webp',
  },
  {
    id: 2,
    title: 'Antique Wooden Chair',
    subtitle: 'Handcrafted masterpiece from the Victorian era',
    imageSrc: '/feature/xx.webp',
  },
  {
    id: 3,
    title: 'Limited Edition Sneakers',
    subtitle: 'Exclusive drop by renowned designer',
    imageSrc: '/feature/dd.webp',
  },
  {
    id: 4,
    title: 'Abstract Painting',
    subtitle: 'Modern art by a celebrated contemporary artist',
    imageSrc: '/feature/abstract-painting.webp',
  },
  {
    id: 5,
    title: 'Luxury Handbag',
    subtitle: 'Premium leather with exquisite detailing',
    imageSrc: '/feature/luxury-handbag.webp',
  },
];

// Function to map AuctionItem to UpcomingAuctionItem
const mapAuctionToTrendingItem = (auction: AuctionItem): AuctionProps => {
  return {
    id: auction.id, // Convert ID to a number
    title: auction.title,
    image: auction.featuredImage,
    currentBid: auction.currentPrice,
    lotNumber: auction.id, // Use auction ID as lot number
    seller: {
      name: auction.seller?.businessName || 'Unknown Seller',
      avatar: '/placeholder.svg', // Default avatar
    },
    endTime: new Date(auction.endTime),
    bidders: auction.totalBids || 0,
    category: auction.category?.name || 'Uncategorized',
    description: auction.description,
  };
};

export function TrendingAuction({ auctions }: AuctionProps) {
  const [visibleItems, setVisibleItems] = useState(4);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Filter Trending auctions (status: "ACTIVE")
  const trendingAuctions = auctions.filter(
    (auction) => auction.status === 'ACTIVE'
  );

  // Map active auctions to UpcomingAuctionItem structure
  const ActiveAuctionItems = trendingAuctions.map(mapAuctionToTrendingItem);

  const showMore = () => {
    setVisibleItems((prevVisible) =>
      Math.min(prevVisible + 2, ActiveAuctionItems.length)
    );
  };

  const showLess = () => {
    setVisibleItems((prevVisible) => Math.max(prevVisible - 2, 4));
  };

  useEffect(() => {
    if (inView) {
      // Trigger any animations or load more content when the component is in view
    }
  }, [inView]);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between mb-12"
        >
          <div>
            <h1 className="md:text-4xl sm:text-md font-bold mb-2 flex items-center">
              Trending <TrendingUp className="ml-2 text-red-500" />
              <span className="italic font-normal ml-2">Bids</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Discover our hottest auctions right now. These premium vehicles
              are attracting significant attention from enthusiasts and
              collectors alike.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button
              variant="outline"
              onClick={showLess}
              disabled={visibleItems <= 4}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Show Less
            </Button>
            <Button
              variant="outline"
              onClick={showMore}
              disabled={visibleItems >= ActiveAuctionItems.length}
            >
              Show More <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-3/12 hidden lg:block "
          >
            <div className="sticky top-24">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                effect="fade"
                className="rounded-2xl shadow-2xl overflow-hidden"
              >
                {trendingImages.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        width={400}
                        height={600}
                        className="rounded-2xl shadow-2xl object-cover w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm">{item.subtitle}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
          <div className="w-full lg:w-9/12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {ActiveAuctionItems.slice(0, visibleItems).map(
                  (item, index) => (
                    <BidCard key={item.id} item={item} index={index} />
                  )
                )}
              </AnimatePresence>
            </div>
            {ActiveAuctionItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xl text-gray-500">
                  No auctions found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
