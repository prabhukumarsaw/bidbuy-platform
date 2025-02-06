// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AuctionItem } from '@/types/types';

interface ProductDetailsProps {
  auction: AuctionItem;
}

export function ProductImageCarousel({ auction }: ProductDetailsProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const images = [auction.featuredImage, ...auction.images];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const previousImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  // Handle touch gestures for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 50) {
      previousImage(); // Swipe right
    } else if (deltaX < -50) {
      nextImage(); // Swipe left
    }

    setTouchStartX(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') previousImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextImage();
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [autoPlay, currentImage]);

  return (
    <div className="relative group flex flex-col lg:flex-row gap-4">
      {/* Thumbnails on the Left Side */}
      <div className="lg:w-1/6 flex lg:flex-col gap-2 order-2 lg:order-1">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={cn(
              'relative aspect-square overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105',
              'w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-24', // Adjusts thumbnail size
              currentImage === index && 'ring-2 ring-violet-600 ring-offset-2'
            )}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="object-cover"
              layout="fill"
              loading="lazy" // Lazy load thumbnails
            />
            {index === 4 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                +{images.length - 5}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="lg:w-5/6 relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-lg order-1 lg:order-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Fullscreen Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0">
            <div className="relative aspect-[4/3]">
              <img
                src={images[currentImage]}
                alt={`Full view ${currentImage + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Image */}
        <img
          src={images[currentImage]}
          alt={`View ${currentImage + 1}`}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500',
            isZoomed && 'scale-150'
          )}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        />

        {/* Navigation Arrows */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Image Count */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImage + 1} / {images.length}
        </div>

        {/* Auto-play Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAutoPlay(!autoPlay)}
          className="absolute bottom-2 right-2 bg-black/50 text-white hover:bg-black/70"
        >
          {autoPlay ? '⏸️' : '▶️'}
        </Button>
      </div>
    </div>
  );
}
