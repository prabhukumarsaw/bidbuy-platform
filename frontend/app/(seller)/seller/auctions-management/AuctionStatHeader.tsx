import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { AuctionStats } from '@/types/types';

interface StatsBarProps {
  stats?: AuctionStats;
  isLoading: boolean;
}

export function AuctionStatHeader({ stats, isLoading }: StatsBarProps) {
  console.log('stst', stats);

  const statItems = [
    {
      label: 'Total Auctions',
      value: stats?.totalAuctions || 0,
      icon: <Icons.box className="h-4 w-4" />,
      trend: '+5%',
      trendUp: true,
    },
    {
      label: 'Active Auctions',
      value: stats?.activeAuctions || 0,
      icon: <Icons.activity className="h-4 w-4" />,
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Completed Auctions',
      value: stats?.completedAuctions || 0,
      icon: <Icons.checkCircle className="h-4 w-4" />,
      trend: '+3%',
      trendUp: true,
    },
    {
      label: 'Total Revenue',
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0',
      icon: <Icons.dollarSign className="h-4 w-4" />,
      trend: '+8%',
      trendUp: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-7 w-[100px] mb-4" />
              <Skeleton className="h-4 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <h3 className="text-2xl font-bold">{item.value}</h3>
                </div>
              </div>
              <div
                className={`flex items-center ${
                  item.trendUp ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {item.trendUp ? (
                  <Icons.trendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <Icons.trendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{item.trend}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
