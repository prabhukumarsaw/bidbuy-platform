'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderBannerProps {
  title: string;
  subtitle: string;
  bgImage?: string;
  ctaLink?: string;
  badge?: string;
}

export default function HeaderBanner({
  title,
  subtitle,
  bgImage,
  badge,
}: HeaderBannerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  useEffect(() => {
    if (bgImage) {
      const img = new Image();
      img.src = bgImage;
      img.onload = handleImageLoad;
    }
  }, [bgImage, handleImageLoad]);

  return (
    <div
      ref={bannerRef}
      className="relative w-full h-[15vh] sm:h-[15vh] md:h-[25vh] lg:h-[30vh] xl:h-[40vh] overflow-hidden rounded-lg"
    >
      {bgImage && imageLoaded ? (
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-x" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex flex-col items-center justify-center text-center p-4">
        <h1
          className={cn(
            'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200 mb-4'
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            'text-sm sm:text-md md:text-xl text-center mb-8 max-w-xl mx-auto leading-relaxed text-gray-200'
          )}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
