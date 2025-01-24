'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from '@/components/ui/chart';
import { useAuctionBids } from '@/hooks/useBackground';
import { formatDate, formatCurrency } from '@/utils/BidUtils';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface BidderRankingProps {
  auctionId: string;
}

export function PriceAnalytics({ auctionId }: BidderRankingProps) {
  const { data: bidsData, isLoading, isError } = useAuctionBids(auctionId);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | 'all'>(
    'all'
  );

  if (isLoading)
    return (
      <Card className="p-4">
        <CardContent>Loading...</CardContent>
      </Card>
    );
  if (isError)
    return (
      <Card className="p-4">
        <CardContent>Error loading bid data</CardContent>
      </Card>
    );

  const now = new Date().getTime();
  const timeRanges = {
    '1h': now - 3600000,
    '24h': now - 86400000,
    '7d': now - 604800000,
    all: 0,
  };

  const chartData = bidsData
    .filter((bid) => new Date(bid.createdAt).getTime() > timeRanges[timeRange])
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((bid) => ({
      time: new Date(bid.createdAt).getTime(),
      amount: bid.amount,
      bidder: bid.bidder,
    }));

  const latestBid = chartData[chartData.length - 1];
  const initialBid = chartData[0];
  const bidIncrease = latestBid.amount - initialBid.amount;
  const bidIncreasePercentage = (
    (bidIncrease / initialBid.amount) *
    100
  ).toFixed(2);

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-lg ">
      <CardHeader>
        <CardDescription className="flex items-center space-x-2">
          <span>Current bid: {formatCurrency(latestBid.amount)}</span>
          <Badge variant={bidIncrease >= 0 ? 'success' : 'destructive'}>
            {bidIncrease >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(bidIncrease))} / {bidIncreasePercentage}%
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as typeof timeRange)}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="1h">1h</TabsTrigger>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        <ChartContainer
          config={{
            amount: {
              label: 'Bid Amount',
              color: 'hsl(var(--primary))',
            },
          }}
          className="h-[300px] mt-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground) / 0.2)"
              />
              <XAxis
                dataKey="time"
                tickFormatter={(time) => formatDate(new Date(time))}
                type="number"
                domain={['dataMin', 'dataMax']}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                domain={['dataMin', 'dataMax']}
                stroke="hsl(var(--muted-foreground))"
              />
              <ReferenceLine
                y={initialBid.amount}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                fill="url(#colorAmount)"
                strokeWidth={2}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <ChartTooltipContent>
                        <div className="flex flex-col gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-muted-foreground">
                            {formatDate(new Date(data.time))}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(data.amount)}
                          </p>
                          <div className="text-sm text-muted-foreground">
                            <p className="font-semibold">{data.bidder.name}</p>
                            <p className="text-xs">{data.bidder.email}</p>
                            <p className="text-xs text-gray-500">
                              ID: {data.bidder.id}
                            </p>
                          </div>
                        </div>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ChartLegend
          className="mt-4"
          config={{
            amount: {
              label: 'Bid Amount',
              color: 'hsl(var(--primary))',
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
