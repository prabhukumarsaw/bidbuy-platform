'use client';

import * as React from 'react';
import { AuctionCarousel } from './carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface AuctionsCarouselProps {
  auctions: AuctionData[];
  autoSlideInterval?: number; // Auto-slide interval in milliseconds
  showNavigation?: boolean; // Show/hide navigation buttons
  showPagination?: boolean; // Show/hide pagination (dots)
  className?: string; // Custom class for the carousel container
}

/**
 * A production-ready carousel component for displaying auctions using CSS Scroll Snapping.
 * Displays a single slide at a time with smooth scrolling, snapping behavior, and auto-slide functionality.
 */
export function AuctionsCarousel({
  auctions,
  autoSlideInterval = 5000, // Default to 5 seconds
  showNavigation = true,
  showPagination = true,
  className = '',
}: AuctionsCarouselProps) {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false); // Pause auto-slide on hover

  // Handle empty auctions array
  if (!auctions || auctions.length === 0) {
    return (
      <div className="text-center text-gray-500">No auctions available</div>
    );
  }

  // Scroll to a specific slide
  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  // Handle next/previous slide navigation
  const goToNextSlide = () => {
    const nextIndex = (currentIndex + 1) % auctions.length;
    scrollToSlide(nextIndex);
  };

  const goToPrevSlide = () => {
    const prevIndex = (currentIndex - 1 + auctions.length) % auctions.length;
    scrollToSlide(prevIndex);
  };

  // Handle scroll events to update the current index
  const handleScroll = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / slideWidth);
      setCurrentIndex(newIndex);
    }
  };

  // Auto-slide functionality
  React.useEffect(() => {
    if (isHovered || !autoSlideInterval) return; // Pause auto-slide on hover or if interval is 0

    const interval = setInterval(() => {
      goToNextSlide();
    }, autoSlideInterval);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex, isHovered, autoSlideInterval]);

  return (
    <div
      className={`relative ${className}`}
      data-testid="auctions-carousel"
      onMouseEnter={() => setIsHovered(true)} // Pause auto-slide on hover
      onMouseLeave={() => setIsHovered(false)} // Resume auto-slide on mouse leave
    >
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        onScroll={handleScroll}
        role="region"
        aria-label="Auctions Carousel"
      >
        {auctions.map((auction, index) => (
          <div
            key={auction.id}
            className="w-full flex-shrink-0 snap-start"
            style={{ width: '100%' }} // Ensure each slide takes full width
            aria-label={`Slide ${index + 1}`}
          >
            <AuctionCarousel auction={auction} />
          </div>
        ))}
      </div>

      {/* Modern Navigation Buttons */}
      {showNavigation && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
          <button
            className="rounded-full bg-white/10 backdrop-blur-md p-3 hover:bg-white/20 transition-all duration-300"
            onClick={goToPrevSlide}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            className="rounded-full bg-white/10 backdrop-blur-md p-3 hover:bg-white/20 transition-all duration-300"
            onClick={goToNextSlide}
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      )}

      {/* Modern Dots Indicator */}
      {showPagination && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {auctions.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-white' : 'bg-white/50'
              }`}
              onClick={() => scrollToSlide(index)}
              aria-label={`Go to Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
