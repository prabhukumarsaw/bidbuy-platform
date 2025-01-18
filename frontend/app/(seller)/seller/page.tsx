'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from './dashboard/date-range-picker';
import { MainChart } from './dashboard/main-chart';
import { ActiveListings } from './dashboard/active-listings';
import { BidActivity } from './dashboard/bid-activity';
import { MetricCard } from './dashboard/metric-card';
import { RecentTransactions } from './dashboard/recent-transactions';
import { TopBidders } from './dashboard/top-bidders';
import { useQuery } from '@tanstack/react-query';

import { PerformanceOverview } from './dashboard/performance-overview';
import {
  Bell,
  Download,
  DollarSign,
  Package,
  TrendingUp,
  Users,
  BarChart,
  FileText,
} from 'lucide-react';
import { sellerApi } from '@/lib/api/seller';

export default function Dashboard() {
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });

  // const { data: auctions, isLoading } = useQuery({
  //   queryKey: ['auctions'],
  //   queryFn: () =>
  //     sellerApi.getAllAuctions({ status: 'active', page: 1, limit: 10 }),
  // });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => sellerApi.getAllCategories(),
  });

  console.log('all category', categories);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value="$45,231.89"
          description="+20.1% from last month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend="up"
        />
        <MetricCard
          title="Active Listings"
          value="23"
          description="+2 new listings this week"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          trend="up"
        />
        <MetricCard
          title="Total Bids"
          value="1,234"
          description="+15% increase in engagement"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend="up"
        />
        <MetricCard
          title="Unique Bidders"
          value="789"
          description="+5.2% new bidders this month"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend="up"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Overview</CardTitle>
              <CalendarDateRangePicker
                date={selectedDateRange}
                setDate={setSelectedDateRange}
              />
            </div>
          </CardHeader>
          <CardContent>
            <MainChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveListings />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Bidders</CardTitle>
          </CardHeader>
          <CardContent>
            <TopBidders />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Bid Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BidActivity />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceOverview />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <motion.li
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <p className="text-sm">New bid on "Vintage Watch" - $1,500</p>
              </motion.li>
              <motion.li
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <p className="text-sm">
                  "Antique Vase" auction ended - Final price: $950
                </p>
              </motion.li>
              <motion.li
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                <p className="text-sm">
                  Reminder: Update listing for "Rare Coin"
                </p>
              </motion.li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
