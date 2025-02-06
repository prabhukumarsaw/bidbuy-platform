'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

      <SpecialtyGrid />

      <CTASection />
    </section>
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
