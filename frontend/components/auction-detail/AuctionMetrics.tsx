import { TrendingUp, Users, Clock, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AuctionItem } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProductDetailsProps {
  auction: AuctionItem | undefined;
  isLoading?: boolean;
}

export function AuctionMetrics({ auction, isLoading }: ProductDetailsProps) {
  // Calculate time remaining (example: assuming auction has an `endTime` field)
  const timeRemaining = auction
    ? new Date(auction.endTime).getTime() - Date.now()
    : 0;

  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Metrics data
  const metrics = [
    {
      icon: Activity,
      title: 'Bid Activity',
      value: isLoading ? (
        <Skeleton className="h-6 w-16" />
      ) : (
        `${auction?._count?.bids || 0} Bids`
      ),
      description: 'Total number of bids placed on this auction.',
    },
    {
      icon: Users,
      title: 'Watchers',
      value: isLoading ? (
        <Skeleton className="h-6 w-16" />
      ) : (
        auction?.views || 0
      ),
      description: 'Number of users watching this auction.',
    },
    // {
    //   icon: Clock,
    //   title: 'Time Remaining',
    //   value: isLoading ? (
    //     <Skeleton className="h-6 w-16" />
    //   ) : hoursRemaining > 0 ? (
    //     `${hoursRemaining}h ${minutesRemaining}m`
    //   ) : (
    //     'Ended'
    //   ),
    //   description: 'Time left until the auction ends.',
    // },
    // {
    //   icon: TrendingUp,
    //   title: 'Trending',
    //   value: isLoading ? (
    //     <Skeleton className="h-6 w-16" />
    //   ) : (
    //     `${auction?.trendingScore || 0}%`
    //   ),
    //   description: 'Popularity score based on bids and views.',
    // },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {metrics.map((metric, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="flex flex-col items-center text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                <metric.icon className="h-6 w-6 text-violet-600 dark:text-violet-400 mb-1" />
                <span className="font-semibold text-base">{metric.value}</span>
                <span className="text-xs text-muted-foreground">
                  {metric.title}
                </span>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>{metric.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
