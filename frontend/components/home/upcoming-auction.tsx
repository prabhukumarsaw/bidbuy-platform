// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CountdownTimer } from '../countdown-timer';
import Link from 'next/link';

interface AuctionItem {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  lotNumber: string;
  seller: {
    name: string;
    avatar: string;
  };
  endTime: Date;
}

const auctionItems: AuctionItem[] = [
  {
    id: 'ICNB-34',
    title: 'Hyundai Exter',
    image: '/image/cars/hyundai-exter.jpg',
    currentBid: 2898.0,
    lotNumber: '137684',
    seller: {
      name: 'Egens lab',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 376 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ICNB-35',
    title: 'Mahindra xuv 3xo',
    image: '/image/cars/mahindra-xuv-3xo.jpg',
    currentBid: 9458.0,
    lotNumber: '576894',
    seller: {
      name: 'Egens lab',
      avatar: '/image/cars/placeholder.svg',
    },
    endTime: new Date(Date.now() + 366 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ICNB-36',
    title: 'Mahindra xuv700',
    image: '/image/cars/mahindra-xuv700.jpg',
    currentBid: 3780.0,
    lotNumber: '289576',
    seller: {
      name: 'Egens lab',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 386 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ICNB-37',
    title: 'Maruti Suzuki Alto K',
    image: '/image/cars/maruti-suzuki-alto-k.jpg',
    currentBid: 5635.0,
    lotNumber: '379468',
    seller: {
      name: 'Egens lab',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 356 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ICNB-31',
    title: 'Maruti Suzuki Dzire',
    image: '/image/cars/maruti-suzuki-dzire.jpg',
    currentBid: 5635.0,
    lotNumber: '379468',
    seller: {
      name: 'Egens lab',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 356 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ICNB-33',
    title: 'Renault Kwid',
    image: '/image/cars/renault-kwid.jpg',
    currentBid: 5635.0,
    lotNumber: '379468',
    seller: {
      name: 'Egens lab',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 356 * 24 * 60 * 60 * 1000),
  },
];

export function UpcomingAuction() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            Upcoming <TrendingUp className="ml-2 text-red-500" />
            <span className="italic font-normal ml-2">Bids</span>
          </h1>
          <p className="text-muted-foreground">
            Feel free adapt this based on the specific managed services,
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
          {auctionItems.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    Live
                  </span>
                </div>
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <CountdownTimer endTime={item.endTime} />
                    <h3 className="text-lg font-semibold mt-4 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Starting bid:
                        </p>
                        <p className="text-xl font-bold">
                          ${item.currentBid.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Lot #</p>
                        <p className="text-sm">{item.lotNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={item.seller.avatar} />
                          <AvatarFallback>EL</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{item.seller.name}</span>
                      </div>
                      <Link href={`/auction/${item.id}`}>
                        <Button variant="default">Bid Now</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12" />
        <CarouselNext className="hidden md:flex -right-12" />
      </Carousel>
    </div>
  );
}
