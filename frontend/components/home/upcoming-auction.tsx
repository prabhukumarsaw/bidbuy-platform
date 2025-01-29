'use client';

import * as React from 'react';
import Image from 'next/image';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CountdownTimer } from '../countdown-timer';
import Link from 'next/link';
import type { AuctionItem } from '@/types/types';

interface AuctionProps {
  auctions: AuctionItem[];
}

const MapUpcomingAuctionItem = (auction: AuctionItem): AuctionItem => ({
  ...auction,
  title: auction.title,
  featuredImage: auction.featuredImage,
  currentPrice: auction.currentPrice,
  seller: auction.seller,
  endTime: new Date(auction.endTime).toISOString(),
  totalBids: auction.totalBids || 0,
  category: auction.category,
  description: auction.description,
});

export function UpcomingAuction({ auctions }: AuctionProps) {
  const upcomingAuctions = auctions.filter(
    (auction) => auction.status === 'SCHEDULED'
  );

  const UpcomingAuctionItem = upcomingAuctions.map(MapUpcomingAuctionItem);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center">
            Upcoming <TrendingUp className="ml-2 text-red-500" />
            <span className="italic font-normal ml-2">Bids</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Feel free to adapt this based on the specific managed services,
            features
          </p>
        </div>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {UpcomingAuctionItem.map((item, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card className="relative overflow-hidden group">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-indigo-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Upcoming
                  </span>
                </div>
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={item.featuredImage || '/placeholder.svg'}
                      alt={item.title}
                      fill
                      className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <CountdownTimer endTime={item.startTime} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Starting bid:
                        </p>
                        <p className="text-lg font-bold">
                          ${item.currentPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Lot #{' '}
                          <span className="font-semibold text-black">
                            {item.id}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate max-w-[50%]">
                        {item.seller.businessName}
                      </span>
                      <Link href={`/auction/${item.id}`}>
                        <Button
                          variant="default"
                          size="sm"
                          className="transition-all duration-300 hover:scale-105"
                        >
                          View Auction
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-12" />
        <CarouselNext className="hidden sm:flex -right-4 sm:-right-12" />
      </Carousel>
    </div>
  );
}
