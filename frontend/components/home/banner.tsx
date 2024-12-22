'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  DollarSign,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCarousel } from '@/hooks/useCarousel';
import { SpecialtyGrid } from './SpecialtyGrid';

const heroImages = [
  { src: '/feature/cyber-1.jpg', alt: 'Cybernetic arm enhancement' },
  { src: '/feature/cyber-2.jpg', alt: 'Futuristic cityscape' },
  { src: '/feature/cyber-3.jpg', alt: 'High-tech weapon auction' },
  { src: '/feature/cyber-4.jpg', alt: 'Advanced cybernetic implants' },
];

export function BannerSection() {
  const { currentSlide, nextSlide, prevSlide, goToSlide } = useCarousel(
    heroImages.length
  );
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] pointer-events-none" />

      <div className="relative mx-auto container p-2">
        <div
          className="relative overflow-hidden rounded-lg shadow-2xl aspect-[16/9] md:aspect-[21/6]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <AnimatePresence initial={false} custom={currentSlide}>
            {heroImages.map((image, index) => (
              <motion.div
                key={image.src}
                custom={index}
                variants={slideVariants}
                initial="enter"
                animate={index === currentSlide ? 'center' : 'exit'}
                exit="exit"
                className={cn(
                  'absolute inset-0 w-full h-full',
                  index === currentSlide ? 'z-20' : 'z-10'
                )}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent z-30" />

          <CarouselContent currentSlide={currentSlide} />

          <CarouselControls
            prevSlide={prevSlide}
            nextSlide={nextSlide}
            goToSlide={goToSlide}
            totalSlides={heroImages.length}
            currentSlide={currentSlide}
            isHovering={isHovering}
          />
        </div>
      </div>

      <SpecialtyGrid />

      <CTASection />
    </section>
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

function CarouselContent({ currentSlide }: { currentSlide: number }) {
  return (
    <motion.div
      className="absolute bottom-8 left-8 right-8 z-40 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        Featured Auction
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl mb-6">
        Cutting-edge cybernetic enhancements
      </p>
      <div className="flex flex-wrap gap-4">
        <Badge
          variant="secondary"
          className="text-sm md:text-lg px-3 py-1 md:px-4 md:py-2 bg-blue-500/50 backdrop-blur-sm"
        >
          <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Ending in 2h 35m
        </Badge>
        <Badge
          variant="secondary"
          className="text-sm md:text-lg px-3 py-1 md:px-4 md:py-2 bg-green-500/50 backdrop-blur-sm"
        >
          <DollarSign className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Current Bid: 5000 €$
        </Badge>
      </div>
    </motion.div>
  );
}

function CarouselControls({
  prevSlide,
  nextSlide,
  goToSlide,
  totalSlides,
  currentSlide,
  isHovering,
}: {
  prevSlide: () => void;
  nextSlide: () => void;
  goToSlide: (index: number) => void;
  totalSlides: number;
  currentSlide: number;
  isHovering: boolean;
}) {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'absolute top-1/2 left-4 transform -translate-y-1/2 rounded-full bg-purple-500/10 backdrop-blur-sm text-white hover:bg-purple-500 hover:text-white z-40 transition-all duration-300',
          isHovering ? 'opacity-100' : 'opacity-0'
        )}
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
        <span className="sr-only">Previous slide</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'absolute top-1/2 right-4 transform -translate-y-1/2 rounded-full bg-purple-500/10 backdrop-blur-sm text-white hover:bg-purple-500 hover:text-white z-40 transition-all duration-300',
          isHovering ? 'opacity-100' : 'opacity-0'
        )}
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
        <span className="sr-only">Next slide</span>
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              index === currentSlide
                ? 'bg-purple-500 scale-125'
                : 'bg-white/50 hover:bg-white/75'
            )}
            onClick={() => goToSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function CTASection() {
  return (
    <div className="relative z-10 bg-gradient-to-r from-blue-900 via-purple-900 to-violet-900 py-8 px-4 md:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <span className="font-semibold text-2xl md:text-3xl mb-6 md:mb-0 text-center md:text-left text-white">
          Ready to Start Bidding?
        </span>
        <Button
          size="lg"
          className="bg-white text-blue-900 hover:bg-blue-100 flex items-center px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl w-full md:w-auto justify-center text-xl"
        >
          <Phone className="mr-3 h-6 w-6" />
          Call Us +91 8987999200
        </Button>
      </div>
    </div>
  );
}
