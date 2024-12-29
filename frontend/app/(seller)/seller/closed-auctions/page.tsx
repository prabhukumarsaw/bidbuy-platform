'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table/index';
import { Column } from '@/components/ui/data-table/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ClosedAuction {
  id: string;
  itemName: string;
  startingPrice: number;
  highestBid: number | null;
  endDate: Date;
  category: string;
  imageUrl: string;
  closeReason: 'no_bids' | 'reserve_not_met' | 'cancelled';
  bidCount: number;
  views: number;
}

const fetchClosedAuctions = async (
  search: string,
  category: string,
  closeReason: string
): Promise<ClosedAuction[]> => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Sample data
  const allData: ClosedAuction[] = [
    {
      id: '1',
      itemName: 'Vintage Camera Collection',
      startingPrice: 500,
      highestBid: 450,
      endDate: new Date('2023-12-10'),
      category: 'Electronics',
      imageUrl: '/placeholder.svg?height=100&width=100',
      closeReason: 'reserve_not_met',
      bidCount: 3,
      views: 120,
    },
    {
      id: '2',
      itemName: 'Rare Stamp Set',
      startingPrice: 1000,
      highestBid: null,
      endDate: new Date('2023-12-12'),
      category: 'Collectibles',
      imageUrl: '/placeholder.svg?height=100&width=100',
      closeReason: 'no_bids',
      bidCount: 0,
      views: 45,
    },
    {
      id: '3',
      itemName: 'Antique Grandfather Clock',
      startingPrice: 2000,
      highestBid: 1800,
      endDate: new Date('2023-12-15'),
      category: 'Furniture',
      imageUrl: '/placeholder.svg?height=100&width=100',
      closeReason: 'reserve_not_met',
      bidCount: 5,
      views: 200,
    },
    {
      id: '4',
      itemName: 'Signed Movie Poster',
      startingPrice: 300,
      highestBid: null,
      endDate: new Date('2023-12-18'),
      category: 'Entertainment',
      imageUrl: '/placeholder.svg?height=100&width=100',
      closeReason: 'cancelled',
      bidCount: 0,
      views: 80,
    },
    {
      id: '5',
      itemName: 'Vintage Vinyl Record Collection',
      startingPrice: 800,
      highestBid: 750,
      endDate: new Date('2023-12-20'),
      category: 'Music',
      imageUrl: '/placeholder.svg?height=100&width=100',
      closeReason: 'reserve_not_met',
      bidCount: 4,
      views: 150,
    },
  ];

  return allData.filter(
    (item) =>
      (search
        ? item.itemName.toLowerCase().includes(search.toLowerCase())
        : true) &&
      (category !== 'all' ? item.category === category : true) &&
      (closeReason !== 'all' ? item.closeReason === closeReason : true)
  );
};

const columns: Column<ClosedAuction>[] = [
  {
    accessorKey: 'itemName',
    header: 'Item Name',
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <img
          src={row.original.imageUrl}
          alt={row.original.itemName}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
        />
        <div className="font-medium text-sm md:text-base">
          {row.original.itemName}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.category}</Badge>
    ),
  },
  {
    accessorKey: 'startingPrice',
    header: 'Starting Price',
    cell: ({ row }) => (
      <div className="text-right font-medium text-sm md:text-base">
        ${row.original.startingPrice.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'highestBid',
    header: 'Highest Bid',
    cell: ({ row }) => (
      <div className="text-right font-medium text-sm md:text-base">
        {row.original.highestBid
          ? `$${row.original.highestBid.toLocaleString()}`
          : 'No bids'}
      </div>
    ),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => (
      <div className="text-center text-sm md:text-base">
        {row.original.endDate.toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: 'closeReason',
    header: 'Close Reason',
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          variant={
            row.original.closeReason === 'no_bids'
              ? 'secondary'
              : row.original.closeReason === 'reserve_not_met'
              ? 'warning'
              : 'destructive'
          }
        >
          {row.original.closeReason === 'no_bids'
            ? 'No Bids'
            : row.original.closeReason === 'reserve_not_met'
            ? 'Reserve Not Met'
            : 'Cancelled'}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'bidCount',
    header: 'Bids',
    cell: ({ row }) => (
      <div className="text-center">{row.original.bidCount}</div>
    ),
  },
  {
    accessorKey: 'views',
    header: 'Views',
    cell: ({ row }) => <div className="text-center">{row.original.views}</div>,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.moreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy auction ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Relist item</DropdownMenuItem>
          <DropdownMenuItem>Edit and relist</DropdownMenuItem>
          <DropdownMenuItem>Archive auction</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Collectibles', label: 'Collectibles' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Music', label: 'Music' },
];

const closeReasonOptions = [
  { value: 'all', label: 'All Reasons' },
  { value: 'no_bids', label: 'No Bids' },
  { value: 'reserve_not_met', label: 'Reserve Not Met' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ClosedAuctionsTable() {
  const [auctionData, setAuctionData] = useState<ClosedAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [closeReasonFilter, setCloseReasonFilter] = useState('all');
  const { toast } = useToast();

  const debouncedSearchValue = useDebounce(searchValue, 300);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchClosedAuctions(
        debouncedSearchValue,
        categoryFilter,
        closeReasonFilter
      );
      setAuctionData(data);
    } catch (error) {
      console.error('Failed to fetch closed auction data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load closed auction data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchValue, categoryFilter, closeReasonFilter, toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, debouncedSearchValue, categoryFilter, closeReasonFilter]);

  const CustomToolbar = useMemo(
    () => (
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search items..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex space-x-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={closeReasonFilter}
            onValueChange={setCloseReasonFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select close reason" />
            </SelectTrigger>
            <SelectContent>
              {closeReasonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    ),
    [searchValue, categoryFilter, closeReasonFilter]
  );

  const renderMobileRow = useCallback(
    (item: ClosedAuction) => (
      <div key={item.id} className="bg-background p-4 rounded-lg shadow mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{item.itemName}</h3>
              <Badge variant="secondary" className="mt-1">
                {item.category}
              </Badge>
            </div>
          </div>
          <Badge
            variant={
              item.closeReason === 'no_bids'
                ? 'secondary'
                : item.closeReason === 'reserve_not_met'
                ? 'warning'
                : 'destructive'
            }
          >
            {item.closeReason === 'no_bids'
              ? 'No Bids'
              : item.closeReason === 'reserve_not_met'
              ? 'Reserve Not Met'
              : 'Cancelled'}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
          <div>Starting Price: ${item.startingPrice.toLocaleString()}</div>
          <div>
            Highest Bid:{' '}
            {item.highestBid
              ? `$${item.highestBid.toLocaleString()}`
              : 'No bids'}
          </div>
          <div>End Date: {item.endDate.toLocaleDateString()}</div>
          <div>Bids: {item.bidCount}</div>
          <div>Views: {item.views}</div>
        </div>
        <div className="mt-4 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
                <Icons.arrowDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Copy auction ID
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Relist item</DropdownMenuItem>
              <DropdownMenuItem>Edit and relist</DropdownMenuItem>
              <DropdownMenuItem>Archive auction</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    ),
    []
  );

  const renderSkeletonLoader = useCallback(
    () => (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-background p-4 rounded-lg shadow animate-pulse"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    ),
    []
  );

  return (
    <Card className="w-full">
      <CardHeader className="sticky top-0 z-10 bg-background">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <span>Closed Auctions</span>
          <Button onClick={fetchData}>
            <Icons.refresh className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {CustomToolbar}
        {loading ? (
          renderSkeletonLoader()
        ) : (
          <>
            <div className="hidden md:block">
              <DataTable
                columns={columns}
                data={auctionData}
                searchable={false}
                pageSize={5}
                pageSizeOptions={[5, 10, 20, 50]}
              />
            </div>
            <div className="md:hidden">{auctionData.map(renderMobileRow)}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
