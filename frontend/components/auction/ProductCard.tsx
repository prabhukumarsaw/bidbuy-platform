'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { CountdownTimer } from './CountdownTimer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  ArrowRight,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  index: number;
  view: 'grid' | 'list';
}

export default function ProductCard({
  product,
  index,
  view,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Assume we have multiple images for each product
  const images = [
    product.image,
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`w-full ${
        view === 'list' ? 'max-w-full' : 'max-w-sm mx-auto'
      }`}
    >
      <Card
        className={`overflow-hidden h-full flex ${
          view === 'list' ? 'flex-row' : 'flex-col'
        }`}
      >
        <div
          className={`relative ${
            view === 'list' ? 'w-1/3' : 'w-full'
          } aspect-[4/3]`}
        >
          <Image
            src={images[currentImageIndex]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex space-x-2">
            <Badge variant="destructive" className="bg-red-600">
              Live
            </Badge>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {product.category}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            <span>{product.bidders} bidders</span>
          </div>
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 sm:p-2"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 sm:p-2"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
            </>
          )}
        </div>
        <div
          className={`flex flex-col ${view === 'list' ? 'w-2/3' : 'w-full'}`}
        >
          <CardContent
            className={`flex-grow p-3 sm:p-4 ${
              view === 'list' ? 'flex flex-col justify-between' : ''
            }`}
          >
            <div>
              <h3 className="text-base sm:text-lg font-semibold line-clamp-2 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {product.title}
              </h3>
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Current bid:
                  </p>
                  <p className="text-base sm:text-lg font-bold">
                    ${product.currentBid.toLocaleString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  {product.condition}
                </Badge>
              </div>
              <CountdownTimer endTime={new Date(product.endTime)} />
            </div>
            <div className="flex items-center justify-between mt-2 sm:mt-4">
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
                  <AvatarImage src={product.seller.avatar} />
                  <AvatarFallback>
                    {product.seller.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs sm:text-sm font-medium">
                  {product.seller.name}
                </span>
              </div>
              <Badge variant="secondary">
                Rating:{' '}
                {product?.seller?.rating != null
                  ? product.seller.rating.toFixed(1)
                  : 'N/A'}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-3 sm:p-4 pt-0 flex justify-between items-center">
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          isLiked
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-500'
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isLiked ? 'Remove from favorites' : 'Add to favorites'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                  >
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{product.title}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative aspect-video">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <DialogDescription>
                        {product.description}
                      </DialogDescription>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Auction Details:</h4>
                        <p>Lot Number: {product.lotNumber}</p>
                        <p>
                          Current Bid: ${product.currentBid.toLocaleString()}
                        </p>
                        <p>Bidders: {product.bidders}</p>
                        <p>Seller: {product.seller.name}</p>
                        <p>Condition: {product.condition}</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Link href={`/auction/${product.id}`}>
              <Button
                variant="default"
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
              >
                Bid Now{' '}
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
