import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { CountdownTimer } from './countdown-timer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Info, ArrowRight, Heart, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

interface BidCardProps {
  item: {
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
  };
  index: number;
}

export const BidCard: React.FC<BidCardProps> = ({ item, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const progress = (item.bidders / 50) * 100; // Assuming 50 is the max number of bidders

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden group h-full">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-3/6 aspect-[4/3] md:aspect-auto overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 left-2 flex space-x-2">
              <Badge variant="destructive" className="bg-red-600">
                Live
              </Badge>
              <Badge variant="secondary" className="bg-blue-600 text-white">
                {item.category}
              </Badge>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full">
              <Users className="w-4 h-4 inline mr-1" />
              <span>{item.bidders} bidders</span>
            </div>
          </div>
          <CardContent className="p-4 flex-grow flex flex-col justify-between md:w-3/6">
            <div>
              <div className="flex justify-start items-start mb-2">
                <h3 className="text-md font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 flex-grow">
                  {item.title}
                </h3>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">Current bid:</p>
                  <p className="text-md font-bold">
                    ${item.currentBid.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Lot #{' '}
                    <span className="font-semibold  text-sm">
                      {' '}
                      {item.lotNumber}
                    </span>
                  </p>
                </div>
              </div>

              <CountdownTimer endTime={item.endTime} />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={item.seller.avatar} />
                    <AvatarFallback>
                      {item.seller.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {item.seller.name}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 flex-row justify-around ">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors duration-300 rounded-full p-2"
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isLiked ? 'fill-red-500 text-red-500' : 'text-black'
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
                      variant="ghost"
                      size="icon"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors duration-300 rounded-full p-2"
                    >
                      <Eye className="h-4 w-4 text-black" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative aspect-video">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <DialogDescription>
                          {item.description}
                        </DialogDescription>
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">
                            Auction Details:
                          </h4>
                          <p>Lot Number: {item.lotNumber}</p>
                          <p>
                            Current Bid: ${item.currentBid.toLocaleString()}
                          </p>
                          <p>Bidders: {item.bidders}</p>
                          <p>Seller: {item.seller.name}</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Link href={`/auction/${item.lotNumber}`}>
                  <Button variant="action">
                    Place Bid <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};
