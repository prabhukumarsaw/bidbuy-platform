'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { CountdownTimer } from '../countdown-timer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  ArrowRight,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import { BidCard } from '../bid-card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TrendingBidItem {
  id: number;
  title: string;
  image: string;
  currentBid: number;
  lotNumber: string;
  seller: {
    name: string;
    avatar: string;
  };
  endTime: Date;
  bidders: number;
  category: string;
  description: string;
}

interface TrendingImageItem {
  id: number;
  title: string;
  subtitle: string;
  imageSrc: string;
}

const trendingImages: TrendingImageItem[] = [
  {
    id: 1,
    title: 'Vintage Rolex Watch',
    subtitle: "Classic collector's item from the 1970s",
    imageSrc: '/feature/upcoming-auction-banner-img.webp',
  },
  {
    id: 2,
    title: 'Antique Wooden Chair',
    subtitle: 'Handcrafted masterpiece from the Victorian era',
    imageSrc: '/feature/xx.webp',
  },
  {
    id: 3,
    title: 'Limited Edition Sneakers',
    subtitle: 'Exclusive drop by renowned designer',
    imageSrc: '/feature/dd.webp',
  },
  {
    id: 4,
    title: 'Abstract Painting',
    subtitle: 'Modern art by a celebrated contemporary artist',
    imageSrc: '/feature/abstract-painting.webp',
  },
  {
    id: 5,
    title: 'Luxury Handbag',
    subtitle: 'Premium leather with exquisite detailing',
    imageSrc: '/feature/luxury-handbag.webp',
  },
];

const TrendingBidItems: TrendingBidItem[] = [
  {
    id: 1,
    title: '2023 Hyundai Exter - Limited Edition',
    image: '/image/cars/hyundai-exter.jpg',
    currentBid: 28980.0,
    lotNumber: '137684',
    seller: {
      name: 'Premium Motors',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 376 * 24 * 60 * 60 * 1000),
    bidders: 23,
    category: 'SUV',
    description:
      'Experience luxury and performance with this limited edition Hyundai Exter. Packed with advanced features and a sleek design, this SUV is perfect for both city driving and outdoor adventures.',
  },
  {
    id: 2,
    title: 'Mahindra XUV 3XO - Fully Loaded',
    image: '/image/cars/mahindra-xuv-3xo.jpg',
    currentBid: 34580.0,
    lotNumber: '576894',
    seller: {
      name: 'AutoElite',
      avatar: '/image/cars/placeholder.svg',
    },
    endTime: new Date(Date.now() + 366 * 24 * 60 * 60 * 1000),
    bidders: 31,
    category: 'SUV',
    description:
      "The Mahindra XUV 3XO is a fully loaded SUV that combines power, comfort, and style. With its advanced safety features and spacious interior, it's the perfect vehicle for families and adventure enthusiasts alike.",
  },
  {
    id: 3,
    title: '2023 Mahindra XUV700 - Top Spec',
    image: '/image/cars/mahindra-xuv700.jpg',
    currentBid: 43780.0,
    lotNumber: '289576',
    seller: {
      name: 'LuxeDrive',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 386 * 24 * 60 * 60 * 1000),
    bidders: 42,
    category: 'SUV',
    description:
      'The top-spec Mahindra XUV700 offers unparalleled luxury and performance. With its powerful engine, advanced infotainment system, and premium interiors, this SUV sets a new standard in its class.',
  },
  {
    id: 4,
    title: 'Maruti Suzuki Alto K10 - City Edition',
    image: '/image/cars/maruti-suzuki-alto-k.jpg',
    currentBid: 15635.0,
    lotNumber: '379468',
    seller: {
      name: 'Urban Wheels',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 356 * 24 * 60 * 60 * 1000),
    bidders: 18,
    category: 'Hatchback',
    description:
      "The Maruti Suzuki Alto K10 City Edition is the perfect compact car for urban driving. With its fuel-efficient engine and easy maneuverability, it's ideal for navigating busy city streets and tight parking spaces.",
  },
  {
    id: 5,
    title: '2023 Maruti Suzuki Dzire - Luxury Variant',
    image: '/image/cars/maruti-suzuki-dzire.jpg',
    currentBid: 19635.0,
    lotNumber: '379469',
    seller: {
      name: 'Swift Auctions',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 356 * 24 * 60 * 60 * 1000),
    bidders: 27,
    category: 'Sedan',
    description:
      'Experience luxury in a compact package with the 2023 Maruti Suzuki Dzire. This sedan offers premium features, a spacious interior, and excellent fuel efficiency, making it perfect for both city commutes and long drives.',
  },
  {
    id: 6,
    title: 'Renault Kwid - Adventure Edition',
    image: '/image/cars/renault-kwid.jpg',
    currentBid: 13635.0,
    lotNumber: '379470',
    seller: {
      name: 'EcoRide',
      avatar: '/placeholder.svg',
    },
    endTime: new Date(Date.now() + 356 * 24 * 60 * 60 * 1000),
    bidders: 15,
    category: 'Hatchback',
    description:
      "The Renault Kwid Adventure Edition is designed for those who seek excitement in their daily drive. With its rugged looks, enhanced ground clearance, and feature-packed interior, it's ready for any urban adventure.",
  },
];

export function TrendingAuction() {
  const [visibleItems, setVisibleItems] = useState(4);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const showMore = () => {
    setVisibleItems((prevVisible) =>
      Math.min(prevVisible + 2, TrendingBidItems.length)
    );
  };

  const showLess = () => {
    setVisibleItems((prevVisible) => Math.max(prevVisible - 2, 4));
  };

  const filteredItems = TrendingBidItems.filter(
    (item) =>
      (filter === 'all' || item.category.toLowerCase() === filter) &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              Trending <TrendingUp className="ml-2 text-red-500" />
              <span className="italic font-normal ml-2">Bids</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Discover our hottest auctions right now. These premium vehicles
              are attracting significant attention from enthusiasts and
              collectors alike.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button
              variant="outline"
              onClick={showLess}
              disabled={visibleItems <= 4}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Show Less
            </Button>
            <Button
              variant="outline"
              onClick={showMore}
              disabled={visibleItems >= filteredItems.length}
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
            className="w-full lg:w-3/12 hidden lg:block "
          >
            <div className="sticky top-24">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                effect="fade"
                className="rounded-2xl shadow-2xl overflow-hidden"
              >
                {trendingImages.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        width={400}
                        height={600}
                        className="rounded-2xl shadow-2xl object-cover w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm">{item.subtitle}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
          <div className="w-full lg:w-9/12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredItems.slice(0, visibleItems).map((item, index) => (
                  <BidCard key={item.id} item={item} index={index} />
                ))}
              </AnimatePresence>
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xl text-gray-500">
                  No auctions found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
