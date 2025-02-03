// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CountdownTimer } from '../countdown-timer';
import { Button } from '../ui/button';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { BidCard } from '../bid-card';
import { AuctionItem } from '@/types/types';

interface AuctionProps {
  auctions: AuctionItem[];
}

// Function to map AuctionItem to UpcomingAuctionItem
const mapAuctionToActiveItem = (auction: AuctionItem): AuctionProps => {
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

export function LiveAuction({ auctions }: AuctionProps) {
  const [visibleItems, setVisibleItems] = useState(4);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Filter active/live auctions (status: "ACTIVE")
  const activeAuctions = auctions.filter(
    (auction) => auction.status === 'ACTIVE'
  );

  // Map active auctions to UpcomingAuctionItem structure
  const ActiveAuctionItems = activeAuctions.map(mapAuctionToActiveItem);
  console.log(ActiveAuctionItems, 'egeknejn');

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
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              Live <TrendingUp className="ml-2 text-red-500" />
              <span className="italic font-normal ml-2">Bids</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Discover our curated selection of premium vehicles set for
              auction. Each car represents a unique opportunity for enthusiasts
              and collectors alike.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              variant="outline"
              className="mr-2"
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
            className="w-full lg:w-3/12 hidden lg:block"
          >
            <div className="sticky top-24">
              <Image
                src="/feature/upcoming-auction-banner-img.webp"
                alt="Upcoming Auctions"
                width={400}
                height={600}
                className="rounded-2xl shadow-2xl object-cover w-full h-auto"
              />
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
                  No active auctions found. Try adjusting your search or
                  filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
