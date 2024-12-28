'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const images = [
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=90',
  'https://images.unsplash.com/photo-1569124589354-615739ae007b?w=1200&q=90',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=90',
  'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=1200&q=90',
];

export function ProductImageCarousel() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const previousImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
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
          <DialogContent className="max-w-4xl">
            <div className="relative aspect-[4/3]">
              <img
                src={images[currentImage]}
                alt={`Full view ${currentImage + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>

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
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={cn(
              'relative overflow-hidden rounded-md',
              'w-20 h-16 sm:w-24 sm:h-20', // Adjusts thumbnail size
              currentImage === index && 'ring-2 ring-violet-600 ring-offset-2'
            )}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="rounded-md object-cover"
              layout="fill"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
