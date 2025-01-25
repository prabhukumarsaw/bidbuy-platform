'use client';

import * as React from 'react';
import Image from 'next/image';
import { Timer, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface AuctionData {
  id: string;
  title: string;
  description: string;
  currentPrice: number;
  startTime: string;
  endTime: string;
  featuredImage: string;
  images: string[];
  status: string;
}

interface AuctionCarouselProps {
  auction: AuctionData;
}

export function AuctionCarousel({ auction }: AuctionCarouselProps) {
  const allImages = [
    auction.featuredImage,
    ...auction.images,
    ...Array(4 - auction.images.length).fill('/placeholder.svg'),
  ].slice(0, 5);

  const calculateTimeRemaining = () => {
    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} Days`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card className="group relative overflow-hidden bg-black">
      <div className="relative">
        <Badge
          variant="secondary"
          className="absolute left-4 top-4 z-20 bg-white/10 backdrop-blur-md text-white border-0"
        >
          <Star className="mr-1 h-3 w-3 fill-white" /> FEATURED
        </Badge>

        <div className="grid md:grid-cols-[60%_40%]">
          <div className="relative aspect-[16/10] md:aspect-[16/11] overflow-hidden">
            <Image
              src={allImages[0] || '/placeholder.svg'}
              alt={auction.title}
              fill
              className="object-cover"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-2 leading-tight">
                {auction.title}
              </h2>
              <p className="text-white/90 text-sm md:text-base line-clamp-2 leading-relaxed">
                {auction.description}
              </p>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 z-10">
              <Timer className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium tracking-wide">
                {calculateTimeRemaining()}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 z-10">
              <span className="text-white/75 text-sm">Bid</span>
              <span className="text-white font-bold">
                ${auction.currentPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 grid-rows-2">
            {allImages.slice(1).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`${auction.title} - View ${index + 2}`}
                  fill
                  className="object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
